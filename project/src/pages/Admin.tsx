import React, { useState } from 'react';
import { 
  Users, 
  Film, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { mockMovies } from '../data/mockData';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContent, setShowAddContent] = useState(false);

  // Mock admin data
  const stats = {
    totalUsers: 15420,
    totalContent: mockMovies.length,
    totalViews: 2847392,
    revenue: 89420
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', subscription: 'premium', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', subscription: 'free', joinDate: '2024-01-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', subscription: 'premium', joinDate: '2024-01-13' }
  ];

  const filteredMovies = mockMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'content', label: 'Content', icon: Film },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your CineStream platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Content</p>
                    <p className="text-2xl font-bold">{stats.totalContent}</p>
                  </div>
                  <Film className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Revenue</p>
                    <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Recent Users</h3>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.subscription === 'premium' 
                            ? 'bg-yellow-600 text-black' 
                            : 'bg-gray-700 text-white'
                        }`}>
                          {user.subscription}
                        </span>
                        <p className="text-gray-400 text-xs mt-1">{user.joinDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Popular Content</h3>
                <div className="space-y-4">
                  {mockMovies.slice(0, 5).map((movie) => (
                    <div key={movie.id} className="flex items-center space-x-3">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-12 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{movie.title}</p>
                        <p className="text-gray-400 text-sm">⭐ {movie.rating} • {movie.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Content Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search content..."
                    className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setShowAddContent(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Content</span>
                </button>
              </div>
            </div>

            {/* Content Table */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left p-4">Content</th>
                      <th className="text-left p-4">Type</th>
                      <th className="text-left p-4">Year</th>
                      <th className="text-left p-4">Rating</th>
                      <th className="text-left p-4">Views</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovies.map((movie) => (
                      <tr key={movie.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-12 h-16 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{movie.title}</p>
                              <p className="text-gray-400 text-sm">{movie.genre.join(', ')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            movie.type === 'movie' ? 'bg-blue-600' : 'bg-green-600'
                          }`}>
                            {movie.type}
                          </span>
                        </td>
                        <td className="p-4">{movie.year}</td>
                        <td className="p-4">⭐ {movie.rating}</td>
                        <td className="p-4">{Math.floor(Math.random() * 100000).toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">User Management</h3>
              <p className="text-gray-400">Manage user accounts, subscriptions, and permissions.</p>
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-center text-gray-400">User management interface would be implemented here</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Analytics Dashboard</h3>
              <p className="text-gray-400">View detailed analytics and insights about your platform.</p>
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-center text-gray-400">Analytics charts and graphs would be implemented here</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Content Modal */}
        {showAddContent && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add New Content</h2>
                <button
                  onClick={() => setShowAddContent(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Enter title"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Type</label>
                    <select className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600">
                      <option value="movie">Movie</option>
                      <option value="series">Series</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Year</label>
                    <input
                      type="number"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Duration</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="2h 30m"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="8.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Video Upload</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Drag and drop your video file here</p>
                    <p className="text-gray-500 text-sm">or click to browse</p>
                    <button
                      type="button"
                      className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors"
                  >
                    Add Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddContent(false)}
                    className="flex-1 bg-gray-700 text-white py-3 px-4 rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;