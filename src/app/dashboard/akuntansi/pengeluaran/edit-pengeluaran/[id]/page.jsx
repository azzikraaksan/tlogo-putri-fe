"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Fungsi pembantu untuk format tanggal untuk API (YYYY-MM-DD)
const formatDateForAPI = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null; // Pastikan ini objek Date yang valid
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Fungsi pembantu untuk format tanggal untuk tampilan (DD-MM-YYYY)
const formatDateForDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return ""; // Pastikan ini objek Date yang valid
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Mengonversi string tanggal dari API (asumsi YYYY-MM-DD atau ISO) menjadi objek Date
const parseApiDateToDateObject = (dateStr) => {
    if (!dateStr) return null;
    let d;
    // Coba parsing YYYY-MM-DD (format standar dari database Laravel)
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
        const parts = dateStr.split("-");
        // new Date(year, monthIndex, day) - monthIndex berbasis 0
        d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
        // Coba parsing format lain (misal: "2025-05-24 00:00:00" atau string tanggal ISO)
        d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) return null; // Pastikan hasilnya Date yang valid
    return d;
};


const EditPengeluaranPage = () => {
    const router = useRouter();
    const params = useParams();
    // Mendapatkan ID dari URL, misalnya /edit-pengeluaran/123 akan memberikan expenditure_id = "123"
    const { id: expenditure_id } = params;

    const [formData, setFormData] = useState({
        expenditure_id: "", // Hanya untuk ditampilkan, didapatkan dari URL
        salaries_id: "",    // Bisa diisi manual atau default
        issue_date: "",     // Akan jadi string DD-MM-YYYY untuk input DatePicker
        amount: "",
        information: "",
        action: "",         // Atribut 'action' (kategori)
    });
    const [selectedDateForPicker, setSelectedDateForPicker] = useState(null); // Untuk DatePicker component
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // useCallback untuk fetch detail agar tidak re-create fungsi setiap render
    const fetchExpenditureDetail = useCallback(async () => {
        if (!expenditure_id) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            // Ini adalah GET request yang mencari data untuk halaman edit
            // URL ini cocok dengan Route::get('/{id}', ...) di Laravel
            const response = await fetch(`http://localhost:8000/api/expenditures/${expenditure_id}`);
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
            const result = await response.json();
            console.log("Raw API Response for detail:", result); // Untuk debug

            // Asumsi: API mengembalikan data detail langsung sebagai objek.
            // Jika API Anda membungkusnya dalam properti 'data', gunakan: const dataToEdit = result.data;
            const dataToEdit = result;

            if (dataToEdit) {
                setFormData({
                    expenditure_id: dataToEdit.expenditure_id || "",
                    // Inisialisasi salaries_id dari data API.
                    // Jika dari API null/kosong, akan diisi string kosong,
                    // yang nanti saat submit akan di-default ke expenditure_id.
                    salaries_id: dataToEdit.salaries_id || "",
                    issue_date: formatDateForDisplay(dataToEdit.issue_date) || "",
                    amount: dataToEdit.amount || "",
                    information: dataToEdit.information || "",
                    action: dataToEdit.action || "",
                });
                // Menggunakan parseApiDateToDateObject untuk objek Date yang akan masuk ke DatePicker
                setSelectedDateForPicker(parseApiDateToDateObject(dataToEdit.issue_date));
            } else {
                alert("Data pengeluaran tidak ditemukan.");
                router.replace("/dashboard/akuntansi/pengeluaran");
            }
        } catch (error) {
            console.error("Kesalahan mengambil data pengeluaran:", error);
            alert(`Gagal mengambil data pengeluaran: ${error.message}`);
            router.replace("/dashboard/akuntansi/pengeluaran");
        } finally {
            setIsLoading(false);
        }
    }, [expenditure_id, router]); // Dependensi useCallback

    useEffect(() => {
        fetchExpenditureDetail();
    }, [fetchExpenditureDetail]); // Panggil fetchExpenditureDetail saat ID berubah atau fungsi itu sendiri di-memoize

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setSelectedDateForPicker(date);
        setFormData(prev => ({
            ...prev,
            issue_date: formatDateForDisplay(date), // Perbarui string di formData juga untuk konsistensi
        }));
    };

    const validateForm = () => {
        if (!formData.amount || !formData.information || !selectedDateForPicker || !formData.action) {
            alert("Harap isi semua field yang wajib diisi (Tanggal, Jumlah, Keterangan, Aksi)!");
            return false;
        }
        if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
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
            const dataToSend = {
                issue_date: formatDateForAPI(selectedDateForPicker), // Format tanggal untuk API
                amount: parseFloat(formData.amount),
                information: formData.information,
                action: formData.action, // Kirim 'action'
                // --- PENTING: LOGIKA DEFAULT salaries_id DI SINI ---
                // Jika input salaries_id di frontend kosong (""),
                // maka kirim nilai expenditure_id yang didapat dari useParams().
                // Jika tidak kosong, kirim nilai dari input.
                salaries_id: formData.salaries_id === "" ? expenditure_id : formData.salaries_id,
            };

            // URL ini cocok dengan Route::put('/update/{id}', ...) di Laravel
            const response = await fetch(`http://localhost:8000/api/expenditures/update/${expenditure_id}`, {
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
                        // Tampilkan pesan validasi dari Laravel jika ada
                        const validationErrors = Object.values(errorJson.errors).flat().join("\n");
                        errorMessage += `\nDetail Validasi Backend:\n${validationErrors}`;
                    }
                } catch {
                    errorMessage += `, Respons Mentah: ${errorText.substring(0, 100)}...`;
                }
                throw new Error(errorMessage);
            }

            alert("Data berhasil diperbarui!");
            // Memicu event kustom untuk memberi tahu halaman daftar agar me-refresh data
            window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
            router.back(); // Kembali ke halaman sebelumnya (halaman daftar)
        } catch (error) {
            console.error("Kesalahan memperbarui data pengeluaran:", error);
            alert(`Gagal memperbarui data pengeluaran: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back(); // Kembali ke halaman sebelumnya
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
                    Memuat data untuk diedit...
                </div>
            </div>
        );
    }

    // Jika isLoading false dan expenditure_id valid tapi formData.expenditure_id kosong (berarti data tidak ditemukan)
    if (!formData.expenditure_id && !isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
                    Data pengeluaran tidak ditemukan atau terjadi kesalahan saat memuat.
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative">
                <h2 className="text-[24px] font-medium mb-4 text-black">
                    Edit Pengeluaran: {formData.expenditure_id}
                </h2>
                <button
                    onClick={handleCancel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>

                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="expenditure_id_display" className="block text-sm font-medium text-gray-700 mb-1">
                                ID Pengeluaran
                            </label>
                            <input
                                type="text"
                                id="expenditure_id_display"
                                value={formData.expenditure_id}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                                disabled // Ini tetap disabled karena ini ID utama
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="salaries_id" className="block text-sm font-medium text-gray-700 mb-1">
                                ID Penggajian (Opsional, Default ke ID Pengeluaran jika kosong)
                            </label>
                            <input
                                type="text"
                                name="salaries_id"
                                id="salaries_id"
                                value={formData.salaries_id}
                                onChange={handleInputChange}
                                placeholder="Contoh: ID Penggajian terkait (kosongkan untuk default)"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                // <<< PENTING: ATTRIBUT 'disabled' TELAH DIHAPUS DI SINI >>>
                            />
                        </div>
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
                                id="issue_date_edit"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah <span className="text-red-500">*</span>
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
                                Aksi (Kategori) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="action"
                                id="action"
                                value={formData.action}
                                onChange={handleInputChange}
                                placeholder="Contoh: pembayaran operasional"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
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
        </div>
    );
};

export default EditPengeluaranPage;