import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import { TranslationPrompt } from './TranslationPrompt';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useChatStore } from '../../store/chatStore';
import { useGameStore } from '../../store/gameStore';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

export const ChatInterface: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [showTranslationPrompt, setShowTranslationPrompt] = useState(false);
  const [lastTranscription, setLastTranscription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, currentLanguage, addMessage, setLoading } = useChatStore();
  const { userProfile, updateXP, unlockBadge } = useGameStore();

  const {
    isRecording,
    isPlaying,
    startRecording,
    stopRecording,
    playAudio
  } = useAudio();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    addMessage({
      text: inputText,
      sender: 'user',
      language: currentLanguage
    });

    // Award XP for first chat
    if (messages.length === 0) {
      unlockBadge('first-chat');
      updateXP(10);
      toast.success('Badge unlocked: First Chat! 💬');
    }

    setLoading(true);

    try {
      const response = await apiService.sendMessage(inputText, currentLanguage, userProfile.nativeLanguage);
      
      addMessage({
        text: response.message,
        sender: 'bot',
        language: currentLanguage,
        audioUrl: response.audioUrl
      });

      updateXP(5); // Award XP for conversation
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
      setInputText('');
      setShowTranslationPrompt(false);
    }
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      try {
        const recording = await stopRecording();
        if (recording) {
          setLoading(true);
          const transcription = await apiService.speechToText(recording.blob, currentLanguage);
          setInputText(transcription);
          setLastTranscription(transcription);
          setShowTranslationPrompt(true);
          toast.success('Speech transcribed successfully!');
        }
      } catch (error) {
        console.error('Error processing voice recording:', error);
        toast.error('Failed to process voice recording');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await startRecording();
        toast.success('Recording started');
      } catch (error) {
        console.error('Error starting recording:', error);
        toast.error('Failed to start recording');
      }
    }
  };

  const handleTranslation = async (targetLanguage: string) => {
    if (!lastTranscription) return;

    try {
      const response = await apiService.translateText(lastTranscription, targetLanguage);
      
      addMessage({
        text: `Translation to ${targetLanguage}: ${response.translatedText}`,
        sender: 'bot',
        language: targetLanguage
      });

      updateXP(3); // Award XP for translation
      toast.success(`Translated to ${targetLanguage}!`);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 mt-8"
          >
            <Volume2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Start a conversation!</p>
            <p className="text-sm">Type a message or use voice recording</p>
          </motion.div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onPlayAudio={playAudio}
          />
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Translation Prompt */}
      {showTranslationPrompt && lastTranscription && (
        <div className="px-4 py-2">
          <TranslationPrompt
            text={lastTranscription}
            onTranslate={handleTranslation}
            onDismiss={() => setShowTranslationPrompt(false)}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t px-4 py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice recording..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleVoiceRecording}
            disabled={isLoading}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:shadow-md'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-xl transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center"
          >
            <span className="text-sm text-red-600 animate-pulse flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <span>Recording... Click the microphone to stop</span>
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};