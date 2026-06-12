import { useState, useEffect } from 'react';
import { X, Key } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onSave, initialKey }) {
  const [apiKey, setApiKey] = useState(initialKey || '');

  useEffect(() => {
    if (isOpen) {
        setApiKey(initialKey || '');
    }
  }, [isOpen, initialKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-teal-50/50">
          <div className="flex items-center gap-2 text-teal-800 font-semibold">
            <Key className="w-5 h-5 text-teal-600" />
            <span>Cài đặt API Key</span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            />
            <p className="mt-2 text-xs text-gray-500">
              Key được lưu trữ an toàn trong trình duyệt (localStorage) của bạn.
              Không gửi lên máy chủ nào khác ngoài Google.
            </p>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">
            Hủy
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-teal-600 focus:ring-offset-2">
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
}
