import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import NotLoggedIn from "../components/home/NotLoggedIn";

const Home = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Optional: Show a loader while checking auth
    if (!user) return <NotLoggedIn />;

    return <Navigate to="/chat" />;
};

export default Home;
