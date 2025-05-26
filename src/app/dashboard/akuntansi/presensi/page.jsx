"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { FaCalendarAlt } from "react-icons/fa";
import { RotateCcw } from "react-feather";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function RekapPresensiList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const calendarRef = useRef();

  const toggleDatePicker = () => {
    setTempDate(selectedDate);
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const applyDateFilter = () => {
    setSelectedDate(tempDate);
    setIsDatePickerOpen(false);
  };

  const resetFilter = () => {
    setSelectedDate(null);
    setTempDate(null);
    setIsDatePickerOpen(false);
  };

  async function fetchData() {
    try {
      setLoading(true);
      let url = "http://localhost:8000/api/rekap-presensi/all";
      if (selectedDate) {
        const dateStr = selectedDate.toISOString().split("T")[0];
        url += `?date=${dateStr}`;
      }
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleExportExcel = () => {
    if (data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Presensi");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(
      blob,
      `rekap_presensi_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleExportPDF = () => {
    if (!data || data.length === 0) return;

    const doc = new jsPDF();
    doc.text("Rekap Presensi", 14, 10);

    const tableColumn = [
      "ID",
      "User ID",
      "Nama Lengkap",
      "No HP",
      "Role",
      "Tgl Bergabung",
      "Bulan",
      "Tahun",
      "Jumlah Kehadiran",
    ];

    const tableRows = data.map((item) => [
      item.id_presensi,
      item.user_id,
      item.nama_lengkap,
      item.no_hp || "-",
      item.role || "-",
      new Date(item.tanggal_bergabung).toLocaleDateString(),
      item.bulan,
      item.tahun,
      item.jumlah_kehadiran,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [22, 160, 133],
      },
      alternateRowStyles: {
        fillColor: [238, 238, 238],
      },
      margin: { top: 10 },
    });

    const filename = `rekap_presensi_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="flex relative bg-gray-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-black">Presensi</h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative" ref={calendarRef}>
            <button
              onClick={selectedDate ? resetFilter : toggleDatePicker}
              className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black cursor-pointer"
            >
              {selectedDate ? (
                <>
                  <RotateCcw size={20} />
                  <span>Set Ulang</span>
                </>
              ) : (
                <>
                  <FaCalendarAlt size={20} />
                  <span>Pilih Tanggal</span>
                </>
              )}
            </button>

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
                    onClick={() => setIsDatePickerOpen(false)}
                    className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={applyDateFilter}
                    disabled={!tempDate}
                    className={`px-4 py-2 rounded cursor-pointer ${
                      tempDate
                        ? "bg-[#B8D4F9] text-black hover:bg-[#3D6CB9] hover:text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Pilih Tanggal
                  </button>
                </div>
              </div>
            )}
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
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : data.length === 0 ? (
          <p>Data tidak ditemukan.</p>
        ) : (
          <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8">
            <table className="min-w-full table-auto bg-white text-sm">
              <thead className="bg-[#3D6CB9] text-white">
                <tr>
                  <th className="px-4 py-3 text-center">ID Presensi</th>
                  <th className="px-4 py-3 text-center">User ID</th>
                  <th className="px-4 py-3 text-left">Nama Lengkap</th>
                  <th className="px-4 py-3 text-center">No HP</th>
                  <th className="px-4 py-3 text-center">Role</th>
                  <th className="px-4 py-3 text-center">Tanggal Bergabung</th>
                  <th className="px-4 py-3 text-center">Bulan</th>
                  <th className="px-4 py-3 text-center">Tahun</th>
                  <th className="px-4 py-3 text-center">Jumlah Kehadiran</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {data.map((item) => (
                  <tr
                    key={item.id_presensi}
                    className="hover:bg-gray-100 border-b"
                  >
                    <td className="px-4 py-2 text-center">
                      {item.id_presensi}
                    </td>
                    <td className="px-4 py-2 text-center">{item.user_id}</td>
                    <td className="px-4 py-2">{item.nama_lengkap}</td>
                    <td className="px-4 py-2 text-center">
                      {item.no_hp || "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {item.role || "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {new Date(item.tanggal_bergabung).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">{item.bulan}</td>
                    <td className="px-4 py-2 text-center">{item.tahun}</td>
                    <td className="px-4 py-2 text-center">
                      {item.jumlah_kehadiran}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(RekapPresensiList);
