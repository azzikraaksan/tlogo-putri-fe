"use client";

import { useEffect, useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, FileSpreadsheet } from "lucide-react";

function Page() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  

  const itemsPerPage = 4;
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const users = [
        { id: 2, role: "driver" },
        { id: 3, role: "owner" },
        // Tambahkan user lainnya jika ada
      ];

      const results = await Promise.allSettled(
        users.map(async ({ id, role }) => {
          const url = `http://localhost:8000/api/salary/total/${id}/${role}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Fetch gagal: ${url}`);
          const data = await res.json();
          return data;
        })
      );

      const allData = results
        .filter(result => result.status === "fulfilled")
        .map(result => result.value)
        .map(item => {
          const tanggal = item.tanggal || "-";
          const dateObj = new Date(tanggal);
          const bulan = months[dateObj.getMonth()];
          const tahun = dateObj.getFullYear();

          return {
            nama: item.nama || "-",
            role: item.role || "-",
            tanggal,
            bulan,
            tahun,
            total_salary: item.total_salary || 0,
          };
        });

      setAllData(allData);
    } catch (err) {
      console.error("Gagal mengambil data:", err.message);
    }
  };

  fetchData();
}, []);

  const filteredData = allData.filter(item => {
    const cocokNama = (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase());
    const cocokBulan = !selectedMonth || (item.bulan || "").toLowerCase() === selectedMonth.toLowerCase();
    const cocokTahun = !selectedYear || Number(item.tahun) === Number(selectedYear);
    const cocokRole = !selectedRole || (item.role || "").trim().toLowerCase() === selectedRole.trim().toLowerCase();
    return cocokNama && cocokBulan && cocokTahun && cocokRole;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const exportToExcel = () => {
    const dataWithNo = filteredData.map((item, idx) => ({
      No: idx + 1,
      Nama: item.nama,
      Role: item.role,
      Tanggal: item.tanggal,
      "Total Gaji": item.total_salary,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataWithNo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Gaji");
    XLSX.writeFile(workbook, "laporan_gaji.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const logoImg = new Image();
    logoImg.src = "/images/logo.png";

    logoImg.onload = () => {
      doc.addImage(logoImg, "PNG", 10, 10, 30, 30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Jeep Tlogo Putri", pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Alamat: Banyuraden Gamping Sleman Yogyakarta", pageWidth / 2, 20, { align: "center" });
      doc.text("Telp. 082135664668", pageWidth / 2, 25, { align: "center" });
      doc.line(10, 40, pageWidth - 10, 40);

      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN GAJI KARYAWAN", pageWidth / 2, 45, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text(`PERIODE BULAN ${selectedMonth || "FEBRUARI"} ${selectedYear || "2025"}`, pageWidth / 2, 50, { align: "center" });

      const tableBody = filteredData.map((item) => [
        item.nama,
        item.role,
        item.tanggal,
        `Rp ${item.total_salary?.toLocaleString("id-ID") || 0}`,
      ]);

      const totalSalary = filteredData.reduce((sum, item) => sum + (item.total_salary || 0), 0);

      autoTable(doc, {
        startY: 55,
        head: [["Nama Karyawan", "Posisi", "Tanggal", "Nominal Gaji"]],
        body: [
          ...tableBody,
          [
            { content: "Total Pendapatan Gaji", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } },
            { content: `Rp ${totalSalary.toLocaleString("id-ID")}`, styles: { halign: "right", fontStyle: "bold" } },
          ],
        ],
        styles: { fontSize: 9 },
      });

      const y = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(10);
      doc.text(`Yogyakarta, 02 ${selectedMonth || "Februari"} ${selectedYear || "2025"}`, pageWidth - 10, y, { align: "right" });
      doc.text("Inuk", pageWidth - 10, y + 30, { align: "right" });
      doc.text("Ketua", pageWidth - 10, y + 36, { align: "right" });

      doc.save("laporan_gaji.pdf");
    };
  };

  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="transition-all duration-300 ease-in-out" style={{ marginLeft: isSidebarOpen ? 290 : 70 }}></div>

      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[32px] font-semibold">Laporan Gaji</h1>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Bulan</label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-sm border border-gray-300 rounded px-3 py-2">
                <option value="">Pilih Bulan</option>
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Tahun</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-sm border border-gray-300 rounded px-3 py-2">
                <option value="">Pilih Tahun</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="text-sm border border-gray-300 rounded px-3 py-2">
              <option value="">Semua Role</option>
              <option value="Owner">Owner</option>
              <option value="FO">Front Office</option>
              <option value="Driver">Driver</option>
            </select>
          </div>
        </div>

            <div className="flex flex-col gap-2">
              <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => { setExportType("excel"); setShowExportModal(true); }} className="flex items-center gap-1 bg-green-500 text-white p-2 rounded hover:bg-green-600">
                  <FileSpreadsheet size={16} /> Export Excel
                </button>
                <button onClick={() => { setExportType("pdf"); setShowExportModal(true); }} className="flex items-center gap-1 bg-red-500 text-white p-2 rounded hover:bg-red-600">
                  <FileText size={16} /> Export PDF
                </button>
              </div>
            </div>
          </div>


        <table className="w-full bg-white shadow rounded overflow-hidden mt-4">
          <thead className="bg-[#3D6CB9] text-white">
            <tr>
              <th className="p-2 text-left w-12">No</th>
              <th className="p-2 text-left w-48">Nama</th>
              <th className="p-2 text-left w-36">Posisi</th>
              <th className="p-2 text-left w-40">Tanggal</th>
              <th className="p-2 text-left w-48">Nominal Gaji</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{startIndex + index + 1}</td>
                <td className="p-2">{item.nama}</td>
                <td className="p-2">{item.role}</td>
                <td className="p-2">{item.tanggal}</td>
                <td className="p-2">Rp {item.total_salary.toLocaleString("id-ID")}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#3D6CB9] text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
            <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-4">Pratinjau Data yang Akan Diekspor ({exportType.toUpperCase()})</h2>
              <p className="mb-2 text-sm text-gray-600">Menampilkan {filteredData.length} data sesuai filter.</p>
              <table className="w-full text-sm border text-center">
                <thead className="bg-[#3D6CB9] text-white">
                  <tr>
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border">Role</th>
                    <th className="p-2 border">Tanggal</th>
                    <th className="p-2 border">Nominal Gaji</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{idx + 1}</td>
                      <td className="p-2 border">{item.nama}</td>
                      <td className="p-2 border">{item.role}</td>
                      <td className="p-2 border">{item.tanggal}</td>
                      <td className="p-2 border">Rp {item.total_salary?.toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-2 text-center text-gray-500">Tidak ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowExportModal(false)} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
                <button onClick={() => {
                  if (exportType === "excel") exportToExcel();
                  else if (exportType === "pdf") exportToPDF();
                  setShowExportModal(false);
                }} className="px-4 py-2 bg-[#3D6CB9] text-white rounded">Ekspor</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(Page);