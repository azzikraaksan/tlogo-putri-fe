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
  Trash2,
  Edit,
} from "lucide-react"; // Menambahkan Edit icon
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PengeluaranPage = () => {
  const [dataPengeluaran, setDataPengeluaran] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    idPengeluaran: "",
    idPenggajian: "",
    tglPengeluaran: "",
    total: "",
    keterangan: "",
  });

  const [editingIndex, setEditingIndex] = useState(null); // Tambahkan state untuk edit
  const calendarRef = useRef(null);

  const dummyData = [
    {
      idPengeluaran: "P001",
      idPenggajian: "G001",
      tglPengeluaran: "01 Januari 2024",
      total: "Rp 1.000.000",
      keterangan: "Operasional kantor",
    },
    {
      idPengeluaran: "P002",
      idPenggajian: "G002",
      tglPengeluaran: "02 Januari 2024",
      total: "Rp 1.500.000",
      keterangan: "Perbaikan kendaraan",
    },
  ];

  useEffect(() => {
    setDataPengeluaran(dummyData);
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
    if (editingIndex !== null) {
      // Jika sedang mengedit, update data pengeluaran
      const updatedData = [...dataPengeluaran];
      updatedData[editingIndex] = formData;
      setDataPengeluaran(updatedData);
      setEditingIndex(null); // Reset editing
    } else {
      // Jika menambah data baru
      setDataPengeluaran((prevData) => [...prevData, formData]);
    }
    setIsFormOpen(false);
    setFormData({
      idPengeluaran: "",
      idPenggajian: "",
      tglPengeluaran: "",
      total: "",
      keterangan: "",
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formatted = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    setFormData((prev) => ({ ...prev, tglPengeluaran: formatted }));
    setIsDatePickerOpen(false); // Tutup kalender setelah memilih tanggal
  };

  const handleDelete = (index) => {
    const updatedData = [...dataPengeluaran];
    updatedData.splice(index, 1);
    setDataPengeluaran(updatedData);
  };

  const handleEdit = (index) => {
    setFormData(dataPengeluaran[index]);
    setEditingIndex(index);
    setIsFormOpen(true); // Open the form for editing
  };

  return (
    <div className="flex relative bg-blue-50 min-h-screen">
      <UserMenu />
      <Sidebar />

      <div className="flex-1 p-6 relative">
        <h1 className="text-4xl font-semibold mb-6 text-blue-600">
          Data Pengeluaran
        </h1>

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

            {/* Tambah */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-black hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
            >
              <PlusCircle size={20} />
              Tambah
            </button>
          </div>

          {/* Export */}
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

        {/* Tabel Data Pemasukan */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600">
            Tabel Pengeluaran
            </h2>

            <button className="text-blue-600 hover:text-blue-800 text-base font-medium">
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  {[
                    "ID Pengeluaran",
                    "ID Penggajian",
                    "Tgl Pengeluaran",
                    "Total",
                    "Keterangan",
                    "Aksi",
                  ].map((header) => (
                    <th key={header} className="p-3 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataPengeluaran.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-blue-50">
                    <td className="p-3">{item.idPengeluaran}</td>
                    <td className="p-3">{item.idPenggajian}</td>
                    <td className="p-3">{item.tglPengeluaran}</td>
                    <td className="p-3">{item.total}</td>
                    <td className="p-3">{item.keterangan}</td>
                    <td className="p-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-500 hover:text-yellow-700 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
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
                {editingIndex !== null
                  ? "Edit Pengeluaran"
                  : "Tambah Pengeluaran"}
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key}>
                      <label className="block mb-2 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={value}
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

export default withAuth(PengeluaranPage);
