import { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function StepUploader({ onImageSelect, selectedImage }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh (jpg, png, webp...)');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect({ dataUrl: e.target.result, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-sm flex flex-col h-full min-h-[250px] md:min-h-[280px]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="font-bold text-teal-900">1. Tải lên ảnh mẫu</h2>
        <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Yêu cầu</span>
      </div>
      
      <div className="flex-1 border-2 border-dashed border-teal-100 bg-teal-50/30 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors min-h-[180px]"
           onDragOver={handleDragOver}
           onDragLeave={handleDragLeave}
           onDrop={handleDrop}
           style={{ borderColor: isDragging ? '#14b8a6' : '' }}
      >
        {!selectedImage ? (
          <div 
             onClick={() => fileInputRef.current?.click()}
             className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-slate-400 hover:text-teal-600 transition-colors"
          >
             <UploadCloud className="w-8 h-8 mb-2" />
             <p className="text-xs font-medium text-center">Kéo thả ảnh vào đây,<br/> hoặc click để chọn</p>
          </div>
        ) : (
          <div className="relative group flex flex-col items-center w-full h-full justify-center">
            <div className="w-full h-full relative flex items-center justify-center p-2 rounded-lg overflow-hidden shrink-0 bg-slate-100/50">
              <img src={selectedImage.dataUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded drop-shadow-sm" />
              <button
                onClick={(e) => { e.stopPropagation(); onImageSelect(null); }}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                title="Xóa ảnh"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-teal-600 font-semibold text-xs hover:underline shrink-0"
            >
                Chọn ảnh khác
            </button>
          </div>
        )}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
        />
      </div>
    </div>
  );
}
