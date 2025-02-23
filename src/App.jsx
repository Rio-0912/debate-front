import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Home from "./pages/Home"
import './App.css'
import Chat from './pages/Chat'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return user ? children : <Navigate to="/" />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to={"/home"} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/chat' element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
