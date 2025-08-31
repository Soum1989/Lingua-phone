import React, { useState } from 'react';
import { Play, Users, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROLEPLAY_SCENARIOS } from '../../data/scenarios';
import { RolePlayScenario } from '../../types';
import { useGameStore } from '../../store/gameStore';
import toast from 'react-hot-toast';

export const RolePlayInterface: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<RolePlayScenario | null>(null);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  
  const { updateXP, unlockBadge } = useGameStore();

  const handleScenarioSelect = (scenario: RolePlayScenario) => {
    setSelectedScenario(scenario);
    setCurrentConversationIndex(0);
  };

  const handleResponseSelect = (responseId: string, nextConversationId?: string, xpBonus?: number) => {
    if (xpBonus) {
      updateXP(xpBonus);
    }

    if (nextConversationId) {
      const nextIndex = selectedScenario?.conversations.findIndex(c => c.id === nextConversationId);
      if (nextIndex !== -1) {
        setCurrentConversationIndex(nextIndex!);
      }
    } else {
      // Scenario completed
      if (selectedScenario) {
        updateXP(selectedScenario.xpReward);
        setCompletedScenarios(prev => [...prev, selectedScenario.id]);
        
        // Check for role-play badge
        if (completedScenarios.length + 1 >= 3) {
          unlockBadge('role-player');
          toast.success('Badge unlocked: Role Player! 🎭');
        }
        
        toast.success(`Scenario completed! +${selectedScenario.xpReward} XP`);
        setSelectedScenario(null);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (selectedScenario) {
    const currentConversation = selectedScenario.conversations[currentConversationIndex];
    
    return (
      <div className="h-full bg-gray-50 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Scenario Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{selectedScenario.title}</h2>
              <button
                onClick={() => setSelectedScenario(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Exit Scenario
              </button>
            </div>
            <p className="text-gray-600">{selectedScenario.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedScenario.difficulty)}`}>
                {selectedScenario.difficulty}
              </span>
              <span className="text-sm text-gray-500">+{selectedScenario.xpReward} XP</span>
            </div>
          </div>

          {/* Current Conversation */}
          <motion.div
            key={currentConversation.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-gray-800">{currentConversation.speaker}</span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{currentConversation.text}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Your response:</h4>
              {currentConversation.responses.map((response) => (
                <motion.button
                  key={response.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleResponseSelect(response.id, response.nextConversationId, response.xpBonus)}
                  className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">{response.text}</span>
                    <div className="flex items-center space-x-2">
                      {response.xpBonus && (
                        <span className="text-xs text-blue-600 font-medium">+{response.xpBonus} XP</span>
                      )}
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Role-Play Scenarios</h2>
          <p className="text-gray-600">Practice real-world conversations in interactive scenarios</p>
        </div>

        {/* Scenarios Grid */}
        <div className="space-y-4">
          {ROLEPLAY_SCENARIOS.map((scenario) => (
            <motion.div
              key={scenario.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleScenarioSelect(scenario)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{scenario.title}</h3>
                  <p className="text-gray-600 mt-1">{scenario.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {completedScenarios.includes(scenario.id) && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <Play className="w-5 h-5 text-blue-500" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty}
                </span>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Award className="w-4 h-4" />
                  <span>+{scenario.xpReward} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};