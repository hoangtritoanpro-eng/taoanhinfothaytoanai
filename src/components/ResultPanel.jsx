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
      // KỊCH BẢN 1: AI có bọc prompt chuẩn trong khối code ```text ... ```
      const match = result.match(/
http://googleusercontent.com/immersive_entry_chip/0

Thầy lưu lại và thử đưa lên Vercel nhé, nút sao chép giờ đã bắt chính xác nội dung rồi đấy!