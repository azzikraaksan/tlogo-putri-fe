"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { CalendarDays, FileText, FileSpreadsheet, RotateCcw } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useRouter } from "next/navigation";

const PemasukanPage = () => {
  // State untuk data dan filter
  const [dataPemasukan, setDataPemasukan] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const calendarRef = useRef(null);
  const router = useRouter();

  // Data contoh
const exampleData = [
  {
    idPemasukan: "IDPM001",
    idPengeluaran: "IDPG001",
    idTicketing: "IDTK001",
    idPemesanan: "IDPM001",
    tanggalPemesanan: "17-05-2025",
    pemasukan: "Rp 1.000.000",
    pengeluaran: "Rp 1.000.000",
    totalBersih: "Rp 900.000",
    kas: "Rp 100.000",
  },
  {
    idPemasukan: "IDPM002",
    idPengeluaran: "IDPG002",
    idTicketing: "IDTK002",
    idPemesanan: "IDPM002",
    tanggalPemesanan: "18-05-2025",
    pemasukan: "Rp 2.000.000",
    pengeluaran: "Rp 1.500.000",
    totalBersih: "Rp 1.200.000",
    kas: "Rp 800.000",
  },
  {
    idPemasukan: "IDPM003",
    idPengeluaran: "IDPG003",
    idTicketing: "IDTK003",
    idPemesanan: "IDPM003",
    tanggalPemesanan: "19-05-2025",
    pemasukan: "Rp 3.000.000",
    pengeluaran: "Rp 2.000.000",
    totalBersih: "Rp 2.500.000",
    kas: "Rp 1.500.000",
  },
  {
    idPemasukan: "IDPM004",
    idPengeluaran: "IDPG004",
    idTicketing: "IDTK004",
    idPemesanan: "IDPM004",
    tanggalPemesanan: "20-05-2025",
    pemasukan: "Rp 4.000.000",
    pengeluaran: "Rp 3.000.000",
    totalBersih: "Rp 3.500.000",
    kas: "Rp 2.500.000",
  },
  {
    idPemasukan: "IDPM005",
    idPengeluaran: "IDPG005",
    idTicketing: "IDTK005",
    idPemesanan: "IDPM005",
    tanggalPemesanan: "21-05-2025",
    pemasukan: "Rp 5.000.000",
    pengeluaran: "Rp 4.000.000",
    totalBersih: "Rp 4.500.000",
    kas: "Rp 3.500.000",
  },
  {
    idPemasukan: "IDPM006",
    idPengeluaran: "IDPG006",
    idTicketing: "IDTK006",
    idPemesanan: "IDPM006",
    tanggalPemesanan: "22-05-2025",
    pemasukan: "Rp 6.000.000",
    pengeluaran: "Rp 5.000.000",
    totalBersih: "Rp 5.500.000",
    kas: "Rp 4.500.000",
  },
  {
    idPemasukan: "IDPM007",
    idPengeluaran: "IDPG007",
    idTicketing: "IDTK007",
    idPemesanan: "IDPM007",
    tanggalPemesanan: "23-05-2025",
    pemasukan: "Rp 7.000.000",
    pengeluaran: "Rp 6.000.000",
    totalBersih: "Rp 6.500.000",
    kas: "Rp 5.500.000",
  },
  {
    idPemasukan: "IDPM008",
    idPengeluaran: "IDPG008",
    idTicketing: "IDTK008",
    idPemesanan: "IDPM008",
    tanggalPemesanan: "24-05-2025",
    pemasukan: "Rp 8.000.000",
    pengeluaran: "Rp 7.000.000",
    totalBersih: "Rp 7.500.000",
    kas: "Rp 6.500.000",
  },
  {
    idPemasukan: "IDPM009",
    idPengeluaran: "IDPG009",
    idTicketing: "IDTK009",
    idPemesanan: "IDPM009",
    tanggalPemesanan: "25-05-2025",
    pemasukan: "Rp 9.000.000",
    pengeluaran: "Rp 8.000.000",
    totalBersih: "Rp 8.500.000",
    kas: "Rp 7.500.000",
  },
  {
    idPemasukan: "IDPM010",
    idPengeluaran: "IDPG010",
    idTicketing: "IDTK010",
    idPemesanan: "IDPM010",
    tanggalPemesanan: "26-05-2025",
    pemasukan: "Rp 10.000.000",
    pengeluaran: "Rp 9.000.000",
    totalBersih: "Rp 9.500.000",
    kas: "Rp 8.500.000",
  },
  {
    idPemasukan: "IDPM011",
    idPengeluaran: "IDPG011",
    idTicketing: "IDTK011",
    idPemesanan: "IDPM011",
    tanggalPemesanan: "27-05-2025",
    pemasukan: "Rp 11.000.000",
    pengeluaran: "Rp 10.000.000",
    totalBersih: "Rp 10.500.000",
    kas: "Rp 9.500.000",
  },
  {
    idPemasukan: "IDPM012",
    idPengeluaran: "IDPG012",
    idTicketing: "IDTK012",
    idPemesanan: "IDPM012",
    tanggalPemesanan: "28-05-2025",
    pemasukan: "Rp 12.000.000",
    pengeluaran: "Rp 11.000.000",
    totalBersih: "Rp 11.500.000",
    kas: "Rp 10.500.000",
  },
  {
    idPemasukan: "IDPM013",
    idPengeluaran: "IDPG013",
    idTicketing: "IDTK013", 
    idPemesanan: "IDPM013",
    tanggalPemesanan: "29-05-2025",
    pemasukan: "Rp 13.000.000",
    pengeluaran: "Rp 12.000.000",
    totalBersih: "Rp 12.500.000",
    kas: "Rp 11.500.000",
  },
  {
    idPemasukan: "IDPM014",
    idPengeluaran: "IDPG014",
    idTicketing: "IDTK014",
    idPemesanan: "IDPM014",
    tanggalPemesanan: "30-05-2025",
    pemasukan: "Rp 14.000.000",
    pengeluaran: "Rp 13.000.000",
    totalBersih: "Rp 13.500.000",
    kas: "Rp 12.500.000",
  },
  {
    idPemasukan: "IDPM015",
    idPengeluaran: "IDPG015",
    idTicketing: "IDTK015",
    idPemesanan: "IDPM015",
    tanggalPemesanan: "31-05-2025",
    pemasukan: "Rp 15.000.000",
    pengeluaran: "Rp 14.000.000",
    totalBersih: "Rp 14.500.000",
    kas: "Rp 13.500.000",
  },
];

  useEffect(() => {
    // Simulasi loading data
    setIsLoading(true);
    setTimeout(() => {
      setDataPemasukan(exampleData);
      setFilteredData(exampleData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Format tanggal
  const formatDate = (date) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // Filter berdasarkan tanggal
  const applyDateFilter = () => {
    if (!tempDate) return;
    const formatted = formatDate(tempDate);
    const filtered = dataPemasukan.filter(
      (item) => item.tanggalPemesanan === formatted
    );
    setSelectedDate(tempDate);
    setFilteredData(filtered);
    setIsDatePickerOpen(false);
  };

  const resetFilter = () => {
    setSelectedDate(null);
    setFilteredData(dataPemasukan);
  };

  // Export data
  const getFileName = (ext) => {
    if (selectedDate) {
      const formatted = formatDate(selectedDate).replace(/-/g, "");
      return `data_pemasukan_${formatted}.${ext}`;
    }
    return `data_pemasukan_semua.${ext}`;
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Data kosong, tidak bisa export Excel!");
      return;
    }
    
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pemasukan");
      XLSX.writeFile(wb, getFileName("xlsx"));
    } catch (error) {
      console.error("Export Excel error:", error);
      alert("Gagal export Excel!");
    }
  };

  const handleExportPDF = () => {
    if (filteredData.length === 0) {
      alert("Data kosong, tidak bisa export PDF!");
      return;
    }
    
    try {
      const doc = new jsPDF();
      const tableColumn = [
        "ID Pemasukan",
        "ID Pengeluaran",
        "ID Ticketing",
        "ID Pemesanan",
        "Tanggal Pemesanan",
        "Pemasukan",
        "Pengeluaran",
        "Total Bersih",
        "Kas"
      ];
      const tableRows = filteredData.map((item) => [
        item.idPemasukan,
        item.idPengeluaran,
        item.idTicketing,
        item.idPemesanan,
        item.tanggalPemesanan,
        item.pemasukan,
        item.pengeluaran,
        item.totalBersih,
        item.kas,
      ]);
      // doc.autoTable({ head: [tableColumn], body: tableRows }); // Bagian ini masih error pas mau di-export
      doc.save(getFileName("pdf"));
    } catch (error) {
      console.error("Export PDF error:", error);
      alert("Gagal export PDF!");
    }
  };

  return (
    <div className="flex relative bg-white-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
          Pemasukan
        </h1>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
            <div className="relative" ref={calendarRef}>
              {!selectedDate ? (
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                >
                  <CalendarDays size={20} />
                  <span>Pilih Tanggal</span>
                </button>
              ) : (
                <button
                  onClick={resetFilter}
                  className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                >
                  <RotateCcw size={20} />
                  <span>Set Ulang</span>
                </button>
              )}

              {isDatePickerOpen && (
                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
                  <DatePicker
                    selected={tempDate}
                    onChange={(date) => setTempDate(date)}
                    inline
                    dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                  />
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        setTempDate(null);
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
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleExportExcel}
              disabled={filteredData.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                filteredData.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-100 text-black hover:bg-[#B8D4F9]"
              }`}
            >
              <FileSpreadsheet size={20} color={filteredData.length === 0 ? "gray" : "green"} />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={filteredData.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                filteredData.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-red-100 text-black hover:bg-[#B8D4F9]"
              }`}
            >
              <FileText size={20} color={filteredData.length === 0 ? "gray" : "red"} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push("/lihat-semua")}
            className="text-[#3D6CB9] hover:text-blue-800 text-base font-medium"
          >
            Lihat Semua
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Tabel */}
        {!isLoading && (
          <div className="overflow-y-auto max-h-[500px] rounded-lg shadow mb-8">
            <table className="min-w-full table-auto bg-white text-sm">
              <thead className="bg-[#3D6CB9] text-white">
                <tr>
                  {[
                    "ID Pemasukan",
                    "ID Pengeluaran",
                    "ID Ticketing",
                    "ID Pemesanan",
                    "Tanggal Pemesanan",
                    "Pemasukan",
                    "Pengeluaran",
                    "Total Bersih",
                    "Kas",
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
                      colSpan={7}
                      className="text-center p-4 text-gray-500 font-medium"
                    >
                      Data Tidak Ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.idPemasukan || `row-${index}`}
                      className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                    >
                      <td className="p-3">{item.idPemasukan}</td>
                      <td className="p-3">{item.idPengeluaran}</td>
                      <td className="p-3">{item.idTicketing}</td>
                      <td className="p-3">{item.idPemesanan}</td>
                      <td className="p-3">{item.tanggalPemesanan}</td>
                      <td className="p-3">{item.pemasukan}</td>
                      <td className="p-3">{item.pengeluaran}</td>
                      <td className="p-3">{item.totalBersih}</td>
                      <td className="p-3">{item.kas}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(PemasukanPage);