"use client";

import { useEffect, useState } from "react";
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
  const [allData, setAllData] = useState([]);
  const itemsPerPage = 4;
  const user_id = 1; // Ganti dengan user_id dari auth jika sudah tersedia

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/salary/history/${user_id}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();

      // Konversi bulan ke format "Mei", "Juni", dst agar cocok dengan dropdown
      const enriched = (data.salary_history || []).map(item => {
        const date = new Date(item.payment_date);
        const bulan = date.toLocaleString('id-ID', { month: 'long' }); // Capitalized
        const tahun = date.getFullYear();
        return { ...item, bulan, tahun };
      });

      setAllData(enriched);
    } catch (err) {
      console.error("Gagal fetch data:", err);
      alert("Gagal mengambil data dari server.");
    }
  };

  fetchData();
}, [user_id]);

// Debug log
console.log("Semua data:", allData);
console.log("Filter bulan:", selectedMonth);
console.log("Filter tahun:", selectedYear);
console.log("Search term:", searchTerm);

// Filtering data
const filteredData = allData.filter(item => {
  const cocokNama = (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase());
  const cocokBulan = !selectedMonth || (item.bulan || "").toLowerCase() === selectedMonth.toLowerCase(); // Lowercase for both
  const cocokTahun = !selectedYear || Number(item.tahun) === Number(selectedYear); // Ensure comparison works
  return cocokNama && cocokBulan && cocokTahun;
});

console.log("Data setelah filter:", filteredData);

// Pagination logic
const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Gaji");
    XLSX.writeFile(workbook, "laporan_gaji.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Nama", "Role", "Tanggal", "Nominal Gaji"]],
      body: filteredData.map(item => [item.nama, item.role, item.payment_date, item.total_salary]),
    });
    doc.save("laporan_gaji.pdf");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Laporan Gaji</h1>
          <UserMenu />
        </div>

        {/* Baris atas: Filter kiri dan Search kanan */}
<div className="flex justify-between flex-wrap items-start mb-2 gap-2">
  {/* Kiri: Dropdown Bulan dan Tahun */}
  <div className="flex gap-2">
    <select
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Bulan</option>
      {months.map((month) => (
        <option key={month} value={month}>{month}</option>
      ))}
    </select>
    <select
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Tahun</option>
      {years.map((year) => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  </div>

  {/* Kanan: Search */}
  <div className="flex flex-col items-end gap-2">
    <SearchInput
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* Tombol Excel & PDF tepat di bawah Search */}
    <div className="flex gap-2">
      <button
        onClick={exportToExcel}
        className="flex items-center gap-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        <FileSpreadsheet size={16} /> Export Excel
      </button>
      <button
        onClick={exportToPDF}
        className="flex items-center gap-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        <FileText size={16} /> Export PDF
      </button>
    </div>
  </div>
</div>

{/* Tombol Cetak paling bawah
<div className="mb-4">
  <button
    onClick={() => setShowPrintModal(true)}
    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
  >
    Cetak
  </button>
</div> */}

        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Tanggal</th>
              <th className="p-2 text-left">Nominal Gaji</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{item.nama}</td>
                <td className="p-2">{item.role}</td>
                <td className="p-2">{item.payment_date}</td>
                <td className="p-2">Rp {item.total_salary?.toLocaleString('id-ID')}</td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Tombol Cetak di bawah tabel */}
    <div className="mt-4 flex justify-end">
      <button
        onClick={() => setShowPrintModal(true)}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Cetak
      </button>
    </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Print Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Cetak Laporan Gaji</h2>
              <p>Total Data: {filteredData.length}</p>
              <p>Bulan: {selectedMonth || 'Semua'}</p>
              <p>Tahun: {selectedYear || 'Semua'}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 bg-gray-300 rounded">Tutup</button>
                <button onClick={() => { window.print(); }} className="px-4 py-2 bg-blue-500 text-white rounded">Cetak</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(Page);
