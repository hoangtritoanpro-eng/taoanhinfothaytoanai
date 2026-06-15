import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Hàm tiện ích copy chung với Fallback siêu mạnh (Dùng chung cho toàn bộ ứng dụng)
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    throw new Error("Clipboard API không khả dụng");
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (error) {
      console.error("Fallback copy error:", error);
    }
    document.body.removeChild(textArea);
    return successful;
  }
};

export default function ResultPanel({ result }) {
  const [copiedType, setCopiedType] = useState(null);

  // 1. Hàm xử lý Copy cho các nút bấm trên thanh menu ngang (Toolbar)
  const handleToolbarCopy = async (type) => {
    if (!result) return;
    let textToCopy = result;

    if (type === 'prompt') {
      const match = result.match(/```(?:text|markdown)?\n([\s\S]*?)
```/);
      if (match && match[1]) {
        textToCopy = match[1].trim(); 
      } else {
        const startKeyword = "Hãy tạo";
        const promptIndex = result.indexOf(startKeyword);
        if (promptIndex !== -1) {
          textToCopy = result.substring(promptIndex)
                             .replace(/```text/g, '')
                             .replace(/
```/g, '')
                             .trim();
        } else {
          const fallbackSplit = result.split(/## 2/i);
          if (fallbackSplit.length > 1) {
            textToCopy = fallbackSplit[1].replace(/[\s\S]*?Hãy tạo/i, 'Hãy tạo')
                                         .replace(/```[a-zA-Z]*/g, '')
                                         .replace(/
```/g, '')
                                         .trim();
          }
        }
      }
    }

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } else {
      alert("Trình duyệt từ chối quyền sao chép. Vui lòng bôi đen và copy thủ công.");
    }
  };

  // 2. KHỐI MÃ NỀN ĐEN THÔNG MINH (Tự động có nút Copy ở góc)
  const CustomPreBlock = ({ children, ...props }) => {
    const [isBlockCopied, setIsBlockCopied] = useState(false);
    
    // Hàm bóc tách nội dung text thuần túy từ thẻ <code> bên trong khối <pre>
    const extractText = (node) => {
      if (typeof node === 'string') return node;
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (node && node.props && node.props.children) return extractText(node.props.children);
      return '';
    };

    const textToCopy = extractText(children);

    const handleBlockCopy = async () => {
      if (!textToCopy) return;
      const success = await copyToClipboard(textToCopy.trim());
      if (success) {
        setIsBlockCopied(true);
        setTimeout(() => setIsBlockCopied(false), 2000);
      }
    };

    return (
      <div className="relative group my-6">
        
        <button
          onClick={handleBlockCopy}
          className="absolute top-3 right-3 p-2 bg-slate-700/80 hover:bg-teal-600 text-slate-200 hover:text-white rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all flex items-center space-x-1.5 backdrop-blur-md shadow-sm z-10 border border-slate-600"
          title="Sao chép đoạn lệnh này"
        >
          {isBlockCopied ? <Check className="w-4 h-4 text-green-400"/> : <Copy className="w-4 h-4"/>}
          <span className="text-xs font-semibold pr-1 tracking-wide">
            {isBlockCopied ? 'Đã sao chép!' : 'Copy Prompt'}
          </span>
        </button>
        
        
        <pre className="!bg-slate-800 !text-slate-100 p-5 pt-12 rounded-xl overflow-x-auto shadow-inner m-0 text-sm leading-relaxed whitespace-pre-wrap break-words" {...props}>
          {children}
        </pre>
      </div>
    );
  };

  if (!result) return null;

  return (
    <div className="flex flex-col h-full">
      
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-teal-100 bg-teal-50/30 gap-3">
        <h2 className="text-lg font-bold text-teal-900">Văn bản thô</h2>
        
        <div className="flex items-center space-x-2">
          
          <button
            onClick={() => handleToolbarCopy('prompt')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              copiedType === 'prompt' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-teal-100 text-teal-700 border border-teal-200 hover:bg-teal-200'
            }`}
          >
            {copiedType === 'prompt' ? <Check className="w-4 h-4"/> : <Sparkles className="w-4 h-4"/>}
            <span className="text-sm">{copiedType === 'prompt' ? 'Đã sao chép!' : 'Copy Prompt ChatGPT'}</span>
          </button>

          
          <button
            onClick={() => handleToolbarCopy('all')}
            className={`flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg font-medium transition-colors ${
              copiedType === 'all'
                ? 'text-green-700 border-green-200 bg-green-50'
                : 'text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {copiedType === 'all' ? <Check className="w-4 h-4 text-green-600"/> : <Copy className="w-4 h-4"/>}
            <span className="text-sm">{copiedType === 'all' ? 'Đã sao chép!' : 'Chép tất cả'}</span>
          </button>

          
          <a
            href="https://chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4"/>
            <span className="text-sm">Mở ChatGPT</span>
          </a>
        </div>
      </div>

      
      <div className="p-6 overflow-y-auto flex-1 prose prose-teal max-w-none text-slate-700 text-sm md:text-base leading-relaxed">
        <ReactMarkdown components="{{" pre: CustomPreBlock // Gọi Component tự tạo vào thẻ <pre> mặc định
          }}
        >
          {result}
        </ReactMarkdown>
      </div>
    </div>
  );
}