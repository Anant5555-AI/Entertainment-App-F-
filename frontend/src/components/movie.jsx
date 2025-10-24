import React from 'react'
import { useNavigate } from 'react-router-dom'

const Movie = ({movie}) => {
  const navigate = useNavigate();
  
  const handleMovieClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn) {
      navigate("/singleMovie/" + movie._id);
    } else {
      // Redirect to login page
      navigate("/login");
    }
  };
  
  return (
    <>
      <div onClick={handleMovieClick} className="card w-[200px] h-[300px] rounded-lg cursor-pointer hover-lift transition-all">
      <img className='w-[full] h-full object-cover rounded-lg cursor-pointer' src={movie ? "https://entertainment-app-f.onrender.com/uploads/" + movie.img : ""} alt="" />
      </div>
    </>
  )
}

export default Movie
