import React from 'react';
import { Bot, Trash2 } from 'lucide-react';

const Sidebar = ({ chats, selectedChat, setSelectedChat, onDeleteChat }) => {
    return (
        <div className="w-80 border-r border-gray-200 bg-white shadow-md">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h1 className="font-medium text-lg text-gray-900">Your Chats</h1>
            </div>

            {/* Sidebar Chat List */}
            <div className="overflow-y-auto">
                {chats.map((chat) => (
                    <div 
                        key={chat.id} 
                        onClick={() => setSelectedChat(chat.id)}
                        className={`p-4 cursor-pointer transition-colors duration-150
                            ${selectedChat === chat.id ? 'bg-blue-50' : 'hover:bg-gray-100'} rounded-lg flex items-center justify-between`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full ${chat.bgColor} flex items-center justify-center text-white shadow-md`}>
                                {chat.avatar}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-900">{chat.author}</span>
                                    <span className="text-sm text-gray-500">{chat.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{chat.preview}</p>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the chat selection
                                onDeleteChat(chat.id); // Call the delete function
                            }}
                            className="text-gray-500 hover:text-red-500 ml-4"
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
