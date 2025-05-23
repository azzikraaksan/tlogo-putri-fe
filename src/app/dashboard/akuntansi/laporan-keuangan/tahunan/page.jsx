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
// } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const TahunanPage = () => {
//   const [dataTahunan, setDataTahunan] = useState([]);
//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const calendarRef = useRef(null);
//   const [formData, setFormData] = useState({
//     idLaporan: "",
//     idPemasukan: "",
//     idPengeluaran: "",
//     pengeluaran: "",
//     jumlahJeep: "",
//     hariTanggal: "",
//     operasional: "",
//     operasionalBersih: "",
//     kas: "",
//   });

//   const exampleData = [
//     {
//       idLaporan: 1,
//       idPemasukan: 101,
//       idPengeluaran: 201,
//       pengeluaran: "Rp 2.000.000",
//       jumlahJeep: 5,
//       hariTanggal: "01 Januari 2024",
//       operasional: "Rp 3.000.000",
//       operasionalBersih: "Rp 1.000.000",
//       kas: "Rp 4.000.000",
//     },
//     {
//       idLaporan: 2,
//       idPemasukan: 102,
//       idPengeluaran: 202,
//       pengeluaran: "Rp 1.500.000",
//       jumlahJeep: 4,
//       hariTanggal: "02 Januari 2024",
//       operasional: "Rp 2.500.000",
//       operasionalBersih: "Rp 1.000.000",
//       kas: "Rp 3.500.000",
//     },
//   ];

//   useEffect(() => {
//     setDataTahunan(exampleData);
//   }, []);

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

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setDataTahunan((prevData) => [...prevData, formData]);
//     setIsFormOpen(false);
//     setFormData({
//       idLaporan: "",
//       idPemasukan: "",
//       idPengeluaran: "",
//       pengeluaran: "",
//       jumlahJeep: "",
//       hariTanggal: "",
//       operasional: "",
//       operasionalBersih: "",
//       kas: "",
//     });
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <div className="flex relative bg-white-50 min-h-screen">
//       <UserMenu />
//       <Sidebar />

//       <div className="flex-1 p-6 relative">
//         <h1 className="text-[32px] font-bold mb-6 text-black">Tahunan</h1>

//         {/* Toolbar */}
//                         <div className="flex items-center justify-between mb-6">
//                           <div className="flex gap-4 items-center">
//                             {/* Pilih Tanggal */}
//                             <div className="relative">
//                               <button
//                                 onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
//                                 className="flex items-center gap-2 bg-[#3D6CB9] text-black-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow text-white"
//                               >
//                                 <CalendarDays size={24} />
//                                 <span className="text-base font-medium">
//                                   {selectedDate
//                                     ? selectedDate.toLocaleDateString("id-ID", {
//                                         day: "2-digit",
//                                         month: "long",
//                                         year: "numeric",
//                                       })
//                                     : "Pilih Tanggal"}
//                                 </span>
//                               </button>
//                               {isDatePickerOpen && (
//                                 <div
//                                   ref={calendarRef}
//                                   className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12"
//                                 >
//                                   <DatePicker
//                                     selected={selectedDate}
//                                     onChange={handleDateChange}
//                                     inline
//                                     dateFormat="dd/MM/yyyy"
//                                     showPopperArrow={false}
//                                   />
//                                   {/* Button Pilih dan Batal */}
//                                   <div className="mt-4 flex justify-between">
//                                     <button
//                                       onClick={() => setIsDatePickerOpen(false)}
//                                       className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
//                                     >
//                                       Batal
//                                     </button>
//                                     <button
//                                       onClick={() => handleDateChange(selectedDate)}
//                                       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                                     >
//                                       Pilih Tanggal
//                                     </button>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
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

//         {/* Table */}
//         <div className="mt-8">
//           <div className="flex justify-end items-center mb-4">
//             <button className="text-[#3D6CB9] hover:text-blue-800 text-base font-medium">
//               Lihat Semua
//             </button>
//           </div>

