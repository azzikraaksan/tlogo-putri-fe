"use client";

import React, { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import { Send } from "lucide-react";
import { motion } from "framer-motion";



function ContentGenerator() {
  const [inputValue, setInputValue] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (inputValue.trim().length === 0) {
        console.log("Input kosong, tidak bisa submit");
        return;
      }
      else{

        setLoading(true);
        setError(null);
        setTitle("");
        setContent("");
        
        try {
          const response = await fetch("http://localhost:8000/api/content-generate/generate", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: inputValue }),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        // Simpan hasil title dan content dari API
        setTitle(data.title || "Tidak ada judul");
        setContent(data.content || "Tidak ada konten");
      } catch (err) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }}
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      <UserMenu />
      {/* User Menu */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 pt-20">
        {/* Logo */}
        <div className="absolute top-4 left-72">
          <h1 className="text-[#000000] font-bold text-[32px]">Tlogo Generate Content</h1>
        </div>

        {/* Centered Prompt and Input */}
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-6 w-full">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#3D6CB9]">
            Apa yang bisa saya bantu?
          </h2>

          <motion.div
            className="w-full max-w-xl relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Masukkan kata kunci konten yang ingin dibuat"
              className="w-full px-6 py-4 border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400 pr-12 transition-all duration-300 focus:border-blue-400"
              style={{
                boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            {inputValue && (
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onKeyDown={handleKeyDown}
              >
                <Send size={20} />
              </motion.button>
            )}
          </motion.div>
            {loading && <p className="mt-4 text-blue-600">Loading...</p>}
            {error && <p className="mt-4 text-red-600">Error: {error}</p>}

            {/* Tampilkan title */}
            {title && <h2 className="mt-6 mx-5 text-xl font-semibold text-gray-900">{title}</h2>}

            {/* Tampilkan content */}
            {content && (
              <div className="m-2 ml-5 p-4 border border-blue-300 rounded bg-blue-50 text-blue-900 whitespace-pre-wrap">
                {content}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default ContentGenerator;