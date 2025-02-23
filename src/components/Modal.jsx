import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Modal = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const [firstName, setFirstName] = useState(user.user.firstName || "");
    const [lastName, setLastName] = useState(user.user.lastName || "");

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1d1d1da8] bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                <h2 className="text-lg font-bold mb-4">User Profile</h2>
                <form >
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
