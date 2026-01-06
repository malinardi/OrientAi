
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatSession, Language } from './types';
import { IPAM_ORANGE, TRANSLATIONS } from './constants';
import Sidebar from './components/Sidebar';
import ChatBubble from './components/ChatBubble';
import { generateOrientAiResponse } from './services/gemini';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [language, setLanguage] = useState<Language>('pt-PT');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (sessions.length === 0) {
      handleNewChat();
    }

    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript || interimTranscript) {
          setInput(finalTranscript || interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        // Silence "no-speech" error as it is a natural timeout when user stops talking
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error:', event.error);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Sync recognition language with app language state
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'pt-PT' ? 'pt-PT' : 'en-US';
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, isLoading]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: '',
      messages: [],
      updatedAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleClearChat = () => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [],
          title: '',
          updatedAt: new Date()
        };
      }
      return s;
    }));
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Stop listening if user clicks send
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, userMsg],
          title: s.title || text.substring(0, 40) + (text.length > 40 ? '...' : ''),
          updatedAt: new Date()
        };
      }
      return s;
    }));

    setInput('');
    setIsLoading(true);

    const currentSession = sessions.find(s => s.id === currentSessionId);
    const history = currentSession ? currentSession.messages : [];
    
    const responseText = await generateOrientAiResponse(text, history, language);

    const assistantMsg: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, assistantMsg],
          updatedAt: new Date()
        };
      }
      return s;
    }));
    
    setIsLoading(false);
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        sessions={sessions} 
        currentSessionId={currentSessionId}
        language={language}
        onNewChat={handleNewChat}
        onSelectSession={setCurrentSessionId}
        onClearChat={handleClearChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <div className="font-bold text-xl flex items-center gap-1">
               <span className="text-gray-900">Orient</span>
               <span style={{ color: IPAM_ORANGE }}>Ai</span>
             </div>
             <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">{t.badge}</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setLanguage('pt-PT')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'pt-PT' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                PT
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                EN
              </button>
            </div>
            
            <img 
              src="https://www.ipam.pt/sites/default/files/logo-ipam.png" 
              alt="Logo IPAM" 
              className="h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </header>

        {/* Chat Area */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-4xl mx-auto w-full">
            {currentSession && currentSession.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center mt-20 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">{t.welcome}</h2>
                <p className="text-gray-500 max-w-md mb-8">
                  {t.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {t.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="p-4 text-left border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all text-sm text-gray-700 shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              currentSession?.messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))
            )}
            {isLoading && (
              <div className="flex justify-start mb-8 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="w-4 h-4 bg-orange-200 rounded-full"></div>
                  </div>
                  <div className="bg-gray-50 h-10 w-32 rounded-2xl"></div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto relative">
            <div className={`flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border transition-all shadow-sm ${isListening ? 'border-orange-400 bg-orange-50 ring-2 ring-orange-100' : 'border-transparent focus-within:border-orange-400 focus-within:bg-white'}`}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(input);
                  }
                }}
                placeholder={isListening ? (language === 'pt-PT' ? 'Ouvindo...' : 'Listening...') : t.placeholder}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-4 text-sm custom-scrollbar max-h-32"
                rows={1}
              />
              
              <div className="flex items-center gap-1 pr-2">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-all relative ${
                    isListening ? 'text-orange-600 bg-orange-100' : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                  title={language === 'pt-PT' ? 'Falar mensagem' : 'Speak message'}
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-xl bg-orange-500 animate-ping opacity-25"></span>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                <button
                  disabled={!input.trim() || isLoading}
                  onClick={() => handleSendMessage(input)}
                  className={`p-2 rounded-xl transition-colors ${
                    !input.trim() || isLoading ? 'text-gray-300' : 'text-orange-600 hover:bg-orange-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
