import React, { useState } from "react";
import { Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

// ===============================
// HÀM COPY CÓ FALLBACK
// ===============================
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
      successful = document.execCommand("copy");
    } catch (error) {
      console.error("Fallback copy error:", error);
    }

    document.body.removeChild(textArea);
    return successful;
  }
};

// ===============================
// HÀM TÁCH RIÊNG PROMPT CHATGPT
// ===============================
const extractPromptFromResult = (result) => {
  if (!result) return "";

  // Ưu tiên lấy nội dung trong khối ```text ... ```
  const codeBlockMatch = result.match(
    /```(?:text|markdown|prompt)?\s*\n([\s\S]*?)```/i
  );

  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }

  // Nếu không có code block, tìm từ khóa bắt đầu prompt
  const startKeyword = "Hãy tạo";
  const promptIndex = result.indexOf(startKeyword);

  if (promptIndex !== -1) {
    return result
      .substring(promptIndex)
      .replace(/```text/gi, "")
      .replace(/```markdown/gi, "")
      .replace(/```prompt/gi, "")
      .replace(/```/g, "")
      .trim();
  }

  return result.trim();
};

// ===============================
// COMPONENT CHÍNH
// ===============================
export default function ResultPanel({ result }) {
  const [copiedType, setCopiedType] = useState(null);

  // ===============================
  // COPY TRÊN THANH CÔNG CỤ
  // ===============================
  const handleToolbarCopy = async (type) => {
    if (!result) return;

    let textToCopy = result;

    if (type === "prompt") {
      textToCopy = extractPromptFromResult(result);
    }

    const success = await copyToClipboard(textToCopy);

    if (success) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } else {
      alert("Trình duyệt từ chối quyền sao chép. Vui lòng bôi đen và copy thủ công.");
    }
  };

  // ===============================
  // KHỐI CODE NỀN ĐEN CÓ NÚT COPY PROMPT
  // ===============================
  const CustomPreBlock = ({ children, ...props }) => {
    const [isBlockCopied, setIsBlockCopied] = useState(false);

    const getTextFromChildren = (node) => {
      if (typeof node === "string") return node;

      if (Array.isArray(node)) {
        return node.map(getTextFromChildren).join("");
      }

      if (React.isValidElement(node)) {
        return getTextFromChildren(node.props.children);
      }

      return "";
    };

    const textToCopy = getTextFromChildren(children).trim();

    const handleBlockCopy = async () => {
      if (!textToCopy) return;

      const success = await copyToClipboard(textToCopy);

      if (success) {
        setIsBlockCopied(true);
        setTimeout(() => setIsBlockCopied(false), 2000);
      } else {
        alert("Không thể sao chép. Vui lòng copy thủ công.");
      }
    };

    return (
      <div className="relative my-6">
        <button
          type="button"
          onClick={handleBlockCopy}
          className="
            absolute top-3 right-3 z-20
            flex items-center gap-1.5
            px-3 py-2
            rounded-lg
            bg-slate-700 hover:bg-teal-600
            text-slate-100 hover:text-white
            border border-slate-500
            shadow-md
            transition-all
          "
          title="Sao chép prompt"
        >
          {isBlockCopied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}

          <span className="text-xs font-semibold">
            {isBlockCopied ? "Đã sao chép!" : "Copy Prompt"}
          </span>
        </button>

        <pre
          {...props}
          className="
            !bg-[#1e293b]
            !text-slate-200
            p-5 pt-16
            rounded-xl
            overflow-x-auto
            shadow-inner
            m-0
            text-sm
            leading-relaxed
            whitespace-pre-wrap
            break-words
            border border-slate-700
          "
        >
          {children}
        </pre>
      </div>
    );
  };

  if (!result) return null;

  return (
    <div className="flex flex-col h-full">
      {/* THANH CÔNG CỤ PHÍA TRÊN */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-teal-100 bg-teal-50/30 gap-3">
        <h2 className="text-lg font-bold text-teal-900">
          Văn bản thô
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleToolbarCopy("prompt")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              copiedType === "prompt"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-teal-100 text-teal-700 border border-teal-200 hover:bg-teal-200"
            }`}
          >
            {copiedType === "prompt" ? (
              <Check className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}

            <span className="text-sm">
              {copiedType === "prompt"
                ? "Đã sao chép!"
                : "Copy Prompt ChatGPT"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleToolbarCopy("all")}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
              copiedType === "all"
                ? "text-green-700 border-green-200 bg-green-50"
                : "text-slate-700 border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            {copiedType === "all" ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}

            <span className="text-sm">
              {copiedType === "all" ? "Đã sao chép!" : "Chép tất cả"}
            </span>
          </button>

          <a
            href="https://chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2
              px-4 py-2
              bg-teal-600 text-white
              rounded-lg
              font-medium
              hover:bg-teal-700
              transition-colors
              shadow-sm
            "
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">Mở ChatGPT</span>
          </a>
        </div>
      </div>

      {/* KHU VỰC HIỂN THỊ KẾT QUẢ MARKDOWN */}
      <div className="p-6 overflow-y-auto flex-1 prose prose-teal max-w-none text-slate-700 text-sm md:text-base leading-relaxed">
        <ReactMarkdown
          components={{
            pre: CustomPreBlock,
          }}
        >
          {result}
        </ReactMarkdown>
      </div>
    </div>
  );
}