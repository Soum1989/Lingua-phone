import React from 'react';
import { Volume2, User, Bot } from 'lucide-react';
import { Message } from '../../types';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  onPlayAudio: (url: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onPlayAudio }) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-2 max-w-xs sm:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-purple-500'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-gray-800 border border-gray-200'
        }`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
          
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            
            {message.audioUrl && (
              <button
                onClick={() => onPlayAudio(message.audioUrl!)}
                className={`ml-2 p-1 rounded-full transition-colors ${
                  isUser 
                    ? 'hover:bg-blue-400 text-blue-100' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Volume2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};