import { RolePlayScenario, PronunciationExercise } from '../types';

export const ROLEPLAY_SCENARIOS: RolePlayScenario[] = [
  {
    id: 'market-shopping',
    title: 'Market Shopping',
    description: 'Practice buying fruits and vegetables at a local market',
    difficulty: 'beginner',
    language: 'en',
    xpReward: 50,
    conversations: [
      {
        id: 'market-1',
        speaker: 'Vendor',
        text: 'Welcome to my shop! What would you like to buy today?',
        responses: [
          { id: 'r1', text: 'I need some fresh tomatoes', nextConversationId: 'market-2a' },
          { id: 'r2', text: 'Do you have any mangoes?', nextConversationId: 'market-2b' },
          { id: 'r3', text: 'Just looking around', nextConversationId: 'market-2c' }
        ]
      },
      {
        id: 'market-2a',
        speaker: 'Vendor',
        text: 'Yes! These tomatoes are very fresh. How many kilos do you want?',
        responses: [
          { id: 'r4', text: 'Two kilos please', nextConversationId: 'market-3a', xpBonus: 10 },
          { id: 'r5', text: 'How much per kilo?', nextConversationId: 'market-3b' }
        ]
      }
    ]
  },
  {
    id: 'hotel-reservation',
    title: 'Hotel Reservation',
    description: 'Book a room and handle check-in procedures',
    difficulty: 'intermediate',
    language: 'en',
    xpReward: 75,
    conversations: [
      {
        id: 'hotel-1',
        speaker: 'Receptionist',
        text: 'Good evening! How can I help you today?',
        responses: [
          { id: 'r1', text: 'I have a reservation under John Smith', nextConversationId: 'hotel-2a' },
          { id: 'r2', text: 'I need a room for tonight', nextConversationId: 'hotel-2b' }
        ]
      }
    ]
  },
  {
    id: 'police-station',
    title: 'Police Station',
    description: 'Report a missing item and communicate with authorities',
    difficulty: 'advanced',
    language: 'en',
    xpReward: 100,
    conversations: [
      {
        id: 'police-1',
        speaker: 'Officer',
        text: 'How can we assist you today?',
        responses: [
          { id: 'r1', text: 'I want to report a missing wallet', nextConversationId: 'police-2a' },
          { id: 'r2', text: 'I need help with directions', nextConversationId: 'police-2b' }
        ]
      }
    ]
  }
];

export const PRONUNCIATION_EXERCISES: PronunciationExercise[] = [
  // Beginner Level
  {
    id: 'greet-1',
    text: 'Hello, how are you?',
    language: 'en',
    difficulty: 'beginner',
    scenario: 'Basic Greetings',
    expectedPronunciation: 'heh-LOH, how are you'
  },
  {
    id: 'greet-2',
    text: 'Good morning',
    language: 'en',
    difficulty: 'beginner',
    scenario: 'Basic Greetings',
    expectedPronunciation: 'good MOR-ning'
  },
  
  // Intermediate Level
  {
    id: 'market-1',
    text: 'Excuse me, how much does this cost?',
    language: 'en',
    difficulty: 'intermediate',
    scenario: 'Market Shopping',
    expectedPronunciation: 'ex-KYOOZ me, how much does this cost'
  },
  {
    id: 'hotel-1',
    text: 'I would like to check in please',
    language: 'en',
    difficulty: 'intermediate',
    scenario: 'Hotel Reservation',
    expectedPronunciation: 'I would like to check in please'
  },
  
  // Native Level
  {
    id: 'business-1',
    text: 'We need to reschedule the quarterly review meeting',
    language: 'en',
    difficulty: 'native',
    scenario: 'Business Meeting',
    expectedPronunciation: 'we need to ree-SHED-yool the QUAR-ter-ly ree-VIEW MEE-ting'
  },
  {
    id: 'academic-1',
    text: 'The hypothesis requires further investigation and analysis',
    language: 'en',
    difficulty: 'native',
    scenario: 'Academic Discussion',
    expectedPronunciation: 'the hy-POTH-eh-sis ree-KWIRES FUR-ther in-ves-ti-GAY-shun and ah-NAL-eh-sis'
  }
];