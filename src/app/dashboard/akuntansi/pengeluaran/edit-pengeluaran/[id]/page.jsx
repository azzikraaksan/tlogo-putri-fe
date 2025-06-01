"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Fungsi pembantu untuk format tanggal (TETAP SAMA)
const formatDateForAPI = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Format tanggal untuk tampilan (DD-MM-YYYY) (TETAP SAMA)
const formatDateForDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Parsing tanggal dari string ke Date object (TETAP SAMA)
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
        expenditure_id: "",
        issue_date: "",
        amount: "",
        information: "",
        action: "",
        other_category_info: "", // Untuk kategori 'Lain-lain'
    });

    const [selectedDateForPicker, setSelectedDateForPicker] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Kategori pengeluaran yang bisa dipilih (SAMA SEPERTI TAMBAH)
    const expenditureCategories = [
        { value: "", label: "Pilih Kategori" },
        { value: "gaji", label: "Gaji Karyawan" },
        { value: "operasional", label: "Biaya Operasional" },
        { value: "pemeliharaan", label: "Pemeliharaan Aset" },
        { value: "pembelian_barang", label: "Pembelian Barang" },
        { value: "lain_lain", label: "Lain-lain (isi di bawah)" },
    ];

    const fetchExpenditureDetail = useCallback(async () => {
        if (!expenditure_id) return setIsLoading(false);
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/expenditures/${expenditure_id}`);
            if (!response.ok) {
                const errorText = await response.text();
                let msg = `Kesalahan HTTP! Status: ${response.status}`;
                try {
                    const json = JSON.parse(errorText);
                    msg += `, Pesan: ${json.message || JSON.stringify(json)}`;
                } catch {
                    msg += `, Respons: ${errorText.substring(0, 100)}...`;
                }
                throw new Error(msg);
            }

            const result = await response.json();
            const dataToEdit = result.expenditure || result.data || result;

            if (dataToEdit) {
                let initialAction = dataToEdit.action || "";
                let initialOtherCategoryInfo = "";

                const isPredefinedCategory = expenditureCategories.some(
                    (cat) => cat.value === initialAction
                );

                if (!isPredefinedCategory && initialAction) {
                    initialOtherCategoryInfo = initialAction;
                    initialAction = "lain_lain";
                }

                setFormData({
                    expenditure_id: dataToEdit.expenditure_id || "",
                    // salaries_id tidak lagi diambil dari API dan tidak ditampilkan
                    issue_date: formatDateForDisplay(dataToEdit.issue_date) || "",
                    amount: dataToEdit.amount || "",
                    information: dataToEdit.information || "",
                    action: initialAction,
                    other_category_info: initialOtherCategoryInfo,
                });
                setSelectedDateForPicker(parseApiDateToDateObject(dataToEdit.issue_date));
            } else {
                alert("Data pengeluaran tidak ditemukan.");
                router.replace("/dashboard/akuntansi/pengeluaran");
            }
        } catch (error) {
            console.error("Gagal ambil data pengeluaran:", error);
            alert(`Gagal ambil data: ${error.message}`);
            router.replace("/dashboard/akuntansi/pengeluaran");
        } finally {
            setIsLoading(false);
        }
    }, [expenditure_id, router]);

    useEffect(() => {
        fetchExpenditureDetail();
    }, [fetchExpenditureDetail]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setSelectedDateForPicker(date);
        setFormData(prev => ({ ...prev, issue_date: formatDateForDisplay(date) }));
    };

    // Fungsi handleFileChange dihapus karena fitur upload gambar dihilangkan

    const validateForm = () => {
        const { amount, information, action, other_category_info } = formData;
        if (!amount || !information || !selectedDateForPicker || !action) {
            alert("Harap isi semua field yang wajib diisi (Tanggal, Jumlah, Keterangan, Kategori)!");
            return false;
        }
        if (action === "lain_lain" && !other_category_info.trim()) {
            alert("Harap isi keterangan untuk kategori 'Lain-lain'.");
            return false;
        }
        if (isNaN(amount) || parseFloat(amount) <= 0) {
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
            // Menggunakan objek plain JavaScript karena tidak ada file upload
            const dataToSend = {
                issue_date: formatDateForAPI(selectedDateForPicker),
                amount: parseFloat(formData.amount),
                information: formData.information,
            };

            if (formData.action === "lain_lain") {
                dataToSend.action = formData.other_category_info;
            } else {
                dataToSend.action = formData.action;
            }

            // Endpoint PUT untuk mengedit data pengeluaran
            const response = await fetch(`http://localhost:8000/api/expenditures/update/${expenditure_id}`, {
                method: 'PUT', // Menggunakan PUT karena tidak ada FormData
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
                } catch {
                    errorMessage += `, Respons Mentah: ${errorText.substring(0, 100)}...`;
                }
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

    if (!formData.expenditure_id && !isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg">
                    Data pengeluaran tidak ditemukan atau terjadi kesalahan.
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Edit Data Pengeluaran: {formData.expenditure_id}
                </h2>
                <button
                    onClick={handleCancel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>

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
                            disabled
                        />
                    </div>
                    {/* ID Penggajian (salaries_id) dihapus dari form */}
                    {/* <div className="mb-4">
                        <label htmlFor="salaries_id" className="block text-sm font-medium text-gray-700 mb-1">
                            ID Penggajian (Opsional)
                        </label>
                        <input
                            type="text"
                            name="salaries_id"
                            id="salaries_id"
                            value={formData.salaries_id}
                            onChange={handleInputChange}
                            placeholder="Contoh: ID Penggajian terkait"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div> */}
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
                    <div className="mb-4">
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

                    {/* Form untuk upload gambar (file_upload) dihapus dari sini */}

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
    );
};

export default EditPengeluaranPage;