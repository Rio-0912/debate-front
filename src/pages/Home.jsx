import React from "react";
import { useAuth } from "../context/AuthContext";
import LoggedIn from "../components/home/LoggedIn";
import { Navigate } from "react-router";
import NotLoggedIn from "../components/home/NotLoggedIn";


const Home = () => {
    const { user, loading } = useAuth();

    if (!user && !loading) {
        return <NotLoggedIn />;
    } else {
        return < Navigate to='/chat' />
    }
};

export default Home;