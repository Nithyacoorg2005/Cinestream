import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import MovieCarousel from '../components/MovieCarousel';
import { useAuth } from '../contexts/AuthContext';
import { mockMovies, getWatchHistory, getMyList, addToMyList, removeFromMyList } from '../data/mockData';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myList, setMyList] = useState<string[]>([]);
  const [watchHistory, setWatchHistory] = useState<any[]>([]);

  useEffect(() => {
    setMyList(getMyList());
    setWatchHistory(getWatchHistory());
  }, []);

  const handlePlay = (movieId: string) => {
    navigate(`/watch/${movieId}`);
  };

  const handleAddToList = (movieId: string) => {
    if (myList.includes(movieId)) {
      removeFromMyList(movieId);
      setMyList(prev => prev.filter(id => id !== movieId));
    } else {
      addToMyList(movieId);
      setMyList(prev => [...prev, movieId]);
    }
  };

  // Filter movies for different sections
  const featuredMovies = mockMovies.filter(m => m.rating >= 8.5).slice(0, 5);
  const trendingMovies = mockMovies.filter(m => m.rating >= 7.5);
  const newReleases = mockMovies.filter(m => m.year >= 2023);
  const actionMovies = mockMovies.filter(m => m.genre.includes('Action'));
  const dramaMovies = mockMovies.filter(m => m.genre.includes('Drama'));
  const comedyMovies = mockMovies.filter(m => m.genre.includes('Comedy'));
  const continueWatching = mockMovies.filter(m => watchHistory.some(h => h.movieId === m.id));

  // Add my list status to movies
  const addMyListStatus = (movies: any[]) =>
    movies.map(movie => ({ ...movie, isInMyList: myList.includes(movie.id) }));

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Banner */}
      <HeroBanner movies={featuredMovies} onPlay={handlePlay} />

      {/* Content Sections */}
      <div className="relative -mt-32 z-10 space-y-8">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <MovieCarousel
            title="Continue Watching"
            movies={addMyListStatus(continueWatching)}
            onAddToList={handleAddToList}
            onPlay={handlePlay}
          />
        )}

        {/* Trending Now */}
        <MovieCarousel
          title="Trending Now"
          movies={addMyListStatus(trendingMovies)}
          onAddToList={handleAddToList}
          onPlay={handlePlay}
        />

        {/* New Releases */}
        <MovieCarousel
          title="New Releases"
          movies={addMyListStatus(newReleases)}
          onAddToList={handleAddToList}
          onPlay={handlePlay}
        />

        {/* Action Movies */}
        <MovieCarousel
          title="Action & Adventure"
          movies={addMyListStatus(actionMovies)}
          onAddToList={handleAddToList}
          onPlay={handlePlay}
        />

        {/* Drama Series */}
        <MovieCarousel
          title="Drama Series"
          movies={addMyListStatus(dramaMovies)}
          onAddToList={handleAddToList}
          onPlay={handlePlay}
        />

        {/* Comedy */}
        <MovieCarousel
          title="Comedy"
          movies={addMyListStatus(comedyMovies)}
          onAddToList={handleAddToList}
          onPlay={handlePlay}
        />

        {/* Recommendations */}
        {user?.subscription === 'premium' && (
          <MovieCarousel
            title="Recommended for You"
            movies={addMyListStatus(mockMovies.slice(0, 12))}
            onAddToList={handleAddToList}
            onPlay={handlePlay}
          />
        )}
      </div>

      {/* Subscription CTA for Free Users */}
      {user?.subscription === 'free' && (
        <div className="bg-gradient-to-r from-red-600 to-red-800 mx-4 lg:mx-8 my-8 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Unlock Premium Content
          </h2>
          <p className="text-gray-200 mb-6">
            Get access to exclusive movies, ad-free viewing, and 4K streaming
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;