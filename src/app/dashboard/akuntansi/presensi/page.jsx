// // // "use client";

// // // import { useState, useRef, useEffect } from "react";
// // // import Sidebar from "/components/Sidebar.jsx";
// // // import UserMenu from "/components/Pengguna.jsx";
// // // import withAuth from "/src/app/lib/withAuth";
// // // import {
// // //   CalendarDays,
// // //   FileText,
// // //   FileSpreadsheet,
// // //   PlusCircle,
// // //   Edit,
// // //   Trash2,
// // // } from "lucide-react";
// // // import DatePicker from "react-datepicker";
// // // import "react-datepicker/dist/react-datepicker.css";
// // // import * as XLSX from "xlsx";
// // // import jsPDF from "jspdf";
// // // import autoTable from "jspdf-autotable";
// // // import { useRouter } from "next/navigation";
// // // import { RotateCcw } from "lucide-react";

// // // const PresensiPage = () => {
// // //   // State untuk data dan filter
// // //   const [driverData, setDriverData] = useState([]);
// // //   const [filteredData, setFilteredData] = useState([]);
// // //   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
// // //   const [selectedDate, setSelectedDate] = useState(null);
// // //   const [tempDate, setTempDate] = useState(null);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [formData, setFormData] = useState({
// // //     id_presensi: "",
// // //     id_karyawan: "",
// // //     nama_lengkap: "",
// // //     no_hp: "",
// // //     role: "",
// // //     tanggal_bergabung: "",
// // //     jumlah_kehadiran: "",
// // //   });
// // //   const [editId, setEditId] = useState(null);
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const calendarRef = useRef(null);
// // //   const router = useRouter();

// // //   const exampleData = [
// // //     {
// // //       id_presensi: "PRES001",
// // //       id_karyawan: "KARYAWAN001",
// // //       nama_lengkap: "John Doe",
// // //       no_hp: "081234567890",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-17",
// // //       jumlah_kehadiran: 10,
// // //     },
// // //     {
// // //       id_presensi: "PRES002",
// // //       id_karyawan: "KARYAWAN002",
// // //       nama_lengkap: "Jane Smith",
// // //       no_hp: "082345678901",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-18",
// // //       jumlah_kehadiran: 8,
// // //     },
// // //     {
// // //       id_presensi: "PRES003",
// // //       id_karyawan: "KARYAWAN003",
// // //       nama_lengkap: "Alice Johnson",
// // //       no_hp: "083456789012",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-19",
// // //       jumlah_kehadiran: 12,
// // //     },
// // //     {
// // //       id_presensi: "PRES004",
// // //       id_karyawan: "KARYAWAN004",
// // //       nama_lengkap: "Bob Brown",
// // //       no_hp: "084567890123",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-20",
// // //       jumlah_kehadiran: 15,
// // //     },
// // //     {
// // //       id_presensi: "PRES005",
// // //       id_karyawan: "KARYAWAN005",
// // //       nama_lengkap: "Charlie Davis",
// // //       no_hp: "085678901234",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-21",
// // //       jumlah_kehadiran: 20,
// // //     },
// // //     {
// // //       id_presensi: "PRES006",
// // //       id_karyawan: "KARYAWAN006",
// // //       nama_lengkap: "David Wilson",
// // //       no_hp: "086789012345",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-22",
// // //       jumlah_kehadiran: 18,
// // //     },
// // //     {
// // //       id_presensi: "PRES007",
// // //       id_karyawan: "KARYAWAN007",
// // //       nama_lengkap: "Eve Taylor",
// // //       no_hp: "087890123456",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-23",
// // //       jumlah_kehadiran: 22,
// // //     },
// // //     {
// // //       id_presensi: "PRES008",
// // //       id_karyawan: "KARYAWAN008",
// // //       nama_lengkap: "Frank Martinez",
// // //       no_hp: "088901234567",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-24",
// // //       jumlah_kehadiran: 25,
// // //     },
// // //     {
// // //       id_presensi: "PRES009",
// // //       id_karyawan: "KARYAWAN009",
// // //       nama_lengkap: "Grace Anderson",
// // //       no_hp: "089012345678",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-25",
// // //       jumlah_kehadiran: 30,
// // //     },
// // //     {
// // //       id_presensi: "PRES010",
// // //       id_karyawan: "KARYAWAN010",
// // //       nama_lengkap: "Henry Thomas",
// // //       no_hp: "090123456789",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-26",
// // //       jumlah_kehadiran: 28,
// // //     },
// // //     {
// // //       id_presensi: "PRES011",
// // //       id_karyawan: "KARYAWAN011",
// // //       nama_lengkap: "Ivy Harris",
// // //       no_hp: "091234567890",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-27",
// // //       jumlah_kehadiran: 35,
// // //     },
// // //     {
// // //       id_presensi: "PRES012",
// // //       id_karyawan: "KARYAWAN012",
// // //       nama_lengkap: "Jack Lee",
// // //       no_hp: "092345678901",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-28",
// // //       jumlah_kehadiran: 40,
// // //     },
// // //   {
// // //       id_presensi: "PRES013",
// // //       id_karyawan: "KARYAWAN013",
// // //       nama_lengkap: "Liam Brown",
// // //       no_hp: "093456789012",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-29",
// // //       jumlah_kehadiran: 45,
// // //     },
// // //     {
// // //       id_presensi: "PRES014",
// // //       id_karyawan: "KARYAWAN014",
// // //       nama_lengkap: "Mia Johnson",
// // //       no_hp: "094567890123",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-30",
// // //       jumlah_kehadiran: 50,
// // //     },
// // //     {
// // //       id_presensi: "PRES015",
// // //       id_karyawan: "KARYAWAN015",
// // //       nama_lengkap: "Noah Smith",
// // //       no_hp: "095678901234",
// // //       role: "Driver",
// // //       tanggal_bergabung: "2025-05-31",
// // //       jumlah_kehadiran: 55,
// // //     },
// // //   ]

// // //   useEffect(() => {
// // //     // Simulasi loading data
// // //     setIsLoading(true);
// // //     setTimeout(() => {
// // //       setDriverData(exampleData);
// // //       setFilteredData(exampleData);
// // //       setIsLoading(false);
// // //     }, 500);
// // //   }, []);

// // //   // Format tanggal
// // //   const formatDate = (date) => {
// // //     if (!date) return "";
// // //     const d = date.getDate().toString().padStart(2, "0");
// // //     const m = (date.getMonth() + 1).toString().padStart(2, "0");
// // //     const y = date.getFullYear();
// // //     return `${d}-${m}-${y}`;
// // //   };

// // //   // Filter berdasarkan tanggal
// // //   const applyDateFilter = () => {
// // //     if (!tempDate) return;
// // //     const formatted = formatDate(tempDate);
// // //     const filtered = driverData.filter(
// // //       (item) => item.tanggal_bergabung === formatted
// // //     );
// // //     setSelectedDate(tempDate);
// // //     setFilteredData(filtered);
// // //     setIsDatePickerOpen(false);
// // //   };

// // //   const resetFilter = () => {
// // //     setSelectedDate(null);
// // //     setFilteredData(driverData);
// // //   };

// // //   // Handle form input
// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData({
// // //       ...formData,
// // //       [name]: value,
// // //     });
// // //   };

// // //   // Validasi form
// // //   const validateForm = () => {
// // //     if (!formData.no_hp || !formData.email || !formData.nama_lengkap) {
// // //       alert("Harap isi semua field yang wajib diisi!");
// // //       return false;
// // //     }
// // //     return true;
// // //   };

// // //   // Tambah data
// // //   const handleAdd = () => {
// // //     if (!validateForm()) return;
    
// // //     const newData = {
// // //       ...formData,
// // //       driver_id: `DRV${(driverData.length + 1).toString().padStart(3, "0")}`,
// // //       tanggal_bergabung: formData.tanggal_bergabung || formatDate(new Date()),
// // //     };
    
