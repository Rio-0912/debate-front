import React, { useState } from 'react';
import axios from 'axios';
import {
    MenuItem, Select, InputLabel, FormControl, Chip, OutlinedInput,
    Slider, IconButton, Box, Typography, Button
} from '@mui/material';
import { Close, Psychology, Group, FormatQuote, TagFaces, Send, Whatshot, Shield, HelpOutline, Tag } from '@mui/icons-material';
import { Gavel } from 'lucide-react';
import { backend } from '../assets/utils/constants';

// Create an axios instance with default config
const api = axios.create({
    withCredentials: true,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'token': `${localStorage.getItem('token')}`
    }
});

const NewChatModal = ({ isOpen, onClose, onCreateChat }) => {
    const [debateTopic, setDebateTopic] = useState('');
    const [position, setPosition] = useState('');
    const [chatNature, setChatNature] = useState([]);

    const natureOptions = [
        { label: 'Passionate', icon: <Whatshot fontSize="small" />, color: '#D32F2F' },
        { label: 'Aggressive', icon: <Gavel fontSize="small" />, color: '#C62828' },
        { label: 'Defensive', icon: <Shield fontSize="small" />, color: '#1976D2' },
        { label: 'Skeptical', icon: <HelpOutline fontSize="small" />, color: '#FFA000' },
        { label: 'Thoughtful', icon: <Psychology fontSize="small" />, color: '#7B1FA2' },
        { label: 'Collaborative', icon: <Group fontSize="small" />, color: '#388E3C' },
        { label: 'Playful', icon: <TagFaces fontSize="small" />, color: '#FBC02D' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        

        try {
            const data = {
                mood: chatNature,
                topic: debateTopic,
                aiInclination: position
            };
            console.log('Sending data:', data);

            const response = await api.post(`${backend}/api/debate/create`, data, { 
                withCredentials: true,
               
            });
            onCreateChat(response.data);
            onClose();
        } catch (error) {
            console.error('Error creating new chat:', error.response || error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1d1d1da8] bg-opacity-90 backdrop-blur-sm transition-all">
            {/* Your existing JSX remains the same */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
                <IconButton
                    onClick={() => {
                        onClose();
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    <Close />
                </IconButton>

                <div className="text-center mb-6">
                    <Psychology className="text-4xl text-purple-500 mb-2" />
                    <Typography variant="h5" className="font-bold text-gray-900">
                        Craft Your Debate
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                        Shape the perfect intellectual showdown
                    </Typography>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Debate Topic */}
                        <div>
                            <Typography variant="body2" className="text-gray-700 mb-1">
                                Debate Topic <span className="text-purple-500">*</span>
                            </Typography>
                            <input
                                value={debateTopic}
                                onChange={(e) => setDebateTopic(e.target.value)}
                                className="w-full bg-gray-100 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="Enter debate topic..."
                                required
                            />
                        </div>

                        {/* Position Select */}
                        <div>
                            <Typography variant="body2" className="text-gray-700 mb-1">
                                AI Inclination <span className="text-purple-500">*</span>
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="text-gray-900 bg-gray-100 rounded-lg"
                                    required
                                >
                                    <MenuItem value="For" className="text-green-600">For</MenuItem>
                                    <MenuItem value="Against" className="text-red-600">Against</MenuItem>
                                    <MenuItem value="Neutral" className="text-gray-600">Neutral</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Chat Nature Multi-Select */}
                        <div>
                            <label className="text-sm text-gray-700 mb-1 block">
                                Debate Style <span className="text-purple-500">*</span>
                            </label>
                            <Select
                                multiple
                                value={chatNature}
                                onChange={(e) => setChatNature(e.target.value)}
                                input={<OutlinedInput />}
                                renderValue={(selected) => (
                                    <div className="flex flex-wrap gap-1">
                                        {selected.map((value) => {
                                            const option = natureOptions.find(opt => opt.label === value);
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size="small"
                                                    className="text-white"
                                                    style={{ backgroundColor: option?.color }}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                                className="w-full bg-gray-100"
                            >
                                {natureOptions.map((option) => (
                                    <MenuItem key={option.label} value={option.label} className="flex items-center gap-2">
                                        {option.icon}
                                        <span>{option.label}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className="bg-purple-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition-transform"
                            endIcon={<Send />}
                        >
                            Launch Debate
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewChatModal;