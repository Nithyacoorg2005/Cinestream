import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { searchMovies, getMyList, addToMyList, removeFromMyList } from '../data/mockData';

const Browse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [myList, setMyList] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    genre: [] as string[],
    year: '',
    type: '' as 'movie' | 'series' | '',
    rating: ''
  });

  const [movies, setMovies] = useState(() => 
    searchMovies(searchQuery, {
      genre: filters.genre,
      type: filters.type || undefined,
      year: filters.year ? parseInt(filters.year) : undefined,
      rating: filters.rating ? parseFloat(filters.rating) : undefined
    })
  );

  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance', 'Horror', 'Documentary'];
  const years = Array.from({ length: 10 }, (_, i) => 2024 - i);
  const ratings = [9, 8, 7, 6, 5];

  useEffect(() => {
    setMyList(getMyList());
  }, []);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
    updateMovies(query, filters);
  }, [searchParams]);

  const updateMovies = (query: string, currentFilters: typeof filters) => {
    const results = searchMovies(query, {
      genre: currentFilters.genre.length > 0 ? currentFilters.genre : undefined,
      type: currentFilters.type || undefined,
      year: currentFilters.year ? parseInt(currentFilters.year) : undefined,
      rating: currentFilters.rating ? parseFloat(currentFilters.rating) : undefined
    });
    setMovies(results);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
    updateMovies(searchQuery, filters);
  };

  const handleFilterChange = (key: string, value: any) => {
    let newFilters = { ...filters };

    if (key === 'genre') {
      if (newFilters.genre.includes(value)) {
        newFilters.genre = newFilters.genre.filter(g => g !== value);
      } else {
        newFilters.genre = [...newFilters.genre, value];
      }
    } else {
      newFilters = { ...newFilters, [key]: value };
    }

    setFilters(newFilters);
    updateMovies(searchQuery, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      genre: [] as string[],
      year: '',
      type: '' as 'movie' | 'series' | '',
      rating: ''
    };
    setFilters(clearedFilters);
    updateMovies(searchQuery, clearedFilters);
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

  const handlePlay = (movieId: string) => {
    navigate(`/watch/${movieId}`);
  };

  const moviesWithMyListStatus = movies.map(movie => ({
    ...movie,
    isInMyList: myList.includes(movie.id)
  }));

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Browse Movies & Series</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, series, genres, cast..."
                className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
          </form>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters ? 'bg-red-600 border-red-600' : 'border-gray-600 hover:border-gray-400'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
              
              {(filters.genre.length > 0 || filters.year || filters.type || filters.rating) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear Filters
                </button>
              )}

              <span className="text-gray-400">
                {movies.length} results
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

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Genre Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Genre</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {genres.map((genre) => (
                      <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.genre.includes(genre)}
                          onChange={() => handleFilterChange('genre', genre)}
                          className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                        />
                        <span className="text-sm text-gray-300">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Type</h3>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">All</option>
                    <option value="movie">Movies</option>
                    <option value="series">Series</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Year</h3>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}+</option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Minimum Rating</h3>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">All Ratings</option>
                    {ratings.map((rating) => (
                      <option key={rating} value={rating}>{rating}+ Stars</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {movies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No results found</h2>
            <p className="text-gray-500">Try adjusting your search or filters</p>
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
                  <MovieCard
                    movie={movie}
                    size="medium"
                    onAddToList={handleAddToList}
                    onPlay={handlePlay}
                  />
                ) : (
                  <div className="bg-gray-900 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-800 transition-colors">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 h-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{movie.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{movie.year} • {movie.type}</p>
                      <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePlay(movie.id)}
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                      >
                        Play
                      </button>
                      <button
                        onClick={() => handleAddToList(movie.id)}
                        className="border border-gray-600 text-white px-4 py-2 rounded hover:border-white transition-colors"
                      >
                        {movie.isInMyList ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;