import React, { useState } from 'react';
import { Play, Star, Clock, Calendar, ArrowRight, User, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockMovies } from '../data/mockData';

const GuestMode: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(mockMovies[0]);

  // Limited content for guests (first 6 movies)
  const guestContent = mockMovies.slice(0, 6);
  const featuredContent = guestContent.slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white">CineStream</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden pt-16">
        <img
          src={selectedMovie.backdrop}
          alt={selectedMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <div className="mb-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedMovie.type === 'series' ? 'Series' : 'Movie'}
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                {selectedMovie.title}
              </h1>

              <div className="flex items-center space-x-4 text-gray-300 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-current text-yellow-500" />
                  <span className="font-medium">{selectedMovie.rating}</span>
                </div>
                <span>{selectedMovie.year}</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedMovie.duration}</span>
                </div>
              </div>

              <p className="text-gray-200 text-lg mb-6 leading-relaxed max-w-xl">
                {selectedMovie.description.slice(0, 200)}...
              </p>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="bg-white text-black px-8 py-3 rounded flex items-center space-x-2 hover:bg-gray-200 transition-colors font-medium"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Now</span>
                </button>

                <Link
                  to="/"
                  className="bg-gray-600/80 text-white px-8 py-3 rounded flex items-center space-x-2 hover:bg-gray-600 transition-colors font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>Sign Up Free</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredContent.map((movie) => (
            <button
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className={`text-left rounded-lg overflow-hidden transition-all hover:scale-105 ${
                selectedMovie.id === movie.id ? 'ring-2 ring-red-600' : ''
              }`}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-gray-900">
                <h3 className="font-bold mb-2">{movie.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Limited Content Grid */}
        <h2 className="text-2xl font-bold mb-6">Sample Library</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {guestContent.map((movie) => (
            <div key={movie.id} className="relative group">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="bg-white text-black px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Watch</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sign Up CTA */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 rounded-lg p-8 text-center border border-red-600/30">
          <h2 className="text-3xl font-bold mb-4">Ready for More?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            This is just a taste of what CineStream has to offer. Sign up now to access thousands of movies and series, 
            create personalized profiles, and enjoy premium features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Unlimited Streaming</h3>
              <p className="text-gray-400 text-sm">Watch as much as you want, anytime</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Multiple Profiles</h3>
              <p className="text-gray-400 text-sm">Create profiles for the whole family</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Premium Features</h3>
              <p className="text-gray-400 text-sm">4K streaming, downloads, and more</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              to="/"
              className="bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="font-bold mb-2">Thousands of Titles</h3>
            <p className="text-gray-400 text-sm">Movies, series, documentaries, and more</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-bold mb-2">Any Device</h3>
            <p className="text-gray-400 text-sm">Watch on TV, laptop, phone, or tablet</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h3 className="font-bold mb-2">No Ads</h3>
            <p className="text-gray-400 text-sm">Enjoy uninterrupted viewing experience</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">⬇️</div>
            <h3 className="font-bold mb-2">Download & Go</h3>
            <p className="text-gray-400 text-sm">Watch offline on your mobile devices</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-white">CineStream</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 CineStream. All rights reserved. Experience the future of streaming.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GuestMode;