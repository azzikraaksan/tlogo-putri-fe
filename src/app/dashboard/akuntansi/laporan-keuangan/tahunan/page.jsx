"use client";

import { useState, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import axios from "axios";
import { FileSpreadsheet, FileText } from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ReportTahun() {
  // States utama
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tambahan states untuk kontrol UI
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataTahunan, setDataTahunan] = useState([]);
  const [totalNetCashTahunan, setTotalNetCashTahunan] = useState(0);

  // Format Rupiah utility
  const formatRupiah = (number) => {
    return number.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  };

  // Ambil laporan awal
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/reports/tahun?year=${selectedYear}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setReport(data[0] || null); // pastikan ada data
        setDataTahunan(data);
        if (data[0]) setTotalNetCashTahunan(Number(data[0].total_net_cash));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedYear]);

  // Inisialisasi tahun (misal 5 tahun terakhir)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const generatedYears = [];
    for (let y = currentYear; y >= currentYear - 5; y--) {
      generatedYears.push(y);
    }
    setYears(generatedYears);
  }, []);

  // Handler buat laporan otomatis (placeholder)
  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/reports/generate`,
        { year: selectedYear }
      );
      if (response.status === 200) {
        setReport(response.data[0]);
        setDataTahunan(response.data);
        setTotalNetCashTahunan(Number(response.data[0].total_net_cash));
      }
    } catch (error) {
      alert("Gagal membuat laporan otomatis: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    const wsData = [
      [
        "ID Laporan Tahunan",
        "Tahun",
        "Total Cash",
        "Total Operational",
        "Total Expenditure",
        "Total Net Cash",
        "Total Clean Operations",
        "Total Jeep Amount",
      ],
      ...dataTahunan.map((r) => [
        r.id_laporan_tahunan || "-", // sesuaikan nama properti ID tahunan kalau ada
        r.tahun || r.year || "-", // pastikan data tahunan punya properti ini
        Number(r.total_cash).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        Number(r.total_operational).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        Number(r.total_expenditure).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        Number(r.total_net_cash).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        Number(r.total_clean_operations).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        r.total_jeep_amount || "-",
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Tahunan");
    XLSX.writeFile(wb, "laporan_tahunan.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const columns = [
      "ID Laporan Tahunan",
      "Tahun",
      "Total Cash",
      "Total Operational",
      "Total Expenditure",
      "Total Net Cash",
      "Total Clean Operations",
      "Total Jeep Amount",
    ];

    const rows = dataTahunan.map((r) => [
      r.id_laporan_tahunan || "-",
      r.tahun || r.year || "-",
      Number(r.total_cash).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      Number(r.total_operational).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      Number(r.total_expenditure).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      Number(r.total_net_cash).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      Number(r.total_clean_operations).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      r.total_jeep_amount || "-",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [61, 108, 185] },
    });

    doc.save("laporan_tahunan.pdf");
  };
  

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!report) return <p>No data available</p>;

  return (
    <div className="flex relative bg-white min-h-screen">
      <Sidebar />
      <UserMenu />
      <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black">
          Laporan Tahunan
        </h1>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
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

            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                isLoading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-400 text-white hover:text-black"
              }`}
            >
              Buat Laporan Otomatis
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="bg-[#3D6CB9] text-white font-semibold px-5 py-2 rounded cursor-pointer hover:bg-[#2b4d80] transition"
            >
              Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-[#3D6CB9] text-white font-semibold px-5 py-2 rounded cursor-pointer hover:bg-[#2b4d80] transition"
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* Tabel horizontal dengan scroll jika perlu */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-300">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                {[
                  "ID Laporan Tahunan",
                  "Tahun",
                  "Total Cash",
                  "Total Operational",
                  "Total Expenditure",
                  "Total Net Cash",
                  "Total Clean Operations",
                  "Total Jeep Amount",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 border-b border-gray-300 font-semibold text-left whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              <tr>
                <td className="px-10 py-6 border-b border-gray-200 whitespace-nowrap">
                  {report.id_laporan_tahunan || "-"}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                  {report.tahun || "-"}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                  {formatRupiah(Number(report.total_cash))}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                  {formatRupiah(Number(report.total_operational))}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                  {formatRupiah(Number(report.total_expenditure))}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                  {formatRupiah(Number(report.total_net_cash))}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                  {formatRupiah(Number(report.total_clean_operations))}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                  {report.total_jeep_amount || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="fixed bottom-4 right-4 bg-white text-black px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 z-20 border border-gray-300">
          <span className="font-bold text-lg">Total Kas Bersih:</span>
          <span className="text-lg font-semibold text-blue-700">
            {formatRupiah(totalNetCashTahunan)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ReportTahun);
