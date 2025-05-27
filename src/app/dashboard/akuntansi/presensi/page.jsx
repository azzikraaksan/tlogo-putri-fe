"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import {
    CalendarDays,
    FileText,
    FileSpreadsheet,
    RotateCcw,
    Zap, // Mengimpor ikon Zap (petir)
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Base URL for your API
const API_BASE_URL = 'http://localhost:8000/api';

// Fungsi helper untuk memformat tanggal ke format 'YYYY-MM-DD' untuk perbandingan yang konsisten
const formatToISODate = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0]; // Ambil hanya YYYY-MM-DD
};

// Fungsi helper untuk memformat tanggal untuk tampilan (DD-MM-YYYY)
const formatDateToDisplay = (dateInput) => {
    if (!dateInput) return "";
    let d;
    // Handle string date, convert to Date object if it's not already
    if (typeof dateInput === 'string') {
        // Check if it's already in 'YYYY-MM-DD' format (from backend often)
        if (dateInput.includes('T')) {
            d = new Date(dateInput); // ISO string
        } else {
            // Assume 'YYYY-MM-DD' or similar format, parse manually for safety
            const parts = dateInput.split('-');
            if (parts.length === 3 && parts[0].length === 4) { // YYYY-MM-DD
                d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            } else {
                d = new Date(dateInput); // Try to parse other string formats
            }
        }
    } else if (dateInput instanceof Date) {
        d = dateInput;
    } else {
        return ""; // Invalid date type
    }

    if (isNaN(d.getTime())) return ""; // Check for invalid Date object

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Komponen utama halaman Presensi
const PresensiPage = ({ children }) => {
    const [dataPresensi, setDataPresensi] = useState([]); // Data mentah dari API
    const [filteredData, setFilteredData] = useState([]); // Data setelah filter tanggal
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDateForFilter, setSelectedDateForFilter] = useState(null); // Objek Date untuk filter
    const [tempDateForPicker, setTempDateForPicker] = useState(null); // Objek Date untuk DatePicker sementara
    const [isLoading, setIsLoading] = useState(true);
    const calendarRef = useRef(null);

    // Fungsi untuk menerapkan filter ke data
    const applyFilterToData = useCallback((rawData, dateFilter) => {
        if (!Array.isArray(rawData)) {
            console.warn("Data mentah untuk filter bukan array, mengatur filteredData menjadi array kosong.");
            setFilteredData([]);
            return;
        }

        if (dateFilter) {
            const formattedFilterDate = formatToISODate(dateFilter);
            const filtered = rawData.filter(item => {
                // Pastikan item.tanggal_bergabung adalah string yang valid sebelum diformat
                return item.tanggal_bergabung && formatToISODate(item.tanggal_bergabung) === formattedFilterDate;
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(rawData); // Tampilkan semua jika tidak ada filter
        }
    }, []);

    // Fungsi untuk memuat data dari API
    const fetchDataPresensi = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/rekap-presensi/all`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Data dari API rekap presensi:", result.data);

            const fetchedData = Array.isArray(result.data) ? result.data : []; // Pastikan ini array
            setDataPresensi(fetchedData); // Simpan data mentah
            applyFilterToData(fetchedData, selectedDateForFilter); // Terapkan filter saat data dimuat
        } catch (error) {
            console.error("Gagal memuat data presensi:", error);
            alert("Gagal memuat data presensi. Silakan coba lagi.");
            setDataPresensi([]);
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    }, [applyFilterToData, selectedDateForFilter]); // Dependency untuk useCallback adalah selectedDateForFilter dan applyFilterToData

    // Efek samping untuk memuat data saat komponen dimuat dan saat filter tanggal berubah
    useEffect(() => {
        fetchDataPresensi();

        const handleDataUpdate = () => fetchDataPresensi();
        window.addEventListener("dataPresensiUpdated", handleDataUpdate);
        return () => {
            window.removeEventListener("dataPresensiUpdated", handleDataUpdate);
        };
    }, [fetchDataPresensi]);

    // Efek samping untuk menerapkan filter ketika dataPresensi atau selectedDateForFilter berubah
    useEffect(() => {
        applyFilterToData(dataPresensi, selectedDateForFilter);
    }, [dataPresensi, selectedDateForFilter, applyFilterToData]);

    // Fungsi untuk menerapkan filter tanggal
    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker);
        setIsDatePickerOpen(false);
    };

    // Fungsi untuk mereset filter tanggal
    const resetFilter = () => {
        setSelectedDateForFilter(null);
        setTempDateForPicker(null);
        setIsDatePickerOpen(false);
    };

    // Fungsi untuk membuat laporan rekap presensi (dengan API backend)
    const handleGenerateReport = async () => {
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
            alert("Tidak ada data untuk dibuat laporan rekap presensi. Silakan pilih tanggal atau pastikan ada data yang difilter.");
            return;
        }

        if (confirm("Apakah Anda yakin ingin membuat laporan rekap presensi?")) {
            try {
                // Backend Anda mungkin membutuhkan bulan dan tahun, atau tanggal spesifik.
                // Sesuaikan data yang dikirim sesuai dengan kebutuhan endpoint /rekap di backend.
                // Contoh jika backend hanya membutuhkan bulan dan tahun dari selectedDateForFilter:
                let payload = {};
                if (selectedDateForFilter) {
                    const month = (selectedDateForFilter.getMonth() + 1).toString(); // Bulan (1-12)
                    const year = selectedDateForFilter.getFullYear().toString(); // Tahun
                    payload = { bulan: month, tahun: year };
                } else {
                    // Jika tidak ada filter tanggal, Anda mungkin ingin mengirim bulan/tahun saat ini
                    // atau mengirimkan sinyal ke backend untuk merekap semua data.
                    // Sesuaikan ini dengan logika backend Anda.
                    const now = new Date();
                    payload = {
                        bulan: (now.getMonth() + 1).toString(),
                        tahun: now.getFullYear().toString()
                    };
                    alert("Membuat laporan rekap presensi untuk bulan dan tahun saat ini (jika tidak ada filter tanggal spesifik).");
                }

                console.log("Mengirim payload untuk generate laporan:", payload);

                const response = await fetch(`${API_BASE_URL}/rekap-presensi/rekap`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = `Kesalahan HTTP saat membuat laporan rekap presensi! Status: ${response.status}`;
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage += `, Pesan: ${errorJson.message || JSON.stringify(errorJson)}`;
                    } catch {
                        errorMessage += `, Respons Mentah: ${errorText.substring(0, 200)}...`;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log("Respons dari rekap presensi:", result);
                alert("Laporan rekap presensi berhasil dibuat.");

                // Jika backend setelah rekap mengembalikan data yang diperbarui,
                // Anda mungkin perlu memuat ulang data di frontend.
                fetchDataPresensi();
            } catch (error) {
                console.error("Gagal membuat laporan rekap presensi:", error);
                alert(`Gagal membuat laporan rekap presensi: ${error.message}`);
            }
        }
    };

    // Fungsi untuk mendapatkan nama file export
    const getExportFileName = (ext) => {
        const date = new Date().toISOString().split("T")[0];
        const filterInfo = selectedDateForFilter ? `_${formatDateToDisplay(selectedDateForFilter).replace(/\-/g, '')}` : '_all';
        return `laporan_rekap_presensi${filterInfo}_${date}.${ext}`;
    };

    // Fungsi untuk export data ke Excel
    const handleExportExcelAction = () => {
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
            alert("Data kosong (sesuai filter saat ini), tidak bisa export Excel!");
            return;
        }
        try {
            const dataToExport = filteredData.map(item => ({
                'Nama Lengkap': item.nama_lengkap,
                'No. HP': item.no_hp,
                'Role': item.role,
                'Tanggal Bergabung': item.tanggal_bergabung ? formatDateToDisplay(item.tanggal_bergabung) : '',
                'Bulan': item.bulan,
                'Tahun': item.tahun,
                'Jumlah Kehadiran': item.jumlah_kehadiran,
            }));
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Presensi");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Export Excel error:", error);
            alert("Gagal export Excel!");
        }
    };

    // Fungsi untuk export data ke PDF
    const handleExportPDFAction = () => {
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
            alert("Data kosong (sesuai filter saat ini), tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF();
            const tableColumn = [
                "Nama Lengkap",
                "No. HP",
                "Role",
                "Tgl. Bergabung",
                "Bulan",
                "Tahun",
                "Jml. Hadir",
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
                `Laporan Rekap Presensi ${
                    selectedDateForFilter
                        ? `(Tanggal Bergabung: ${formatDateToDisplay(selectedDateForFilter)})`
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
                didDrawPage: function(data) {
                    let str = "Page " + doc.internal.getNumberOfPages()
                    doc.setFontSize(8)
                    doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10)
                }
            });
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            console.error("Export PDF error:", error);
            alert("Gagal export PDF!");
        }
    };

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
    }, []);

    // Tentukan apakah ada data yang tersedia untuk diekspor atau dibuat laporan
    const isDataAvailableForAction = !isLoading && Array.isArray(filteredData) && filteredData.length > 0;

    return (
        <div className="flex relative bg-white-50 min-h-screen">
            <UserMenu />
            <Sidebar />
            <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
                <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
                    Rekap Presensi
                </h1>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex gap-4">
                        {/* Date Picker */}
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
                                    <RotateCcw size={20} /> <span>Atur Ulang</span>
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

                        {/* Tombol Buat Laporan */}
                        <button
                            onClick={handleGenerateReport}
                            disabled={!isDataAvailableForAction} // Nonaktifkan jika tidak ada data
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isDataAvailableForAction ? "bg-blue-100 text-black hover:bg-[#B8D4F9]" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                        >
                            <Zap size={20} color={isDataAvailableForAction ? "blue" : "gray"} /> <span>Buat Laporan</span>
                        </button>
                    </div>

                    {/* Tombol Export */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportExcelAction}
                            disabled={!isDataAvailableForAction}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                !isDataAvailableForAction
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-100 text-black hover:bg-[#B8D4F9]"
                            }`}
                        >
                            <FileSpreadsheet
                                size={20}
                                color={!isDataAvailableForAction ? "gray" : "green"}
                            />{" "}
                            <span>Ekspor Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDFAction}
                            disabled={!isDataAvailableForAction}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                !isDataAvailableForAction
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-red-100 text-black hover:bg-[#B8D4F9]"
                            }`}
                        >
                            <FileText
                                size={20}
                                color={!isDataAvailableForAction ? "gray" : "red"}
                            />{" "}
                            <span>Ekspor PDF</span>
                        </button>
                    </div>
                </div>

                {/* Tabel */}
                {isLoading ? (
                    <div className="text-center p-10">Memuat data presensi...</div>
                ) : (
                    <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8">
                        <table className="min-w-full table-auto bg-white text-sm">
                            <thead className="bg-[#3D6CB9] text-white">
                                <tr>
                                    {[
                                        "Nama Lengkap",
                                        "No. HP",
                                        "Role",
                                        "Tanggal Bergabung",
                                        "Bulan",
                                        "Tahun",
                                        "Jumlah Kehadiran",
                                    ].map((header, index, arr) => (
                                        <th
                                            key={header}
                                            className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
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
                                        <td
                                            colSpan={7} // Sesuaikan dengan jumlah kolom
                                            className="text-center p-4 text-gray-500 font-medium"
                                        >
                                            Data Tidak Ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => {
                                        if (!item || !item.id_presensi) {
                                            console.error("[PresensiPage] Item tidak valid atau missing id_presensi, melewatkan baris:", item);
                                            return null;
                                        }
                                        return (
                                            <tr
                                                key={item.id_presensi}
                                                className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                                            >
                                                <td className="p-3">{item.nama_lengkap}</td>
                                                <td className="p-3">{item.no_hp || '-'}</td>
                                                <td className="p-3">{item.role || '-'}</td>
                                                <td className="p-3">{item.tanggal_bergabung ? formatDateToDisplay(item.tanggal_bergabung) : '-'}</td>
                                                <td className="p-3">{item.bulan}</td>
                                                <td className="p-3">{item.tahun}</td>
                                                <td className="p-3">{item.jumlah_kehadiran}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Ini adalah slot untuk Intercepting Route. Ini harus ada! */}
            {children}
        </div>
    );
};

export default withAuth(PresensiPage);