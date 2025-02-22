import React, { useState } from 'react';
import { Bot } from 'lucide-react';

const Sidebar = () => {
    const sidebarChats = [
        {
            id: 1,
            author: "Luis Easton",
            avatar: "L",
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
    const [selectedChat, setSelectedChat] = useState(1);

    return (
        <div className="w-80 border-r border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="font-medium text-gray-900">Your Inbox</h1>
            </div>

            {/* Sidebar Chat List */}
            <div className="overflow-y-auto">
                {sidebarChats.map((chat) => (
                    <div 
                        key={chat.id} 
                        onClick={() => setSelectedChat(chat.id)}
                        className={`p-4 cursor-pointer transition-colors duration-150
                            ${selectedChat === chat.id ? 'bg-blue-50' : 'hover:bg-gray-100'} rounded-lg`}
                    >
                        <div className="flex items-center space-x-3">
                            {chat.isSystem ? (
                                <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-gray-400 rounded-md" />
                                </div>
                            ) : (
                                <div className={`w-8 h-8 rounded-xl ${chat.bgColor} flex items-center justify-center text-white shadow-md`}>
                                    <Bot />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-900">{chat.author}</span>
                                    <span className="text-sm text-gray-500">{chat.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{chat.preview}</p>
                                {chat.subPreview && (
                                    <p className="text-sm text-gray-500 truncate">{chat.subPreview}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
