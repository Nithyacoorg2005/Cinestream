export interface Movie {
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
  director?: string;
  cast?: string[];
  language: string;
  country: string;
  ageRating: string;
  seasons?: number;
  episodes?: number;
  trailer?: string;
  isInMyList?: boolean;
  isWatched?: boolean;
  watchProgress?: number;
}

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'The Quantum Heist',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'movie',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    year: 2024,
    rating: 8.7,
    duration: '2h 18m',
    description: 'A brilliant physicist discovers a way to steal from parallel universes, but each heist brings him closer to a catastrophic collision between worlds.',
    director: 'Christopher Nolan',
    cast: ['Ryan Gosling', 'Margot Robbie', 'Oscar Isaac', 'Tilda Swinton'],
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13'
  },
  {
    id: '2',
    title: 'Midnight Chronicles',
    poster: 'https://images.pexels.com/photos/7991676/pexels-photo-7991676.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991676/pexels-photo-7991676.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'series',
    genre: ['Drama', 'Mystery', 'Thriller'],
    year: 2023,
    rating: 9.1,
    duration: '8 episodes',
    description: 'A detective with supernatural abilities investigates murders that occur only at midnight, uncovering a conspiracy that spans decades.',
    director: 'Rian Johnson',
    cast: ['Tilda Swinton', 'Michael Shannon', 'Lupita Nyong\'o'],
    language: 'English',
    country: 'USA',
    ageRating: 'TV-MA',
    seasons: 2,
    episodes: 16
  },
  {
    id: '3',
    title: 'Ocean\'s Legacy',
    poster: 'https://images.pexels.com/photos/7991491/pexels-photo-7991491.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991491/pexels-photo-7991491.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'movie',
    genre: ['Action', 'Comedy', 'Crime'],
    year: 2024,
    rating: 7.9,
    duration: '2h 5m',
    description: 'The next generation of Ocean\'s crew plans the most ambitious heist in history: stealing a fortune from a floating casino in international waters.',
    director: 'Steven Soderbergh',
    cast: ['Michael B. Jordan', 'Zendaya', 'John Boyega'],
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13'
  },
  {
    id: '4',
    title: 'Stellar Horizon',
    poster: 'https://images.pexels.com/photos/7991522/pexels-photo-7991522.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991522/pexels-photo-7991522.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'series',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    year: 2023,
    rating: 8.5,
    duration: '10 episodes',
    description: 'Humanity\'s first interstellar expedition discovers that space exploration is far more dangerous and wondrous than anyone imagined.',
    director: 'Denis Villeneuve',
    cast: ['Rebecca Ferguson', 'Oscar Isaac', 'Mahershala Ali'],
    language: 'English',
    country: 'Canada',
    ageRating: 'TV-14',
    seasons: 1,
    episodes: 10
  },
  {
    id: '5',
    title: 'The Last Symphony',
    poster: 'https://images.pexels.com/photos/7991439/pexels-photo-7991439.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991439/pexels-photo-7991439.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'movie',
    genre: ['Drama', 'Music', 'Romance'],
    year: 2024,
    rating: 8.2,
    duration: '2h 31m',
    description: 'A legendary composer\'s final piece holds the key to healing a fractured world, but completing it requires confronting his painful past.',
    director: 'Damien Chazelle',
    cast: ['Adam Driver', 'Lady Gaga', 'J.K. Simmons'],
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13'
  },
  {
    id: '6',
    title: 'Shadow Protocol',
    poster: 'https://images.pexels.com/photos/7991367/pexels-photo-7991367.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991367/pexels-photo-7991367.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'series',
    genre: ['Action', 'Thriller', 'Espionage'],
    year: 2023,
    rating: 8.8,
    duration: '12 episodes',
    description: 'An elite intelligence operative discovers that their own agency has been compromised and must go rogue to uncover the truth.',
    director: 'The Russo Brothers',
    cast: ['Charlize Theron', 'Idris Elba', 'Tom Hardy'],
    language: 'English',
    country: 'USA',
    ageRating: 'TV-MA',
    seasons: 2,
    episodes: 24
  },
  {
    id: '7',
    title: 'Neon Dreams',
    poster: 'https://images.pexels.com/photos/7991420/pexels-photo-7991420.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991420/pexels-photo-7991420.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'movie',
    genre: ['Sci-Fi', 'Cyberpunk', 'Action'],
    year: 2024,
    rating: 7.6,
    duration: '1h 58m',
    description: 'In a dystopian future, a memory thief discovers that some stolen memories are worth more than others - and some are too dangerous to keep.',
    director: 'Lana Wachowski',
    cast: ['Keanu Reeves', 'Anya Taylor-Joy', 'Brian Cox'],
    language: 'English',
    country: 'USA',
    ageRating: 'R'
  },
  {
    id: '8',
    title: 'The Crown Jewels',
    poster: 'https://images.pexels.com/photos/7991548/pexels-photo-7991548.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991548/pexels-photo-7991548.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'series',
    genre: ['Drama', 'Historical', 'Political'],
    year: 2023,
    rating: 9.3,
    duration: '6 episodes',
    description: 'A gripping portrayal of the British monarchy during its most turbulent period, revealing secrets that could shake the foundation of the crown.',
    director: 'Peter Morgan',
    cast: ['Claire Foy', 'Matt Smith', 'Vanessa Kirby'],
    language: 'English',
    country: 'UK',
    ageRating: 'TV-MA',
    seasons: 3,
    episodes: 18
  },
  {
    id: '9',
    title: 'Velocity',
    poster: 'https://images.pexels.com/photos/7991453/pexels-photo-7991453.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991453/pexels-photo-7991453.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'movie',
    genre: ['Action', 'Racing', 'Drama'],
    year: 2024,
    rating: 7.4,
    duration: '2h 12m',
    description: 'A retired Formula 1 driver is forced back into racing when his daughter is kidnapped by a crime syndicate that controls underground racing.',
    director: 'James Mangold',
    cast: ['Michael Fassbender', 'Alicia Vikander', 'Daniel Brühl'],
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13'
  },
  {
    id: '10',
    title: 'The Inheritance',
    poster: 'https://images.pexels.com/photos/7991487/pexels-photo-7991487.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991487/pexels-photo-7991487.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'series',
    genre: ['Drama', 'Family', 'Mystery'],
    year: 2023,
    rating: 8.0,
    duration: '8 episodes',
    description: 'When a tech billionaire dies, his family discovers that inheriting his fortune comes with deadly strings attached.',
    director: 'Mike White',
    cast: ['Sarah Paulson', 'Sterling K. Brown', 'Regina King'],
    language: 'English',
    country: 'USA',
    ageRating: 'TV-14',
    seasons: 1,
    episodes: 8
  },
  {
    id: '11',
    title: 'Midnight Café',
    poster: 'https://images.pexels.com/photos/7991560/pexels-photo-7991560.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991560/pexels-photo-7991560.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'movie',
    genre: ['Romance', 'Drama', 'Comedy'],
    year: 2024,
    rating: 8.1,
    duration: '1h 47m',
    description: 'A lonely café owner\'s life changes forever when she begins receiving mysterious love letters that predict the future.',
    director: 'Greta Gerwig',
    cast: ['Saoirse Ronan', 'Timothée Chalamet', 'Laura Dern'],
    language: 'English',
    country: 'USA',
    ageRating: 'PG-13'
  },
  {
    id: '12',
    title: 'Code Red',
    poster: 'https://images.pexels.com/photos/7991394/pexels-photo-7991394.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    backdrop: 'https://images.pexels.com/photos/7991394/pexels-photo-7991394.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    type: 'series',
    genre: ['Action', 'Military', 'Drama'],
    year: 2023,
    rating: 8.6,
    duration: '10 episodes',
    description: 'An elite military unit faces impossible missions while dealing with the psychological toll of modern warfare.',
    director: 'Kathryn Bigelow',
    cast: ['Jeremy Renner', 'Anthony Mackie', 'Brian Geraghty'],
    language: 'English',
    country: 'USA',
    ageRating: 'TV-MA',
    seasons: 2,
    episodes: 20
  }
];

