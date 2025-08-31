import React, { useState } from 'react';
import { Play, Mic, RotateCcw, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { PRONUNCIATION_EXERCISES } from '../../data/scenarios';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';
import { apiService } from '../../services/api';
import { PronunciationExercise, PronunciationScore } from '../../types';
import toast from 'react-hot-toast';

export const PronunciationTrainer: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'native'>('beginner');
  const [currentExercise, setCurrentExercise] = useState<PronunciationExercise | null>(null);
  const [score, setScore] = useState<PronunciationScore | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  
  const { isRecording, startRecording, stopRecording } = useAudio();
  const { userProfile, updateXP, unlockBadge } = useGameStore();

  const exercises = PRONUNCIATION_EXERCISES.filter(ex => ex.difficulty === selectedDifficulty);

  const startExercise = (exercise: PronunciationExercise) => {
    setCurrentExercise(exercise);
    setScore(null);
  };

  const handleRecordAndScore = async () => {
    if (!currentExercise) return;

    if (isRecording) {
      const recording = await stopRecording();
      if (recording) {
        setIsScoring(true);
        try {
          const pronunciationScore = await apiService.scorePronunciation(
            recording.blob,
            currentExercise.text,
            currentExercise.language
          );
          
          setScore(pronunciationScore);
          
          // Award XP based on score
          const xpGain = Math.round(pronunciationScore.overall * 2);
          updateXP(xpGain);
          
          // Check for pronunciation badges
          if (pronunciationScore.overall >= 90) {
            unlockBadge('pronunciation-master');
            toast.success('Badge unlocked: Pronunciation Master! 🎯');
          }
          
          toast.success(`Great job! You scored ${pronunciationScore.overall}%`);
          
        } catch (error) {
          console.error('Error scoring pronunciation:', error);
          toast.error('Failed to score pronunciation');
        } finally {
          setIsScoring(false);
        }
      }
    } else {
      await startRecording();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'native': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pronunciation Trainer</h2>
          <p className="text-gray-600">Practice your pronunciation and get instant feedback!</p>
        </div>

        {/* Difficulty Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Difficulty</h3>
          <div className="grid grid-cols-3 gap-3">
            {['beginner', 'intermediate', 'native'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty as any)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Selection */}
        {!currentExercise && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Exercises
            </h3>
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <motion.button
                  key={exercise.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startExercise(exercise)}
                  className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{exercise.text}</p>
                      <p className="text-sm text-gray-600">{exercise.scenario}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Current Exercise */}
        {currentExercise && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Practice Exercise</h3>
              <button
                onClick={() => setCurrentExercise(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-medium text-gray-800 mb-2">{currentExercise.text}</p>
                <p className="text-sm text-gray-600">Scenario: {currentExercise.scenario}</p>
                <p className="text-xs text-gray-500 mt-1">Expected: {currentExercise.expectedPronunciation}</p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleRecordAndScore}
                  disabled={isScoring}
                  className={`px-8 py-4 rounded-full text-white font-medium transition-all ${
                    isRecording
                      ? 'bg-red-500 animate-pulse'
                      : isScoring
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Mic className="w-5 h-5" />
                    <span>
                      {isRecording ? 'Recording...' : isScoring ? 'Scoring...' : 'Record & Score'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Score Display */}
              {score && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <h4 className="font-semibold text-gray-800 mb-3">Your Score</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(score.overall)}`}>
                        {score.overall}%
                      </div>
                      <div className="text-sm text-gray-600">Overall</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Accuracy:</span>
                        <span className={`font-medium ${getScoreColor(score.accuracy)}`}>{score.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Fluency:</span>
                        <span className={`font-medium ${getScoreColor(score.fluency)}`}>{score.fluency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Completeness:</span>
                        <span className={`font-medium ${getScoreColor(score.completeness)}`}>{score.completeness}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {score.feedback && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{score.feedback}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};