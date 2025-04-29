'use client';

import React, { useState } from 'react';
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function Home() {
  const [activeTab, setActiveTab] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");

  const [data] = useState([
    {
      id: 1,
      status: "Konsep",
      date: "02/02/2025",
      title: "Weekend Santai di Tlogo",
      owner: "Aisyah Dwi A",
      category: "Udara Segar",
      detail: {
        judul: "Weekend Santai di Tlogo Putri...",
        deskripsi: "Libur-libur enaknya merefresh otak dan pikiran di kawasan Tlogo Putri, Kaliurang..."
      }
    },
    {
      id: 2,
      status: "Diterbitkan",
      date: "27/01/2025",
      title: "Seru di Kaliurang",
      owner: "Rekanita Yunia",
      category: "Wisata Alam",
      detail: {
        judul: "Seru di Kaliurang...",
        deskripsi: "Menikmati suasana sejuk dan wahana menarik di Kaliurang."
      }
    },
  ]);

  const tabs = [
    { label: "Semua", value: "semua", count: 1024 },
    { label: "Diterbitkan", value: "Diterbitkan", count: 834 },
    { label: "Konsep", value: "Konsep", count: 368 },
    { label: "Sampah", value: "Sampah", count: 0 },
  ];

  const filteredData = data.filter((item) => {
    const tabMatch =
      activeTab === "semua" ||
      item.status.toLowerCase() === activeTab.toLowerCase();
    const searchMatch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="min-h-screen flex bg-white font-poppins">
      {/* Sidebar */}
      <aside className="w-64">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex-col px-8 md:px-10 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[32px] font-semibold mb-6 text-black">Draft</h1>
        </div>

        {/* Tabs + Search + UserMenu */}
        <header className="flex items-center justify-between flex-wrap gap-4">
          {/* Tabs */}
          <div className="flex items-center bg-[#3D6CB9] p-2 rounded-lg space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1 rounded-[5px] text-sm font-normal ${
                  activeTab === tab.value
                    ? "bg-white text-[#3D6CB9]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex justify-end mb-4 w-full max-w-md">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              placeholder="Cari"
            />
          </div>

          {/* User Menu */}
          <UserMenu />
        </header>

        {/* Table */}
        <section className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                <th className="p-3 text-center">Tanggal</th>
                <th className="p-3 text-center">Judul</th>
                <th className="p-3 text-center">Pemilik</th>
                <th className="p-3 text-center">Kategori</th>
                <th className="p-3 text-center">Detail AIOSEO</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-100">
                    <td className="p-3 text-center">
                      <div className="text-sm text-gray-800">{item.date}</div>
                      <div
                        className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full ${
                          item.status === "Diterbitkan"
                            ? "bg-green-100 text-green-600"
                            : item.status === "Konsep"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.status}
                      </div>
                    </td>
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.owner}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 whitespace-pre-wrap">
                      <div><strong>Judul:</strong> {item.detail.judul}</div>
                      <div><strong>Deskripsi:</strong> {item.detail.deskripsi}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => alert(`Edit artikel: ${item.title}`)}
                          className="p-2 rounded-md text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => alert(`Hapus artikel: ${item.title}`)}
                          className="p-2 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-6 italic">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
