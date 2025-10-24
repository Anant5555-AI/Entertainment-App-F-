import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Movie from '../components/movie';
import { api_base_url } from '../helper';

const Home = () => {

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const getMovies = () => {
    fetch(api_base_url + "/getMovies").then(res => res.json()).then(data => {
      console.log(data.movies);
      if (data.success) {
        setData(data.movies);
      }
      else {
        setError(data.msg);
      }
    })
  };

  useEffect(() => {
    getMovies();
  }, [])


  return (
    <>
      <Navbar />
      <div className='px-4 md:px-8 lg:px-[100px] mt-3'>

        <Swiper navigation={true} autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }} modules={[Autoplay, Navigation]} className="mySwiper animate-fadeIn">
          <SwiperSlide>
            <img src="https://image.api.playstation.com/vulcan/ap/rnd/202108/1609/rT4kNp9h3tQqvjTnQOT7MQJd.jpg" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://variety.com/wp-content/uploads/2014/04/01-avengers-2012.jpg" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://resizing.flixster.com/uaS9Buuct1GoHPTsNXIUBfvORbg=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2YzY2U4OWM5LWUyNTctNDJmMy1hYTc3LTAwMDY5NjU0N2VjZS5qcGc=" alt=""  />
          </SwiperSlide>

        </Swiper>

        <div className='mb-10 animate-fadeInUp'>
          <h3 className='text-2xl my-5 animate-slideInLeft'>Watch</h3>

          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
              1280: {
                slidesPerView: 6,
                spaceBetween: 10,
              },
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="!h-[30vh] md:!h-[35vh] lg:!h-[40vh]"
          >
            {
              data ? data.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <Movie movie={item} />
                  </SwiperSlide>
                )
              }) : "No Movies Found"
            }
          </Swiper>



          {/* <h3 className='text-2xl my-5'>Action</h3>

          <Swiper
            slidesPerView={6}
            spaceBetween={0}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="!h-[40vh]"
          >
            {
              data ? data.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <Movie movie={item} />
                  </SwiperSlide>
                )
              }) : "No Movies Found"
            }
          </Swiper> */}

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home
