"use client";
import { useState, useRef, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import {
  CalendarDays,
  FileText,
  FileSpreadsheet,
  PlusCircle,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HarianPage = () => {
  const [dataHarian, setDataHarian] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // ✅ Tambahkan state untuk selectedDate
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    idLaporanHarian: "",
    idPemesanan: "",
    idGaji: "",
    noLB: "",
    paket: "",
    keterangan: "",
    kode: "",
    marketing: "",
    kas: "",
    opp: "",
    driverBayar: "",
    totalKas: "",
  });

  const calendarRef = useRef(null);

  const exampleData = [
    {
      idLaporanHarian: 1,
      idPemesanan: 101,
      idGaji: 201,
      noLB: "LB001",
      paket: "Paket A",
      keterangan: "Keterangan contoh",
      kode: "K001",
      marketing: "Marketing 1",
      kas: "Rp 1.000.000",
      opp: "OPP001",
      driverBayar: "Driver 1",
      totalKas: "Rp 1.500.000",
    },
    {
      idLaporanHarian: 2,
      idPemesanan: 102,
      idGaji: 202,
      noLB: "LB002",
      paket: "Paket B",
      keterangan: "Keterangan kedua",
      kode: "K002",
      marketing: "Marketing 2",
      kas: "Rp 800.000",
      opp: "OPP002",
      driverBayar: "Driver 2",
      totalKas: "Rp 1.200.000",
    },
  ];

  useEffect(() => {
    setDataHarian(exampleData);
  }, []);

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

  const handleDateChange = (date) => {
    setSelectedDate(date); // ✅ Fungsi untuk mengubah tanggal
    setIsDatePickerOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setDataHarian([...dataHarian, formData]);
    setShowFormModal(false);
    setFormData({
      idLaporanHarian: "",
      idPemesanan: "",
      idGaji: "",
      noLB: "",
      paket: "",
      keterangan: "",
      kode: "",
      marketing: "",
      kas: "",
      opp: "",
      driverBayar: "",
      totalKas: "",
    });
  };

  return (
    <div className="flex relative bg-blue-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6 relative">
        <h1 className="text-4xl font-semibold mb-6 text-blue-600">Harian</h1>

        {/* Toolbar atas */}
        <div className="flex items-center justify-between mb-6 p-0 relative">
          <div className="flex-1 flex items-center gap-4 justify-start relative">
            {/* Tombol Pilih Tanggal */}
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg shadow"
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

            {/* Popup DatePicker */}
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
              </div>
            )}

            {/* Tombol Tambah */}
            <button
              onClick={() => setShowFormModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
            >
              <PlusCircle size={20} />
              Tambah
            </button>
          </div>

          {/* Tombol Export */}
          <div className="flex gap-4 justify-end">
            <button className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg shadow">
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
            <button className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg shadow">
              <FileText size={18} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Daftar Laporan Harian
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {[
                    "ID Laporan Harian",
                    "ID Pemesanan",
                    "ID Gaji",
                    "No LB",
                    "Paket",
                    "Keterangan",
                    "Kode",
                    "Marketing",
                    "Kas",
                    "OPP",
                    "Driver Bayar",
                    "Total Kas",
                  ].map((header) => (
                    <th key={header} className="p-3 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataHarian.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-blue-50">
                    {Object.values(item).map((value, i) => (
                      <td key={i} className="p-3">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-1/2">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6">
              Tambah Laporan Harian
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-6">
                {Object.keys(formData).map((key) => (
                  <div key={key}>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(HarianPage);
