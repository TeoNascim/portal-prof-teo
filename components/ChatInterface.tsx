
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { Message } from '../types';
import { UNASP_COLORS, ASSISTANT_NAME } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: `Olá! Sou o **${ASSISTANT_NAME}**, o assistente inteligente do Portal Acadêmico.\n\nEstou aqui para te ajudar com normas de **Relatório Científico**, **ABNT** e dúvidas sobre o **Estágio Supervisionado** conforme as diretrizes do UNASP-HT.\n\nComo posso ajudar hoje?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini([...messages, userMsg]);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: UNASP_COLORS.primary }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm">{ASSISTANT_NAME}</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Online • Consultando Manuais</p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-5 py-3.5 rounded-3xl text-[13px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
              }`}
              style={msg.role === 'user' ? { backgroundColor: UNASP_COLORS.primary } : {}}
            >
              <div className="whitespace-pre-wrap">
                {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-3 rounded-3xl rounded-bl-none border border-slate-100 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua dúvida acadêmica..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 pr-16 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all resize-none outline-none min-h-[60px]"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl text-white disabled:bg-slate-200 transition-all hover:scale-110 active:scale-95 shadow-md"
            style={{ backgroundColor: input.trim() ? UNASP_COLORS.primary : undefined }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
