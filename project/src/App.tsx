import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Browse from './pages/Browse';
import MovieDetail from './pages/MovieDetail';
import VideoPlayer from './pages/VideoPlayer';
import Profile from './pages/Profile';
import MyList from './pages/MyList';
import Admin from './pages/Admin';
import WatchParty from './pages/WatchParty';
import Auth from './pages/Auth';
import Subscription from './pages/Subscription';
import ActorDetail from './pages/ActorDetail';
import InteractiveMovie from './pages/InteractiveMovie';
import LiveStream from './pages/LiveStream';
import Gamification from './pages/Gamification';
import Store from './pages/Store';
import GuestMode from './pages/GuestMode';
import SceneNavigation from './pages/SceneNavigation';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { StoreProvider } from './contexts/StoreContext';
import { NotificationProvider } from './contexts/NotificationContext';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationCenter from './components/NotificationCenter';
import './styles/animations.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !isInitialized) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/guest" element={<GuestMode />} />
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <NotificationCenter />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/series/:id" element={<MovieDetail />} />
          <Route path="/watch/:id" element={<VideoPlayer />} />
          <Route path="/interactive/:id" element={<InteractiveMovie />} />
          <Route path="/scenes/:id" element={<SceneNavigation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/watch-party/:id" element={<WatchParty />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/actor/:id" element={<ActorDetail />} />
          <Route path="/live" element={<LiveStream />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/store" element={<Store />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <ProfileProvider>
              <GamificationProvider>
                <StoreProvider>
                  <AppContent />
                </StoreProvider>
              </GamificationProvider>
            </ProfileProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;