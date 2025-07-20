import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

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

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onAddToList?: (movieId: string) => void;
  onPlay?: (movieId: string) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ 
  title, 
  movies, 
  onAddToList, 
  onPlay 
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = carouselRef.current 
    ? scrollPosition < carouselRef.current.scrollWidth - carouselRef.current.clientWidth 
    : true;

  if (!movies.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 px-4 lg:px-8">{title}</h2>
      
      <div className="relative group">
       
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

     
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

       
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 lg:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard
                movie={movie}
                size="medium"
                onAddToList={onAddToList}
                onPlay={onPlay}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;