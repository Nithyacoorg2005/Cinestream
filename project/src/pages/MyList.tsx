import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Play, Filter, Grid, List } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { mockMovies, getMyList, removeFromMyList } from '../data/mockData';

const MyList: React.FC = () => {
  const navigate = useNavigate();
  const [myListIds, setMyListIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'added' | 'title' | 'year' | 'rating'>('added');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all');

  useEffect(() => {
    setMyListIds(getMyList());
  }, []);

  const myListMovies = mockMovies.filter(movie => myListIds.includes(movie.id));

  const handleRemoveFromList = (movieId: string) => {
    removeFromMyList(movieId);
    setMyListIds(prev => prev.filter(id => id !== movieId));
  };

  const handlePlay = (movieId: string) => {
    navigate(`/watch/${movieId}`);
  };

  // Filter movies
  const filteredMovies = myListMovies.filter(movie => {
    if (filterType === 'all') return true;
    return movie.type === filterType;
  });

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'year':
        return b.year - a.year;
      case 'rating':
        return b.rating - a.rating;
      case 'added':
      default:
        return 0; // Keep original order (most recently added first)
    }
  });

  const moviesWithMyListStatus = sortedMovies.map(movie => ({
    ...movie,
    isInMyList: true
  }));

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">My List</h1>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="all">All Types</option>
                  <option value="movie">Movies</option>
                  <option value="series">Series</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="added">Recently Added</option>
                <option value="title">Title A-Z</option>
                <option value="year">Year (Newest)</option>
                <option value="rating">Rating (Highest)</option>
              </select>

              <span className="text-gray-400 text-sm">
                {filteredMovies.length} {filteredMovies.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {myListMovies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">Your list is empty</h2>
            <p className="text-gray-500 mb-6">
              Add movies and series to your list to watch them later
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse Content
            </button>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' 
              : 'space-y-4'
          }`}>
            {moviesWithMyListStatus.map((movie) => (
              <div key={movie.id}>
                {viewMode === 'grid' ? (
                  <div className="relative group">
                    <MovieCard
                      movie={movie}
                      size="medium"
                      onAddToList={handleRemoveFromList}
                      onPlay={handlePlay}
                    />
                    <button
                      onClick={() => handleRemoveFromList(movie.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      title="Remove from list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-800 transition-colors">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 h-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{movie.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {movie.year} • {movie.type} • ⭐ {movie.rating}
                      </p>
                      <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.genre.slice(0, 3).map((genre) => (
                          <span key={genre} className="bg-gray-700 text-white px-2 py-1 rounded text-xs">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePlay(movie.id)}
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Play</span>
                      </button>
                      <button
                        onClick={() => handleRemoveFromList(movie.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {myListMovies.length > 0 && (
          <div className="mt-12 bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your entire list?')) {
                    myListIds.forEach(id => removeFromMyList(id));
                    setMyListIds([]);
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
              
              <button
                onClick={() => navigate('/browse')}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Add More Content
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;