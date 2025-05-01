"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { CalendarDays, FileText, FileSpreadsheet, Plus, Pencil, Trash } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

const PengeluaranPage = () => {
  const [dataPengeluaran, setDataPengeluaran] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filtered, setFiltered] = useState(false);
  const calendarRef = useRef(null);
  const router = useRouter();

  const exampleData = [
    { idPengeluaran: "IDP001", idPenggajian: "IDG001", tglPengeluaran: "20-04-2025", total: "Rp 900.000", keterangan: "Sudah dibayar" },
    { idPengeluaran: "IDP002", idPenggajian: "IDG002", tglPengeluaran: "21-04-2025", total: "Rp 1.200.000", keterangan: "Belum dibayar" },
    { idPengeluaran: "IDP003", idPenggajian: "IDG003", tglPengeluaran: "22-04-2025", total: "Rp 800.000", keterangan: "Sudah dibayar" },
    { idPengeluaran: "IDP004", idPenggajian: "IDG004", tglPengeluaran: "23-04-2025", total: "Rp 1.500.000", keterangan: "Belum dibayar" },
    { idPengeluaran: "IDP005", idPenggajian: "IDG005", tglPengeluaran: "24-04-2025", total: "Rp 1.000.000", keterangan: "Sudah dibayar" },
    { idPengeluaran: "IDP006", idPenggajian: "IDG006", tglPengeluaran: "25-04-2025", total: "Rp 1.300.000", keterangan: "Belum dibayar" },
    { idPengeluaran: "IDP007", idPenggajian: "IDG007", tglPengeluaran: "26-04-2025", total: "Rp 700.000", keterangan: "Sudah dibayar" },
    { idPengeluaran: "IDP008", idPenggajian: "IDG008", tglPengeluaran: "27-04-2025", total: "Rp 1.100.000", keterangan: "Belum dibayar" },
    { idPengeluaran: "IDP009", idPenggajian: "IDG009", tglPengeluaran: "28-04-2025", total: "Rp 900.000", keterangan: "Sudah dibayar" },
    { idPengeluaran: "IDP010", idPenggajian: "IDG010", tglPengeluaran: "29-04-2025", total: "Rp 1.400.000", keterangan: "Belum dibayar" },
    { idPengeluaran: "IDP011", idPenggajian: "IDG011", tglPengeluaran: "30-04-2025", total: "Rp 1.600.000", keterangan: "Sudah dibayar" },
    { idPengeluaran: "IDP012", idPenggajian: "IDG012", tglPengeluaran: "01-05-2025", total: "Rp 1.800.000", keterangan: "Belum dibayar" },
    { idPengeluaran: "IDP013", idPenggajian: "IDG013", tglPengeluaran: "02-05-2025", total: "Rp 2.000.000", keterangan: "Sudah dibayar" },
    { idPengeluaran: "IDP014", idPenggajian: "IDG014", tglPengeluaran: "03-05-2025", total: "Rp 2.200.000", keterangan: "Belum dibayar" },
    { idPengeluaran: "IDP015", idPenggajian: "IDG015", tglPengeluaran: "04-05-2025", total: "Rp 2.400.000", keterangan: "Sudah dibayar" },
  ];

  useEffect(() => {
    setDataPengeluaran(exampleData);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);

    const formatted = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const filtered = exampleData.filter(item => item.tglPengeluaran === formatted);
    setDataPengeluaran(filtered);
    setFiltered(true);
  };

  const resetData = () => {
    setDataPengeluaran(exampleData);
    setSelectedDate(null);
    setFiltered(false);
  };

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

  const exportToExcel = () => {
    const csvContent = [
      ["ID Pengeluaran", "ID Penggajian", "Tanggal", "Total", "Keterangan"],
      ...dataPengeluaran.map(item => [
        item.idPengeluaran,
        item.idPenggajian,
        item.tglPengeluaran,
        item.total,
        item.keterangan
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "pengeluaran.csv");
    link.click();
  };

  const exportToPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.text("Daftar Pengeluaran", 10, 10);
    let y = 20;
    dataPengeluaran.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.idPengeluaran} | ${item.idPenggajian} | ${item.tglPengeluaran} | ${item.total} | ${item.keterangan}`, 10, y);
      y += 10;
    });
    doc.save("pengeluaran.pdf");
  };

  return (
    <div className="flex relative bg-blue-50">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6 relative">
        <h1 className="text-4xl font-semibold mb-6 text-blue-600">Pengeluaran</h1>

        <div className="flex items-center justify-between mb-6 p-0 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-2 rounded-lg shadow"
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
              <div className="absolute z-50 mt-2 p-4 top-16 bg-white border rounded-lg shadow-lg flex gap-6" ref={calendarRef}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                  dateFormat="dd/MM/yyyy"
                  showPopperArrow={false}
                />
              </div>
              // <div
              //   className="absolute mt-2 top-16 bg-white border rounded-lg shadow-lg flex gap-6"
              //   ref={calendarRef}
              //   style={{ zIndex: 9999 }}
              // >
              //   <DatePicker
              //     selected={selectedDate}
              //     onChange={handleDateChange}
              //     dateFormat="dd/MM/yyyy"
              //     showPopperArrow={true}
              //     onClickOutside={() => setIsDatePickerOpen(false)}
              //   />
              // </div>

            )}
          </div>
          <div className="absolute z-50 p-45">
          <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                onClick={() => router.push("/pengeluaran/tambah")}
                >
                <Plus size={18} />
                Tambah Data
                </button>
          </div>
          <div className="flex gap-4 justify-end">
            <button
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
              onClick={exportToExcel}
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
            <button
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
              onClick={exportToPDF}
            >
              <FileText size={18} />
              Export PDF
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600">Daftar Pengeluaran</h2>
            <button
              onClick={resetData}
              className="text-blue-600 hover:text-blue-800 text-base font-medium"
            >
              Lihat Semua
            </button>
          </div>

          <table className="min-w-full table-auto border-collapse bg-white-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">ID Pengeluaran</th>
                <th className="p-3 text-left">ID Penggajian</th>
                <th className="p-3 text-left">Tanggal Pengeluaran</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Keterangan</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataPengeluaran.map((item) => (
                <tr key={item.idPengeluaran} className="border-b hover:bg-blue-50">
                  <td className="p-3 text-gray-700">{item.idPengeluaran}</td>
                  <td className="p-3 text-gray-700">{item.idPenggajian}</td>
                  <td className="p-3 text-gray-700">{item.tglPengeluaran}</td>
                  <td className="p-3 text-gray-700">{item.total}</td>
                  <td className="p-3 text-gray-700">{item.keterangan}</td>
                  <td className="p-3 flex items-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                      onClick={() => router.push(`/pengeluaran/edit/${item.idPengeluaran}`)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800" title="Hapus">
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(PengeluaranPage);
