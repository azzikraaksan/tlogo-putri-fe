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
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

const DriverDataPage = () => {
  // State untuk data dan filter
  const [driverData, setDriverData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    driver_id: "",
    owner_id: "",
    jeep_id: "",
    id_presensi: "",
    no_hp: "",
    email: "",
    nama_lengkap: "",
    alamat: "",
    foto_profil: "",
    no_ktp: "",
    plat_jeep: "",
    foto_jeep: "",
    tanggal_bergabung: "",
    Status: ""
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const calendarRef = useRef(null);
  const router = useRouter();

  // Data contoh
  const exampleData = [
    {
      driver_id: "DRV001",
      owner_id: "OWN001",
      jeep_id: "JEEP001",
      id_presensi: "PRES001",
      no_hp: "081234567890",
      email: "driver1@example.com",
      nama_lengkap: "John Doe",
      alamat: "Jl. Contoh No. 123",
      foto_profil: "profile1.jpg",
      no_ktp: "1234567890123456",
      plat_jeep: "B 1234 ABC",
      foto_jeep: "jeep1.jpg",
      tanggal_bergabung: "17-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV002",
      owner_id: "OWN002",
      jeep_id: "JEEP002",
      id_presensi: "PRES002",
      no_hp: "082345678901",
      email: "driver2@example.com",
      nama_lengkap: "Jane Smith",
      alamat: "Jl. Sample No. 456",
      foto_profil: "profile2.jpg",
      no_ktp: "2345678901234567",
      plat_jeep: "B 5678 DEF",
      foto_jeep: "jeep2.jpg",
      tanggal_bergabung: "18-05-2025",
      Status: "Non-Aktif"
    },
    {
      driver_id: "DRV003",
      owner_id: "OWN003",
      jeep_id: "JEEP003",
      id_presensi: "PRES003",
      no_hp: "083456789012",
      email: "",
      nama_lengkap: "Alice Johnson",
      alamat: "Jl. Example No. 789",
      foto_profil: "profile3.jpg",
      no_ktp: "3456789012345678",
      plat_jeep: "B 9012 GHI",
      foto_jeep: "jeep3.jpg",
      tanggal_bergabung: "19-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV004",
      owner_id: "OWN004",
      jeep_id: "JEEP004",
      id_presensi: "PRES004",
      no_hp: "084567890123",
      email: "",
      nama_lengkap: "Bob Brown",
      alamat: "Jl. Test No. 101",
      foto_profil: "profile4.jpg",
      no_ktp: "4567890123456789",
      plat_jeep: "B 3456 JKL",
      foto_jeep: "jeep4.jpg",
      tanggal_bergabung: "20-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV005",
      owner_id: "OWN005",
      jeep_id: "JEEP005",
      id_presensi: "PRES005",
      no_hp: "085678901234",
      email: "",
      nama_lengkap: "Charlie Davis",
      alamat: "Jl. Sample No. 202",
      foto_profil: "profile5.jpg",
      no_ktp: "5678901234567890",
      plat_jeep: "B 7890 MNO",
      foto_jeep: "jeep5.jpg",
      tanggal_bergabung: "21-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV006",
      owner_id: "OWN006",
      jeep_id: "JEEP006",
      id_presensi: "PRES006",
      no_hp: "086789012345",
      email: "",
      nama_lengkap: "David Wilson",
      alamat: "Jl. Example No. 303",
      foto_profil: "profile6.jpg",
      no_ktp: "6789012345678901",
      plat_jeep: "B 8901 PQR",
      foto_jeep: "jeep6.jpg",
      tanggal_bergabung: "22-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV007",
      owner_id: "OWN007",
      jeep_id: "JEEP007",
      id_presensi: "PRES007",
      no_hp: "087890123456",
      email: "",
      nama_lengkap: "Eve Taylor",
      alamat: "Jl. Test No. 404",
      foto_profil: "profile7.jpg",
      no_ktp: "7890123456789012",
      plat_jeep: "B 9012 STU",
      foto_jeep: "jeep7.jpg",
      tanggal_bergabung: "23-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV008",
      owner_id: "OWN008",
      jeep_id: "JEEP008",
      id_presensi: "PRES008",
      no_hp: "088901234567",
      email: "",
      nama_lengkap: "Frank Martinez",
      alamat: "Jl. Sample No. 505",
      foto_profil: "profile8.jpg",
      no_ktp: "8901234567890123",
      plat_jeep: "B 0123 VWX",
      foto_jeep: "jeep8.jpg",
      tanggal_bergabung: "24-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV009",
      owner_id: "OWN009",
      jeep_id: "JEEP009",
      id_presensi: "PRES009",
      no_hp: "089012345678",
      email: "",
      nama_lengkap: "Grace Anderson",
      alamat: "Jl. Example No. 606",
      foto_profil: "profile9.jpg",
      no_ktp: "9012345678901234",
      plat_jeep: "B 1234 YZA",
      foto_jeep: "jeep9.jpg",
      tanggal_bergabung: "25-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV010",
      owner_id: "OWN010",
      jeep_id: "JEEP010",
      id_presensi: "PRES010",
      no_hp: "090123456789",
      email: "",
      nama_lengkap: "Henry Thomas",
      alamat: "Jl. Test No. 707",
      foto_profil: "profile10.jpg",
      no_ktp: "0123456789012345",
      plat_jeep: "B 5678 ABC",
      foto_jeep: "jeep10.jpg",
      tanggal_bergabung: "26-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV011",
      owner_id: "OWN011",
      jeep_id: "JEEP011",
      id_presensi: "PRES011",
      no_hp: "091234567890",
      email: "",
      nama_lengkap: "Ivy Harris",
      alamat: "Jl. Sample No. 808",
      foto_profil: "profile11.jpg",
      no_ktp: "1234567890123456",
      plat_jeep: "B 6789 DEF",
      foto_jeep: "jeep11.jpg",
      tanggal_bergabung: "27-05-2025",
      Status: "Aktif"
    },
    {
      driver_id: "DRV012",
      owner_id: "OWN012",
      jeep_id: "JEEP012",
      id_presensi: "PRES012",
      no_hp: "092345678901",
      email: "",
      nama_lengkap: "Jack Lee",
      alamat: "Jl. Example No. 909",
      foto_profil: "profile12.jpg",
      no_ktp: "2345678901234567",
      plat_jeep: "B 7890 GHI",
      foto_jeep: "jeep12.jpg",
      tanggal_bergabung: "28-05-2025",
      Status: "Aktif"
    },
  ];

  useEffect(() => {
    // Simulasi loading data
    setIsLoading(true);
    setTimeout(() => {
      setDriverData(exampleData);
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
    const filtered = driverData.filter(
      (item) => item.tanggal_bergabung === formatted
    );
    setSelectedDate(tempDate);
    setFilteredData(filtered);
    setIsDatePickerOpen(false);
  };

  const resetFilter = () => {
    setSelectedDate(null);
    setFilteredData(driverData);
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
    if (!formData.no_hp || !formData.email || !formData.nama_lengkap) {
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
      driver_id: `DRV${(driverData.length + 1).toString().padStart(3, "0")}`,
      tanggal_bergabung: formData.tanggal_bergabung || formatDate(new Date()),
    };
    
    setDriverData([...driverData, newData]);
    setFilteredData([...driverData, newData]);
    setIsModalOpen(false);
    setFormData({
      driver_id: "",
      owner_id: "",
      jeep_id: "",
      id_presensi: "",
      no_hp: "",
      email: "",
      nama_lengkap: "",
      alamat: "",
      foto_profil: "",
      no_ktp: "",
      plat_jeep: "",
      foto_jeep: "",
      tanggal_bergabung: "",
      Status: ""
    });
  };

  // Edit data
  const handleEdit = (id) => {
    const dataToEdit = driverData.find(
      (item) => item.driver_id === id
    );
    if (dataToEdit) {
      setFormData(dataToEdit);
      setEditId(id);
      setIsModalOpen(true);
    }
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    
    const updatedData = driverData.map((item) =>
      item.driver_id === editId ? formData : item
    );
    
    setDriverData(updatedData);
    setFilteredData(updatedData);
    setIsModalOpen(false);
    setFormData({
      driver_id: "",
      owner_id: "",
      jeep_id: "",
      id_presensi: "",
      no_hp: "",
      email: "",
      nama_lengkap: "",
      alamat: "",
      foto_profil: "",
      no_ktp: "",
      plat_jeep: "",
      foto_jeep: "",
      tanggal_bergabung: "",
      Status: ""
    });
    setEditId(null);
  };

  // Hapus data
  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const filtered = driverData.filter(
        (item) => item.driver_id !== id
      );
      setDriverData(filtered);
      setFilteredData(filtered);
    }
  };

  // Export data
  const getFileName = (ext) => {
    if (selectedDate) {
      const formatted = formatDate(selectedDate).replace(/-/g, "");
      return `data_driver_${formatted}.${ext}`;
    }
    return `data_driver_semua.${ext}`;
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Data kosong, tidak bisa export Excel!");
      return;
    }
    
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Driver");
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
        "ID Driver",
        "ID Owner",
        "ID Jeep",
        "ID Presensi",
        "No. HP",
        "Email",
        "Nama Lengkap",
        "Alamat",
        "Foto Profil",
        "No. KTP",
        "Plat Jeep",
        "Tanggal Bergabung",
        "Status"
      ];
      const tableRows = filteredData.map((item) => [
        item.driver_id,
        item.owner_id,
        item.jeep_id,
        item.presensi_id,
        item.no_hp,
        item.email,
        item.nama_lengkap,
        item.alamat,
        item.foto_profil,
        item.no_ktp,
        item.plat_jeep,
        item.tanggal_bergabung,
        item.status
      ]);
      
      doc.text("Laporan Data Driver", 14, 10);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [61, 108, 185]
        }
      });
      
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
          Data Driver
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
                  driver_id: "",
                  owner_id: "",
                  jeep_id: "",
                  id_presensi: "",
                  no_hp: "",
                  email: "",
                  nama_lengkap: "",
                  alamat: "",
                  foto_profil: "",
                  no_ktp: "",
                  plat_jeep: "",
                  foto_jeep: "",
                  tanggal_bergabung: formatDate(new Date()),
                  Status: "Aktif"
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
                    "ID Driver",
                    "ID Owner",
                    "ID Jeep",
                    "ID Presensi",
                    "No HP",
                    "Email",
                    "Nama Lengkap",
                    "Alamat",
                    "Foto Profil",
                    "No KTP",
                    "Plat Jeep",
                    "Foto Jeep",
                    "Tanggal Bergabung",
                    "Status",
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
                      colSpan={7}
                      className="text-center p-4 text-gray-500 font-medium"
                    >
                      Data Tidak Ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.driver_id || `row-${index}`}
                      className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                    >
                      <td className="p-3">{item.driver_id}</td>
                      <td className="p-3">{item.owner_id}</td>
                      <td className="p-3">{item.jeep_id}</td>
                      <td className="p-3">{item.id_presensi}</td>
                      <td className="p-3">{item.no_hp}</td>
                      <td className="p-3">{item.email}</td>
                      <td className="p-3">{item.nama_lengkap}</td>
                      <td className="p-3">{item.alamat}</td>
                      <td className="p-3">{item.foto_profil}</td>
                      <td className="p-3">{item.no_ktp}</td>
                      <td className="p-3">{item.plat_jeep}</td>
                      <td className="p-3">{item.foto_jeep}</td>
                      <td className="p-3">{item.tanggal_bergabung}</td>
                      <td className="p-3">{item.Status}</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item.driver_id)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.driver_id)}
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

        {/* Modal Tambah/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {editId ? "Edit Driver" : "Tambah Driver"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    No HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tanggal Bergabung
                  </label>
                  <input
                    type="date"
                    name="tanggal_bergabung"
                    value={formData.tanggal_bergabung}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Plat Jeep
                  </label>
                  <input
                    type="text"
                    name="plat_jeep"
                    value={formData.plat_jeep}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
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
      </div>
    </div>
  );
};

export default withAuth(DriverDataPage);