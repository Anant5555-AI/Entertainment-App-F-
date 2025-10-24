import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('query');
    
    if (searchQuery) {
      setQuery(searchQuery);
      setSearchInput(searchQuery);
      performSearch(searchQuery);
    } else {
      setLoading(false);
    }
  }, [location.search]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${api_base_url}/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.movies);
      } else {
        setError(data.msg || "No results found");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("An error occurred while searching");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/singleMovie/${movieId}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Searching for movies...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-4 md:px-8 lg:px-[100px] py-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              {query ? `Search Results for "${query}"` : 'Search Movies'}
            </h1>
            
            {/* Search Input */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for movies..."
                  className="flex-1 px-4 py-3 bg-[#18181B] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </form>
          
          {error && (
            <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">
              {error}
            </div>
          )}
          
          {!error && searchResults.length > 0 && (
            <p className="text-gray-400">
              Found {searchResults.length} movie{searchResults.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Results Grid */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
            {searchResults.map((movie) => (
              <div 
                key={movie._id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105 transition-transform duration-200"
                onClick={() => handleMovieClick(movie._id)}
              >
                {/* Movie Poster */}
                <div className="aspect-w-2 aspect-h-3">
                  <img 
                    src={movie.img ? `${api_base_url}/uploads/${movie.img}` : "https://via.placeholder.com/300x450"} 
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x450";
                    }}
                  />
                </div>
                
                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  
                  {movie.category && (
                    <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mb-2">
                      {movie.category}
                    </span>
                  )}
                  
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {movie.desc}
                  </p>
                  
                  {movie.date && (
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(movie.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl text-white mb-2">No movies found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any movies matching "{query}"
              </p>
              <button 
                onClick={handleBackToHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Browse All Movies
              </button>
            </div>
          )
        )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
