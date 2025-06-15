"use client";

import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = "https://tpapi.siunjaya.id/api";

const formatDateForAPI = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? null : `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const formatDateForDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? "" : `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`;
};

const TambahPengeluaran = ({ isOpen, onClose, onAddData, initialDate }) => {
    const [formData, setFormData] = useState({
        issue_date: "",
        amount: "",
        information: "",
        action: "",
        other_category_info: "",
    });
    const [selectedDateForPicker, setSelectedDateForPicker] = useState(initialDate || new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const expenditureCategories = [
        { value: "", label: "Pilih Kategori" },
        { value: "Gaji", label: "Gaji Karyawan" },
        { value: "Operasional", label: "Biaya Operasional" },
        { value: "Pemeliharaan", label: "Pemeliharaan Aset" },
        { value: "Pembelian Barang", label: "Pembelian Barang" },
        { value: "Lain-Lain", label: "Lain-lain (isi di bawah)" },
    ];

    useEffect(() => {
        if (isOpen) {
            const dateToUse = initialDate || new Date();
            setSelectedDateForPicker(dateToUse);
            setFormData({
                issue_date: formatDateForDisplay(dateToUse),
                amount: "",
                information: "",
                action: "",
                other_category_info: "",
            });
        }
    }, [isOpen, initialDate]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleDateChange = useCallback((date) => {
        setSelectedDateForPicker(date);
        setFormData((prev) => ({
            ...prev,
            issue_date: formatDateForDisplay(date),
        }));
    }, []);

    const validateForm = useCallback(() => {
        const { amount, information, action, other_category_info } = formData;

        if (!amount || !information || !selectedDateForPicker || !action) {
            alert("Harap isi semua field yang wajib diisi (Tanggal, Jumlah, Keterangan, Kategori)!");
            return false;
        }

        if (action === "lain_lain" && !other_category_info.trim()) {
            alert("Harap isi keterangan untuk kategori 'Lain-lain'.");
            return false;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Jumlah harus berupa angka positif.");
            return false;
        }
        
        // Pastikan jumlah tidak memiliki terlalu banyak desimal jika DB hanya DECIMAL(X,2)
        // Atau jika Anda menggunakan BIGINT di DB, pastikan tidak ada desimal sama sekali di sini.
        // Contoh: Jika DB DECIMAL(15,2), dan user input 123.456, ini akan dipotong menjadi 123.45
        // Jika DB BIGINT, dan user input 123.45, ini akan dibulatkan atau error.
        // Asumsi DB Anda sekarang DECIMAL(15, 2)
        if (parsedAmount.toString().split('.')[1]?.length > 2) {
             alert("Jumlah hanya bisa memiliki maksimal 2 angka di belakang koma.");
             return false;
        }

        return true;
    }, [formData, selectedDateForPicker]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                issue_date: formatDateForAPI(selectedDateForPicker),
                // Pastikan amount dikirim sebagai float jika backend mengharapkan numerik/decimal
                // Ini sudah dilakukan dengan parseFloat(formData.amount)
                amount: parseFloat(formData.amount),
                information: formData.information,
                action: formData.action === "lain_lain" ? formData.other_category_info : formData.action,
            };

            // Log payload di konsol browser untuk debugging


            const response = await fetch(`${API_BASE_URL}/expenditures/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', // Tambahkan header Accept
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Kesalahan HTTP! Status: ${response.status}. `;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += `Pesan: ${errorJson.message || JSON.stringify(errorJson)}.`;
                } catch {
                    errorMessage += `Respons mentah: ${errorText.substring(0, 200)}...`;
                }
                throw new Error(errorMessage);
            }

            window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));

            alert("Data pengeluaran berhasil ditambahkan!");
            onClose();
        } catch (error) {
            alert(`Gagal menambahkan data pengeluaran: ${error.message}.`);
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

                    {formData.action === "lain_lain" && (
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
                                required
                            />
                        </div>
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