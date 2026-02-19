
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { PageID, Post, Subject, Material, ChatMessage } from './types';
import { INITIAL_SUBJECTS, PORTAL_NAME, UNASP_COLORS, ADMIN_CREDENTIALS } from './constants';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageID>('disciplinas');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [userName, setUserName] = useState(() => localStorage.getItem('chat_user_name') || '');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  useEffect(() => {
    const loadData = async () => {
      const savedPosts = localStorage.getItem('supabase_posts_mirror');
      const savedSubjects = localStorage.getItem('supabase_subjects_mirror');
      const savedChat = localStorage.getItem('supabase_chat_mirror');
      
      if (savedPosts) setPosts(JSON.parse(savedPosts));
      if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
      if (savedChat) setChatMessages(JSON.parse(savedChat));
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('supabase_posts_mirror', JSON.stringify(posts));
    localStorage.setItem('supabase_subjects_mirror', JSON.stringify(subjects));
    localStorage.setItem('supabase_chat_mirror', JSON.stringify(chatMessages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts, subjects, chatMessages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === ADMIN_CREDENTIALS.email && loginForm.password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
    } else {
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    if (!userName.trim()) {
      const name = prompt('Por favor, digite seu nome para participar do chat:');
      if (name) {
        setUserName(name);
        localStorage.setItem('chat_user_name', name);
      } else return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: userName || 'Aluno',
      text: chatInput,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
  };

  const addPost = (category: PageID, title: string, content: string) => {
    const imageUrl = prompt('URL da Imagem (opcional - deixe em branco para ignorar):') || undefined;
    const newPost: Post = {
      id: Date.now().toString(),
      category,
      title,
      content,
      imageUrl,
      date: new Date().toLocaleDateString('pt-BR'),
      author: 'Prof. Téo'
    };
    setPosts([newPost, ...posts]);
  };

  const deletePost = (postId: string) => {
    if (confirm('Deseja realmente excluir esta postagem?')) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const addMaterialToSubject = (subjectId: string) => {
    const name = prompt('Nome do Material:');
    if (!name) return;
    
    const type = prompt('Tipo do arquivo (Ex: PDF, DOCX, Link):') || 'Link';
    const url = prompt('Cole o Link do arquivo (Google Drive, Dropbox, etc):') || '#';
    
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const newMaterial: Material = { id: Date.now().toString(), name, type, url };
        return { ...s, materials: [...(s.materials || []), newMaterial] };
      }
      return s;
    }));
  };

  const deleteMaterial = (subjectId: string, materialId: string) => {
    if (confirm('Deseja realmente excluir este material?')) {
      setSubjects(prev => prev.map(s => {
        if (s.id === subjectId) {
          return { ...s, materials: s.materials?.filter(m => m.id !== materialId) };
        }
        return s;
      }));
    }
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const renderDisciplinas = () => {
    if (selectedSubjectId && selectedSubject) {
      return (
        <div className="space-y-8 animate-fade-in">
          <button 
            onClick={() => setSelectedSubjectId(null)}
            className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para Disciplinas
          </button>
          
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedSubject.name}</h2>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Ano: {selectedSubject.year} • Materiais e Recursos</p>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => addMaterialToSubject(selectedSubject.id)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Inserir novo material
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Materiais Padrão Estáticos (Apenas exemplo visual se necessário) */}
              <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">📄</span>
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Plano de Ensino</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Documento Oficial • PDF</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>

              {/* Materiais Dinâmicos */}
              {selectedSubject.materials?.map((material) => (
                <div 
                  key={material.id} 
                  className="flex items-center justify-between p-6 rounded-2xl bg-white border-2 border-blue-50 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group relative"
                  onClick={() => material.url && window.open(material.url, '_blank')}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">
                      {material.type.toUpperCase().includes('PDF') ? '📕' : material.type.toUpperCase().includes('DOC') ? '📘' : '📎'}
                    </span>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{material.name}</p>
                      <p className="text-[10px] text-blue-400 font-bold uppercase">Material de Apoio • {material.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-200 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    {isAdmin && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMaterial(selectedSubject.id, material.id);
                        }}
                        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 rounded-[40px] bg-blue-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
               <div className="relative z-10 text-center md:text-left">
                 <h3 className="text-xl font-black mb-2 tracking-tight">Dúvidas sobre o conteúdo?</h3>
                 <p className="text-blue-200 text-sm max-w-sm">Use o nosso Agente de IA especializado para tirar dúvidas sobre as normas técnicas desta disciplina.</p>
               </div>
               <button 
                 onClick={() => setActivePage('agente')}
                 className="relative z-10 bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1"
               >
                 Consultar Mentor IA
               </button>
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>
          </div>
        </div>
      );
    }

    const years = Array.from(new Set(subjects.map(s => s.year))).sort((a: number, b: number) => b - a);
    return (
      <div className="space-y-10 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Grade de Disciplinas</h2>
          {isAdmin && (
            <button 
              onClick={() => {
                const name = prompt('Nome da Disciplina:');
                if(name) setSubjects([...subjects, { id: Date.now().toString(), year: 2026, name, materials: [] }]);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all w-full md:w-auto"
            >
              + Nova Disciplina (2026)
            </button>
          )}
        </div>
        {years.map(year => (
          <section key={year}>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-black text-blue-600">{year}</span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {subjects.filter(s => s.year === year).map(subject => (
                <div key={subject.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight flex-grow">{subject.name}</h3>
                  <button 
                    onClick={() => setSelectedSubjectId(subject.id)}
                    className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 mt-6 group-hover:gap-3 transition-all p-3 rounded-xl bg-blue-50/50 hover:bg-blue-600 hover:text-white"
                  >
                    Acessar Material 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case 'disciplinas':
        return renderDisciplinas();

      case 'agente':
        return <ChatInterface />;

      case 'chat':
        return (
          <div className="flex flex-col h-full bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Mural de Mensagens</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Espaço de interação entre acadêmicos (Realtime)</p>
               </div>
               {userName && (
                 <button onClick={() => { setUserName(''); localStorage.removeItem('chat_user_name'); }} className="text-[10px] text-blue-600 font-bold uppercase hover:underline">Alterar Nome</button>
               )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/10">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <span className="text-5xl mb-4">💬</span>
                  <p className="text-sm font-medium">Seja o primeiro a enviar uma mensagem!</p>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === userName ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[10px] font-black text-slate-400 uppercase">{msg.sender}</span>
                       <span className="text-[9px] text-slate-300 font-medium">{msg.time}</span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === userName ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escreva sua mensagem no mural..."
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        );

      case 'estagio':
        return (
          <div className="max-w-4xl mx-auto space-y-12 py-4 animate-fade-in">
            <header className="border-b border-slate-200 pb-10">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Estágio Supervisionado</h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">Recursos e informações essenciais para a realização e regulamentação do seu estágio em Educação Física.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">📋</div>
                <h3 className="text-xl font-black text-slate-800 mb-4">Estágio Obrigatório</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Parte das exigências do curso. Verifique a quantidade de horas necessárias e o módulo inicial via Portal do Aluno.</p>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">💼</div>
                <h3 className="text-xl font-black text-slate-800 mb-4">Não Obrigatório</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Opcional para experiência extra. Exige bolsa-auxílio, transporte e seguro. Pode contar como Atividades Complementares.</p>
              </div>
            </section>

            <section className="bg-slate-900 text-white p-10 md:p-12 rounded-[50px] relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-3xl font-black mb-6 tracking-tight">Regulamentação (Lei 11.788)</h2>
                 <ul className="space-y-4 text-slate-300 font-medium text-sm">
                   <li className="flex items-start gap-3">
                     <span className="text-blue-400 text-xl">✔</span>
                     O TCE deve ser assinado ANTES do início do estágio.
                   </li>
                   <li className="flex items-start gap-3">
                     <span className="text-blue-400 text-xl">✔</span>
                     Jornada máxima de 6 horas por dia (30 horas por semana).
                   </li>
                   <li className="flex items-start gap-3">
                     <span className="text-blue-400 text-xl">✔</span>
                     Estágios sem documentação são irregulares e as horas não contam.
                   </li>
                 </ul>
               </div>
               <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </section>

            <section className="space-y-8">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Licenciatura UNASP-HT</h2>
               <div className="bg-white border border-blue-100 p-8 rounded-[40px] space-y-6 shadow-sm">
                 <p className="text-slate-600 font-medium">Roteiro para alunos de Licenciatura:</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: 'Etapas de Estágio', desc: '100h cada (Infantil, Fund I, Fund II e Médio)' },
                      { title: 'Relatório de Campo', desc: 'Preencher para cada aula ou dia de estágio' },
                      { title: 'Portfólio', desc: 'Entregar via portal no relatório final' },
                      { title: 'Ficha de Horas', desc: 'Antiga ficha de horas com registros oficiais' }
                    ].map((item, i) => (
                      <div key={i} className="p-5 bg-blue-50/30 border border-blue-50 rounded-2xl">
                        <h4 className="font-black text-blue-900 text-xs uppercase tracking-widest mb-1">{item.title}</h4>
                        <p className="text-slate-500 text-xs font-medium">{item.desc}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
                    <span className="text-2xl">💡</span>
                    <p className="text-amber-800 text-sm font-bold leading-relaxed">Toda a documentação deve ser organizada via Portal do Aluno. Em caso de irregularidade, você será acionado pelo sistema.</p>
                 </div>
               </div>
            </section>

            <section className="pb-10">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Arquivos e Documentos</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Relatório de Campo', 'Portfólio de Estágio', 'Ficha de Horas'].map((doc, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">📄</span>
                        <span className="text-sm font-black text-slate-700">{doc}</span>
                      </div>
                      <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </div>
                  ))}
               </div>
            </section>

            <footer className="pt-10 border-t border-slate-200 text-center">
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Dúvidas? Entre em contato</p>
               <p className="text-slate-900 font-black text-lg">Professor Téo</p>
            </footer>
          </div>
        );

      default:
        const pagePosts = posts.filter(p => p.category === activePage);
        return (
          <div className="max-w-4xl mx-auto space-y-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-8 mb-10 gap-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter capitalize">
                {activePage}
              </h2>
              {isAdmin && (
                <button 
                  onClick={() => {
                    const title = prompt('Título:');
                    const content = prompt('Conteúdo:');
                    if(title && content) addPost(activePage, title, content);
                  }}
                  className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Nova Postagem
                </button>
              )}
            </div>
            {pagePosts.length === 0 ? (
              <div className="bg-white p-12 rounded-[40px] border border-dashed border-slate-200 text-center">
                <p className="text-slate-400 font-medium">Nenhuma informação postada nesta seção ainda.</p>
              </div>
            ) : (
              pagePosts.map(post => (
                <article key={post.id} className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{post.author}</span>
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{post.date}</span>
                    </div>
                    {isAdmin && (
                       <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-600">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    )}
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-6 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{post.title}</h3>
                  
                  {post.imageUrl && (
                    <div className="mb-8 rounded-3xl overflow-hidden shadow-inner bg-slate-100">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[400px] object-cover hover:scale-105 transition-transform duration-700" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}

                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap text-base">
                    {post.content}
                  </div>
                </article>
              ))
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden relative">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">{PORTAL_NAME}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-black text-[10px] uppercase tracking-[0.2em]">{activePage}</span>
            </div>
            <div className="sm:hidden font-black text-slate-900 text-[10px] uppercase tracking-widest">{activePage}</div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
             <button 
                onClick={() => isAdmin ? setIsAdmin(false) : setShowLoginModal(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black transition-all border ${
                  isAdmin ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
             >
               <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
               <span className="hidden xs:inline">MODO ADMIN</span> {isAdmin ? 'ON' : 'OFF'}
             </button>
             <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>

      {showLoginModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-fade-in border border-slate-100">
            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black">T</div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Login Professor</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Acesso Restrito ao Prof. Téo</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                  <input 
                    type="email" 
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    placeholder="ter.teo13@gmail.com"
                    className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                  <input 
                    type="password" 
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all"
                  />
               </div>
               <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                  >
                    Entrar
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (max-width: 480px) {
          .xs\\:inline { display: none; }
        }
      `}</style>
    </div>
  );
};

export default App;
