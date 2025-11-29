import React, { useState, useEffect } from 'react';
import { StudyInput } from './components/StudyInput';
import { StudyResult } from './components/StudyResult';
import { StudyContent } from './types';
import { generateStudyContent } from './services/geminiService';
import { Cross, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [studyData, setStudyData] = useState<StudyContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme based on preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleGenerate = async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateStudyContent(topic);
      setStudyData(data);
    } catch (err) {
      setError("Houve um erro ao gerar o estudo. Por favor, tente novamente com um tema diferente.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudyData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#1c1917] text-stone-800 dark:text-stone-200 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-[#292524] border-b border-stone-200 dark:border-stone-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={handleReset}>
              <div className="bg-indigo-600 dark:bg-amber-600 p-1.5 rounded-lg text-white transition-colors duration-300 shadow-md">
                 <Cross size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-stone-800 dark:text-amber-500 serif-font group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                BibliaAI
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-stone-500 dark:text-stone-400 hidden sm:block">
                Estudos Bíblicos & Pregações
              </div>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-stone-600 dark:text-amber-500"
                aria-label="Alternar tema"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {!studyData ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <StudyInput onGenerate={handleGenerate} isLoading={loading} />
            
            {loading && (
              <div className="mt-8 text-center text-stone-500 dark:text-amber-500/80 animate-pulse">
                <p className="mb-2 font-serif text-lg italic">"Lâmpada para os meus pés é a tua palavra..."</p>
                <p className="text-sm">Consultando as escrituras e preparando o sermão...</p>
              </div>
            )}
          </div>
        ) : (
          <StudyResult data={studyData} onBack={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#292524] border-t border-stone-200 dark:border-stone-700 py-8 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-stone-400 dark:text-stone-500 text-sm">
          <p>© {new Date().getFullYear()} BibliaAI. Desenvolvido para inspirar.</p>
          <p className="mt-2 text-xs">O conteúdo gerado por IA deve ser analisado à luz da Bíblia.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;