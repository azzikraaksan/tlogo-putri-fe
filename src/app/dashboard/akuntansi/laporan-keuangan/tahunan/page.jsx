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

const TahunanPage = () => {
  const [dataTahunan, setDataTahunan] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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
      keterangan: "Laporan tahunan 2024",
      kode: "K001",
      marketing: "Marketing 1",
      kas: "Rp 5.000.000",
      opp: "OPP001",
      driverBayar: "Driver 1",
      totalKas: "Rp 7.000.000",
    },
    {
      idLaporanHarian: 2,
      idPemesanan: 102,
      idGaji: 202,
      noLB: "LB002",
      paket: "Paket B",
      keterangan: "Laporan tahunan 2025",
      kode: "K002",
      marketing: "Marketing 2",
      kas: "Rp 4.000.000",
      opp: "OPP002",
      driverBayar: "Driver 2",
      totalKas: "Rp 6.500.000",
    },
  ];

  useEffect(() => {
    setDataTahunan(exampleData);
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setDataTahunan((prevData) => [...prevData, formData]);
    setIsFormOpen(false);
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex relative bg-blue-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6 relative">
        <h1 className="text-4xl font-semibold mb-6 text-blue-600">Tahunan</h1>

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

        {/* Table */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600">
              Laporan Tahunan
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-base font-medium">
              Lihat Semua
            </button>
          </div>

          <table className="min-w-full table-auto border-collapse bg-blue-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white">
                {[
                  "ID Laporan Harian (FK)",
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
              {dataTahunan.map((item, index) => (
                <tr key={index} className="border-b hover:bg-blue-50">
                  <td className="p-3">{item.idLaporanHarian}</td>
                  <td className="p-3">{item.idPemesanan}</td>
                  <td className="p-3">{item.idGaji}</td>
                  <td className="p-3">{item.noLB}</td>
                  <td className="p-3">{item.paket}</td>
                  <td className="p-3">{item.keterangan}</td>
                  <td className="p-3">{item.kode}</td>
                  <td className="p-3">{item.marketing}</td>
                  <td className="p-3">{item.kas}</td>
                  <td className="p-3">{item.opp}</td>
                  <td className="p-3">{item.driverBayar}</td>
                  <td className="p-3">{item.totalKas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-1/2">
              <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                Tambah Laporan Tahunan
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  {Object.keys(formData).map((key) => (
                    <div key={key}>
                      <label className="block mb-2 capitalize">{key}</label>
                      <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleFormChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="mr-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
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
    </div>
  );
};

export default withAuth(TahunanPage);
