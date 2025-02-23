import React from 'react';
import { Clock, MessageSquare, Plus, Trash2 } from 'lucide-react';

const Sidebar = ({ chats, selectedChat, setSelectedChat, onDeleteChat, fetchChatDetails }) => {
    const handleChatClick = async (chatId) => {
        setSelectedChat(chatId);
        await fetchChatDetails(chatId);
    };

    return (
        <div className="w-80 bg-white border-r border-[#D3C5E5] flex flex-col h-full">
            <div className="p-4 border-b border-[#D3C5E5]">
                <h1 className="text-xl font-semibold text-gray-800">Debates</h1>
            </div>

            <div className="flex-1 overflow-y-auto">
                {chats && chats.map((chat) => (
                    <div
                        key={chat._id}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b border-[#D3C5E5] ${selectedChat === chat._id ? 'bg-[#D3C5E5]/20' : ''
                            }`}
                        onClick={() => handleChatClick(chat._id)}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-800 truncate">{chat.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <MessageSquare className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-500">
                                        {chat.stream.length ? chat.stream.length : 0} messages
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(chat._id);
                                }}
                                className="p-1 hover:bg-red-50 rounded-full group"
                            >
                                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                            </button>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {chat.mood?.map((mood, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs rounded-full bg-[#D3C5E5]/30 text-gray-700"
                                >
                                    {mood}
                                </span>
                            ))}
                            <span className={`px-2 py-1 text-xs rounded-full ${chat.aiInclination === 'For'
                                ? 'bg-green-100 text-green-700'
                                : chat.aiInclination === 'Against'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                {chat.aiInclination}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>
                                {new Date(chat.updatedAt).toLocaleDateString()} {new Date(chat.updatedAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;