// // //     setDriverData([...driverData, newData]);
// // //     setFilteredData([...driverData, newData]);
// // //     setIsModalOpen(false);
// // //     setFormData({
// // //       id_presensi: "",
// // //       id_karyawan: "",
// // //       nama_lengkap: "",
// // //       no_hp: "",
// // //       role: "",
// // //       tanggal_bergabung: "",
// // //       jumlah_kehadiran: "",
// // //     });
// // //   };

// // //   // Edit data
// // //   const handleEdit = (id) => {
// // //     const dataToEdit = driverData.find(
// // //       (item) => item.driver_id === id
// // //     );
// // //     if (dataToEdit) {
// // //       setFormData(dataToEdit);
// // //       setEditId(id);
// // //       setIsModalOpen(true);
// // //     }
// // //   };

// // //   const handleUpdate = () => {
// // //     if (!validateForm()) return;
    
// // //     const updatedData = driverData.map((item) =>
// // //       item.driver_id === editId ? formData : item
// // //     );
    
// // //     setDriverData(updatedData);
// // //     setFilteredData(updatedData);
// // //     setIsModalOpen(false);
// // //     setFormData({
// // //       id_presensi: "",
// // //       id_karyawan: "",
// // //       nama_lengkap: "",
// // //       no_hp: "",
// // //       role: "",
// // //       tanggal_bergabung: "",
// // //       jumlah_kehadiran: "",
// // //     });
// // //     setEditId(null);
// // //   };

// // //   // Hapus data
// // //   const handleDelete = (id) => {
// // //     if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
// // //       const filtered = driverData.filter(
// // //         (item) => item.driver_id !== id
// // //       );
// // //       setDriverData(filtered);
// // //       setFilteredData(filtered);
// // //     }
// // //   };

// // //   // Export data
// // //   const getFileName = (ext) => {
// // //     if (selectedDate) {
// // //       const formatted = formatDate(selectedDate).replace(/-/g, "");
// // //       return `data_driver_${formatted}.${ext}`;
// // //     }
// // //     return `data_driver_semua.${ext}`;
// // //   };

// // //   const handleExportExcel = () => {
// // //     if (filteredData.length === 0) {
// // //       alert("Data kosong, tidak bisa export Excel!");
// // //       return;
// // //     }
    
// // //     try {
// // //       const ws = XLSX.utils.json_to_sheet(filteredData);
// // //       const wb = XLSX.utils.book_new();
// // //       XLSX.utils.book_append_sheet(wb, ws, "Driver");
// // //       XLSX.writeFile(wb, getFileName("xlsx"));
// // //     } catch (error) {
// // //       console.error("Export Excel error:", error);
// // //       alert("Gagal export Excel!");
// // //     }
// // //   };

// // //   const handleExportPDF = () => {
// // //     if (filteredData.length === 0) {
// // //       alert("Data kosong, tidak bisa export PDF!");
// // //       return;
// // //     }
    
// // //     try {
// // //       const doc = new jsPDF();
// // //       const tableColumn = [
// // //         "Id Presensi",
// // //         "Id Karyawan",
// // //         "Nama Lengkap",
// // //         "No HP",
// // //         "Role",
// // //         "Tanggal Bergabung",
// // //         "Jumlah Kehadiran",
// // //       ];
// // //       const tableRows = filteredData.map((item) => [
// // //         item.id_presensi,
// // //         item.id_karyawan,
// // //         item.nama_lengkap,
// // //         item.no_hp,
// // //         item.role,
// // //         item.tanggal_bergabung,
// // //         item.jumlah_kehadiran,
// // //       ]);
      
// // //       doc.text("Laporan Data Driver", 14, 10);
// // //       autoTable(doc, {
// // //         head: [tableColumn],
// // //         body: tableRows,
// // //         startY: 20,
// // //         styles: {
// // //           fontSize: 8,
// // //           cellPadding: 2
// // //         },
// // //         headStyles: {
// // //           fillColor: [61, 108, 185]
// // //         }
// // //       });
      
// // //       doc.save(getFileName("pdf"));
// // //     } catch (error) {
// // //       console.error("Export PDF error:", error);
// // //       alert("Gagal export PDF!");
// // //     }
// // //   };
  
// // //   return (
// // //     <div className="flex relative bg-white-50 min-h-screen">
// // //       <UserMenu />
// // //       <Sidebar />
// // //       <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
// // //         <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
// // //           Presensi
// // //         </h1>

// // //         {/* Toolbar */}
// // //         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
// // //           <div className="flex gap-4">
// // //             <div className="relative" ref={calendarRef}>
// // //               {!selectedDate ? (
// // //                 <button
// // //                   onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
// // //                   className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
// // //                 >
// // //                   <CalendarDays size={20} />
// // //                   <span>Pilih Tanggal</span>
// // //                 </button>
// // //               ) : (
// // //                 <button
// // //                   onClick={resetFilter}
// // //                   className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
// // //                 >
// // //                   <RotateCcw size={20} />
// // //                   <span>Set Ulang</span>
// // //                 </button>
// // //               )}

// // //               {isDatePickerOpen && (
// // //                 <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
// // //                   <DatePicker
// // //                     selected={tempDate}
// // //                     onChange={(date) => setTempDate(date)}
// // //                     inline
// // //                     dateFormat="dd/MM/yyyy"
// // //                     showPopperArrow={false}
// // //                   />
// // //                   <div className="mt-4 flex justify-between">
// // //                     <button
// // //                       onClick={() => {
// // //                         setTempDate(null);
// // //                         setIsDatePickerOpen(false);
// // //                       }}
// // //                       className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white"
// // //                     >
// // //                       Batal
// // //                     </button>
// // //                     <button
// // //                       onClick={applyDateFilter}
// // //                       className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white"
// // //                     >
// // //                       Pilih Tanggal
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             <button
// // //               onClick={() => {
// // //                 setIsModalOpen(true);
// // //                 setEditId(null);
// // //                 setFormData({
// // //                   id_presensi: "",
// // //                   id_karyawan: "",
// // //                   nama_lengkap: "",
// // //                   no_hp: "",
// // //                   role: "",
// // //                   tanggal_bergabung: "",
// // //                   jumlah_kehadiran: "",
// // //                 });
// // //               }}
// // //               className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
// // //             >
// // //               <PlusCircle size={20} />
// // //               <span>Tambah</span>
// // //             </button>
// // //           </div>

// // //           <div className="flex gap-4">
// // //             <button
// // //               onClick={handleExportExcel}
// // //               disabled={filteredData.length === 0}
// // //               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
// // //                 filteredData.length === 0
// // //                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// // //                   : "bg-green-100 text-black hover:bg-[#B8D4F9]"
// // //               }`}
// // //             >
// // //               <FileSpreadsheet size={20} color={filteredData.length === 0 ? "gray" : "green"} />
// // //               <span>Export Excel</span>
// // //             </button>
// // //             <button
// // //               onClick={handleExportPDF}
// // //               disabled={filteredData.length === 0}
// // //               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
// // //                 filteredData.length === 0
// // //                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// // //                   : "bg-red-100 text-black hover:bg-[#B8D4F9]"
// // //               }`}
// // //             >
// // //               <FileText size={20} color={filteredData.length === 0 ? "gray" : "red"} />
// // //               <span>Export PDF</span>
// // //             </button>
// // //           </div>
// // //         </div>

// // //         <div className="flex justify-end mb-4">
// // //           <button
// // //             onClick={() => router.push("/lihat-semua")}
// // //             className="text-[#3D6CB9] hover:text-blue-800 text-base font-medium"
// // //           >
// // //             Lihat Semua
// // //           </button>
// // //         </div>

// // //         {/* Tabel */}
// // //         {!isLoading && (
// // //           <div className="overflow-y-auto max-h-[500px] rounded-lg shadow mb-8">
// // //             <table className="min-w-full table-auto bg-white text-sm">
// // //               <thead className="bg-[#3D6CB9] text-white">
// // //                 <tr>
// // //                   {[
// // //                     "Id Presensi",
// // //                     "Id Karyawan",
// // //                     "Nama Lengkap",
// // //                     "No HP",
// // //                     "Role",
// // //                     "Tanggal Bergabung",
// // //                     "Jumlah Kehadiran",
// // //                     "Aksi",
// // //                   ].map((header, index, arr) => (
// // //                     <th
// // //                       key={header}
// // //                       className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
// // //                       style={{
// // //                         borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
// // //                         borderTopRightRadius:
// // //                           index === arr.length - 1 ? "0.5rem" : undefined,
// // //                       }}
// // //                     >
// // //                       {header}
// // //                     </th>
// // //                   ))}
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {filteredData.length === 0 ? (
// // //                   <tr>
// // //                     <td
// // //                       colSpan={7}
// // //                       className="text-center p-4 text-gray-500 font-medium"
// // //                     >
// // //                       Data Tidak Ditemukan
// // //                     </td>
// // //                   </tr>
// // //                 ) : (
// // //                   filteredData.map((item, index) => (
// // //                     <tr
// // //                       key={item.driver_id || `row-${index}`}
// // //                       className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
// // //                     >
// // //                       <td className="p-3">{item.id_presensi}</td>
// // //                       <td className="p-3">{item.id_karyawan}</td>
// // //                       <td className="p-3">{item.nama_lengkap}</td>
// // //                       <td className="p-3">{item.no_hp}</td>
// // //                       <td className="p-3">{item.role}</td>
// // //                       <td className="p-3">{item.tanggal_bergabung}</td>
// // //                       <td className="p-3">{item.jumlah_kehadiran}</td>
// // //                       {/* Aksi */}
// // //                       <td className="p-3">
// // //                         <div className="flex justify-center gap-2">
// // //                           <button
// // //                             onClick={() => handleEdit(item.driver_id)}
// // //                             className="p-1 text-blue-600 hover:text-blue-800"
// // //                             title="Edit"
// // //                           >
// // //                             <Edit size={18} />
// // //                           </button>
// // //                           <button
// // //                             onClick={() => handleDelete(item.driver_id)}
// // //                             className="p-1 text-red-600 hover:text-red-800"
// // //                             title="Hapus"
// // //                           >
// // //                             <Trash2 size={18} />
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   ))
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}

// // //         {/* Modal Tambah/Edit */}
// // //         {isModalOpen && (
// // //           <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
// // //             <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
// // //               <h2 className="text-xl font-semibold mb-4 text-center">
// // //                 {editId ? "Edit Driver" : "Tambah Driver"}
// // //               </h2>
// // //               <div className="space-y-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium mb-1">
// // //                     Id Presensi <span className="text-red-500">*</span>
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     name="id_presensi"
// // //                     value={formData.id_presensi}
// // //                     onChange={handleInputChange}
// // //                     className="w-full p-2 border rounded"
// // //                     required
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label className="block text-sm font-medium mb-1">
// // //                     Id Karyawan <span className="text-red-500">*</span>
// // //                   </label>
// // //                   <input
// // //                     type="email"
// // //                     name="id_karyawan"
// // //                     value={formData.id_karyawan}
// // //                     onChange={handleInputChange}
// // //                     className="w-full p-2 border rounded"
// // //                     required
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label className="block text-sm font-medium mb-1">
// // //                     Nama Lengkap <span className="text-red-500">*</span>
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     name="nama_lengkap"
// // //                     value={formData.nama_lengkap}
// // //                     onChange={handleInputChange}
// // //                     className="w-full p-2 border rounded"
// // //                     required
// // //                   />
// // //                 </div>

// // //                                 <div>
// // //                   <label className="block text-sm font-medium mb-1">
// // //                     No HP <span className="text-red-500">*</span>
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     name="no_hp"
// // //                     value={formData.no_hp}
// // //                     onChange={handleInputChange}
// // //                     className="w-full p-2 border rounded"
// // //                     required
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label className="block text-sm font-medium mb-1">
// // //                     Role
// // //                   </label>
// // //                   <select
// // //                     name="role"
// // //                     value={formData.role}
// // //                     onChange={handleInputChange}
// // //                     className="w-full p-2 border rounded"
// // //                   >
// // //                     <option value="Driver">Driver</option>
// // //                     <option value="Pengurus">Pengurus</option>
// // //                     <option value="Owner">Owner</option>
// // //                     <option value="Admin">Admin</option>
// // //                     <option value="Front End">Front End</option>
// // //                   </select>
// // //                 </div>

// // //                 <div>
// // //                   <label className="block text-sm font-medium mb-1">
// // //                     Tanggal Bergabung
// // //                   </label>
// // //                   <input
// // //                     type="date"
// // //                     name="tanggal_bergabung"
// // //                     value={formData.tanggal_bergabung}
// // //                     onChange={handleInputChange}
// // //                     className="w-full p-2 border rounded"
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label className="block text-sm font-medium mb-1">
// // //                     Jumlah_kehadiran
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     name="jumlah_kehadiran"
// // //                     value={formData.jumlah_kehadiran}
// // //                     onChange={handleInputChange}
// // //                     className="w-full p-2 border rounded"
// // //                   />
// // //                 </div>
// // //               </div>
// // //               <div className="flex justify-end gap-2 mt-6">
// // //                 <button
// // //                   onClick={() => setIsModalOpen(false)}
// // //                   className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
// // //                 >
// // //                   Batal
// // //                 </button>
// // //                 <button
// // //                   onClick={editId ? handleUpdate : handleAdd}
// // //                   className="px-4 py-2 bg-[#3D6CB9] text-white rounded hover:bg-[#2C4F8A]"
// // //                 >
// // //                   {editId ? "Update" : "Simpan"}
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default withAuth(PresensiPage);

// // // src/app/akuntansi/presensi/page.jsx (Your original file, but modified)
// // "use client";

// // import { useState, useRef, useEffect } from "react";
// // import Sidebar from "/components/Sidebar.jsx";
// // import UserMenu from "/components/Pengguna.jsx";
// // import withAuth from "/src/app/lib/withAuth";
// // import {
// //   CalendarDays,
// //   FileText,
// //   FileSpreadsheet,
// //   PlusCircle,
// //   Edit,
// //   Trash2,
// // } from "lucide-react";
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";
// // import * as XLSX from "xlsx";
// // import jsPDF from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import { useRouter } from "next/navigation";
// // import { RotateCcw } from "lucide-react";
// // import Link from "next/link";
// // import TambahPresensi from "/components/TambahPresensi"; // Import the new component

// // const PresensiPage = () => {
// //   // State untuk data dan filter
// //   const [driverData, setDriverData] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
// //   const [selectedDate, setSelectedDate] = useState(null);
// //   const [tempDate, setTempDate] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [formData, setFormData] = useState({
// //     id_presensi: "",
// //     id_karyawan: "",
// //     nama_lengkap: "",
// //     no_hp: "",
// //     role: "Driver", 
// //     tanggal_bergabung: "",
// //     jumlah_kehadiran: "",
// //   });
// //   const [editId, setEditId] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const calendarRef = useRef(null);
// //   const router = useRouter();

