// 'use client';

// import React, { useState, useRef } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";
// import { FiEdit, FiTrash2, FiImage, FiEdit3, FiList } from "react-icons/fi";

// export default function Home() {
//   const [activeTab, setActiveTab] = useState("semua");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const fileInputRef = useRef();

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const selectedId = searchParams.get('id');

//   const [data] = useState([
//     {
//       id: 1,
//       status: "Konsep",
//       date: "02/02/2025",
//       title: "Weekend Santai? Ke Tlogo Putri Aja, Udara Segar dan Alam Terbuka",
//       owner: "Aisyah Dwi A",
//       category: "Udara Segar",
//       detail: {
//         judul: "Weekend Santai? Ke Tlogo Putri Aja, Udara Segar...",
//         deskripsi: "Libur-libur enaknya merefresh otak..."
//       }
//     },
//     {
//       id: 2,
//       status: "Diterbitkan",
//       date: "27/01/2025",
//       title: "Weekend Seru di Tlogo Putri Kaliurang, Wisata Alam Plus Hiburan Lengkap",
//       owner: "Rekanita Yunia",
//       category: "Wisata Alam",
//       detail: {
//         judul: "Weekend Seru di Tlogo Putri Kaliurang, Wisata Alam...",
//         deskripsi: "Menikmati suasana sejuk..."
//       }
//     },
//     {
//       id: 3,
//       status: "Konsep",
//       date: "27/01/2025",
//       title: "Tlogo Putri Kaliurang : Daya Tarik, Harga Tiket, Jam Buka, dan Rute",
//       owner: "Mita Aprilia D",
//       category: "Daya Tarik",
//       detail: {
//         judul: "Tlogo Putri Kaliurang: Daya Tarik, Harga Tiket, Jam...",
//         deskripsi: "Wisata Alam dengan panorama indah di..."
//       }
//     }
//   ]);

//   const tabs = [
//     { label: "Semua", value: "semua", count: 1024 },
//     { label: "Diterbitkan", value: "Diterbitkan", count: 834 },
//     { label: "Konsep", value: "Konsep", count: 368 },
//     { label: "Sampah", value: "Sampah", count: 0 },
//   ];

//   const filteredData = data.filter((item) => {
//     const tabMatch = activeTab === "semua" || item.status.toLowerCase() === activeTab.toLowerCase();
//     const searchMatch =
//       item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.owner.toLowerCase().includes(searchTerm.toLowerCase());
//     return tabMatch && searchMatch;
//   });

