"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Sidebar from "/components/Sidebar";
import UserMenu from "/components/Pengguna";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  const sendPrompt = async () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: inputValue }]);
    setInputValue("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/content-generate/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputValue }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();

      const formattedText = `### ${data.title}\n\n${data.content}`;
      setMessages((prev) => [...prev, { role: "bot", text: formattedText }]);
    } catch (err) {
      setError("Gagal mengambil data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendPrompt();
    }
  };

  const isEmpty = messages.length === 0 && !loading && !error;

  return (
    <div className="flex bg-white min-h-screen relative">
      {/* Judul kiri atas */}
      <div className="absolute top-4 left-72">
        <h1 className="text-[#000000] font-bold text-[32px]">Tlogo Generate Content</h1>
      </div>

      {/* Sidebar */}
      <UserMenu />
      <Sidebar />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col items-center px-12 py-18"> {/* px-12 = 3rem padding left-right */}
        <div
          className={`w-full max-w-3xl flex flex-col ${
            isEmpty ? "justify-center" : "justify-end"
          } flex-1`}
          style={{ minHeight: "70vh" }}
        >
          {/* Kontainer tengah saat kosong */}
          {isEmpty && (
            <motion.div
              key="center-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center h-full w-full gap-6"
              style={{ minHeight: "70vh" }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#3D6CB9]">
                Apa yang bisa saya bantu?
              </h2>

              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Masukkan kata kunci yang ingin dibuat"
                  className="w-full px-4 py-3 pr-14 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ height: "3rem" }}
                />
                <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={sendPrompt}
                  disabled={loading}
                  style={{ backgroundColor: "transparent" }}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-blue-500"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      />
                    </svg>
                  ) : (
                    <Send size={20} className="text-blue-500 hover:text-blue-700" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Setelah ada pesan */}
          {!isEmpty && (
            <div className="flex flex-col-reverse flex-1 overflow-y-auto gap-4">
              {/* Input dengan tinggi lebih besar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative w-full max-w-3xl"
              >
                <input
                  type="text"
                  placeholder="Masukkan kata kunci yang ingin dibuat"
                  className="w-full px-4 py-3 pr-14 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
                  style={{ height: "3.3rem" }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={sendPrompt}
                  disabled={loading}
                  style={{ backgroundColor: "transparent" }}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-blue-500"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      />
                    </svg>
                  ) : (
                    <Send size={20} className="text-blue-500 hover:text-blue-700" />
                  )}
                </motion.button>
              </motion.div>

              {/* Pesan chat */}
              <div className="flex flex-col gap-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl px-4 py-3 max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-100 text-gray-900 self-start prose prose-blue max-w-none"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="self-start bg-gray-100 text-gray-900 rounded-lg px-4 py-3">
                    <span className="animate-pulse">TlogoAI is typing…</span>
                  </div>
                )}

                {error && (
                  <div className="self-center text-red-500 text-sm">{error}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