// //   const exampleData = [
// //     {
// //       id_presensi: "PRES001",
// //       id_karyawan: "KARYAWAN001",
// //       nama_lengkap: "John Doe",
// //       no_hp: "081234567890",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-17",
// //       jumlah_kehadiran: 10,
// //     },
// //     {
// //       id_presensi: "PRES002",
// //       id_karyawan: "KARYAWAN002",
// //       nama_lengkap: "Jane Smith",
// //       no_hp: "082345678901",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-18",
// //       jumlah_kehadiran: 8,
// //     },
// //     {
// //       id_presensi: "PRES003",
// //       id_karyawan: "KARYAWAN003",
// //       nama_lengkap: "Alice Johnson",
// //       no_hp: "083456789012",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-19",
// //       jumlah_kehadiran: 12,
// //     },
// //     {
// //       id_presensi: "PRES004",
// //       id_karyawan: "KARYAWAN004",
// //       nama_lengkap: "Bob Brown",
// //       no_hp: "084567890123",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-20",
// //       jumlah_kehadiran: 15,
// //     },
// //     {
// //       id_presensi: "PRES005",
// //       id_karyawan: "KARYAWAN005",
// //       nama_lengkap: "Charlie Davis",
// //       no_hp: "085678901234",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-21",
// //       jumlah_kehadiran: 20,
// //     },
// //     {
// //       id_presensi: "PRES006",
// //       id_karyawan: "KARYAWAN006",
// //       nama_lengkap: "David Wilson",
// //       no_hp: "086789012345",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-22",
// //       jumlah_kehadiran: 18,
// //     },
// //     {
// //       id_presensi: "PRES007",
// //       id_karyawan: "KARYAWAN007",
// //       nama_lengkap: "Eve Taylor",
// //       no_hp: "087890123456",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-23",
// //       jumlah_kehadiran: 22,
// //     },
// //     {
// //       id_presensi: "PRES008",
// //       id_karyawan: "KARYAWAN008",
// //       nama_lengkap: "Frank Martinez",
// //       no_hp: "088901234567",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-24",
// //       jumlah_kehadiran: 25,
// //     },
// //     {
// //       id_presensi: "PRES009",
// //       id_karyawan: "KARYAWAN009",
// //       nama_lengkap: "Grace Anderson",
// //       no_hp: "089012345678",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-25",
// //       jumlah_kehadiran: 30,
// //     },
// //     {
// //       id_presensi: "PRES010",
// //       id_karyawan: "KARYAWAN010",
// //       nama_lengkap: "Henry Thomas",
// //       no_hp: "090123456789",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-26",
// //       jumlah_kehadiran: 28,
// //     },
// //     {
// //       id_presensi: "PRES011",
// //       id_karyawan: "KARYAWAN011",
// //       nama_lengkap: "Ivy Harris",
// //       no_hp: "091234567890",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-27",
// //       jumlah_kehadiran: 35,
// //     },
// //     {
// //       id_presensi: "PRES012",
// //       id_karyawan: "KARYAWAN012",
// //       nama_lengkap: "Jack Lee",
// //       no_hp: "092345678901",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-28",
// //       jumlah_kehadiran: 40,
// //     },
// //     {
// //       id_presensi: "PRES013",
// //       id_karyawan: "KARYAWAN013",
// //       nama_lengkap: "Liam Brown",
// //       no_hp: "093456789012",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-29",
// //       jumlah_kehadiran: 45,
// //     },
// //     {
// //       id_presensi: "PRES014",
// //       id_karyawan: "KARYAWAN014",
// //       nama_lengkap: "Mia Johnson",
// //       no_hp: "094567890123",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-30",
// //       jumlah_kehadiran: 50,
// //     },
// //     {
// //       id_presensi: "PRES015",
// //       id_karyawan: "KARYAWAN015",
// //       nama_lengkap: "Noah Smith",
// //       no_hp: "095678901234",
// //       role: "Driver",
// //       tanggal_bergabung: "2025-05-31",
// //       jumlah_kehadiran: 55,
// //     },
// //   ];

// //   useEffect(() => {
// //     // Simulasi loading data
// //     setIsLoading(true);
// //     setTimeout(() => {
// //       setDriverData(exampleData);
// //       setFilteredData(exampleData);
// //       setIsLoading(false);
// //     }, 500);
// //   }, []);

// //   // Format tanggal
// //   const formatDate = (date) => {
// //     if (!date) return "";
// //     const d = date.getDate().toString().padStart(2, "0");
// //     const m = (date.getMonth() + 1).toString().padStart(2, "0");
// //     const y = date.getFullYear();
// //     return `${d}-${m}-${y}`;
// //   };

// //   // Filter berdasarkan tanggal
// //   const applyDateFilter = () => {
// //     if (!tempDate) return;
// //     const formatted = formatDate(tempDate);
// //     const filtered = driverData.filter(
// //       (item) => item.tanggal_bergabung === formatted
// //     );
// //     setSelectedDate(tempDate);
// //     setFilteredData(filtered);
// //     setIsDatePickerOpen(false);
// //   };

// //   const resetFilter = () => {
// //     setSelectedDate(null);
// //     setFilteredData(driverData);
// //   };

// //   const handleAddSubmit = (newPresensi) => {
// //     const newData = {
// //       ...newPresensi,
// //       id_presensi: `PRES${(driverData.length + 1).toString().padStart(3, "0")}`, // Generate new ID
// //       tanggal_bergabung: newPresensi.tanggal_bergabung || formatDate(new Date()),
// //     };
// //     setDriverData([...driverData, newData]);
// //     setFilteredData([...driverData, newData]);
// //     setIsModalOpen(false);
// //     setFormData({
// //       id_presensi: "",
// //       id_karyawan: "",
// //       nama_lengkap: "",
// //       no_hp: "",
// //       role: "Driver",
// //       tanggal_bergabung: "",
// //       jumlah_kehadiran: "",
// //     });
// //   };

// //   // Navigate to edit page
// //   const handleEdit = (id) => {
// //     router.push(`/akuntansi/presensi/edit-presensi/${id}`);
// //   };

// //   // Hapus data
// //   const handleDelete = (id) => {
// //     if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
// //       const filtered = driverData.filter((item) => item.id_presensi !== id);
// //       setDriverData(filtered);
// //       setFilteredData(filtered);
// //     }
// //   };

// //   // Export data
// //   const getFileName = (ext) => {
// //     if (selectedDate) {
// //       const formatted = formatDate(selectedDate).replace(/-/g, "");
// //       return `data_presensi_${formatted}.${ext}`;
// //     }
// //     return `data_presensi_semua.${ext}`;
// //   };

// //   const handleExportExcel = () => {
// //     if (filteredData.length === 0) {
// //       alert("Data kosong, tidak bisa export Excel!");
// //       return;
// //     }

// //     try {
// //       const ws = XLSX.utils.json_to_sheet(filteredData);
// //       const wb = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(wb, ws, "Presensi");
// //       XLSX.writeFile(wb, getFileName("xlsx"));
// //     } catch (error) {
// //       console.error("Export Excel error:", error);
// //       alert("Gagal export Excel!");
// //     }
// //   };

// //   const handleExportPDF = () => {
// //     if (filteredData.length === 0) {
// //       alert("Data kosong, tidak bisa export PDF!");
// //       return;
// //     }

// //     try {
// //       const doc = new jsPDF();
// //       const tableColumn = [
// //         "Id Presensi",
// //         "Id Karyawan",
// //         "Nama Lengkap",
// //         "No HP",
// //         "Role",
// //         "Tanggal Bergabung",
// //         "Jumlah Kehadiran",
// //       ];
// //       const tableRows = filteredData.map((item) => [
// //         item.id_presensi,
// //         item.id_karyawan,
// //         item.nama_lengkap,
// //         item.no_hp,
// //         item.role,
// //         item.tanggal_bergabung,
// //         item.jumlah_kehadiran,
// //       ]);

// //       doc.text("Laporan Data Presensi", 14, 10);
// //       autoTable(doc, {
// //         head: [tableColumn],
// //         body: tableRows,
// //         startY: 20,
// //         styles: {
// //           fontSize: 8,
// //           cellPadding: 2,
// //         },
// //         headStyles: {
// //           fillColor: [61, 108, 185],
// //         },
// //       });

// //       doc.save(getFileName("pdf"));
// //     } catch (error) {
// //       console.error("Export PDF error:", error);
// //       alert("Gagal export PDF!");
// //     }
// //   };

// //   return (
// //     <div className="flex relative bg-white-50 min-h-screen">
// //       <UserMenu />
// //       <Sidebar />
// //       <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
// //         <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
// //           Presensi
// //         </h1>

// //         {/* Toolbar */}
// //         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
// //           <div className="flex gap-4">
// //             <div className="relative" ref={calendarRef}>
// //               {!selectedDate ? (
// //                 <button
// //                   onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
// //                   className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
// //                 >
// //                   <CalendarDays size={20} />
// //                   <span>Pilih Tanggal</span>
// //                 </button>
// //               ) : (
// //                 <button
// //                   onClick={resetFilter}
// //                   className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
// //                 >
// //                   <RotateCcw size={20} />
// //                   <span>Set Ulang</span>
// //                 </button>
// //               )}

