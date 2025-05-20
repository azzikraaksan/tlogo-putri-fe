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
      setData(result.data);
      setLoading(false);
    } catch (err) {
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

  // Jika sedang memilih artikel untuk diedit
  if (selectedId && selectedArticle) {
    return (
      <div className="min-h-screen flex bg-white font-poppins">
        <aside className="w-64">
          <Sidebar />
        </aside>
        <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
          <EditorArtikel article={selectedArticle} onSave={handleSave} onBack={onBack} />
        </main>
      </div>
    );
  }

  // Tampilan daftar artikel
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

        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2 bg-[#3D6CB9] p-2 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab.value
                    ? 'bg-white text-[#3D6CB9]'
                    : 'bg-gray-100 text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="overflow-x-auto rounded-md shadow-md">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-[#3D6CB9] text-white uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Judul</th>
                <th className="px-4 py-2">Pemilik</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Detail Aioseo</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Tidak ada artikel yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div>{item.date}</div>
                      <div
                        className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium ${
                          item.status === 'Diterbitkan'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.status}
                      </div>
                    </td>
                    <td className="px-4 py-2">{item.title || '-'}</td>
                    <td className="px-4 py-2">{item.owner || '-'}</td>
                    <td className="px-4 py-2 italic">{item.category || '-'}</td>
                    <td className="px-4 py-2 max-w-xs">
                      <div
                        className="text-sm font-semibold truncate"
                        title={item.detail?.judul}
                      >
                        {item.detail?.judul || '-'}
                      </div>
                      <div
                        className="text-xs text-gray-500 truncate"
                        title={item.detail?.deskripsi}
                      >
                        {item.detail?.deskripsi || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-2 flex space-x-3">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/ai-generate/draft?id=${item.id}`)
                        }
                        title="Edit"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Hapus"
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 size={18} />
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
