'use client';

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import { CircleArrowLeft } from "lucide-react";
import { FiEdit, FiTrash2, FiImage, FiEdit3, FiBold, FiItalic, FiUnderline, FiLink } from "react-icons/fi";

export default function Home() {
  const [activeTab, setActiveTab] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  const judulRef = useRef(null);
  const deskripsiRef = useRef(null);
  const [activeInputRef, setActiveInputRef] = useState(judulRef);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');

  const applyFormatting = (ref, formatType) => {
    const input = ref.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selectedText = input.value.substring(start, end);

    let formatted = selectedText;
    switch (formatType) {
      case "bold":
        formatted = `**${selectedText}**`;
        break;
      case "italic":
        formatted = `*${selectedText}*`;
        break;
      case "underline":
        formatted = `<u>${selectedText}</u>`;
        break;
      case "link":
        formatted = `[${selectedText}](https://)`;
        break;
    }

    input.setRangeText(formatted, start, end, "end");
    input.focus();
  };

  const [data, setData] = useState([
    {
      id: 1,
      status: "Konsep",
      date: "02/02/2025",
      title: "Weekend Santai? Ke Tlogo Putri Aja, Udara Segar dan Alam Terbuka",
      owner: "Aisyah Dwi A",
      category: "Udara Segar",
      detail: {
        judul: "Weekend Santai? Ke Tlogo Putri Aja, Udara Segar...",
        deskripsi: "Libur-libur enaknya merefresh otak..."
      }
    },
    {
      id: 2,
      status: "Diterbitkan",
      date: "27/01/2025",
      title: "Weekend Seru di Tlogo Putri Kaliurang, Wisata Alam Plus Hiburan Lengkap",
      owner: "Rekanita Yunia",
      category: "Wisata Alam",
      detail: {
        judul: "Weekend Seru di Tlogo Putri Kaliurang, Wisata Alam...",
        deskripsi: "Menikmati suasana sejuk..."
      }
    },
    {
      id: 3,
      status: "Konsep",
      date: "27/01/2025",
      title: "Tlogo Putri Kaliurang : Daya Tarik, Harga Tiket, Jam Buka, dan Rute",
      owner: "Mita Aprilia D",
      category: "Daya Tarik",
      detail: {
        judul: "Tlogo Putri Kaliurang: Daya Tarik, Harga Tiket, Jam...",
        deskripsi: "Wisata Alam dengan panorama indah di..."
      }
    },
    {
      id: 4,
      status: "Diterbitkan",
      date: "15/01/2025",
      title: "Nyalimu Seberapa? Uji di Medan Ekstrem Jeep Tlogo Putri Kaliurang!",
      owner: "Deviana Dyah",
      category: "Medan Ekstrem",
      detail: {
        judul: "Nyalimu Seberapa? Uji di Medan Ekstrem Jeep T...",
        deskripsi: "Kamu pecinta tantangan dan p..."
      }
    },
    {
      id: 5,
      status: "Diterbitkan",
      date: "10/01/2025",
      title: "Tlogo Putri Kaliurang: 2 Alasan Untuk Berkunjung, Info Tiket, dan Jam Buka",
      owner: "Irene Jeny",
      category: "Pesona Alam",
      detail: {
        judul: "Tlogo Putri Kaliurang 2: Alasan Untuk Berkunjung, In...",
        deskripsi: "Banyak alasan buat balik lagi, su..."
      }
    },
    {
      id: 6,
      status: "Diterbitkan",
      date: "05/01/2025",
      title: "Tlogo Putri Kaliurang - Tiket Masuk, Lokasi, dan Rutenya",
      owner: "Aldo Susilo",
      category: "Tiket Masuk",
      detail: {
        judul: "Tlogo Putri Kaliurang - Tiket Masuk, Lokasi, dan Rut...",
        deskripsi: "Sebelum ke sana, cek dulu harg..."
      }
    }, 
    {
      id: 7,
      status: "Diterbitkan",
      date: "05/01/2025",
      title: "Rekomendasi Wisata Alam di Tlogo Putri Kaliurang: Telaga Para Bidadari",
      owner: "Endin Syamsul",
      category: "Telaga",
      detail: {
        judul: "Rekomendasi Wisata Alam di Tlogo Putri Kaliuran...",
        deskripsi: "Pilihan Wisata alam terbaik untuk..."
      }
    },
    {
      id: 8,
      status: "Diterbitkan",
      date: "01/01/2025",
      title: "Tlogo Putri Kaliurang Yogyakarta: Keajaiban Alam Tersembunyi Di Kaki Gunung",
      owner: "Ajeng Yunia",
      category: "Keajaiban Alam",
      detail: {
        judul: "Tlogo Putri Kaliurang Yogyakarta: Keajaiban Alam Terse...",
        deskripsi: "Destinasi eksotis yang memaduk..."
      }
    }
  ]);

  const tabs = [
    { label: "Semua", value: "Semua", count: data.filter(d => d.status.toLowerCase() !== "sampah").length },
    { label: "Diterbitkan", value: "Diterbitkan", count: data.filter(d => d.status === "Diterbitkan").length },
    { label: "Konsep", value: "Konsep", count: data.filter(d => d.status === "Konsep").length },
    { label: "Sampah", value: "Sampah", count: data.filter(d => d.status.toLowerCase() === "sampah").length },
  ];

  const filteredData = data.filter((item) => {
    const status = item.status.toLowerCase();
    const term = searchTerm.toLowerCase();
    if (activeTab.toLowerCase() === "sampah") {
      return status === "sampah";
    } else if (activeTab.toLowerCase() === "semua") {
      return status !== "sampah" && (
        item.title.toLowerCase().includes(term) ||
        item.owner.toLowerCase().includes(term)
      );
    } else {
      return status === activeTab.toLowerCase() && (
        item.title.toLowerCase().includes(term) ||
        item.owner.toLowerCase().includes(term)
      );
    }
  });


  const selectedArticle = data.find((item) => item.id === parseInt(selectedId));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRestore = (id) => {
    const confirmed = confirm("Pulihkan artikel ini dari Sampah?");
    if (confirmed) {
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, status: "Konsep" } : item
        )
      );
      setActiveTab("Konsep"); // Beralih ke tab Konsep setelah dipulihkan
    }
  };

  const onKembali = () => {
    router.push("/dashboard/ai-generate/draft");
  };

  const handleDelete = (id) => {
    const confirmed = confirm("Yakin ingin menghapus artikel ini?");
    if (confirmed) {
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, status: "Sampah" } : item
        )
      );
      setActiveTab("Sampah"); // Beralih ke tab Sampah
    }
  };

  // Editor View
  if (selectedId && selectedArticle) {
    return (
      <div className="min-h-screen flex bg-white font-poppins">
        <aside className="w-64">
          <Sidebar />
        </aside>
        <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
          <div className="flex items-center space-x-4">
            <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
            <h1 className="text-[32px] font-bold text-black">Editor Artikel</h1>
          </div>

          <div className="flex justify-end items-center space-x-4">
            <span className="text-sm italic text-gray-500">Kutip Sumber Anda</span>
            <button className="flex items-center space-x-1 text-blue-600 hover:underline">
              <FiEdit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-6 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Ikon Gambar */}
              <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-gray-100 rounded hover:bg-gray-200" title="Upload Gambar">
                <FiImage className="w-6 h-6 text-gray-700" />
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

              {/* Toolbar */}
              <div className="flex gap-2 ml-2">
                <button onClick={() => applyFormatting(activeInputRef, "bold")} className="p-2 bg-gray-100 rounded hover:bg-gray-200" title="Bold">
                  <FiBold className="w-5 h-5 text-gray-700"/>
                </button>
                <button onClick={() => applyFormatting(activeInputRef, "italic")} className="p-2 bg-gray-100 rounded hover:bg-gray-200" title="Italic">
                  <FiItalic className="w-5 h-5 text-gray-700"/>
                </button>
                <button onClick={() => applyFormatting(activeInputRef, "underline")} className="p-2 bg-gray-100 rounded hover:bg-gray-200" title="Underline">
                  <FiUnderline className="w-5 h-5 text-gray-700"/>
                </button>
                <button onClick={() => applyFormatting(activeInputRef, "link")} className="p-2 bg-gray-100 rounded hover:bg-gray-200" title="Link">
                  <FiLink className="w-5 h-5 text-gray-700"/>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input
                ref={judulRef}
                onFocus={() => setActiveInputRef(judulRef)}
                className="w-full p-2 border rounded-md"
                defaultValue={selectedArticle.detail.judul}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                ref={deskripsiRef}
                onFocus={() => setActiveInputRef(deskripsiRef)}
                className="w-full p-2 border rounded-md"
                rows={5}
                defaultValue={selectedArticle.detail.deskripsi}
              />
            </div>

            <button onClick={onKembali} className="mt-4 px-4 py-2 bg-[#3D6CB9] text-white rounded-md">
              Simpan
            </button>
          </div>
        </main>
      </div>
    );
  }

  // List View (dipertahankan seperti sebelumnya)
  return (
    <div className="min-h-screen flex bg-white font-poppins">
      <aside className="w-64">
        <Sidebar />
      </aside>
      <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-[32px] font-bold text-black">Daftar Artikel</h1>
          <UserMenu />
        </div>

        <div className="flex justify-between items-center">
          <div className="bg-[#3D6CB9] p-2 rounded-lg flex justify-between gap-4 items-center">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded ${activeTab === tab.value ? 'bg-white text-[#3D6CB9]' : 'bg-gray-100 text-black'}`}
              >
                {tab.label} ({tab.count})
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
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div>{item.date}</div>
                    <div className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium ${item.status === "Diterbitkan" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {item.status}
                    </div>
                  </td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.owner}</td>
                  <td className="px-4 py-2 italic">{item.category}</td>
                  <td className="px-4 py-2 max-w-xs">
                    <div className="text-sm font-semibold truncate" title={item.detail?.judul}>
                      {item.detail?.judul || '-'}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={item.detail?.deskripsi}>
                      {item.detail?.deskripsi || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-2 flex space-x-3">
                    <button
                      onClick={() => router.push(`/dashboard/ai-generate/draft?id=${item.id}`)}
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
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
