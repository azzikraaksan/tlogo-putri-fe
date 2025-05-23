// // components/TambahPresensi.jsx
// "use client";

// import React, { useState, useEffect } from "react";

// const TambahPresensi = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
//   isEditMode,
// }) => {
//   const [formData, setFormData] = useState(initialData);

//   useEffect(() => {
//     setFormData(initialData);
//   }, [initialData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Simple validation for required fields
//     if (!formData.id_presensi || !formData.id_karyawan || !formData.nama_lengkap || !formData.no_hp) {
//       alert("Harap isi semua field yang wajib diisi!");
//       return;
//     }
//     onSubmit(formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
//       <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
//         <h2 className="text-xl font-semibold mb-4 text-center">
//           {isEditMode ? "Edit Presensi" : "Tambah Presensi"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Id Presensi <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="id_presensi"
//               value={formData.id_presensi}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//               disabled={isEditMode} // Disable ID input in edit mode
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Id Karyawan <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="id_karyawan"
//               value={formData.id_karyawan}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Nama Lengkap <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="nama_lengkap"
//               value={formData.nama_lengkap}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               No HP <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="no_hp"
//               value={formData.no_hp}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Role</label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             >
//               <option value="Driver">Driver</option>
//               <option value="Pengurus">Pengurus</option>
//               <option value="Owner">Owner</option>
//               <option value="Admin">Admin</option>
//               <option value="Front End">Front End</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Tanggal Bergabung
//             </label>
//             <input
//               type="date"
//               name="tanggal_bergabung"
//               value={formData.tanggal_bergabung}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Jumlah Kehadiran
//             </label>
//             <input
//               type="number"
//               name="jumlah_kehadiran"
//               value={formData.jumlah_kehadiran}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-[#3D6CB9] text-white rounded hover:bg-[#2C4F8A]"
//             >
//               {isEditMode ? "Update" : "Simpan"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TambahPresensi;

// D:\laragon\www\tlogo-putri-fe\components\TambahPresensi.jsx
"use client";

import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

// Fungsi helper untuk memformat tanggal untuk tampilan (DD-MM-YYYY)
const formatDateDisplay = (date) => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Fungsi helper untuk memformat tanggal untuk input type="date" (YYYY-MM-DD)
const formatDateToInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Komponen modal Tambah Presensi
const TambahPresensi = ({ isOpen, onClose, onAddData }) => {
  const [formData, setFormData] = useState({
    id_karyawan: "",
    nama_lengkap: "",
    no_hp: "",
    role: "Driver", // Default value
    tanggal_bergabung: formatDateToInput(new Date()), // Default ke tanggal hari ini untuk input
    jumlah_kehadiran: 1, // Default ke 1 dan tidak bisa diubah
  });

  // Efek samping untuk mereset form dan mengatur nilai default saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      console.log("[TambahPresensi] Modal dibuka. Mereset form.");
      setFormData({
        id_karyawan: "",
        nama_lengkap: "",
        no_hp: "",
        role: "Driver",
        tanggal_bergabung: formatDateToInput(new Date()), // Set tanggal bergabung default ke hari ini
        jumlah_kehadiran: 1, // Set jumlah kehadiran default ke 1
      });
    }
  }, [isOpen]);

  // Handler perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi sederhana untuk field yang wajib diisi
    if (
      !formData.id_karyawan ||
      !formData.nama_lengkap ||
      !formData.no_hp ||
      !formData.tanggal_bergabung
    ) {
      alert("Harap lengkapi semua field yang wajib diisi!");
      return;
    }

    // Data yang akan dikirim ke parent (PresensiPage)
    const newPresensiData = {
      ...formData,
      // Konversi tanggal_bergabung ke format DD-MM-YYYY untuk penyimpanan di localStorage
      tanggal_bergabung: formatDateDisplay(new Date(formData.tanggal_bergabung)),
      jumlah_kehadiran: 1, // Pastikan ini selalu 1 saat penambahan awal
    };

    console.log("[TambahPresensi] Mengirim data ke parent:", newPresensiData);
    onAddData(newPresensiData); // Mengirim data baru ke parent
  };

  // Jika modal tidak terbuka, jangan render apa pun
  if (!isOpen) return null;

  return (
    // Wrapper modal dengan overlay dan efek blur
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Tambah Data Presensi Baru
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          title="Tutup"
          aria-label="Tutup Modal"
        >
          <XCircle size={24} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID Presensi tidak ada di form tambah karena akan digenerate di parent */}
          <div className="mb-4">
            <label
              htmlFor="id_karyawan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID Karyawan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="id_karyawan"
              name="id_karyawan"
              value={formData.id_karyawan}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="nama_lengkap"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama_lengkap"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="no_hp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nomor HP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="no_hp"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="Driver">Driver</option>
              <option value="Admin">Admin</option>
              <option value="Helper">Helper</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="tanggal_bergabung"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Presensi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggal_bergabung"
              name="tanggal_bergabung"
              value={formData.tanggal_bergabung}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="jumlah_kehadiran"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Jumlah Kehadiran
            </label>
            <input
              type="number"
              id="jumlah_kehadiran"
              name="jumlah_kehadiran"
              value={formData.jumlah_kehadiran}
              readOnly // Tidak bisa diedit
              disabled // Tidak aktif
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahPresensi;
