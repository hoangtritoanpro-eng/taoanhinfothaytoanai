import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Hàm copy mạnh mẽ chống lỗi trên Vercel và điện thoại
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

  // 1. NÚT COPY TRÊN THANH CÔNG CỤ (Dùng Regex thông minh để tìm text)
  const handleToolbarCopy = async (type) => {
    if (!result) return;
    let textToCopy = result;

    if (type === 'prompt') {
      const match = result.match(/
http://googleusercontent.com/immersive_entry_chip/0

Thầy hãy chép đoạn mã này dán vào Vercel (bấm nút "Copy code" ở góc trên hộp mã phía trên). Khi giao diện chạy, Thầy kéo xuống chỗ có bảng đen, bấm nút **"Copy"** ngay tại góc cái bảng đó rồi đem dán thử qua chỗ khác là sẽ thấy nó lấy ra đúng 100% đoạn lệnh Thầy cần gửi cho DALL-E 3 nhé!