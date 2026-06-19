"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useApp } from "@/lib/store";
import { formatRupiah, getDailyBudget } from "@/lib/utils";

export default function ChatPanel({ isOpen, onClose }) {
  const { state } = useApp();
  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Halo! Saldo lo ada ${formatRupiah(state.saldoMakan)} buat ${state.hariKeKiriman} hari ke depan (Budget ${formatRupiah(budgetHarian)}/hari). Ada yang bisa gue bantu hitungin?`,
        parts: [{ type: "text", text: `Halo! Saldo lo ada ${formatRupiah(state.saldoMakan)} buat ${state.hariKeKiriman} hari ke depan (Budget ${formatRupiah(budgetHarian)}/hari). Ada yang bisa gue bantu hitungin?` }],
      },
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    sendMessage({
      role: "user",
      content: trimmed,
      parts: [{ type: "text", text: trimmed }],
    }, {
      body: {
        data: {
          userProfile: {
            saldoMakan: state.saldoMakan,
            hariKeKiriman: state.hariKeKiriman,
            budgetHarian,
            targetCalories: state.targetCalories,
            targetProtein: state.targetProtein,
            todaySpent: state.todaySpent,
          },
        },
      },
    });
  };

  const getMessageText = (msg) => {
    // New SDK: prefer parts[].text, fallback to content
    if (msg.parts && msg.parts.length > 0) {
      return msg.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("");
    }
    return msg.content || "";
  };

  const renderText = (text) =>
    text.split("**").map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );

  return (
    <>
      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose}></div>
      <aside className={`chat-panel ${isOpen ? "open" : ""}`} aria-label="Panel chat AI" aria-hidden={!isOpen}>
        <header className="chat-header">
          <h2 className="chat-title">💬 Ngobrol sama AI</h2>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Tutup chat">✕</button>
        </header>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role === "user" ? "user" : "ai"}`}>
              {renderText(getMessageText(msg))}
            </div>
          ))}
          {isLoading && (
            <div className="message ai">Mikir bentar... 🤔</div>
          )}
          {error && (
            <div className="message ai" style={{ color: "var(--red)", background: "rgba(248, 113, 113, 0.1)" }}>
              Koneksi ke AI gagal: {error.message}.{" "}
              <button
                onClick={() => clearError()}
                style={{ textDecoration: "underline", background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: 0 }}
              >
                Coba lagi
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSubmit}>
          <button className="icon-button" type="button" aria-label="Kirim foto makanan">📷</button>
          <input
            className="chat-input"
            type="text"
            placeholder="Tulis pesan..."
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {isLoading ? (
            <button
              className="send-button"
              type="button"
              onClick={stop}
              style={{ background: "var(--red)", color: "white" }}
            >
              Stop
            </button>
          ) : (
            <button className="send-button" type="submit" disabled={!input.trim()}>
              Kirim
            </button>
          )}
        </form>
      </aside>
    </>
  );
}
