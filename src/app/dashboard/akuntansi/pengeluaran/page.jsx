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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

const PengeluaranPage = () => {
  // State untuk data dan filter
  const [dataPengeluaran, setDataPengeluaran] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idPengeluaran: "",
    idPenggajian: "",
    tglPengeluaran: "",
    total: "",
    keterangan: "",
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const calendarRef = useRef(null);
  const router = useRouter();

  // Data contoh
  const exampleData = [
    {
      idPengeluaran: "PG-001",
      idPenggajian: "GJ-001",
      tglPengeluaran: "17-05-2025",
      total: "Rp 2.500.000",
      keterangan: "Pembelian alat kantor",
    },
    {
      idPengeluaran: "PG-002",
      idPenggajian: "GJ-002",
      tglPengeluaran: "18-05-2025",
      total: "Rp 5.000.000",
      keterangan: "Gaji karyawan",
    },
    {
      idPengeluaran: "PG-003",
      idPenggajian: "GJ-003",
      tglPengeluaran: "19-05-2025",
      total: "Rp 1.200.000",
      keterangan: "Maintenance server",
    },
  ];

  useEffect(() => {
    // Simulasi loading data
    setIsLoading(true);
    setTimeout(() => {
      setDataPengeluaran(exampleData);
      setFilteredData(exampleData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Format tanggal
  const formatDate = (date) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // Filter berdasarkan tanggal
  const applyDateFilter = () => {
    if (!tempDate) return;
    const formatted = formatDate(tempDate);
    const filtered = dataPengeluaran.filter(
      (item) => item.tglPengeluaran === formatted
    );
    setSelectedDate(tempDate);
    setFilteredData(filtered);
    setIsDatePickerOpen(false);
  };

  const resetFilter = () => {
    setSelectedDate(null);
    setFilteredData(dataPengeluaran);
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validasi form
  const validateForm = () => {
    if (!formData.idPenggajian || !formData.total || !formData.keterangan) {
      alert("Harap isi semua field yang wajib diisi!");
      return false;
    }
    return true;
  };

  // Tambah data
  const handleAdd = () => {
    if (!validateForm()) return;
    
    const newData = {
      ...formData,
      idPengeluaran: `PG-${(dataPengeluaran.length + 1).toString().padStart(3, "0")}`,
      tglPengeluaran: formData.tglPengeluaran || formatDate(new Date()),
    };
    
    setDataPengeluaran([...dataPengeluaran, newData]);
    setFilteredData([...dataPengeluaran, newData]);
    setIsModalOpen(false);
    setFormData({
      idPengeluaran: "",
      idPenggajian: "",
      tglPengeluaran: "",
      total: "",
      keterangan: "",
    });
  };

  // Edit data
  const handleEdit = (id) => {
    const dataToEdit = dataPengeluaran.find(
      (item) => item.idPengeluaran === id
    );
    if (dataToEdit) {
      setFormData(dataToEdit);
      setEditId(id);
      setIsModalOpen(true);
    }
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    
    const updatedData = dataPengeluaran.map((item) =>
      item.idPengeluaran === editId ? formData : item
    );
    
    setDataPengeluaran(updatedData);
    setFilteredData(updatedData);
    setIsModalOpen(false);
    setFormData({
      idPengeluaran: "",
      idPenggajian: "",
      tglPengeluaran: "",
      total: "",
      keterangan: "",
    });
    setEditId(null);
  };

  // Hapus data
  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const filtered = dataPengeluaran.filter(
        (item) => item.idPengeluaran !== id
      );
      setDataPengeluaran(filtered);
      setFilteredData(filtered);
    }
  };

  // Export data
  const getFileName = (ext) => {
    if (selectedDate) {
      const formatted = formatDate(selectedDate).replace(/-/g, "");
      return `data_pengeluaran_${formatted}.${ext}`;
    }
    return `data_pengeluaran_semua.${ext}`;
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Data kosong, tidak bisa export Excel!");
      return;
    }
    
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pengeluaran");
      XLSX.writeFile(wb, getFileName("xlsx"));
    } catch (error) {
      console.error("Export Excel error:", error);
      alert("Gagal export Excel!");
    }
  };

  const handleExportPDF = () => {
    if (filteredData.length === 0) {
      alert("Data kosong, tidak bisa export PDF!");
      return;
    }
    try {
      const doc = new jsPDF();
      const tableColumn = [
        "ID Pengeluaran",
        "ID Penggajian",
        "Tanggal Pengeluaran",
        "Total",
        "Keterangan",
      ];
      const tableRows = filteredData.map((item) => [
        item.idPengeluaran,
        item.idPenggajian,
        item.tglPengeluaran,
        item.total,
        item.keterangan,
      ]);
      // doc.autoTable({ head: [tableColumn], body: tableRows }); // Bagian ini masih error pas mau di-export
      doc.save(getFileName("pdf"));
    } catch (error) {
      console.error("Export PDF error:", error);
      alert("Gagal export PDF!");
    }
  };

  return (
    <div className="flex relative bg-white-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
          Pengeluaran
        </h1>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
            <div className="relative" ref={calendarRef}>
              {!selectedDate ? (
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                >
                  <CalendarDays size={20} />
                  <span>Pilih Tanggal</span>
                </button>
              ) : (
                <button
                  onClick={resetFilter}
                  className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                >
                  <RotateCcw size={20} />
                  <span>Set Ulang</span>
                </button>
              )}

              {isDatePickerOpen && (
                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
                  <DatePicker
                    selected={tempDate}
                    onChange={(date) => setTempDate(date)}
                    inline
                    dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                  />
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        setTempDate(null);
                        setIsDatePickerOpen(false);
                      }}
                      className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={applyDateFilter}
                      className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white"
                    >
                      Pilih Tanggal
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsModalOpen(true);
                setEditId(null);
                setFormData({
                  idPengeluaran: "",
                  idPenggajian: "",
                  tglPengeluaran: formatDate(new Date()),
                  total: "",
                  keterangan: "",
                });
              }}
              className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
            >
              <PlusCircle size={20} />
              <span>Tambah</span>
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleExportExcel}
              disabled={filteredData.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                filteredData.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-100 text-black hover:bg-[#B8D4F9]"
              }`}
            >
              <FileSpreadsheet size={20} color={filteredData.length === 0 ? "gray" : "green"} />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={filteredData.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                filteredData.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-red-100 text-black hover:bg-[#B8D4F9]"
              }`}
            >
              <FileText size={20} color={filteredData.length === 0 ? "gray" : "red"} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push("/lihat-semua")}
            className="text-[#3D6CB9] hover:text-blue-800 text-base font-medium"
          >
            Lihat Semua
          </button>
        </div>

        {/* Modal Tambah/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {editId ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ID Penggajian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="idPenggajian"
                    value={formData.idPenggajian}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tanggal Pengeluaran
                  </label>
                  <input
                    type="date"
                    name="tglPengeluaran"
                    value={formData.tglPengeluaran}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="total"
                    value={formData.total}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Keterangan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={editId ? handleUpdate : handleAdd}
                  className="px-4 py-2 bg-[#3D6CB9] text-white rounded hover:bg-[#2C4F8A]"
                >
                  {editId ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Tabel */}
        {!isLoading && (
          <div className="overflow-y-auto max-h-[500px] rounded-lg shadow mb-8">
            <table className="min-w-full table-auto bg-white text-sm">
              <thead className="bg-[#3D6CB9] text-white">
                <tr>
                  {[
                    "ID Pengeluaran",
                    "ID Penggajian",
                    "Tanggal Pengeluaran",
                    "Total",
                    "Keterangan",
                    "Aksi",
                  ].map((header, index, arr) => (
                    <th
                      key={header}
                      className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
                      style={{
                        borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
                        borderTopRightRadius:
                          index === arr.length - 1 ? "0.5rem" : undefined,
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center p-4 text-gray-500 font-medium"
                    >
                      Data Tidak Ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.idPengeluaran || `row-${index}`}
                      className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                    >
                      <td className="p-3">{item.idPengeluaran}</td>
                      <td className="p-3">{item.idPenggajian}</td>
                      <td className="p-3">{item.tglPengeluaran}</td>
                      <td className="p-3">{item.total}</td>
                      <td className="p-3">{item.keterangan}</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item.idPengeluaran)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.idPengeluaran)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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
};

export default withAuth(PengeluaranPage);