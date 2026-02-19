
import React from 'react';
import { UNASP_COLORS, PORTAL_NAME } from '../constants';
import { PageID } from '../types';

interface SidebarProps {
  activePage: PageID;
  setActivePage: (page: PageID) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const menuItems: { id: PageID; label: string; icon: React.ReactNode }[] = [
    { id: 'disciplinas', label: 'Disciplinas', icon: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { id: 'tcc', label: 'TCC', icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { id: 'extensao', label: 'Extensão', icon: <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /> },
    { id: 'estagio', label: 'Estágio', icon: <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
    { id: 'avisos', label: 'Avisos', icon: <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> },
    { id: 'chat', label: 'Chat Alunos', icon: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
    { id: 'agente', label: 'Agente IA', icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" /> },
  ];

  const handlePageSelect = (id: PageID) => {
    setActivePage(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl lg:shadow-sm
        transition-transform duration-300 transform lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl"
              style={{ backgroundColor: UNASP_COLORS.primary }}
            >
              T
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 tracking-tight text-xl">{PORTAL_NAME}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Portal Acadêmico</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePageSelect(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activePage === item.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={activePage === item.id ? 2.5 : 2}
              >
                {item.icon}
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Powered By</span>
            <a href="https://17web.com.br" target="_blank" className="flex items-center gap-2 group">
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                <path d="M20 5L35 12.5L20 20L5 12.5L20 5Z" fill="#38BDF8" className="opacity-80"/>
                <path d="M20 12L35 19.5L20 27L5 19.5L20 12Z" fill="#0EA5E9" className="opacity-90"/>
                <path d="M20 19L35 26.5L20 34L5 26.5L20 19Z" fill="#10B981"/>
              </svg>
              <span className="text-lg font-black text-slate-800 tracking-tighter group-hover:text-blue-600 transition-colors">17web</span>
            </a>
            <p className="text-[9px] text-slate-400 mt-2 font-medium">© Todos direitos reservados.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