// Watch History Management
export const getWatchHistory = (): Array<{movieId: string, watchedAt: Date, progress: number}> => {
  const stored = localStorage.getItem('cinestream_watchHistory');
  return stored ? JSON.parse(stored) : [];
};

export const addToWatchHistory = (movieId: string, progress: number = 0) => {
  const history = getWatchHistory();
  const existingIndex = history.findIndex(item => item.movieId === movieId);
  
  if (existingIndex >= 0) {
    history[existingIndex] = { movieId, watchedAt: new Date(), progress };
  } else {
    history.push({ movieId, watchedAt: new Date(), progress });
  }
  
  localStorage.setItem('cinestream_watchHistory', JSON.stringify(history));
};

// My List Management
export const getMyList = (): string[] => {
  const stored = localStorage.getItem('cinestream_myList');
  return stored ? JSON.parse(stored) : [];
};

export const addToMyList = (movieId: string) => {
  const myList = getMyList();
  if (!myList.includes(movieId)) {
    myList.push(movieId);
    localStorage.setItem('cinestream_myList', JSON.stringify(myList));
  }
};

export const removeFromMyList = (movieId: string) => {
  const myList = getMyList();
  const filtered = myList.filter(id => id !== movieId);
  localStorage.setItem('cinestream_myList', JSON.stringify(filtered));
};

// Search and Filter
export const searchMovies = (query: string, filters?: {
  genre?: string[];
  year?: number;
  type?: 'movie' | 'series';
  rating?: number;
}) => {
  let results = mockMovies;

  // Text search
  if (query) {
    results = results.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.description.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
      movie.cast?.some(c => c.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Apply filters
  if (filters) {
    if (filters.genre && filters.genre.length > 0) {
      results = results.filter(movie =>
        filters.genre!.some(g => movie.genre.includes(g))
      );
    }
    
    if (filters.type) {
      results = results.filter(movie => movie.type === filters.type);
    }
    
    if (filters.year) {
      results = results.filter(movie => movie.year >= filters.year!);
    }
    
    if (filters.rating) {
      results = results.filter(movie => movie.rating >= filters.rating!);
    }
  }

  return results;
};