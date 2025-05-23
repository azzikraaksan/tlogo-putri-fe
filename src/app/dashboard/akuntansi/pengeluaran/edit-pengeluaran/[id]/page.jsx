// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter, useParams } from "next/navigation";
// // // import Sidebar from "/components/Sidebar.jsx"; 
// // // import UserMenu from "/components/Pengguna.jsx"; 
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";
// // // import withAuth from "/src/app/lib/withAuth"; 


// // const parseDisplayDateString = (dateStr) => {
// //     if (!dateStr) return null;
// //     const parts = dateStr.split("-"); 
// //     if (parts.length === 3) {
// //       const day = parseInt(parts[0], 10);
// //       const month = parseInt(parts[1], 10) -1;
// //       const year = parseInt(parts[2], 10);
// //       if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
// //         return new Date(year, month, day);
// //       }
// //     }
// //     return null; 
// // };

// // const formatDateForDisplay = (date) => {
// //     if (!date) return "";
// //     const d = date instanceof Date ? date : new Date(date);
// //     if (isNaN(d.getTime())) return ""; 
// //     const day = d.getDate().toString().padStart(2, "0");
// //     const month = (d.getMonth() + 1).toString().padStart(2, "0");
// //     const year = d.getFullYear();
// //     return `${day}-${month}-${year}`;
// // };

// // const EditPengeluaranPage = () => {
// //   const router = useRouter();
// //   const params = useParams();
// //   const { id: pengeluaranId } = params;

// //   const [formData, setFormData] = useState({
// //     idPengeluaran: "",
// //     idPenggajian: "",
// //     tglPengeluaran: "", 
// //     total: "",
// //     keterangan: "",
// //   });
// //   const [selectedDateForPicker, setSelectedDateForPicker] = useState(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [originalData, setOriginalData] = useState(null);

