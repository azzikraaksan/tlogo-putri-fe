"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx"; // Sesuaikan path jika berbeda
import UserMenu from "/components/Pengguna.jsx"; // Sesuaikan path jika berbeda
import withAuth from "/src/app/lib/withAuth"; // Sesuaikan path jika berbeda
import {
    CalendarDays,
    FileText,
    FileSpreadsheet,
    RotateCcw,
    Zap // Icon untuk generate laporan
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Base URL untuk API backend Anda ---
const API_BASE_URL = "http://localhost:8000/api";

// --- Helper Functions ---
/**
 * Memformat angka menjadi string mata uang Rupiah (Rp. X.XXX.XXX).
 * @param {number} number - Angka yang akan diformat.
 * @returns {string} - String mata uang Rupiah.
 */
const formatRupiah = (number) => {
    if (number === null || typeof number === 'undefined' || isNaN(number)) {
        return 'Rp. 0';
    }
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return formatter.format(number).replace(/,/g, '.').replace('Rp', 'Rp.');
};

/**
 * Memformat string tanggal (misal dari ISO 8601) ke tampilan DD-MM-YYYY.
 * @param {string} dateString - String tanggal dari backend.
 * @returns {string} - Tanggal dalam format DD-MM-YYYY atau '-'.
 */
const formatDateToDisplay = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return dateString;
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

/**
 * Memformat objek Date atau string tanggal ke format YYYY-MM-DD.
 * @param {Date|string} date - Objek Date atau string tanggal.
 * @returns {string|null} - Tanggal dalam format YYYY-MM-DD atau null.
 */
const formatToISODate = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
};

