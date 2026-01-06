
import React from 'react';
import { ChatSession, Language } from '../types';
import { IPAM_ORANGE, TRANSLATIONS } from '../constants';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  language: Language;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onClearChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, currentSessionId, language, onNewChat, onSelectSession, onClearChat }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-64 h-full bg-[#f8f9fa] border-r border-gray-200 flex flex-col p-4">
      <button
        onClick={onNewChat}
        className="flex items-center gap-3 px-4 py-3 mb-2 bg-white border border-gray-200 rounded-full hover:shadow-md transition-shadow text-sm font-medium text-gray-700 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={IPAM_ORANGE} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {t.newChat}
      </button>

      <button
        onClick={onClearChat}
        className="flex items-center gap-3 px-4 py-2 mb-6 text-xs text-gray-500 hover:text-red-500 transition-colors w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {t.clearChat}
      </button>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">{t.recentChats}</h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                session.id === currentSessionId
                  ? 'bg-orange-50 text-orange-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {session.title || 'Conversa sem título'}
            </button>
          ))}
          {sessions.length === 0 && (
            <p className="text-xs text-gray-400 px-3 italic">{t.noRecent}</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
            IP
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-gray-700 truncate">{t.role}</p>
            <p className="text-xs text-gray-500 truncate">{t.course}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
