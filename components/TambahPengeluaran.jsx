"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Fungsi pembantu untuk format tanggal
const formatDateForAPI = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`; // Format YYYY-MM-DD untuk API
};

const formatDateForDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`; // Format DD-MM-YYYY untuk tampilan
};


const TambahPengeluaran = ({ isOpen, onClose, onAddData, initialDate }) => {
    const [formData, setFormData] = useState({
        issue_date: "",
        amount: "",
        information: "",
        action: "", // Kategori/Aksi pengeluaran
        other_category_info: "", // Informasi tambahan untuk kategori "Lain-lain"
    });
    const [selectedFile, setSelectedFile] = useState(null); // State untuk file yang dipilih
    const [selectedDateForPicker, setSelectedDateForPicker] = useState(initialDate || new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Kategori pengeluaran yang bisa dipilih
    const expenditureCategories = [
        { value: "", label: "Pilih Kategori" },
        { value: "gaji", label: "Gaji Karyawan" },
        { value: "operasional", label: "Biaya Operasional" },
        { value: "pemeliharaan", label: "Pemeliharaan Aset" },
        { value: "pembelian_barang", label: "Pembelian Barang" },
        { value: "lain_lain", label: "Lain-lain (isi di bawah)" }, // Ubah label untuk kejelasan
    ];

    useEffect(() => {
        if (isOpen) {
            const dateToUse = initialDate || new Date();
            setSelectedDateForPicker(dateToUse);
            setFormData({
                issue_date: formatDateForDisplay(dateToUse),
                amount: "",
                information: "",
                action: "", // Reset kategori
                other_category_info: "", // Reset juga other_category_info
            });
            setSelectedFile(null); // Reset file saat modal dibuka
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
            issue_date: formatDateForDisplay(date),
        }));
    };

    const handleFileChange = (e) => {
        // Mengambil file pertama yang dipilih
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const validateForm = () => {
        // Validasi field yang wajib diisi
        if (!formData.amount || !formData.information || !selectedDateForPicker || !formData.action) {
            alert("Harap isi semua field yang wajib diisi (Tanggal, Jumlah, Keterangan, Kategori)!");
            return false;
        }

        // Validasi tambahan jika 'Lain-lain' dipilih
        if (formData.action === "lain_lain" && !formData.other_category_info.trim()) {
            alert("Harap isi keterangan untuk kategori 'Lain-lain'.");
            return false;
        }

        // Validasi jumlah (amount)
        const parsedAmount = parseFloat(formData.amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Jumlah harus berupa angka positif.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // **PENTING: Gunakan FormData untuk mengirim file**
            const dataToSend = new FormData();
            dataToSend.append('issue_date', formatDateForAPI(selectedDateForPicker));
            dataToSend.append('amount', parseFloat(formData.amount));
            dataToSend.append('information', formData.information);

            // Tentukan nilai 'action' yang akan dikirim berdasarkan pilihan dropdown
            if (formData.action === "lain_lain") {
                dataToSend.append('action', formData.other_category_info); // Gunakan input teks untuk kategori 'Lain-lain'
            } else {
                dataToSend.append('action', formData.action); // Gunakan nilai dari dropdown
            }
            
            // Tambahkan file jika ada yang dipilih
            if (selectedFile) {
                dataToSend.append('file_upload', selectedFile); // 'file_upload' adalah nama field yang diharapkan backend Anda
            }

            console.log("Data yang akan dikirim (FormData):", dataToSend); // Ini akan menampilkan objek FormData, bukan isinya langsung

            // Endpoint POST untuk menambah data pengeluaran
            const response = await fetch('http://localhost:8000/api/expenditures/create', {
                method: 'POST',
                // **PENTING: JANGAN set Content-Type: 'application/json' ketika mengirim FormData**
                // Browser akan otomatis mengatur Content-Type: 'multipart/form-data'
                body: dataToSend,
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Kesalahan HTTP! Status: ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += `, Pesan: ${errorJson.message || JSON.stringify(errorJson)}`;
                } catch {
                    errorMessage += `, Respons: ${errorText.substring(0, 100)}...`;
                }
                throw new Error(errorMessage);
            }

            // Memicu event kustom agar `PengeluaranPage` tahu untuk memuat ulang data
            window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));

            alert("Data pengeluaran berhasil ditambahkan!");
            onClose(); // Tutup modal
        } catch (error) {
            console.error("Kesalahan menambahkan data pengeluaran:", error);
            alert(`Gagal menambahkan data pengeluaran: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all relative">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Tambah Data Pengeluaran Baru
                </h2>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    {/* ID Pengeluaran dan ID Penggajian tidak lagi ditampilkan di form */}
                    {/* Karena akan di-generate/ditangani oleh backend */}

                    <div className="mb-4">
                        <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Pengeluaran <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            selected={selectedDateForPicker}
                            onChange={handleDateChange}
                            dateFormat="dd-MM-yyyy"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            wrapperClassName="w-full"
                            id="issue_date"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah (Rp) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="Contoh: 150000"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                            min="0"
                            step="any"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="information" className="block text-sm font-medium text-gray-700 mb-1">
                            Keterangan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="information"
                            id="information"
                            rows="3"
                            value={formData.information}
                            onChange={handleInputChange}
                            placeholder="Contoh: Pembelian alat tulis kantor"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
                            Kategori Pengeluaran <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="action"
                            id="action"
                            value={formData.action}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        >
                            {expenditureCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Input untuk "Lain-lain" dan file - Ini adalah bagian kondisionalnya */}
                    {formData.action === "lain_lain" && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="other_category_info" className="block text-sm font-medium text-gray-700 mb-1">
                                    Detail Kategori Lainnya <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="other_category_info"
                                    id="other_category_info"
                                    value={formData.other_category_info}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Pembayaran listrik bulanan"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required // Ini akan wajib diisi jika "lain_lain" dipilih
                                />
                            </div>
                        </>
                    )}
                    
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahPengeluaran;