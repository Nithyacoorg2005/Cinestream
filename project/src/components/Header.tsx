import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, LogOut, Settings, Crown, Menu, X, Trophy, Store, Radio } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { useGamification } from '../contexts/GamificationContext';
import { useStore } from '../contexts/StoreContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentProfile, profiles, switchProfile } = useProfile();
  const { isDark, toggleTheme } = useTheme();
  const { userStats } = useGamification();
  const { cart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/browse', label: 'Browse' },
    { path: '/my-list', label: 'My List' },
    { path: '/watch-party/create', label: 'Watch Party' },
    { path: '/live', label: 'Live' },
    { path: '/store', label: 'Store' }
  ];

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">CineStream</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    location.pathname === item.path ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {item.label}
                  {item.path === '/store' && cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, series..."
                  className="bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-600 w-64"
                />
              </div>
            </form>

           
            <Link
              to="/gamification"
              className="hidden sm:flex items-center space-x-2 bg-purple-600 px-3 py-1 rounded-full hover:bg-purple-700 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Lv.{userStats.level}</span>
            </Link>
          
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {user?.subscription === 'premium' && (
              <div className="flex items-center space-x-1 bg-yellow-600 px-2 py-1 rounded-full">
                <Crown className="w-4 h-4" />
                <span className="text-xs font-medium">Premium</span>
              </div>
            )}

          
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-800 transition-colors"
              >
                <img
                  src={currentProfile?.avatar}
                  alt={currentProfile?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden sm:block text-sm text-white">{currentProfile?.name}</span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-md shadow-lg border border-gray-700 py-2">
                
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Switch Profile</p>
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          switchProfile(profile.id);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`flex items-center space-x-2 w-full p-2 rounded-md hover:bg-gray-800 transition-colors ${
                          currentProfile?.id === profile.id ? 'bg-gray-800' : ''
                        }`}
                      >
                        <img src={profile.avatar} alt={profile.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-white">{profile.name}</span>
                        {profile.isKid && (
                          <span className="text-xs bg-blue-600 px-1 rounded">Kids</span>
                        )}
                      </button>
                    ))}
                  </div>

                 
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm text-white">Manage Profiles</span>
                  </Link>
                  
                  <Link
                    to="/gamification"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 transition-colors"
                  >
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm text-white">Achievements</span>
                  </Link>

                  <Link
                    to="/store"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 transition-colors"
                  >
                    <Store className="w-4 h-4" />
                    <span className="text-sm text-white">Store</span>
                    {cartItemCount > 0 && (
                      <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/live"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 transition-colors"
                  >
                    <Radio className="w-4 h-4" />
                    <span className="text-sm text-white">Live Events</span>
                  </Link>

                  <Link
                    to="/subscription"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 transition-colors"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="text-sm text-white">Subscription</span>
                  </Link>

                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 px-4 py-2 w-full hover:bg-gray-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm text-white">
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </button>

                  {user?.email === 'admin@cinestream.com' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm text-white">Admin Panel</span>
                    </Link>
                  )}

                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 w-full hover:bg-gray-800 transition-colors text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

           
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-white ${
                    location.pathname === item.path ? 'text-white bg-gray-800' : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, series..."
                  className="bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-600 w-full"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;