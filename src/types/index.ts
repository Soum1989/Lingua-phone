export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language: string;
  audioUrl?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface UserProfile {
  id: string;
  name: string;
  level: number;
  xp: number;
  badges: Badge[];
  currentLanguage: string;
  nativeLanguage: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface PronunciationExercise {
  id: string;
  text: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'native';
  scenario: string;
  expectedPronunciation: string;
}

export interface RolePlayScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  conversations: Conversation[];
  xpReward: number;
}

export interface Conversation {
  id: string;
  speaker: string;
  text: string;
  responses: Response[];
}

export interface Response {
  id: string;
  text: string;
  nextConversationId?: string;
  xpBonus?: number;
}

export interface VoiceRecording {
  blob: Blob;
  url: string;
  duration: number;
}