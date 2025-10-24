import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ai from "../images/ai.png";
import ios from "../images/ios_12.mp3"

const AI = () => {
  const navigate = useNavigate();

  let[activeai,Setactiveai]=useState(false)

  const speechrecog = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new speechrecog();

  let openingsound=new Audio(ios)

  // Helper: speak a message
  const speak = (message) => {
    const utter = new SpeechSynthesisUtterance(message);
    utter.lang = "en-US";
    utter.volume = 1;
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };

  recognition.onresult = async (e) => {
    const transcript = e.results[0][0].transcript.toLowerCase().trim();
    console.log("User said:", transcript);

    // ---------- BASIC ROUTES ----------
    if (transcript.includes("home")) {
      navigate("/");
      speak("Opening Home");
    } 
    else if (transcript.includes("open dashboard")) {
      navigate("/dashboard");
      speak("Opening Dashboard");
    }
    else if (transcript.includes("open login")) {
      navigate("/login");
      speak("Opening Login page");
    }
    else if (transcript.includes("open signup")) {
      navigate("/signup");
      speak("Opening Signup page");
    }
    else if (transcript.includes("open admin login")) {
      navigate("/adminLogin");
      speak("Opening Admin Login page");
    }
    else if (transcript.includes("open search")) {
      navigate("/search");
      speak("Opening Search page");
    }

    // ---------- OPEN MOVIE BY NAME ----------
    else if (transcript.includes("open movie")) {
      const movieName = transcript.replace("open movie", "").trim();

      if (!movieName) {
        speak("Please say a movie name after 'open movie'");
        return;
      }

      try {
        //  Use rendered backend port 
        // const response = await fetch(`http://localhost:3000/Movie/search/${movieName}`);
        const response = await fetch(`https://entertainment-app-f.onrender.com/Movie/search/${movieName}`);
        if (response.ok) {
          const movie = await response.json();
          navigate(`/singleMovie/${movie._id}`);
          speak(`Opening movie ${movie.title}`);
        } else {
          speak(`Movie ${movieName} not found`);
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
        speak("Cannot reach backend. Please try again later.");
      }
    }

    // ---------- UNKNOWN COMMAND ----------
    else {
      speak("Sorry, I didn't understand that.");
    }
  };

  recognition.onend=()=>{
    Setactiveai(false)
  }

  return (
    <div
      className="fixed lg:bottom-[30px] md:bottom-[30px] bottom-[80px] left-[1%]  z-50"//increased z index to come over swiper images
// z-50 is very high, so it will appear on top of most elements, including Swiper slides.
// If Swiper or other components also use z-index, you may need to make sure your icon’s z-index is higher than theirs.
// Tailwind supports z-10, z-20, … z-50, or you can use style={{ zIndex: 9999 }} for a super-high value.
      onClick={() => {recognition.start();
openingsound.play()
Setactiveai(true);  
      }}
    >
     <img
  src={ai}
  alt="AI"
  className={`w-[200px] cursor-pointer transition-transform ${//increased width from 100 to 200 
    activeai
      ? "translate-x-[10%] translate-y-[-10%] scale-125"
      : "translate-x-[0] translate-y-[0] scale-100"
  }`}
  style={{
    filter: activeai
      ? "drop-shadow(0px 0px 30px #d5e3e6ff)"
      : "drop-shadow(0px 0px 20px black)",
  }}
/>

    </div>
  );
};

export default AI;
