import React, { useState, useRef, useEffect } from 'react';
import { Clock, Star, Settings, X, Paperclip, Send, Bot, User as UserIcon, Mic, StopCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import NewChatModal from '../components/NewChatModal';
import AudioRecorder from '../components/AudioRecorder';
import axios from 'axios';
import { backend } from '../assets/utils/constants';


const Chat = () => {
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
          setSidebarChats(response.data.debates); // Set the fetched debates to sidebarChats state
        } else {
          console.error('Failed to fetch debates:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching debates:', error);
      }
    };

    fetchDebates();
  }, []); // Fetch debates on component mount

  useEffect(() => {
    if (selectedChat) {
      const chat = sidebarChats.find(chat => chat._id === selectedChat);
      if (chat) {
        setMessages(chat.stream); // Set messages based on the selected chat's stream
      }
    }
  }, [selectedChat, sidebarChats]); // Update messages when selectedChat or sidebarChats change

  useEffect(() => {
    recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      if (event.results[0].isFinal) {
        handleSendMessage(transcript);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognitionRef.current = null;
    };
  }, []);

  const handleSendMessage = (content) => {
    const newMsg = {
      id: messages.length + 1,
      content,
      time: 'now',
      type: 'sent',
      seen: false
    };
    setMessages([...messages, newMsg]);
    respondToUser(content);
    setNewMessage('');
  };

  const respondToUser = (userMessage) => {
    const botResponse = `You said: ${userMessage}. `;
    const newMsg = {
      id: messages.length + 2,
      content: botResponse,
      time: 'now',
      type: 'received',
      seen: true
    };
    setMessages(prevMessages => [...prevMessages, newMsg]);
    speak(botResponse);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'recording.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setAudioChunks([]);
    };

    recorder.start();
    recordingTimeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 30000);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    clearTimeout(recordingTimeoutRef.current);
    setIsListening(false);
  };

  const handleVoiceDebate = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
      toggleListening();
    }
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = sidebarChats.filter(chat => chat._id !== chatId);
    setSidebarChats(updatedChats);

    if (selectedChat === chatId) {
      setSelectedChat(updatedChats.length > 0 ? updatedChats[0]._id : null);
      setMessages([]);
    }
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
        const chat = response.data.debate; // Assuming the response contains the full chat object
        setMessages(chat.stream); // Set messages based on the chat's stream
      } else {
        console.error('Failed to fetch chat details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching chat details:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to open the New Chat Modal
  const openNewChatModal = () => {
    setIsNewChatModalOpen(true);
  };

  const handleCreateChat = (newChatData) => {
    // Assuming newChatData is the chat object returned from the backend
    setSidebarChats((prevChats) => [...prevChats, newChatData]); // Append the new chat to the sidebarChats state
  };

  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      {/* Sidebar */}
      <Sidebar chats={sidebarChats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} onDeleteChat={handleDeleteChat} fetchChatDetails={fetchChatDetails} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#D3C5E5] flex justify-between items-center bg-white">
          <h2 className="font-medium text-gray-800">{selectedChat ? sidebarChats.find(chat => chat._id === selectedChat)?.title : 'Select a Chat'}</h2>
          <div className="flex items-center space-x-4">
            <Star className="w-5 h-5 text-gray-800 cursor-pointer hover:text-gray-800/80 transition-colors" />
            <Settings className="w-5 h-5 text-gray-800 cursor-pointer hover:text-gray-800/80 transition-colors" />
            <button
              onClick={openNewChatModal}
              className="flex items-center p-2 bg-[#D3C5E5] text-gray-800 rounded-lg hover:bg-[#D3C5E5]/90 transition-colors"
            >
              <span>Create New Chat</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center p-2 bg-[#D3C5E5] text-gray-800 rounded-lg hover:bg-[#D3C5E5]/90 transition-colors"
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <button
          className={`flex items-center p-2 rounded-lg transition-colors ${isListening ? 'bg-red-200' : 'bg-[#D3C5E5]'} hover:bg-[#D3C5E5]/90`}
              // onClick={handleVoiceDebate}
            >
              <AudioRecorder/>
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#F8F8F8]">
          {messages.map((message) => (
            
            <div
              key={message._id}
              className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'AI' && (
                <div className="h-fit p-2 rounded-xl bg-[#f0f0f0] flex items-center justify-center text-gray-800 mr-2 shadow-sm">
                  <Bot />
                </div>
              ) }

              <div
                className={`max-w-xl rounded-2xl p-3 m-2 shadow-sm
                  ${message.sender === 'User'
                    ? 'bg-[#D3C5E5] text-gray-800'
                    : 'bg-white text-gray-800'
                  }`}
              >
                {message.isFile ? (
                  <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <Paperclip className="w-4 h-4" />
                    
                    <span>{message.content}</span>
                  </div>
                ) : (
                  <>
                    {console.log(message)
            }
                    <p className=''>{message.message}</p>
                  </>
                )}
                <span className="text-xs text-gray-600">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Area */}
        <div className="p-4 bg-white border-t border-[#D3C5E5]">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-xl border border-[#D3C5E5] placeholder-[#D3C5E5]/70 focus:outline-none focus:ring-2 focus:ring-[#D3C5E5]"
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

      {/* Modals */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {isNewChatModalOpen && (
        <NewChatModal isOpen={isNewChatModalOpen} onClose={() => setIsNewChatModalOpen(false)} onCreateChat={handleCreateChat} />
      )}

    </div>
  );
};

export default Chat;