//   const selectedArticle = data.find((item) => item.id === parseInt(selectedId));

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   if (selectedId && selectedArticle) {
//     return (
//       <div className="min-h-screen flex bg-white font-poppins">
//         <aside className="w-64">
//           <Sidebar />
//         </aside>
//         <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
//           <h1 className="text-[32px] font-bold mb-4 text-black">Editor Artikel</h1>

//           {/* Header kanan atas */}
//           <div className="flex justify-end items-center space-x-4">
//             <span className="text-sm italic text-gray-500">Kutip Sumber Anda</span>
//             <button className="flex items-center space-x-1 text-blue-600 hover:underline">
//               <FiEdit3 className="w-4 h-4" />
//               <span>Edit</span>
//             </button>
//           </div>

//           <div className="bg-gray-50 p-6 rounded-lg shadow space-y-6">
//             {/* Upload Gambar dengan ikon */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Gambar</label>
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
//               >
//                 <FiImage className="w-5 h-5 text-gray-700" />
//                 <span>Pilih Gambar</span>
//               </button>
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               {imagePreview && (
//                 <div className="mt-4">
//                   <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-contain rounded" />
//                 </div>
//               )}
//             </div>

//             {/* Judul dengan ikon */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
//               <div className="flex items-center space-x-2">
//                 <FiEdit3 className="text-gray-500" />
//                 <input
//                   className="w-full p-2 border rounded-md"
//                   defaultValue={selectedArticle.detail.judul}
//                 />
//               </div>
//             </div>

//             {/* Deskripsi dengan ikon nomor paragraf */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
//               <div className="flex items-start space-x-2">
//                 <FiList className="text-gray-500 mt-2" />
//                 <textarea
//                   className="w-full p-2 border rounded-md"
//                   rows={5}
//                   defaultValue={selectedArticle.detail.deskripsi}
//                 />
//               </div>
//             </div>

//             {/* Tombol kembali */}
//             <button
//               onClick={() => router.push('/dashboard/ai-generate/draft')}
//               className="mt-4 px-4 py-2 bg-[#3D6CB9] text-white rounded-md"
//             >
//               Kembali
//             </button>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   // Halaman list jika tidak ada ID
//   return (
//     <div className="min-h-screen flex bg-white font-poppins">
//       <aside className="w-64">
//         <Sidebar />
//       </aside>

//       <main className="flex-1 flex-col px-8 md:px-10 py-6 space-y-6">
//         <h1 className="text-[32px] font-bold mb-6 text-black">Draft</h1>

//         <header className="flex items-center justify-between flex-wrap gap-4">
//           <div className="flex items-center bg-[#3D6CB9] p-2 rounded-lg space-x-2">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.value}
//                 onClick={() => setActiveTab(tab.value)}
//                 className={`px-3 py-1 rounded-[5px] text-sm font-normal ${
//                   activeTab === tab.value
//                     ? "bg-white text-[#3D6CB9]"
//                     : "bg-gray-100 text-gray-500"
//                 }`}
//               >
//                 {tab.label} ({tab.count})
//               </button>
//             ))}
//           </div>

//           <div className="flex justify-end">
//             <SearchInput
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onClear={() => setSearchTerm("")}
//               placeholder="Cari"
//             />
//           </div>

//           <UserMenu />
//         </header>

//         <section className="bg-white rounded-lg shadow overflow-x-auto">
//           <table className="w-full text-sm text-gray-700">
//             <thead className="bg-[#3D6CB9] text-white">
//               <tr>
//                 <th className="p-3 text-center">Tanggal</th>
//                 <th className="p-3 text-center">Judul</th>
//                 <th className="p-3 text-center">Pemilik</th>
//                 <th className="p-3 text-center">Kategori</th>
//                 <th className="p-3 text-center">Detail AIOSEO</th>
//                 <th className="p-3 text-center">Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((item) => (
//                   <tr key={item.id} className="border-t hover:bg-gray-100">
//                     <td className="p-3 text-center">
//                       <div className="text-sm text-gray-800">{item.date}</div>
//                       <div
//                         className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full ${
//                           item.status === "Diterbitkan"
//                             ? "bg-green-100 text-green-600"
//                             : item.status === "Konsep"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : "bg-gray-100 text-gray-500"
//                         }`}
//                       >
//                         {item.status}
//                       </div>
//                     </td>
//                     <td className="p-3">{item.title}</td>
//                     <td className="p-3">{item.owner}</td>
//                     <td className="p-3">{item.category}</td>
//                     <td className="p-3 whitespace-pre-wrap">
//                       <div><strong>Judul:</strong> {item.detail.judul}</div>
//                       <div><strong>Deskripsi:</strong> {item.detail.deskripsi}</div>
//                     </td>
//                     <td className="p-3">
//                       <div className="flex justify-center space-x-2">
//                         <button
//                           onClick={() => router.push(`/dashboard/ai-generate/draft?id=${item.id}`)}
//                           className="p-2 rounded-md text-blue-500 hover:text-blue-700 hover:bg-blue-100"
//                         >
//                           <FiEdit />
//                         </button>
//                         <button
//                           onClick={() => alert(`Hapus artikel: ${item.title}`)}
//                           className="p-2 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100"
//                         >
//                           <FiTrash2 />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center text-gray-500 py-6 italic">
//                     Data tidak ditemukan.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </section>
//       </main>
//     </div>
//   );
// }

'use client';

import React, { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import { FiEdit, FiTrash2, FiImage, FiEdit3, FiList } from "react-icons/fi";

export default function Home() {
  const [activeTab, setActiveTab] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');

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
<<<<<<< HEAD
=======
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
>>>>>>> 41d9b653bd5a5bd887901031da90b848f72bc67d
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

  if (selectedId && selectedArticle) {
    return (
      <div className="min-h-screen flex bg-white font-poppins">
        <aside className="w-64">
          <Sidebar />
        </aside>
        <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
          <h1 className="text-[32px] font-bold mb-4 text-black">Editor Artikel</h1>

          {/* Header kanan atas */}
          <div className="flex justify-end items-center space-x-4">
            <span className="text-sm italic text-gray-500">Kutip Sumber Anda</span>
            <button className="flex items-center space-x-1 text-blue-600 hover:underline">
              <FiEdit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow space-y-6">
            {/* Upload Gambar dengan ikon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Gambar</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
              >
                <FiImage className="w-5 h-5 text-gray-700" />
                <span>Pilih Gambar</span>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-contain rounded" />
                </div>
              )}
            </div>

            {/* Judul dengan ikon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <div className="flex items-center space-x-2">
                <FiEdit3 className="text-gray-500" />
                <input
                  className="w-full p-2 border rounded-md"
                  defaultValue={selectedArticle.detail.judul}
                />
              </div>
            </div>

            {/* Deskripsi dengan ikon nomor paragraf */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <div className="flex items-start space-x-2">
                <FiList className="text-gray-500 mt-2" />
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={5}
                  defaultValue={selectedArticle.detail.deskripsi}
                />
              </div>
            </div>

            {/* Tombol kembali */}
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

  // Halaman list jika tidak ada ID
  return (
    <div className="min-h-screen flex bg-white font-poppins">
      <aside className="w-64">
        <Sidebar />
      </aside>

      <main className="flex-1 flex-col px-8 md:px-10 py-6 space-y-6">
        <h1 className="text-[32px] font-bold mb-6 text-black">Draft</h1>

        <header className="flex items-center justify-between flex-wrap gap-4">
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

<<<<<<< HEAD
=======
          {/* Search */}
>>>>>>> 41d9b653bd5a5bd887901031da90b848f72bc67d
          <div className="flex justify-end">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              placeholder="Cari"
            />
          </div>

          <UserMenu />
        </header>

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
                          onClick={() => router.push(`/dashboard/ai-generate/draft?id=${item.id}`)}
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
                    Data tidak ditemukan ya.
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
