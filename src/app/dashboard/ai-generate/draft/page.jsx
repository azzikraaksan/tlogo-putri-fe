"use client";

import React, { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

export default function Home() {
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([
    { id: 1, status: 'Konsep', date: '02/02/2025', title: 'Weekend Santai di Tlogo', owner: 'Aisyah Dwi A', category: 'Udara Segar', detail: 'Judul : Weekend Santai di Tlogo Putri...' },
    { id: 2, status: 'Diterbitkan', date: '27/01/2025', title: 'Seru di Kaliurang', owner: 'Rekanita Yunia', category: 'Wisata Alam', detail: 'Judul : Seru di Kaliurang...' },
    // Tambahin data lain juga
  ]);

  const tabs = [
    { label: 'Semua', value: 'semua', count: 1024 },
    { label: 'Diterbitkan', value: 'Diterbitkan', count: 834 },
    { label: 'Konsep', value: 'Konsep', count: 368 },
    { label: 'Sampah', value: 'Sampah', count: 0 },
  ];

  const filteredData = data.filter(item => {
    const tabMatch = activeTab === 'semua' || item.status.toLowerCase() === activeTab.toLowerCase();
    const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="min-h-screen flex bg-white relative font-poppins">
      
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 space-y-6">

        {/* Header: Tabs + Search + UserMenu */}
        <div className="flex items-center justify-between">
          
          {/* Tabs + Search Container */}
          <div className="flex items-center bg-[#3D6CB9] p-2 rounded-lg space-x-2 flex-grow mr-6">

            {/* Tabs */}
            <div className="flex space-x-2">
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-3 py-1 rounded-full text-sm font-normal ${
                    activeTab === tab.value
                      ? 'bg-white text-[#3D6CB9]'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-grow max-w-xs ml-4">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                placeholder="Cari"
                className="w-full border border-blue-400 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

          </div>

          {/* User Menu */}
          <UserMenu />

        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                <th className="text-left p-3">Tanggal</th>
                <th className="text-left p-3">Judul</th>
                <th className="text-left p-3">Pemilik</th>
                <th className="text-left p-3">Kategori</th>
                <th className="text-left p-3">Detail</th>
                <th className="text-left p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">
                    <div>{item.status}</div>
                    <div className="text-xs text-gray-500">{item.date}</div>
                  </td>
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.owner}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.detail}</td>
                  <td className="p-3 flex space-x-2">
                    <button onClick={() => alert(`Edit artikel: ${item.title}`)} className="text-blue-500 hover:text-blue-700">
                      <FiEdit />
                    </button>
                    <button onClick={() => alert(`Hapus artikel: ${item.title}`)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-6">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
