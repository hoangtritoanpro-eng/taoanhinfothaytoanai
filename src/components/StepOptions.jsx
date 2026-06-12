import { Sparkles, AlertCircle } from 'lucide-react';

export default function StepOptions({ options, onChange, onGenerate, isLoading, error }) {
  const handleChange = (field, value) => {
    onChange({ ...options, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-sm flex flex-col h-full min-h-[280px]">
      <h2 className="font-bold text-teal-900 mb-4 shrink-0">2. Tùy chọn chủ đề</h2>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Tỉ lệ khung hình</label>
          <select
            value={options.aspectRatio}
            onChange={(e) => handleChange('aspectRatio', e.target.value)}
            className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-teal-500 outline-none text-slate-700"
          >
            <option value="Tự động (Dựa theo ảnh gốc)">Tự động (Dựa theo ảnh gốc)</option>
            <option value="Vuông 1:1">Vuông 1:1</option>
            <option value="Dọc 3:4">Dọc 3:4</option>
            <option value="Ngang 16:9">Ngang 16:9</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Chủ đề nội dung mới</label>
          <input
            type="text"
            value={options.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            placeholder="Ví dụ: Phân số lớp 5..."
            className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-teal-500 outline-none text-slate-700"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Ghi chú phong cách</label>
          <input
            type="text"
            value={options.extraStyle}
            onChange={(e) => handleChange('extraStyle', e.target.value)}
            placeholder="Nhiều icon, màu pastel..."
            className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-teal-500 outline-none text-slate-700"
          />
        </div>

        {error && (
           <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded flex items-start gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
           </div>
        )}
      </div>

      <button 
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center space-x-2 shadow-lg shadow-teal-100 transition-all shrink-0 disabled:opacity-70 disabled:cursor-wait"
      >
        {isLoading ? (
            <><Sparkles className="w-4 h-4 animate-spin" /> <span>Đang tạo...</span></>
        ) : (
            <><Sparkles className="w-4 h-4 text-teal-200" /> <span>✨ Tạo Prompt Ngay</span></>
        )}
      </button>
    </div>
  );
}
