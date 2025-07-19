import React, { useState } from 'react';
import { Trophy, Star, Target, Award, Users, TrendingUp, Calendar, Gift } from 'lucide-react';
import { useGamification } from '../contexts/GamificationContext';
import { useAuth } from '../contexts/AuthContext';

const Gamification: React.FC = () => {
  const { user } = useAuth();
  const { userStats, getLeaderboard } = useGamification();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard' | 'badges'>('overview');

  const leaderboard = getLeaderboard();

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getLevelProgress = () => {
    const currentLevelXP = (userStats.level - 1) * 1000;
    const nextLevelXP = userStats.level * 1000;
    const progress = userStats.xp - currentLevelXP;
    const total = nextLevelXP - currentLevelXP;
    return (progress / total) * 100;
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'watch_time': return '⏱️';
      case 'movies_watched': return '🎬';
      case 'series_completed': return '📺';
      case 'streak': return '🔥';
      case 'social': return '👥';
      default: return '🏆';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users },
    { id: 'badges', label: 'Badges', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your CineStream Journey</h1>
          <p className="text-gray-400">Track your progress, earn rewards, and compete with friends</p>
        </div>

        {/* Level & XP Display */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 rounded-lg p-6 mb-8 border border-red-600/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">{userStats.level}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Level {userStats.level}</h2>
                <p className="text-gray-400">CineStream Explorer</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-500">{userStats.xp.toLocaleString()} XP</p>
              <p className="text-gray-400">{userStats.xpToNextLevel} XP to next level</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Watch Time</h3>
                  <div className="text-2xl">⏱️</div>
                </div>
                <p className="text-3xl font-bold text-blue-400">{Math.floor(userStats.totalWatchTime / 60)}h</p>
                <p className="text-gray-400 text-sm">{userStats.totalWatchTime % 60}m total</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Movies Watched</h3>
                  <div className="text-2xl">🎬</div>
                </div>
                <p className="text-3xl font-bold text-green-400">{userStats.moviesWatched}</p>
                <p className="text-gray-400 text-sm">Movies completed</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Series Completed</h3>
                  <div className="text-2xl">📺</div>
                </div>
                <p className="text-3xl font-bold text-purple-400">{userStats.seriesCompleted}</p>
                <p className="text-gray-400 text-sm">Full series watched</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Current Streak</h3>
                  <div className="text-2xl">🔥</div>
                </div>
                <p className="text-3xl font-bold text-orange-400">{userStats.currentStreak}</p>
                <p className="text-gray-400 text-sm">Days in a row</p>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {userStats.achievements
                  .filter(a => a.completed)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl">{getAchievementIcon(achievement.type)}</div>
                      <div className="flex-1">
                        <h4 className="font-bold">{achievement.title}</h4>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-500 font-bold">+{achievement.points} XP</p>
                        {achievement.unlockedAt && (
                          <p className="text-gray-500 text-xs">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userStats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    achievement.completed
                      ? 'bg-green-900/20 border-green-600'
                      : 'bg-gray-900 border-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`text-3xl ${achievement.completed ? '' : 'grayscale opacity-50'}`}>
                      {getAchievementIcon(achievement.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 ${
                        achievement.completed ? 'text-green-400' : 'text-white'
                      }`}>
                        {achievement.title}
                        {achievement.completed && <span className="ml-2">✓</span>}
                      </h3>
                      <p className="text-gray-400 mb-3">{achievement.description}</p>
                      
                      {!achievement.completed && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.requirement}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${getProgressPercentage(achievement.progress, achievement.requirement)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-500 font-bold">+{achievement.points} XP</span>
                        {achievement.completed && achievement.unlockedAt && (
                          <span className="text-green-400 text-sm">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Global Leaderboard</h3>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-lg ${
                      entry.user === 'You' ? 'bg-red-900/30 border border-red-600' : 'bg-gray-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? 'bg-yellow-600 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-orange-600 text-black' :
                      'bg-gray-600 text-white'
                    }`}>
                      {entry.rank}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold">{entry.user}</h4>
                      <p className="text-gray-400 text-sm">Level {entry.level}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold">{entry.xp.toLocaleString()} XP</p>
                      {entry.rank <= 3 && (
                        <div className="text-xl">
                          {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Leaderboard Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-600">
                  <div className="text-3xl mb-2">🥇</div>
                  <h4 className="font-bold text-yellow-400">1st Place</h4>
                  <p className="text-sm text-gray-400">Premium subscription + exclusive badge</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <div className="text-3xl mb-2">🥈</div>
                  <h4 className="font-bold text-gray-400">2nd Place</h4>
                  <p className="text-sm text-gray-400">50% off premium + silver badge</p>
                </div>
                <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-600">
                  <div className="text-3xl mb-2">🥉</div>
                  <h4 className="font-bold text-orange-400">3rd Place</h4>
                  <p className="text-sm text-gray-400">25% off premium + bronze badge</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userStats.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gray-900 rounded-lg p-6 text-center hover:bg-gray-800 transition-colors"
                >
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h3 className="font-bold mb-2">{badge.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{badge.description}</p>
                  {badge.unlockedAt && (
                    <p className="text-green-400 text-xs">
                      Earned {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">How to Earn More Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                  <div className="text-2xl">🍿</div>
                  <div>
                    <h4 className="font-bold">Movie Lover</h4>
                    <p className="text-gray-400 text-sm">Watch 25 movies</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                  <div className="text-2xl">📺</div>
                  <div>
                    <h4 className="font-bold">Series Addict</h4>
                    <p className="text-gray-400 text-sm">Complete 10 series</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                  <div className="text-2xl">🦉</div>
                  <div>
                    <h4 className="font-bold">Night Owl</h4>
                    <p className="text-gray-400 text-sm">Watch after midnight 10 times</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                  <div className="text-2xl">🐦</div>
                  <div>
                    <h4 className="font-bold">Early Bird</h4>
                    <p className="text-gray-400 text-sm">Watch before 6 AM 5 times</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gamification;