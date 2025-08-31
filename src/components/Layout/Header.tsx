import React from 'react';
import { Languages, User, Settings } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface HeaderProps {
  onLanguageClick: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLanguageClick, onProfileClick }) => {
  const { userProfile } = useGameStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinguaBot
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* XP Display */}
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-gray-700">Level {userProfile.level}</span>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${(userProfile.xp % 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{userProfile.xp} XP</span>
            </div>

            {/* Language Button */}
            <button
              onClick={onLanguageClick}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">Language</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={onProfileClick}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};