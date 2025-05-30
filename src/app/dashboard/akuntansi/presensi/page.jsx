"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx"; // Sesuaikan path jika diperlukan
import UserMenu from "/components/Pengguna.jsx"; // Sesuaikan path jika diperlukan
import withAuth from "/src/app/lib/withAuth"; // Sesuaikan path jika diperlukan
import {
    CalendarDays,
    FileText,
    FileSpreadsheet,
    RotateCcw,
    Zap // Icon untuk generate laporan (Buat Laporan)
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
 * Memformat string tanggal atau objek Date ke tampilan DD-MM-YYYY.
 * @param {string|Date} dateInput - String tanggal dari backend atau objek Date.
 * @returns {string} - Tanggal dalam format DD-MM-YYYY atau '-'.
 */
const formatDateToDisplay = (dateInput) => {
    if (!dateInput) return "-";
    let d;
    if (typeof dateInput === 'string') {
        if (dateInput.includes('T')) { // Menangani format ISO seperti "2025-05-30T04:29:48.000000Z"
            d = new Date(dateInput);
        } else { // Mencoba menangani format seperti "2025-05-30 00:00:00" atau "2025-05-30"
            const parts = dateInput.split(' ')[0].split('-'); // Ambil bagian tanggal saja jika ada waktu
            if (parts.length === 3 && parts[0].length === 4) {
                d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            } else {
                d = new Date(dateInput); // Fallback jika format tidak dikenal
            }
        }
    } else if (dateInput instanceof Date) {
        d = dateInput;
    } else {
        return "-"; // Tipe tidak valid
    }

    if (isNaN(d.getTime())) {
        return dateInput.toString(); // Kembalikan input asli jika tidak valid Date
    }
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
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


// --- Komponen PresensiPage ---
const PresensiPage = ({ children }) => { // children ditambahkan untuk konsistensi jika ada intercepting routes
    // State untuk menyimpan data presensi mentah dari backend
    const [dataPresensi, setDataPresensi] = useState([]);
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
     * Mengambil data presensi dari backend dan menerapkan filter jika ada.
     * Menggunakan useCallback agar fungsi tidak dibuat ulang pada setiap render kecuali dependensinya berubah.
     */
    const fetchAndFilterPresensiData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Fetch data dari endpoint /rekap-presensi/all
            const response = await fetch(`${API_BASE_URL}/rekap-presensi/all`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Detail: ${errorText || 'Tidak ada detail error.'}`);
            }
            const result = await response.json(); // Asumsi backend mengembalikan { data: [...] } atau langsung [...]

            // Pastikan data yang diambil adalah array
            const fetchedRawData = Array.isArray(result) ? result : result.data || [];
            if (!Array.isArray(fetchedRawData)) {
                console.error("Data dari backend (/rekap-presensi/all) bukan array atau tidak memiliki properti 'data':", fetchedRawData);
                throw new Error("Format data dari backend tidak valid.");
            }

            // Simpan data mentah yang sudah divalidasi (tidak ada cleaning khusus di sini seperti PemasukanPage)
            setDataPresensi(fetchedRawData);

            // 2. Terapkan filter berdasarkan selectedDateForFilter
            if (selectedDateForFilter) {
                const formattedFilterDate = formatToISODate(selectedDateForFilter);
                setFilteredData(
                    fetchedRawData.filter(
                        (item) => item.tanggal_bergabung && formatToISODate(item.tanggal_bergabung) === formattedFilterDate
                    )
                );
            } else {
                setFilteredData(fetchedRawData); // Tampilkan semua data jika tidak ada filter tanggal
            }

        } catch (error) {
            console.error("Gagal memuat data presensi dari backend:", error);
            alert(`Terjadi kesalahan saat memuat data presensi: ${error.message}.`);
            setDataPresensi([]); // Reset state jika error
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDateForFilter]); // Bergantung pada selectedDateForFilter untuk memicu re-fetch/re-filter

    // Efek samping: Muat data awal saat komponen dimuat atau filter (selectedDateForFilter) berubah
    useEffect(() => {
        fetchAndFilterPresensiData();

        // Listener untuk event kustom jika ada pembaruan data dari tempat lain
        const handleDataUpdateListener = () => fetchAndFilterPresensiData();
        window.addEventListener("dataPresensiUpdated", handleDataUpdateListener);
        return () => {
            window.removeEventListener("dataPresensiUpdated", handleDataUpdateListener);
        };
    }, [fetchAndFilterPresensiData]); // fetchAndFilterPresensiData sudah useCallback dan punya dependency

    /**
     * Menerapkan tanggal yang dipilih dari date picker sebagai filter.
     */
    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker); // Ini akan memicu useEffect di atas
        setIsDatePickerOpen(false);
    };

    /**
     * Mereset filter tanggal dan menampilkan semua data.
     */
    const resetFilter = () => {
        setSelectedDateForFilter(null); // Ini akan memicu useEffect di atas
        setTempDateForPicker(null);
        setIsDatePickerOpen(false);
    };

    // --- Laporan & Export Logic ---

    /**
     * Mendapatkan nama file untuk ekspor Excel atau PDF.
     * @param {string} ext - Ekstensi file ('xlsx' atau 'pdf').
     * @returns {string} - Nama file.
     */
    const getExportFileName = (ext) => {
        const dateSuffix = selectedDateForFilter ? formatToISODate(selectedDateForFilter).replace(/-/g, '') : "all";
        const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, '');
        return `laporan_rekap_presensi_${dateSuffix}_${currentDate}.${ext}`;
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
            const dataToExport = filteredData.map(item => ({
                'Nama Lengkap': item.nama_lengkap,
                'No. HP': item.no_hp || '-',
                'Role': item.role || '-',
                'Tanggal Bergabung': item.tanggal_bergabung ? formatDateToDisplay(item.tanggal_bergabung) : '-',
                'Bulan': item.bulan,
                'Tahun': item.tahun,
                'Jumlah Kehadiran': item.jumlah_kehadiran,
            }));
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Rekap Presensi");
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
            const doc = new jsPDF('landscape'); // Mungkin landscape lebih cocok untuk banyak kolom
            const tableColumn = [
                "Nama Lengkap", "No. HP", "Role", "Tgl. Bergabung", "Bulan", "Tahun", "Jml. Hadir"
            ];
            const tableRows = filteredData.map((item) => [
                item.nama_lengkap,
                item.no_hp || '-',
                item.role || '-',
                item.tanggal_bergabung ? formatDateToDisplay(item.tanggal_bergabung) : '-',
                item.bulan,
                item.tahun,
                item.jumlah_kehadiran,
            ]);

            doc.text(
                `Laporan Rekap Presensi ${selectedDateForFilter ? `(Filter: ${formatDateToDisplay(selectedDateForFilter)})` : "(Semua Data)"}`,
                14, 15
            );

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                theme: 'grid', // Tema agar lebih rapi
                styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
                headStyles: { fillColor: [61, 108, 185], textColor: 255, fontStyle: 'bold', halign: 'center' },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                didDrawPage: function (data) { // Penomoran halaman
                    let str = "Halaman " + doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
                    doc.text(str, data.settings.margin.left, pageHeight - 10);
                }
            });
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            console.error("Export PDF error:", error);
            alert("Gagal export PDF!");
        }
    };

    /**
     * Memicu pembuatan/rekap laporan presensi di backend.
     * Menggunakan endpoint '/rekap-presensi/rekap' dengan metode POST.
     */
    const handleGeneratePresensiReport = async () => {
        // Tombol ini dibuat selalu aktif (kecuali saat isLoading),
        // jadi konfirmasi penting.
        if (!confirm("Apakah Anda yakin ingin memicu rekapitulasi laporan presensi dari backend?")) {
            return;
        }
        
        // Menggunakan setIsLoading untuk memberi feedback visual bahwa proses sedang berjalan
        const originalIsLoading = isLoading; // Simpan state isLoading sebelumnya
        setIsLoading(true); 

        try {
            let payload = {};
            if (selectedDateForFilter) {
                const month = (selectedDateForFilter.getMonth() + 1).toString();
                const year = selectedDateForFilter.getFullYear().toString();
                payload = { bulan: month, tahun: year };
            } else {
                const now = new Date();
                payload = {
                    bulan: (now.getMonth() + 1).toString(),
                    tahun: now.getFullYear().toString()
                };
                // Tidak perlu alert di sini jika tombolnya memang dimaksudkan untuk selalu bisa diklik
            }

            const response = await fetch(`${API_BASE_URL}/rekap-presensi/rekap`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`Gagal memicu rekap presensi: ${response.status}. ${errorData.message || ''}`);
            }

            const result = await response.json();
            alert(`Proses rekapitulasi presensi berhasil dipicu di backend. ${result.message || 'Memuat data terbaru...'}`);
            
            // Penting: Panggil fetchAndFilterPresensiData untuk memuat ulang data setelah rekap berhasil.
            // Tidak perlu setIsLoading(false) di sini karena fetchAndFilterPresensiData akan menanganinya.
            await fetchAndFilterPresensiData(); 

        } catch (error) {
            console.error("Error saat memicu rekap presensi:", error);
            alert(`Gagal memicu rekap presensi: ${error.message}`);
            setIsLoading(originalIsLoading); // Kembalikan state isLoading jika terjadi error di sini
        }
        // setIsLoading(false) akan dihandle oleh fetchAndFilterPresensiData jika berhasil,
        // atau di blok catch jika error sebelum fetchAndFilterPresensiData.
        // Namun untuk memastikan, jika fetchAndFilterPresensiData tidak sempat mengubahnya,
        // kita bisa set di sini, tapi lebih baik biarkan fetchAndFilterPresensiData yang mengontrol.
    };

    // Efek samping: Menutup date picker saat mengklik di luar area date picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [calendarRef]); // Hanya bergantung pada calendarRef

    // Header kolom yang akan ditampilkan di tabel
    const tableDisplayHeaders = [
        "Nama Lengkap", "No. HP", "Role", "Tanggal Bergabung", "Bulan", "Tahun", "Jumlah Kehadiran"
    ];

    // Kondisi untuk menonaktifkan tombol export, mirip PemasukanPage
    const isExportDisabled = filteredData.length === 0 || isLoading;
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
            <div className="flex-1 p-4 md:p-6 relative overflow-y-auto"> {/* Tambahkan overflow-y-auto */}
                {/* --- Header Halaman --- */}
                <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-6">
                    Rekap Presensi
                </h1>

                {/* --- Toolbar: Filter, Generate Report & Export --- */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    {/* Filter & Generate Section */}
                    <div className="flex flex-wrap gap-4 items-center"> {/* Tambahkan flex-wrap dan items-center */}
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
                                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12 left-0 md:left-auto" style={{minWidth: '280px'}}>
                                    <DatePicker
                                        selected={tempDateForPicker}
                                        onChange={(date) => setTempDateForPicker(date)}
                                        inline
                                        dateFormat="dd-MM-yyyy" // Format tampilan di picker
                                        showPopperArrow={false}
                                    />
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            onClick={() => {
                                                // setTempDateForPicker(selectedDateForFilter); // Opsional: reset temp ke yg terpilih
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

                        {/* Tombol Buat Laporan (Generate Presensi Report) */}
                        <button
                            onClick={handleGeneratePresensiReport}
                            disabled={isLoading} // Menonaktifkan tombol jika isLoading true, sesuai struktur PemasukanPage
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                isLoading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Gaya saat disabled
                                    : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer" // Gaya saat aktif (sesuaikan warna jika perlu)
                            }`}
                        >
                            <Zap size={20} />
                            <span>Buat Laporan</span>
                        </button>
                    </div>

                    {/* Export Section */}
                    <div className="flex flex-wrap gap-4 items-center"> {/* Tambahkan flex-wrap dan items-center */}
                        <button
                            onClick={handleExportExcel}
                            disabled={isExportDisabled}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                isExportDisabled
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-100 text-black hover:bg-green-200 cursor-pointer"
                            }`}
                        >
                            <FileSpreadsheet size={20} color={isExportDisabled ? "gray" : "green"} />
                            <span>Ekspor Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDF}
                            disabled={isExportDisabled}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                isExportDisabled
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-red-100 text-black hover:bg-red-200 cursor-pointer"
                            }`}
                        >
                            <FileText size={20} color={isExportDisabled ? "gray" : "red"} />
                            <span>Ekspor PDF</span>
                        </button>
                    </div>
                </div>

                {/* --- Tabel Data Presensi --- */}
                {isLoading && !isDatePickerOpen ? (
                    <div className="text-center p-10 text-lg font-medium text-gray-700">
                        Memuat data rekap presensi, mohon tunggu...
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow">
                        <div className="max-h-[calc(100vh-280px)] overflow-y-auto"> {/* Sesuaikan max-h jika perlu */}
                            <table className="min-w-full table-auto bg-white text-sm">
                                <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                                    <tr>
                                        {tableDisplayHeaders.map((header, index, arr) => (
                                            <th
                                                key={header}
                                                className={`p-3 text-center whitespace-nowrap`} // p-3 untuk padding lebih
                                                style={{
                                                    borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
                                                    borderTopRightRadius: index === arr.length - 1 ? "0.5rem" : undefined,
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
                                        filteredData.map((item, idx) => ( // item.id_presensi mungkin tidak selalu ada jika data dari API berbeda
                                            <tr
                                                key={item.id_presensi || `presensi-${idx}`} // Fallback key jika id_presensi tidak ada
                                                className="border-b text-center border-gray-200 hover:bg-gray-100 transition duration-150 ease-in-out"
                                            >
                                                <td className="p-3 whitespace-nowrap">{item.nama_lengkap || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{item.no_hp || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{item.role || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{formatDateToDisplay(item.tanggal_bergabung)}</td>
                                                <td className="p-3 whitespace-nowrap">{item.bulan || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{item.tahun || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{item.jumlah_kehadiran == null ? '-' : item.jumlah_kehadiran}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* Slot untuk Intercepting Routes jika digunakan */}
                {children}
            </div>
        </div>
        </div>
    );
};

export default withAuth(PresensiPage);