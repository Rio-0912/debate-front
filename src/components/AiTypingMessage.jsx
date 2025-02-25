import React, { useState, useEffect, useCallback } from 'react';
import Markdown from 'react-markdown';

const AiTypingMessage = ({ message, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const getRandomTypingDelay = () => Math.random() * 40 + 30;

    const typeNextCharacter = useCallback(() => {
        if (currentIndex < message.length) {
            setDisplayedText(prev => prev + message[currentIndex]);
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
            onComplete && onComplete();
        }
    }, [currentIndex, message, onComplete]);

    useEffect(() => {
        if (currentIndex < message.length) {
            const timeout = setTimeout(typeNextCharacter, getRandomTypingDelay());
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, message, typeNextCharacter]);

    return (
        <div className="flex justify-start">
            <div className="max-w-xl rounded-2xl p-3 m-2 shadow-sm bg-white text-gray-800">
                <Markdown>{displayedText}</Markdown>
                {isComplete && (
                    <span className="text-xs text-gray-600">
                        {new Date().toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                )}
            </div>
        </div>
    );
};

export default AiTypingMessage;