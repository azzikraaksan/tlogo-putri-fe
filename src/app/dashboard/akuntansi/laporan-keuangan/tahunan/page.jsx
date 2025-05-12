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
  const calendarRef = useRef(null);
  const [formData, setFormData] = useState({
    idLaporan: "",
    idPemasukan: "",
    idPengeluaran: "",
    pengeluaran: "",
    jumlahJeep: "",
    hariTanggal: "",
    operasional: "",
    operasionalBersih: "",
    kas: "",
  });

  const exampleData = [
    {
      idLaporan: 1,
      idPemasukan: 101,
      idPengeluaran: 201,
      pengeluaran: "Rp 2.000.000",
      jumlahJeep: 5,
      hariTanggal: "01 Januari 2024",
      operasional: "Rp 3.000.000",
      operasionalBersih: "Rp 1.000.000",
      kas: "Rp 4.000.000",
    },
    {
      idLaporan: 2,
      idPemasukan: 102,
      idPengeluaran: 202,
      pengeluaran: "Rp 1.500.000",
      jumlahJeep: 4,
      hariTanggal: "02 Januari 2024",
      operasional: "Rp 2.500.000",
      operasionalBersih: "Rp 1.000.000",
      kas: "Rp 3.500.000",
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
      idLaporan: "",
      idPemasukan: "",
      idPengeluaran: "",
      pengeluaran: "",
      jumlahJeep: "",
      hariTanggal: "",
      operasional: "",
      operasionalBersih: "",
      kas: "",
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex relative bg-white-50 min-h-screen">
      <UserMenu />
      <Sidebar />

      <div className="flex-1 p-6 relative">
        <h1 className="text-[32px] font-bold mb-6 text-black">Tahunan</h1>

        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex gap-4 items-center">
                            {/* Pilih Tanggal */}
                            <div className="relative">
                              <button
                                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                className="flex items-center gap-2 bg-[#3D6CB9] text-black-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow text-white"
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

        {/* Table */}
        <div className="mt-8">
          <div className="flex justify-end items-center mb-4">
            <button className="text-[#3D6CB9] hover:text-blue-800 text-base font-medium">
              Lihat Semua
            </button>
          </div>

          <div className="rounded-lg overflow-x-auto">
            <table className="min-w-full table-auto bg-white text-sm">
              <thead>
                <tr className="bg-[#3D6CB9] text-white">
                  {[
                    "ID Laporan",
                    "ID Pemasukan (PK)",
                    "ID Pengeluaran",
                    "Pengeluaran",
                    "Jumlah Jeep",
                    "Hari / Tanggal",
                    "Operasional",
                    "Operasional Bersih",
                    "Kas",
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
                    <td className="p-3">{item.idLaporan}</td>
                    <td className="p-3">{item.idPemasukan}</td>
                    <td className="p-3">{item.idPengeluaran}</td>
                    <td className="p-3">{item.pengeluaran}</td>
                    <td className="p-3">{item.jumlahJeep}</td>
                    <td className="p-3">{item.hariTanggal}</td>
                    <td className="p-3">{item.operasional}</td>
                    <td className="p-3">{item.operasionalBersih}</td>
                    <td className="p-3">{item.kas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-1/2 max-h-[90vh] overflow-y-auto">
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
