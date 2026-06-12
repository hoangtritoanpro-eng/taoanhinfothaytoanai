import { useState, useEffect } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import SettingsModal from './components/SettingsModal.jsx';
import StepUploader from './components/StepUploader.jsx';
import StepOptions from './components/StepOptions.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import { analyzeImageAndGeneratePrompt } from './lib/gemini.js';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [options, setOptions] = useState({
    aspectRatio: 'Tự động (Dựa theo ảnh gốc)',
    extraStyle: '',
    topic: ''
  });
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Vui lòng cài đặt API Key.');
      setIsSettingsOpen(true);
      return;
    }
    if (!image) {
      setError('Vui lòng tải lên ảnh mẫu.');
      return;
    }

    setIsLoading(true);
    setError('');
    if (result) setResult('');

    try {
      const generatedPrompt = await analyzeImageAndGeneratePrompt(
        apiKey,
        image.dataUrl,
        image.mimeType,
        options
      );
      setResult(generatedPrompt);
    } catch (err) {
      setError(err.message || 'Lỗi khi gọi API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-teal-50 text-slate-900 font-sans select-none overflow-hidden">
      <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-teal-100 shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-teal-900 hidden sm:inline">GeoPrompt</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full">
            {apiKey ? (
              <><div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div> <span className="text-xs font-semibold text-teal-700">Đã có API Key</span></>
            ) : (
              <><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> <span className="text-xs font-semibold text-red-700">Chưa có API Key</span></>
            )}
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm shrink-0">
            <h1 className="text-2xl font-extrabold text-teal-900 leading-tight mb-2">Phân tích ảnh → Viết Prompt tạo ảnh ChatGPT</h1>
            <p className="text-slate-500 text-sm mb-6">Biến bất kỳ Infographic toán học hay phiếu ghi chép nào thành công thức Prompt cực chuẩn cho DALL-E 3.</p>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-teal-50 rounded-xl border border-teal-100">
                <span className="flex-shrink-0 w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 italic">1</span>
                <span className="text-xs font-medium text-teal-900">Cài đặt Google Gemini API Key</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-xl border border-slate-100">
                <span className="flex-shrink-0 w-7 h-7 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold mr-3 italic">2</span>
                <span className="text-xs font-medium text-slate-500">Tải ảnh mẫu cần bắt chước style</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-xl border border-slate-100">
                <span className="flex-shrink-0 w-7 h-7 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold mr-3 italic">3</span>
                <span className="text-xs font-medium text-slate-500">Chỉnh sửa thông số chủ đề mới</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-xl border border-slate-100">
                <span className="flex-shrink-0 w-7 h-7 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold mr-3 italic">4</span>
                <span className="text-xs font-medium text-slate-500">Copy Prompt & dán vào ChatGPT</span>
              </div>
            </div>
          </div>

          <div className="bg-teal-900 rounded-2xl p-6 text-white flex-1 relative overflow-hidden hidden lg:block min-h-[160px]">
            <div className="relative z-10">
              <h3 className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2">Tips & Tricks</h3>
              <p className="text-teal-50/70 text-sm leading-relaxed">
                Hãy chọn ảnh mẫu có bố cục rõ ràng để Gemini có thể trích xuất cấu trúc và mã LaTeX chính xác nhất.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-800 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StepUploader selectedImage={image} onImageSelect={setImage} />
            <StepOptions 
              options={options} 
              onChange={setOptions} 
              onGenerate={handleGenerate} 
              isLoading={isLoading} 
              error={error}
            />
          </div>

          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-teal-100 shadow-sm overflow-hidden min-h-[400px]">
             {result ? <ResultPanel result={result} /> : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm p-6 text-center italic bg-slate-50/50">
                  Kết quả Prompt sẽ hiển thị ở đây sau khi phân tích
                </div>
             )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-teal-700 text-teal-50 py-4 shrink-0 flex flex-col items-center justify-center text-sm shadow-inner z-10">
        <div className="flex items-center gap-2 font-bold mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-teal-200"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/></svg> 
          <span className="tracking-wide">Tác giả: THẦY TOÀN A.I</span>
        </div>
        <div className="text-[11px] text-teal-200/80 font-medium tracking-wide uppercase">
          Công cụ hỗ trợ giáo viên SKL
        </div>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSaveKey}
        initialKey={apiKey}
      />
    </div>
  );
}

export default App;
