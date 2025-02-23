import React, { useState, useRef, useEffect } from 'react';
import { Clock, Star, Settings, X, Paperclip, Send, Bot, User as UserIcon, Mic, StopCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import NewChatModal from '../components/NewChatModal';
import AudioRecorder from '../components/AudioRecorder';
import axios from 'axios';

import { backend } from '../assets/utils/constants';

import { useAuth } from '../context/AuthContext';
import { Logout } from '@mui/icons-material';
import { io } from "socket.io-client";


const Chat = () => {
  const { logout } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarChats, setSidebarChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const recordingTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backend}/api/debate/getAllDebates/`, {
          headers: {
            'token': `${token}` // Pass the token in the header
          }
        });

        if (response.data.success) {
          const sortedDebates = response.data.debates.sort((a, b) =>
            new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
          );

          setSidebarChats(sortedDebates);
        } else {
          console.error('Failed to fetch debates:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching debates:', error);
      }
    };

    fetchDebates();
  }, []);


  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const globalSocket = useRef(null);
  const messageContainerRef = useRef(null);

  // Add new function to check if scroll is at bottom
  const isScrolledToBottom = () => {
    if (!messageContainerRef.current) return true;
    const { scrollHeight, scrollTop, clientHeight } = messageContainerRef.current;
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
  };

  // Updated scroll function
  const scrollToBottom = (force = false) => {
    if (force || isScrolledToBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchDebates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:8000/api/debate/getAllDebates/', {
        headers: {
          'token': `${token}`
        }
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
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newGlobalSocket = io("ws://localhost:8000", {
      withCredentials: true,
      extraHeaders: {
        'token': token
      }
    });

    newGlobalSocket.on("connect", () => {
      console.log("Connected to global socket");
    });

    newGlobalSocket.on("chatCreated", () => {
      console.log("New chat created, refreshing list");
      fetchDebates();
    });

    newGlobalSocket.on("chatUpdated", () => {
      console.log("Chat updated, refreshing list");
      fetchDebates();
    });

    newGlobalSocket.on("chatDeleted", () => {
      console.log("Chat deleted, refreshing list");
      fetchDebates();
    });

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
      const token = localStorage.getItem("token");
      const newSocket = io("ws://localhost:8000", {
        withCredentials: true,
        extraHeaders: {
          'token': token
        }
      });

      newSocket.emit('join', selectedChat);

      newSocket.on("messages", (updatedStream) => {
        console.log(updatedStream)
        setMessages(updatedStream);
        // Scroll to bottom after messages update
        setTimeout(() => scrollToBottom(), 100);
      });

      newSocket.on("typing", () => {
        setIsTyping(true);
      });

      newSocket.on("stopTyping", () => {
        setIsTyping(false);
      });

      newSocket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [selectedChat]);

  // Add effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedChat) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { debateId: selectedChat });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stopTyping', { debateId: selectedChat });
    }, 1000);
  };

  const handleSendMessage = (content) => {
    if (!socket || !selectedChat || !content.trim()) return;
    const response = axios.get(`http://localhost:8000/api/debate/getDebate/${selectedChat}`, {
      headers: { 'token': localStorage.getItem('token') }
    }).then(response => {
      const message = {
        debateId: selectedChat,
        msg: content.replace(/\n/g, "<br>"),
        mood: response.data.debate.mood,
        topic: response.data.debate.topic,
        stand: response.data.debate.aiInclination
      };
      console.log(message);
      socket.emit("debateMessage", { message });
      setNewMessage('');
      scrollToBottom(true);

      globalSocket.current?.emit("chatUpdated");
    }).catch(error => {
      console.error('Error fetching debate details:', error);
    });
  };

  const fetchChatDetails = async (chatId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${backend}/api/debate/getDebate/${chatId}`, {
        headers: {
          'token': `${token}` // Pass the token in the header
        }
      });

      if (response.data.success) {
        setMessages(response.data.debate.stream);
        setTimeout(() => scrollToBottom(true), 100);
      }
    } catch (error) {
      console.error('Error fetching chat details:', error);
    }
  };

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
      const response = await axios.delete(`http://localhost:8000/api/debate/delete/${chatId}`, {
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

  // Function to handle recognized text
  const handleTextRecognized = (recognizedText) => {
    console.log("Recognized Text:", recognizedText);
    // You can also update the state or perform other actions with the recognized text here
    setNewMessage(recognizedText);
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
        <div className="p-4 border-b border-[#D3C5E5] flex justify-between items-center bg-white">
          <h2 className="font-medium text-gray-800">
            {selectedChat ? sidebarChats.find(chat => chat._id === selectedChat)?.title : 'Select a Chat'}
          </h2>
          <div className="flex items-center space-x-4">
            <Logout
              className="w-5 h-5 text-gray-800 cursor-pointer hover:text-gray-800/80 transition-colors"
              onClick={logout}
            />
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="flex items-center p-2 bg-[#D3C5E5] text-gray-800 rounded-lg hover:bg-[#D3C5E5]/90 transition-colors"
            >
              Create New Debate
            </button>
            <button
              className={`flex items-center p-2 rounded-lg transition-colors ${isListening ? 'bg-red-200' : 'bg-[#D3C5E5]'} hover:bg-[#D3C5E5]/90`}
            >
              <AudioRecorder onTextRecognized={handleTextRecognized} />
            </button>
          </div>
        </div>

        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-[#F8F8F8]"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >

              <div
                className={`max-w-xl rounded-2xl p-3 m-2 shadow-sm
    ${message.sender === 'User' ? 'bg-[#D3C5E5] text-gray-800' : 'bg-white text-gray-800'}`}
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
          {isTyping && (
            <div className="text-sm text-gray-500 italic">
              Someone is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

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
              placeholder="Type your message... (Shift + Enter for new line)"
              className="flex-1 p-2 rounded-xl border border-[#D3C5E5] placeholder-[#D3C5E5]/70 focus:outline-none focus:ring-2 focus:ring-[#D3C5E5] resize-none"
              rows="2"
            />
            <button
              onClick={() => handleSendMessage(newMessage)}
              className="p-2 rounded-xl bg-[#D3C5E5] text-gray-800 hover:bg-[#D3C5E5]/90 transition-colors"
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
    </div>
  );
};

export default Chat;