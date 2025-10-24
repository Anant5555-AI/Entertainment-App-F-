import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import SingleMovie from './pages/SingleMovie';
import AdminLogin from './pages/admin/AdminLogin';
import CreateMovie from './pages/admin/CreateMovie';
import SearchResults from './pages/SearchResults';
import Dashboard from './pages/Dashboard';
import AI from './components/AI';

// Protected Route Component - checks auth on every render
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Admin Route Component - checks admin status on every render
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/adminLogin" replace />;
};

const App = () => {

  return (
    <>
      <BrowserRouter>
      <AI/>
        <Routes>
          {/* Public routes - accessible without login */}
          <Route path='/' element={<Home />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          
          {/* Protected routes - require login */}
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/singleMovie/:movieId' element={<ProtectedRoute><SingleMovie /></ProtectedRoute>} />
          <Route path='/search' element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path='/adminLogin' element={<AdminLogin />} />
          <Route path='/createMovie' element={<AdminRoute><CreateMovie /></AdminRoute>} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        
      </BrowserRouter>
    </>
  )
}

export default App
