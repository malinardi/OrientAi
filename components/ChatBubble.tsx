
import React from 'react';
import { Message } from '../types';
import { IPAM_ORANGE } from '../constants';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-orange-600' : 'bg-gray-100'}`}>
          {isUser ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          ) : (
            <span className="font-bold text-xs" style={{ color: IPAM_ORANGE }}>OA</span>
          )}
        </div>
        
        <div className={`px-4 py-2 rounded-2xl ${
          isUser 
            ? 'bg-orange-50 text-gray-800' 
            : 'bg-white text-gray-800 shadow-sm border border-gray-100'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          <div className={`text-[10px] mt-1 ${isUser ? 'text-orange-400 text-right' : 'text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
