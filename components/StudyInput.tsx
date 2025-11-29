import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface StudyInputProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
}

export const StudyInput: React.FC<StudyInputProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-8 py-12 px-4">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-indigo-100 dark:bg-stone-800 rounded-full text-indigo-700 dark:text-amber-500 transition-colors">
            <BookOpen size={32} />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-amber-500 serif-font tracking-tight transition-colors">
          Estudo & Pregação
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-300 max-w-lg mx-auto transition-colors">
          Digite seu tema ou texto bíblico. A IA criará o <strong>estudo teológico</strong>, a <strong>pregação completa</strong>, imagens ilustrativas e selecionará <strong>hinos</strong> para você.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-amber-600 dark:to-yellow-700 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-white dark:bg-[#292524] rounded-lg shadow-xl transition-colors">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Sermão sobre a Graça, Estudo de Daniel 2..."
              className="w-full p-5 rounded-l-lg outline-none text-stone-700 dark:text-stone-200 text-lg bg-transparent placeholder-stone-400 dark:placeholder-stone-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="p-5 text-indigo-600 dark:text-amber-500 hover:text-indigo-800 dark:hover:text-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-indigo-600 dark:border-amber-500 border-t-transparent rounded-full" />
              ) : (
                <>
                  <span className="hidden sm:inline">Gerar</span>
                  <Sparkles size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      
      {/* Suggestions */}
      <div className="flex flex-wrap justify-center gap-2 text-sm text-stone-500 dark:text-stone-400">
        <span>Tente pedir:</span>
        {['A Volta de Jesus', 'O Santuário', 'Salvação pela Graça', 'Os 10 Mandamentos'].map((s) => (
          <button 
            key={s} 
            onClick={() => onGenerate(s)}
            className="hover:text-indigo-600 dark:hover:text-amber-500 hover:underline transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};