// --- Komponen PemasukanPage ---
const PemasukanPage = () => {
    // State untuk menyimpan data pemasukan dari backend
    const [dataPemasukan, setDataPemasukan] = useState([]);
    // State untuk menyimpan data yang sudah difilter (untuk ditampilkan di tabel)
    const [filteredData, setFilteredData] = useState([]);
    // State untuk indikator loading data
    const [isLoading, setIsLoading] = useState(true);
    // State untuk mengontrol tampilan date picker
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    // State untuk tanggal yang dipilih sebagai filter (setelah dikonfirmasi)
    const [selectedDateForFilter, setSelectedDateForFilter] = useState(null);
    // State sementara untuk tanggal di dalam date picker sebelum diterapkan
    const [tempDateForPicker, setTempDateForPicker] = useState(null);
    // Ref untuk elemen date picker, digunakan untuk mendeteksi klik di luar
    const calendarRef = useRef(null);

    /**
     * Mengambil data pemasukan dari backend dan menerapkan filter jika ada.
     * Menggunakan useCallback agar fungsi tidak dibuat ulang pada setiap render.
     */
    const fetchAndFilterIncomeData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/income/all`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Detail: ${errorText || 'Tidak ada detail error.'}`);
            }
            const rawData = await response.json();

            const fetchedRawData = Array.isArray(rawData) ? rawData : rawData.data || [];

            if (!Array.isArray(fetchedRawData)) {
                console.error("Data dari backend bukan array atau tidak memiliki properti 'data':", fetchedRawData);
                throw new Error("Format data dari backend tidak valid.");
            }

            const cleanedData = fetchedRawData.map(item => ({
                booking_date: item.booking_date ? formatDateToDisplay(item.booking_date) : '-',
                income: parseFloat(item.income || 0),
                expediture: parseFloat(item.expediture || 0),
                cash: parseFloat(item.cash || 0),
            }));

            setDataPemasukan(cleanedData); // Simpan data asli yang sudah dibersihkan

            if (selectedDateForFilter) {
                const formattedFilterDate = formatToISODate(selectedDateForFilter);
                // Filter dari cleanedData (data asli yang sudah diproses)
                setFilteredData(
                    cleanedData.filter(
                        (item) => item.booking_date && formatToISODate(new Date(item.booking_date.split('-').reverse().join('-'))) === formattedFilterDate
                    )
                );
            } else {
                setFilteredData(cleanedData); // Tampilkan semua data jika tidak ada filter tanggal
            }

        } catch (error) {
            console.error("Gagal memuat data pemasukan dari backend:", error);
            alert(`Terjadi kesalahan saat memuat data pemasukan: ${error.message}. Pastikan backend berjalan dan mengembalikan data yang valid.`);
            setDataPemasukan([]);
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDateForFilter]); // Hanya bergantung pada selectedDateForFilter

    // Efek samping: Muat data awal saat komponen dimuat atau filter berubah
    useEffect(() => {
        fetchAndFilterIncomeData();
    }, [fetchAndFilterIncomeData]);

    /**
     * Menerapkan tanggal yang dipilih dari date picker sebagai filter.
     */
    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker);
        setIsDatePickerOpen(false);
        // Pemanggilan fetchAndFilterIncomeData akan otomatis terjadi karena perubahan selectedDateForFilter (dependency di useEffect)
    };

    /**
     * Mereset filter tanggal dan menampilkan semua data.
     */
    const resetFilter = () => {
        setSelectedDateForFilter(null);
        setTempDateForPicker(null);
        setIsDatePickerOpen(false);
        // Pemanggilan fetchAndFilterIncomeData akan otomatis terjadi
    };

    // --- Laporan & Export Logic ---
    /**
     * Menghitung total kas dari data yang saat ini difilter.
     * @returns {string} - Total kas dalam format Rupiah.
     */
    const calculateTotalKas = () => {
        const total = filteredData.reduce((sum, item) => sum + (typeof item.cash === 'number' && !isNaN(item.cash) ? item.cash : 0), 0);
        return formatRupiah(total);
    };

    /**
     * Mendapatkan nama file untuk ekspor Excel atau PDF.
     * @param {string} ext - Ekstensi file ('xlsx' atau 'pdf').
     * @returns {string} - Nama file.
     */
    const getExportFileName = (ext) => {
        const date = selectedDateForFilter ? formatToISODate(selectedDateForFilter) : "all_dates";
        return `laporan_pemasukan_${date}.${ext}`;
    };

    /**
     * Menangani ekspor data ke format Excel (XLSX).
     */
    const handleExportExcel = () => {
        if (filteredData.length === 0) {
            alert("Data kosong, tidak bisa export Excel!");
            return;
        }

        try {
            const exportData = filteredData.map(item => ({
                'Tanggal Pemesanan': item.booking_date,
                'Pemasukan (Rp)': item.income,
                'Pengeluaran (Rp)': item.expediture,
                'Kas (Rp)': item.cash,
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pemasukan");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Export Excel error:", error);
            alert("Gagal export Excel!");
        }
    };

    /**
     * Menangani ekspor data ke format PDF.
     */
    const handleExportPDF = () => {
        if (filteredData.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF('portrait');
            const tableColumn = [
                "Tgl. Pemesanan",
                "Pemasukan",
                "Pengeluaran",
                "Kas"
            ];
            const tableRows = filteredData.map((item) => [
                item.booking_date,
                formatRupiah(item.income),
                formatRupiah(item.expediture),
                formatRupiah(item.cash),
            ]);

            doc.text(
                `Laporan Data Pemasukan ${
                    selectedDateForFilter
                        ? `(${formatDateToDisplay(selectedDateForFilter)})`
                        : "(Semua Data)"
                }`,
                14,
                15
            );

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                },
                headStyles: {
                    fillColor: [61, 108, 185],
                },
                didDrawPage: function (data) {
                    if (data && data.settings && doc && doc.internal && doc.internal.pageSize) {
                        doc.setFontSize(10);
                        const totalKasText = `Total Kas: ${calculateTotalKas()}`;
                        const textWidth = doc.getStringUnitWidth(totalKasText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                        const xOffset = doc.internal.pageSize.width - data.settings.margin.right - textWidth;
                        doc.text(totalKasText, xOffset, doc.internal.pageSize.height - 10);
                    }
                }
            });
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            console.error("Export PDF error:", error);
            alert("Gagal export PDF!");
        }
    };

    /**
     * Memicu pembuatan laporan pemasukan di backend.
     * Menggunakan endpoint '/api/income/create' dengan metode POST.
     */
    const handleGenerateIncomeReport = async () => {
        if (!confirm("Apakah Anda yakin ingin memicu perhitungan laporan pemasukan otomatis dari backend? Proses ini mungkin memerlukan waktu.")) {
            return;
        }
        setIsLoading(true); // Tetap set isLoading di awal
        try {
            const response = await fetch(`${API_BASE_URL}/income/create`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => response.text());
                let errorMessage = `Gagal memicu generate laporan pemasukan: ${response.status} ${response.statusText}`;
                if (typeof errorData === 'object' && errorData !== null && errorData.message) {
                    errorMessage += `. Detail: ${errorData.message}`;
                } else if (typeof errorData === 'string') {
                    errorMessage += `. Detail: ${errorData}`;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            alert(`Proses perhitungan laporan pemasukan berhasil dipicu di backend. ${result.message || 'Memuat data terbaru...'}`);
            await fetchAndFilterIncomeData(); // Muat ulang data setelah laporan dibuat
        } catch (error) {
            console.error("Error saat memicu generate laporan pemasukan:", error);
            alert(`Gagal memicu generate laporan pemasukan: ${error.message}`);
        } finally {
            setIsLoading(false); // Set isLoading false di akhir, baik sukses maupun gagal
        }
    };

    // Efek samping: Menutup date picker saat mengklik di luar area date picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target)
            ) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [calendarRef]);

    // Header kolom yang akan ditampilkan di tabel (tanpa ID)
    const tableDisplayHeaders = [
        "Tanggal Pemesanan",
        "Pemasukan",
        "Pengeluaran",
        "Kas",
    ];
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
     <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className="flex-1 p-6 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? 290 : 70,
        }}
      >
            <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
                {/* --- Header Halaman --- */}
                <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-6">
                    Pemasukan
                </h1>

                {/* --- Toolbar: Filter & Export --- */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    {/* Filter Section */}
                    <div className="flex gap-4">
                        {/* Tombol Pilih Tanggal / Set Ulang Filter */}
                        <div className="relative" ref={calendarRef}>
                            {!selectedDateForFilter ? (
                                <button
                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                    className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black cursor-pointer"
                                >
                                    <CalendarDays size={20} />
                                    <span>Pilih Tanggal</span>
                                </button>
                            ) : (
                                <button
                                    onClick={resetFilter}
                                    className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black cursor-pointer"
                                >
                                    <RotateCcw size={20} />
                                    <span>Atur Ulang</span>
                                </button>
                            )}

                            {/* DatePicker Popup */}
                            {isDatePickerOpen && (
                                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
                                    <DatePicker
                                        selected={tempDateForPicker}
                                        onChange={(date) => setTempDateForPicker(date)}
                                        inline
                                        dateFormat="dd-MM-yyyy"
                                        showPopperArrow={false}
                                    />
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            onClick={() => {
                                                setTempDateForPicker(selectedDateForFilter);
                                                setIsDatePickerOpen(false);
                                            }}
                                            className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white cursor-pointer"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={applyDateFilter}
                                            className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white cursor-pointer"
                                        >
                                            Pilih Tanggal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tombol Generate Laporan --- MODIFIKASI DI SINI --- */}
                        <button
                            onClick={handleGenerateIncomeReport}
                            disabled={isLoading} // Hanya dinonaktifkan jika isLoading
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                isLoading // Kondisi className juga hanya bergantung pada isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-[#3D6CB9] text-white hover:bg-[#B8D4F9] hover:text-black cursor-pointer"
                            }`}
                        >
                            <Zap size={20} />
                            <span>Buat Laporan</span>
                        </button>
                    </div>

                    {/* Export Section */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportExcel}
                            disabled={filteredData.length === 0 || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                filteredData.length === 0 || isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
                            }`}
                        >
                            <FileSpreadsheet size={20} color={filteredData.length === 0 || isLoading ? "gray" : "green"} />
                            <span>Ekspor Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDF}
                            disabled={filteredData.length === 0 || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                filteredData.length === 0 || isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-red-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
                            }`}
                        >
                            <FileText size={20} color={filteredData.length === 0 || isLoading ? "gray" : "red"} />
                            <span>Ekspor PDF</span>
                        </button>
                    </div>
                </div>

                {/* --- Tabel Data Pemasukan --- */}
                {isLoading && !isDatePickerOpen ? ( // Sembunyikan loading utama jika date picker terbuka
                    <div className="text-center p-10 text-lg font-medium text-gray-700">
                        Memuat data laporan pemasukan, mohon tunggu...
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow">
                        <div className="max-h-[600px] overflow-y-auto">
                            <table className="min-w-full table-auto bg-white text-sm">
                                <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                                    <tr>
                                        {tableDisplayHeaders.map((header, index, arr) => (
                                            <th
                                                key={header}
                                                className={`p-2 text-center whitespace-nowrap`}
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
                                            <td colSpan={tableDisplayHeaders.length} className="text-center p-4 text-gray-500 font-medium">Data Tidak Ditemukan</td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item, index) => (
                                            <tr
                                                key={`row-${index}-${item.booking_date}`} // Tambahkan booking_date untuk key yang lebih unik
                                                className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                                            >
                                                <td className="p-3 whitespace-nowrap">{item.booking_date}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.income)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.expediture)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.cash)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- Total Kas Display --- */}
                <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
                    <span className="font-bold text-lg">Total Kas:</span>
                    <span className="text-lg font-semibold text-[#3D6CB9]">{calculateTotalKas()}</span>
                </div>
            </div>
        </div>
        </div>
    );
};

export default withAuth(PemasukanPage);