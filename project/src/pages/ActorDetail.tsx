import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, MapPin, Award, Film, Tv } from 'lucide-react';


interface Actor {
  id: string;
  name: string;
  bio: string;
  birthDate: string;
  birthPlace: string;
  photo: string;
  rating: number;
  awards: string[];
  filmography: Array<{
    id: string;
    title: string;
    year: number;
    role: string;
    type: 'movie' | 'series';
    poster: string;
    rating: number;
  }>;
}

const ActorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [actor, setActor] = useState<Actor | null>(null);
  const [selectedTab, setSelectedTab] = useState<'movies' | 'series' | 'all'>('all');

  useEffect(() => {
    // Mock actor data - in real app, this would come from API
    const mockActor: Actor = {
      id: id || '1',
      name: 'Ryan Gosling',
      bio: 'Ryan Thomas Gosling is a Canadian actor and musician. He began his career as a child actor on the Disney Channel\'s The Mickey Mouse Club and went on to appear in other family entertainment programs. As an adult, he starred in the romantic drama The Notebook, the neo-noir crime film Drive, and the musical romantic comedy-drama La La Land.',
      birthDate: '1980-11-12',
      birthPlace: 'London, Ontario, Canada',
      photo: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      rating: 8.7,
      awards: [
        'Golden Globe Award for Best Actor',
        'BAFTA Award for Best Leading Actor',
        'Screen Actors Guild Award',
        'Critics\' Choice Movie Award'
      ],
      filmography: [
        {
          id: '1',
          title: 'The Quantum Heist',
          year: 2024,
          role: 'Dr. Marcus Chen',
          type: 'movie',
          poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
          rating: 8.7
        },
        {
          id: '7',
          title: 'Neon Dreams',
          year: 2024,
          role: 'Neo',
          type: 'movie',
          poster: 'https://images.pexels.com/photos/7991420/pexels-photo-7991420.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
          rating: 7.6
        },
        {
          id: '11',
          title: 'Midnight Café',
          year: 2024,
          role: 'James',
          type: 'movie',
          poster: 'https://images.pexels.com/photos/7991560/pexels-photo-7991560.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
          rating: 8.1
        }
      ]
    };
    setActor(mockActor);
  }, [id]);

  if (!actor) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredFilmography = actor.filmography.filter(item => {
    if (selectedTab === 'all') return true;
    return item.type === selectedTab.slice(0, -1); // Remove 's' from 'movies'/'series'
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        <img
          src={actor.photo}
          alt={actor.name}
          className="w-full h-full object-cover object-top"
        />
        
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="flex items-end space-x-8">
              <img
                src={actor.photo}
                alt={actor.name}
                className="w-48 h-72 rounded-lg object-cover border-4 border-white shadow-2xl"
              />
              <div className="flex-1 pb-4">
                <h1 className="text-5xl font-bold mb-4">{actor.name}</h1>
                <div className="flex items-center space-x-6 text-gray-300 mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-current text-yellow-500" />
                    <span className="font-medium">{actor.rating}/10</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Age {calculateAge(actor.birthDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{actor.birthPlace}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                  {actor.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Awards Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Award className="w-6 h-6 text-yellow-500" />
            <span>Awards & Recognition</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actor.awards.map((award, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-black" />
                </div>
                <span className="text-white font-medium">{award}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filmography Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Filmography</h2>
            <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
              {['all', 'movies', 'series'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as any)}
                  className={`px-4 py-2 rounded-md transition-colors capitalize ${
                    selectedTab === tab
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredFilmography.map((item) => (
              <Link
                key={item.id}
                to={`/${item.type}/${item.id}`}
                className="group cursor-pointer"
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-[2/3]">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      {item.type === 'movie' ? (
                        <Film className="w-8 h-8 text-white mx-auto mb-2" />
                      ) : (
                        <Tv className="w-8 h-8 text-white mx-auto mb-2" />
                      )}
                      <p className="text-white text-sm">View Details</p>
                    </div>
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {item.type === 'movie' ? 'Movie' : 'Series'}
                  </div>
                </div>
                
                <div className="mt-3">
                  <h3 className="text-white font-medium line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400 text-sm">{item.year}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      <span className="text-gray-400 text-sm">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">as {item.role}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredFilmography.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">No {selectedTab} found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-6">Career Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {actor.filmography.length}
              </div>
              <p className="text-gray-400">Total Projects</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {actor.filmography.filter(f => f.type === 'movie').length}
              </div>
              <p className="text-gray-400">Movies</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {actor.filmography.filter(f => f.type === 'series').length}
              </div>
              <p className="text-gray-400">Series</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {actor.awards.length}
              </div>
              <p className="text-gray-400">Awards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDetail;