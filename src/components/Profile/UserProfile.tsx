import React, { useState } from 'react';
import { Edit3, Save, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { LANGUAGES, getLanguageByCode } from '../../data/languages';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { userProfile, setUserName, setNativeLanguage } = useGameStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editNativeLanguage, setEditNativeLanguage] = useState(userProfile.nativeLanguage);

  const handleSave = () => {
    setUserName(editName);
    setNativeLanguage(editNativeLanguage);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(userProfile.name);
    setEditNativeLanguage(userProfile.nativeLanguage);
    setIsEditing(false);
  };

  const currentLanguage = getLanguageByCode(userProfile.currentLanguage);
  const nativeLanguage = getLanguageByCode(userProfile.nativeLanguage);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Profile</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Picture & Level */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-white">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-gray-800">Level {userProfile.level}</div>
                  <div className="text-sm text-gray-600">{userProfile.xp} XP</div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800">{userProfile.name}</p>
                    )}
                  </div>

                  {/* Native Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Native Language</label>
                    {isEditing ? (
                      <select
                        value={editNativeLanguage}
                        onChange={(e) => setEditNativeLanguage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{nativeLanguage?.flag}</span>
                        <span className="text-gray-800">{nativeLanguage?.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Current Chat Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Chat Language</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{currentLanguage?.flag}</span>
                      <span className="text-gray-800">{currentLanguage?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Badges Summary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recent Badges</label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.badges.slice(-3).map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center space-x-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full"
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-xs font-medium text-yellow-800">{badge.name}</span>
                      </div>
                    ))}
                    {userProfile.badges.length === 0 && (
                      <p className="text-sm text-gray-500">No badges earned yet</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};