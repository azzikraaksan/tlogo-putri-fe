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

const DriverDataPage = () => {
  const [dataDriver, setDataDriver] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    idDriver: "",
    idJeep: "",
    platJeep: "",
    fotoJeep: "",
    idOwner: "",
    namaLengkap: "",
    email: "",
    noHp: "",
    alamat: "",
    tanggalGabung: "",
    status: "",
  });

  const exampleData = [
    {
      idDataDriver: 1,
      idDriver: 301,
      idJeep: 401,
      platJeep: "AB 1234 CD",
      fotoJeep: "/path/to/photo1.jpg",
      idOwner: 501,
      namaLengkap: "John Doe",
      email: "johndoe@example.com",
      noHp: "081234567890",
      alamat: "Jl. Merdeka No. 10, Jakarta",
      tanggalGabung: "01 Januari 2023",
      status: "Aktif",
    },
    {
      idDataDriver: 2,
      idDriver: 302,
      idJeep: 402,
      platJeep: "BC 5678 EF",
      fotoJeep: "/path/to/photo2.jpg",
      idOwner: 502,
      namaLengkap: "Jane Smith",
      email: "janesmith@example.com",
      noHp: "082345678901",
      alamat: "Jl. Raya No. 20, Bandung",
      tanggalGabung: "15 Januari 2023",
      status: "Tidak Aktif",
    },
  ];

  useEffect(() => {
    setDataDriver(exampleData);
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
    setSelectedDate(date);
    setIsDatePickerOpen(false); // Tutup setelah pilih tanggal
    console.log("Tanggal dipilih:", date);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setDataDriver([...dataDriver, formData]);
    setFormData({
      idDriver: "",
      idJeep: "",
      platJeep: "",
      fotoJeep: "",
      idOwner: "",
      namaLengkap: "",
      email: "",
      noHp: "",
      alamat: "",
      tanggalGabung: "",
      status: "",
    });
    setShowFormModal(false);
  };

  return (
    <div className="flex relative bg-blue-50 min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6 relative">
        <h1 className="text-4xl font-semibold mb-6 text-blue-600">
          Data Driver
        </h1>

        {/* Toolbar atas */}
        <div className="flex items-center justify-between mb-6 p-0 relative">
          <div className="flex-1 flex items-center gap-4 justify-start relative">
            {/* Tombol Pilih Tanggal */}
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 bg-blue-600 text-black hover:bg-gray-100 px-4 py-2 rounded-lg shadow"
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

        {/* Tabel Data */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Data Driver
          </h2>
          <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">ID Data Driver</th>
                <th className="p-3 text-left">ID Driver</th>
                <th className="p-3 text-left">ID Jeep</th>
                <th className="p-3 text-left">Plat Jeep</th>
                <th className="p-3 text-left">Foto Jeep</th>
                <th className="p-3 text-left">ID Owner</th>
                <th className="p-3 text-left">Nama Lengkap</th>
                <th className="p-3 text-left">E-mail</th>
                <th className="p-3 text-left">No. HP</th>
                <th className="p-3 text-left">Alamat</th>
                <th className="p-3 text-left">Tanggal Gabung</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataDriver.map((item, index) => (
                <tr key={index} className="border-b hover:bg-blue-50">
                  <td className="p-3">{item.idDataDriver}</td>
                  <td className="p-3">{item.idDriver}</td>
                  <td className="p-3">{item.idJeep}</td>
                  <td className="p-3">{item.platJeep}</td>
                  <td className="p-3">
                    <img
                      src={item.fotoJeep}
                      alt={`Foto Jeep ${item.platJeep}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{item.idOwner}</td>
                  <td className="p-3">{item.namaLengkap}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.noHp}</td>
                  <td className="p-3">{item.alamat}</td>
                  <td className="p-3">{item.tanggalGabung}</td>
                  <td className="p-3">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form Tambah */}
        {showFormModal && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-1/2">
              <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                Tambah Data Driver
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  {Object.keys(formData).map((key) => (
                    <div key={key}>
                      <label className="block mb-2 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </label>
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
    </div>
  );
};

export default withAuth(DriverDataPage);