// //   useEffect(() => {
// //     if (pengeluaranId) {
// //       setIsLoading(true);
// //       const storedDataString = localStorage.getItem("dataPengeluaran");
// //       if (storedDataString) {
// //         const allData = JSON.parse(storedDataString);
// //         const dataToEdit = allData.find(item => item.idPengeluaran === pengeluaranId);
// //         if (dataToEdit) {
// //           setFormData({ 
// //             idPengeluaran: dataToEdit.idPengeluaran,
// //             idPenggajian: dataToEdit.idPenggajian,
// //             tglPengeluaran: dataToEdit.tglPengeluaran, 
// //             total: dataToEdit.total,
// //             keterangan: dataToEdit.keterangan,
// //           });
// //           setSelectedDateForPicker(parseDisplayDateString(dataToEdit.tglPengeluaran));
// //           setOriginalData(dataToEdit); 
// //         } else {
// //           alert("Data pengeluaran tidak ditemukan.");
// //           router.back("/akuntansi/pengeluaran");
// //         }
// //       } else {
// //         alert("Tidak ada data pengeluaran di penyimpanan. Kembali ke halaman utama.");
// //         router.back("/akuntansi/pengeluaran");
// //       }
// //       setIsLoading(false);
// //     }
// //   }, [pengeluaranId, router]);

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleDateChange = (date) => {
// //     setSelectedDateForPicker(date);
// //     setFormData(prev => ({
// //       ...prev,
// //       tglPengeluaran: formatDateForDisplay(date),
// //     }));
// //   };

// //   const validateForm = () => {
// //     if (!formData.idPenggajian || !formData.total || !formData.keterangan || !formData.tglPengeluaran) {
// //       alert("Harap isi semua field yang wajib diisi!");
// //       return false;
// //     }
// //     return true;
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (!validateForm()) return;
// //     setIsSubmitting(true);

// //     const storedDataString = localStorage.getItem("dataPengeluaran");
// //     if (storedDataString) {
// //       let allData = JSON.parse(storedDataString);
// //       const updatedAllData = allData.map(item =>
// //         item.idPengeluaran === pengeluaranId ? { ...formData } : item
// //       );
// //       localStorage.setItem("dataPengeluaran", JSON.stringify(updatedAllData));
// //       window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
// //       alert("Data berhasil diperbarui!");
// //       router.back("/akuntansi/pengeluaran");
// //     } else {
// //       alert("Gagal memperbarui, data sumber tidak ditemukan.");
// //     }
// //     setIsSubmitting(false);
// //   };

// //   const handleCancel = () => {
// //     if (originalData) {
// //         setFormData({
// //             idPengeluaran: originalData.idPengeluaran,
// //             idPenggajian: originalData.idPenggajian,
// //             tglPengeluaran: originalData.tglPengeluaran,
// //             total: originalData.total,
// //             keterangan: originalData.keterangan,
// //         });
// //         setSelectedDateForPicker(parseDisplayDateString(originalData.tglPengeluaran));
// //     }
// //     router.back("/akuntansi/pengeluaran");
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="flex relative bg-white-50 min-h-screen">
// //         {/* <UserMenu /> <Sidebar /> */}
// //         <div className="flex-1 p-4 md:p-6 flex items-center justify-center">Memuat data untuk diedit...</div>
// //       </div>
// //     );
// //   }

// //   if (!formData.idPengeluaran && !isLoading) {
// //     return (
// //       <div className="flex relative bg-white-50 min-h-screen">
// //         {/* <UserMenu /> <Sidebar /> */}
// //         <div className="flex-1 p-4 md:p-6 flex items-center justify-center">Data pengeluaran tidak ditemukan.</div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
// //       {/* <UserMenu />
// //       <Sidebar /> */}
      
// //       <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all"> 
// //         {/* <div className="mb-6">
// //             <button
// //                 onClick={() => router.back("/akuntansi/pengeluaran")}
// //                 className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
// //             >
// //                 &larr; Kembali
// //             </button>
// //         </div>
// //         <h1 className="text-[24px] md:text-[24px] font-medium mb-4 text-black">
// //           Edit Pengeluaran: {formData.idPengeluaran}
// //         </h1> */}
        
// //         <div className="">
// //           <form onSubmit={handleSubmit}>
// //             {/* ID Pengeluaran tidak bisa diedit */}
// //             <div className="mb-4">
// //                 <label htmlFor="idPengeluaranDisplay" className="block text-sm font-medium text-gray-700 mb-1">
// //                 ID Pengeluaran
// //                 </label>
// //                 <input
// //                 type="text"
// //                 id="idPengeluaranDisplay"
// //                 value={formData.idPengeluaran}
// //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
// //                 disabled 
// //                 />
// //             </div>
// //             <div className="mb-4">
// //               <label htmlFor="idPenggajian" className="block text-sm font-medium text-gray-700 mb-1">
// //                 ID Penggajian <span className="text-red-500">*</span>
// //               </label>
// //               <input
// //                 type="text"
// //                 name="idPenggajian"
// //                 id="idPenggajian"
// //                 value={formData.idPenggajian}
// //                 onChange={handleInputChange}
// //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
// //                 // required
// //                 disabled
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label htmlFor="tglPengeluaranEdit" className="block text-sm font-medium text-gray-700 mb-1">
// //                 Tanggal Pengeluaran <span className="text-red-500">*</span>
// //               </label>
// //               <DatePicker
// //                 selected={selectedDateForPicker}
// //                 onChange={handleDateChange}
// //                 dateFormat="dd-MM-yyyy"
// //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
// //                 wrapperClassName="w-full"
// //                 id="tglPengeluaranEdit"
// //                 required
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
// //                 Total <span className="text-red-500">*</span>
// //               </label>
// //               <input
// //                 type="number"
// //                 name="total"
// //                 id="total"
// //                 value={formData.total}
// //                 onChange={handleInputChange}
// //                 placeholder="Rp X.xxx.xxx"
// //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
// //                 required
// //               />
// //             </div>
// //             <div className="mb-6">
// //               <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
// //                 Keterangan <span className="text-red-500">*</span>
// //               </label>
// //               <textarea
// //                 name="keterangan"
// //                 id="keterangan"
// //                 rows="3"
// //                 value={formData.keterangan}
// //                 onChange={handleInputChange}
// //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
// //                 required
// //               ></textarea>
// //             </div>
// //             <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
// //               <button
// //                 type="button"
// //                 onClick={handleCancel}
// //                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
// //                 disabled={isSubmitting}
// //               >
// //                 Batal
// //               </button>
// //               <button
// //                 type="submit"
// //                 className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
// //                 disabled={isSubmitting}
// //               >
// //                 {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EditPengeluaranPage;

// // D:\laragon\www\tlogo-putri-fe\src\app\dashboard\akuntansi\pengeluaran\edit-pengeluaran\[id]\page.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// // Fungsi helper tetap sama
// const parseDisplayDateString = (dateStr) => {
//     if (!dateStr) return null;
//     const parts = dateStr.split("-");
//     if (parts.length === 3) {
//         const day = parseInt(parts[0], 10);
//         const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
//         const year = parseInt(parts[2], 10);
//         if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
//             return new Date(year, month, day);
//         }
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

// const EditPengeluaranPage = () => {
//     const router = useRouter();
//     const params = useParams();
//     const { id: pengeluaranId } = params;

//     const [formData, setFormData] = useState({
//         idPengeluaran: "",
//         idPenggajian: "",
//         tglPengeluaran: "",
//         total: "",
//         keterangan: "",
//     });
//     const [selectedDateForPicker, setSelectedDateForPicker] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [originalData, setOriginalData] = useState(null);

//     useEffect(() => {
//         if (pengeluaranId) {
//             setIsLoading(true);
//             const storedDataString = localStorage.getItem("dataPengeluaran");
//             if (storedDataString) {
//                 const allData = JSON.parse(storedDataString);
//                 const dataToEdit = allData.find(item => item.idPengeluaran === pengeluaranId);
//                 if (dataToEdit) {
//                     setFormData({
//                         idPengeluaran: dataToEdit.idPengeluaran,
//                         idPenggajian: dataToEdit.idPenggajian,
//                         tglPengeluaran: dataToEdit.tglPengeluaran,
//                         total: dataToEdit.total,
//                         keterangan: dataToEdit.keterangan,
//                     });
//                     setSelectedDateForPicker(parseDisplayDateString(dataToEdit.tglPengeluaran));
//                     setOriginalData(dataToEdit);
//                 } else {
//                     alert("Data pengeluaran tidak ditemukan.");
//                     router.replace("/akuntansi/pengeluaran"); // Gunakan replace agar tidak kembali ke halaman edit yang kosong
//                 }
//             } else {
//                 alert("Tidak ada data pengeluaran di penyimpanan. Kembali ke halaman utama.");
//                 router.replace("/akuntansi/pengeluaran");
//             }
//             setIsLoading(false);
//         }
//     }, [pengeluaranId, router]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleDateChange = (date) => {
//         setSelectedDateForPicker(date);
//         setFormData(prev => ({
//             ...prev,
//             tglPengeluaran: formatDateForDisplay(date),
//         }));
//     };

//     const validateForm = () => {
//         if (!formData.idPenggajian || !formData.total || !formData.keterangan || !formData.tglPengeluaran) {
//             alert("Harap isi semua field yang wajib diisi!");
//             return false;
//         }
//         return true;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;
//         setIsSubmitting(true);

//         const storedDataString = localStorage.getItem("dataPengeluaran");
//         if (storedDataString) {
//             let allData = JSON.parse(storedDataString);
//             const updatedAllData = allData.map(item =>
//                 item.idPengeluaran === pengeluaranId ? { ...formData } : item
//             );
//             localStorage.setItem("dataPengeluaran", JSON.stringify(updatedAllData));
//             // Trigger custom event to notify other components (e.g., PengeluaranPage) to refresh
//             window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
//             alert("Data berhasil diperbarui!");
//             router.back(); // Kembali ke halaman sebelumnya (PengeluaranPage)
//         } else {
//             alert("Gagal memperbarui, data sumber tidak ditemukan.");
//         }
//         setIsSubmitting(false);
//     };

//     const handleCancel = () => {
//         // Tidak perlu me-reset formData secara manual jika hanya ingin kembali
//         // router.back() akan cukup untuk kembali ke halaman sebelumnya
//         router.back();
//     };

//     // Loading state for the specific card content
//     if (isLoading) {
//         return (
//             <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//                 <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
//                     Memuat data untuk diedit...
//                 </div>
//             </div>
//         );
//     }

//     // Handle case where data is not found after loading
//     if (!formData.idPengeluaran && !isLoading) {
//         return (
//             <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//                 <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
//                     Data pengeluaran tidak ditemukan.
//                 </div>
//             </div>
//         );
//     }

//     return (
//         // Wrapper ini membuat halaman ini terlihat seperti modal
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//             <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all">
//                 {/* Judul dan tombol close */}
//                 <h2 className="text-[24px] font-medium mb-4 text-black">
//                     Edit Pengeluaran: {formData.idPengeluaran}
//                 </h2>
//                 {/* Tombol close modal di sudut kanan atas */}
//                 <button
//                     onClick={handleCancel} // Menggunakan handleCancel untuk tombol close
//                     className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
//                     aria-label="Close"
//                 >
//                     &times;
//                 </button>

//                 <div>
//                     <form onSubmit={handleSubmit}>
//                         {/* ID Pengeluaran tidak bisa diedit */}
//                         <div className="mb-4">
//                             <label htmlFor="idPengeluaranDisplay" className="block text-sm font-medium text-gray-700 mb-1">
//                                 ID Pengeluaran
//                             </label>
//                             <input
//                                 type="text"
//                                 id="idPengeluaranDisplay"
//                                 value={formData.idPengeluaran}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
//                                 disabled
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <label htmlFor="idPenggajian" className="block text-sm font-medium text-gray-700 mb-1">
//                                 ID Penggajian <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 name="idPenggajian"
//                                 id="idPenggajian"
//                                 value={formData.idPenggajian}
//                                 onChange={handleInputChange}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
//                                 disabled
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <label htmlFor="tglPengeluaranEdit" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Tanggal Pengeluaran <span className="text-red-500">*</span>
//                             </label>
//                             <DatePicker
//                                 selected={selectedDateForPicker}
//                                 onChange={handleDateChange}
//                                 dateFormat="dd-MM-yyyy"
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 wrapperClassName="w-full"
//                                 id="tglPengeluaranEdit"
//                                 required
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Total <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="number"
//                                 name="total"
//                                 id="total"
//                                 value={formData.total}
//                                 onChange={handleInputChange}
//                                 placeholder="Rp X.xxx.xxx"
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 required
//                             />
//                         </div>
//                         <div className="mb-6">
//                             <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Keterangan <span className="text-red-500">*</span>
//                             </label>
//                             <textarea
//                                 name="keterangan"
//                                 id="keterangan"
//                                 rows="3"
//                                 value={formData.keterangan}
//                                 onChange={handleInputChange}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 required
//                             ></textarea>
//                         </div>
//                         <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
//                             <button
//                                 type="button"
//                                 onClick={handleCancel}
//                                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                                 disabled={isSubmitting}
//                             >
//                                 Batal
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditPengeluaranPage;

// src/app/dashboard/akuntansi/pengeluaran/(..)edit-pengeluaran/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Sidebar dan UserMenu tidak perlu diimpor di sini, karena ini adalah intercepting route
// dan akan dirender di dalam layout utama yang sudah memiliki Sidebar dan UserMenu.
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// withAuth juga tidak perlu diimpor di sini, karena sudah diterapkan di layout utama (PengeluaranPage)
// import withAuth from "/src/app/lib/withAuth";


// Fungsi helper tetap sama
const parseDisplayDateString = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day);
        }
    }
    return null;
};

const formatDateForDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const EditPengeluaranPage = () => {
    const router = useRouter();
    const params = useParams();
    const { id: pengeluaranId } = params;

    const [formData, setFormData] = useState({
        idPengeluaran: "",
        idPenggajian: "",
        tglPengeluaran: "",
        total: "",
        keterangan: "",
    });
    const [selectedDateForPicker, setSelectedDateForPicker] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [originalData, setOriginalData] = useState(null); // Menyimpan data asli untuk tombol batal

    useEffect(() => {
        if (pengeluaranId) {
            setIsLoading(true);
            const storedDataString = localStorage.getItem("dataPengeluaran");
            if (storedDataString) {
                const allData = JSON.parse(storedDataString);
                const dataToEdit = allData.find(item => item.idPengeluaran === pengeluaranId);
                if (dataToEdit) {
                    setFormData({
                        idPengeluaran: dataToEdit.idPengeluaran,
                        idPenggajian: dataToEdit.idPenggajian,
                        tglPengeluaran: dataToEdit.tglPengeluaran,
                        total: dataToEdit.total,
                        keterangan: dataToEdit.keterangan,
                    });
                    setSelectedDateForPicker(parseDisplayDateString(dataToEdit.tglPengeluaran));
                    setOriginalData(dataToEdit); // Simpan data asli
                } else {
                    alert("Data pengeluaran tidak ditemukan.");
                    router.replace("/dashboard/akuntansi/pengeluaran"); // Gunakan replace agar tidak kembali ke halaman edit yang kosong
                }
            } else {
                alert("Tidak ada data pengeluaran di penyimpanan. Kembali ke halaman utama.");
                router.replace("/dashboard/akuntansi/pengeluaran");
            }
            setIsLoading(false);
        }
    }, [pengeluaranId, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setSelectedDateForPicker(date);
        setFormData(prev => ({
            ...prev,
            tglPengeluaran: formatDateForDisplay(date),
        }));
    };

    const validateForm = () => {
        if (!formData.idPenggajian || !formData.total || !formData.keterangan || !formData.tglPengeluaran) {
            alert("Harap isi semua field yang wajib diisi!");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const storedDataString = localStorage.getItem("dataPengeluaran");
        if (storedDataString) {
            let allData = JSON.parse(storedDataString);
            const updatedAllData = allData.map(item =>
                item.idPengeluaran === pengeluaranId ? { ...formData } : item
            );
            localStorage.setItem("dataPengeluaran", JSON.stringify(updatedAllData));
            // Trigger custom event to notify other components (e.g., PengeluaranPage) to refresh
            window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
            alert("Data berhasil diperbarui!");
            router.back(); // Kembali ke halaman sebelumnya (PengeluaranPage)
        } else {
            alert("Gagal memperbarui, data sumber tidak ditemukan.");
        }
        setIsSubmitting(false);
    };

    const handleCancel = () => {
        // Cukup panggil router.back() untuk menutup modal dan kembali ke halaman sebelumnya
        router.back();
    };

    // Loading state for the specific card content
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
                    Memuat data untuk diedit...
                </div>
            </div>
        );
    }

    // Handle case where data is not found after loading
    if (!formData.idPengeluaran && !isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
                    Data pengeluaran tidak ditemukan.
                </div>
            </div>
        );
    }

    return (
        // Wrapper ini membuat halaman ini terlihat seperti modal
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative"> {/* Tambahkan 'relative' di sini */}
                {/* Judul dan tombol close */}
                <h2 className="text-[24px] font-medium mb-4 text-black">
                    Edit Pengeluaran: {formData.idPengeluaran}
                </h2>
                {/* Tombol close modal di sudut kanan atas */}
                <button
                    onClick={handleCancel} // Menggunakan handleCancel untuk tombol close
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>

                <div>
                    <form onSubmit={handleSubmit}>
                        {/* ID Pengeluaran tidak bisa diedit */}
                        <div className="mb-4">
                            <label htmlFor="idPengeluaranDisplay" className="block text-sm font-medium text-gray-700 mb-1">
                                ID Pengeluaran
                            </label>
                            <input
                                type="text"
                                id="idPengeluaranDisplay"
                                value={formData.idPengeluaran}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="idPenggajian" className="block text-sm font-medium text-gray-700 mb-1">
                                ID Penggajian <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="idPenggajian"
                                id="idPenggajian"
                                value={formData.idPenggajian}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                                disabled // ini sudah disabled, jadi tidak perlu `required` jika ID Penggajian auto-generated atau tidak bisa diubah user
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="tglPengeluaranEdit" className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Pengeluaran <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                                selected={selectedDateForPicker}
                                onChange={handleDateChange}
                                dateFormat="dd-MM-yyyy"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                wrapperClassName="w-full"
                                id="tglPengeluaranEdit"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
                                Total <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="total"
                                id="total"
                                value={formData.total}
                                onChange={handleInputChange}
                                placeholder="Rp X.xxx.xxx"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
                                Keterangan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="keterangan"
                                id="keterangan"
                                rows="3"
                                value={formData.keterangan}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel} // Tombol Batal akan menutup modal
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

export default EditPengeluaranPage;