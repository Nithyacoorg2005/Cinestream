import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'watch_time' | 'movies_watched' | 'series_completed' | 'streak' | 'social';
  requirement: number;
  progress: number;
  completed: boolean;
  unlockedAt?: Date;
}

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalWatchTime: number;
  moviesWatched: number;
  seriesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  achievements: Achievement[];
  rank: number;
}

interface GamificationContextType {
  userStats: UserStats;
  addXP: (amount: number, reason: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateWatchTime: (minutes: number) => void;
  completeMovie: () => void;
  completeSeries: () => void;
  updateStreak: () => void;
  getLeaderboard: () => Array<{ user: string; level: number; xp: number; rank: number }>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

const defaultAchievements: Achievement[] = [
  {
    id: 'first_watch',
    title: 'First Steps',
    description: 'Watch your first movie or episode',
    points: 100,
    type: 'movies_watched',
    requirement: 1,
    progress: 0,
    completed: false
  },
  {
    id: 'movie_buff',
    title: 'Movie Buff',
    description: 'Watch 10 movies',
    points: 500,
    type: 'movies_watched',
    requirement: 10,
    progress: 0,
    completed: false
  },
  {
    id: 'binge_watcher',
    title: 'Binge Watcher',
    description: 'Watch for 5 hours in a day',
    points: 300,
    type: 'watch_time',
    requirement: 300,
    progress: 0,
    completed: false
  },
  {
    id: 'series_master',
    title: 'Series Master',
    description: 'Complete 5 series',
    points: 750,
    type: 'series_completed',
    requirement: 5,
    progress: 0,
    completed: false
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Watch content for 7 consecutive days',
    points: 400,
    type: 'streak',
    requirement: 7,
    progress: 0,
    completed: false
  }
];

const defaultBadges: Badge[] = [
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'Welcome to CineStream!',
    icon: '🎬'
  },
  {
    id: 'movie_lover',
    name: 'Movie Lover',
    description: 'Watched 25 movies',
    icon: '🍿'
  },
  {
    id: 'series_addict',
    name: 'Series Addict',
    description: 'Completed 10 series',
    icon: '📺'
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Watch after midnight 10 times',
    icon: '🦉'
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Watch before 6 AM 5 times',
    icon: '🐦'
  }
];

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    totalWatchTime: 0,
    moviesWatched: 0,
    seriesCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: [defaultBadges[0]],
    achievements: defaultAchievements,
    rank: 1
  });

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`cinestream_gamification_${user.id}`);
      if (stored) {
        setUserStats(JSON.parse(stored));
      }
    }
  }, [user]);

  const saveStats = (stats: UserStats) => {
    if (user) {
      localStorage.setItem(`cinestream_gamification_${user.id}`, JSON.stringify(stats));
    }
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
  };

  const addXP = (amount: number, reason: string) => {
    setUserStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > prev.level;
      
      const newStats = {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: (newLevel * 1000) - newXP
      };

      saveStats(newStats);

      // Show notification for XP gain
      if (leveledUp) {
        // Level up notification would be shown here
      }

      return newStats;
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setUserStats(prev => {
      const achievements = prev.achievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.completed) {
          addXP(achievement.points, `Achievement: ${achievement.title}`);
          return {
            ...achievement,
            completed: true,
            unlockedAt: new Date()
          };
        }
        return achievement;
      });

      const newStats = { ...prev, achievements };
      saveStats(newStats);
      return newStats;
    });
  };

  const updateWatchTime = (minutes: number) => {
    setUserStats(prev => {
      const newWatchTime = prev.totalWatchTime + minutes;
      const newStats = { ...prev, totalWatchTime: newWatchTime };
      
      // Check for watch time achievements
      const binge = prev.achievements.find(a => a.id === 'binge_watcher');
      if (binge && !binge.completed && minutes >= 300) {
        unlockAchievement('binge_watcher');
      }

      addXP(minutes * 2, 'Watch time');
      saveStats(newStats);
      return newStats;
    });
  };

  const completeMovie = () => {
    setUserStats(prev => {
      const newMoviesWatched = prev.moviesWatched + 1;
      const newStats = { ...prev, moviesWatched: newMoviesWatched };

      // Check achievements
      if (newMoviesWatched === 1) {
        unlockAchievement('first_watch');
      }
      if (newMoviesWatched === 10) {
        unlockAchievement('movie_buff');
      }

      addXP(50, 'Movie completed');
      saveStats(newStats);
      return newStats;
    });
  };

  const completeSeries = () => {
    setUserStats(prev => {
      const newSeriesCompleted = prev.seriesCompleted + 1;
      const newStats = { ...prev, seriesCompleted: newSeriesCompleted };

      if (newSeriesCompleted === 5) {
        unlockAchievement('series_master');
      }

      addXP(200, 'Series completed');
      saveStats(newStats);
      return newStats;
    });
  };

  const updateStreak = () => {
    setUserStats(prev => {
      const newStreak = prev.currentStreak + 1;
      const newLongestStreak = Math.max(newStreak, prev.longestStreak);
      const newStats = {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongestStreak
      };

      if (newStreak === 7) {
        unlockAchievement('streak_warrior');
      }

      addXP(newStreak * 10, 'Daily streak');
      saveStats(newStats);
      return newStats;
    });
  };

  const getLeaderboard = () => {
    // Mock leaderboard data
    return [
      { user: 'You', level: userStats.level, xp: userStats.xp, rank: 1 },
      { user: 'MovieMaster2024', level: 15, xp: 14500, rank: 2 },
      { user: 'SeriesAddict', level: 12, xp: 11800, rank: 3 },
      { user: 'BingeWatcher', level: 10, xp: 9200, rank: 4 },
      { user: 'CinemaLover', level: 8, xp: 7600, rank: 5 }
    ].sort((a, b) => b.xp - a.xp).map((user, index) => ({ ...user, rank: index + 1 }));
  };

  return (
    <GamificationContext.Provider value={{
      userStats,
      addXP,
      unlockAchievement,
      updateWatchTime,
      completeMovie,
      completeSeries,
      updateStreak,
      getLeaderboard
    }}>
      {children}
    </GamificationContext.Provider>
  );
};