// //               {isDatePickerOpen && (
// //                 <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
// //                   <DatePicker
// //                     selected={tempDate}
// //                     onChange={(date) => setTempDate(date)}
// //                     inline
// //                     dateFormat="dd/MM/yyyy"
// //                     showPopperArrow={false}
// //                   />
// //                   <div className="mt-4 flex justify-between">
// //                     <button
// //                       onClick={() => {
// //                         setTempDate(null);
// //                         setIsDatePickerOpen(false);
// //                       }}
// //                       className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white"
// //                     >
// //                       Batal
// //                     </button>
// //                     <button
// //                       onClick={applyDateFilter}
// //                       className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white"
// //                     >
// //                       Pilih Tanggal
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <button
// //               onClick={() => {
// //                 setIsModalOpen(true);
// //                 setEditId(null); // Ensure no edit ID is set for new entries
// //                 setFormData({
// //                   id_presensi: "",
// //                   id_karyawan: "",
// //                   nama_lengkap: "",
// //                   no_hp: "",
// //                   role: "Driver",
// //                   tanggal_bergabung: "",
// //                   jumlah_kehadiran: "",
// //                 });
// //               }}
// //               className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
// //             >
// //               <PlusCircle size={20} />
// //               <span>Tambah</span>
// //             </button>
// //           </div>

// //           <div className="flex gap-4">
// //             <button
// //               onClick={handleExportExcel}
// //               disabled={filteredData.length === 0}
// //               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
// //                 filteredData.length === 0
// //                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// //                   : "bg-green-100 text-black hover:bg-[#B8D4F9]"
// //               }`}
// //             >
// //               <FileSpreadsheet size={20} color={filteredData.length === 0 ? "gray" : "green"} />
// //               <span>Export Excel</span>
// //             </button>
// //             <button
// //               onClick={handleExportPDF}
// //               disabled={filteredData.length === 0}
// //               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
// //                 filteredData.length === 0
// //                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
// //                   : "bg-red-100 text-black hover:bg-[#B8D4F9]"
// //               }`}
// //             >
// //               <FileText size={20} color={filteredData.length === 0 ? "gray" : "red"} />
// //               <span>Export PDF</span>
// //             </button>
// //           </div>
// //         </div>

// //         <div className="flex justify-end mb-4">
// //           <button
// //             onClick={() => router.push("/lihat-semua")} // This route seems generic, you might want to adjust
// //             className="text-[#3D6CB9] hover:text-blue-800 text-base font-medium"
// //           >
// //             Lihat Semua
// //           </button>
// //         </div>

