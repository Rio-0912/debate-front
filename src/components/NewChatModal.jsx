import React, { useState } from 'react';
import axios from 'axios';
import { 
  MenuItem, Select, InputLabel, FormControl, Chip, OutlinedInput, 
  Slider, IconButton, Box, Typography, Button
} from '@mui/material';
import { Close, Psychology, Group, FormatQuote, TagFaces, Send } from '@mui/icons-material';

const NewChatModal = ({ isOpen, onClose, onCreateChat }) => {
    const [debateTopic, setDebateTopic] = useState('');
    const [position, setPosition] = useState('');
    const [famousDebater, setFamousDebater] = useState('');
    const [chatNature, setChatNature] = useState([]);
    const [aggressionLevel, setAggressionLevel] = useState(3);

    const natureOptions = [
        { label: 'Roasting', icon: <TagFaces fontSize="small" />, color: '#D32F2F' },
        { label: 'Oxford Style', icon: <FormatQuote fontSize="small" />, color: '#388E3C' },
        { label: 'References', icon: <Psychology fontSize="small" />, color: '#1976D2' },
        { label: 'Formal', icon: <Group fontSize="small" />, color: '#7B1FA2' },
        { label: 'Informal', icon: <TagFaces fontSize="small" />, color: '#FBC02D' }
    ];

    const famousDebaters = [
        { name: 'Christopher Hitchens', style: 'Philosophical', expertise: 'Religion' },
        { name: 'Debbie Wasserman Schultz', style: 'Political', expertise: 'Policy' },
        { name: 'Jordan Peterson', style: 'Psychological', expertise: 'Culture' },
        { name: 'Ben Shapiro', style: 'Fast-paced', expertise: 'Politics' },
        { name: 'Sam Harris', style: 'Scientific', expertise: 'Ethics' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/chat/new', {
                debateTopic,
                position,
                famousDebater,
                aggressionLevel,
                chatNature
            }, { withCredentials: true });
            console.log('New chat created:', response.data);
            onCreateChat(response.data);
            onClose();
        } catch (error) {
            console.error('Error creating new chat:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1d1d1da8] bg-opacity-90 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
                <IconButton 
                    onClick={onClose}
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
                                Your Position <span className="text-purple-500">*</span>
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="text-gray-900 bg-gray-100 rounded-lg"
                                    required
                                >
                                    <MenuItem value="Pro" className="text-green-600">Pro Team</MenuItem>
                                    <MenuItem value="Opposition" className="text-red-600">Opposition Team</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Famous Debater Select */}
                        <div>
                            <Typography variant="body2" className="text-gray-700 mb-1">
                                Choose Your Champion <span className="text-purple-500">*</span>
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={famousDebater}
                                    onChange={(e) => setFamousDebater(e.target.value)}
                                    className="text-gray-900 bg-gray-100 rounded-lg"
                                    required
                                >
                                    {famousDebaters.map((debater) => (
                                        <MenuItem 
                                            key={debater.name} 
                                            value={debater.name}
                                            className="flex justify-between items-center"
                                        >
                                            <div>
                                                <div className="text-gray-900">{debater.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {debater.style} • {debater.expertise}
                                                </div>
                                            </div>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Chat Nature Multi-Select */}
                        <div>
                            <Typography variant="body2" className="text-gray-700 mb-1">
                                Debate Style <span className="text-purple-500">*</span>
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    multiple
                                    value={chatNature}
                                    onChange={(e) => setChatNature(e.target.value)}
                                    input={<OutlinedInput className="text-gray-900" />}
                                    renderValue={(selected) => (
                                        <div className="flex flex-wrap gap-1">
                                            {selected.map((value) => {
                                                const option = natureOptions.find(opt => opt.label === value);
                                                return (
                                                    <Chip 
                                                        key={value}
                                                        label={value}
                                                        size="small"
                                                        style={{ backgroundColor: option.color, color: 'white' }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}
                                    className="bg-gray-100 rounded-lg"
                                >
                                    {natureOptions.map((option) => (
                                        <MenuItem key={option.label} value={option.label}>
                                            {option.icon} {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
