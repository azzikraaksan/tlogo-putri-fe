"use client";

import React, { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [inputValue, setInputValue] = useState("");

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
          <h1 className="text-[#3D6CB9] font-bold text-[32px]">Tlogo Generate Content</h1>
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
              placeholder="Masukkan kata kunci konten yang ingin dibuat"
              className="w-full px-6 py-4 border border-blue-200 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400 pr-12 transition-all duration-300"
            />
            {inputValue && (
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Send size={20} />
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}