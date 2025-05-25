"use client";

import { useState, useRef, useEffect, useCallback } from "react";
// Pastikan jalur import komponen Anda benar
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx"; // Atau UserMenu jika itu nama komponennya
import withAuth from "/src/app/lib/withAuth";
import TambahPengeluaran from "/components/TambahPengeluaran.jsx";

// Icon dari lucide-react
import {
    CalendarDays, FileText, FileSpreadsheet, PlusCircle,
    Edit, Trash2, RotateCcw,
} from "lucide-react";

// DatePicker dan style-nya
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Library untuk export
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Plugin untuk tabel di jsPDF

// Untuk navigasi ke halaman edit
import Link from "next/link";

// --- Helper Functions ---
/**
 * Format tanggal untuk tampilan (DD-MM-YYYY) dari berbagai tipe input.
 * @param {Date | string} dateInput - Objek Date atau string tanggal (ISO, YYYY-MM-DD, dll.)
 * @returns {string} Tanggal dalam format DD-MM-YYYY, atau string kosong jika input tidak valid.
 */
const formatDateToDisplay = (dateInput) => {
    if (!dateInput) return "";

    let d;
    // Coba parsing ISO string (dari database Laravel) atau string tanggal lainnya
    if (typeof dateInput === 'string') {
        // Jika string berisi 'T', coba parsing sebagai ISO string
        if (dateInput.includes('T')) {
            d = new Date(dateInput);
        } else {
            // Coba parsing sebagai YYYY-MM-DD (format umum dari input database tanpa waktu)
            const parts = dateInput.split('-');
            if (parts.length === 3 && parts[0].length === 4) {
                d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            } else {
                // Fallback ke parsing generik, mungkin kurang akurat
                d = new Date(dateInput);
            }
        }
    } else if (dateInput instanceof Date) {
        d = dateInput;
    } else {
        return ""; // Input tidak valid
    }

    if (isNaN(d.getTime())) return ""; // Pastikan tanggal valid
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Bulan berbasis 0
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

/**
 * Fungsi helper untuk memformat angka menjadi "Rp X.XXX.XXX".
 * @param {number} number - Angka yang akan diformat.
 * @returns {string} String format mata uang.
 */
const formatCurrency = (number) => {
    // Pastikan input adalah angka dan bukan NaN
    if (typeof number === 'number' && !isNaN(number)) {
        // Menggunakan toLocaleString untuk format angka dengan pemisah ribuan
        return `Rp ${number.toLocaleString("id-ID")}`;
    }
    // Mengembalikan "Rp 0" jika input bukan angka atau NaN
    return `Rp 0`;
};


const PengeluaranPage = ({ children }) => {
    const [dataPengeluaran, setDataPengeluaran] = useState([]); // Data mentah dari API
    const [filteredData, setFilteredData] = useState([]); // Data yang ditampilkan di tabel setelah difilter
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDateForFilter, setSelectedDateForFilter] = useState(null); // Tanggal yang sedang aktif sebagai filter
    const [tempDateForPicker, setTempDateForPicker] = useState(null); // Tanggal sementara di DatePicker
    const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const calendarRef = useRef(null); // Untuk mendeteksi klik di luar DatePicker

    /**
     * Menerapkan filter tanggal ke data mentah dan memperbarui `filteredData`.
     * @param {Array} rawData - Data pengeluaran mentah.
     * @param {Date | null} dateFilter - Tanggal yang digunakan untuk filter, atau null jika tidak ada filter.
     */
    const applyFilterToData = useCallback((rawData, dateFilter) => {
        if (!Array.isArray(rawData)) {
            console.warn("Data mentah untuk filter bukan array, mengatur filteredData menjadi array kosong.");
            setFilteredData([]);
            return;
        }

        if (dateFilter) {
            const formattedFilterDate = formatDateToDisplay(dateFilter);
            const filtered = rawData.filter(item => {
                // Pastikan item.issue_date ada dan bisa di-parse
                const itemDate = item.issue_date ? new Date(item.issue_date) : null;
                return itemDate && formatDateToDisplay(itemDate) === formattedFilterDate;
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(rawData); // Jika tidak ada filter, tampilkan semua data
        }
    }, []); // Dependensi kosong karena fungsi ini hanya bergantung pada parameter input

    /**
     * Mengambil data pengeluaran dari API backend.
     */
    const fetchExpenditureData = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = 'http://localhost:8000/api/expenditures/all'; // Pastikan URL ini sesuai dengan backend Laravel Anda
            console.log("[fetchExpenditureData] Fetching data from:", url);

            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Kesalahan HTTP! Status: ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += `, Pesan: ${errorJson.message || JSON.stringify(errorJson)}`;
                } catch {
                    errorMessage += `, Respons Mentah: ${errorText.substring(0, 200)}...`;
                }
                throw new Error(errorMessage);
            }
            const result = await response.json();
            console.log("[fetchExpenditureData] Raw API Response:", result);

            // Asumsi: API mengembalikan data dalam format { "salaries": [...] }
            // Sesuaikan jika format API Anda berbeda, misalnya `result.data`
            const fetchedData = Array.isArray(result.salaries) ? result.salaries : result;

            if (Array.isArray(fetchedData)) {
                setDataPengeluaran(fetchedData);
                // Setelah mendapatkan data baru, segera terapkan filter yang sedang aktif
                applyFilterToData(fetchedData, selectedDateForFilter);
            } else {
                console.warn("[fetchExpenditureData] Data respons API bukan array atau tidak memiliki kunci 'salaries':", result);
                setDataPengeluaran([]);
                setFilteredData([]); // Pastikan filteredData juga di-reset
            }
        } catch (error) {
            console.error("[fetchExpenditureData] Kesalahan mengambil data pengeluaran:", error);
            alert(`Gagal mengambil data pengeluaran dari server: ${error.message}`);
            setDataPengeluaran([]);
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    }, [applyFilterToData, selectedDateForFilter]); // `selectedDateForFilter` sebagai dependensi untuk memastikan filter tetap aktif

    // Effect untuk memuat data saat komponen mount dan saat ada event 'dataPengeluaranUpdated'
    useEffect(() => {
        fetchExpenditureData(); // Panggil saat komponen pertama kali dirender

        const handleDataUpdate = () => {
            console.log("Menerima event dataPengeluaranUpdated, memuat ulang data pengeluaran...");
            fetchExpenditureData(); // Panggil ulang untuk me-refresh data
        };

        // Mendengarkan event kustom dari TambahPengeluaran/EditPengeluaran untuk refresh tabel
        window.addEventListener('dataPengeluaranUpdated', handleDataUpdate);

        // Cleanup: hapus event listener saat komponen di-unmount
        return () => {
            window.removeEventListener('dataPengeluaranUpdated', handleDataUpdate);
        };
    }, [fetchExpenditureData]); // Dependensi useEffect

    // Panggil applyFilterToData setiap kali dataPengeluaran atau selectedDateForFilter berubah
    useEffect(() => {
        applyFilterToData(dataPengeluaran, selectedDateForFilter);
    }, [dataPengeluaran, selectedDateForFilter, applyFilterToData]);


    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker);
        setIsDatePickerOpen(false);
    };

    const resetFilter = () => {
        setSelectedDateForFilter(null);
        setTempDateForPicker(null); // Reset tempDateForPicker juga
        setIsDatePickerOpen(false); // Tutup date picker
    };

    const handleOpenTambahModal = () => {
        setIsTambahModalOpen(true);
    };

    const handleCloseTambahModal = () => {
        setIsTambahModalOpen(false);
        // Data akan otomatis di-refresh oleh event listener 'dataPengeluaranUpdated'
    };

    // handleAddDataToList tidak lagi diperlukan secara langsung karena sudah ada event listener
    const handleAddDataToList = () => {
        // Logika ini sekarang ditangani oleh `window.addEventListener('dataPengeluaranUpdated')`
        // di useEffect di atas. Ini adalah placeholder jika Anda ingin melakukan sesuatu yang lain.
    };

    /**
     * Menangani penghapusan data pengeluaran.
     * @param {string | number} expenditure_id - ID pengeluaran yang akan dihapus.
     */
    const handleDeleteAction = async (expenditure_id) => {
        if (!expenditure_id) {
            console.error("[handleDeleteAction] ID Pengeluaran tidak ditemukan atau tidak valid untuk dihapus.");
            alert("Gagal menghapus data: ID tidak valid.");
            return;
        }

        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                // Pastikan URL ini sesuai dengan rute DELETE di Laravel Anda
                // Contoh: Route::delete('/api/expenditures/{id}', 'ExpenditureController@destroy');
                const deleteUrl = `http://localhost:8000/api/expenditures/delete/${expenditure_id}`;
                console.log(`[handleDeleteAction] Mengirim DELETE request untuk ID ${expenditure_id} ke URL:`, deleteUrl);

                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json', // Penting untuk menerima JSON dari Laravel
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = `Kesalahan HTTP saat menghapus! Status: ${response.status}`;
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage += `, Pesan: ${errorJson.message || JSON.stringify(errorJson)}`;
                    } catch {
                        errorMessage += `, Respons Mentah: ${errorText.substring(0, 200)}...`;
                    }
                    throw new Error(errorMessage);
                }

                alert("Data berhasil dihapus.");
                // Setelah berhasil dihapus, pemicu event agar tabel di-refresh
                window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
            } catch (error) {
                console.error("[handleDeleteAction] Kesalahan menghapus data pengeluaran:", error);
                alert(`Gagal menghapus data pengeluaran: ${error.message}`);
            }
        }
    };

    /**
     * Membuat nama file export yang unik berdasarkan tanggal dan filter.
     * @param {string} ext - Ekstensi file (e.g., "xlsx", "pdf").
     * @returns {string} Nama file lengkap.
     */
    const getExportFileName = (ext) => {
        const date = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
        const filterInfo = selectedDateForFilter ? `_${formatDateToDisplay(selectedDateForFilter).replace(/\-/g, '')}` : '_all';
        return `laporan_pengeluaran${filterInfo}_${date}.${ext}`;
    };

    /**
     * Menangani ekspor data ke format Excel.
     */
    const handleExportExcelAction = () => {
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
            alert("Tidak ada data untuk diekspor ke Excel (sesuai filter saat ini)!");
            return;
        }
        try {
            const dataToExport = filteredData.map(item => ({
                "ID Pengeluaran": item.expenditure_id,
                "ID Penggajian": item.salaries_id || "N/A", // Asumsi ada field salaries_id
                "Tanggal Pengeluaran": formatDateToDisplay(item.issue_date),
                "Total": parseFloat(item.amount), // Pastikan ini number untuk excel
                "Keterangan": item.information,
                "Kategori": item.action,
            }));
            const ws = XLSX.utils.json_to_sheet(dataToExport);

            // Tambahkan formatting untuk kolom 'Total' jika perlu
            // Ini bisa agak tricky tergantung bagaimana Anda ingin Excel menampilkannya
            // Umumnya, jika datanya number, Excel akan otomatis memformatnya.
            // Jika Anda ingin format kustom di Excel, ini bisa jadi lebih kompleks.

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pengeluaran");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Kesalahan export Excel:", error);
            alert("Gagal export Excel!");
        }
    };

    /**
     * Menangani ekspor data ke format PDF.
     */
    const handleExportPDFAction = () => {
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
            alert("Tidak ada data untuk diekspor ke PDF (sesuai filter saat ini)!");
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
                "Kategori",
            ];
            const tableRows = filteredData.map((item) => [
                item.expenditure_id,
                item.salaries_id || "N/A", // Isi dengan salaries_id atau N/A
                formatDateToDisplay(item.issue_date),
                formatCurrency(parseFloat(item.amount)), // Terapkan formatCurrency untuk tampilan di PDF
                item.information,
                item.action,
            ]);

            doc.text(`Laporan Data Pengeluaran ${selectedDateForFilter ? `(${formatDateToDisplay(selectedDateForFilter)})` : '(Semua Data)'}`, 14, 15);
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
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            console.error("Kesalahan export PDF:", error);
            alert("Gagal export PDF!");
        }
    };

    // Menutup DatePicker jika klik di luar area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex relative bg-white-50 min-h-screen">
            {/* Komponen UserMenu dan Sidebar */}
            <UserMenu />
            <Sidebar />

            {/* Konten Utama Halaman Pengeluaran */}
            <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
                <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
                    Pengeluaran
                </h1>

                {/* Toolbar untuk Filter, Tambah, dan Export */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex gap-4">
                        {/* Filter Tanggal */}
                        <div className="relative" ref={calendarRef}>
                            {!selectedDateForFilter ? (
                                <button
                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                    className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                                >
                                    <CalendarDays size={20} /> <span>Pilih Tanggal</span>
                                </button>
                            ) : (
                                <button
                                    onClick={resetFilter}
                                    className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                                >
                                    <RotateCcw size={20} /> <span>Set Ulang</span>
                                </button>
                            )}
                            {isDatePickerOpen && (
                                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12 left-0">
                                    <DatePicker
                                        selected={tempDateForPicker}
                                        onChange={(date) => setTempDateForPicker(date)}
                                        inline
                                        dateFormat="dd/MM/yyyy"
                                        showPopperArrow={false}
                                    />
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            onClick={() => {
                                                setTempDateForPicker(selectedDateForFilter);
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
                        {/* Tombol Tambah */}
                        <button
                            onClick={handleOpenTambahModal}
                            className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                        >
                            <PlusCircle size={20} /> <span>Tambah</span>
                        </button>
                    </div>

                    {/* Tombol Export */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportExcelAction}
                            disabled={isLoading || !Array.isArray(filteredData) || filteredData.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isLoading || !Array.isArray(filteredData) || filteredData.length === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-100 text-black hover:bg-[#B8D4F9]"}`}
                        >
                            <FileSpreadsheet size={20} color={isLoading || !Array.isArray(filteredData) || filteredData.length === 0 ? "gray" : "green"} /> <span>Export Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDFAction}
                            disabled={isLoading || !Array.isArray(filteredData) || filteredData.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isLoading || !Array.isArray(filteredData) || filteredData.length === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-red-100 text-black hover:bg-[#B8D4F9]"}`}
                        >
                            <FileText size={20} color={isLoading || !Array.isArray(filteredData) || filteredData.length === 0 ? "gray" : "red"} /> <span>Export PDF</span>
                        </button>
                    </div>
                </div>

                {/* Tabel Data Pengeluaran */}
                {isLoading ? (
                    <div className="text-center p-10">Memuat data pengeluaran...</div>
                ) : (
                    <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8">
                        <table className="min-w-full table-auto bg-white text-sm">
                            <thead className="bg-[#3D6CB9] text-white">
                                <tr>
                                    {/* Kolom Header Tabel */}
                                    {["ID Pengeluaran", "ID Penggajian", "Tanggal Pengeluaran", "Total", "Keterangan", "Kategori", "Aksi"]
                                        .map((header, index, arr) => (
                                            <th
                                                key={header}
                                                className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
                                                style={{
                                                    borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
                                                    borderTopRightRadius: index === arr.length - 1 ? "0.5rem" : undefined
                                                }}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Pesan Jika Data Tidak Ditemukan */}
                                {filteredData.length === 0 ? (
                                    <tr>
                                        {/* colSpan disesuaikan dengan jumlah kolom (7) */}
                                        <td colSpan={7} className="text-center p-4 text-gray-500 font-medium">Data Tidak Ditemukan</td>
                                    </tr>
                                ) : (
                                    /* Iterasi Data Pengeluaran */
                                    filteredData.map((item) => {
                                        return (
                                            // Pastikan <td> pertama langsung setelah <tr> untuk menghindari hydration error
                                            <tr key={item.expenditure_id} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"><td className="p-3">{item.expenditure_id}</td>
                                                <td className="p-3">{item.salaries_id || "N/A"}</td>
                                                <td className="p-3">{formatDateToDisplay(item.issue_date)}</td>
                                                {/* Terapkan formatCurrency di sini */}
                                                <td className="p-3">{formatCurrency(parseFloat(item.amount))}</td>
                                                <td className="p-3">{item.information}</td>
                                                <td className="p-3">{item.action}</td>
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-2">
                                                        {/* Link Edit */}
                                                        <Link
                                                            href={`/dashboard/akuntansi/pengeluaran/edit-pengeluaran/${item.expenditure_id}`}
                                                            className="text-indigo-600 hover:underline"
                                                            title="Edit"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>
                                                        {/* Tombol Hapus */}
                                                        <button
                                                            onClick={() => handleDeleteAction(item.expenditure_id)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Tambah Pengeluaran */}
            <TambahPengeluaran
                isOpen={isTambahModalOpen}
                onClose={handleCloseTambahModal}
                onAddData={handleAddDataToList}
                initialDate={new Date()} // Memberikan tanggal awal untuk DatePicker di modal
            />

            {children}
        </div>
    );
};

export default withAuth(PengeluaranPage);