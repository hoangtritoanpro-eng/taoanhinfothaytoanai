import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ResultPanel({ result }) {
  // Tách trạng thái để biết đang bấm nút nào ('prompt' hoặc 'all')
  const [copiedType, setCopiedType] = useState(null);

  // Hàm xử lý Copy với Fallback siêu mạnh, bao chạy trên Vercel và điện thoại
  const handleCopy = async (type) => {
    if (!result) return;

    let textToCopy = result;

    // Lọc lấy riêng phần Prompt nếu người dùng bấm nút "Copy Prompt ChatGPT"
    if (type === 'prompt') {
      // Tìm và trích xuất nội dung nằm trong cặp ```text ... ```
      const match = result.match(/```(?:text)?\n([\s\S]*?)
```/);
      
      if (match && match[1]) {
        textToCopy = match[1].trim(); // Lấy đúng phần prompt bên trong
      } else {
        // Fallback: Nếu AI trả về thiếu dấu ```, ta sẽ cắt từ đoạn "Hãy tạo..."
        const fallbackSplit = result.split('## 2. PROMPT GỬI CHO CHATGPT');
        if (fallbackSplit.length > 1) {
          textToCopy = fallbackSplit[1]
            .replace(/Bạn hãy sao chép toàn bộ đoạn prompt dưới đây và dán vào ô chat của ChatGPT:/gi, '')
            .replace(/```text/g, '')
            .replace(/```/g, '')
            .trim();
        }
      }
    }

    try {
      // Ưu tiên 1: Dùng Clipboard API chuẩn
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        handleCopySuccess(type);
        return;
      }
      throw new Error("Clipboard API không khả dụng");
    } catch (err) {
      // Ưu tiên 2: Fallback tạo textarea ẩn (Giải quyết triệt để lỗi Vercel chặn quyền)
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      
      // Giấu textarea đi để không làm giật màn hình
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          handleCopySuccess(type);
        } else {
          alert("Trình duyệt từ chối quyền sao chép. Vui lòng bôi đen và copy thủ công.");
        }
      } catch (error) {
        console.error("Fallback copy error:", error);
        alert("Lỗi sao chép. Vui lòng bôi đen và copy thủ công.");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleCopySuccess = (type) => {
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000); // Tắt thông báo sau 2 giây
  };

  if (!result) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Thanh công cụ (Toolbar) chứa các nút bấm */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-teal-100 bg-teal-50/30 gap-3">
        <h2 className="text-lg font-bold text-teal-900">Văn bản thô</h2>
        
        <div className="flex items-center space-x-2">
          {/* Nút Copy Prompt ChatGPT */}
          <button
            onClick={() => handleCopy('prompt')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              copiedType === 'prompt' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-teal-100 text-teal-700 border border-teal-200 hover:bg-teal-200'
            }`}
          >
            {copiedType === 'prompt' ? <Check className="w-4 h-4"/> : <Sparkles className="w-4 h-4"/>}
            <span className="text-sm">{copiedType === 'prompt' ? 'Đã sao chép!' : 'Copy Prompt ChatGPT'}</span>
          </button>

          {/* Nút Chép tất cả */}
          <button
            onClick={() => handleCopy('all')}
            className={`flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg font-medium transition-colors ${
              copiedType === 'all'
                ? 'text-green-700 border-green-200 bg-green-50'
                : 'text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {copiedType === 'all' ? <Check className="w-4 h-4 text-green-600"/> : <Copy className="w-4 h-4"/>}
            <span className="text-sm">{copiedType === 'all' ? 'Đã sao chép!' : 'Chép tất cả'}</span>
          </button>

          {/* Nút Mở ChatGPT (Đã chuyển thành thẻ a để chống chặn Pop-up) */}
          <a
            href="[https://chatgpt.com](https://chatgpt.com)"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4"/>
            <span className="text-sm">Mở ChatGPT</span>
          </a>
        </div>
      </div>

      {/* Khu vực hiển thị nội dung (Có hỗ trợ Markdown) */}
      <div className="p-6 overflow-y-auto flex-1 prose prose-teal max-w-none text-slate-700 text-sm md:text-base leading-relaxed">
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
    </div>
  );
}