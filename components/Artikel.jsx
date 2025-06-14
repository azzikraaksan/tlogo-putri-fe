'use client'; 
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import SearchInput from '/components/Search.jsx';
import EditorArtikel from '/components/EditArtikel.jsx';
import { FiEdit, FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import DOMPurify from 'dompurify';
import Sidebar from "/components/Sidebar";
import Hashids from 'hashids';

function stripHtmlTags(html) {
  if (typeof window === 'undefined') return html;
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function truncateText(text, maxLength) {
  if (!text) return '';
  const cleanText = stripHtmlTags(text);
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  return cleanText.substring(0, maxLength) + '...';
}

function formatStatus(status) {
  if (!status) return 'Konsep';
  const s = status.toLowerCase();
  if (s === 'terbit' || s === 'diterbitkan') return 'Diterbitkan';
  if (s === 'sampah') return 'Sampah';
  if (s === 'konsep') return 'Konsep';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export default function Artikel() { 
  const [activeTab, setActiveTab] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIdHash = searchParams.get('id');
  const decodedIds = selectedIdHash ? hashids.decode(selectedIdHash) : [];
  const selectedId = decodedIds.length > 0 ? decodedIds[0] : null;
  const selectedArticle = data.find((item) => item.id === selectedId);


  const tabs = [
    { label: 'Semua', value: 'semua' },
    { label: 'Diterbitkan', value: 'Diterbitkan' },
    { label: 'Konsep', value: 'Konsep' },
    { label: 'Sampah', value: 'Sampah' },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      let url = '';

      switch (activeTab.toLowerCase()) {
        case 'terbit':
          url = 'https://tpapi.siunjaya.id/api/content-generate/articleterbit';
          break;
        case 'konsep':
          url = 'https://tpapi.siunjaya.id/api/content-generate/articlekonsep';
          break;
        case 'sampah':
          url = 'https://tpapi.siunjaya.id/api/content-generate/articlesampah';
          break;
        default:
          url = 'https://tpapi.siunjaya.id/api/content-generate/draft';
          break;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const result = await res.json();
      const sorted = result.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setData(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
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
      const bodyData = {
        ...updatedArticle,
        status: publish ? 'terbit' : updatedArticle.status || 'konsep',
        // thumbnail: typeof updatedArticle.thumbnail === 'string' ? updatedArticle.thumbnail : '',
      };

      const res = await fetch(
        `https://tpapi.siunjaya.id/api/content-generate/articleupdate/${updatedArticle.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        }
      );
      if (!res.ok) throw new Error('Gagal menyimpan data');

      alert(publish ? 'Artikel berhasil diterbitkan' : 'Artikel berhasil disimpan');

      await fetchData();
      router.push('/dashboard/ai-generate/draft');
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePublish = (article) => {
    handleSave(article, true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;
    try {
      const res = await fetch(
        `https://tpapi.siunjaya.id/api/content-generate/articledelete/${id}`,
        { method: 'POST' }
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

  const handleRestore = async (id) => {
    if (!confirm('Yakin ingin memulihkan artikel ini?')) return;
    try {
      const res = await fetch(
        `https://tpapi.siunjaya.id/api/content-generate/articleupdate/${id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'konsep' }),
        }
      );
      if (!res.ok) throw new Error('Gagal memulihkan artikel');
      alert('Artikel berhasil dipulihkan ke Konsep');
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const onBack = () => {
    router.push('/dashboard/ai-generate/draft');
  };

  if (loading) {
  return (
    <div className="flex bg-white font-poppins min-h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className="transition-all duration-300 ease-in-out w-full"
        style={{
          marginLeft: isSidebarOpen ? 290 : 70,
        }}
      >
        <main className="md:px-10 py-6 space-y-6">
          <h1 className="text-3xl font-bold text-black mb-4">Daftar Artikel</h1>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-150 ${
                    activeTab === tab.value
                      ? "bg-[#3D6CB9] text-white"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="overflow-x-auto rounded-md shadow-md max-h-139">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-[#3D6CB9] text-white">
                <tr>
                  <th className="px-4 py-2 text-center">Tanggal</th>
                  <th className="px-4 py-2 text-center">Judul</th>
                  <th className="px-4 py-2 text-center">Pemilik</th>
                  <th className="px-4 py-2 text-center">Kategori</th>
                  <th className="px-4 py-2 text-center">Detail AIOSEO</th>
                  <th className="px-4 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
  // if (loading) return <div>Memuat data...</div>;
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
          <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
          
                <div
                  className="transition-all duration-300 ease-in-out"
                  style={{
                    marginLeft: isSidebarOpen ? 290 : 70,
                  }}
                ></div>
        </aside>
        <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
          <EditorArtikel
            article={selectedArticle}
            onSave={handleSave}
            onPublish={handlePublish}
            onBack={onBack}
            
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-white font-poppins">
        <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
          
                <div
                  className="transition-all duration-300 ease-in-out"
                  style={{
                    marginLeft: isSidebarOpen ? 290 : 70,
                  }}
                ></div>

      <main className="md:px-10 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Daftar Artikel</h1>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-1 mb-6">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === tab.value
                    ? "bg-[#3D6CB9] text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="overflow-x-auto rounded-md shadow-md max-h-139">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10 text-center">Tanggal</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10 text-center">Judul</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10 text-center">Pemilik</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10 text-center">Kategori</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10 text-center">Detail AIOSEO</th>
                <th className="px-4 py-2 sticky top-0 bg-[#3D6CB9] z-10 text-center">Aksi</th>
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
                          ?.split(/,\s*|\n|[-•]/)
                          .map((i) => i.trim().replace(/^\d+\.\s*/, ''))
                          .filter(Boolean)
                          .slice(0, 1)
                          .join(', ') || '-'}
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
                          title={stripHtmlTags(item.isi_konten)} // Ini untuk tooltip agar bersih dari HTML
                          // Langsung sanitasi dan potong teks HTML di sini, tanpa stripHtmlTags sebelum truncation
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.isi_konten).substring(0, 150) + '...' }}
                        />

                      </td>
                      <td className="px-6 py-3 align-middle">
                        <div className="flex flex-row items-center justify-center space-x-3 h-full">

                        {item.status?.toLowerCase() === 'sampah' ? (
                          <button
                          onClick={() => handleRestore(item.id)}
                          title="Restore"
                          className="text-green-600 hover:text-green-800 leading-none flex items-center justify-center cursor-pointer"
                          >
                            <FiRotateCcw size={18} />
                          </button>
                        ) : (
                          <>
                        <button
                          onClick={() => {
                            const encodedId = hashids.encode(item.id);
                            router.push(`/dashboard/ai-generate/draft?id=${encodedId}`);
                          }}
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
                        </>
                        )}
                        </div>
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