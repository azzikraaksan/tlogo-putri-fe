"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Sidebar from "/components/Sidebar";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ContentList, setContentList] = useState([]);
  const [customQuery, setCustomQuery] = useState(""); //customoptimize
  const [customOptimizeDone, setCustomOptimizeDone] = useState(false); // track apakah optimize/custom optimize sudah selesai
  const [statusMessage, setStatusMessage] = useState(""); // feedback sukses/gagal
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
      setContentList((prevList) => [...prevList, data]);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          title: data.title,
          content: data.content,
          category: data.category || "Umum", // Jika ada kategori dari API
        },
      ]);

      setCustomOptimizeDone(false);
      setStatusMessage("Konten berhasil digenerate, jika tidak sesuai silahkan masukan ulang kata kunci pada kolom diatas.");
    } catch (err) {
      setError("Gagal mengambil data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async (content, index) => {
    setLoading(true);
    setStatusMessage("");
    try {
      const res = await fetch("http://localhost:8000/api/content-generate/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setContentList((prevList) => [...prevList, data]);

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === index ? { ...msg, title: data.title, content: data.content, category: data.category } : msg
        )
      );
      setCustomOptimizeDone(true); // optimize selesai
      setStatusMessage("Konten berhasil dioptimasi!");
    } catch (err) {
      setError("Gagal mengoptimasi konten.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomOptimize = async (query, content, index) => {
    if (!query.trim()) {
    setStatusMessage("Masukkan kata kunci tambahan sebelum optimasi.");
    return;
  }

    setLoading(true);
    setStatusMessage("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/content-generate/customoptimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, content }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setContentList((prevList) => [...prevList, data]);

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === index ? { ...msg, title: data.title, content: data.content, category: data.category } : msg
        )
      );
      setCustomOptimizeDone(true);
      setStatusMessage("Konten berhasil dioptimasi dengan custom query!");
    } catch (err) {
      setError("Gagal melakukan custom optimize.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (item) => {
  const payload = {
    judul: item.title || "Judul tidak tersedia",
    pemilik: "TP_Kaliurang",
    kategori: item.category || "Umum",
    isi_konten: item.content || "",
  };

  console.log("Payload yang dikirim:", payload);

  try {
    const res = await fetch("http://localhost:8000/api/content-generate/storecontent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json" // Tambahan penting ini!
      },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan konten.");
      } else {
        const text = await res.text();
        console.error("HTML error response:\n", text);
        throw new Error("Server mengembalikan HTML (bukan JSON). Cek endpoint Laravel-nya.");
      }
    }

    const responseData = await res.json();
    alert("✅ Konten berhasil disimpan!\nID: " + responseData.data.id);
  } catch (err) {
    console.error("❌ Gagal menyimpan:", err.message);
    alert(`❌ Gagal menyimpan konten: ${err.message}`);
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
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? 290 : 70,
        }}
      ></div>

      {/* <Sidebar /> */}

      <div
  className={`absolute top-4 transition-all duration-300 ease-in-out`}
  style={{
    left: isSidebarOpen ? 290 : 70, // biar sinkron sama sidebar
  }}
>
  <h1 className="text-[#000000] font-bold text-[32px] pl-4">
    Tlogo Generate Content
  </h1>
</div>

      <main className="flex-1 flex flex-col items-center px-12 py-18">
        <div
          className={`w-full max-w-3xl flex flex-col ${
            isEmpty ? "justify-center" : "justify-end"
          } flex-1`}
          style={{ minHeight: "70vh" }}
        >
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
                  className="w-full px-4 py-3 pr-14 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D6CB9]"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ height: "3rem" }}
                />
                <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
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
                    <Send size={20} className="text-blue-500 hover:text-blue-700 transition duration-200" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {!isEmpty && (
            <div className="flex flex-col-reverse flex-1 overflow-y-auto gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative w-full max-w-3xl overflow-x-visible"
              >
                <input
                  type="text"
                  placeholder="Masukkan kata kunci yang ingin dibuat"
                  className={`w-[99%] mb-2 ml-1 p-5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
                    customQuery.trim() !== "" 
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                      : "border-gray-300 focus:ring-blue-500 bg-white"
                  }`}
                  style={{ height: "3.3rem" }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={customQuery.trim() !== ""}
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

              <div className="flex flex-col gap-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl px-4 py-3 max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-100 text-gray-900 self-start prose prose-blue max-w-none"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {`### ${msg.title}\n\n${msg.content}`}
                        </ReactMarkdown>

                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col gap-2 mt-4 mb-4"
                        >

                          <input
                            type="text"
                            placeholder="Masukkan kata kunci tambahan"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D6CB9]"
                            value={customQuery}
                            onChange={(e) => {
                              setCustomQuery(e.target.value);
                              setCustomOptimizeDone(false); // reset flag kalau input berubah
                            }}
                          />
                        </motion.div>

                        {(!customOptimizeDone && customQuery.trim() !== "") && (
                          <span className="block text-red-500 text-xs -mt-3 mb-3"> {/* Perubahan kelas di sini */}
                            *Selesaikan custom optimize untuk mengaktifkan tombol simpan.
                          </span>
                        )}
                          <div className="flex justify-end gap-2.5">
                            <button
                              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                              onClick={() => handleCustomOptimize(customQuery, msg.content, idx)}
                              disabled={loading}
                            >
                              Custom Optimize
                            </button>
                            <button
                              className={`px-3 py-1 rounded text-sm cursor-pointer ${
                                loading || customQuery.trim() !== ""
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Gaya untuk disabled
                                  : "bg-green-500 hover:bg-green-600 text-white" // Gaya untuk enabled
                              }`}
                              onClick={() => handleOptimize(msg.content, idx)}
                              disabled={loading || customQuery.trim() !== ""}
                            >
                              Optimize
                            </button>
                            <button
                              className={`px-3 py-1 rounded text-sm cursor-pointer ${
                                loading || (!customOptimizeDone && customQuery.trim() !== "")
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Gaya untuk disabled
                                  : "bg-blue-500 hover:bg-blue-600 text-white" // Gaya untuk enabled
                              }`}
                              onClick={() => handleSave(msg)}
                              disabled={loading || (!customOptimizeDone && customQuery.trim() !== "")}
                            >
                              Simpan
                            </button>
                          </div>

                          {statusMessage && (
                            <div className="text-green-600 text-sm mt-1 max-w-100">
                              {statusMessage}
                            </div>
                          )}

                        {/* </div> */}
                      </>
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