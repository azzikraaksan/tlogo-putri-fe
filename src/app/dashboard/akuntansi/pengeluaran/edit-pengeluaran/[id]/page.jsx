"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Menggunakan konstanta base URL API
const API_BASE_URL = 'http://localhost:8000/api';

// Fungsi pembantu format tanggal, disamakan dengan TambahPengeluaran.js
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

// Fungsi parsing tanggal dari string (API/string lain) ke Date object (tetap dibutuhkan untuk Edit)
const parseApiDateToDateObject = (dateStr) => {
    if (!dateStr) return null;
    let d;
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
        const parts = dateStr.split("-");
        d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else {
        d = new Date(dateStr);
    }
    return isNaN(d.getTime()) ? null : d;
};

const EditPengeluaranPage = () => {
    const router = useRouter();
    const params = useParams();
    const { id: expenditure_id } = params;

    const [formData, setFormData] = useState({
        expenditure_id: "", // Ditampilkan, tapi tidak diubah pengguna
        issue_date: "",
        amount: "",
        information: "",
        action: "",
        other_category_info: "",
    });
    const [selectedDateForPicker, setSelectedDateForPicker] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Kategori pengeluaran disamakan dengan TambahPengeluaran.js
    // Perhatikan penggunaan "Lain-Lain" (kapital) untuk value
    const expenditureCategories = [
        { value: "", label: "Pilih Kategori" },
        { value: "Gaji", label: "Gaji Karyawan" },
        { value: "Operasional", label: "Biaya Operasional" },
        { value: "Pemeliharaan", label: "Pemeliharaan Aset" },
        { value: "Pembelian Barang", label: "Pembelian Barang" },
        { value: "Lain-Lain", label: "Lain-lain (isi di bawah)" },
    ];

    const fetchExpenditureDetail = useCallback(async () => {
        if (!expenditure_id) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/expenditures/${expenditure_id}`);
            if (!response.ok) {
                const errorText = await response.text();
                let msg = `Kesalahan HTTP! Status: ${response.status}`;
                try {
                    const json = JSON.parse(errorText);
                    msg += `, Pesan: ${json.message || JSON.stringify(json)}`;
                } catch { msg += `, Respons: ${errorText.substring(0, 100)}...`; }
                throw new Error(msg);
            }
            const result = await response.json();
            const dataToEdit = result.expenditure || result.data || result;

            if (dataToEdit) {
                let initialAction = dataToEdit.action || "";
                let initialOtherCategoryInfo = "";

                const isPredefinedCategory = expenditureCategories.some(
                    (cat) => cat.value === initialAction && cat.value !== ""
                );

                if (!isPredefinedCategory && initialAction) {
                    initialOtherCategoryInfo = initialAction;
                    initialAction = "Lain-Lain"; // Sesuaikan dengan value kategori baru
                }

                setFormData({
                    expenditure_id: dataToEdit.expenditure_id || "",
                    issue_date: formatDateForDisplay(dataToEdit.issue_date) || "",
                    amount: dataToEdit.amount?.toString() || "",
                    information: dataToEdit.information || "",
                    action: initialAction,
                    other_category_info: initialOtherCategoryInfo,
                });
                setSelectedDateForPicker(parseApiDateToDateObject(dataToEdit.issue_date));
            } else {
                // alert("Data pengeluaran tidak ditemukan."); // Ditangani oleh blok render di bawah
                setFormData(prev => ({ ...prev, expenditure_id: null })); // Tandai data tidak ada
            }
        } catch (error) {
            console.error("Gagal ambil data pengeluaran:", error);
            alert(`Gagal ambil data: ${error.message}`);
            setFormData(prev => ({ ...prev, expenditure_id: null })); // Tandai data tidak ada
        } finally {
            setIsLoading(false);
        }
    }, [expenditure_id, router]); // expenditureCategories bisa ditambahkan jika dinamis

    useEffect(() => {
        fetchExpenditureDetail();
    }, [fetchExpenditureDetail]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleDateChange = useCallback((date) => {
        setSelectedDateForPicker(date);
        setFormData(prev => ({ ...prev, issue_date: formatDateForDisplay(date) }));
    }, []);

    const validateForm = useCallback(() => {
        const { amount, information, action, other_category_info } = formData;
        if (!selectedDateForPicker || !amount || !information.trim() || !action) {
            alert("Harap isi semua field yang wajib diisi (Tanggal, Jumlah, Keterangan, Kategori)!");
            return false;
        }
        // Sesuaikan dengan value kategori baru "Lain-Lain"
        if (action === "Lain-Lain" && !other_category_info.trim()) {
            alert("Harap isi keterangan untuk kategori 'Lain-lain'.");
            return false;
        }
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Jumlah harus berupa angka positif.");
            return false;
        }
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
            const dataToSend = {
                issue_date: formatDateForAPI(selectedDateForPicker),
                amount: parseFloat(formData.amount),
                information: formData.information.trim(),
                // Sesuaikan dengan value kategori baru "Lain-Lain"
                action: formData.action === "Lain-Lain" ? formData.other_category_info.trim() : formData.action,
            };

            const response = await fetch(`${API_BASE_URL}/expenditures/update/${expenditure_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Kesalahan HTTP! Status: ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += `, Pesan: ${errorJson.message || JSON.stringify(errorJson)}`;
                    if (errorJson.errors) {
                        const validationErrors = Object.values(errorJson.errors).flat().join("\n");
                        errorMessage += `\nDetail Validasi Backend:\n${validationErrors}`;
                    }
                } catch { errorMessage += `, Respons Mentah: ${errorText.substring(0, 100)}...`; }
                throw new Error(errorMessage);
            }

            alert("Data berhasil diperbarui!");
            window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
            router.back();
        } catch (error) {
            console.error("Gagal update data:", error);
            alert(`Gagal update: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg">
                    Memuat data untuk diedit...
                </div>
            </div>
        );
    }

    // formData.expenditure_id bisa null jika fetch gagal atau data tidak ditemukan
    if (formData.expenditure_id === null || (formData.expenditure_id === "" && !isLoading)) {
         return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg text-center">
                    Data pengeluaran tidak ditemukan atau ID tidak valid.
                    <button
                        onClick={handleCancel}
                        className="mt-6 px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }
    // Style container utama disamakan dengan TambahPengeluaran
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            {/* Penyesuaian style pada div inner modal */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all relative max-h-[90vh] overflow-y-auto"> {/* max-h dan overflow-y-auto dipertahankan untuk form panjang */}
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Edit Data Pengeluaran {/* ID bisa tetap di judul jika diinginkan atau cukup di field */}
                </h2>
                <button
                    onClick={handleCancel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit}>
                    {/* ID Pengeluaran (diletakkan paling atas, disabled) */}
                    <div className="mb-4">
                        <label htmlFor="expenditure_id_display" className="block text-sm font-medium text-gray-700 mb-1">
                            ID Pengeluaran
                        </label>
                        <input
                            type="text"
                            id="expenditure_id_display"
                            value={formData.expenditure_id}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                            disabled
                        />
                    </div>

                    {/* Tanggal Pengeluaran */}
                    <div className="mb-4">
                        <label htmlFor="issue_date_edit" className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Pengeluaran <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            selected={selectedDateForPicker}
                            onChange={handleDateChange}
                            dateFormat="dd-MM-yyyy"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            wrapperClassName="w-full"
                            id="issue_date_edit" // ID unik untuk edit form
                            autoComplete="off"
                            required
                        />
                    </div>

                    {/* Jumlah (Rp) */}
                    <div className="mb-4">
                        <label htmlFor="amount_edit" className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah (Rp) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="amount"
                            id="amount_edit" // ID unik untuk edit form
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="Contoh: 150000"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                            min="0.01" // Jumlah harus lebih dari 0
                            step="0.01" // Untuk desimal (sesuaikan jika perlu integer)
                        />
                    </div>

                    {/* Keterangan */}
                    <div className="mb-4">
                        <label htmlFor="information_edit" className="block text-sm font-medium text-gray-700 mb-1">
                            Keterangan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="information"
                            id="information_edit" // ID unik untuk edit form
                            rows="3"
                            value={formData.information}
                            onChange={handleInputChange}
                            placeholder="Contoh: Pembelian alat tulis kantor"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        ></textarea>
                    </div>

                    {/* Kategori Pengeluaran (menggunakan mb-6 seperti di TambahPengeluaran) */}
                    <div className="mb-6">
                        <label htmlFor="action_edit" className="block text-sm font-medium text-gray-700 mb-1">
                            Kategori Pengeluaran <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="action"
                            id="action_edit" // ID unik untuk edit form
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

                    {/* Detail Kategori Lainnya (kondisional) */}
                    {formData.action === "Lain-Lain" && ( // Disesuaikan dengan value kategori "Lain-Lain"
                        <div className="mb-4">
                            <label htmlFor="other_category_info_edit" className="block text-sm font-medium text-gray-700 mb-1">
                                Detail Kategori Lainnya <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="other_category_info"
                                id="other_category_info_edit" // ID unik untuk edit form
                                value={formData.other_category_info}
                                onChange={handleInputChange}
                                placeholder="Contoh: Pembayaran listrik bulanan"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required={formData.action === "Lain-Lain"}
                            />
                        </div>
                    )}
                    
                    {/* Tombol Aksi Form (pt-3 disamakan dengan TambahPengeluaran) */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
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
                            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPengeluaranPage;