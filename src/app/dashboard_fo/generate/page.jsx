import React from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";

export default function Home() {
  return (
    <div className="min-h-screen flex bg-white relative">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>
      <UserMenu />
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 pt-20">

        {/* Logo */}
        <div className="absolute top-4 left-72">
          <h1 className="text-[#3D6CB9] font-bold text-[32px]">Tlogo Generate Content</h1>
        </div>

        {/* Prompt Text */}
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#3D6CB9] mb-4 mt-10">
          Apa yang bisa saya bantu?
        </h2>

        {/* Input Box */}
        <div className="w-full max-w-xl">
          <input
            type="text"
            placeholder="Masukkan kata kunci konten yang ingin dibuat"
            className="w-full px-6 py-4 border border-blue-200 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

// alo ini coba coba