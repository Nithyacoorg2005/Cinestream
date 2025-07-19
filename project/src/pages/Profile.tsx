import React, { useState } from 'react';
import { User, Edit3, Trash2, Plus, Save, X } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { profiles, currentProfile, createProfile, switchProfile, deleteProfile } = useProfile();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [newProfile, setNewProfile] = useState({
    name: '',
    avatar: '',
    isKid: false,
    language: 'en'
  });

  const avatarOptions = [
    'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  ];

  const handleCreateProfile = () => {
    if (newProfile.name.trim()) {
      createProfile({
        ...newProfile,
        avatar: newProfile.avatar || avatarOptions[0]
      });
      setNewProfile({ name: '', avatar: '', isKid: false, language: 'en' });
      setIsCreating(false);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length > 1 && window.confirm('Are you sure you want to delete this profile?')) {
      deleteProfile(profileId);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Profiles</h1>

        {/* Current User Info */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <p className="text-white">{user?.email}</p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Subscription</label>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.subscription === 'premium' 
                    ? 'bg-yellow-600 text-black' 
                    : 'bg-gray-700 text-white'
                }`}>
                  {user?.subscription === 'premium' ? 'Premium' : 'Free'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`relative group cursor-pointer ${
                currentProfile?.id === profile.id ? 'ring-2 ring-red-600' : ''
              }`}
            >
              <div
                onClick={() => switchProfile(profile.id)}
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
              >
                <div className="relative mb-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full aspect-square rounded-lg object-cover"
                  />
                  {profile.isKid && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      Kids
                    </span>
                  )}
                  {currentProfile?.id === profile.id && (
                    <div className="absolute inset-0 bg-red-600/20 rounded-lg flex items-center justify-center">
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                        Active
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-white font-medium text-center">{profile.name}</h3>
                <p className="text-gray-400 text-sm text-center">{profile.language.toUpperCase()}</p>
              </div>

              {/* Profile Actions */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProfile(profile.id);
                    }}
                    className="bg-black/60 text-white p-1 rounded hover:bg-black/80"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProfile(profile.id);
                      }}
                      className="bg-red-600/60 text-white p-1 rounded hover:bg-red-600/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Profile */}
          {profiles.length < 5 && (
            <div
              onClick={() => setIsCreating(true)}
              className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer border-2 border-dashed border-gray-700 hover:border-gray-600 flex flex-col items-center justify-center min-h-[200px]"
            >
              <Plus className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-gray-400">Add Profile</span>
            </div>
          )}
        </div>

        {/* Create Profile Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Create New Profile</h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Profile Name</label>
                  <input
                    type="text"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Enter profile name"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Avatar</label>
                  <div className="grid grid-cols-3 gap-3">
                    {avatarOptions.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => setNewProfile(prev => ({ ...prev, avatar }))}
                        className={`relative rounded-lg overflow-hidden ${
                          newProfile.avatar === avatar ? 'ring-2 ring-red-600' : ''
                        }`}
                      >
                        <img
                          src={avatar}
                          alt={`Avatar ${index + 1}`}
                          className="w-full aspect-square object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Language</label>
                  <select
                    value={newProfile.language}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isKid"
                    checked={newProfile.isKid}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, isKid: e.target.checked }))}
                    className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700 rounded focus:ring-red-600"
                  />
                  <label htmlFor="isKid" className="text-gray-300">
                    Kids Profile (content filtered for children)
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleCreateProfile}
                  disabled={!newProfile.name.trim()}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Create Profile</span>
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 bg-gray-700 text-white py-3 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Limits Info */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Profile Information</h3>
          <div className="space-y-3 text-gray-300">
            <p>• You can create up to 5 profiles per account</p>
            <p>• Kids profiles have content filtered for appropriate viewing</p>
            <p>• Each profile maintains its own watch history and preferences</p>
            <p>• Premium subscribers get additional profile customization options</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;