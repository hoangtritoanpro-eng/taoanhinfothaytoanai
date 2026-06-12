export async function analyzeImageAndGeneratePrompt(apiKey, base64ImageWithPrefix, mimeType, options) {
  // Loại bỏ prefix data:image/...;base64, để lấy data thô
  const base64Data = base64ImageWithPrefix.split(',')[1] || base64ImageWithPrefix;

  const promptText = `Bạn là một chuyên gia thiết kế đồ họa giáo dục và kỹ sư viết Prompt (Prompt Engineer) cho DALL-E 3.
Tôi sẽ cung cấp cho bạn một BỨC ẢNH MẪU. Nhiệm vụ của bạn là:

BƯỚC 1: Phân tích cực kỳ chi tiết bức ảnh này theo các tiêu chí: Thể loại, Bố cục, Bảng màu, Kiểu chữ, Yếu tố trang trí. Trích xuất các công thức toán (nếu có) dưới định dạng LaTeX.

BƯỚC 2: Tạo một Prompt tiếng Việt thật hoàn chỉnh để tôi gửi cho ChatGPT (DALL-E 3), nhằm yêu cầu nó vẽ một bức tranh có phong cách GIỐNG HỆT ảnh mẫu, nhưng với chủ đề nội dung là: "${options.topic || 'Dựa vào nội dung tài liệu người dùng đính kèm'}".
Tỉ lệ khung hình mong muốn: ${options.aspectRatio}.
Yêu cầu thêm từ người dùng: ${options.extraStyle || 'Không có'}.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC (Trả về Markdown):

## 1. Phân tích phong cách ảnh mẫu
- **Thể loại:** ...
- **Bố cục:** ...
- **Bảng màu chủ đạo:** ...
- **Kiểu chữ:** ...
- **Yếu tố trang trí:** ...
- **Công thức toán học gốc (LaTeX):** ...

## 2. PROMPT GỬI CHO CHATGPT (DALL-E 3)
Bạn hãy sao chép toàn bộ đoạn prompt dưới đây và dán vào ô chat của ChatGPT:
\`\`\`text
Hãy tạo một bức ảnh infographic giáo dục về chủ đề [Điền chủ đề mới]. Phong cách thiết kế phải giống hệt một trang vở ghi chép học tập dễ thương...
[Viết prompt DALL-E chi tiết tại đây dựa trên phân tích ở Bước 1. Chỉ định rõ màu sắc, font, cách chia cột, và nội dung/công thức toán cần hiển thị]
\`\`\``;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: promptText },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Có lỗi xảy ra khi gọi Gemini API');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
