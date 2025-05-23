// "use client";
// import { useState, useRef, useEffect } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import {
//   CalendarDays,
//   FileText,
//   FileSpreadsheet,
//   PlusCircle,
//   Edit,
//   Trash2,
// } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const HarianPage = () => {
//   const [dataHarian, setDataHarian] = useState([
//     {
//       idLaporanHarian: "LH001",
//       idPemesanan: "PMS001",
//       idGaji: "GJ001",
//       noLB: "LB001",
//       paket: "Tour Bromo",
//       keterangan: "Berangkat tepat waktu",
//       kode: "K001",
//       marketing: "Dina",
//       kas: "500000",
//       opp: "OPP001",
//       driverBayar: "300000",
//       totalKas: "800000",
//       jumlah: "2",
//       harga: "150000",
//       driverTerima: "300000",
//       tamuBayar: "500000",
//       tunai: "400000",
//       debit: "100000",
//       waktuTiba: "08:00",
//     },
//     {
//       idLaporanHarian: "LH002",
//       idPemesanan: "PMS002",
//       idGaji: "GJ002",
//       noLB: "LB002",
//       paket: "Tour Merapi",
//       keterangan: "Cuaca cerah",
//       kode: "K002",
//       marketing: "Rudi",
//       kas: "450000",
//       opp: "OPP002",
//       driverBayar: "250000",
//       totalKas: "700000",
//       jumlah: "3",
//       harga: "100000",
//       driverTerima: "250000",
//       tamuBayar: "450000",
//       tunai: "300000",
//       debit: "150000",
//       waktuTiba: "09:00",
//     },
//     {
//       idLaporanHarian: "LH003",
//       idPemesanan: "PMS003",
//       idGaji: "GJ003",
//       noLB: "LB003",
//       paket: "Tour Bromo",
//       keterangan: "Berangkat tepat waktu",
//       kode: "K001",
//       marketing: "Dina",
//       kas: "500000",
//       opp: "OPP001",
//       driverBayar: "300000",
//       totalKas: "800000",
//       jumlah: "2",
//       harga: "150000",
//       driverTerima: "300000",
//       tamuBayar: "500000",
//       tunai: "400000",
//       debit: "100000",
//       waktuTiba: "08:00",
//     },
//     {
//       idLaporanHarian: "LH004",
//       idPemesanan: "PMS004",
//       idGaji: "GJ004",
//       noLB: "LB004",
//       paket: "Tour Merapi",
//       keterangan: "Cuaca cerah",
//       kode: "K002",
//       marketing: "Rudi",
//       kas: "450000",
//       opp: "OPP002",
//       driverBayar: "250000",
//       totalKas: "700000",
//       jumlah: "3",
//       harga: "100000",
//       driverTerima: "250000",
//       tamuBayar: "450000",
//       tunai: "300000",
//       debit: "150000",
//       waktuTiba: "09:00",
//     },
//     {
//       idLaporanHarian: "LH005",
//       idPemesanan: "PMS005",
//       idGaji: "GJ005",
//       noLB: "LB005",
//       paket: "Tour Bromo",
//       keterangan: "Berangkat tepat waktu",
//       kode: "K001",
//       marketing: "Dina",
//       kas: "500000",
//       opp: "OPP001",
//       driverBayar: "300000",
//       totalKas: "800000",
//       jumlah: "2",
//       harga: "150000",
//       driverTerima: "300000",
//       tamuBayar: "500000",
//       tunai: "400000",
//       debit: "100000",
//       waktuTiba: "08:00",
//     },
//     {
//       idLaporanHarian: "LH006",
//       idPemesanan: "PMS006",
//       idGaji: "GJ006",
//       noLB: "LB006",
//       paket: "Tour Merapi",
//       keterangan: "Cuaca cerah",
//       kode: "K002",
//       marketing: "Rudi",
//       kas: "450000",
//       opp: "OPP002",
//       driverBayar: "250000",
//       totalKas: "700000",
//       jumlah: "3",
//       harga: "100000",
//       driverTerima: "250000",
//       tamuBayar: "450000",
//       tunai: "300000",
//       debit: "150000",
//       waktuTiba: "09:00",
//     },
//     {
//       idLaporanHarian: "LH007",
//       idPemesanan: "PMS007",
//       idGaji: "GJ007",
//       noLB: "LB007",
//       paket: "Tour Bromo",
//       keterangan: "Berangkat tepat waktu",
//       kode: "K001",
//       marketing: "Dina",
//       kas: "500000",
//       opp: "OPP001",
//       driverBayar: "300000",
//       totalKas: "800000",
//       jumlah: "2",
//       harga: "150000",
//       driverTerima: "300000",
//       tamuBayar: "500000",
//       tunai: "400000",
//       debit: "100000",
//       waktuTiba: "08:00",
//     },
//     {
//       idLaporanHarian: "LH008",
//       idPemesanan: "PMS008",
//       idGaji: "GJ008",
//       noLB: "LB008",
//       paket: "Tour Merapi",
//       keterangan: "Cuaca cerah",
//       kode: "K002",
//       marketing: "Rudi",
//       kas: "450000",
//       opp: "OPP002",
//       driverBayar: "250000",
//       totalKas: "700000",
//       jumlah: "3",
//       harga: "100000",
//       driverTerima: "250000",
//       tamuBayar: "450000",
//       tunai: "300000",
//       debit: "150000",
//       waktuTiba: "09:00",
//     },
//     {
//       idLaporanHarian: "LH009",
//       idPemesanan: "PMS009",
//       idGaji: "GJ009",
//       noLB: "LB009",
//       paket: "Tour Bromo",
//       keterangan: "Berangkat tepat waktu",
//       kode: "K001",
//       marketing: "Dina",
//       kas: "500000",
//       opp: "OPP001",
//       driverBayar: "300000",
//       totalKas: "800000",
//       jumlah: "2",
//       harga: "150000",
//       driverTerima: "300000",
//       tamuBayar: "500000",
//       tunai: "400000",
//       debit: "100000",
//       waktuTiba: "08:00",
//     },
//   ]);