//           <div className="rounded-lg overflow-x-auto">
//             <table className="min-w-full table-auto bg-white text-sm">
//               <thead>
//                 <tr className="bg-[#3D6CB9] text-white">
//                   {[
//                     "ID Laporan",
//                     "ID Pemasukan (PK)",
//                     "ID Pengeluaran",
//                     "Pengeluaran",
//                     "Jumlah Jeep",
//                     "Hari / Tanggal",
//                     "Operasional",
//                     "Operasional Bersih",
//                     "Kas",
//                   ].map((header) => (
//                     <th key={header} className="p-3 text-left">
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {dataTahunan.map((item, index) => (
//                   <tr key={index} className="border-b hover:bg-blue-50">
//                     <td className="p-3">{item.idLaporan}</td>
//                     <td className="p-3">{item.idPemasukan}</td>
//                     <td className="p-3">{item.idPengeluaran}</td>
//                     <td className="p-3">{item.pengeluaran}</td>
//                     <td className="p-3">{item.jumlahJeep}</td>
//                     <td className="p-3">{item.hariTanggal}</td>
//                     <td className="p-3">{item.operasional}</td>
//                     <td className="p-3">{item.operasionalBersih}</td>
//                     <td className="p-3">{item.kas}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Modal Form */}
//         {isFormOpen && (
//           <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-8 rounded-lg w-1/2 max-h-[90vh] overflow-y-auto">
//               <h2 className="text-2xl font-semibold text-blue-600 mb-6">
//                 Tambah Laporan Tahunan
//               </h2>
//               <form onSubmit={handleFormSubmit}>
//                 <div className="grid grid-cols-2 gap-6">
//                   {Object.keys(formData).map((key) => (
//                     <div key={key}>
//                       <label className="block mb-2 capitalize">{key}</label>
//                       <input
//                         type="text"
//                         name={key}
//                         value={formData[key]}
//                         onChange={handleFormChange}
//                         className="w-full p-2 border border-gray-300 rounded"
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex justify-end mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setIsFormOpen(false)}
//                     className="mr-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//                   >
//                     Batal
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     Simpan
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default withAuth(TahunanPage);
// D:\laragon\www\tlogo-putri-fe\src\app\dashboard\akuntansi\laporan-keuangan\tahunan\page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth"; // Pastikan path ini benar
import {
  FileText,
  FileSpreadsheet,
} from "lucide-react"; // Hanya import yang dibutuhkan
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Fungsi helper untuk memformat tanggal untuk tampilan (DD-MM-YYYY)
const formatDateToDisplay = (dateString) => {
  if (!dateString) return "";
  // Asumsikan dateString adalah DD-MM-YYYY
  return dateString;
};

// Komponen utama halaman Laporan Tahunan
const TahunanPage = ({ children }) => {
  const [dataTahunan, setDataTahunan] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk filter tahun
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Tahun saat ini

  // Contoh data awal jika localStorage kosong
  const exampleData = [
    {
      idLaporan: "LTN001",
      idPemasukan: "PMK001",
      idPengeluaran: "PLR001",
      pengeluaran: "5000000",
      jumlahJeep: "120",
      hariTanggal: "01-01-2025", // Data untuk tahun 2025
      operasional: "70000000",
      operasionalBersih: "65000000",
      kas: "100000000",
    },
    {
      idLaporan: "LTN002",
      idPemasukan: "PMK002",
      idPengeluaran: "PLR002",
      pengeluaran: "3000000",
      jumlahJeep: "96",
      hariTanggal: "15-02-2024", // Data untuk tahun 2024
      operasional: "50000000",
      operasionalBersih: "47000000",
      kas: "80000000",
    },
    {
      idLaporan: "LTN003",
      idPemasukan: "PMK003",
      idPengeluaran: "PLR003",
      pengeluaran: "6000000",
      jumlahJeep: "144",
      hariTanggal: "20-03-2025", // Data untuk tahun 2025
      operasional: "80000000",
      operasionalBersih: "74000000",
      kas: "120000000",
    },
    {
      idLaporan: "LTN004",
      idPemasukan: "PMK004",
      idPengeluaran: "PLR004",
      pengeluaran: "4000000",
      jumlahJeep: "108",
      hariTanggal: "10-04-2024", // Data untuk tahun 2024
      operasional: "60000000",
      operasionalBersih: "56000000",
      kas: "95000000",
    },
  ];

  // Fungsi untuk memuat dan memfilter data dari localStorage
  const loadAndFilterData = useCallback(() => {
    setIsLoading(true);
    const storedDataString = localStorage.getItem("dataTahunan"); // Ubah key localStorage
    let currentRawData;
    if (storedDataString) {
      currentRawData = JSON.parse(storedDataString);
    } else {
      currentRawData = exampleData;
      localStorage.setItem("dataTahunan", JSON.stringify(exampleData)); // Ubah key localStorage
    }
    setDataTahunan(currentRawData);

    // Filter berdasarkan tahun yang dipilih
    const filtered = currentRawData.filter(item => {
      if (!item.hariTanggal) return false;
      const parts = item.hariTanggal.split('-'); // Asumsi format DD-MM-YYYY
      if (parts.length !== 3) return false;

      const itemYear = parseInt(parts[2], 10); // Tahun dari data

      return itemYear === selectedYear;
    });

    setFilteredData(filtered);
    setIsLoading(false);
  }, [selectedYear, setDataTahunan, setFilteredData, setIsLoading]);

  // Efek samping untuk memuat data saat komponen dimuat atau filter tahun berubah
  useEffect(() => {
    loadAndFilterData();
    const handleDataUpdate = () => loadAndFilterData();
    window.addEventListener("dataTahunanUpdated", handleDataUpdate); // Ubah event listener
    return () => {
      window.removeEventListener("dataTahunanUpdated", handleDataUpdate); // Ubah event listener
    };
  }, [loadAndFilterData]);

  // Fungsi untuk mendapatkan nama file export
  const getExportFileName = (ext) => {
    return `laporan_tahunan_${selectedYear}.${ext}`;
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
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Tahunan");
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
        "ID Laporan", "ID Pemasukan", "ID Pengeluaran", "Pengeluaran",
        "Jumlah Jeep", "Hari/Tanggal", "Operasional", "Operasional Bersih", "Kas"
      ];
      const tableRows = filteredData.map((item) => [
        item.idLaporan, item.idPemasukan, item.idPengeluaran, item.pengeluaran,
        item.jumlahJeep, item.hariTanggal, item.operasional, item.operasionalBersih, item.kas
      ]);

      doc.text(`Laporan Data Tahunan - ${selectedYear}`, 14, 15);
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

  // Daftar kolom tabel
  const tableHeaders = [
    "ID Laporan", "ID Pemasukan", "ID Pengeluaran", "Pengeluaran",
    "Jumlah Jeep", "Hari/Tanggal", "Operasional", "Operasional Bersih", "Kas"
  ];

  // Opsi tahun untuk dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // 2 tahun ke belakang, tahun ini, 2 tahun ke depan

  return (
    <div className="flex relative bg-white-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
        <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
          Laporan Tahunan
        </h1>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
            {/* Year Selector */}
            <div className="flex gap-2 items-center">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
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

        {/* Tabel dengan scrolling */}
        {isLoading ? (
          <div className="text-center p-10">Memuat data laporan tahunan...</div>
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
                        colSpan={tableHeaders.length}
                        className="text-center p-4 text-gray-500 font-medium"
                      >
                        Data Tidak Ditemukan untuk Tahun {selectedYear}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr
                        key={item.idLaporan}
                        className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                      >
                        <td className="p-3 whitespace-nowrap">{item.idLaporan}</td>
                        <td className="p-3 whitespace-nowrap">{item.idPemasukan}</td>
                        <td className="p-3 whitespace-nowrap">{item.idPengeluaran}</td>
                        <td className="p-3 whitespace-nowrap">{item.pengeluaran}</td>
                        <td className="p-3 whitespace-nowrap">{item.jumlahJeep}</td>
                        <td className="p-3 whitespace-nowrap">{item.hariTanggal}</td>
                        <td className="p-3 whitespace-nowrap">{item.operasional}</td>
                        <td className="p-3 whitespace-nowrap">{item.operasionalBersih}</td>
                        <td className="p-3 whitespace-nowrap">{item.kas}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {children}
    </div>
  );
};

export default withAuth(TahunanPage);
