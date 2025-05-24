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
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Fungsi helper untuk memformat tanggal ke format 'YYYY-MM-DD' untuk perbandingan yang konsisten
const formatToISODate = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0]; // Ambil hanya YYYY-MM-DD
};

// Fungsi helper untuk memformat tanggal untuk tampilan (DD-MM-YYYY)
const formatDateToDisplay = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
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

    // Fungsi untuk memuat data dari API
    const fetchDataPresensi = useCallback(async () => {
        setIsLoading(true);
        try {
            // Menggunakan endpoint /all sesuai route backend Anda
            const response = await fetch('http://localhost:8000/api/rekap-presensi/all', {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Data dari API rekap presensi:", result.data);

            const fetchedData = result.data || [];
            setDataPresensi(fetchedData); // Simpan data mentah

            // Terapkan filter tanggal jika ada
            if (selectedDateForFilter) {
                const formattedFilterDate = formatToISODate(selectedDateForFilter);
                setFilteredData(
                    fetchedData.filter(item => {
                        // Membandingkan bagian tanggal dari tanggal_bergabung (YYYY-MM-DD)
                        return item.tanggal_bergabung && formatToISODate(item.tanggal_bergabung) === formattedFilterDate;
                    })
                );
            } else {
                setFilteredData(fetchedData); // Tampilkan semua jika tidak ada filter
            }

        } catch (error) {
            console.error("Gagal memuat data presensi:", error);
            alert("Gagal memuat data presensi. Silakan coba lagi.");
            setDataPresensi([]);
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDateForFilter]); // Dependency untuk useCallback adalah selectedDateForFilter

    // Efek samping untuk memuat data saat komponen dimuat dan saat filter tanggal berubah
    useEffect(() => {
        fetchDataPresensi();

        const handleDataUpdate = () => fetchDataPresensi();
        window.addEventListener("dataPresensiUpdated", handleDataUpdate);
        return () => {
            window.removeEventListener("dataPresensiUpdated", handleDataUpdate);
        };
    }, [fetchDataPresensi]); // Tambahkan fetchDataPresensi ke dependencies

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

    // Fungsi untuk mendapatkan nama file export
    const getExportFileName = (ext) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        return `laporan_rekap_presensi_${year}-${month}-${day}.${ext}`;
    };

    // Fungsi untuk export data ke Excel
    const handleExportExcelAction = () => {
        if (filteredData.length === 0) {
            alert("Data kosong (sesuai filter saat ini), tidak bisa export Excel!");
            return;
        }
        try {
            const dataToExport = filteredData.map(item => ({
                'ID Presensi': item.id_presensi,
                'User ID': item.user_id,
                'Nama Lengkap': item.nama_lengkap,
                'No. HP': item.no_hp,
                'Role': item.role,
                'Tanggal Bergabung': item.tanggal_bergabung ? formatDateToDisplay(new Date(item.tanggal_bergabung)) : '',
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
        if (filteredData.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF();
            const tableColumn = [
                "ID Presensi",
                "User ID",
                "Nama Lengkap",
                "No. HP",
                "Role",
                "Tgl. Bergabung",
                "Bulan",
                "Tahun",
                "Jml. Hadir",
            ];
            const tableRows = filteredData.map((item) => [
                item.id_presensi,
                item.user_id,
                item.nama_lengkap,
                item.no_hp || '-',
                item.role || '-',
                item.tanggal_bergabung ? formatDateToDisplay(new Date(item.tanggal_bergabung)) : '-',
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
    }, [calendarRef]);

    return (
        <div className="flex relative bg-white-50 min-h-screen">
            <UserMenu />
            <Sidebar />
            <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
                <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
                  Presensi
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
                                    <RotateCcw size={20} /> <span>Set Ulang</span>
                                </button>
                            )}
                            {isDatePickerOpen && (
                                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
                                    <DatePicker
                                        selected={tempDateForPicker}
                                        onChange={(date) => setTempDateForPicker(date)}
                                        inline
                                        dateFormat="dd/MM/yyyy" // Format tanggal tetap DD/MM/YYYY
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
                    </div>
                    {/* Tombol Export */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportExcelAction}
                            disabled={filteredData.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                filteredData.length === 0
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-100 text-black hover:bg-[#B8D4F9]"
                            }`}
                        >
                            <FileSpreadsheet
                                size={20}
                                color={filteredData.length === 0 ? "gray" : "green"}
                            />{" "}
                            <span>Export Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDFAction}
                            disabled={filteredData.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                filteredData.length === 0
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-red-100 text-black hover:bg-[#B8D4F9]"
                            }`}
                        >
                            <FileText
                                size={20}
                                color={filteredData.length === 0 ? "gray" : "red"}
                            />{" "}
                            <span>Export PDF</span>
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
                                        "ID Presensi",
                                        "User ID", // Menggunakan "User ID" sesuai atribut backend
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
                                            colSpan={9} // Sesuaikan dengan jumlah kolom baru
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
                                                <td className="p-3">{item.id_presensi}</td>
                                                <td className="p-3">{item.user_id}</td>
                                                <td className="p-3">{item.nama_lengkap}</td>
                                                <td className="p-3">{item.no_hp || '-'}</td>
                                                <td className="p-3">{item.role || '-'}</td>
                                                <td className="p-3">{item.tanggal_bergabung ? formatDateToDisplay(new Date(item.tanggal_bergabung)) : '-'}</td>
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