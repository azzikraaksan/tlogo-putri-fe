// "use client";

// import { useState, useRef, useEffect } from "react";
// import Sidebar from "/components/Sidebar.jsx"; 
// import UserMenu from "/components/Pengguna.jsx"; 
// import withAuth from "/src/app/lib/withAuth"; 
// import TambahPengeluaran from "/components/TambahPengeluaran.jsx"; 
// import {
//   CalendarDays, FileText, FileSpreadsheet, PlusCircle,
//   Edit, Trash2, RotateCcw,
// } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// // import "jspdf-autotable";
// import Link from "next/link";
// import autoTable from "jspdf-autotable";

// const formatDateToDisplay = (date) => {
//     if (!date) return "";
//     const d = date instanceof Date ? date : new Date(date);
//     if (isNaN(d.getTime())) return ""; 
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
// };

// const PengeluaranPage = () => {
//   const [dataPengeluaran, setDataPengeluaran] = useState([]); // Data mentah dari localStorage
//   const [filteredData, setFilteredData] = useState([]); // Data setelah filter tanggal, untuk tabel dan export
//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [selectedDateForFilter, setSelectedDateForFilter] = useState(null); // Objek Date untuk filter
//   const [tempDateForPicker, setTempDateForPicker] = useState(null); // Objek Date untuk DatePicker sementara
//   const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const calendarRef = useRef(null);
//   // const router = useRouter();

//   const exampleData = [
//     { idPengeluaran: "PG-001", idPenggajian: "GJ-001", tglPengeluaran: "17-05-2025", total: "Rp 2.500.000", keterangan: "Pembelian alat kantor" },
//     { idPengeluaran: "PG-002", idPenggajian: "GJ-002", tglPengeluaran: "18-05-2025", total: "Rp 5.000.000", keterangan: "Gaji karyawan" },
//     { idPengeluaran: "PG-003", idPenggajian: "GJ-003", tglPengeluaran: "19-05-2025", total: "Rp 1.200.000", keterangan: "Maintenance server" },
//     { idPengeluaran: "PG-004", idPenggajian: "GJ-004", tglPengeluaran: "20-05-2025", total: "Rp 3.000.000", keterangan: "Pembelian peralatan" },
//     { idPengeluaran: "PG-005", idPenggajian: "GJ-005", tglPengeluaran: "21-05-2025", total: "Rp 4.500.000", keterangan: "Pembelian perlengkapan" },
//     { idPengeluaran: "PG-006", idPenggajian: "GJ-006", tglPengeluaran: "22-05-2025", total: "Rp 6.000.000", keterangan: "Pembelian perlengkapan" },
//     { idPengeluaran: "PG-007", idPenggajian: "GJ-007", tglPengeluaran: "23-05-2025", total: "Rp 7.500.000", keterangan: "Pembelian perlengkapan" },
//     { idPengeluaran: "PG-008", idPenggajian: "GJ-008", tglPengeluaran: "24-05-2025", total: "Rp 8.000.000", keterangan: "Pembelian perlengkapan" },
//     { idPengeluaran: "PG-009", idPenggajian: "GJ-009", tglPengeluaran: "25-05-2025", total: "Rp 9.000.000", keterangan: "Pembelian perlengkapan" },
//     { idPengeluaran: "PG-010", idPenggajian: "GJ-010", tglPengeluaran: "26-05-2025", total: "Rp 10.000.000", keterangan: "Pembelian perlengkapan" }
//   ];

//   const loadAndFilterData = () => {
//     setIsLoading(true);
//     const storedDataString = localStorage.getItem("dataPengeluaran");
//     let currentRawData;
//     if (storedDataString) {
//       currentRawData = JSON.parse(storedDataString);
//     } else {
//       currentRawData = exampleData;
//       localStorage.setItem("dataPengeluaran", JSON.stringify(exampleData));
//     }
//     setDataPengeluaran(currentRawData);

//     if (selectedDateForFilter) {
//       const formattedFilterDate = formatDateToDisplay(selectedDateForFilter);
//       setFilteredData(currentRawData.filter(item => item.tglPengeluaran === formattedFilterDate));
//     } else {
//       setFilteredData(currentRawData); 
//     }
//     setIsLoading(false);
//   };
  
//   useEffect(() => {
//     loadAndFilterData();
//     const handleDataUpdate = () => loadAndFilterData();
//     window.addEventListener('dataPengeluaranUpdated', handleDataUpdate);
//     return () => {
//       window.removeEventListener('dataPengeluaranUpdated', handleDataUpdate);
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
//     const updatedRawData = [...dataPengeluaran, newData];
//     localStorage.setItem("dataPengeluaran", JSON.stringify(updatedRawData));
//     window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated')); 
//     loadAndFilterData(); 
//     handleCloseTambahModal(); 
//     alert("Data baru berhasil ditambahkan!");
//   };

