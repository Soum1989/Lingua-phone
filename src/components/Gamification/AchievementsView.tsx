import React from 'react';
import { Trophy, Lock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export const AchievementsView: React.FC = () => {
  const { userProfile, badges } = useGameStore();

  const unlockedBadges = userProfile.badges;
  const lockedBadges = badges.filter(badge => !unlockedBadges.some(ub => ub.id === badge.id));

  const getXPProgress = () => {
    const currentLevelXP = userProfile.xp % 100;
    return currentLevelXP;
  };

  const getNextLevelXP = () => {
    return 100 - getXPProgress();
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Profile Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-blue-100">Language Explorer</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">Level {userProfile.level}</div>
              <div className="text-sm text-blue-100">{userProfile.xp} XP Total</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getXPProgress()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm text-blue-100 mt-2">{getNextLevelXP()} XP to next level</p>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
          </div>

          {/* Unlocked Badges */}
          {unlockedBadges.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Unlocked ({unlockedBadges.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unlockedBadges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800">{badge.name}</h5>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                        {badge.unlockedAt && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {badge.unlockedAt.toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Available to Unlock ({lockedBadges.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 opacity-75"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <span className="text-2xl filter grayscale">{badge.icon}</span>
                        <Lock className="absolute -top-1 -right-1 w-3 h-3 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-600">{badge.name}</h5>
                        <p className="text-sm text-gray-500">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{unlockedBadges.length}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedScenarios.length}</div>
              <div className="text-sm text-gray-600">Scenarios Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};