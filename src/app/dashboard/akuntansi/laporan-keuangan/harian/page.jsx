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
  Edit,
  Trash2,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HarianPage = () => {
  const [dataHarian, setDataHarian] = useState([
    {
      idLaporanHarian: "LH001",
      idPemesanan: "PMS001",
      idGaji: "GJ001",
      noLB: "LB001",
      paket: "Tour Bromo",
      keterangan: "Berangkat tepat waktu",
      kode: "K001",
      marketing: "Dina",
      kas: "500000",
      opp: "OPP001",
      driverBayar: "300000",
      totalKas: "800000",
      jumlah: "2",
      harga: "150000",
      driverTerima: "300000",
      tamuBayar: "500000",
      tunai: "400000",
      debit: "100000",
      waktuTiba: "08:00",
    },
    {
      idLaporanHarian: "LH002",
      idPemesanan: "PMS002",
      idGaji: "GJ002",
      noLB: "LB002",
      paket: "Tour Merapi",
      keterangan: "Cuaca cerah",
      kode: "K002",
      marketing: "Rudi",
      kas: "450000",
      opp: "OPP002",
      driverBayar: "250000",
      totalKas: "700000",
      jumlah: "3",
      harga: "100000",
      driverTerima: "250000",
      tamuBayar: "450000",
      tunai: "300000",
      debit: "150000",
      waktuTiba: "09:00",
    },
  ]);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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
    jumlah: "",
    harga: "",
    driverTerima: "",
    tamuBayar: "",
    tunai: "",
    debit: "",
    waktuTiba: "",
  });

  const calendarRef = useRef(null);

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
    setSelectedDate(date);
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
      jumlah: "",
      harga: "",
      driverTerima: "",
      tamuBayar: "",
      tunai: "",
      debit: "",
      waktuTiba: "",
    });
  };

  const handleDelete = (index) => {
    const newData = [...dataHarian];
    newData.splice(index, 1);
    setDataHarian(newData);
  };

  return (
    <div className="flex relative bg-blue-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6 relative">
        <h1 className="text-4xl font-semibold mb-6 text-blue-600">Harian</h1>

        <div className="flex items-center justify-between mb-6 p-0 relative">
          <div className="flex-1 flex items-center gap-4 justify-start relative">
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
              </div>
            )}

            <button
              onClick={() => setShowFormModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-black hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
            >
              <PlusCircle size={20} />
              Tambah
            </button>
          </div>

          {/* Tombol Export */}
          <div className="flex gap-4 justify-end">
            <button className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg shadow">
              <FileSpreadsheet size={18} color="green" />
              <span className="text-base font-medium text-black">
                Export Excel
              </span>
            </button>
            <button className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg shadow">
              <FileText size={18} color="red" />
              <span className="text-base font-medium text-black">
                Export PDF
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Daftar Laporan Harian
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow text-sm">
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
                    "Jumlah",
                    "Harga",
                    "Driver Terima",
                    "Tamu Bayar",
                    "Tunai",
                    "Debit",
                    "Waktu Tiba",
                    "Aksi",
                  ].map((header) => (
                    <th key={header} className="p-2 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataHarian.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-blue-50">
                    {Object.values(item).map((value, i) => (
                      <td key={i} className="p-2">
                        {value}
                      </td>
                    ))}
                    <td className="p-4 flex gap-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-800 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-2/3 max-h-screen overflow-y-auto">
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
