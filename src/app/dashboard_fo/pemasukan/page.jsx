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
  const calendarRef = useRef(null);

  // Populating the table with example data
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

  // Tutup kalender saat klik di luar elemen
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

  return (
    <div className="flex relative bg-blue-50">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6 relative">
        <h1 className="text-4xl font-semibold mb-6 text-blue-600">Pemasukan</h1>

        {/* Toolbar atas */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow relative">
          {/* Kolom Kalender */}
          <div className="flex-1 flex items-center gap-4 justify-start">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <CalendarDays size={24} />
              <span className="text-base font-medium">Kalender</span>
            </button>
            {isDatePickerOpen && (
              <div
                ref={calendarRef}
                className="absolute z-50 mt-2 ml-6 bg-white border rounded shadow-lg"
                style={{ top: "100px", left: "200px" }} // Atur posisi sesuai keinginan
              >
                <DatePicker
                  selected={new Date()}
                  onChange={(date) => console.log(date)}
                  inline
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            )}
          </div>

          {/* Kolom Tombol Export */}
          <div className="flex gap-4 justify-end">
            <button className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
            <button className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
              <FileText size={18} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Tabel Data Pemasukan */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            Data Pemasukan
          </h2>
          <table className="min-w-full table-auto border-collapse bg-blue-100 rounded-lg overflow-hidden">
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
              {dataPemasukan.map((item, index) => (
                <tr key={index} className="border-b hover:bg-blue-50">
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
