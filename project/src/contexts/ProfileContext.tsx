import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKid: boolean;
  language: string;
}

interface ProfileContextType {
  profiles: Profile[];
  currentProfile: Profile | null;
  createProfile: (profile: Omit<Profile, 'id'>) => void;
  switchProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

const defaultProfiles: Profile[] = [
  {
    id: '1',
    name: 'Main Profile',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isKid: false,
    language: 'en'
  }
];

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(defaultProfiles);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(defaultProfiles[0]);

  useEffect(() => {
    const storedProfiles = localStorage.getItem('cinestream_profiles');
    if (storedProfiles) {
      const parsed = JSON.parse(storedProfiles);
      setProfiles(parsed);
      setCurrentProfile(parsed[0] || null);
    }
  }, []);

  const createProfile = (profile: Omit<Profile, 'id'>) => {
    const newProfile: Profile = {
      ...profile,
      id: Date.now().toString()
    };
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem('cinestream_profiles', JSON.stringify(updatedProfiles));
  };

  const switchProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
    }
  };

  const deleteProfile = (profileId: string) => {
    if (profiles.length === 1) return; // Don't delete the last profile
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem('cinestream_profiles', JSON.stringify(updatedProfiles));
    
    if (currentProfile?.id === profileId) {
      setCurrentProfile(updatedProfiles[0] || null);
    }
  };

  return (
    <ProfileContext.Provider value={{
      profiles,
      currentProfile,
      createProfile,
      switchProfile,
      deleteProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};