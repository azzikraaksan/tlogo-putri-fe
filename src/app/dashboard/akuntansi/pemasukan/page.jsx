"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { CalendarDays, FileText, FileSpreadsheet } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PemasukanPage = () => {
  const [dataPemasukan, setDataPemasukan] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  // Example data for the table
  const exampleData = [
    {
      idPemasukan: 1,
      idPengeluaran: 2,
      idTicketing: 3,
      idPemesanan: 4,
      tanggalPemesanan: "2025-04-20",
      pengeluaran: "Rp 1.000.000",
      totalBersih: "Rp 900.000",
    },
    {
      idPemasukan: 2,
      idPengeluaran: 3,
      idTicketing: 4,
      idPemesanan: 5,
      tanggalPemesanan: "2025-04-21",
      pengeluaran: "Rp 500.000",
      totalBersih: "Rp 450.000",
    },
  ];

  useEffect(() => {
    setDataPemasukan(exampleData);
  }, []);

  // Handle Date Change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  // Close calendar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mock function for export actions
  const handleExportExcel = () => {
    alert("Export Excel clicked!");
    // Logic for exporting data to Excel
  };

  const handleExportPDF = () => {
    alert("Export PDF clicked!");
    // Logic for exporting data to PDF
  };

  return (
    <div className="flex relative bg-blue-50">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6 relative">
        <h1 className="text-4xl font-semibold mb-6 text-blue-600">Pemasukan</h1>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 items-center">
            {/* Pilih Tanggal */}
            <div className="relative">
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="flex items-center gap-2 bg-blue-600 text-black-600 hover:bg-blue-200 px-4 py-2 rounded-lg shadow"
              >
                <CalendarDays size={24} />
                <span className="text-base font-medium">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Pilih Tanggal"}
                </span>
              </button>
              {isDatePickerOpen && (
                <div
                  ref={calendarRef}
                  className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12"
                >
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    inline
                    dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                  />
                  {/* Button Pilih dan Batal */}
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setIsDatePickerOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleDateChange(selectedDate)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Pilih Tanggal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Export */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg shadow"
            >
              <FileSpreadsheet size={18} color="green" />
              <span className="text-base font-medium text-black">
                Export Excel
              </span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg shadow"
            >
              <FileText size={18} color="red" />
              <span className="text-base font-medium text-black">
                Export PDF
              </span>
            </button>
          </div>
        </div>

        {/* Tabel Data Pemasukan */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600">
              Daftar Pemasukan
            </h2>

            <button className="text-blue-600 hover:text-blue-800 text-base font-medium">
              Lihat Semua
            </button>
          </div>

          <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">ID Pemasukan</th>
                <th className="p-3 text-left">ID Pengeluaran</th>
                <th className="p-3 text-left">ID Ticketing</th>
                <th className="p-3 text-left">ID Pemesanan</th>
                <th className="p-3 text-left">Tanggal Pemesanan</th>
                <th className="p-3 text-left">Pengeluaran</th>
                <th className="p-3 text-left">Total Bersih</th>
              </tr>
            </thead>
            <tbody>
              {dataPemasukan.map((item) => (
                <tr
                  key={item.idPemasukan}
                  className="border-b hover:bg-blue-50"
                >
                  <td className="p-3">{item.idPemasukan}</td>
                  <td className="p-3">{item.idPengeluaran}</td>
                  <td className="p-3">{item.idTicketing}</td>
                  <td className="p-3">{item.idPemesanan}</td>
                  <td className="p-3">{item.tanggalPemesanan}</td>
                  <td className="p-3">{item.pengeluaran}</td>
                  <td className="p-3">{item.totalBersih}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(PemasukanPage);
