import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Star, Info, Clock } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  type: 'movie' | 'series';
  genre: string[];
  year: number;
  rating: number;
  duration: string;
  description: string;
  isInMyList?: boolean;
  isWatched?: boolean;
  watchProgress?: number;
}

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
  showInfo?: boolean;
  onAddToList?: (movieId: string) => void;
  onPlay?: (movieId: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  size = 'medium', 
  showInfo = true, 
  onAddToList,
  onPlay 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    small: 'w-40 h-60',
    medium: 'w-48 h-72',
    large: 'w-56 h-80'
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToList?.(movie.id);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay?.(movie.id);
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${sizeClasses[size]} ${
        isHovered ? 'transform scale-105 z-20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/${movie.type}/${movie.id}`}>
        <div className="relative rounded-lg overflow-hidden bg-gray-800 h-full">
          {/* Poster Image */}
          <div className="relative h-full">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={movie.poster}
              alt={movie.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Watch Progress */}
            {movie.watchProgress && movie.watchProgress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-red-600" 
                  style={{ width: `${movie.watchProgress}%` }}
                />
              </div>
            )}

            {/* Premium Badge */}
            {movie.rating > 8 && (
              <div className="absolute top-2 left-2 bg-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold">
                Premium
              </div>
            )}

            {/* Type Badge */}
            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
              {movie.type === 'series' ? 'Series' : 'Movie'}
            </div>
          </div>

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black/90 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              {/* Top Info */}
              <div>
                <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                <div className="flex items-center space-x-2 text-xs text-gray-300 mb-2">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400 mb-2">
                  <Clock className="w-3 h-3" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {movie.genre.slice(0, 2).map((g) => (
                    <span key={g} className="bg-gray-700 text-white px-2 py-1 rounded text-xs">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handlePlay}
                  className="w-full bg-white text-black py-2 px-3 rounded flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddToList}
                    className={`flex-1 border border-gray-600 text-white py-2 px-3 rounded flex items-center justify-center space-x-2 hover:border-white transition-colors text-sm ${
                      movie.isInMyList ? 'bg-gray-700' : ''
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{movie.isInMyList ? 'Added' : 'List'}</span>
                  </button>
                  
                  <Link
                    to={`/${movie.type}/${movie.id}`}
                    className="flex-1 border border-gray-600 text-white py-2 px-3 rounded flex items-center justify-center space-x-2 hover:border-white transition-colors text-sm"
                  >
                    <Info className="w-4 h-4" />
                    <span>Info</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;