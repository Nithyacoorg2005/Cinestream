import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Share2, Download, Star, Clock, Calendar, Globe } from 'lucide-react';
import { mockMovies, getMyList, addToMyList, removeFromMyList, addToWatchHistory } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState<any>(null);
  const [isInMyList, setIsInMyList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (id) {
      const foundMovie = mockMovies.find(m => m.id === id);
      if (foundMovie) {
        setMovie(foundMovie);
        setIsInMyList(getMyList().includes(id));
      }
      setLoading(false);
    }
  }, [id]);

  const handlePlay = () => {
    if (movie) {
      addToWatchHistory(movie.id);
      navigate(`/watch/${movie.id}`);
    }
  };

  const handleAddToList = () => {
    if (!movie) return;
    
    if (isInMyList) {
      removeFromMyList(movie.id);
      setIsInMyList(false);
    } else {
      addToMyList(movie.id);
      setIsInMyList(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <Link to="/" className="text-red-600 hover:text-red-500">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const similarMovies = mockMovies
    .filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g)))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <div className="mb-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {movie.type === 'series' ? 'Series' : 'Movie'}
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                {movie.title}
              </h1>

              <div className="flex items-center space-x-4 text-gray-300 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-current text-yellow-500" />
                  <span className="font-medium">{movie.rating}</span>
                </div>
                <span>{movie.year}</span>
                <span className="border border-gray-400 px-2 py-1 text-xs">
                  {movie.ageRating}
                </span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration}</span>
                </div>
              </div>

              <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                {showFullDescription ? movie.description : `${movie.description.slice(0, 200)}...`}
                {movie.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </p>

              <div className="flex items-center space-x-4 mb-8">
                <button
                  onClick={handlePlay}
                  className="bg-white text-black px-8 py-3 rounded flex items-center space-x-2 hover:bg-gray-200 transition-colors font-medium"
                >
                  <Play className="w-5 h-5" />
                  <span>Play</span>
                </button>

                <button
                  onClick={handleAddToList}
                  className="bg-gray-600/80 text-white px-8 py-3 rounded flex items-center space-x-2 hover:bg-gray-600 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>{isInMyList ? 'Remove from List' : 'Add to List'}</span>
                </button>

                <button className="w-12 h-12 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                </button>

                <button className="w-12 h-12 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>

                {user?.subscription === 'premium' && (
                  <button className="w-12 h-12 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Movie Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About {movie.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Director</h3>
                  <p className="text-white">{movie.director}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Language</h3>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{movie.language}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Release Year</h3>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.year}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Country</h3>
                  <p className="text-white">{movie.country}</p>
                </div>
                {movie.type === 'series' && (
                  <>
                    <div>
                      <h3 className="text-gray-400 text-sm mb-2">Seasons</h3>
                      <p className="text-white">{movie.seasons}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 text-sm mb-2">Episodes</h3>
                      <p className="text-white">{movie.episodes}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cast */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast?.map((actor: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((genre: string) => (
                  <span
                    key={genre}
                    className="bg-red-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Movie Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span>{movie.rating}/10</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Age Rating</span>
                  <span className="border border-gray-600 px-2 py-1 rounded text-xs">
                    {movie.ageRating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Quality</span>
                  <span className="bg-green-600 px-2 py-1 rounded text-xs">4K Ultra HD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More Like This</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {similarMovies.map((similarMovie) => (
                <Link
                  key={similarMovie.id}
                  to={`/${similarMovie.type}/${similarMovie.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-[2/3]">
                    <img
                      src={similarMovie.poster}
                      alt={similarMovie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white font-medium mt-2 text-sm line-clamp-2">
                    {similarMovie.title}
                  </h3>
                  <p className="text-gray-400 text-xs">{similarMovie.year}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;