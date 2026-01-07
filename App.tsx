
import React, { useState, useEffect } from 'react';
import { StudyInput } from './components/StudyInput';
import { StudyResult } from './components/StudyResult';
import { StudyTimeline } from './components/StudyTimeline';
import { StudyContent, TimelineEntry } from './types';
import { generateStudyContent } from './services/geminiService';
import { Cross, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [studyData, setStudyData] = useState<StudyContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<TimelineEntry[]>([]);

  // Initialize theme and history
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // History
    const savedHistory = localStorage.getItem('study_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const addToHistory = (data: StudyContent) => {
    // Check for duplicates in the last 10 items to avoid clutter
    const exists = history.some(item => item.title === data.title && item.theme === data.theme);
    if (exists) return;

    const newEntry: TimelineEntry = {
      id: crypto.randomUUID(),
      title: data.title,
      theme: data.theme,
      timestamp: Date.now(),
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem('study_history', JSON.stringify(updatedHistory));
  };

  const handleGenerate = async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateStudyContent(topic);
      setStudyData(data);
      // Automatically add to history when generated
      addToHistory(data);
    } catch (err) {
      setError("Houve um erro ao gerar o estudo. Por favor, tente novamente com um tema diferente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStudy = (data: StudyContent) => {
    addToHistory(data);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('study_history');
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
          <div className="flex flex-col items-center justify-center min-h-[70vh] py-10">
            <StudyInput onGenerate={handleGenerate} isLoading={loading} />
            
            {loading ? (
              <div className="mt-8 text-center text-stone-500 dark:text-amber-500/80 animate-pulse">
                <p className="mb-2 font-serif text-lg italic">"Lâmpada para os meus pés é a tua palavra..."</p>
                <p className="text-sm">Consultando as escrituras e preparando o sermão...</p>
              </div>
            ) : (
              <StudyTimeline history={history} onClear={clearHistory} onSelect={handleGenerate} />
            )}
          </div>
        ) : (
          <StudyResult data={studyData} onBack={handleReset} onSave={handleSaveStudy} />
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