//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [formData, setFormData] = useState({
//     idLaporanHarian: "",
//     idPemesanan: "",
//     idGaji: "",
//     noLB: "",
//     paket: "",
//     keterangan: "",
//     kode: "",
//     marketing: "",
//     kas: "",
//     opp: "",
//     driverBayar: "",
//     totalKas: "",
//     jumlah: "",
//     harga: "",
//     driverTerima: "",
//     tamuBayar: "",
//     tunai: "",
//     debit: "",
//     waktuTiba: "",
//   });

//   const calendarRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (calendarRef.current && !calendarRef.current.contains(event.target)) {
//         setIsDatePickerOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setIsDatePickerOpen(false);
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setDataHarian([...dataHarian, formData]);
//     setShowFormModal(false);
//     setFormData({
//       idLaporanHarian: "",
//       idPemesanan: "",
//       idGaji: "",
//       noLB: "",
//       paket: "",
//       keterangan: "",
//       kode: "",
//       marketing: "",
//       kas: "",
//       opp: "",
//       driverBayar: "",
//       totalKas: "",
//       jumlah: "",
//       harga: "",
//       driverTerima: "",
//       tamuBayar: "",
//       tunai: "",
//       debit: "",
//       waktuTiba: "",
//     });
//   };

//   const handleDelete = (index) => {
//     const newData = [...dataHarian];
//     newData.splice(index, 1);
//     setDataHarian(newData);
//   };

//   return (
//     <div className="flex relative bg-white-50 min-h-screen">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6 relative overflow-y-auto">
//         <h1 className="text-[32px] font-bold mb-6 text-black">Harian</h1>

