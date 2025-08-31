import { create } from 'zustand';
import { UserProfile, Badge } from '../types';

interface GameState {
  userProfile: UserProfile;
  badges: Badge[];
  updateXP: (xp: number) => void;
  unlockBadge: (badgeId: string) => void;
  setLanguage: (language: string) => void;
  setNativeLanguage: (language: string) => void;
  setUserName: (name: string) => void;
}

const DEFAULT_BADGES: Badge[] = [
  { id: 'first-chat', name: 'First Chat', description: 'Send your first message', icon: '💬' },
  { id: 'polyglot', name: 'Polyglot', description: 'Use 5 different languages', icon: '🌍' },
  { id: 'pronunciation-master', name: 'Pronunciation Master', description: 'Score 90%+ on pronunciation', icon: '🎯' },
  { id: 'conversationalist', name: 'Conversationalist', description: 'Complete 10 conversations', icon: '🗣️' },
  { id: 'native-speaker', name: 'Native Speaker', description: 'Complete native level exercises', icon: '⭐' },
  { id: 'role-player', name: 'Role Player', description: 'Complete 3 role-play scenarios', icon: '🎭' }
];

export const useGameStore = create<GameState>((set, get) => ({
  userProfile: {
    id: '1',
    name: 'Language Learner',
    level: 1,
    xp: 0,
    badges: [],
    currentLanguage: 'en',
    nativeLanguage: 'en'
  },
  badges: DEFAULT_BADGES,
  
  updateXP: (xp: number) => set((state) => {
    const newXP = state.userProfile.xp + xp;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    return {
      userProfile: {
        ...state.userProfile,
        xp: newXP,
        level: newLevel
      }
    };
  }),
  
  unlockBadge: (badgeId: string) => set((state) => {
    const badge = state.badges.find(b => b.id === badgeId);
    if (!badge || state.userProfile.badges.some(b => b.id === badgeId)) {
      return state;
    }
    
    const unlockedBadge = { ...badge, unlockedAt: new Date() };
    
    return {
      userProfile: {
        ...state.userProfile,
        badges: [...state.userProfile.badges, unlockedBadge]
      }
    };
  }),
  
  setLanguage: (language: string) => set((state) => ({
    userProfile: {
      ...state.userProfile,
      currentLanguage: language
    }
  })),
  
  setNativeLanguage: (language: string) => set((state) => ({
    userProfile: {
      ...state.userProfile,
      nativeLanguage: language
    }
  })),
  
  setUserName: (name: string) => set((state) => ({
    userProfile: {
      ...state.userProfile,
      name
    }
  }))
}));