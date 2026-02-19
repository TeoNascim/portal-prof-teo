
export type PageID = 'disciplinas' | 'tcc' | 'extensao' | 'estagio' | 'avisos' | 'chat' | 'agente';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export interface Material {
  id: string;
  name: string;
  type: string;
}

export interface Post {
  id: string;
  category: PageID;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Subject {
  id: string;
  year: number;
  name: string;
  description?: string;
  materials?: Material[];
}

export interface Deadline {
  id: string;
  task: string;
  date: string;
  category: 'TCC' | 'Estágio';
}
