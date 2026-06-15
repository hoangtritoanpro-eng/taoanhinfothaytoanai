import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Hàm tiện ích copy chung với Fallback siêu mạnh (Dùng chung cho toàn bộ Component)
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
  // Tách trạng thái để biết đang bấm nút nào ('prompt' hoặc 'all') trên Toolbar
  const [copiedType, setCopiedType] = useState(null);

  // 1. Hàm xử lý Copy cho các nút trên thanh công cụ (Toolbar)
  const handleToolbarCopy = async (type) => {
    if (!result) return;
    let textToCopy = result;

    if (type === 'prompt') {
      const match = result.match(/
http://googleusercontent.com/immersive_entry_chip/0

Với bản cập nhật này, khi Thầy di chuột vào khối văn bản có nền tối, một nút **"Copy code"** nhỏ tinh tế sẽ hiện ra ở góc phải. Nút ở trên thanh Toolbar vẫn giữ nguyên sự "thông minh" để phòng hờ, tạo ra một trải nghiệm người dùng hoàn hảo!