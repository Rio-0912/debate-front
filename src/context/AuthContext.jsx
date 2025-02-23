import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // <-- Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate fetching user from localStorage or API
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false); // <-- Only set loading to false after checking
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        // localStorage.setItem("token" , )

    };

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/home");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
