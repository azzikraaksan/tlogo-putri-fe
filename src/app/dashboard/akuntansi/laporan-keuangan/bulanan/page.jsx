"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { FileSpreadsheet, FileText } from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const months = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const tableHeaders = [
  "ID Laporan",
  "Tanggal Laporan",
  "Kas Masuk",
  "Operasional",
  "Pengeluaran",
  "Kas Bersih",
  "Operasi Bersih",
  "Jumlah Jeep",
];

function formatRupiah(amount) {
  return (
    amount?.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    }) || "Rp0"
  );
}

function formatDateFull(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const BulananPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dataBulanan, setDataBulanan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCleanOperations, setTotalCleanOperations] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/reports/bulan",
        {
          params: { bulan: selectedMonth, tahun: selectedYear },
        }
      );
      const data = response.data || [];

      setDataBulanan(data);

      const totalCleanOps = data.reduce(
        (acc, item) => acc + (Number(item.clean_operations) || 0),
        0
      );
      setTotalCleanOperations(totalCleanOps);
    } catch (error) {
      console.error("Gagal memuat data laporan bulanan:", error);
      setDataBulanan([]);
      setTotalCleanOperations(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8000/api/reports/generate", {
        bulan: selectedMonth,
        tahun: selectedYear,
      });
      fetchData();
    } catch (error) {
      console.error("Gagal generate laporan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateSimple = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleExportExcel = () => {
    const wsData = [
      [
        "ID Laporan",
        "Tanggal Laporan",
        "Kas (Cash)",
        "Biaya Operasional (Operational)",
        "Pengeluaran (Expenditure)",
        "Net Kas (Net Cash)",
        "Operasi Bersih (Clean Operations)",
        "Jumlah Jeep (Jeep Amount)",
      ],
      ...dataBulanan.map((r) => [
        r.report_id,
        formatDateSimple(r.report_date),
        r.cash.toLocaleString("id-ID", { style: "currency", currency: "IDR" }),
        r.operational.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        r.expenditure.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        r.net_cash.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        r.clean_operations.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
        r.jeep_amount,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Report");
    XLSX.writeFile(wb, "laporan_report.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const columns = [
      "ID Laporan",
      "Tanggal Laporan",
      "Kas (Cash)",
      "Biaya Operasional (Operational)",
      "Pengeluaran (Expenditure)",
      "Net Kas (Net Cash)",
      "Operasi Bersih (Clean Operations)",
      "Jumlah Jeep (Jeep Amount)",
    ];

    const rows = dataBulanan.map((r) => [
      r.report_id,
      formatDateSimple(r.report_date),
      r.cash.toLocaleString("id-ID", { style: "currency", currency: "IDR" }),
      r.operational.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      r.expenditure.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      r.net_cash.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      r.clean_operations.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
      r.jeep_amount,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [61, 108, 185] },
    });

    doc.save("laporan_report.pdf");
  };
  

  return (
    <div className="flex relative bg-white min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Laporan Bulanan</h1>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
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
                  : "bg-blue-700 hover:bg-blue-400 text-white hover:text-black"
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

        {isLoading ? (
          <div className="text-center p-10 text-lg">
            Memuat data laporan bulanan...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <div className="max-h-[600px] overflow-y-auto">
              <table
                border="1"
                cellPadding="8"
                style={{ borderCollapse: "collapse", width: "100%" }}
                className="min-w-full bg-white text-sm"
              >
                <thead className="bg-blue-700 text-white sticky top-0 z-10">
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th
                        key={header}
                        className="p-2 text-center whitespace-nowrap"
                        style={{
                          borderTopLeftRadius:
                            index === 0 ? "0.5rem" : undefined,
                          borderTopRightRadius:
                            index === tableHeaders.length - 1
                              ? "0.5rem"
                              : undefined,
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataBulanan.length === 0 ? (
                    <tr>
                      <td
                        colSpan={tableHeaders.length}
                        className="text-center p-4 text-gray-500 font-medium"
                      >
                        Data Tidak Ditemukan untuk Bulan{" "}
                        {new Date(
                          selectedYear,
                          selectedMonth - 1
                        ).toLocaleString("id-ID", { month: "long" })}{" "}
                        {selectedYear}
                      </td>
                    </tr>
                  ) : (
                    dataBulanan.map((report) => (
                      <tr
                        key={report.report_id}
                        className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                      >
                        <td className="p-3 whitespace-nowrap">
                          {report.report_id}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {formatDateFull(report.report_date)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {formatRupiah(Number(report.cash))}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {formatRupiah(Number(report.operational))}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {formatRupiah(Number(report.expenditure))}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {formatRupiah(Number(report.net_cash))}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {formatRupiah(Number(report.clean_operations))}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {report.jeep_amount !== null
                            ? report.jeep_amount
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-4">
          <strong>Total Operasi Bersih: </strong>
          <span>{formatRupiah(totalCleanOperations)}</span>
        </div>
      </div>
    </div>
  );
};

export default withAuth(BulananPage);
