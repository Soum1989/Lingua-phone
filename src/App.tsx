import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { ChatInterface } from './components/Chat/ChatInterface';
import { PronunciationTrainer } from './components/Pronunciation/PronunciationTrainer';
import { RolePlayInterface } from './components/RolePlay/RolePlayInterface';
import { AchievementsView } from './components/Gamification/AchievementsView';
import { LanguageSelector } from './components/Language/LanguageSelector';
import { UserProfile } from './components/Profile/UserProfile';

function App() {
  const [activeView, setActiveView] = useState('chat');
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatInterface />;
      case 'pronunciation':
        return <PronunciationTrainer />;
      case 'roleplay':
        return <RolePlayInterface />;
      case 'achievements':
        return <AchievementsView />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onLanguageClick={() => setIsLanguageSelectorOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderActiveView()}
      </main>
      
      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <LanguageSelector
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
      />

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
    </div>
  );
}

export default App;