import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('query');
    
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    } else {
      setLoading(false);
      setError("No search query provided");
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
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={handleBackToHome}
            className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Results for "{query}"
          </h1>
          
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
  );
};

export default SearchResults;
