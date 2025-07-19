import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, ArrowLeft, Zap, Heart, Sword, Star } from 'lucide-react';
import { mockMovies } from '../data/mockData';

interface SceneMarker {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  type: 'action' | 'romance' | 'comedy' | 'drama' | 'climax' | 'twist';
  thumbnail: string;
  intensity: number; // 1-5 scale
}

const SceneNavigation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [movie, setMovie] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedScene, setSelectedScene] = useState<SceneMarker | null>(null);
  const [showSceneList, setShowSceneList] = useState(true);

  // Mock scene data for the movie
  const sceneMarkers: SceneMarker[] = [
    {
      id: 'opening',
      title: 'Opening Sequence',
      description: 'The heist team assembles for their biggest challenge yet',
      timestamp: 0,
      type: 'drama',
      thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=200&h=112&fit=crop',
      intensity: 3
    },
    {
      id: 'first_action',
      title: 'First Chase Scene',
      description: 'High-speed pursuit through the city streets',
      timestamp: 420, // 7 minutes
      type: 'action',
      thumbnail: 'https://images.pexels.com/photos/7991676/pexels-photo-7991676.jpeg?auto=compress&cs=tinysrgb&w=200&h=112&fit=crop',
      intensity: 5
    },
    {
      id: 'romance',
      title: 'Romantic Moment',
      description: 'A tender moment between the lead characters',
      timestamp: 1200, // 20 minutes
      type: 'romance',
      thumbnail: 'https://images.pexels.com/photos/7991491/pexels-photo-7991491.jpeg?auto=compress&cs=tinysrgb&w=200&h=112&fit=crop',
      intensity: 2
    },
    {
      id: 'comedy_relief',
      title: 'Comic Relief',
      description: 'Hilarious mishap during the infiltration',
      timestamp: 1800, // 30 minutes
      type: 'comedy',
      thumbnail: 'https://images.pexels.com/photos/7991522/pexels-photo-7991522.jpeg?auto=compress&cs=tinysrgb&w=200&h=112&fit=crop',
      intensity: 1
    },
    {
      id: 'plot_twist',
      title: 'Major Plot Twist',
      description: 'Everything you thought you knew changes',
      timestamp: 2700, // 45 minutes
      type: 'twist',
      thumbnail: 'https://images.pexels.com/photos/7991439/pexels-photo-7991439.jpeg?auto=compress&cs=tinysrgb&w=200&h=112&fit=crop',
      intensity: 4
    },
    {
      id: 'climax',
      title: 'Final Confrontation',
      description: 'The ultimate showdown in the vault',
      timestamp: 3600, // 60 minutes
      type: 'climax',
      thumbnail: 'https://images.pexels.com/photos/7991367/pexels-photo-7991367.jpeg?auto=compress&cs=tinysrgb&w=200&h=112&fit=crop',
      intensity: 5
    },
    {
      id: 'resolution',
      title: 'Resolution',
      description: 'The aftermath and final revelations',
      timestamp: 4200, // 70 minutes
      type: 'drama',
      thumbnail: 'https://images.pexels.com/photos/7991420/pexels-photo-7991420.jpeg?auto=compress&cs=tinysrgb&w=200&h=112&fit=crop',
      intensity: 2
    }
  ];

  useEffect(() => {
    if (id) {
      const foundMovie = mockMovies.find(m => m.id === id);
      if (foundMovie) {
        setMovie(foundMovie);
        setDuration(4800); // 80 minutes in seconds
      }
    }
  }, [id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    video.addEventListener('timeupdate', updateTime);

    return () => video.removeEventListener('timeupdate', updateTime);
  }, []);

  const jumpToScene = (scene: SceneMarker) => {
    if (videoRef.current) {
      videoRef.current.currentTime = scene.timestamp;
      setCurrentTime(scene.timestamp);
      setSelectedScene(scene);
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSceneIcon = (type: string) => {
    switch (type) {
      case 'action': return <Sword className="w-5 h-5" />;
      case 'romance': return <Heart className="w-5 h-5" />;
      case 'comedy': return <span className="text-lg">😄</span>;
      case 'drama': return <span className="text-lg">🎭</span>;
      case 'climax': return <Zap className="w-5 h-5" />;
      case 'twist': return <span className="text-lg">🌪️</span>;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getSceneColor = (type: string) => {
    switch (type) {
      case 'action': return 'bg-red-600';
      case 'romance': return 'bg-pink-600';
      case 'comedy': return 'bg-yellow-600';
      case 'drama': return 'bg-blue-600';
      case 'climax': return 'bg-purple-600';
      case 'twist': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getIntensityBars = (intensity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-1 h-4 rounded ${
          i < intensity ? 'bg-red-500' : 'bg-gray-600'
        }`}
      />
    ));
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Video Player */}
      <div className="flex-1 flex flex-col">
        <div className="relative bg-gray-900 aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={movie.backdrop}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          </video>

          {/* Scene Markers on Timeline */}
          <div className="absolute bottom-16 left-4 right-4">
            <div className="relative h-2 bg-gray-600 rounded-full">
              <div 
                className="h-2 bg-red-600 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              {sceneMarkers.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => jumpToScene(scene)}
                  className={`absolute top-0 w-3 h-3 rounded-full border-2 border-white transform -translate-y-0.5 hover:scale-150 transition-transform ${getSceneColor(scene.type)}`}
                  style={{ left: `${(scene.timestamp / duration) * 100}%` }}
                  title={scene.title}
                />
              ))}
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlay}
                className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
            </div>

            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <button
              onClick={() => setShowSceneList(!showSceneList)}
              className="bg-black/60 text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
            >
              {showSceneList ? 'Hide Scenes' : 'Show Scenes'}
            </button>
          </div>

          {/* Current Scene Info */}
          {selectedScene && (
            <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-4 max-w-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-2 rounded-full text-white ${getSceneColor(selectedScene.type)}`}>
                  {getSceneIcon(selectedScene.type)}
                </div>
                <h3 className="font-bold">{selectedScene.title}</h3>
              </div>
              <p className="text-gray-300 text-sm">{selectedScene.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-400">Intensity:</span>
                <div className="flex space-x-1">
                  {getIntensityBars(selectedScene.intensity)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="bg-gray-900 p-6">
          <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-300 mb-4">{movie.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current text-yellow-500" />
              <span>{movie.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scene Navigation Sidebar */}
      {showSceneList && (
        <div className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Scene Navigation</h2>
            
            {/* Scene Type Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Jump to Scene Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {['action', 'romance', 'comedy', 'climax'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      const scene = sceneMarkers.find(s => s.type === type);
                      if (scene) jumpToScene(scene);
                    }}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-sm hover:bg-gray-800 transition-colors ${getSceneColor(type)}`}
                  >
                    {getSceneIcon(type)}
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scene List */}
            <div className="space-y-3">
              {sceneMarkers.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => jumpToScene(scene)}
                  className={`w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors ${
                    selectedScene?.id === scene.id ? 'bg-gray-800 border border-red-600' : 'bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={scene.thumbnail}
                      alt={scene.title}
                      className="w-16 h-9 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`p-1 rounded text-white ${getSceneColor(scene.type)}`}>
                          {getSceneIcon(scene.type)}
                        </div>
                        <span className="text-xs text-gray-400">{formatTime(scene.timestamp)}</span>
                      </div>
                      <h4 className="font-medium text-sm line-clamp-1">{scene.title}</h4>
                      <p className="text-gray-400 text-xs line-clamp-2 mt-1">{scene.description}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        {getIntensityBars(scene.intensity)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Jump</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const climaxScene = sceneMarkers.find(s => s.type === 'climax');
                    if (climaxScene) jumpToScene(climaxScene);
                  }}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Jump to Climax</span>
                </button>
                
                <button
                  onClick={() => {
                    const actionScenes = sceneMarkers.filter(s => s.type === 'action');
                    if (actionScenes.length > 0) jumpToScene(actionScenes[0]);
                  }}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Sword className="w-4 h-4" />
                  <span>Best Action Scene</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneNavigation;