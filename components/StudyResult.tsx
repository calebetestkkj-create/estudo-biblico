import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { StudyContent, GeneratedImage } from '../types';
import { generateIllustration } from '../services/geminiService';
import { PlayCircle, Image as ImageIcon, Book, Share2, ArrowLeft, Mic } from 'lucide-react';

interface StudyResultProps {
  data: StudyContent;
  onBack: () => void;
}

export const StudyResult: React.FC<StudyResultProps> = ({ data, onBack }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchImages = async () => {
      setLoadingImages(true);
      // Generate max 2 images to save time/resources, taking from the prompts provided by AI
      const promptsToUse = data.illustration_prompts.slice(0, 2);
      
      const generated: GeneratedImage[] = [];
      
      // Parallel generation
      await Promise.all(promptsToUse.map(async (prompt) => {
        const url = await generateIllustration(prompt);
        if (url && mounted) {
           generated.push({ url, prompt });
        }
      }));

      if (mounted) {
        setImages(generated);
        setLoadingImages(false);
      }
    };

    fetchImages();

    return () => { mounted = false; };
  }, [data]);

  const handleYoutubeSearch = (title: string, number?: string) => {
    // Specific search query for Adventist Hymnal
    const query = encodeURIComponent(`Hinário Adventista ${number ? number : ''} ${title}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-amber-500 transition-colors"
      >
        <ArrowLeft size={18} className="mr-1" />
        Novo Estudo
      </button>

      {/* Header Section */}
      <header className="text-center mb-12 space-y-4 border-b border-stone-200 dark:border-stone-700 pb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-amber-900/30 text-indigo-800 dark:text-amber-500 text-sm font-semibold tracking-wide uppercase border border-indigo-100 dark:border-amber-900/50">
          {data.theme}
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-stone-900 dark:text-amber-500 serif-font leading-tight drop-shadow-sm">
          {data.title}
        </h1>
      </header>

      {/* Intro & Key Verses Grid - "The Study Part" */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
           <div className="prose prose-stone prose-lg dark:prose-invert">
             <h3 className="serif-font text-2xl text-stone-800 dark:text-stone-100 border-l-4 border-indigo-300 dark:border-amber-600 pl-4 mb-4">Base do Estudo</h3>
             <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-lg">{data.introduction}</p>
           </div>
        </div>
        <div className="bg-white dark:bg-[#292524] p-6 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700 h-fit transition-colors">
          <h3 className="flex items-center gap-2 font-semibold text-stone-800 dark:text-amber-500 mb-4">
            <Book size={20} className="text-indigo-600 dark:text-amber-500" />
            Leitura Bíblica
          </h3>
          <ul className="space-y-4">
            {data.key_verses.map((verse, idx) => (
              <li key={idx} className="text-sm">
                <span className="block font-bold text-indigo-700 dark:text-amber-400 mb-1">{verse.reference}</span>
                <p className="text-stone-600 dark:text-stone-300 italic">"{verse.text}"</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-12">
         <h3 className="flex items-center gap-2 text-xl serif-font font-bold text-stone-800 dark:text-amber-500 mb-6">
            <ImageIcon size={24} className="text-indigo-600 dark:text-amber-500" />
            Ilustrações para Compreensão
          </h3>
          
          {loadingImages ? (
            <div className="w-full h-64 bg-stone-100 dark:bg-stone-800 rounded-xl flex flex-col items-center justify-center text-stone-400 dark:text-stone-600 animate-pulse border border-stone-200 dark:border-stone-700">
               <ImageIcon size={48} className="mb-2 opacity-50" />
               <p>Criando imagens baseadas no texto...</p>
            </div>
          ) : images.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="group relative rounded-xl overflow-hidden shadow-md border border-stone-200 dark:border-stone-700">
                  <img src={img.url} alt={img.prompt} className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-xs opacity-90 line-clamp-2">{img.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-center text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
              Não foi possível gerar imagens no momento.
            </div>
          )}
      </div>

      {/* Main Sermon Body - "The Preaching Part" */}
      <div className="bg-white dark:bg-[#292524] p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 mb-12 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-amber-600 dark:to-yellow-500"></div>
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100 dark:border-stone-700">
            <Mic size={28} className="text-indigo-600 dark:text-amber-500" />
            <h2 className="serif-font text-3xl font-bold text-stone-800 dark:text-amber-500">Pregação Completa</h2>
        </div>
        
        <div className="markdown-content text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-serif prose dark:prose-invert max-w-none">
          <ReactMarkdown>{data.sermon_body}</ReactMarkdown>
        </div>
      </div>

      {/* Application & Conclusion */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-indigo-50 dark:bg-stone-800 p-8 rounded-2xl border border-indigo-100 dark:border-stone-700 transition-colors">
           <h3 className="serif-font text-2xl font-bold text-indigo-900 dark:text-amber-500 mb-4">Aplicação Prática</h3>
           <p className="text-indigo-900/80 dark:text-stone-300 leading-relaxed">{data.practical_application}</p>
        </div>
        <div className="bg-stone-800 dark:bg-black p-8 rounded-2xl text-stone-100 border border-transparent dark:border-stone-800 shadow-xl">
           <h3 className="serif-font text-2xl font-bold text-white dark:text-amber-500 mb-4">Apelo Final</h3>
           <p className="text-stone-300 leading-relaxed">{data.conclusion}</p>
        </div>
      </div>

      {/* Hymns Section */}
      <div className="bg-white dark:bg-[#292524] rounded-xl shadow-lg border-t-4 border-red-500 dark:border-red-700 overflow-hidden transition-colors">
        <div className="p-8">
          <h3 className="serif-font text-2xl font-bold text-stone-800 dark:text-stone-200 mb-6 flex items-center gap-2">
            <PlayCircle size={24} className="text-red-500 dark:text-red-600" />
            Louvor - Hinário Adventista
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {data.hymns.map((hymn, idx) => (
              <div key={idx} className="border border-stone-200 dark:border-stone-700 rounded-lg p-4 hover:border-red-200 dark:hover:border-red-900 transition-colors bg-stone-50/50 dark:bg-stone-800/50">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-stone-800 dark:text-amber-500">{hymn.title}</h4>
                    {hymn.number && <span className="text-xs bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded text-stone-600 dark:text-stone-300 font-mono">HASD {hymn.number}</span>}
                 </div>
                 <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 line-clamp-2">{hymn.reason}</p>
                 <button 
                  onClick={() => handleYoutubeSearch(hymn.title, hymn.number)}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-medium rounded shadow-sm flex items-center justify-center gap-2 transition-colors"
                 >
                   <PlayCircle size={16} />
                   Ouvir no YouTube
                 </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
         <button onClick={onBack} className="text-stone-400 hover:text-indigo-600 dark:hover:text-amber-500 transition-colors flex items-center justify-center gap-2 mx-auto">
            <Share2 size={16} /> Compartilhar Pregação (Em breve)
         </button>
      </div>

    </div>
  );
};