
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { StudyContent, GeneratedImage } from '../types';
import { generateIllustration } from '../services/geminiService';
import { 
  PlayCircle, 
  Image as ImageIcon, 
  Book, 
  Share2, 
  ArrowLeft, 
  Mic, 
  Sparkles, 
  Bookmark, 
  Check, 
  Printer, 
  Copy 
} from 'lucide-react';

interface StudyResultProps {
  data: StudyContent;
  onBack: () => void;
  onSave: (data: StudyContent) => void;
}

export const StudyResult: React.FC<StudyResultProps> = ({ data, onBack, onSave }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchImages = async () => {
      setLoadingImages(true);
      const promptsToUse = data.illustration_prompts.slice(0, 2);
      const generated: GeneratedImage[] = [];
      
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
    const query = encodeURIComponent(`Hinário Adventista ${number ? number : ''} ${title}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const handleSave = () => {
    onSave(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleShare = async () => {
    const shareText = `*Estudo Bíblico: ${data.title}*\n\nTema: ${data.theme}\n\n${data.introduction}\n\nVersículos Chave:\n${data.key_verses.map(v => `- ${v.reference}: ${v.text}`).join('\n')}\n\nGerado via BibliaAI.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: shareText,
          url: window.location.href
        });
        setShareFeedback("Compartilhado!");
      } catch (err) {
        if ((err as Error).name !== 'AbortError') handleCopyFallback(shareText);
      }
    } else {
      handleCopyFallback(shareText);
    }
  };

  const handleCopyFallback = (text: string) => {
    navigator.clipboard.writeText(text);
    setShareFeedback("Copiado!");
    setTimeout(() => setShareFeedback(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in px-4 print:p-0">
      {/* Navigation & Action Bar - Hidden on print */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-amber-500 transition-colors group"
        >
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-900 transition-all shadow-sm"
            title="Imprimir Estudo"
          >
            <Printer size={18} />
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
            {isSaved ? "Salvo" : "Salvar"}
          </button>
        </div>
      </div>

      {/* Header Section */}
      <header className="text-center mb-16 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none print:hidden">
          <Sparkles size={200} className="text-indigo-600 dark:text-amber-500" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex flex-col items-center">
            <div className="h-px w-12 bg-indigo-300 dark:bg-amber-600 mb-4 mx-auto"></div>
            <span className="text-indigo-600 dark:text-amber-500 font-serif italic text-xl md:text-2xl tracking-[0.2em] uppercase px-6">
              {data.theme}
            </span>
            <div className="h-px w-12 bg-indigo-300 dark:bg-amber-600 mt-4 mx-auto"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-stone-100 serif-font leading-tight drop-shadow-md max-w-3xl mx-auto print:text-5xl print:text-black">
            {data.title}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-stone-400 dark:text-stone-500 print:text-black">
             <div className="h-0.5 w-16 bg-stone-200 dark:bg-stone-800 print:bg-black"></div>
             <Book size={18} />
             <div className="h-0.5 w-16 bg-stone-200 dark:bg-stone-800 print:bg-black"></div>
          </div>
        </div>
      </header>

      {/* Intro & Key Verses */}
      <div className="grid md:grid-cols-3 gap-8 mb-12 print:block">
        <div className="md:col-span-2 print:mb-8">
           <div className="prose prose-stone prose-lg dark:prose-invert print:prose-black">
             <h3 className="serif-font text-2xl text-stone-800 dark:text-stone-100 border-l-4 border-indigo-300 dark:border-amber-600 pl-4 mb-4 print:text-black print:border-black">Base do Estudo</h3>
             <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-lg italic print:text-black">
               {data.introduction}
             </p>
           </div>
        </div>
        <div className="bg-white dark:bg-[#292524] p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 h-fit transition-colors relative overflow-hidden print:border-black print:shadow-none print:p-0 print:bg-transparent">
          <div className="absolute top-0 right-0 p-1 opacity-10 print:hidden">
            <Book size={48} />
          </div>
          <h3 className="flex items-center gap-2 font-semibold text-stone-800 dark:text-amber-500 mb-4 border-b border-stone-100 dark:border-stone-700 pb-2 print:text-black print:border-black">
            <Book size={20} className="text-indigo-600 dark:text-amber-500 print:text-black" />
            Leitura Bíblica
          </h3>
          <ul className="space-y-4">
            {data.key_verses.map((verse, idx) => (
              <li key={idx} className="text-sm">
                <span className="block font-bold text-indigo-700 dark:text-amber-400 mb-1 print:text-black">{verse.reference}</span>
                <p className="text-stone-600 dark:text-stone-300 italic print:text-black">"{verse.text}"</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Image Gallery - Hidden on print for saving ink unless user wants */}
      <div className="mb-12 print:hidden">
         <h3 className="flex items-center gap-2 text-xl serif-font font-bold text-stone-800 dark:text-amber-500 mb-6 uppercase tracking-wider">
            <ImageIcon size={24} className="text-indigo-600 dark:text-amber-500" />
            Visualizando a Palavra
          </h3>
          
          {loadingImages ? (
            <div className="w-full h-64 bg-stone-100 dark:bg-stone-800 rounded-2xl flex flex-col items-center justify-center text-stone-400 dark:text-stone-600 animate-pulse border border-stone-200 dark:border-stone-700">
               <ImageIcon size={48} className="mb-2 opacity-50" />
               <p className="font-medium">Revelando ilustrações...</p>
            </div>
          ) : images.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {images.map((img, idx) => (
                <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-700">
                  <img src={img.url} alt={img.prompt} className="w-full h-72 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 flex flex-col justify-end">
                    <p className="text-white text-xs opacity-75 font-light">{img.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Main Sermon Body */}
      <div className="bg-white dark:bg-[#292524] p-8 md:p-16 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-700 mb-12 relative overflow-hidden transition-colors print:shadow-none print:border-none print:p-0 print:bg-transparent">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 dark:from-amber-600 dark:via-yellow-500 dark:to-amber-600 print:hidden"></div>
        <div className="flex flex-col items-center gap-3 mb-12 pb-6 border-b border-stone-100 dark:border-stone-700 print:border-black print:mb-8">
            <Mic size={32} className="text-indigo-600 dark:text-amber-500 mb-2 print:text-black" />
            <h2 className="serif-font text-4xl font-bold text-stone-800 dark:text-amber-500 tracking-tight print:text-black">O Mensageiro Proclama</h2>
        </div>
        
        <div className="markdown-content text-xl text-stone-700 dark:text-stone-300 leading-[1.9] font-serif prose dark:prose-invert max-w-none first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-indigo-600 dark:first-letter:text-amber-500 print:text-black print:first-letter:text-black">
          <ReactMarkdown>{data.sermon_body}</ReactMarkdown>
        </div>
      </div>

      {/* Application & Conclusion */}
      <div className="grid md:grid-cols-2 gap-8 mb-12 print:block">
        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-indigo-100 dark:border-amber-900/30 shadow-sm transition-colors relative print:border-black print:mb-8 print:p-0 print:bg-transparent">
           <h3 className="serif-font text-2xl font-bold text-indigo-900 dark:text-amber-500 mb-4 print:text-black">Luz para o Caminho</h3>
           <p className="text-indigo-900/80 dark:text-stone-300 leading-relaxed text-lg print:text-black">{data.practical_application}</p>
        </div>
        <div className="bg-stone-900 dark:bg-black p-8 rounded-3xl text-stone-100 border border-stone-800 shadow-2xl transition-all print:bg-transparent print:text-black print:border-black print:shadow-none print:p-0">
           <h3 className="serif-font text-2xl font-bold text-amber-500 mb-4 print:text-black">O Convite do Mestre</h3>
           <p className="text-stone-200 italic leading-relaxed text-lg print:text-black">{data.conclusion}</p>
        </div>
      </div>

      {/* Hymns - Hidden on print to focus on preaching text */}
      <div className="bg-white dark:bg-[#292524] rounded-3xl shadow-xl border-t-4 border-red-500 dark:border-red-700 overflow-hidden transition-colors print:hidden">
        <div className="p-8 md:p-12">
          <h3 className="serif-font text-3xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-3 mb-8">
            <PlayCircle size={32} className="text-red-500 dark:text-red-600" />
            Louvor & Adoração
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {data.hymns.map((hymn, idx) => (
              <div key={idx} className="group border border-stone-100 dark:border-stone-800 rounded-2xl p-6 bg-stone-50/50 dark:bg-stone-900/50">
                 <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-stone-800 dark:text-stone-100 leading-tight">{hymn.title}</h4>
                    {hymn.number && <span className="text-[10px] bg-white dark:bg-stone-800 px-2 py-1 rounded-md text-stone-500 dark:text-stone-400 border border-stone-100">#{hymn.number}</span>}
                 </div>
                 <button 
                  onClick={() => handleYoutubeSearch(hymn.title, hymn.number)}
                  className="w-full mt-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                 >
                   <PlayCircle size={16} /> YouTube
                 </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Real Share Button */}
      <div className="mt-16 flex flex-col items-center gap-6 text-center border-t border-stone-200 dark:border-stone-800 pt-12 print:hidden">
         <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
           <button 
             onClick={handleShare}
             className="relative flex items-center gap-3 px-10 py-5 bg-stone-900 dark:bg-amber-600 text-white dark:text-stone-900 font-bold rounded-full text-xl shadow-2xl transition-all transform active:scale-95 group"
           >
              {shareFeedback ? <Check className="animate-bounce" /> : <Share2 className="group-hover:rotate-12 transition-transform" />}
              {shareFeedback || "Compartilhar Estudo"}
           </button>
         </div>
         
         <div className="flex gap-4">
           <button 
             onClick={handlePrint}
             className="text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-amber-500 flex items-center gap-2 text-sm font-medium"
           >
             <Printer size={16} /> Versão para Impressão (PDF)
           </button>
           <button 
             onClick={() => handleCopyFallback(`*Estudo Bíblico: ${data.title}*\n\n${data.introduction}`)}
             className="text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-amber-500 flex items-center gap-2 text-sm font-medium"
           >
             <Copy size={16} /> Copiar Resumo
           </button>
         </div>
      </div>

    </div>
  );
};
