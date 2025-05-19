"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, FileSpreadsheet } from "lucide-react";

function Page() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  const allData = [
    { nama: "Danang", tanggal: "1/3/2025", waktu: "11.30", posisi: "Driver", gaji: "Rp. 2.000.000" },
    { nama: "Gading", tanggal: "2/3/2025", waktu: "09.00", posisi: "Driver", gaji: "Rp. 1.500.000" },
    { nama: "Nanto", tanggal: "3/3/2025", waktu: "09.00", posisi: "Driver", gaji: "Rp. 1.500.000" },
    { nama: "Rian", tanggal: "4/3/2025", waktu: "09.00", posisi: "Driver", gaji: "Rp. 1.500.000" },
    { nama: "Andi", tanggal: "5/3/2025", waktu: "10.00", posisi: "Driver", gaji: "Rp. 1.000.000" },
    { nama: "Budi", tanggal: "6/3/2025", waktu: "08.00", posisi: "Driver", gaji: "Rp. 1.000.000" },
    { nama: "Candra", tanggal: "6/3/2025", waktu: "08.30", posisi: "Driver", gaji: "Rp. 1.500.000" },
    { nama: "Asep", tanggal: "8/3/2025", waktu: "09.00", posisi: "Driver", gaji: "Rp. 2.000.000" },
    { nama: "Didi", tanggal: "8/3/2025", waktu: "08.00", posisi: "Driver", gaji: "Rp. 1.000.000" },
    { nama: "Rosi", tanggal: "6/3/2025", waktu: "08.00", posisi: "Driver", gaji: "Rp. 1.000.000" },
  ];

  const filteredData = allData.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Export data
const getFileName = (ext) => {
  if (selectedMonth && selectedYear) {
    const formattedMonth = selectedMonth.toLowerCase().replace(/\s+/g, "");
    return `data_driver_${formattedMonth}_${selectedYear}.${ext}`;
  }
  return `data_driver_semua.${ext}`;
};

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Data kosong, tidak bisa export Excel!");
      return;
    }
    
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Driver");
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
const tableRows = filteredData.map((item, index) => [
  index + 1,
  (index + 1).toString().padStart(2, "0"),
  item.tanggal,
  item.waktu,
  item.posisi,
  item.gaji,
]);
  
      doc.text("Laporan Data Driver", 14, 10);
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
      
      doc.save(getFileName("pdf"));
    } catch (error) {
      console.error("Export PDF error:", error);
      alert("Gagal export PDF!");
    }
  };

   return (
    <div className="flex min-h-screen bg-white-100">
      <Sidebar />
      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-end">
          <UserMenu />
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Laporan Penggajian</h1>

        <div className="bg-white p-6 rounded-xl shadow-xl">
          {/* Filter Bulan & Tahun */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <select className="border border-gray-300 p-2 rounded-md shadow-sm text-[14px]" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">Pilih Bulan</option>
              {months.map((month, index) => <option key={index} value={month}>{month}</option>)}
            </select>
            <select className="border border-gray-300 p-2 rounded-md shadow-sm text-[14px]" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">Pilih Tahun</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          <div className="flex justify-end mb-4">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              placeholder="Cari..."
            />
          </div>

           {/* Tombol Export */}
          <div className="flex justify-end gap-4 mb-4">
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

          {/* Header Judul */}
          <div className="bg-blue-600 text-white text-[14px] font-medium rounded-lg px-4 py-3 mb-4 shadow-md">
            Laporan Gaji Karyawan
            {selectedMonth && ` - Bulan: ${selectedMonth}`}
            {selectedYear && `, Tahun: ${selectedYear}`}
          </div>


          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-md text-xs text-[14px]">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-3 text-center">No</th>
                  <th className="p-3 text-center">Nomor Lambung</th>
                  <th className="p-3 text-left">Nama Karyawan</th>
                  <th className="p-3 text-center">Tanggal</th>
                  <th className="p-3 text-center">Waktu</th>
                  <th className="p-3 text-center">Posisi</th>
                  <th className="p-3 text-right">Nominal Gaji</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {currentData.map((data, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center">{startIndex + index + 1}</td>
                    <td className="p-3 text-center">{(startIndex + index + 1).toString().padStart(2, "0")}</td>
                    <td className="p-3">{data.nama}</td>
                    <td className="p-3 text-center">{data.tanggal}</td>
                    <td className="p-3 text-center">{data.waktu}</td>
                    <td className="p-3 text-center">{data.posisi}</td>
                    <td className="p-3 text-right">{data.gaji}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="p-2 border rounded disabled:opacity-50" disabled={currentPage === 1}>&#8592;</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`p-2 border rounded ${currentPage === page ? "bg-blue-600 text-white" : "hover:bg-blue-600 hover:text-white transition"}`}
              >
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="p-2 border rounded disabled:opacity-50" disabled={currentPage === totalPages}>&#8594;</button>
          </div>

          {/* Tombol Cetak */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowPrintModal(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition text-[14px] flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9V2h12v7m4 4H4v6h4v3h8v-3h4v-6z" />
              </svg>
              Cetak Laporan Penggajian
            </button>
          </div>
        </div>

        {/* Modal Cetak */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto py-4 sm:py-8">
            <div className="bg-white border border-gray-300 w-[90%] md:w-[70%] lg:w-[50%] mx-auto rounded-xl shadow-2xl relative p-6 text-black max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowPrintModal(false)} className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-red-600 font-bold">&times;</button>
              <div className="text-center mb-6">
                <div className="flex items-start mt-4 ml-4">
                  <img src="/images/logo.png" alt="Logo" className="w-[100px] h-auto mr-4" />
                  <div className="flex flex-col justify-center ml-16 mt-4">
                    <h2 className="text-xl font-bold">Jeep Tlogo Putri</h2>
                    <div className="text-sm text-gray-500 grid grid-cols-[auto,1fr] gap-x-2">
                      <p className="font-medium">Alamat: Banyuraden Gamping Sleman Yogyakarta</p>
                      <p></p>
                      <p className="font-medium">Telp. 082135664668</p>
                      <p></p>
                    </div>
                  </div>
                </div>
                <hr className="my-4 border-gray-300" />
                <h3 className="font-semibold text-lg">LAPORAN GAJI KARYAWAN</h3>
                <p className="text-sm">PERIODE BULAN {selectedMonth || "FEBRUARI"} {selectedYear || "2025"}</p>
              </div>
              <table className="w-full border border-collapse border-gray-400 text-sm mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Nomor Lambung</th>
                    <th className="border p-2">Nama Karyawan</th>
                    <th className="border p-2">Tanggal</th>
                    <th className="border p-2">Waktu</th>
                    <th className="border p-2">Posisi</th>
                    <th className="border p-2">Nominal Gaji</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{(index + 1).toString().padStart(2, "0")}</td>
                      <td className="border p-2 text-center">{row.nama}</td>
                      <td className="border p-2 text-center">{row.tanggal}</td>
                      <td className="border p-2 text-center">{row.waktu}</td>
                      <td className="border p-2 text-center">{row.posisi}</td>
                      <td className="border p-2 text-right">{row.gaji}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="6" className="border p-2 text-right font-semibold">Total Pendapatan Gaji</td>
                    <td className="border p-2 text-right font-semibold">Rp. 9.000.000</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 text-right text-sm">
                <p>Yogyakarta, 02 {selectedMonth || "Februari"} {selectedYear || "2025"}</p>
                <p className="mt-12 font-semibold">Inuk</p>
                <p>Ketua</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;