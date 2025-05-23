// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import Sidebar from "/components/Sidebar.jsx"; 
// import UserMenu from "/components/Pengguna.jsx"; 
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import withAuth from "/src/app/lib/withAuth"; 


// const parseDisplayDateString = (dateStr) => {
//     if (!dateStr) return null;
//     const parts = dateStr.split("-"); 
//     if (parts.length === 3) {
//       const day = parseInt(parts[0], 10);
//       const month = parseInt(parts[1], 10) -1;
//       const year = parseInt(parts[2], 10);
//       if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
//         return new Date(year, month, day);
//       }
//     }
//     return null; 
// };

// const formatDateForDisplay = (date) => {
//     if (!date) return "";
//     const d = date instanceof Date ? date : new Date(date);
//     if (isNaN(d.getTime())) return ""; 
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
// };

// const EditPresensi = () => {
//   const router = useRouter();
//   const params = useParams();
//   const { id: presensiId } = params;

//   const [formData, setFormData] = useState({
//     id_presensi: "",
//     id_karyawan: "",
//     nama_lengkap: "", 
//     no_hp: "",
//     role: "",
//     tanggal_bergabung: "",
//     jumlah_kehadiran: "",
// });
//   const [selectedDateForPicker, setSelectedDateForPicker] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [originalData, setOriginalData] = useState(null);

