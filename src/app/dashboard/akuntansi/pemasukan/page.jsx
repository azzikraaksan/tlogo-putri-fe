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
import autoTable from "jspdf-autotable"; // Import autoTable secara terpisah

const PemasukanPage = () => {
  // State untuk data dan filter
  const [dataPemasukan, setDataPemasukan] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Tanggal yang sudah difilter
  const [tempDate, setTempDate] = useState(null); // Tanggal sementara di date picker
  const calendarRef = useRef(null);

  // Fungsi helper untuk memformat angka menjadi "Rp X.XXX.XXX"
  const formatCurrency = (number) => {
    if (typeof number === 'number' && !isNaN(number)) {
      return `Rp ${number.toLocaleString("id-ID")}`;
    }
    return `Rp 0`;
  };

  // Menghitung total kas dari data yang difilter
  const calculateTotalKas = () => {
    const total = filteredData.reduce((sum, item) => sum + (typeof item.cash === 'number' && !isNaN(item.cash) ? item.cash : 0), 0);
    return formatCurrency(total);
  };

  // Format tanggal untuk tampilan dan filter (DD-MM-YYYY)
  const formatDate = (date) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // Menerapkan filter berdasarkan tanggal yang dipilih
  const applyDateFilter = () => {
    if (!tempDate) return;
    const formatted = formatDate(tempDate);
    const filtered = dataPemasukan.filter(
      (item) => item.booking_date === formatted
    );
    setSelectedDate(tempDate); // Set selectedDate saat filter diterapkan
    setFilteredData(filtered);
    setIsDatePickerOpen(false);
  };

  // Mereset filter tanggal dan menampilkan semua data
  const resetFilter = () => {
    setSelectedDate(null);
    setFilteredData(dataPemasukan);
  };

  // Mendapatkan nama file untuk ekspor (Excel/PDF)
  const getFileName = (ext) => {
    if (selectedDate) {
      const formatted = formatDate(selectedDate).replace(/-/g, "");
      return `data_pemasukan_${formatted}.${ext}`;
    }
    return `data_pemasukan_semua.${ext}`;
  };

  // Menangani ekspor data ke Excel
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Data kosong, tidak bisa export Excel!");
      return;
    }

    try {
      const exportData = filteredData.map(item => ({
        'ID Pemasukan': item.income_id || '',
        'ID Pengeluaran': item.expenditure_id || '',
        'ID Ticketing': item.ticketing_id || '',
        'ID Pemesanan': item.booking_id || '',
        'Tanggal Pemesanan': item.booking_date || '',
        'Pemasukan': item.income,
        'Pengeluaran': item.expenditure,
        'Kas': item.cash,
      }));
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pemasukan");
      XLSX.writeFile(wb, getFileName("xlsx"));
    } catch (error) {
      console.error("Export Excel error:", error);
      alert("Gagal export Excel!");
    }
  };

  // Fungsi untuk export data ke PDF (mengikuti logika yang Anda berikan)
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
        "Kas"
      ];
      const tableRows = filteredData.map((item) => [
        item.income_id || '',
        item.expenditure_id || '',
        item.ticketing_id || '',
        item.booking_id || '',
        item.booking_date || '',
        formatCurrency(item.income),
        formatCurrency(item.expenditure),
        formatCurrency(item.cash),
      ]);

      // Menggunakan selectedDate dari state untuk judul laporan
      doc.text(
        `Laporan Data Pemasukan ${
          selectedDate
            ? `(${formatDate(selectedDate)})`
            : "(Semua Data)"
        }`,
        14,
        15
      );
      
      // Menggunakan autoTable dari import terpisah
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [61, 108, 185], // Warna biru untuk header
        },
        // Tambahkan footer Total Kas
        didDrawPage: function (data) {
          if (data && data.settings && doc && doc.internal && doc.internal.pageSize) {
            doc.setFontSize(10);
            const totalKasText = `Total Kas: ${calculateTotalKas()}`;
            const textWidth = doc.getStringUnitWidth(totalKasText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const xOffset = doc.internal.pageSize.width - data.settings.margin.right - textWidth;
            doc.text(totalKasText, xOffset, doc.internal.pageSize.height - 10);
          }
        }
      });
      doc.save(getFileName("pdf")); // Gunakan fungsi getFileName yang sudah ada
    } catch (error) {
      console.error("Export PDF error:", error);
      alert("Gagal export PDF!");
    }
  };

  // Fungsi untuk mengambil data pemasukan dari backend (GET /api/income/all)
  const fetchIncomeData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/income/all');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();

      const cleanedData = rawData.map(item => ({
        ...item,
        income: typeof item.income === 'number' ? item.income : Number(item.income || 0),
        expenditure: typeof item.expenditure === 'number' ? item.expenditure : Number(item.expenditure || 0),
        cash: typeof item.cash === 'number' ? item.cash : Number(item.cash || 0),
      }));

      setDataPemasukan(cleanedData);
      setFilteredData(cleanedData);
    } catch (error) {
      console.error("Failed to fetch income data:", error);
      alert("Gagal memuat data pemasukan. Silakan coba lagi nanti.");
    }
  };

  // Fungsi untuk membuat laporan pemasukan (GET /api/income/create)
  const createIncomeReport = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/income/create');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Laporan pemasukan berhasil dibuat secara otomatis!");
      fetchIncomeData(); // Refresh data tabel
    } catch (error) {
      console.error("Failed to create income report:", error);
      alert("Gagal membuat laporan pemasukan. Silakan periksa log.");
    }
  };

  // Efek samping untuk memuat data awal saat komponen dimuat
  useEffect(() => {
    fetchIncomeData();
  }, []);

  return (
    <div className="flex relative bg-white-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
          Pemasukan
        </h1>

        {/* Toolbar untuk filter dan ekspor */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
            {/* Tombol filter tanggal atau reset */}
            <div className="relative" ref={calendarRef}>
              {!selectedDate ? (
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  // Menambahkan cursor-pointer
                  className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black cursor-pointer"
                >
                  <CalendarDays size={20} />
                  <span>Pilih Tanggal</span>
                </button>
              ) : (
                <button
                  onClick={resetFilter}
                  // Menambahkan cursor-pointer
                  className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black cursor-pointer"
                >
                  <RotateCcw size={20} />
                  <span>Set Ulang</span>
                </button>
              )}

              {/* DatePicker popup */}
              {isDatePickerOpen && (
                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
                  <DatePicker
                    selected={tempDate}
                    onChange={(date) => setTempDate(date)}
                    inline
                    dateFormat="dd-MM-yyyy"
                    showPopperArrow={false}
                  />
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        setTempDate(null);
                        setIsDatePickerOpen(false);
                      }}
                      // Menambahkan cursor-pointer
                      className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={applyDateFilter}
                      // Menambahkan cursor-pointer
                      className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white cursor-pointer"
                    >
                      Pilih Tanggal
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Tombol untuk memicu pembuatan laporan */}
            <button
              onClick={createIncomeReport}
              // Menambahkan cursor-pointer
              className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black cursor-pointer"
            >
              <span>Buat Laporan Otomatis</span>
            </button>
          </div>

          {/* Tombol ekspor */}
          <div className="flex gap-4">
            <button
              onClick={handleExportExcel}
              disabled={filteredData.length === 0}
              // Menambahkan cursor-pointer
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                filteredData.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
              }`}
            >
              <FileSpreadsheet size={20} color={filteredData.length === 0 ? "gray" : "green"} />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={filteredData.length === 0}
              // Menambahkan cursor-pointer
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                filteredData.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-red-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
              }`}
            >
              <FileText size={20} color={filteredData.length === 0 ? "gray" : "red"} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Tabel data pemasukan */}
        <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8">
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
                  <td colSpan={8} className="text-center p-4 text-gray-500 font-medium">Data Tidak Ditemukan</td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.income_id || `row-${index}`}
                    // Menambahkan cursor-pointer pada baris tabel
                    className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200 cursor-pointer"
                  >
                    <td className="p-3">{item.income_id}</td><td className="p-3">{item.expenditure_id}</td><td className="p-3">{item.ticketing_id}</td><td className="p-3">{item.booking_id}</td><td className="p-3">{item.booking_date}</td><td className="p-3">{formatCurrency(item.income)}</td><td className="p-3">{formatCurrency(item.expenditure)}</td><td className="p-3">{formatCurrency(item.cash)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tampilan Total Kas yang fixed di kanan bawah */}
        <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span className="font-bold text-lg">Total Kas:</span>
          <span className="text-lg font-semibold text-[#3D6CB9]">{calculateTotalKas()}</span>
        </div>
      </div>
    </div>
  );
};

export default withAuth(PemasukanPage); 