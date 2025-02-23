import React, { useEffect, useState } from "react";
import { Bot, MessageSquare, Brain, Trophy, Users, School, Timer, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const NotLoggedIn = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: <Brain className="w-12 h-12 text-gray-700" />,
            title: "AI-Powered Debate Practice",
            description: "Train with our advanced AI system that adapts to your debating style and skill level"
        },
        {
            icon: <MessageSquare className="w-12 h-12 text-gray-700" />,
            title: "Real-time Feedback",
            description: "Get instant analysis and suggestions to improve your argumentation skills"
        },
        {
            icon: <Timer className="w-12 h-12 text-gray-700" />,
            title: "Structured Practice Sessions",
            description: "Follow proven debate formats with timed rounds and focused exercises"
        }
    ];

    const stats = [
        { icon: <Users className="w-6 h-6" />, value: "5000+", label: "Active Debaters" },
        { icon: <School className="w-6 h-6" />, value: "200+", label: "Debate Clubs" },
        { icon: <Trophy className="w-6 h-6" />, value: "98%", label: "Success Rate" },
        { icon: <Award className="w-6 h-6" />, value: "150+", label: "Tournaments" }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Bot className="w-8 h-8 text-gray-700" />
                            <span className="ml-2 text-xl font-semibold text-gray-700">DebateChat</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="px-4 py-2 rounded-lg bg-[#D3C5E5] text-gray-700 hover:bg-[#D3C5E5]/80 transition-colors"
                            >
                                Start Debating
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl sm:text-6xl font-bold text-gray-700 mb-6">
                            Master Debate with AI
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Practice debate with our AI-powered platform. Get real-time feedback, 
                            structured training, and improve your skills with every session.
                        </p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <button
                                onClick={() => navigate("/login")}
                                className="px-8 py-4 bg-[#D3C5E5] text-gray-700 rounded-lg text-lg font-semibold hover:bg-[#D3C5E5]/80 transition-colors"
                            >
                                Start Your Free Trial
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Demo Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mt-16 bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto"
                    >
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-full bg-[#D3C5E5]/20 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-gray-700" />
                                </div>
                                <div className="flex-1 bg-[#D3C5E5]/60 rounded-2xl p-4">
                                    <p className="text-gray-700">Let's practice debating the impact of artificial intelligence on education.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 justify-end">
                                <div className="flex-1 bg-[#D3C5E5]/20 rounded-2xl p-4 max-w-lg">
                                    <p className="text-gray-700">I believe AI will revolutionize personalized learning by adapting to individual student needs.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-[#D3C5E5]/20 rounded-xl p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col items-center text-center">
                                    {feature.icon}
                                    <h3 className="mt-4 text-xl font-semibold text-gray-700">{feature.title}</h3>
                                    <p className="mt-2 text-gray-600">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#D3C5E5]/20 rounded-xl p-6 text-center shadow-sm"
                            >
                                <div className="flex justify-center mb-2 text-gray-700">{stat.icon}</div>
                                <div className="text-2xl font-bold text-gray-700">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-[#D3C5E5] rounded-2xl p-8 md:p-12 text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-700 mb-4">
                            Ready to Improve Your Debate Skills?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of debaters who have enhanced their skills through our AI-powered platform.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-8 py-4 bg-white text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Get Started Now
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center">
                            <Bot className="w-6 h-6 text-gray-700" />
                            <span className="ml-2 text-gray-700 font-semibold">DebateChat</span>
                        </div>
                        <div className="mt-4 md:mt-0 text-gray-600">
                            © {new Date().getFullYear()} DebateChat. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NotLoggedIn;