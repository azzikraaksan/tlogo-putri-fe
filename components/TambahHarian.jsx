// D:\laragon\www\tlogo-putri-fe\components\TambahHarian.jsx
"use client";

import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

// Komponen modal Tambah Laporan Harian
const TambahHarian = ({ isOpen, onClose, onAddData }) => {
  const [formData, setFormData] = useState({
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
    waktuTiba: "", // Format bebas, bisa string "HH:MM"
  });

  // Efek samping untuk mereset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData({
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
    }
  }, [isOpen]);

  // Handler perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi sederhana (sesuaikan dengan kebutuhan Anda)
    if (
      !formData.idPemesanan ||
      !formData.noLB ||
      !formData.paket ||
      !formData.keterangan ||
      !formData.kas ||
      !formData.totalKas ||
      !formData.jumlah ||
      !formData.harga ||
      !formData.tamuBayar
    ) {
      alert("Harap lengkapi semua field yang wajib diisi!");
      return;
    }

    // Pastikan nilai numerik dikonversi ke angka jika diperlukan untuk perhitungan
    // Namun, karena contoh Anda menggunakan string untuk angka, kita akan menyimpannya sebagai string
    // Jika Anda ingin melakukan perhitungan, Anda perlu mengkonversinya saat digunakan
    const dataToSave = {
      ...formData,
      // Contoh konversi jika Anda ingin menyimpannya sebagai angka:
      // kas: parseFloat(formData.kas) || 0,
      // opp: parseFloat(formData.opp) || 0,
      // driverBayar: parseFloat(formData.driverBayar) || 0,
      // totalKas: parseFloat(formData.totalKas) || 0,
      // jumlah: parseInt(formData.jumlah, 10) || 0,
      // harga: parseFloat(formData.harga) || 0,
      // driverTerima: parseFloat(formData.driverTerima) || 0,
      // tamuBayar: parseFloat(formData.tamuBayar) || 0,
      // tunai: parseFloat(formData.tunai) || 0,
      // debit: parseFloat(formData.debit) || 0,
    };

    onAddData(dataToSave); // Mengirim data baru ke parent (HarianPage)
  };

  // Jika modal tidak terbuka, jangan render apa pun
  if (!isOpen) return null;

  return (
    // Wrapper modal dengan overlay dan efek blur
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Tambah Data Laporan Harian Baru
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          title="Tutup"
          aria-label="Tutup Modal"
        >
          <XCircle size={24} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"> {/* Tambah overflow-y-auto */}
          <div>
            <label htmlFor="idPemesanan" className="block text-sm font-medium text-gray-700 mb-1">
              ID Pemesanan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="idPemesanan"
              name="idPemesanan"
              value={formData.idPemesanan}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="idGaji" className="block text-sm font-medium text-gray-700 mb-1">
              ID Gaji
            </label>
            <input
              type="text"
              id="idGaji"
              name="idGaji"
              value={formData.idGaji}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="noLB" className="block text-sm font-medium text-gray-700 mb-1">
              No. LB <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="noLB"
              name="noLB"
              value={formData.noLB}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="paket" className="block text-sm font-medium text-gray-700 mb-1">
              Paket <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="paket"
              name="paket"
              value={formData.paket}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows="2"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="kode" className="block text-sm font-medium text-gray-700 mb-1">
              Kode
            </label>
            <input
              type="text"
              id="kode"
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="marketing" className="block text-sm font-medium text-gray-700 mb-1">
              Marketing
            </label>
            <input
              type="text"
              id="marketing"
              name="marketing"
              value={formData.marketing}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="kas" className="block text-sm font-medium text-gray-700 mb-1">
              Kas <span className="text-red-500">*</span>
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="kas"
              name="kas"
              value={formData.kas}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="opp" className="block text-sm font-medium text-gray-700 mb-1">
              OPP
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="opp"
              name="opp"
              value={formData.opp}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="driverBayar" className="block text-sm font-medium text-gray-700 mb-1">
              Driver Bayar
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="driverBayar"
              name="driverBayar"
              value={formData.driverBayar}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="totalKas" className="block text-sm font-medium text-gray-700 mb-1">
              Total Kas <span className="text-red-500">*</span>
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="totalKas"
              name="totalKas"
              value={formData.totalKas}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah <span className="text-red-500">*</span>
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="jumlah"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-1">
              Harga <span className="text-red-500">*</span>
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="harga"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="driverTerima" className="block text-sm font-medium text-gray-700 mb-1">
              Driver Terima
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="driverTerima"
              name="driverTerima"
              value={formData.driverTerima}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="tamuBayar" className="block text-sm font-medium text-gray-700 mb-1">
              Tamu Bayar <span className="text-red-500">*</span>
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="tamuBayar"
              name="tamuBayar"
              value={formData.tamuBayar}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="tunai" className="block text-sm font-medium text-gray-700 mb-1">
              Tunai
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="tunai"
              name="tunai"
              value={formData.tunai}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="debit" className="block text-sm font-medium text-gray-700 mb-1">
              Debit
            </label>
            <input
              type="text" // Ubah ke text untuk mempertahankan format string
              id="debit"
              name="debit"
              value={formData.debit}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="waktuTiba" className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Tiba
            </label>
            <input
              type="time" // Menggunakan type="time"
              id="waktuTiba"
              name="waktuTiba"
              value={formData.waktuTiba}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahHarian;
