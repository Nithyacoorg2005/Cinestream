import React, { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  type: 'movie' | 'series';
  genre: string[];
  year: number;
  rating: number;
  duration: string;
  description: string;
  trailer?: string;
}

interface HeroBannerProps {
  movies: Movie[];
  onPlay?: (movieId: string) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ movies, onPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (movies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      setImageLoaded(false);
    }, 8000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!currentMovie) return null;

  const handlePlay = () => {
    onPlay?.(currentMovie.id);
  };

  return (
    <div className="relative h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={currentMovie.backdrop}
          alt={currentMovie.title}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Movie Info */}
            <div className="mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentMovie.type === 'series' ? 'Series' : 'Movie'}
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>

            <div className="flex items-center space-x-4 text-gray-300 mb-4">
              <span className="text-green-500 font-medium">
                {Math.round(currentMovie.rating * 10)}% Match
              </span>
              <span>{currentMovie.year}</span>
              <span className="border border-gray-400 px-2 py-1 text-xs">
                {currentMovie.rating > 7 ? 'HD' : 'SD'}
              </span>
              <span>{currentMovie.duration}</span>
            </div>

            <p className="text-gray-200 text-lg mb-6 leading-relaxed max-w-xl">
              {currentMovie.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {currentMovie.genre.slice(0, 3).map((genre) => (
                <span key={genre} className="text-gray-300 text-sm">
                  {genre}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlay}
                className="bg-white text-black px-8 py-3 rounded flex items-center space-x-2 hover:bg-gray-200 transition-colors font-medium"
              >
                <Play className="w-5 h-5" />
                <span>Play</span>
              </button>

              <Link
                to={`/${currentMovie.type}/${currentMovie.id}`}
                className="bg-gray-600/80 text-white px-8 py-3 rounded flex items-center space-x-2 hover:bg-gray-600 transition-colors font-medium"
              >
                <Info className="w-5 h-5" />
                <span>More Info</span>
              </Link>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setImageLoaded(false);
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;