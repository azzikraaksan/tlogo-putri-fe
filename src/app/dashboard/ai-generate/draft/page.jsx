'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '/components/Sidebar.jsx';
import UserMenu from '/components/Pengguna.jsx';
import SearchInput from '/components/Search.jsx';
import EditorArtikel from '/components/EditArtikel.jsx';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function Page() {
  const [activeTab, setActiveTab] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const selectedArticle = data.find((item) => item.id === Number(selectedId));

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/content-generate/draft');
      if (!res.ok) throw new Error('Gagal mengambil data');
      const result = await res.json();
      console.log('DATA DARI API:', result);
      setData(result.data);
      setLoading(false);
    } catch (err) {
      console.error('ERROR:', err.message);
      setError(err.message);
      setLoading(false);
    }
  }

  const filteredData = data.filter((item) => {
    const tabMatch =
      activeTab.toLowerCase() === 'semua' ||
      item.status?.toLowerCase() === activeTab.toLowerCase();
    const searchMatch =
      item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemilik?.toLowerCase().includes(searchTerm.toLowerCase());
    return tabMatch && searchMatch;
  });

  const handleSave = async (updatedArticle) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/content-generate/article/${updatedArticle.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedArticle),
        }
      );
      if (!res.ok) throw new Error('Gagal menyimpan data');
      alert('Artikel berhasil disimpan');
      await fetchData();
      router.push('/dashboard/ai-generate/draft');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/content-generate/article/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) throw new Error('Gagal menghapus data');
      alert('Artikel berhasil dihapus');
      await fetchData();
      if (selectedId && parseInt(selectedId) === id) {
        router.push('/dashboard/ai-generate/draft');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const onBack = () => {
    router.push('/dashboard/ai-generate/draft');
  };

  const tabs = [
    { label: 'Semua', value: 'semua' },
    { label: 'Diterbitkan', value: 'Diterbitkan' },
    { label: 'Konsep', value: 'Konsep' },
    { label: 'Sampah', value: 'Sampah' },
  ];

  if (loading) return <div>Memuat data...</div>;
  if (error) return <div>Terjadi kesalahan: {error}</div>;

  // Tampilkan Editor jika ada selectedId dan selectedArticle ditemukan
  if (selectedId && selectedArticle) {
    return (
      <div className="min-h-screen flex bg-white font-poppins">
        <aside className="w-64">
          <Sidebar />
        </aside>

        <EditorArtikel
          article={selectedArticle}
          onSave={handleSave}
          onDelete={handleDelete}
          onBack={onBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white font-poppins">
      <aside className="w-64">
        <Sidebar />
      </aside>

      <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Daftar Artikel</h1>
          <UserMenu />
        </div>

        <div className="flex justify-between items-center">
          <div className="bg-[#3D6CB9] p-2 rounded-lg flex gap-4 items-center">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded cursor-pointer ${
                  activeTab === tab.value ? 'bg-white text-[#3D6CB9]' : 'bg-gray-100 text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left text-sm">
                <th className="px-4 py-2 border">Judul</th>
                <th className="px-4 py-2 border">Pemilik</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                    Tidak ada artikel yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
                    <td className="px-4 py-2 border">{item.judul || '-'}</td>
                    <td className="px-4 py-2 border">{item.pemilik || '-'}</td>
                    <td className="px-4 py-2 border">-</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/ai-generate/draft?id=${item.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
