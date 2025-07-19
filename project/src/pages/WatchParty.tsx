import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageCircle, 
  Send, 
  Copy, 
  Share2, 
  Play, 
  Pause,
  Volume2,
  Settings,
  UserPlus,
  Crown
} from 'lucide-react';
import { mockMovies } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const WatchParty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState<any>(null);
  const [isHost, setIsHost] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  // Mock party data
  const [partyMembers] = useState([
    { id: '1', name: 'You', avatar: user?.avatar || '', isHost: true, isOnline: true },
    { id: '2', name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', isHost: false, isOnline: true },
    { id: '3', name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', isHost: false, isOnline: true },
    { id: '4', name: 'Emma Davis', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', isHost: false, isOnline: false }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: '1', user: 'Sarah Johnson', message: 'Hey everyone! Ready for movie night? 🍿', timestamp: '8:30 PM', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { id: '2', user: 'Mike Chen', message: 'Absolutely! This movie looks amazing', timestamp: '8:31 PM', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { id: '3', user: 'You', message: 'Let\'s start in 2 minutes!', timestamp: '8:32 PM', avatar: user?.avatar || '' }
  ]);

  useEffect(() => {
    if (id && id !== 'create') {
      const foundMovie = mockMovies.find(m => m.id === id);
      if (foundMovie) {
        setMovie(foundMovie);
      }
    }
  }, [id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: 'You',
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: user?.avatar || ''
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/watch-party/${id}`;
    navigator.clipboard.writeText(link);
    // In a real app, show a toast notification
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Create Party View
  if (id === 'create') {
    return (
      <div className="min-h-screen bg-black text-white p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create Watch Party</h1>
          
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Choose a Movie or Series</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockMovies.slice(0, 8).map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => navigate(`/watch-party/${movie.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-[2/3]">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <Users className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white text-sm">Start Party</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white font-medium mt-2 text-sm line-clamp-2">
                    {movie.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">How Watch Party Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Invite Friends</h3>
                <p className="text-gray-400 text-sm">Share the party link with up to 10 friends</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Watch Together</h3>
                <p className="text-gray-400 text-sm">Synchronized playback for everyone in the party</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Chat & React</h3>
                <p className="text-gray-400 text-sm">Real-time chat and reactions during the movie</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="relative bg-gray-900 aspect-video">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors mb-4"
              >
                {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
              </button>
              <p className="text-white text-lg font-medium">{movie.title}</p>
              <p className="text-gray-300">Party with {partyMembers.filter(m => m.isOnline).length} friends</p>
            </div>
          </div>

          {/* Sync Status */}
          <div className="absolute top-4 left-4 bg-black/60 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Synced</span>
            </div>
          </div>

          {/* Host Controls */}
          {isHost && (
            <div className="absolute top-4 right-4 bg-black/60 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Host</span>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-600 h-1 rounded-full mb-2">
              <div 
                className="bg-red-600 h-1 rounded-full" 
                style={{ width: '35%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>{formatTime(currentTime)}</span>
              <span>{movie.duration}</span>
            </div>
          </div>
        </div>

        {/* Party Controls */}
        <div className="bg-gray-900 p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button className="p-2 hover:bg-gray-800 rounded">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                <span>Invite</span>
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                  showChat ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
          {/* Party Members */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-bold mb-3">Party Members ({partyMembers.length})</h3>
            <div className="space-y-2">
              {partyMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      member.isOnline ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{member.name}</span>
                      {member.isHost && <Crown className="w-3 h-3 text-yellow-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                <img
                  src={message.avatar}
                  alt={message.user}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">{message.user}</span>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-300">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
              />
              <button
                type="submit"
                disabled={!chatMessage.trim()}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Invite Friends</h2>
              <button
                onClick={() => setShowInvite(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Party Link</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/watch-party/${id}`}
                    readOnly
                    className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setShowInvite(false)}
                  className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchParty;