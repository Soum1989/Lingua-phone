import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import { TranslationPrompt } from './TranslationPrompt';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTranslation?: boolean;
  originalText?: string;
  language?: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslationPrompt, setShowTranslationPrompt] = useState(false);
  const [lastTranscription, setLastTranscription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isRecording,
    startRecording,
    stopRecording,
    isSupported
  } = useAudio({
    onTranscriptionComplete: (text: string) => {
      setInputText(text);
      setLastTranscription(text);
      setShowTranslationPrompt(true);
      toast.success('Speech transcribed successfully!');
    },
    onError: (error: string) => {
      toast.error(error);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I received your message!',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setInputText('');
      setShowTranslationPrompt(false);
    }
  };

  const handleTranslation = async (targetLanguage: string) => {
    if (!lastTranscription) return;

    try {
      const response = await fetch('/api/translation/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: lastTranscription,
          targetLanguage
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();

      const translationMessage: Message = {
        id: Date.now().toString(),
        text: data.translatedText,
        sender: 'bot',
        timestamp: new Date(),
        isTranslation: true,
        originalText: lastTranscription,
        language: targetLanguage
      };

      setMessages(prev => [...prev, translationMessage]);
      toast.success(`Translated to ${targetLanguage}!`);
    } catch (error) {
      toast.error('Translation failed');
      console.error('Translation error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Lingua-phone</h1>
        <p className="text-gray-600">AI-powered language learning assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Volume2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">Start a conversation!</p>
            <p className="text-sm">Type a message or use voice recording</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.isTranslation
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              {message.isTranslation && (
                <div className="text-xs text-green-600 mb-1">
                  Translation to {message.language}
                </div>
              )}
              <p className="text-sm">{message.text}</p>
              {message.isTranslation && message.originalText && (
                <div className="text-xs text-green-600 mt-1 italic">
                  Original: "{message.originalText}"
                </div>
              )}
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Translation Prompt */}
      {showTranslationPrompt && lastTranscription && (
        <div className="px-6 py-2">
          <TranslationPrompt
            text={lastTranscription}
            onTranslate={handleTranslation}
            onDismiss={() => setShowTranslationPrompt(false)}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice recording..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          {isSupported && (
            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className={`p-3 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {isRecording && (
          <div className="mt-2 text-center">
            <span className="text-sm text-red-600 animate-pulse">
              🎙️ Recording... Click the microphone to stop
            </span>
          </div>
        )}
      </div>
    </div>
  );
};