import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api_base_url } from '../../helper';

const AdminLogin = () => {


  const [email, setEmail] = useState("");
  const [adminKey, setadminKey] = useState("");
  const [pwd, setPwd] = useState("");

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in first
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please login as a regular user first before accessing admin panel");
      setIsUserLoggedIn(false);
      return;
    } else {
      setIsUserLoggedIn(true);
    }
    
    fetch(api_base_url + "/checkAdmin", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: pwd,
        key: adminKey,
        userId: userId
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        alert("Admin access granted!");
        setTimeout(() => {
          navigate("/");
        }, 100);
      }
      else {
        setError(data.msg || "Admin verification failed");
      }
    }).catch(err => {
      setError("Connection error. Please try again.");
      console.error(err);
    })
  }

  return (
    <>
      <div className="container w-screen min-h-screen flex flex-col items-center justify-center bg-[#09090B] text-white px-4">
        <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:w-[23vw] bg-[#18181B] h-[auto] flex flex-col p-6 md:p-8 shadow-black/50 rounded-lg animate-fadeInUp">
          <h3 className='text-2xl mb-2'>Admin Login</h3>
          
          {!isUserLoggedIn && (
            <div className='bg-yellow-600/20 border border-yellow-600 text-yellow-200 px-3 py-2 rounded-lg mb-3 text-sm'>
              ⚠️ You must <Link to="/login" className='text-blue-400 underline'>login</Link> as a regular user first
            </div>
          )}
          
          <form onSubmit={handleSubmit}>

            <div className='inputBox mt-3'>
              <input onChange={(e) => { setEmail(e.target.value) }} value={email} required type="email" placeholder='Email' />
            </div>

            <div className='inputBox mt-3'>
              <input onChange={(e) => { setPwd(e.target.value) }} value={pwd} required type="password" placeholder='Password' />
            </div>

            <div className='inputBox mt-3'>
              <input onChange={(e) => { setadminKey(e.target.value) }} value={adminKey} required type="text" placeholder='Admin Key' />
            </div>

            <p className='mb-3 text-red-500'>{error}</p>

            <button className='btnBlue w-full text-[15px]'>Login</button>
          </form>
        </div>

      </div>
    </>
  )
}

export default AdminLogin
