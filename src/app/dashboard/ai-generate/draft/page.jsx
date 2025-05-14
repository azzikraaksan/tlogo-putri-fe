'use client';

import React, { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import { FiEdit, FiTrash2, FiImage, FiEdit3 } from "react-icons/fi";
import 'react-quill/dist/quill.snow.css';
import { CircleArrowLeft } from "lucide-react";
import ReactQuill from 'react-quill';

export default function Home() {
  const [activeTab, setActiveTab] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  const [editorContent, setEditorContent] = useState('');
  const judulRef = useRef(null);
  const deskripsiRef = useRef(null);

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
      default:
        break;
    }

    input.setRangeText(formatted, start, end, "end");
    input.focus();
  };

  const [data] = useState([
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
      date: "01/01/2022",
      title: "Tlogo Putri Kaliurang Yogyakarta: Keajaiban Alam Tersembunyi Di Kaki Gunung",
      owner: "Ajeng Yunia",
      category: "Keajaiban Alam",
      detail: {
        judul: "Tlogo Putri Kaliurang Yogyakarta: Keajaiban Alam Tersembunyi...",
        deskripsi: "Destinasi eksotis yang memaduk..."
      }
    }
  ]);

  const tabs = [
    { label: "Semua", value: "semua", count: 1024 },
    { label: "Diterbitkan", value: "Diterbitkan", count: 834 },
    { label: "Konsep", value: "Konsep", count: 368 },
    { label: "Sampah", value: "Sampah", count: 0 },
  ];

  const filteredData = data.filter((item) => {
    const tabMatch = activeTab === "semua" || item.status.toLowerCase() === activeTab.toLowerCase();
    const searchMatch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase());
    return tabMatch && searchMatch;
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

  const onKembali = () => {
    router.push("/dashboard/ai-generate/draft");
  };

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
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <FiImage className="w-6 h-6 text-gray-700" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                onClick={() => applyFormatting(judulRef, "bold")}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => applyFormatting(judulRef, "italic")}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 italic"
                title="Italic"
              >
                I
              </button>
              <button
                onClick={() => applyFormatting(judulRef, "underline")}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 underline"
                title="Underline"
              >
                U
              </button>
              <button
                onClick={() => applyFormatting(judulRef, "link")}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                title="Link Sumber"
              >
                🔗
              </button>

              <select className="p-1 border rounded text-sm" title="Ukuran Teks">
                <option value="normal">Normal</option>
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
              </select>

              <button className="p-2 rounded bg-gray-100 hover:bg-gray-200" title="Bullet List">••</button>
              <button className="p-2 rounded bg-gray-100 hover:bg-gray-200" title="Number List">1.</button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input
                ref={judulRef}
                className="w-full p-2 border rounded-md"
                defaultValue={selectedArticle.detail.judul}
              />    
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                ref={deskripsiRef}
                className="w-full p-2 border rounded-md"
                rows={5}
                defaultValue={selectedArticle.detail.deskripsi}
              />
            </div>

            <button
              onClick={() => router.push('/dashboard/ai-generate/draft')}
              className="mt-4 px-4 py-2 bg-[#3D6CB9] text-white rounded-md"
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>Loading...</div>
  );
}
