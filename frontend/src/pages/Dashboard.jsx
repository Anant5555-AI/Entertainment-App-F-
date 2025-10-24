import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api_base_url } from '../helper'
import Avatar from 'react-avatar'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      navigate('/login')
      return
    }

    // Fetch user details
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user)
        } else {
          setError(data.msg)
        }
        setLoading(false)
      })
      .catch(err => {
        setError("Failed to load user data")
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("isAdmin")
    navigate("/login")
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('profileImage', file)
    formData.append('userId', localStorage.getItem('userId'))

    try {
      const response = await fetch(api_base_url + '/uploadProfileImage', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        alert('Profile image updated successfully!')
      } else {
        alert(data.msg || 'Failed to upload image')
      }
    } catch (err) {
      alert('Error uploading image')
      console.error(err)
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-white text-xl'>Loading...</div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-red-500 text-xl'>{error}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen px-4 md:px-8 lg:px-[100px] py-8'>
        {/* Header */}
        <div className='mb-8 animate-fadeInDown'>
          <h1 className='text-4xl font-bold text-white mb-2'>My Dashboard</h1>
          <p className='text-gray-400'>Manage your account and preferences</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
          {/* Profile Card */}
          <div className='lg:col-span-1 stagger-item'>
            <div className='bg-[#18181B] rounded-lg p-6 border border-gray-800'>
              <div className='flex flex-col items-center'>
                <div className='relative mb-4'>
                  {user?.profileImage ? (
                    <img 
                      src={`${api_base_url}/uploads/${user.profileImage}`}
                      alt={user.name}
                      className='w-[120px] h-[120px] rounded-full object-cover border-4 border-gray-700'
                    />
                  ) : (
                    <Avatar 
                      round="50%" 
                      name={user?.name || "User"} 
                      size="120"
                    />
                  )}
                  <label 
                    htmlFor='profile-upload' 
                    className='absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-colors'
                    title='Upload profile image'
                  >
                    <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                  </label>
                  <input 
                    id='profile-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                    </div>
                  )}
                </div>
                <h2 className='text-2xl font-bold text-white mb-1'>{user?.name}</h2>
                <p className='text-gray-400 mb-1'>@{user?.username}</p>
                <p className='text-gray-500 text-sm mb-4'>{user?.email}</p>
                
                {user?.isAdmin && (
                  <span className='bg-purple-600 text-white px-3 py-1 rounded-full text-sm mb-4'>
                    Admin
                  </span>
                )}

                <div className='w-full border-t border-gray-800 pt-4 mt-4'>
                  <div className='text-center text-gray-400 text-sm'>
                    <p>Member since</p>
                    <p className='text-white font-semibold mt-1'>
                      {new Date(user?.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6 stagger-item'>
            {/* Account Stats */}
            <div className='bg-[#18181B] rounded-lg p-6 border border-gray-800'>
              <h3 className='text-xl font-bold text-white mb-4'>Account Overview</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                <div className='bg-[#09090B] p-4 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center'>
                      <svg className='w-6 h-6 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' />
                      </svg>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>Movies Watched</p>
                      <p className='text-white text-2xl font-bold'>0</p>
                    </div>
                  </div>
                </div>

                <div className='bg-[#09090B] p-4 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center'>
                      <svg className='w-6 h-6 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                      </svg>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>Favorites</p>
                      <p className='text-white text-2xl font-bold'>0</p>
                    </div>
                  </div>
                </div>

                <div className='bg-[#09090B] p-4 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center'>
                      <svg className='w-6 h-6 text-purple-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>Watch Time</p>
                      <p className='text-white text-2xl font-bold'>0h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className='bg-[#18181B] rounded-lg p-6 border border-gray-800'>
              <h3 className='text-xl font-bold text-white mb-4'>Account Information</h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center py-3 border-b border-gray-800'>
                  <div>
                    <p className='text-white font-medium'>Full Name</p>
                    <p className='text-gray-400 text-sm'>{user?.name}</p>
                  </div>
                  <button className='text-blue-500 hover:text-blue-400 text-sm'>Edit</button>
                </div>

                <div className='flex justify-between items-center py-3 border-b border-gray-800'>
                  <div>
                    <p className='text-white font-medium'>Username</p>
                    <p className='text-gray-400 text-sm'>@{user?.username}</p>
                  </div>
                  <button className='text-blue-500 hover:text-blue-400 text-sm'>Edit</button>
                </div>

                <div className='flex justify-between items-center py-3 border-b border-gray-800'>
                  <div>
                    <p className='text-white font-medium'>Email Address</p>
                    <p className='text-gray-400 text-sm'>{user?.email}</p>
                  </div>
                  <button className='text-blue-500 hover:text-blue-400 text-sm'>Edit</button>
                </div>

                <div className='flex justify-between items-center py-3'>
                  <div>
                    <p className='text-white font-medium'>Password</p>
                    <p className='text-gray-400 text-sm'>••••••••</p>
                  </div>
                  <button className='text-blue-500 hover:text-blue-400 text-sm'>Change</button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-[#18181B] rounded-lg p-6 border border-gray-800'>
              <h3 className='text-xl font-bold text-white mb-4'>Quick Actions</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <button 
                  onClick={() => navigate('/')}
                  className='bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                  </svg>
                  Browse Movies
                </button>

                <button 
                  onClick={() => navigate('/search')}
                  className='bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                  Search Movies
                </button>

                {user?.isAdmin && (
                  <button 
                    onClick={() => navigate('/createMovie')}
                    className='bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                    Add Movie
                  </button>
                )}

                <button 
                  onClick={handleLogout}
                  className='bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Dashboard
