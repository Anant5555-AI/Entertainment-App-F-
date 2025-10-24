import React, { useEffect, useState } from 'react'
import logo from "../images/logo.png"
import Avatar from 'react-avatar'
import { Link, useNavigate } from 'react-router-dom'
import { api_base_url } from '../helper'

const Navbar = () => {

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  const getDetails = () => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      console.log(data)
      if (data.success) {
        setData(data.user)
        setIsLoggedIn(true);
        // Check if user is admin
        const adminStatus = localStorage.getItem("isAdmin") === "true";
        setIsAdmin(adminStatus);
      }
      else {
        setError(data.msg)
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    })
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setData(null);
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    // Check if user is logged in before searching
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Navigate to search results page
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setShowSearchResults(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    
    if (token && userId) {
      setIsLoggedIn(true);
      setIsAdmin(adminStatus);
      getDetails();
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [])

  return (
    <>
      <nav className='h-[90px] flex items-center justify-between px-[100px]'>
     <Link to="/">   <img className='w-[140px]' src={logo} alt="" /></Link>

        <div className='flex items-center gap-4'>
          <div className="inputBox w-[22vw] !rounded-[30px]">
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                className='!rounded-[30px] !pl-[20px]' 
                placeholder='Search Here... !' 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          {isLoggedIn ? (
            <div className='flex items-center gap-3'>
              {/* Admin Link - Only visible to admin users */}
              {isAdmin && (
                <Link 
                  to="/createMovie"
                  className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Admin
                </Link>
              )}
              {/* <Link 
                to="/dashboard"
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'
              >
                Dashboard
              </Link> */}
              {data?.profileImage ? (
                <img
                  src={`${api_base_url}/uploads/${data.profileImage}`}
                  alt={data.name}
                  className='w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-600'
                  onClick={() => navigate('/dashboard')}
                  title="Go to Dashboard"
                />
              ) : (
                <Avatar 
                  round="50%" 
                  className='cursor-pointer hover:opacity-80 transition-opacity' 
                  name={data ? data.name : ""} 
                  size="40" 
                  onClick={() => navigate('/dashboard')}
                  title="Go to Dashboard"
                />
              )}
              <button 
                onClick={logout}
                className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <Link 
                to="/adminLogin"
                className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                Admin Login
              </Link>
              <Link 
                to="/login"
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'
              >
                Login
              </Link>
              <Link 
                to="/signUp"
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
