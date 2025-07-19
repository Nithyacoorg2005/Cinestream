import React, { useState, useEffect } from 'react';
import { Play, Users, MessageCircle, Send, Calendar, Clock, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  startTime: Date;
  duration: number;
  isLive: boolean;
  viewerCount: number;
  category: string;
  host: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  isHost?: boolean;
}

const LiveStream: React.FC = () => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(true);

  const liveEvents: LiveEvent[] = [
    {
      id: '1',
      title: 'CineStream Awards 2024 - Live Ceremony',
      description: 'Join us for the biggest night in streaming entertainment',
      thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
      startTime: new Date(Date.now() + 3600000), // 1 hour from now
      duration: 180,
      isLive: false,
      viewerCount: 0,
      category: 'Awards',
      host: 'CineStream Official'
    },
    {
      id: '2',
      title: 'Behind the Scenes: The Quantum Heist',
      description: 'Exclusive behind-the-scenes content with cast and crew',
      thumbnail: 'https://images.pexels.com/photos/7991676/pexels-photo-7991676.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
      startTime: new Date(),
      duration: 90,
      isLive: true,
      viewerCount: 15420,
      category: 'Behind the Scenes',
      host: 'Director Commentary'
    },
    {
      id: '3',
      title: 'Q&A with Midnight Chronicles Cast',
      description: 'Live Q&A session with the stars of our hit series',
      thumbnail: 'https://images.pexels.com/photos/7991491/pexels-photo-7991491.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
      startTime: new Date(Date.now() - 1800000), // 30 minutes ago
      duration: 60,
      isLive: true,
      viewerCount: 8934,
      category: 'Q&A',
      host: 'Cast & Crew'
    }
  ];

  const initialChatMessages: ChatMessage[] = [
    {
      id: '1',
      user: 'MovieFan2024',
      message: 'This is amazing! Love the behind-the-scenes content 🎬',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      user: 'CineStream Official',
      message: 'Welcome everyone! Thanks for joining us live!',
      timestamp: new Date(Date.now() - 240000),
      isHost: true
    },
    {
      id: '3',
      user: 'SeriesAddict',
      message: 'When will season 2 be released?',
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: '4',
      user: 'ActionLover',
      message: 'The stunts in this movie were incredible!',
      timestamp: new Date(Date.now() - 120000),
    }
  ];

  useEffect(() => {
    setChatMessages(initialChatMessages);
    
    // Simulate live chat messages
    const interval = setInterval(() => {
      if (selectedEvent?.isLive) {
        const randomMessages = [
          'This is so cool!',
          'Amazing content! 🔥',
          'Love this show!',
          'When is the next episode?',
          'Best streaming platform ever!',
          'The cinematography is stunning',
          'Can\'t wait for more content like this'
        ];
        
        const randomUsers = [
          'StreamFan123',
          'MovieBuff',
          'CinemaLover',
          'BingeWatcher',
          'FilmCritic',
          'SeriesJunkie'
        ];

        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date()
        };

        setChatMessages(prev => [...prev, newMessage].slice(-50)); // Keep last 50 messages
      }
    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds

    return () => clearInterval(interval);
  }, [selectedEvent]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() && selectedEvent?.isLive) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: user?.name || 'You',
        message: chatMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeUntilStart = (startTime: Date) => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Live Now';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) {
      return `Starts in ${hours}h ${minutes}m`;
    }
    return `Starts in ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {selectedEvent ? (
        // Live Stream View
        <div className="flex h-screen">
          {/* Video Player */}
          <div className="flex-1 flex flex-col">
            <div className="relative bg-gray-900 aspect-video">
              <img
                src={selectedEvent.thumbnail}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              
              {/* Live Indicator */}
              {selectedEvent.isLive && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
              )}

              {/* Viewer Count */}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{selectedEvent.viewerCount.toLocaleString()} watching</span>
              </div>

              {/* Play Button for Non-Live */}
              {!selectedEvent.isLive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Play className="w-10 h-10 ml-1" />
                    </div>
                    <p className="text-white text-lg">{getTimeUntilStart(selectedEvent.startTime)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stream Info */}
            <div className="bg-gray-900 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{selectedEvent.title}</h1>
                  <p className="text-gray-300 mb-4">{selectedEvent.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatTime(selectedEvent.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{selectedEvent.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>{selectedEvent.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Back to Events
                </button>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          {showChat && selectedEvent.isLive && (
            <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-bold">Live Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-medium ${
                        message.isHost ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {message.user}
                        {message.isHost && <span className="ml-1 text-xs bg-red-600 px-1 rounded">HOST</span>}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-300">{message.message}</p>
                  </div>
                ))}
              </div>

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
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Chat Toggle for Hidden Chat */}
          {!showChat && selectedEvent.isLive && (
            <button
              onClick={() => setShowChat(true)}
              className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          )}
        </div>
      ) : (
        // Events List View
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Live Events & Streams</h1>
            <p className="text-gray-400">
              Join exclusive live events, behind-the-scenes content, and interactive sessions
            </p>
          </div>

          {/* Live Now Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span>Live Now</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveEvents.filter(event => event.isLive).map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors group"
                >
                  <div className="relative">
                    <img
                      src={event.thumbnail}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{event.viewerCount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{event.category}</span>
                      <span>{event.host}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveEvents.filter(event => !event.isLive).map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group"
                >
                  <div className="relative">
                    <img
                      src={event.thumbnail}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center">
                        <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white font-medium">{getTimeUntilStart(event.startTime)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{event.category}</span>
                      <span>{formatTime(event.startTime)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-gray-900 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-4">About Live Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-2">Exclusive Content</h4>
                <p className="text-gray-400 text-sm">Behind-the-scenes, cast interviews, and special events</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-2">Interactive Chat</h4>
                <p className="text-gray-400 text-sm">Chat with other viewers and sometimes the hosts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-2">Premium Access</h4>
                <p className="text-gray-400 text-sm">Some events are exclusive to Premium subscribers</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStream;