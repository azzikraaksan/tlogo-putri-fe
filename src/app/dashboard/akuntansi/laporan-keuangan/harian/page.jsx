"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DailyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/dailyreports/alldaily"
      );
      setReports(response.data);
    } catch (error) {
      console.error("Gagal mengambil laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await axios.get("http://127.0.0.1:8000/api/dailyreports/generate-report");
      alert("Laporan berhasil digenerate");
      fetchReports();
    } catch (error) {
      alert("Gagal generate laporan");
    } finally {
      setGenerating(false);
    }
  };

  // Filter reports by selectedDate (match date only, ignore time)
  const filteredData = useMemo(() => {
    if (!selectedDate) return reports;

    return reports.filter((r) => {
      const reportDate = new Date(r.arrival_time);
      return (
        reportDate.getFullYear() === selectedDate.getFullYear() &&
        reportDate.getMonth() === selectedDate.getMonth() &&
        reportDate.getDate() === selectedDate.getDate()
      );
    });
  }, [reports, selectedDate]);

  const handleExportExcel = () => {
    const wsData = [
      [
        "ID Laporan Harian",
        "ID Pemesanan",
        "ID Gaji",
        "No. LB",
        "Paket Tur",
        "Keterangan",
        "Kode",
        "Marketing",
        "Kas",
        "OOP",
        "Driver Bayar",
        "Total Kas",
        "Jumlah",
        "Harga",
        "Driver Terima",
        "Tamu Bayar",
        "Waktu Tiba",
      ],
      ...filteredData.map((r) => [
        r.id_daily_report,
        r.booking_id,
        r.salaries_id,
        r.stomach_no,
        r.touring_packet,
        r.information,
        r.code,
        r.marketing,
        r.cash,
        r.oop,
        r.pay_driver,
        r.total_cash,
        r.amount,
        r.price,
        r.driver_accept,
        r.paying_guest,
        new Date(r.arrival_time).toLocaleString(),
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Harian");
    XLSX.writeFile(wb, "laporan_harian.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const columns = [
      "ID Laporan Harian",
      "ID Pemesanan",
      "ID Gaji",
      "No. LB",
      "Paket Tur",
      "Keterangan",
      "Kode",
      "Marketing",
      "Kas",
      "OOP",
      "Driver Bayar",
      "Total Kas",
      "Jumlah",
      "Harga",
      "Driver Terima",
      "Tamu Bayar",
      "Waktu Tiba",
    ];

    const rows = filteredData.map((r) => [
      r.id_daily_report,
      r.booking_id,
      r.salaries_id,
      r.stomach_no,
      r.touring_packet,
      r.information,
      r.code,
      r.marketing,
      r.cash,
      r.oop,
      r.pay_driver,
      r.total_cash,
      r.amount,
      r.price,
      r.driver_accept,
      r.paying_guest,
      new Date(r.arrival_time).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [61, 108, 185] },
    });

    doc.save("laporan_harian.pdf");
  };

  const openDatePicker = () => {
    setTempDate(selectedDate);
    setShowDatePicker(true);
  };

  const handleCancelDate = () => {
    setTempDate(null);
    setShowDatePicker(false);
  };

  const handleApplyDate = () => {
    setSelectedDate(tempDate);
    setShowDatePicker(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 pb-10">
        <UserMenu />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Laporan Harian
          </h1>
        </div>

        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <button
                onClick={openDatePicker}
                className="flex items-center gap-2 min-w-[160px] px-5 py-2 bg-[#3D6CB9] text-white rounded-lg shadow-md hover:bg-[#B8D4F9] transition-colors duration-300"
              >
                <CalendarDays className="w-5 h-5" />
                <span>
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Pilih Tanggal"}
                </span>
              </button>

              {showDatePicker && (
                <div className="absolute z-20 mt-2 bg-white border rounded-lg shadow-lg p-4">
                  <DatePicker
                    selected={tempDate}
                    onChange={(date) => setTempDate(date)}
                    inline
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={handleCancelDate}
                      className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleApplyDate}
                      className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white cursor-pointer"
                    >
                      Pilih Tanggal
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`min-w-[160px] px-5 py-2 text-white rounded-lg shadow-md transition-colors duration-300 ${
                generating
                  ? "bg-[#7FA6DD] cursor-not-allowed"
                  : "bg-[#3D6CB9] hover:bg-[#B8D4F9]"
              }`}
            >
              {generating ? "Menggenerate..." : "Generate Laporan"}
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

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-300">
            <table className="min-w-full text-sm">
              <thead className="bg-[#3D6CB9] text-white">
                <tr>
                  {[
                    "ID Laporan Harian",
                    "ID Pemesanan",
                    "ID Gaji",
                    "No. LB",
                    "Paket Tur",
                    "Keterangan",
                    "Kode",
                    "Marketing",
                    "Kas",
                    "OOP",
                    "Driver Bayar",
                    "Total Kas",
                    "Jumlah",
                    "Harga",
                    "Driver Terima",
                    "Tamu Bayar",
                    "Waktu Tiba",
                  ].map((header, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 border-b font-medium text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={17} className="text-center py-6 text-gray-500">
                      Tidak ada data laporan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((report, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border-b">
                        {report.id_daily_report}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {report.booking_id}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {report.salaries_id}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {report.stomach_no}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {report.touring_packet}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {report.information}
                      </td>
                      <td className="px-3 py-2 border-b">{report.code}</td>
                      <td className="px-3 py-2 border-b">{report.marketing}</td>
                      <td className="px-3 py-2 border-b">{report.cash}</td>
                      <td className="px-3 py-2 border-b">{report.oop}</td>
                      <td className="px-3 py-2 border-b">
                        {report.pay_driver}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {report.total_cash}
                      </td>
                      <td className="px-3 py-2 border-b">{report.amount}</td>
                      <td className="px-3 py-2 border-b">{report.price}</td>
                      <td className="px-3 py-2 border-b">
                        {report.driver_accept}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {report.paying_guest}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {new Date(report.arrival_time).toLocaleString()}
                      </td>
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
}

export default withAuth(DailyReportsPage);
