
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { StudyContent, GeneratedImage } from '../types';
import { generateIllustration } from '../services/geminiService';
import { PlayCircle, Image as ImageIcon, Book, Share2, ArrowLeft, Mic, Sparkles, Bookmark, Check } from 'lucide-react';

interface StudyResultProps {
  data: StudyContent;
  onBack: () => void;
  onSave: (data: StudyContent) => void;
}

export const StudyResult: React.FC<StudyResultProps> = ({ data, onBack, onSave }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleSave = () => {
    onSave(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in px-4">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-amber-500 transition-colors group"
        >
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Voltar para Início</span>
        </button>

        <button 
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-medium ${
            isSaved 
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400" 
            : "bg-white dark:bg-stone-900 border-stone-200 dark:border-amber-900/50 text-stone-600 dark:text-amber-500 hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-sm"
          }`}
        >
          {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
          {isSaved ? "Salvo" : "Salvar Estudo"}
        </button>
      </div>

      {/* Header Section - Refactored for Prominent Theme */}
      <header className="text-center mb-16 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <Sparkles size={200} className="text-indigo-600 dark:text-amber-500" />
        </div>
        
        <div className="relative z-10 space-y-6">
          {/* Theme Banner */}
          <div className="inline-flex flex-col items-center">
            <div className="h-px w-12 bg-indigo-300 dark:bg-amber-600 mb-4 mx-auto"></div>
            <span className="text-indigo-600 dark:text-amber-500 font-serif italic text-xl md:text-2xl tracking-[0.2em] uppercase px-6">
              {data.theme}
            </span>
            <div className="h-px w-12 bg-indigo-300 dark:bg-amber-600 mt-4 mx-auto"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-stone-100 serif-font leading-tight drop-shadow-md max-w-3xl mx-auto">
            {data.title}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-stone-400 dark:text-stone-500">
             <div className="h-0.5 w-16 bg-stone-200 dark:bg-stone-800"></div>
             <Book size={18} />
             <div className="h-0.5 w-16 bg-stone-200 dark:bg-stone-800"></div>
          </div>
        </div>
      </header>

      {/* Intro & Key Verses Grid - "The Study Part" */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
           <div className="prose prose-stone prose-lg dark:prose-invert">
             <h3 className="serif-font text-2xl text-stone-800 dark:text-stone-100 border-l-4 border-indigo-300 dark:border-amber-600 pl-4 mb-4">Base do Estudo</h3>
             <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-lg italic">
               {data.introduction}
             </p>
           </div>
        </div>
        <div className="bg-white dark:bg-[#292524] p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 h-fit transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 opacity-10">
            <Book size={48} />
          </div>
          <h3 className="flex items-center gap-2 font-semibold text-stone-800 dark:text-amber-500 mb-4 border-b border-stone-100 dark:border-stone-700 pb-2">
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
         <h3 className="flex items-center gap-2 text-xl serif-font font-bold text-stone-800 dark:text-amber-500 mb-6 uppercase tracking-wider">
            <ImageIcon size={24} className="text-indigo-600 dark:text-amber-500" />
            Visualizando a Palavra
          </h3>
          
          {loadingImages ? (
            <div className="w-full h-64 bg-stone-100 dark:bg-stone-800 rounded-2xl flex flex-col items-center justify-center text-stone-400 dark:text-stone-600 animate-pulse border border-stone-200 dark:border-stone-700">
               <ImageIcon size={48} className="mb-2 opacity-50" />
               <p className="font-medium">Revelando ilustrações sagradas...</p>
            </div>
          ) : images.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {images.map((img, idx) => (
                <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-700">
                  <img src={img.url} alt={img.prompt} className="w-full h-72 object-cover transform group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                    <p className="text-white text-sm opacity-90 font-light leading-snug">{img.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 bg-stone-100 dark:bg-stone-800 rounded-2xl text-center text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 italic">
              Não foi possível gerar imagens no momento.
            </div>
          )}
      </div>

      {/* Main Sermon Body - "The Preaching Part" */}
      <div className="bg-white dark:bg-[#292524] p-8 md:p-16 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-700 mb-12 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 dark:from-amber-600 dark:via-yellow-500 dark:to-amber-600"></div>
        <div className="flex flex-col items-center gap-3 mb-12 pb-6 border-b border-stone-100 dark:border-stone-700">
            <Mic size={32} className="text-indigo-600 dark:text-amber-500 mb-2" />
            <h2 className="serif-font text-4xl font-bold text-stone-800 dark:text-amber-500 tracking-tight">O Mensageiro Proclama</h2>
            <div className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-[0.3em]">Sermão Textual Completo</div>
        </div>
        
        <div className="markdown-content text-xl text-stone-700 dark:text-stone-300 leading-[1.9] font-serif prose dark:prose-invert max-w-none first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-indigo-600 dark:first-letter:text-amber-500">
          <ReactMarkdown>{data.sermon_body}</ReactMarkdown>
        </div>
      </div>

      {/* Application & Conclusion */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-indigo-100 dark:border-amber-900/30 shadow-sm transition-colors relative">
           <div className="absolute -top-4 -left-4 bg-indigo-600 dark:bg-amber-600 text-white p-2 rounded-lg shadow-lg">
             <Sparkles size={20} />
           </div>
           <h3 className="serif-font text-2xl font-bold text-indigo-900 dark:text-amber-500 mb-4">Luz para o Caminho</h3>
           <p className="text-indigo-900/80 dark:text-stone-300 leading-relaxed text-lg">{data.practical_application}</p>
        </div>
        <div className="bg-stone-900 dark:bg-black p-8 rounded-3xl text-stone-100 border border-stone-800 shadow-2xl transition-all hover:scale-[1.01]">
           <h3 className="serif-font text-2xl font-bold text-amber-500 mb-4">O Convite do Mestre</h3>
           <p className="text-stone-200 italic leading-relaxed text-lg">{data.conclusion}</p>
        </div>
      </div>

      {/* Hymns Section */}
      <div className="bg-white dark:bg-[#292524] rounded-3xl shadow-xl border-t-4 border-red-500 dark:border-red-700 overflow-hidden transition-colors">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="serif-font text-3xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3">
              <PlayCircle size={32} className="text-red-500 dark:text-red-600" />
              Louvor & Adoração
            </h3>
            <span className="text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full border border-red-100 dark:border-red-900/30">
              Hinário Adventista do Sétimo Dia
            </span>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {data.hymns.map((hymn, idx) => (
              <div key={idx} className="group border border-stone-100 dark:border-stone-800 rounded-2xl p-6 hover:border-red-200 dark:hover:border-red-900 transition-all bg-stone-50/50 dark:bg-stone-900/50 hover:shadow-md">
                 <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-stone-800 dark:text-stone-100 group-hover:text-red-600 dark:group-hover:text-amber-500 transition-colors leading-tight">{hymn.title}</h4>
                    {hymn.number && <span className="text-[10px] bg-white dark:bg-stone-800 px-2 py-1 rounded-md text-stone-500 dark:text-stone-400 font-mono border border-stone-100 dark:border-stone-700 shadow-sm">#{hymn.number}</span>}
                 </div>
                 <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 line-clamp-3 italic leading-relaxed">"{hymn.reason}"</p>
                 <button 
                  onClick={() => handleYoutubeSearch(hymn.title, hymn.number)}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                 >
                   <PlayCircle size={18} />
                   Tocar no YouTube
                 </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-16 flex flex-col items-center gap-4 text-center border-t border-stone-200 dark:border-stone-800 pt-8">
         <div className="flex flex-wrap justify-center gap-4">
           <button 
             onClick={handleSave}
             disabled={isSaved}
             className="text-stone-600 dark:text-amber-500 hover:text-indigo-600 dark:hover:text-amber-400 transition-all flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-full bg-white dark:bg-stone-900 shadow-sm border border-stone-100 dark:border-stone-800 active:scale-95"
           >
              {isSaved ? <Check size={18} className="text-green-500" /> : <Bookmark size={18} />}
              {isSaved ? "Estudo Salvo no Histórico" : "Salvar nos Meus Estudos"}
           </button>
           <button className="text-stone-400 hover:text-indigo-600 dark:hover:text-amber-500 transition-all flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-full hover:bg-white dark:hover:bg-stone-900 shadow-sm">
              <Share2 size={18} /> Compartilhar esta Obra (Em breve)
           </button>
         </div>
      </div>

    </div>
  );
};