//   useEffect(() => {
//     if (presensiId) {
//       setIsLoading(true);
//       const storedDataString = localStorage.getItem("dataPresensi");
//       if (storedDataString) {
//         const allData = JSON.parse(storedDataString);
//         const dataToEdit = allData.find(item => item.id_presensi === presensiId);
//         if (dataToEdit) {
//           setFormData({ 
//             id_presensi: dataToEdit.id_presensi,
//             id_karyawan: dataToEdit.id_karyawan,
//             nama_lengkap: dataToEdit.nama_lengkap, 
//             no_hp: dataToEdit.no_hp,
//             role: dataToEdit.role,
//             tanggal_bergabung: dataToEdit.tanggal_bergabung,
//             jumlah_kehadiran: dataToEdit.jumlah_kehadiran,
//           });
//           setSelectedDateForPicker(parseDisplayDateString(dataToEdit.tanggal_bergabung));
//           setOriginalData(dataToEdit); 
//         } else {
//           alert("Data presensi tidak ditemukan.");
//           router.back("/akuntansi/presensi");
//         }
//       } else {
//         alert("Tidak ada data presensi di penyimpanan. Kembali ke halaman utama.");
//         router.back("/akuntansi/presensi");
//       }
//       setIsLoading(false);
//     }
//   }, [presensiId, router]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDateChange = (date) => {
//     setSelectedDateForPicker(date);
//     setFormData(prev => ({
//       ...prev,
//       tanggal_bergabung: formatDateForDisplay(date),
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.id_presensi ||!formData.id_karyawan || !formData.no_hp || !formData.role || !formData.nama_lengkap || !formData.tanggal_bergabung || !formData.jumlah_kehadiran) {
//       alert("Harap isi semua field yang wajib diisi!");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setIsSubmitting(true);

//     const storedDataString = localStorage.getItem("dataPresensi");
//     if (storedDataString) {
//       let allData = JSON.parse(storedDataString);
//       const updatedAllData = allData.map(item =>
//         item.id_presensi === presensiId ? { ...formData } : item
//       );
//       localStorage.setItem("dataPresensi", JSON.stringify(updatedAllData));
//       window.dispatchEvent(new CustomEvent('dataPresensiUpdated'));
//       alert("Data berhasil diperbarui!");
//       router.back("/akuntansi/presensi");
//     } else {
//       alert("Gagal memperbarui, data sumber tidak ditemukan.");
//     }
//     setIsSubmitting(false);
//   };

//   const handleCancel = () => {
//     if (originalData) {
//         setFormData({
//             id_presensi: originalData.id_presensi,
//             id_karyawan: originalData.id_karyawan,
//             nama_lengkap: originalData.nama_lengkap,
//             no_hp: originalData.no_hp,
//             role: originalData.role,
//             tanggal_bergabung: originalData.tanggal_bergabung,
//             jumlah_kehadiran: originalData.jumlah_kehadiran,
//         });
//         setSelectedDateForPicker(parseDisplayDateString(originalData.tanggal_bergabung));
//     }
//     router.back("/akuntansi/presensi");
//   };

//   if (isLoading) {
//     return (
//       <div className="flex relative bg-white-50 min-h-screen">
//         <UserMenu /> <Sidebar />
//         <div className="flex-1 p-4 md:p-6 flex items-center justify-center">Memuat data untuk diedit...</div>
//       </div>
//     );
//   }

//   if (!formData.id_presensi && !isLoading) {
//     return (
//       <div className="flex relative bg-white-50 min-h-screen">
//         <UserMenu /> <Sidebar />
//         <div className="flex-1 p-4 md:p-6 flex items-center justify-center">Data presensi tidak ditemukan.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex relative bg-white-50 min-h-screen">
//       {/* <UserMenu />
//       <Sidebar /> */}
//       <div className="flex-1 p-4 md:p-6 overflow-y-auto"> 
//         <div className="mb-6">
//             <button
//                 onClick={() => router.back("/akuntansi/presensi")}
//                 className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
//             >
//                 &larr; Kembali
//             </button>
//         </div>
//         <h1 className="text-[24px] md:text-[24px] font-medium mb-4 text-black">
//           Edit presensi: {formData.id_presensi}
//         </h1>
        
//         <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl mx-auto">
//           <form onSubmit={handleSubmit}>
//             {/* ID presensi tidak bisa diedit */}
//             <div className="mb-4">
//                 <label htmlFor="id_presensiDisplay" className="block text-sm font-medium text-gray-700 mb-1">
//                 ID presensi
//                 </label>
//                 <input
//                 type="text"
//                 id="id_presensiDisplay"
//                 value={formData.id_presensi}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
//                 disabled 
//                 />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="id_karyawan" className="block text-sm font-medium text-gray-700 mb-1">
//                 ID Penggajian <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="id_karyawan"
//                 id="id_karyawan"
//                 value={formData.id_karyawan}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
//                 // required
//                 disabled
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="nama_lengkapEdit" className="block text-sm font-medium text-gray-700 mb-1">
//                 Tanggal presensi <span className="text-red-500">*</span>
//               </label>
//               <DatePicker
//                 selected={selectedDateForPicker}
//                 onChange={handleDateChange}
//                 dateFormat="dd-MM-yyyy"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 wrapperClassName="w-full"
//                 id="nama_lengkapEdit"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700 mb-1">
//                 no_hp <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 name="no_hp"
//                 id="no_hp"
//                 value={formData.no_hp}
//                 onChange={handleInputChange}
//                 placeholder="Rp X.xxx.xxx"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 required
//               />
//             </div>
//             <div className="mb-6">
//               <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                 role <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="role"
//                 id="role"
//                 rows="3"
//                 value={formData.role}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 required
//               ></textarea>
//             </div>
//             <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                 disabled={isSubmitting}
//               >
//                 Batal
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default withAuth(EditPresensi);

// D:\laragon\www\tlogo-putri-fe\src\app\dashboard\akuntansi\presensi\edit-presensi\[id]\page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

// Komponen halaman Edit Presensi
const EditPresensiPage = () => {
    const router = useRouter();
    const params = useParams();
    const { id: presensiId } = params; // Mengambil ID presensi dari URL

    const [formData, setFormData] = useState({
        id_presensi: "",
        id_karyawan: "",
        nama_lengkap: "",
        no_hp: "",
        role: "Driver",
        tanggal_bergabung: "",
        jumlah_kehadiran: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efek samping untuk memuat data presensi berdasarkan ID dari localStorage
    useEffect(() => {
        if (presensiId) {
            setIsLoading(true);
            console.log(`[EditPresensiPage] Memuat data untuk ID: ${presensiId}`);
            const storedDataString = localStorage.getItem("dataPresensi");
            if (storedDataString) {
                const allData = JSON.parse(storedDataString);
                const dataToEdit = allData.find(item => item.id_presensi === presensiId);
                if (dataToEdit) {
                    // Konversi tanggal_bergabung dari DD-MM-YYYY (penyimpanan) ke YYYY-MM-DD (input type="date")
                    const dateParts = dataToEdit.tanggal_bergabung.split('-'); // ["DD", "MM", "YYYY"]
                    const dateObj = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0])); // YYYY, MM-1, DD
                    const formattedDateForInput = formatDateToInput(dateObj);

                    setFormData({
                        id_presensi: dataToEdit.id_presensi,
                        id_karyawan: dataToEdit.id_karyawan,
                        nama_lengkap: dataToEdit.nama_lengkap,
                        no_hp: dataToEdit.no_hp,
                        role: dataToEdit.role,
                        tanggal_bergabung: formattedDateForInput, // Menggunakan format YYYY-MM-DD
                        jumlah_kehadiran: dataToEdit.jumlah_kehadiran,
                    });
                    console.log("[EditPresensiPage] Data yang dimuat untuk diedit:", dataToEdit);
                } else {
                    alert("Data presensi tidak ditemukan.");
                    console.error(`[EditPresensiPage] Data dengan ID ${presensiId} tidak ditemukan.`);
                    router.replace("/dashboard/akuntansi/presensi"); // Redirect jika data tidak ditemukan
                }
            } else {
                alert("Tidak ada data presensi di penyimpanan. Kembali ke halaman utama.");
                console.error("[EditPresensiPage] localStorage 'dataPresensi' kosong.");
                router.replace("/dashboard/akuntansi/presensi"); // Redirect jika penyimpanan kosong
            }
            setIsLoading(false);
        }
    }, [presensiId, router]);

    // Handler perubahan input form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Fungsi validasi form
    const validateForm = () => {
        if (!formData.id_karyawan || !formData.nama_lengkap || !formData.no_hp || !formData.tanggal_bergabung) {
            alert("Harap isi semua field yang wajib diisi!");
            return false;
        }
        return true;
    };

    // Handler submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const storedDataString = localStorage.getItem("dataPresensi");
        if (storedDataString) {
            let allData = JSON.parse(storedDataString);
            const updatedAllData = allData.map(item =>
                item.id_presensi === presensiId ? {
                    ...formData,
                    jumlah_kehadiran: parseInt(formData.jumlah_kehadiran, 10), // Pastikan ini integer
                    // Konversi kembali ke DD-MM-YYYY untuk penyimpanan
                    tanggal_bergabung: formatDateDisplay(new Date(formData.tanggal_bergabung))
                } : item
            );
            localStorage.setItem("dataPresensi", JSON.stringify(updatedAllData));
            // Memicu event untuk memberitahu halaman utama agar memperbarui data
            window.dispatchEvent(new CustomEvent('dataPresensiUpdated'));
            alert("Data berhasil diperbarui!");
            console.log("[EditPresensiPage] Data setelah diperbarui:", updatedAllData);
            router.back(); // Kembali ke halaman sebelumnya (PresensiPage)
        } else {
            alert("Gagal memperbarui, data sumber tidak ditemukan.");
            console.error("[EditPresensiPage] Gagal memperbarui: localStorage 'dataPresensi' kosong.");
        }
        setIsSubmitting(false);
    };

    // Handler tombol batal/tutup modal
    const handleCancel = () => {
        router.back(); // Kembali ke halaman sebelumnya (menutup modal)
    };

    // Tampilan saat loading data
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
                    Memuat data untuk diedit...
                </div>
            </div>
        );
    }

    // Tampilan saat data tidak ditemukan setelah loading
    if (!formData.id_presensi && !isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
                    Data presensi tidak ditemukan.
                </div>
            </div>
        );
    }

    return (
        // Wrapper ini membuat halaman ini terlihat seperti modal overlay
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative">
                {/* Judul modal */}
                <h2 className="text-[24px] font-medium mb-4 text-black">
                    Edit Presensi: {formData.id_presensi}
                </h2>
                {/* Tombol close modal di sudut kanan atas */}
                <button
                    onClick={handleCancel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Tutup"
                >
                    <XCircle size={24} />
                </button>

                <div>
                    <form onSubmit={handleSubmit}>
                        {/* ID Presensi tidak bisa diedit */}
                        <div className="mb-4">
                            <label htmlFor="id_presensi_display" className="block text-sm font-medium text-gray-700 mb-1">
                                ID Presensi
                            </label>
                            <input
                                type="text"
                                id="id_presensi_display"
                                value={formData.id_presensi}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="id_karyawan" className="block text-sm font-medium text-gray-700 mb-1">
                                ID Karyawan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="id_karyawan"
                                id="id_karyawan"
                                value={formData.id_karyawan}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nama_lengkap"
                                id="nama_lengkap"
                                value={formData.nama_lengkap}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700 mb-1">
                                No. HP <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="no_hp"
                                id="no_hp"
                                value={formData.no_hp}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role"
                                id="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="Driver">Driver</option>
                                <option value="Admin">Admin</option>
                                <option value="Helper">Helper</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="tanggal_bergabung" className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Bergabung <span className="text-red-500">*</span>
                            </label>
                            {/* Menggunakan input type="date" untuk tanggal bergabung */}
                            <input
                                type="date"
                                id="tanggal_bergabung"
                                name="tanggal_bergabung"
                                value={formData.tanggal_bergabung}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="jumlah_kehadiran" className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah Kehadiran
                            </label>
                            <input
                                type="number"
                                name="jumlah_kehadiran"
                                id="jumlah_kehadiran"
                                value={formData.jumlah_kehadiran}
                                readOnly // Tidak bisa diedit
                                disabled // Tidak aktif
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                disabled={isSubmitting}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPresensiPage;