//         {/* Toolbar */} 
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex gap-4 items-center">
//             {/* Pilih Tanggal */}
//             <div className="relative">
//               <button
//                 onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
//                 className="flex items-center gap-2 bg-[#3D6CB9] text-black-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow text-white"
//               >
//                 <CalendarDays size={24} />
//                 <span className="text-base font-medium">
//                   {selectedDate
//                     ? selectedDate.toLocaleDateString("id-ID", {
//                         day: "2-digit",
//                         month: "long",
//                         year: "numeric",
//                       })
//                     : "Pilih Tanggal"}
//                 </span>
//               </button>
//               {isDatePickerOpen && (
//                 <div
//                   ref={calendarRef}
//                   className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12"
//                 >
//                   <DatePicker
//                     selected={selectedDate}
//                     onChange={handleDateChange}
//                     inline
//                     dateFormat="dd/MM/yyyy"
//                     showPopperArrow={false}
//                   />
//                   {/* Button Pilih dan Batal */}
//                   <div className="mt-4 flex justify-between">
//                     <button
//                       onClick={() => setIsDatePickerOpen(false)}
//                       className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
//                     >
//                       Batal
//                     </button>
//                     <button
//                       onClick={() => handleDateChange(selectedDate)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                       Pilih Tanggal
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => setShowFormModal(true)}
//               className="flex items-center gap-2 bg-[#3D6CB9] text-black hover:bg-blue-500 px-4 py-2 rounded-lg shadow text-white"
//             >
//               <PlusCircle size={20} />
//               Tambah
//             </button>
//           </div>

//           {/* Tombol Export */}
//           <div className="flex gap-4 justify-end">
//             <button className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg shadow">
//               <FileSpreadsheet size={18} color="green" />
//               <span className="text-base font-medium text-black">
//                 Export Excel
//               </span>
//             </button>
//             <button className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg shadow">
//               <FileText size={18} color="red" />
//               <span className="text-base font-medium text-black">
//                 Export PDF
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* Tabel Data Pemasukan */}
//         <div className="mt-8">
//           <div className="flex justify-end items-center mb-4">
//             <button className="text-[#3D6CB9] hover:text-blue-800 text-base font-medium">
//               Lihat Semua
//             </button>
//           </div>

