
import React from 'react';
import { TimelineEntry } from '../types';
import { Calendar, BookMarked, Trash2 } from 'lucide-react';

interface StudyTimelineProps {
  history: TimelineEntry[];
  onClear: () => void;
  onSelect: (topic: string) => void;
}

export const StudyTimeline: React.FC<StudyTimelineProps> = ({ history, onClear, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 px-4 animate-fade-in">
      <div className="flex items-center justify-between mb-8 border-b border-stone-200 dark:border-stone-800 pb-4">
        <h2 className="text-2xl font-bold serif-font text-stone-800 dark:text-amber-500 flex items-center gap-2">
          <BookMarked size={24} />
          Linha do Tempo de Estudos
        </h2>
        <button 
          onClick={onClear}
          className="text-xs text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Trash2 size={14} /> Limpar Histórico
        </button>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-200 before:via-indigo-400 before:to-transparent dark:before:from-amber-900 dark:before:via-amber-600 dark:before:to-transparent">
        {history.map((item, index) => (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon Dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-stone-900 bg-stone-50 dark:bg-stone-800 text-indigo-600 dark:text-amber-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-transform group-hover:scale-110 duration-300">
              <Calendar size={16} />
            </div>
            
            {/* Card Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#292524] shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-amber-600 transition-all cursor-pointer"
                 onClick={() => onSelect(item.title)}>
              <div className="flex items-center justify-between mb-1">
                <time className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                  {new Date(item.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </time>
                <span className="text-[10px] bg-indigo-50 dark:bg-amber-900/20 text-indigo-600 dark:text-amber-500 px-2 py-0.5 rounded-full font-bold uppercase">
                  {item.theme}
                </span>
              </div>
              <h4 className="text-stone-800 dark:text-stone-100 font-bold serif-font text-lg leading-tight group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                {item.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
