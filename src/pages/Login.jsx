import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Mail from '@mui/icons-material/Mail';
import Lock from '@mui/icons-material/Lock';
import Person from '@mui/icons-material/Person';
import { Person2 } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { backend } from '../assets/utils/constants';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (isSignup && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const url = isSignup ?
                backend + '/api/auth/signup' :
                backend + '/api/auth/login';
            const data = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
            }
            const res = await axios.post(url, data, {
                withCredentials: true
            });

            if (!isSignup) login(res.data);
            localStorage.setItem('token', res.data.token)
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0f0] to-[#d3c5e57a]">
            <div className="relative bg-red backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 transition-all duration-500 hover:shadow-xl">
                <div className="absolute inset-0 bg-[#b093d5]/50 rounded-3xl backdrop-blur-sm" />

                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-purple-800 text-center mb-8 transform hover:scale-105 transition-transform">
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                        <div className="w-16 h-1 bg-white rounded-full mx-auto mt-2" />
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isSignup && (
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Person2 className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-800/80" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-purple-800 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <Person className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-800/80" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-purple-800 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-800/80" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-purple-800 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-800/80" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-purple-800 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {isSignup && (
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-800/80" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-purple-800 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 p-4 bg-white text-purple-600 font-bold rounded-xl transition-all duration-300 hover:bg-opacity-90 hover:gap-3 hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : isSignup ? 'Get Started' : 'Sign In'}
                            {!loading && <ArrowForwardIcon className="inline-block" />}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-purple-800/90">
                        {isSignup ? 'Already have an account?' : "New here?"}
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                                // navigate('/chat')
                            }}
                            className="ml-2 font-semibold underline-offset-4 hover:underline hover:text-purple-800 transition-all"
                        >
                            {isSignup ? 'Sign In instead' : 'Create account'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;