//           <div className="rounded-lg overflow-hidden shadow overflow-x-auto">
//             <table className="min-w-full table-auto bg-white text-sm">
//               <thead className="bg-[#3D6CB9] text-white">
//                 <tr>
//                   {[
//                     "ID Laporan Harian",
//                     "ID Pemesanan",
//                     "ID Gaji",
//                     "No LB",
//                     "Paket",
//                     "Keterangan",
//                     "Kode",
//                     "Marketing",
//                     "Kas",
//                     "OPP",
//                     "Driver Bayar",
//                     "Total Kas",
//                     "Jumlah",
//                     "Harga",
//                     "Driver Terima",
//                     "Tamu Bayar",
//                     "Tunai",
//                     "Debit",
//                     "Waktu Tiba",
//                     "Aksi",
//                   ].map((header) => (
//                     <th key={header} className="p-2 text-center">
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {dataHarian.map((item, index) => (
//                   <tr key={index} className="border-b hover:bg-blue-50">
//                     {Object.values(item).map((value, i) => (
//                       <td key={i} className="p-2">
//                         {value}
//                       </td>
//                     ))}
//                     <td className="p-4 flex gap-4">
//                       <button className="text-blue-500 hover:text-blue-800">
//                         <Edit size={20} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(index)}
//                         className="text-red-800 hover:text-red-800"
//                       >
//                         <Trash2 size={20} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {showFormModal && (
//         <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg w-2/3 max-h-screen overflow-y-auto">
//             <h2 className="text-2xl font-semibold text-blue-600 mb-6">
//               Tambah Laporan Harian
//             </h2>
//             <form onSubmit={handleFormSubmit}>
//               <div className="grid grid-cols-2 gap-6">
//                 {Object.keys(formData).map((key) => (
//                   <div key={key}>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                       {key.replace(/([A-Z])/g, " $1").toUpperCase()}
//                     </label>
//                     <input
//                       type="text"
//                       name={key}
//                       value={formData[key]}
//                       onChange={handleFormChange}
//                       className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-6 flex justify-end gap-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowFormModal(false)}
//                   className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   Simpan
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default withAuth(HarianPage);

// D:\laragon\www\tlogo-putri-fe\src\app\dashboard\akuntansi\laporan-keuangan\harian\page.jsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react"; // Import useRef
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import TambahHarian from "/components/TambahHarian.jsx"; // Mengimpor komponen modal TambahHarian
import withAuth from "/src/app/lib/withAuth"; // Pastikan path ini benar
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

// Komponen utama halaman Laporan Harian
const HarianPage = ({ children }) => { // Menerima `children` untuk slot Intercepting Routes
  const [dataHarian, setDataHarian] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDateForFilter, setSelectedDateForFilter] = useState(null);
  const [tempDateForPicker, setTempDateForPicker] = useState(null);
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const calendarRef = useRef(null);

  // Contoh data awal jika localStorage kosong
  const exampleData = [
    {
      idLaporanHarian: "LH001",
      tanggal_transaksi: "24-05-2025",
      idPemesanan: "PMS001",
      idGaji: "GJ001",
      noLB: "LB001",
      paket: "Tour Bromo",
      keterangan: "Berangkat tepat waktu",
      kode: "K001",
      marketing: "Dina",
      kas: "500000",
      opp: "OPP001",
      driverBayar: "300000",
      totalKas: "800000",
      jumlah: "2",
      harga: "150000",
      driverTerima: "300000",
      tamuBayar: "500000",
      tunai: "400000",
      debit: "100000",
      waktuTiba: "08:00",
    },
    {
      idLaporanHarian: "LH002",
      tanggal_transaksi: "24-05-2025",
      idPemesanan: "PMS002",
      idGaji: "GJ002",
      noLB: "LB002",
      paket: "Tour Merapi",
      keterangan: "Cuaca cerah",
      kode: "K002",
      marketing: "Rudi",
      kas: "450000",
      opp: "OPP002",
      driverBayar: "250000",
      totalKas: "700000",
      jumlah: "3",
      harga: "100000",
      driverTerima: "250000",
      tamuBayar: "450000",
      tunai: "300000",
      debit: "150000",
      waktuTiba: "09:00",
    },
    {
      idLaporanHarian: "LH003",
      tanggal_transaksi: "23-05-2025",
      idPemesanan: "PMS003",
      idGaji: "GJ003",
      noLB: "LB003",
      paket: "Tour Bromo",
      keterangan: "Berangkat tepat waktu",
      kode: "K001",
      marketing: "Dina",
      kas: "500000",
      opp: "OPP001",
      driverBayar: "300000",
      totalKas: "800000",
      jumlah: "2",
      harga: "150000",
      driverTerima: "300000",
      tamuBayar: "500000",
      tunai: "400000",
      debit: "100000",
      waktuTiba: "08:00",
    },
    {
      idLaporanHarian: "LH004",
      tanggal_transaksi: "23-05-2025",
      idPemesanan: "PMS004",
      idGaji: "GJ004",
      noLB: "LB004",
      paket: "Tour Merapi",
      keterangan: "Cuaca cerah",
      kode: "K002",
      marketing: "Rudi",
      kas: "450000",
      opp: "OPP002",
      driverBayar: "250000",
      totalKas: "700000",
      jumlah: "3",
      harga: "100000",
      driverTerima: "250000",
      tamuBayar: "450000",
      tunai: "300000",
      debit: "150000",
      waktuTiba: "09:00",
    },
    {
      idLaporanHarian: "LH005",
      tanggal_transaksi: "22-05-2025",
      idPemesanan: "PMS005",
      idGaji: "GJ005",
      noLB: "LB005",
      paket: "Tour Bromo",
      keterangan: "Berangkat tepat waktu",
      kode: "K001",
      marketing: "Dina",
      kas: "500000",
      opp: "OPP001",
      driverBayar: "300000",
      totalKas: "800000",
      jumlah: "2",
      harga: "150000",
      driverTerima: "300000",
      tamuBayar: "500000",
      tunai: "400000",
      debit: "100000",
      waktuTiba: "08:00",
    },
    {
      idLaporanHarian: "LH006",
      tanggal_transaksi: "22-05-2025",
      idPemesanan: "PMS006",
      idGaji: "GJ006",
      noLB: "LB006",
      paket: "Tour Merapi",
      keterangan: "Cuaca cerah",
      kode: "K002",
      marketing: "Rudi",
      kas: "450000",
      opp: "OPP002",
      driverBayar: "250000",
      totalKas: "700000",
      jumlah: "3",
      harga: "100000",
      driverTerima: "250000",
      tamuBayar: "450000",
      tunai: "300000",
      debit: "150000",
      waktuTiba: "09:00",
    },
    {
      idLaporanHarian: "LH007",
      tanggal_transaksi: "21-05-2025",
      idPemesanan: "PMS007",
      idGaji: "GJ007",
      noLB: "LB007",
      paket: "Tour Bromo",
      keterangan: "Berangkat tepat waktu",
      kode: "K001",
      marketing: "Dina",
      kas: "500000",
      opp: "OPP001",
      driverBayar: "300000",
      totalKas: "800000",
      jumlah: "2",
      harga: "150000",
      driverTerima: "300000",
      tamuBayar: "500000",
      tunai: "400000",
      debit: "100000",
      waktuTiba: "08:00",
    },
    {
      idLaporanHarian: "LH008",
      tanggal_transaksi: "21-05-2025",
      idPemesanan: "PMS008",
      idGaji: "GJ008",
      noLB: "LB008",
      paket: "Tour Merapi",
      keterangan: "Cuaca cerah",
      kode: "K002",
      marketing: "Rudi",
      kas: "450000",
      opp: "OPP002",
      driverBayar: "250000",
      totalKas: "700000",
      jumlah: "3",
      harga: "100000",
      driverTerima: "250000",
      tamuBayar: "450000",
      tunai: "300000",
      debit: "150000",
      waktuTiba: "09:00",
    },
    {
      idLaporanHarian: "LH009",
      tanggal_transaksi: "20-05-2025",
      idPemesanan: "PMS009",
      idGaji: "GJ009",
      noLB: "LB009",
      paket: "Tour Bromo",
      keterangan: "Berangkat tepat waktu",
      kode: "K001",
      marketing: "Dina",
      kas: "500000",
      opp: "OPP001",
      driverBayar: "300000",
      totalKas: "800000",
      jumlah: "2",
      harga: "150000",
      driverTerima: "300000",
      tamuBayar: "500000",
      tunai: "400000",
      debit: "100000",
      waktuTiba: "08:00",
    },
  ];

  // Fungsi untuk memuat dan memfilter data dari localStorage
  const loadAndFilterData = useCallback(() => {
    setIsLoading(true);
    const storedDataString = localStorage.getItem("dataHarian");
    let currentRawData;
    if (storedDataString) {
      currentRawData = JSON.parse(storedDataString);
    } else {
      currentRawData = exampleData;
      localStorage.setItem("dataHarian", JSON.stringify(exampleData));
    }
    setDataHarian(currentRawData);

    // Terapkan filter tanggal jika ada
    if (selectedDateForFilter) {
      const formattedFilterDate = formatDateToDisplay(selectedDateForFilter);
      setFilteredData(
        currentRawData.filter(
          (item) => item.tanggal_transaksi === formattedFilterDate
        )
      );
    } else {
      setFilteredData(currentRawData); // Tampilkan semua data jika tidak ada filter
    }
    setIsLoading(false);
  }, [selectedDateForFilter, setDataHarian, setFilteredData, setIsLoading]);

  // Efek samping untuk memuat data saat komponen dimuat dan saat filter tanggal berubah
  useEffect(() => {
    loadAndFilterData();
    const handleDataUpdate = () => loadAndFilterData();
    window.addEventListener("dataHarianUpdated", handleDataUpdate);
    return () => {
      window.removeEventListener("dataHarianUpdated", handleDataUpdate);
    };
  }, [loadAndFilterData]);

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

  // Fungsi untuk membuka modal TambahHarian
  const handleOpenTambahModal = () => {
    setIsTambahModalOpen(true);
  };

  // Fungsi untuk menutup modal TambahHarian
  const handleCloseTambahModal = () => {
    setIsTambahModalOpen(false);
  };

  // Fungsi untuk menambahkan data baru ke daftar (dipanggil dari modal TambahHarian)
  const handleAddDataToList = (newData) => {
    const storedDataString = localStorage.getItem("dataHarian");
    let currentData = storedDataString ? JSON.parse(storedDataString) : [];

    // Generate ID Laporan Harian unik
    const maxIdNum = currentData.reduce((max, item) => {
      const num = parseInt(item.idLaporanHarian.replace('LH', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const newIdNum = maxIdNum + 1;
    const newId = `LH${newIdNum.toString().padStart(3, '0')}`;

    const dataToSave = { ...newData, idLaporanHarian: newId };
    const updatedData = [...currentData, dataToSave];
    localStorage.setItem("dataHarian", JSON.stringify(updatedData));
    window.dispatchEvent(new CustomEvent("dataHarianUpdated"));
    alert("Data laporan harian baru berhasil ditambahkan!");
    handleCloseTambahModal();
  };

  // Fungsi untuk menghapus data laporan harian
  const handleDeleteAction = (idLaporanHarian) => {
    if (confirm("Apakah Anda yakin ingin menghapus data laporan harian ini?")) {
      const updatedData = dataHarian.filter(
        (item) => item.idLaporanHarian !== idLaporanHarian
      );
      localStorage.setItem("dataHarian", JSON.stringify(updatedData));
      window.dispatchEvent(new CustomEvent("dataHarianUpdated"));
      alert("Data laporan harian berhasil dihapus.");
    }
  };

  // Fungsi untuk mendapatkan nama file export
  const getExportFileName = (ext) => {
    const date = new Date().toISOString().split("T")[0];
    return `laporan_harian_${date}.${ext}`;
  };

  // Fungsi untuk export data ke Excel
  const handleExportExcelAction = () => {
    if (filteredData.length === 0) {
      alert("Data kosong, tidak bisa export Excel!");
      return;
    }
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Harian");
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
        "ID Laporan Harian", "Tanggal Transaksi", "ID Pemesanan", "ID Gaji", "No. LB", "Paket",
        "Keterangan", "Kode", "Marketing", "Kas", "OPP", "Driver Bayar",
        "Total Kas", "Jumlah", "Harga", "Driver Terima", "Tamu Bayar",
        "Tunai", "Debit", "Waktu Tiba"
      ];
      const tableRows = filteredData.map((item) => [
        item.idLaporanHarian, item.tanggal_transaksi, item.idPemesanan, item.idGaji, item.noLB, item.paket,
        item.keterangan, item.kode, item.marketing, item.kas, item.opp, item.driverBayar,
        item.totalKas, item.jumlah, item.harga, item.driverTerima, item.tamuBayar,
        item.tunai, item.debit, item.waktuTiba
      ]);
      doc.text(`Laporan Data Harian`, 14, 15);
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

  // Menutup date picker jika klik di luar area
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

  // Daftar kolom tabel
  const tableHeaders = [
    "ID Laporan Harian", "Tanggal Transaksi", "ID Pemesanan", "ID Gaji", "No. LB", "Paket",
    "Keterangan", "Kode", "Marketing", "Kas", "OPP", "Driver Bayar",
    "Total Kas", "Jumlah", "Harga", "Driver Terima", "Tamu Bayar",
    "Tunai", "Debit", "Waktu Tiba", "Aksi" // Masukkan "Aksi" ke dalam array header
  ];

  return (
    <div className="flex relative bg-white-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
        <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
          Laporan Harian
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
            {/* Tombol Tambah - Membuka modal TambahHarian secara manual */}
            <button
              onClick={handleOpenTambahModal}
              className="flex items-center gap-2 bg-[#3D6CB9] text-white hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow"
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
                  : "bg-green-100 text-black hover:bg-[#B8D4F9]" // Gaya seperti PresensiPage
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
                  : "bg-red-100 text-black hover:bg-[#B8D4F9]" // Gaya seperti PresensiPage
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

        {/* Tabel dengan scrolling */}
        {isLoading ? (
          <div className="text-center p-10">Memuat data laporan harian...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full table-auto bg-white text-sm">
                <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th
                        key={header}
                        className={`p-2 text-center whitespace-nowrap`}
                        style={{
                          borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
                          borderTopRightRadius:
                            index === tableHeaders.length - 1 ? "0.5rem" : undefined,
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
                        colSpan={tableHeaders.length} // Sesuaikan colspan dengan jumlah header
                        className="text-center p-4 text-gray-500 font-medium"
                      >
                        Data Tidak Ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr
                        key={item.idLaporanHarian}
                        className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                      >
                        <td className="p-3 whitespace-nowrap">{item.idLaporanHarian}</td>
                        <td className="p-3 whitespace-nowrap">{item.tanggal_transaksi}</td>
                        <td className="p-3 whitespace-nowrap">{item.idPemesanan}</td>
                        <td className="p-3 whitespace-nowrap">{item.idGaji}</td>
                        <td className="p-3 whitespace-nowrap">{item.noLB}</td>
                        <td className="p-3 whitespace-nowrap">{item.paket}</td>
                        <td className="p-3 whitespace-nowrap">{item.keterangan}</td>
                        <td className="p-3 whitespace-nowrap">{item.kode}</td>
                        <td className="p-3 whitespace-nowrap">{item.marketing}</td>
                        <td className="p-3 whitespace-nowrap">{item.kas}</td>
                        <td className="p-3 whitespace-nowrap">{item.opp}</td>
                        <td className="p-3 whitespace-nowrap">{item.driverBayar}</td>
                        <td className="p-3 whitespace-nowrap">{item.totalKas}</td>
                        <td className="p-3 whitespace-nowrap">{item.jumlah}</td>
                        <td className="p-3 whitespace-nowrap">{item.harga}</td>
                        <td className="p-3 whitespace-nowrap">{item.driverTerima}</td>
                        <td className="p-3 whitespace-nowrap">{item.tamuBayar}</td>
                        <td className="p-3 whitespace-nowrap">{item.tunai}</td>
                        <td className="p-3 whitespace-nowrap">{item.debit}</td>
                        <td className="p-3 whitespace-nowrap">{item.waktuTiba}</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex justify-center gap-2">
                            <Link
                              href={`/dashboard/akuntansi/laporan-keuangan/harian/edit-harian/${item.idLaporanHarian}`}
                              className="text-indigo-600 hover:underline"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => handleDeleteAction(item.idLaporanHarian)}
                              className="text-red-600 hover:text-red-800"
                              title="Hapus"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Tambah Harian - Dirender secara eksplisit */}
      <TambahHarian
        isOpen={isTambahModalOpen}
        onClose={handleCloseTambahModal}
        onAddData={handleAddDataToList}
      />

      {/* Ini adalah slot untuk Intercepting Route. Ini harus ada! */}
      {children}
    </div>
  );
};

export default withAuth(HarianPage);
