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
  // Tách trạng thái để biết đang bấm nút nào trên thanh công cụ
  const [copiedType, setCopiedType] = useState(null);

  // 1. Hàm xử lý Copy cho các nút bấm trên thanh Toolbar
  const handleToolbarCopy = async (type) => {
    if (!result) return;
    let textToCopy = result;

    if (type === 'prompt') {
      // Đã sửa lỗi biểu thức Regex bị xuống dòng trong code cũ của Thầy
      const match = result.match(/
http://googleusercontent.com/immersive_entry_chip/0

Bây giờ Thầy sẽ có "nhân đôi" sự linh hoạt: Vừa có nút bấm thông minh ở thanh menu, vừa có nút sao chép cực nhạy tích hợp sẵn trong góc của bảng tối (bảng phần 2) để đáp ứng mọi thói quen sử dụng!