// //         {/* Tabel */}
// //         {!isLoading && (
// //           <div className="overflow-y-auto max-h-[500px] rounded-lg shadow mb-8">
// //             <table className="min-w-full table-auto bg-white text-sm">
// //               <thead className="bg-[#3D6CB9] text-white">
// //                 <tr>
// //                   {[
// //                     "Id Presensi",
// //                     "Id Karyawan",
// //                     "Nama Lengkap",
// //                     "No HP",
// //                     "Role",
// //                     "Tanggal Bergabung",
// //                     "Jumlah Kehadiran",
// //                     "Aksi",
// //                   ].map((header, index, arr) => (
// //                     <th
// //                       key={header}
// //                       className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
// //                       style={{
// //                         borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
// //                         borderTopRightRadius:
// //                           index === arr.length - 1 ? "0.5rem" : undefined,
// //                       }}
// //                     >
// //                       {header}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredData.length === 0 ? (
// //                   <tr>
// //                     <td
// //                       colSpan={8} // Changed colspan to 8 to match the number of columns
// //                       className="text-center p-4 text-gray-500 font-medium"
// //                     >
// //                       Data Tidak Ditemukan
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   filteredData.map((item, index) => (
// //                     <tr
// //                       key={item.id_presensi || `row-${index}`} // Use id_presensi as key
// //                       className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
// //                     >
// //                       <td className="p-3">{item.id_presensi}</td>
// //                       <td className="p-3">{item.id_karyawan}</td>
// //                       <td className="p-3">{item.nama_lengkap}</td>
// //                       <td className="p-3">{item.no_hp}</td>
// //                       <td className="p-3">{item.role}</td>
// //                       <td className="p-3">{item.tanggal_bergabung}</td>
// //                       <td className="p-3">{item.jumlah_kehadiran}</td>
// //                       {/* Aksi */}
// //                       <td className="p-3">
// //                         <div className="flex justify-center gap-2">
// //                           {/* <button
// //                             onClick={() => handleEdit(item.id_presensi)} // Pass id_presensi
// //                             className="p-1 text-blue-600 hover:text-blue-800"
// //                             title="Edit"
// //                           >
// //                             <Edit size={18} />
// //                           </button> */}
// //                           <Link
// //                             href={`/dashboard/akuntansi/presensi/edit-presensi/${item.id_presensi}`} 
// //                             className="text-indigo-600 hover:underline"
// //                             >
// //                             <Edit size={18} />
// //                             </Link>
// //                           <button
// //                             onClick={() => handleDelete(item.id_presensi)} // Pass id_presensi
// //                             className="p-1 text-red-600 hover:text-red-800"
// //                             title="Hapus"
// //                           >
// //                             <Trash2 size={18} />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}

// //         {/* Modal Tambah */}
// //         <TambahPresensi
// //           isOpen={isModalOpen}
// //           onClose={() => setIsModalOpen(false)}
// //           onSubmit={handleAddSubmit}
// //           initialData={formData}
// //           isEditMode={false} // Always false for adding
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default withAuth(PresensiPage);

// // src/app/dashboard/presensi/page.jsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import TambahPresensi from "/components/TambahPresensi.jsx"; // Akan dibuat selanjutnya
// import {
//   CalendarDays,
//   FileText,
//   FileSpreadsheet,
//   PlusCircle,
//   Edit,
//   Trash2,
//   RotateCcw,
// } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import Link from "next/link";
// import autoTable from "jspdf-autotable";

// const formatDateToDisplay = (date) => {
//   if (!date) return "";
//   const d = date instanceof Date ? date : new Date(date);
//   if (isNaN(d.getTime())) return "";
//   const day = d.getDate().toString().padStart(2, "0");
//   const month = (d.getMonth() + 1).toString().padStart(2, "0");
//   const year = d.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// // Pastikan komponen ini menerima 'children' untuk Intercepting Routes
// const PresensiPage = ({ children }) => {
//   const [dataPresensi, setDataPresensi] = useState([]); // Data mentah dari localStorage
//   const [filteredData, setFilteredData] = useState([]); // Data setelah filter, untuk tabel dan export
//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [selectedDateForFilter, setSelectedDateForFilter] = useState(null);
//   const [tempDateForPicker, setTempDateForPicker] = useState(null);
//   const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const calendarRef = useRef(null);

//   const exampleData = [
//     {
//       id_presensi: "PR-001",
//       id_karyawan: "K-001",
//       nama_lengkap: "Budi Santoso",
//       no_hp: "081234567890",
//       role: "Driver",
//       tanggal_bergabung: "01-01-2023",
//       jumlah_kehadiran: 20,
//     },
//     {
//       id_presensi: "PR-002",
//       id_karyawan: "K-002",
//       nama_lengkap: "Siti Aminah",
//       no_hp: "081298765432",
//       role: "Driver",
//       tanggal_bergabung: "15-02-2023",
//       jumlah_kehadiran: 18,
//     },
//     {
//       id_presensi: "PR-003",
//       id_karyawan: "K-003",
//       nama_lengkap: "Joko Susilo",
//       no_hp: "085611223344",
//       role: "Admin",
//       tanggal_bergabung: "10-03-2023",
//       jumlah_kehadiran: 22,
//     },
//     {
//       id_presensi: "PR-004",
//       id_karyawan: "K-004",
//       nama_lengkap: "Ani Lestari",
//       no_hp: "087855667788",
//       role: "Helper",
//       tanggal_bergabung: "01-04-2023",
//       jumlah_kehadiran: 19,
//     },
//     {
//       id_presensi: "PR-005",
//       id_karyawan: "K-005",
//       nama_lengkap: "Rudi Hartono",
//       no_hp: "081300998877",
//       role: "Driver",
//       tanggal_bergabung: "20-05-2023",
//       jumlah_kehadiran: 21,
//     },
//   ];

//   const loadAndFilterData = () => {
//     setIsLoading(true);
//     const storedDataString = localStorage.getItem("dataPresensi");
//     let currentRawData;
//     if (storedDataString) {
//       currentRawData = JSON.parse(storedDataString);
//     } else {
//       currentRawData = exampleData;
//       localStorage.setItem("dataPresensi", JSON.stringify(exampleData));
//     }
//     setDataPresensi(currentRawData);

//     // Untuk filter tanggal, kita akan filter berdasarkan tanggal_bergabung.
//     // Jika Anda ingin filter berdasarkan tanggal presensi harian,
//     // maka struktur data contoh perlu disesuaikan (misal: array of presensi harian)
//     if (selectedDateForFilter) {
//       const formattedFilterDate = formatDateToDisplay(selectedDateForFilter);
//       setFilteredData(
//         currentRawData.filter(
//           (item) => item.tanggal_bergabung === formattedFilterDate
//         )
//       );
//     } else {
//       setFilteredData(currentRawData);
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     loadAndFilterData();
//     const handleDataUpdate = () => loadAndFilterData();
//     window.addEventListener("dataPresensiUpdated", handleDataUpdate);
//     return () => {
//       window.removeEventListener("dataPresensiUpdated", handleDataUpdate);
//     };
//   }, [selectedDateForFilter]);

//   const applyDateFilter = () => {
//     setSelectedDateForFilter(tempDateForPicker);
//     setIsDatePickerOpen(false);
//   };

//   const resetFilter = () => {
//     setSelectedDateForFilter(null);
//     setTempDateForPicker(null);
//     setIsDatePickerOpen(false);
//   };

//   const handleOpenTambahModal = () => {
//     setIsTambahModalOpen(true);
//   };

//   const handleCloseTambahModal = () => {
//     setIsTambahModalOpen(false);
//   };

//   const handleAddDataToList = (newData) => {
//     const updatedRawData = [...dataPresensi, newData];
//     localStorage.setItem("dataPresensi", JSON.stringify(updatedRawData));
//     window.dispatchEvent(new CustomEvent("dataPresensiUpdated"));
//     loadAndFilterData();
//     handleCloseTambahModal();
//     alert("Data presensi baru berhasil ditambahkan!");
//   };

//   const handleDeleteAction = (idPresensi) => {
//     if (confirm("Apakah Anda yakin ingin menghapus data presensi ini?")) {
//       const updatedRawData = dataPresensi.filter(
//         (item) => item.id_presensi !== idPresensi
//       );
//       localStorage.setItem("dataPresensi", JSON.stringify(updatedRawData));
//       window.dispatchEvent(new CustomEvent("dataPresensiUpdated"));
//       loadAndFilterData();
//       alert("Data presensi berhasil dihapus.");
//     }
//   };

//   const getExportFileName = (ext) => {
//     const date = new Date().toISOString().split("T")[0];
//     return `laporan_presensi_${date}.${ext}`;
//   };

//   const handleExportExcelAction = () => {
//     if (filteredData.length === 0) {
//       alert("Data kosong (sesuai filter saat ini), tidak bisa export Excel!");
//       return;
//     }
//     try {
//       const ws = XLSX.utils.json_to_sheet(filteredData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Presensi");
//       XLSX.writeFile(wb, getExportFileName("xlsx"));
//     } catch (error) {
//       console.error("Export Excel error:", error);
//       alert("Gagal export Excel!");
//     }
//   };

//   const handleExportPDFAction = () => {
//     if (filteredData.length === 0) {
//       alert("Data kosong, tidak bisa export PDF!");
//       return;
//     }
//     try {
//       const doc = new jsPDF();
//       const tableColumn = [
//         "ID Presensi",
//         "ID Karyawan",
//         "Nama Lengkap",
//         "No. HP",
//         "Role",
//         "Tanggal Bergabung",
//         "Jumlah Kehadiran",
//       ];
//       const tableRows = filteredData.map((item) => [
//         item.id_presensi,
//         item.id_karyawan,
//         item.nama_lengkap,
//         item.no_hp,
//         item.role,
//         item.tanggal_bergabung,
//         item.jumlah_kehadiran,
//       ]);
//       doc.text(
//         `Laporan Data Presensi ${
//           selectedDateForFilter
//             ? `(${formatDateToDisplay(selectedDateForFilter)})`
//             : "(Sesuai Filter)"
//         }`,
//         14,
//         15
//       );
//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 20,
//         styles: {
//           fontSize: 8,
//           cellPadding: 2,
//         },
//         headStyles: {
//           fillColor: [61, 108, 185],
//         },
//       });
//       doc.save(getExportFileName("pdf"));
//     } catch (error) {
//       console.error("Export PDF error:", error);
//       alert("Gagal export PDF!");
//     }
//   };

//   // Menutup date picker jika klik di luar
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         calendarRef.current &&
//         !calendarRef.current.contains(event.target)
//       ) {
//         setIsDatePickerOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [calendarRef]);

//   return (
//     <div className="flex relative bg-white-50 min-h-screen">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
//         <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
//           Presensi
//         </h1>

//         {/* Toolbar */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
//           <div className="flex gap-4">
//             {/* Date Picker */}
//             <div className="relative" ref={calendarRef}>
//               {!selectedDateForFilter ? (
//                 <button
//                   onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
//                   className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
//                 >
//                   <CalendarDays size={20} /> <span>Pilih Tanggal</span>
//                 </button>
//               ) : (
//                 <button
//                   onClick={resetFilter}
//                   className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
//                 >
//                   <RotateCcw size={20} /> <span>Set Ulang</span>
//                 </button>
//               )}
//               {isDatePickerOpen && (
//                 <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
//                   <DatePicker
//                     selected={tempDateForPicker}
//                     onChange={(date) => setTempDateForPicker(date)}
//                     inline
//                     dateFormat="dd/MM/yyyy"
//                     showPopperArrow={false}
//                   />
//                   <div className="mt-4 flex justify-between">
//                     <button
//                       onClick={() => {
//                         setTempDateForPicker(selectedDateForFilter);
//                         setIsDatePickerOpen(false);
//                       }}
//                       className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white"
//                     >
//                       Batal
//                     </button>
//                     <button
//                       onClick={applyDateFilter}
//                       className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white"
//                     >
//                       Pilih Tanggal
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//             {/* Tombol Tambah */}
//             {/* Menggunakan Link untuk intercepting route */}
//             <Link
//               href="/dashboard/presensi/@modal/tambah-presensi"
//               className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
//             >
//               <PlusCircle size={20} /> <span>Tambah</span>
//             </Link>
//           </div>
//           {/* Tombol Export */}
//           <div className="flex gap-4">
//             <button
//               onClick={handleExportExcelAction}
//               disabled={filteredData.length === 0}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
//                 filteredData.length === 0
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-green-100 text-black hover:bg-[#B8D4F9]"
//               }`}
//             >
//               <FileSpreadsheet
//                 size={20}
//                 color={filteredData.length === 0 ? "gray" : "green"}
//               />{" "}
//               <span>Export Excel</span>
//             </button>
//             <button
//               onClick={handleExportPDFAction}
//               disabled={filteredData.length === 0}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
//                 filteredData.length === 0
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-red-100 text-black hover:bg-[#B8D4F9]"
//               }`}
//             >
//               <FileText
//                 size={20}
//                 color={filteredData.length === 0 ? "gray" : "red"}
//               />{" "}
//               <span>Export PDF</span>
//             </button>
//           </div>
//         </div>

//         {/* Tabel */}
//         {isLoading ? (
//           <div className="text-center p-10">Memuat data presensi...</div>
//         ) : (
//           <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8">
//             <table className="min-w-full table-auto bg-white text-sm">
//               <thead className="bg-[#3D6CB9] text-white">
//                 <tr>
//                   {[
//                     "ID Presensi",
//                     "ID Karyawan",
//                     "Nama Lengkap",
//                     "No. HP",
//                     "Role",
//                     "Tanggal Bergabung",
//                     "Jumlah Kehadiran",
//                     "Aksi",
//                   ].map((header, index, arr) => (
//                     <th
//                       key={header}
//                       className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
//                       style={{
//                         borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
//                         borderTopRightRadius:
//                           index === arr.length - 1 ? "0.5rem" : undefined,
//                       }}
//                     >
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="text-center p-4 text-gray-500 font-medium"
//                     >
//                       Data Tidak Ditemukan
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((item) => (
//                     <tr
//                       key={item.id_presensi}
//                       className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
//                     >
//                       <td className="p-3">{item.id_presensi}</td>
//                       <td className="p-3">{item.id_karyawan}</td>
//                       <td className="p-3">{item.nama_lengkap}</td>
//                       <td className="p-3">{item.no_hp}</td>
//                       <td className="p-3">{item.role}</td>
//                       <td className="p-3">{item.tanggal_bergabung}</td>
//                       <td className="p-3">{item.jumlah_kehadiran}</td>
//                       <td className="p-3">
//                         <div className="flex justify-center gap-2">
//                           <Link
//                             href={`/dashboard/presensi/edit-presensi/${item.id_presensi}`}
//                             className="text-indigo-600 hover:underline"
//                             title="Edit"
//                           >
//                             <Edit size={18} />
//                           </Link>
//                           <button
//                             onClick={() => handleDeleteAction(item.id_presensi)}
//                             className="text-red-600 hover:text-red-800"
//                             title="Hapus"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Ini adalah tempat di mana intercepted route akan di-render */}
//       {children}

//       {/* Modal Tambah Presensi - Akan di-render secara eksplisit jika diaktifkan (misal: jika tanpa intercepting routes) */}
//       <TambahPresensi
//         isOpen={isTambahModalOpen}
//         onClose={handleCloseTambahModal}
//         onAddData={handleAddDataToList}
//         existingDataLength={dataPresensi.length}
//       />
//     </div>
//   );
// };

// export default withAuth(PresensiPage);

// D:\laragon\www\tlogo-putri-fe\src\app\dashboard\akuntansi\presensi\page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import TambahPresensi from "/components/TambahPresensi.jsx"; // Mengimpor komponen modal TambahPresensi
import {
  CalendarDays,
  FileText,
  FileSpreadsheet,
  PlusCircle,
  Edit,
  Trash2,
  RotateCcw,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import Link from "next/link";
import autoTable from "jspdf-autotable";

// Fungsi helper untuk memformat tanggal untuk tampilan (DD-MM-YYYY)
const formatDateToDisplay = (date) => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Komponen utama halaman Presensi
const PresensiPage = ({ children }) => {
  const [dataPresensi, setDataPresensi] = useState([]); // Data mentah dari localStorage
  const [filteredData, setFilteredData] = useState([]); // Data setelah filter tanggal, untuk tabel dan export
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDateForFilter, setSelectedDateForFilter] = useState(null); // Objek Date untuk filter
  const [tempDateForPicker, setTempDateForPicker] = useState(null); // Objek Date untuk DatePicker sementara
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false); // State untuk mengontrol modal TambahPresensi
  const [isLoading, setIsLoading] = useState(true);
  const calendarRef = useRef(null);

  // Contoh data awal jika localStorage kosong
  // id_presensi di sini adalah ID unik untuk setiap BARIS KARYAWAN di tabel ringkasan ini.
  // Bukan ID untuk setiap event presensi harian.
  const exampleData = [
    {
      id_presensi: "PR-001",
      id_karyawan: "K-001",
      nama_lengkap: "Budi Santoso",
      no_hp: "081234567890",
      role: "Driver",
      tanggal_bergabung: "01-01-2023", // Tanggal bergabung karyawan
      jumlah_kehadiran: 20, // Total kehadiran karyawan
    },
    {
      id_presensi: "PR-002",
      id_karyawan: "K-002",
      nama_lengkap: "Siti Aminah",
      no_hp: "081298765432",
      role: "Driver",
      tanggal_bergabung: "15-02-2023",
      jumlah_kehadiran: 18,
    },
  ];

  // Fungsi untuk memuat dan memfilter data dari localStorage
  const loadAndFilterData = () => {
    setIsLoading(true);
    console.log("[PresensiPage] Memuat data presensi...");
    const storedDataString = localStorage.getItem("dataPresensi");
    let currentRawData;
    if (storedDataString) {
      currentRawData = JSON.parse(storedDataString);
      console.log("[PresensiPage] Data dari localStorage:", currentRawData);
    } else {
      currentRawData = exampleData;
      localStorage.setItem("dataPresensi", JSON.stringify(exampleData));
      console.log("[PresensiPage] Menggunakan exampleData (localStorage kosong):", currentRawData);
    }
    setDataPresensi(currentRawData);

    if (selectedDateForFilter) {
      const formattedFilterDate = formatDateToDisplay(selectedDateForFilter);
      console.log("[PresensiPage] Filter tanggal aktif:", formattedFilterDate);
      setFilteredData(
        currentRawData.filter(
          (item) => item.tanggal_bergabung === formattedFilterDate
        )
      );
      console.log("[PresensiPage] Data setelah filter:", currentRawData.filter(
        (item) => item.tanggal_bergabung === formattedFilterDate
      ));
    } else {
      console.log("[PresensiPage] Tidak ada filter tanggal aktif. Menampilkan semua data.");
      setFilteredData(currentRawData);
    }
    setIsLoading(false);
  };

  // Efek samping untuk memuat data saat komponen dimuat dan saat filter tanggal berubah
  useEffect(() => {
    loadAndFilterData();
    // Menambahkan event listener untuk memperbarui data saat ada perubahan dari modal tambah/edit
    const handleDataUpdate = () => loadAndFilterData();
    window.addEventListener("dataPresensiUpdated", handleDataUpdate);
    return () => {
      window.removeEventListener("dataPresensiUpdated", handleDataUpdate);
    };
  }, [selectedDateForFilter]);

  // Fungsi untuk menerapkan filter tanggal
  const applyDateFilter = () => {
    setSelectedDateForFilter(tempDateForPicker);
    setIsDatePickerOpen(false);
  };

  // Fungsi untuk mereset filter tanggal
  const resetFilter = () => {
    setSelectedDateForFilter(null);
    setTempDateForPicker(null);
    setIsDatePickerOpen(false);
  };

  // Fungsi untuk membuka modal TambahPresensi
  const handleOpenTambahModal = () => {
    setIsTambahModalOpen(true);
  };

  // Fungsi untuk menutup modal TambahPresensi
  const handleCloseTambahModal = () => {
    setIsTambahModalOpen(false);
  };

  // Fungsi untuk menambahkan data baru ke daftar (dipanggil dari modal TambahPresensi)
  const handleAddDataToList = (newEntryData) => {
    const storedDataString = localStorage.getItem("dataPresensi");
    let currentData = storedDataString ? JSON.parse(storedDataString) : [];

    // Mencari apakah karyawan dengan id_karyawan yang sama sudah ada di tabel ringkasan
    const existingEmployeeIndex = currentData.findIndex(
      (item) => item.id_karyawan === newEntryData.id_karyawan
    );

    if (existingEmployeeIndex !== -1) {
      // Karyawan sudah ada: update jumlah_kehadiran dan tanggal_bergabung (sebagai tanggal presensi terakhir)
      const updatedEmployee = { ...currentData[existingEmployeeIndex] };
      updatedEmployee.jumlah_kehadiran =
        parseInt(updatedEmployee.jumlah_kehadiran, 10) + 1; // Tambah 1 kehadiran
      updatedEmployee.tanggal_bergabung = newEntryData.tanggal_bergabung; // Update tanggal bergabung ke tanggal presensi terbaru

      currentData[existingEmployeeIndex] = updatedEmployee;
      alert(`Kehadiran untuk ${newEntryData.nama_lengkap} (ID Karyawan: ${newEntryData.id_karyawan}) bertambah menjadi ${updatedEmployee.jumlah_kehadiran}!`);
    } else {
      // Karyawan belum ada: tambahkan sebagai entri baru dengan jumlah_kehadiran 1
      // Temukan ID numerik tertinggi yang sudah ada untuk memastikan keunikan ID Presensi
      const maxIdNum = currentData.reduce((max, item) => {
        const num = parseInt(item.id_presensi.replace('PR-', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);
      const newIdNum = maxIdNum + 1;
      const newIdPresensi = `PR-${newIdNum.toString().padStart(3, "0")}`;

      currentData.push({
        ...newEntryData,
        id_presensi: newIdPresensi, // ID Presensi baru untuk baris ini
        jumlah_kehadiran: 1, // Kehadiran awal adalah 1
      });
      alert(`Data presensi baru untuk ${newEntryData.nama_lengkap} (ID Karyawan: ${newEntryData.id_karyawan}) berhasil ditambahkan! Kehadiran awal: 1.`);
    }

    localStorage.setItem("dataPresensi", JSON.stringify(currentData));
    window.dispatchEvent(new CustomEvent("dataPresensiUpdated")); // Memicu pembaruan di halaman ini
    loadAndFilterData(); // Memuat ulang dan memfilter data
    handleCloseTambahModal(); // Menutup modal
  };

  // Fungsi untuk menghapus data presensi
  const handleDeleteAction = (idPresensi) => {
    if (confirm("Apakah Anda yakin ingin menghapus data presensi ini?")) {
      const updatedRawData = dataPresensi.filter(
        (item) => item.id_presensi !== idPresensi
      );
      localStorage.setItem("dataPresensi", JSON.stringify(updatedRawData));
      window.dispatchEvent(new CustomEvent("dataPresensiUpdated")); // Memicu pembaruan di halaman ini
      loadAndFilterData(); // Memuat ulang dan memfilter data
      alert("Data presensi berhasil dihapus.");
    }
  };

  // Fungsi untuk mendapatkan nama file export
  const getExportFileName = (ext) => {
    const date = new Date().toISOString().split("T")[0];
    return `laporan_presensi_${date}.${ext}`;
  };

  // Fungsi untuk export data ke Excel
  const handleExportExcelAction = () => {
    if (filteredData.length === 0) {
      alert("Data kosong (sesuai filter saat ini), tidak bisa export Excel!");
      return;
    }
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Presensi");
      XLSX.writeFile(wb, getExportFileName("xlsx"));
    } catch (error) {
      console.error("Export Excel error:", error);
      alert("Gagal export Excel!");
    }
  };

  // Fungsi untuk export data ke PDF
  const handleExportPDFAction = () => {
    if (filteredData.length === 0) {
      alert("Data kosong, tidak bisa export PDF!");
      return;
    }
    try {
      const doc = new jsPDF();
      const tableColumn = [
        "ID Presensi",
        "ID Karyawan",
        "Nama Lengkap",
        "No. HP",
        "Role",
        "Tanggal Bergabung",
        "Jumlah Kehadiran",
      ];
      const tableRows = filteredData.map((item) => [
        item.id_presensi,
        item.id_karyawan,
        item.nama_lengkap,
        item.no_hp,
        item.role,
        item.tanggal_bergabung,
        item.jumlah_kehadiran,
      ]);
      doc.text(
        `Laporan Data Presensi ${
          selectedDateForFilter
            ? `(${formatDateToDisplay(selectedDateForFilter)})`
            : "(Sesuai Filter)"
        }`,
        14,
        15
      );
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [61, 108, 185],
        },
      });
      doc.save(getExportFileName("pdf"));
    } catch (error) {
      console.error("Export PDF error:", error);
      alert("Gagal export PDF!");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [calendarRef]);

  return (
    <div className="flex relative bg-white-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
          Presensi
        </h1>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
            {/* Date Picker */}
            <div className="relative" ref={calendarRef}>
              {!selectedDateForFilter ? (
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                >
                  <CalendarDays size={20} /> <span>Pilih Tanggal</span>
                </button>
              ) : (
                <button
                  onClick={resetFilter}
                  className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                >
                  <RotateCcw size={20} /> <span>Set Ulang</span>
                </button>
              )}
              {isDatePickerOpen && (
                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
                  <DatePicker
                    selected={tempDateForPicker}
                    onChange={(date) => setTempDateForPicker(date)}
                    inline
                    dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                  />
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        setTempDateForPicker(selectedDateForFilter);
                        setIsDatePickerOpen(false);
                      }}
                      className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={applyDateFilter}
                      className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white"
                    >
                      Pilih Tanggal
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Tombol Tambah - Membuka modal TambahPresensi secara manual */}
            <button
              onClick={handleOpenTambahModal}
              className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
            >
              <PlusCircle size={20} /> <span>Tambah</span>
            </button>
          </div>
          {/* Tombol Export */}
          <div className="flex gap-4">
            <button
              onClick={handleExportExcelAction}
              disabled={filteredData.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                filteredData.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-100 text-black hover:bg-[#B8D4F9]"
              }`}
            >
              <FileSpreadsheet
                size={20}
                color={filteredData.length === 0 ? "gray" : "green"}
              />{" "}
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportPDFAction}
              disabled={filteredData.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                filteredData.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-red-100 text-black hover:bg-[#B8D4F9]"
              }`}
            >
              <FileText
                size={20}
                color={filteredData.length === 0 ? "gray" : "red"}
              />{" "}
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Tabel */}
        {isLoading ? (
          <div className="text-center p-10">Memuat data presensi...</div>
        ) : (
          <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8">
            <table className="min-w-full table-auto bg-white text-sm">
              <thead className="bg-[#3D6CB9] text-white">
                <tr>
                  {[
                    "ID Presensi",
                    "ID Karyawan",
                    "Nama Lengkap",
                    "No. HP",
                    "Role",
                    "Tanggal Bergabung",
                    "Jumlah Kehadiran",
                    "Aksi",
                  ].map((header, index, arr) => (
                    <th
                      key={header}
                      className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
                      style={{
                        borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
                        borderTopRightRadius:
                          index === arr.length - 1 ? "0.5rem" : undefined,
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center p-4 text-gray-500 font-medium"
                    >
                      Data Tidak Ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    // Pastikan item dan item.id_presensi ada sebelum merender
                    if (!item || !item.id_presensi) {
                      console.error("[PresensiPage] Item tidak valid atau missing id_presensi, melewatkan baris:", item);
                      return null; // Jangan render baris ini jika item tidak valid
                    }
                    return (
                      <tr
                        key={item.id_presensi} // Menggunakan id_presensi sebagai key
                        className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                      >
                        <td className="p-3">{item.id_presensi}</td>
                        <td className="p-3">{item.id_karyawan}</td>
                        <td className="p-3">{item.nama_lengkap}</td>
                        <td className="p-3">{item.no_hp}</td>
                        <td className="p-3">{item.role}</td>
                        <td className="p-3">{item.tanggal_bergabung}</td>
                        <td className="p-3">{item.jumlah_kehadiran}</td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <Link
                              href={`/dashboard/akuntansi/presensi/edit-presensi/${item.id_presensi}`}
                              className="text-indigo-600 hover:underline"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => handleDeleteAction(item.id_presensi)}
                              className="text-red-600 hover:text-red-800"
                              title="Hapus"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Presensi - Dirender secara eksplisit */}
      <TambahPresensi
        isOpen={isTambahModalOpen}
        onClose={handleCloseTambahModal}
        onAddData={handleAddDataToList}
      />

      {/* Ini adalah slot untuk Intercepting Route. Ini harus ada! */}
      {children}
    </div>
  );
};

export default withAuth(PresensiPage);
