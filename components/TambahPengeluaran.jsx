"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatDateToInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`; 
};

const formatDateDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return ""; 
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`; 
};

const TambahPengeluaran = ({ isOpen, onClose, onAddData, existingDataLength, initialDate }) => {
  const [formData, setFormData] = useState({
    idPenggajian: "",
    tglPengeluaran: formatDateDisplay(initialDate || new Date()), 
    total: "",
    keterangan: "",
  });
  const [selectedDateForPicker, setSelectedDateForPicker] = useState(initialDate || new Date());


  useEffect(() => {
    if (isOpen) {
      const dateToUse = initialDate || new Date();
      setSelectedDateForPicker(dateToUse);
      setFormData({
        idPenggajian: "",
        tglPengeluaran: formatDateDisplay(dateToUse),
        total: "",
        keterangan: "",
      });
    }
  }, [isOpen, initialDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSelectedDateForPicker(date);
    setFormData((prev) => ({
      ...prev,
      tglPengeluaran: formatDateDisplay(date),
    }));
  };

  const validateForm = () => {
    if (!formData.idPenggajian || !formData.total || !formData.keterangan || !formData.tglPengeluaran) {
      alert("Harap isi semua field yang wajib diisi!");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newData = {
      ...formData,
      idPengeluaran: `PG-${(existingDataLength + 1).toString().padStart(3, "0")}`,
    };
    onAddData(newData);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all"> 
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Tambah Data Pengeluaran Baru
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="idPenggajian" className="block text-sm font-medium text-gray-700 mb-1">
              ID Penggajian <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="idPenggajian"
              id="idPenggajian"
              value={formData.idPenggajian}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tglPengeluaran" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Pengeluaran <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={selectedDateForPicker}
              onChange={handleDateChange}
              dateFormat="dd-MM-yyyy" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              wrapperClassName="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
              Total <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="total"
              id="total"
              value={formData.total}
              onChange={handleInputChange}
              placeholder="Rp X.xxx.xxx"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan <span className="text-red-500">*</span>
            </label>
            <textarea
              name="keterangan"
              id="keterangan"
              rows="3"
              value={formData.keterangan}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahPengeluaran;