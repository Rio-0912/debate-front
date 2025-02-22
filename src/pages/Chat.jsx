import React, { useState, useRef, useEffect } from 'react';
import { Clock, Star, Settings, X, Paperclip, Send, Bot, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import NewChatModal from '../components/NewChatModal';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "Luis Easton",
      avatar: <Bot/>,
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
      avatar: <Bot/>,
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
      avatar: <Bot/>,
      content: "Thank you so much for your help!",
      time: "20m",
      type: "received"
    }
  ]);

  const sidebarChats = [
    {
      id: 1,
      author: "Luis Easton",
      avatar: <Bot/>,
      preview: "Thank you for your...",
      time: "20m",
      bgColor: "bg-purple-400"
    },
    {
      id: 2,
      author: "Eric · Whitewings",
      avatar: "E",
      preview: "Let me look that up...",
      time: "25m",
      bgColor: "bg-yellow-400"
    },
    {
      id: 3,
      author: "Carlos · Clippers Co",
      avatar: "C",
      preview: "#8742 · Signup fix",
      subPreview: "Let me look that up...",
      time: "30m",
      bgColor: "bg-gray-900"
    },
    {
      id: 4,
      author: "Ana Suarez",
      avatar: "A",
      preview: "Signup question",
      subPreview: "Preview....",
      time: "1h",
      bgColor: "bg-red-400"
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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        content: newMessage,
        time: 'now',
        type: 'sent',
        seen: false
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
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
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar chats={sidebarChats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} onDeleteChat={handleDeleteChat} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="font-medium">Luis Easton</h2>
          <div className="flex items-center space-x-4">
            <Star className="w-5 h-5 text-gray-600 cursor-pointer hover:text-yellow-400 transition-colors" />
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors" />
            <button 
              onClick={() => setIsNewChatModalOpen(true)}
              className="flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <span>Create New Chat</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'received' && (
                <div className="w-8 h-8 rounded-xl bg-purple-400 flex items-center justify-center text-white mr-2 shadow-sm">
                  {message.avatar}
                </div>
              )}
              <div 
                className={`max-w-xl rounded-2xl p-3 shadow-sm
                  ${message.type === 'sent' 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100'
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
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for User Profile */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* Modal for New Chat */}
      <NewChatModal isOpen={isNewChatModalOpen} onClose={() => setIsNewChatModalOpen(false)} />
    </div>
  );
};

export default Chat;