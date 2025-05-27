"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import axios from "axios";
import { FileSpreadsheet, FileText } from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatRupiah = (angka) => {
  const number = parseFloat(angka);
  if (isNaN(number)) return "-";
  return number.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};

const TriwulanPage = ({ children = null }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalNetCashTriwulan, setTotalNetCashTriwulan] = useState(0);

  const quarters = [
    { value: 1, label: "Triwulan 1" },
    { value: 2, label: "Triwulan 2" },
    { value: 3, label: "Triwulan 3" },
    { value: 4, label: "Triwulan 4" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Fetch data awal saat komponen mount
  useEffect(() => {
    fetchData(selectedQuarter, selectedYear);
  }, []);

  // Fungsi fetch data dari API dengan filter triwulan dan tahun
  const fetchData = async (quarter, year) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/reports/triwulan",
        {
          params: {
            quarter,
            year,
          },
        }
      );
      setData(response.data);

      const total = response.data.reduce(
        (sum, item) => sum + parseFloat(item.total_net_cash || 0),
        0
      );
      setTotalNetCashTriwulan(total);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi handler klik tombol buat laporan otomatis (fetch data ulang sesuai filter)
  const handleGenerateReport = () => {
    fetchData(selectedQuarter, selectedYear);
  };

  const handleExportExcel = () => {
    const columns = [
      "Tahun",
      "Bulan",
      "Minggu",
      "Total Cash",
      "Total Operational",
      "Total Expenditure",
      "Total Net Cash",
      "Total Clean Operations",
      "Total Jeep Amount",
    ];

    const wsData = [
      columns,
      ...data.map((item) => [
        item.tahun || "-",
        item.bulan || "-",
        item.minggu || "-",
        Number(item.total_cash).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        Number(item.total_operational).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        Number(item.total_expenditure).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        Number(item.total_net_cash).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        Number(item.total_clean_operations).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        item.total_jeep_amount || "-",
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Data");
    XLSX.writeFile(wb, "laporan_data.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const columns = [
      "Tahun",
      "Bulan",
      "Minggu",
      "Total Cash",
      "Total Operational",
      "Total Expenditure",
      "Total Net Cash",
      "Total Clean Operations",
      "Total Jeep Amount",
    ];

    const rows = data.map((item) => [
      item.tahun || "-",
      item.bulan || "-",
      item.minggu || "-",
      Number(item.total_cash).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      Number(item.total_operational).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      Number(item.total_expenditure).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      Number(item.total_net_cash).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      Number(item.total_clean_operations).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      item.total_jeep_amount || "-",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [61, 108, 185] },
    });

    doc.save("laporan_data.pdf");
  };

  return (
    <div className="flex relative bg-white-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
        <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
          Laporan Triwulan
        </h1>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black"
              >
                {quarters.map((quarter) => (
                  <option key={quarter.value} value={quarter.value}>
                    {quarter.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                isLoading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#3D6CB9] hover:bg-[#B8D4F9] text-white hover:text-black"
              }`}
            >
              <span>Buat Laporan Otomatis</span>
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

        {isLoading ? (
          <div className="text-center p-10">
            Memuat data laporan triwulan...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-[#3D6CB9] text-white">
                  <tr>
                    {[
                      "Tahun",
                      "Bulan",
                      "Minggu",
                      "Total Cash",
                      "Total Operational",
                      "Total Expenditure",
                      "Total Net Cash",
                      "Total Clean Operations",
                      "Total Jeep Amount",
                    ].map((header, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 border-b border-gray-300 font-semibold text-left whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all">
                      <td className="px-4 py-3 border-b border-gray-200">
                        {item.tahun}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        {item.bulan}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        {item.minggu}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        {formatRupiah(item.total_cash)}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        {formatRupiah(item.total_operational)}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        {formatRupiah(item.total_expenditure)}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        {formatRupiah(item.total_net_cash)}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        {formatRupiah(item.total_clean_operations)}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        {item.total_jeep_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
          <span className="font-bold text-lg">Total Kas:</span>
          <span className="text-lg font-semibold text-[#3D6CB9]">
            {formatRupiah(totalNetCashTriwulan)}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
};

export default withAuth(TriwulanPage);
