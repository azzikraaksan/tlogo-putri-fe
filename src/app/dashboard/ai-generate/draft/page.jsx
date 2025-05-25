'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '/components/Sidebar.jsx';
import UserMenu from '/components/Pengguna.jsx';
import SearchInput from '/components/Search.jsx';
import EditorArtikel from '/components/EditArtikel.jsx';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

function formatStatus(status) {
  if (!status) return 'Konsep'; // default
  const s = status.toLowerCase();
  if (s === 'terbit' || s === 'diterbitkan') return 'Diterbitkan';
  if (s === 'sampah') return 'Sampah';
  if (s === 'konsep') return 'Konsep';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

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
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);

    try {
      let url = '';

      switch (activeTab.toLowerCase()) {
        case 'terbit':
          url = 'http://127.0.0.1:8000/api/content-generate/articleterbit';
          break;
        case 'konsep':
          url = 'http://127.0.0.1:8000/api/content-generate/articlekonsep';
          break;
        case 'sampah':
          url = 'http://127.0.0.1:8000/api/content-generate/articlesampah';
          break;
        default:
          url = 'http://127.0.0.1:8000/api/content-generate/draft';
          break;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const result = await res.json();
      const sorted = result.data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      setData(sorted);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const filteredData = data.filter((item) => {
    const status = item.status?.toLowerCase();

    const tabMatch =
      activeTab.toLowerCase() === 'semua' ||
      (activeTab.toLowerCase() === 'diterbitkan' && (status === 'terbit' || status === 'diterbitkan')) ||
      status === activeTab.toLowerCase();

    const searchMatch =
      item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchTerm.toLowerCase());

    return tabMatch && searchMatch;
  });

  const handleSave = async (updatedArticle, publish = false) => {
    try {
      // Status terbit jika publish true, else sesuai input atau default konsep
      const bodyData = {
        ...updatedArticle,
        status: publish ? 'terbit' : updatedArticle.status || 'konsep',
      };

      const res = await fetch(
        `http://127.0.0.1:8000/api/content-generate/articleupdate/${updatedArticle.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        }
      );
      if (!res.ok) throw new Error('Gagal menyimpan data');

      if (publish) {
        alert('Artikel berhasil diterbitkan');
      } else {
        alert('Artikel berhasil disimpan');
      }

      await fetchData();
      router.push('/dashboard/ai-generate/draft');
    } catch (err) {
      alert(err.message);
    }
  };

  // fungsi khusus publish, panggil handleSave dengan publish=true
  const handlePublish = (article) => {
    handleSave(article, true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/content-generate/articledelete/${id}`,
        {
          method: 'POST',
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

  if (selectedId && !selectedArticle) {
    return (
      <div className="min-h-screen flex bg-white font-poppins">
        <aside className="w-64">
          <Sidebar />
        </aside>
        <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
          <div>Memuat artikel...</div>
        </main>
      </div>
    );
  }

  if (selectedId && selectedArticle) {
    return (
      <div className="min-h-screen flex bg-white font-poppins">
        <aside className="w-64">
          <Sidebar />
        </aside>
        <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
          <EditorArtikel
            article={selectedArticle}
            onSave={handleSave}        // simpan draft
            onPublish={handlePublish}  // publish artikel
            onBack={onBack}
          />
        </main>
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

        <div className="flex flex-wrap justify-between items-center gap-1">
          <div className="flex gap-2 bg-[#3D6CB9] p-2 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-2 rounded cursor-pointer ${
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

        <div className="overflow-x-auto rounded-md shadow-md max-h-125">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10">Tanggal</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10">Judul</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10">Pemilik</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10">Kategori</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10">Detail AIOSEO</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10">Aksi</th>
              </tr >
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Tidak ada artikel yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const formattedStatus = formatStatus(item.status);

                  const statusClass =
                    formattedStatus === 'Diterbitkan'
                      ? 'bg-green-100 text-green-700'
                      : formattedStatus === 'Sampah'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700';

                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div>{item.tanggal || '-'}</div>
                        <div
                          className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium ${statusClass}`}
                        >
                          {formattedStatus}
                        </div>
                      </td>
                      <td className="px-4 py-2">{item.title || item.judul || '-'}</td>
                      <td className="px-4 py-2">{item.owner || item.pemilik || '-'}</td>
                      <td className="px-4 py-2 italic">
                        {item.kategori
                          ?.split(/\n|[-•]/)                     // pisah berdasarkan newline, strip, bullet
                          .map(i => i.trim().replace(/^\d+\.\s*/, '')) // buang angka + titik di awal
                          .filter(Boolean)                      // buang string kosong
                          .slice(0, 1)                          // ambil maksimal 1
                          .join(', ')                           // gabung pakai koma
                          || '-'}
                      </td>
                      <td className="px-4 py-2 max-w-xs">
                        <div
                          className="text-sm font-semibold truncate text-justify"
                          title={item.judul}
                        >
                          {item.judul || '-'}
                        </div>
                        <div
                          className="text-xs text-gray-500 truncate"
                          title={item.isi_konten}
                        >
                          {item.isi_konten || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-13 flex items-center space-x-3">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/ai-generate/draft?id=${item.id}`)
                          }
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800 leading-none flex items-center justify-center cursor-pointer"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Hapus"
                          className="text-red-600 hover:text-blue-800 leading-none flex items-center justify-center cursor-pointer"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}