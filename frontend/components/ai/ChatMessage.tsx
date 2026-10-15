"use client";

import React from "react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div style={{
      display: "flex",
      gap: "var(--space-md)",
      alignItems: "flex-start",
      flexDirection: isUser ? "row-reverse" : "row",
      animation: "fadeIn 0.3s ease-out",
    }}>
      {/* Avatar */}
      <div style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: isUser ? "var(--color-accent)" : "linear-gradient(135deg, #10b981, #059669)",
        color: "#ffffff",
        boxShadow: isUser ? "none" : "0 2px 8px rgba(16, 185, 129, 0.3)",
      }}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: "75%",
        padding: "var(--space-md) var(--space-lg)",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser ? "var(--color-accent)" : "var(--bg-secondary)",
        color: isUser ? "#ffffff" : "var(--text-primary)",
        fontSize: "13px",
        lineHeight: "1.7",
        position: "relative",
      }}>
        {/* Render content with basic markdown */}
        <div
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          style={{ wordBreak: "break-word" }}
        />

        {/* Streaming cursor */}
        {isStreaming && (
          <span style={{
            display: "inline-block",
            width: "6px",
            height: "16px",
            background: isUser ? "#ffffff" : "var(--color-accent)",
            marginLeft: "2px",
            animation: "blink 1s step-end infinite",
            verticalAlign: "text-bottom",
          }} />
        )}
      </div>
    </div>
  );
}

/**
 * Very lightweight markdown renderer (no external dependency).
 * Handles: headers, bold, code blocks, inline code, lists, links, line breaks.
 */
function renderMarkdown(text: string): string {
  if (!text) return "";

  let html = text
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

    // Code blocks (``` ... ```) — always LTR regardless of page locale
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      const langLabel = lang ? `<span style="color: var(--text-muted); font-size: 10px; letter-spacing: 0.05em; display: block; margin-bottom: 8px; text-align: left; direction: ltr;">${lang.toUpperCase()}</span>` : '';
      return `<pre dir="ltr" style="background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 8px; padding: 12px 16px; overflow-x: auto; font-family: var(--font-mono); font-size: 12px; line-height: 1.5; margin: 8px 0; text-align: left; direction: ltr;">${langLabel}<code style="direction: ltr; text-align: left; unicode-bidi: embed;">${code.trim()}</code></pre>`;
    })

    // Inline code — always LTR
    .replace(/`([^`]+)`/g, '<code dir="ltr" style="background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; direction: ltr; unicode-bidi: embed;">$1</code>')

    // Headers
    .replace(/^### (.+)$/gm, '<h4 style="font-size: 14px; font-weight: 700; margin: 12px 0 6px; color: var(--text-primary);">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="font-size: 15px; font-weight: 700; margin: 14px 0 8px; color: var(--text-primary);">$1</h3>')

    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

    // Tables
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split("|").filter(c => c.trim());
      if (cells.every(c => c.trim().match(/^-+$/))) return ""; // separator row
      const cellHtml = cells.map(c => `<td style="padding: 4px 8px; border: 1px solid var(--border-primary);">${c.trim()}</td>`).join("");
      return `<tr>${cellHtml}</tr>`;
    })

    // Unordered lists
    .replace(/^- \[x\] (.+)$/gm, '<div style="display: flex; align-items: center; gap: 6px; margin: 2px 0;">✅ $1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div style="display: flex; align-items: center; gap: 6px; margin: 2px 0;">⬜ $1</div>')
    .replace(/^- (.+)$/gm, '<div style="margin: 2px 0; padding-inline-start: 12px;">• $1</div>')
    .replace(/^\d+\. (.+)$/gm, '<div style="margin: 2px 0; padding-inline-start: 12px;">$1</div>')

    // Blockquotes
    .replace(/^&gt; (.+)$/gm, '<div style="border-left: 3px solid var(--color-accent); padding: 4px 12px; margin: 8px 0; background: rgba(59, 130, 246, 0.05); border-radius: 0 4px 4px 0; font-size: 12px;">$1</div>')

    // Line breaks
    .replace(/\n/g, "<br/>");

  return html;
}
