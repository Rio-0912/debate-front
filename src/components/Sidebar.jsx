import React, { useEffect, useState } from 'react';
import { Bot, Trash2 } from 'lucide-react';
import axios from 'axios';

const Sidebar = ({ selectedChat, setSelectedChat, onDeleteChat, fetchChatDetails }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchDebates = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:8000/api/debate/getAllDebates/', {
                    headers: {
                        'token': `${token}`
                    }
                });
                
                if (response.data.success) {
                    setChats(response.data.debates);
                } else {
                    console.error('Failed to fetch debates:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching debates:', error);
            }
        };

        fetchDebates();
    }, []);

    return (
        <div className="w-80 border-r border-[#D3C5E5] bg-white shadow-md h-full overflow-y-auto">
            <div className="p-4 border-b border-[#D3C5E5] flex items-center justify-between">
                <h1 className="font-medium text-lg text-gray-700">Your Chats</h1>
            </div>

            {/* Sidebar Chat List */}
            <div className="h-fit">
                {chats.map((chat) => (
                    <div 
                        key={chat._id} 
                        onClick={() => {
                            setSelectedChat(chat._id);
                            fetchChatDetails(chat._id);
                        }}
                        className={`p-4 cursor-pointer transition-colors duration-150
                            ${selectedChat === chat._id ? 'bg-[#D3C5E5]/40' : 'hover:bg-[#D3C5E5]/20'} rounded-lg m-2 flex items-center justify-between`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 shadow-md`}>
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-700">{chat.title}</span>
                                    <span className="text-sm text-gray-600">{new Date(chat.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{chat.topic}</p>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(chat._id);
                            }}
                            className="text-gray-600 hover:text-red-500 ml-4"
                            aria-label="Delete chat"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;