import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Copy, ExternalLink, Check, Sparkles } from 'lucide-react';
import 'katex/dist/katex.min.css';

export default function ResultPanel({ result }) {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'raw'
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedDalle, setCopiedDalle] = useState(false);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopyDallePrompt = async () => {
    // Regex extract block text ```text ... ``` ignoring case if needed
    const match = result.match(/```(?:text)?\n([\s\S]*?)```/i);
    const promptText = match ? match[1].trim() : result; // fallback to all if not found
    
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedDalle(true);
      setTimeout(() => setCopiedDalle(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const openChatGPT = () => {
    window.open('https://chatgpt.com', '_blank');
  };

  return (
    <>
      <div className="bg-slate-50 border-b border-slate-100 px-5 flex items-center justify-between shrink-0">
        <div className="flex space-x-6">
          <button 
             onClick={() => setActiveTab('preview')}
             className={`text-sm py-3 transition-colors ${activeTab === 'preview' ? 'font-bold text-teal-700 border-b-2 border-teal-500' : 'font-semibold text-slate-400 hover:text-slate-600'}`}>
             Xem trước
          </button>
          <button 
             onClick={() => setActiveTab('raw')}
             className={`text-sm py-3 transition-colors ${activeTab === 'raw' ? 'font-bold text-teal-700 border-b-2 border-teal-500' : 'font-semibold text-slate-400 hover:text-slate-600'}`}>
             Văn bản thô
          </button>
        </div>
        <div className="flex space-x-2">
           <button onClick={handleCopyDallePrompt} className="px-3 py-1.5 bg-teal-100 hover:bg-teal-200 border border-teal-200 rounded-md text-[11px] font-bold text-teal-800 flex items-center space-x-1 transition-colors">
              {copiedDalle ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Sparkles className="w-3.5 h-3.5 text-teal-600" />}
              <span className="hidden sm:inline">{copiedDalle ? 'Đã sao chép' : 'Copy Prompt ChatGPT'}</span>
              <span className="sm:hidden">{copiedDalle ? 'Đã sao chép' : 'Copy Prompt'}</span>
           </button>
           <button onClick={handleCopyAll} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-slate-600 flex items-center space-x-1 hover:bg-slate-50 transition-colors hidden md:flex">
              {copiedAll ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Đã chép tất cả' : 'Chép tất cả'}</span>
           </button>
           <button onClick={openChatGPT} className="px-3 py-1.5 bg-teal-600 border border-teal-700 rounded-md text-[11px] font-bold text-white flex items-center space-x-1 shadow-sm hover:bg-teal-700 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mở ChatGPT</span>
           </button>
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
        {activeTab === 'preview' ? (
          <article className="prose prose-sm max-w-none text-slate-700 prose-headings:text-teal-900 prose-headings:font-bold prose-strong:text-teal-800 prose-a:text-teal-600 prose-pre:bg-slate-900 prose-pre:text-emerald-400 prose-pre:font-mono prose-pre:text-[11px] prose-pre:leading-relaxed prose-pre:border-0 prose-pre:shadow-none prose-p:text-slate-700">
             <ReactMarkdown 
               remarkPlugins={[remarkGfm, remarkMath]} 
               rehypePlugins={[rehypeKatex]}
             >
                 {result}
             </ReactMarkdown>
          </article>
        ) : (
          <pre className="whitespace-pre-wrap break-words text-sm font-mono text-slate-700 p-4 bg-white border border-slate-200 rounded-xl shadow-inner">
             {result}
          </pre>
        )}
      </div>
    </>
  );
}
