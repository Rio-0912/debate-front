import React, { useState, useRef, useEffect } from 'react';
import { Clock, Star, Settings, X, Paperclip, Send, Bot, User, Mic, StopCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import NewChatModal from '../components/NewChatModal';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { user, loading, logout } = useAuth();
  console.log(user.user);

  const [selectedChat, setSelectedChat] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "Luis Easton",
      avatar: <Bot />,
      content: "Can you please help me with an insurance claim?",
      time: "10m",
      type: "received"
    },
    {
      id: 2,
      content: "Hi Luis 👋 Happy to help! Can you please share with me a proof of payment?",
      time: "11m",
      type: "sent",
      seen: true
    },
    {
      id: 3,
      author: "Luis Easton",
      avatar: <Bot />,
      content: "proof_of_payment.pdf - 1.04 MB",
      time: "15m",
      type: "received",
      isFile: true
    },
    {
      id: 4,
      content: "Perfect! I will review the details to confirm that the vendor is one of our partners and get back to you.",
      time: "16m",
      type: "sent",
      seen: true
    },
    {
      id: 5,
      author: "Luis Easton",
      avatar: <Bot />,
      content: "Thank you so much for your help!",
      time: "20m",
      type: "received"
    }
  ]);

  const sidebarChats = [
    {
      id: 1,
      author: "Luis Easton",
      avatar: <Bot />,
      preview: "Thank you for your...",
      time: "20m",
      bgColor: "#D3C5E5"
    },
    {
      id: 2,
      author: "Eric · Whitewings",
      avatar: "E",
      preview: "Let me look that up...",
      time: "25m",
      bgColor: "#D3C5E5"
    },
    {
      id: 3,
      author: "Carlos · Clippers Co",
      avatar: "C",
      preview: "#8742 · Signup fix",
      subPreview: "Let me look that up...",
      time: "30m",
      bgColor: "#D3C5E5"
    },
    {
      id: 4,
      author: "Ana Suarez",
      avatar: "A",
      preview: "Signup question",
      subPreview: "Preview....",
      time: "1h",
      bgColor: "#D3C5E5"
    },
    {
      id: 5,
      author: "Global login issue",
      preview: "#8741 · All users",
      subPreview: "Investigating a fix",
      time: "2h",
      isSystem: true
    }
  ];

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
    const updatedChats = sidebarChats.filter(chat => chat.id !== chatId);
    setSidebarChats(updatedChats);

    if (selectedChat === chatId) {
      setSelectedChat(updatedChats.length > 0 ? updatedChats[0].id : null);
      setMessages([]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      {/* Sidebar */}
      <Sidebar chats={sidebarChats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} onDeleteChat={handleDeleteChat} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#bg-gray-50] flex justify-between items-center bg-white">
          <h2 className="font-medium text-gray-800">Luis Easton</h2>
          <div className="flex items-center space-x-4">
            <Star className="w-5 h-5 text-gray-800 cursor-pointer hover:text-gray-800/80 transition-colors" />
            <Settings className="w-5 h-5 text-gray-800 cursor-pointer hover:text-gray-800/80 transition-colors" onClick={logout} />
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="flex items-center p-2 bg-[#D3C5E5] text-gray-800 rounded-lg hover:bg-[#D3C5E5]/90 transition-colors"
            >
              <span>Create New Chat</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center p-2 bg-[#D3C5E5] text-gray-800 rounded-lg hover:bg-[#D3C5E5]/90 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={handleVoiceDebate}
              className={`flex items-center p-2 rounded-lg transition-colors ${isListening ? 'bg-red-200' : 'bg-[#D3C5E5]'} hover:bg-[#D3C5E5]/90`}
            >
              {isListening ? <StopCircle className="w-5 h-5 text-red-600" /> : <Mic className="w-5 h-5 text-gray-800" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F8F8]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'received' && (
                <div className="w-8 h-8 rounded-xl bg-[#D3C5E5] flex items-center justify-center text-gray-800 mr-2 shadow-sm">
                  <Bot />
                </div>
              )}
              <div
                className={`max-w-xl rounded-2xl p-3 shadow-sm
                  ${message.type === 'sent'
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
                  <p>{message.content}</p>
                )}
                <span className="text-xs text-gray-00">{message.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
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
      <NewChatModal isOpen={isNewChatModalOpen} onClose={() => setIsNewChatModalOpen(false)} />
    </div>
  );
};

export default Chat;