//   const handleEditAction = (idPengeluaran) => {
//     router.push(`/akuntansi/pengeluaran/edit-pengeluaran/${idPengeluaran}`);
//   };

//   const handleDeleteAction = (idPengeluaran) => {
//     if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
//       const updatedRawData = dataPengeluaran.filter(item => item.idPengeluaran !== idPengeluaran);
//       localStorage.setItem("dataPengeluaran", JSON.stringify(updatedRawData));
//       window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
//       loadAndFilterData(); 
//       alert("Data berhasil dihapus.");
//     }
//   };
// const getExportFileName = (ext) => {
//   const date = new Date().toISOString().split("T")[0];
//   return `laporan_pengeluaran_${date}.${ext}`;
// };

//   const handleExportExcelAction = () => {
//     if (filteredData.length === 0) {
//       alert("Data kosong (sesuai filter saat ini), tidak bisa export Excel!");
//       return;
//     }
//     try {
//       const ws = XLSX.utils.json_to_sheet(filteredData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Pengeluaran");
//       XLSX.writeFile(wb, getExportFileName("xlsx"));
//     } catch (error) {
//       console.error("Export Excel error:", error);
//       alert("Gagal export Excel!");
//     }
//   };

//     const handleExportPDFAction = () => {
//     if (filteredData.length === 0) {
//       alert("Data kosong, tidak bisa export PDF!");
//       return;
//     }
//     try {
//       const doc = new jsPDF();
//       const tableColumn = [
//         "ID Pengeluaran",
//         "ID Penggajian",
//         "Tanggal Pengeluaran",
//         "Total",
//         "Keterangan",
//       ];
//       const tableRows = filteredData.map((item) => [
//         item.idPengeluaran,
//         item.idPenggajian,
//         item.tglPengeluaran,
//         item.total,
//         item.keterangan,
//       ]);
//       // doc.autoTable({ head: [tableColumn], body: tableRows }); // Bagian ini masih error pas mau di-export
//       doc.text(`Laporan Data Pengeluaran ${selectedDateForFilter ? `(${formatDateToDisplay(selectedDateForFilter)})` : '(Sesuai Filter)'}`, 14, 15);
//       autoTable(doc,{
//         head: [tableColumn],
//         body: tableRows,
//         startY: 20,
//         styles: {
//           fontSize: 8,
//           cellPadding: 2
//         },
//         headStyles: {
//           fillColor: [61, 108, 185]
//         }
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
//       if (calendarRef.current && !calendarRef.current.contains(event.target)) {
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
//           Pengeluaran
//         </h1>

