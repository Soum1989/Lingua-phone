import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useGameStore } from '../../store/gameStore';
import { useAudio } from '../../hooks/useAudio';
import { apiService } from '../../services/api';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import toast from 'react-hot-toast';

export const ChatInterface: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const { messages, isLoading, currentLanguage, addMessage, setLoading } = useChatStore();
  const { userProfile, updateXP, unlockBadge } = useGameStore();
  const { isRecording, startRecording, stopRecording, playAudio } = useAudio();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    addMessage({
      text,
      sender: 'user',
      language: currentLanguage
    });

    setInputText('');
    setLoading(true);

    try {
      const response = await apiService.sendMessage(text, currentLanguage, userProfile.nativeLanguage);
      
      // Add bot response
      addMessage({
        text: response.message,
        sender: 'bot',
        language: currentLanguage,
        audioUrl: response.audioUrl
      });

      // Award XP for conversation
      updateXP(10);
      
      // Check for first chat badge
      if (messages.length === 0) {
        unlockBadge('first-chat');
        toast.success('Badge unlocked: First Chat! 🎉');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      const recording = await stopRecording();
      if (recording) {
        try {
          setLoading(true);
          const transcribedText = await apiService.speechToText(recording.blob, currentLanguage);
          setInputText(transcribedText);
          toast.success('Voice input captured!');
        } catch (error) {
          console.error('Error transcribing audio:', error);
          toast.error('Failed to transcribe audio. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    } else {
      try {
        await startRecording();
        toast.success('Recording started. Speak now!');
      } catch (error) {
        console.error('Error starting recording:', error);
        toast.error('Failed to start recording. Please check microphone permissions.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Welcome to LinguaBot! 🌍
              </h3>
              <p className="text-gray-600">
                Start chatting in any language. I'll help you communicate seamlessly!
              </p>
            </div>
          </div>
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

      {/* Input Container */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder={`Type a message in ${currentLanguage === 'en' ? 'English' : 'your chosen language'}...`}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};