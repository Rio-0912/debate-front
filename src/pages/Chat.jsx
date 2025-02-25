import React, { useState, useRef, useEffect } from 'react';
import { Clock, Star, Settings, X, Paperclip, Send, Bot, User as UserIcon, Mic, StopCircle, User } from 'lucide-react';
import { AccountCircle, Logout } from '@mui/icons-material';
import { io } from "socket.io-client";
import axios from 'axios';

import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import NewChatModal from '../components/NewChatModal';
import AudioRecorder from '../components/AudioRecorder';
import { useAuth } from '../context/AuthContext';
import { backend } from '../assets/utils/constants';
import AiTypingMessage from '../components/AiTypingMessage';

const Chat = () => {
  // State management
  const { logout } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarChats, setSidebarChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [socketError, setSocketError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAiMessage, setPendingAiMessage] = useState(null);
  const [isMessageComplete, setIsMessageComplete] = useState(true);
  const [userModal, setUserModal] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const globalSocket = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // Socket initialization
  const initializeSocket = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const newSocket = io(backend, {
      withCredentials: true,
      extraHeaders: { 'token': token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setupSocketListeners(newSocket);
    return newSocket;
  };

  const setupSocketListeners = (socket) => {
    socket.on("connect", () => {
      setConnectionStatus('connected');
      setSocketError(null);
      console.log("Connected to socket");

      if (selectedChat) {
        socket.emit('join', selectedChat);
      }
    });

    socket.on("connect_error", (error) => {
      setConnectionStatus('error');
      setSocketError(error.message);
      console.error("Socket connection error:", error);
    });

    socket.on("messages", (updatedStream) => {
      if (updatedStream.length > messages.length && updatedStream[updatedStream.length - 1].sender !== 'User') {
        const newMessage = updatedStream[updatedStream.length - 1];
        setPendingAiMessage(newMessage);
        setIsMessageComplete(false);
      } else {
        setMessages(updatedStream);
      }
      setTimeout(() => scrollToBottom(), 100);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));

    socket.on("messageFailed", (error) => {
      setMessages(prev => prev.filter(msg => !msg.pending));
      alert("Failed to send message: " + error.message);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      setSocketError(error);
    });
  };

  // Scroll management
  const isScrolledToBottom = () => {
    if (!messageContainerRef.current) return true;
    const { scrollHeight, scrollTop, clientHeight } = messageContainerRef.current;
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
  };

  const scrollToBottom = (force = false) => {
    if (force || isScrolledToBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Data fetching
  const fetchDebates = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backend}/api/debate/getAllDebates/`, {
        headers: { 'token': token }
      });

      if (response.data.success) {
        const sortedDebates = response.data.debates.sort((a, b) => {
          const timestampA = a.timestamp || a.createdAt || 0;
          const timestampB = b.timestamp || b.createdAt || 0;
          return new Date(timestampB) - new Date(timestampA);
        });

        setSidebarChats(sortedDebates);

        if (sortedDebates.length > 0 && !selectedChat) {
          const firstChatId = sortedDebates[0]._id;
          setSelectedChat(firstChatId);
          fetchChatDetails(firstChatId);
        }
      }
    } catch (error) {
      console.error('Error fetching debates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatDetails = async (chatId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backend}/api/debate/getDebate/${chatId}`, {
        headers: { 'token': token }
      });

      if (response.data.success) {
        setMessages(response.data.debate.stream);
        setTimeout(() => scrollToBottom(true), 100);
      }
    } catch (error) {
      console.error('Error fetching chat details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Message handling
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedChat) return;

    if (!isTyping) {
      socket.emit('typing', { debateId: selectedChat });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { debateId: selectedChat });
    }, 1000);
  };

  const handleSendMessage = async (content) => {
    if (!socket || !selectedChat || !content.trim()) return;

    try {
      const optimisticMessage = {
        sender: 'User',
        message: content.replace(/\n/g, "<br>"),
        timestamp: new Date().toISOString(),
        pending: true
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      scrollToBottom(true);

      const response = await axios.get(`${backend}/api/debate/getDebate/${selectedChat}`, {
        headers: { 'token': localStorage.getItem('token') }
      });

      const message = {
        debateId: selectedChat,
        msg: content.replace(/\n/g, "<br>"),
        mood: response.data.debate.mood,
        topic: response.data.debate.topic,
        stand: response.data.debate.aiInclination
      };

      socket.emit("debateMessage", { message });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => !msg.pending));
      alert("Failed to send message. Please try again.");
    }
  };

  // Chat management
  const handleCreateChat = async (newChat) => {
    setSidebarChats(prev => [...prev, { ...newChat, stream: newChat.stream || [] }]);
    globalSocket.current?.emit("chatCreated");
  };

  const handleDeleteChat = async (chatId) => {
    if (!chatId) return;

    const res = confirm("Are you sure you want to delete this chat?");
    if (!res) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${backend}/api/debate/delete/${chatId}`, {
        headers: { 'token': token }
      });

      if (response.data.success) {
        setSidebarChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
        if (selectedChat === chatId) {
          setSelectedChat(null);
          setMessages([]);
        }
        globalSocket.current?.emit("chatDeleted");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // Effects
  useEffect(() => {
    const token = localStorage.getItem("token");
    const newGlobalSocket = io(backend, {
      withCredentials: true,
      extraHeaders: { 'token': token }
    });

    newGlobalSocket.on("connect", () => {
      console.log("Connected to global socket");
    });

    newGlobalSocket.on("chatCreated", fetchDebates);
    newGlobalSocket.on("chatUpdated", fetchDebates);
    newGlobalSocket.on("chatDeleted", fetchDebates);

    globalSocket.current = newGlobalSocket;
    fetchDebates();

    return () => {
      if (globalSocket.current) {
        globalSocket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const newSocket = initializeSocket();
      setSocket(newSocket);

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  const openModal = () => {
    setUserModal(true);
  };

  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      <Sidebar
        chats={sidebarChats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        onDeleteChat={handleDeleteChat}
        fetchChatDetails={fetchChatDetails}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#D3C5E5] flex justify-between items-center bg-white">
          <h2 className="font-medium text-gray-800">
            {selectedChat ? sidebarChats.find(chat => chat._id === selectedChat)?.title : 'Select a Chat'}
          </h2>
          <div className="flex items-center space-x-4">
            {connectionStatus === 'error' && (
              <span className="text-red-500 text-sm">Connection error</span>
            )}
            <Logout
              className="w-5 h-5 text-gray-800 cursor-pointer hover:text-gray-800/80 transition-colors"
              onClick={logout}
            />
            <AccountCircle
              className="w-5 h-5 text-gray-800 cursor-pointer hover:text-gray-800/80 transition-colors"
              onClick={openModal}
            />
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="flex items-center p-2 bg-[#D3C5E5] text-gray-800 rounded-lg hover:bg-[#D3C5E5]/90 transition-colors"
            >
              Create New Debate
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-[#F8F8F8]"
        >
          {!selectedChat ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-lg">Please select a chat to start messaging</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D3C5E5]"></div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl rounded-2xl p-3 m-2 shadow-sm ${message.pending ? 'opacity-50' : ''
                      } ${message.sender === 'User' ? 'bg-[#D3C5E5] text-gray-800' : 'bg-white text-gray-800'
                      }`}
                  >
                    <p dangerouslySetInnerHTML={{ __html: message.message.replace(/\n/g, "<br>") }} />
                    <span className="text-xs text-gray-600">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {!isMessageComplete && pendingAiMessage && (
                <AiTypingMessage
                  message={pendingAiMessage.message}
                  onComplete={() => {
                    setIsMessageComplete(true);
                    setMessages(prev => [...prev, pendingAiMessage]);
                    setPendingAiMessage(null);
                  }}
                />
              )}
              {isTyping && (
                <div className="text-sm text-gray-500 italic">
                  Someone is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        {/* Input */}
        <div className="p-4 bg-white border-t border-[#D3C5E5]">
          <div className="flex items-center space-x-2">
            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(newMessage);
                }
              }}
              disabled={!selectedChat || connectionStatus === 'error'}
              placeholder="Type your message... (Shift + Enter for new line)"
              className="flex-1 p-2 rounded-xl border border-[#D3C5E5] placeholder-[#D3C5E5]/70 focus:outline-none focus:ring-2 focus:ring-[#D3C5E5] resize-none"
              rows="2"
            />
            <button
              onClick={() => handleSendMessage(newMessage)}
              disabled={!selectedChat || connectionStatus === 'error'}
              className="p-2 rounded-xl bg-[#D3C5E5] text-gray-800 hover:bg-[#D3C5E5]/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {isNewChatModalOpen && (
        <NewChatModal
          isOpen={isNewChatModalOpen}
          onClose={() => setIsNewChatModalOpen(false)}
          onCreateChat={handleCreateChat}
        />
      )}
      {userModal && (
        <Modal
          isOpen={userModal}
          onClose={() => setUserModal(false)}
        />
      )}
    </div>
  );
};

export default Chat;