//         {/* Toolbar - Struktur dan kelas disamakan dengan kode asli */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
//           <div className="flex gap-4">
//             {/* Date Picker */}
//             <div className="relative" ref={calendarRef}>
//               {!selectedDateForFilter ? (
//                 <button onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black">
//                   <CalendarDays size={20} /> <span>Pilih Tanggal</span>
//                 </button>
//               ) : (
//                 <button onClick={resetFilter} className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black">
//                   <RotateCcw size={20} /> <span>Set Ulang</span>
//                 </button>
//               )}
//               {isDatePickerOpen && (
//                 <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
//                   <DatePicker selected={tempDateForPicker} onChange={(date) => setTempDateForPicker(date)} inline dateFormat="dd/MM/yyyy" showPopperArrow={false} />
//                   <div className="mt-4 flex justify-between">
//                     <button onClick={() => { setTempDateForPicker(selectedDateForFilter); setIsDatePickerOpen(false);}} className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white">
//                       Batal
//                     </button>
//                     <button onClick={applyDateFilter} className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white">
//                       Pilih Tanggal
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//             {/* Tombol Tambah */}
//             <button onClick={handleOpenTambahModal} className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black">
//               <PlusCircle size={20} /> <span>Tambah</span>
//             </button>
//           </div>
//           {/* Tombol Export */}
//           <div className="flex gap-4">
//             <button onClick={handleExportExcelAction} disabled={filteredData.length === 0}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${filteredData.length === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-100 text-black hover:bg-[#B8D4F9]"}`}>
//               <FileSpreadsheet size={20} color={filteredData.length === 0 ? "gray" : "green"} /> <span>Export Excel</span>
//             </button>
//             <button onClick={handleExportPDFAction} disabled={filteredData.length === 0}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${filteredData.length === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-red-100 text-black hover:bg-[#B8D4F9]"}`}>
//               <FileText size={20} color={filteredData.length === 0 ? "gray" : "red"} /> <span>Export PDF</span>
//             </button>
//           </div>
//         </div>

        
//         {/* Tabel - Struktur dan kelas disamakan dengan kode asli */}
//         {isLoading ? (
//             <div className="text-center p-10">Memuat data pengeluaran...</div>
//         ) : (
//           <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8"> {/* max-h dari kode asli */}
//             <table className="min-w-full table-auto bg-white text-sm">
//               <thead className="bg-[#3D6CB9] text-white">
//                 <tr>
//                   {["ID Pengeluaran", "ID Penggajian", "Tanggal Pengeluaran", "Total", "Keterangan", "Aksi"]
//                   .map((header, index, arr) => (
//                     <th key={header} className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
//                       style={{ borderTopLeftRadius: index === 0 ? "0.5rem" : undefined, borderTopRightRadius: index === arr.length - 1 ? "0.5rem" : undefined }}>
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length === 0 ? (
//                   <tr><td colSpan={6} className="text-center p-4 text-gray-500 font-medium">Data Tidak Ditemukan</td></tr>
//                 ) : (
//                   filteredData.map((item) => (
//                     <tr key={item.idPengeluaran} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200">
//                       <td className="p-3">{item.idPengeluaran}</td>
//                       <td className="p-3">{item.idPenggajian}</td>
//                       <td className="p-3">{item.tglPengeluaran}</td>
//                       <td className="p-3">{item.total}</td>
//                       <td className="p-3">{item.keterangan}</td>
//                       <td className="p-3">
//                         <div className="flex justify-center gap-2">
//                             <Link
//                             href={`/dashboard/akuntansi/pengeluaran/edit-pengeluaran/${item.idPengeluaran}`} 
//                             className="text-indigo-600 hover:underline"
//                             >
//                             <Edit size={18} />
//                             </Link>
//                           <button onClick={() => handleDeleteAction(item.idPengeluaran)} className="text-red-600 hover:text-red-800" title="Hapus"><Trash2 size={18} /></button>
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

//       {/* Modal Tambah Pengeluaran */}
//       <TambahPengeluaran
//         isOpen={isTambahModalOpen}
//         onClose={handleCloseTambahModal}
//         onAddData={handleAddDataToList}
//         existingDataLength={dataPengeluaran.length}
//         initialDate={new Date()}
//       />
//     </div>
//   );
// };

// export default withAuth(PengeluaranPage);

// src/app/dashboard/akuntansi/pengeluaran/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
// useRouter tidak lagi diperlukan secara eksplisit karena Link component menangani navigasi
// import { useRouter } from "next/navigation"; // Hapus ini karena tidak lagi digunakan secara langsung
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import TambahPengeluaran from "/components/TambahPengeluaran.jsx";
import {
    CalendarDays, FileText, FileSpreadsheet, PlusCircle,
    Edit, Trash2, RotateCcw,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import Link from "next/link";
import autoTable from "jspdf-autotable"; // Pastikan ini diimpor jika menggunakan autoTable

const formatDateToDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Pastikan komponen ini menerima 'children' untuk Intercepting Routes
const PengeluaranPage = ({ children }) => {
    const [dataPengeluaran, setDataPengeluaran] = useState([]); // Data mentah dari localStorage
    const [filteredData, setFilteredData] = useState([]); // Data setelah filter tanggal, untuk tabel dan export
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDateForFilter, setSelectedDateForFilter] = useState(null); // Objek Date untuk filter
    const [tempDateForPicker, setTempDateForPicker] = useState(null); // Objek Date untuk DatePicker sementara
    const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const calendarRef = useRef(null);
    // const router = useRouter(); // Sudah dikomentari, bagus. Hapus baris ini sepenuhnya jika tidak dibutuhkan.

    const exampleData = [
        { idPengeluaran: "PG-001", idPenggajian: "GJ-001", tglPengeluaran: "17-05-2025", total: "Rp 2.500.000", keterangan: "Pembelian alat kantor" },
        { idPengeluaran: "PG-002", idPenggajian: "GJ-002", tglPengeluaran: "18-05-2025", total: "Rp 5.000.000", keterangan: "Gaji karyawan" },
        { idPengeluaran: "PG-003", idPenggajian: "GJ-003", tglPengeluaran: "19-05-2025", total: "Rp 1.200.000", keterangan: "Maintenance server" },
        { idPengeluaran: "PG-004", idPenggajian: "GJ-004", tglPengeluaran: "20-05-2025", total: "Rp 3.000.000", keterangan: "Pembelian peralatan" },
        { idPengeluaran: "PG-005", idPenggajian: "GJ-005", tglPengeluaran: "21-05-2025", total: "Rp 4.500.000", keterangan: "Pembelian perlengkapan" },
        { idPengeluaran: "PG-006", idPenggajian: "GJ-006", tglPengeluaran: "22-05-2025", total: "Rp 6.000.000", keterangan: "Pembelian perlengkapan" },
        { idPengeluaran: "PG-007", idPenggajian: "GJ-007", tglPengeluaran: "23-05-2025", total: "Rp 7.500.000", keterangan: "Pembelian perlengkapan" },
        { idPengeluaran: "PG-008", idPenggajian: "GJ-008", tglPengeluaran: "24-05-2025", total: "Rp 8.000.000", keterangan: "Pembelian perlengkapan" },
        { idPengeluaran: "PG-009", idPenggajian: "GJ-009", tglPengeluaran: "25-05-2025", total: "Rp 9.000.000", keterangan: "Pembelian perlengkapan" },
        { idPengeluaran: "PG-010", idPenggajian: "GJ-010", tglPengeluaran: "26-05-2025", total: "Rp 10.000.000", keterangan: "Pembelian perlengkapan" }
    ];

    const loadAndFilterData = () => {
        setIsLoading(true);
        const storedDataString = localStorage.getItem("dataPengeluaran");
        let currentRawData;
        if (storedDataString) {
            currentRawData = JSON.parse(storedDataString);
        } else {
            currentRawData = exampleData;
            localStorage.setItem("dataPengeluaran", JSON.stringify(exampleData));
        }
        setDataPengeluaran(currentRawData);

        if (selectedDateForFilter) {
            const formattedFilterDate = formatDateToDisplay(selectedDateForFilter);
            setFilteredData(currentRawData.filter(item => item.tglPengeluaran === formattedFilterDate));
        } else {
            setFilteredData(currentRawData);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadAndFilterData();
        const handleDataUpdate = () => loadAndFilterData();
        window.addEventListener('dataPengeluaranUpdated', handleDataUpdate);
        return () => {
            window.removeEventListener('dataPengeluaranUpdated', handleDataUpdate);
        };
    }, [selectedDateForFilter]);


    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker);
        setIsDatePickerOpen(false);
    };

    const resetFilter = () => {
        setSelectedDateForFilter(null);
        setTempDateForPicker(null);
        setIsDatePickerOpen(false);
    };

    const handleOpenTambahModal = () => {
        setIsTambahModalOpen(true);
    };

    const handleCloseTambahModal = () => {
        setIsTambahModalOpen(false);
    };

    const handleAddDataToList = (newData) => {
        const updatedRawData = [...dataPengeluaran, newData];
        localStorage.setItem("dataPengeluaran", JSON.stringify(updatedRawData));
        window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
        loadAndFilterData();
        handleCloseTambahModal();
        alert("Data baru berhasil ditambahkan!");
    };

    // handleEditAction tidak lagi diperlukan karena sudah menggunakan Link component
    // const handleEditAction = (idPengeluaran) => {
    //   router.push(`/akuntansi/pengeluaran/edit-pengeluaran/${idPengeluaran}`);
    // };

    const handleDeleteAction = (idPengeluaran) => {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            const updatedRawData = dataPengeluaran.filter(item => item.idPengeluaran !== idPengeluaran);
            localStorage.setItem("dataPengeluaran", JSON.stringify(updatedRawData));
            window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
            loadAndFilterData();
            alert("Data berhasil dihapus.");
        }
    };
    const getExportFileName = (ext) => {
        const date = new Date().toISOString().split("T")[0];
        return `laporan_pengeluaran_${date}.${ext}`;
    };

    const handleExportExcelAction = () => {
        if (filteredData.length === 0) {
            alert("Data kosong (sesuai filter saat ini), tidak bisa export Excel!");
            return;
        }
        try {
            const ws = XLSX.utils.json_to_sheet(filteredData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pengeluaran");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Export Excel error:", error);
            alert("Gagal export Excel!");
        }
    };

    const handleExportPDFAction = () => {
        if (filteredData.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF();
            const tableColumn = [
                "ID Pengeluaran",
                "ID Penggajian",
                "Tanggal Pengeluaran",
                "Total",
                "Keterangan",
            ];
            const tableRows = filteredData.map((item) => [
                item.idPengeluaran,
                item.idPenggajian,
                item.tglPengeluaran,
                item.total,
                item.keterangan,
            ]);
            doc.text(`Laporan Data Pengeluaran ${selectedDateForFilter ? `(${formatDateToDisplay(selectedDateForFilter)})` : '(Sesuai Filter)'}`, 14, 15);
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: {
                    fontSize: 8,
                    cellPadding: 2
                },
                headStyles: {
                    fillColor: [61, 108, 185]
                }
            });
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            console.error("Export PDF error:", error);
            alert("Gagal export PDF!");
        }
    };

    // Menutup date picker jika klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
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
                    Pengeluaran
                </h1>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex gap-4">
                        {/* Date Picker */}
                        <div className="relative" ref={calendarRef}>
                            {!selectedDateForFilter ? (
                                <button onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black">
                                    <CalendarDays size={20} /> <span>Pilih Tanggal</span>
                                </button>
                            ) : (
                                <button onClick={resetFilter} className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black">
                                    <RotateCcw size={20} /> <span>Set Ulang</span>
                                </button>
                            )}
                            {isDatePickerOpen && (
                                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
                                    <DatePicker selected={tempDateForPicker} onChange={(date) => setTempDateForPicker(date)} inline dateFormat="dd/MM/yyyy" showPopperArrow={false} />
                                    <div className="mt-4 flex justify-between">
                                        <button onClick={() => { setTempDateForPicker(selectedDateForFilter); setIsDatePickerOpen(false); }} className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white">
                                            Batal
                                        </button>
                                        <button onClick={applyDateFilter} className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white">
                                            Pilih Tanggal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Tombol Tambah */}
                        <button onClick={handleOpenTambahModal} className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black">
                            <PlusCircle size={20} /> <span>Tambah</span>
                        </button>
                    </div>
                    {/* Tombol Export */}
                    <div className="flex gap-4">
                        <button onClick={handleExportExcelAction} disabled={filteredData.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${filteredData.length === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-100 text-black hover:bg-[#B8D4F9]"}`}>
                            <FileSpreadsheet size={20} color={filteredData.length === 0 ? "gray" : "green"} /> <span>Export Excel</span>
                        </button>
                        <button onClick={handleExportPDFAction} disabled={filteredData.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${filteredData.length === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-red-100 text-black hover:bg-[#B8D4F9]"}`}>
                            <FileText size={20} color={filteredData.length === 0 ? "gray" : "red"} /> <span>Export PDF</span>
                        </button>
                    </div>
                </div>


                {/* Tabel */}
                {isLoading ? (
                    <div className="text-center p-10">Memuat data pengeluaran...</div>
                ) : (
                    <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8">
                        <table className="min-w-full table-auto bg-white text-sm">
                            <thead className="bg-[#3D6CB9] text-white">
                                <tr>
                                    {["ID Pengeluaran", "ID Penggajian", "Tanggal Pengeluaran", "Total", "Keterangan", "Aksi"]
                                        .map((header, index, arr) => (
                                            <th key={header} className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
                                                style={{ borderTopLeftRadius: index === 0 ? "0.5rem" : undefined, borderTopRightRadius: index === arr.length - 1 ? "0.5rem" : undefined }}>
                                                {header}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center p-4 text-gray-500 font-medium">Data Tidak Ditemukan</td></tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.idPengeluaran} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200">
                                            <td className="p-3">{item.idPengeluaran}</td>
                                            <td className="p-3">{item.idPenggajian}</td>
                                            <td className="p-3">{item.tglPengeluaran}</td>
                                            <td className="p-3">{item.total}</td>
                                            <td className="p-3">{item.keterangan}</td>
                                            <td className="p-3">
                                                <div className="flex justify-center gap-2">
                                                    {/* Menggunakan Link Next.js untuk navigasi ke halaman edit */}
                                                    <Link
                                                        href={`/dashboard/akuntansi/pengeluaran/edit-pengeluaran/${item.idPengeluaran}`}
                                                        className="text-indigo-600 hover:underline"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button onClick={() => handleDeleteAction(item.idPengeluaran)} className="text-red-600 hover:text-red-800" title="Hapus"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Tambah Pengeluaran */}
            <TambahPengeluaran
                isOpen={isTambahModalOpen}
                onClose={handleCloseTambahModal}
                onAddData={handleAddDataToList}
                existingDataLength={dataPengeluaran.length}
                initialDate={new Date()}
            />

            {/* Inilah slot untuk Intercepting Route. Ini harus ada! */}
            {children}
        </div>
    );
};

// Pastikan `withAuth` menerima 'children' juga jika itu adalah HOC (Higher-Order Component)
export default withAuth(PengeluaranPage);