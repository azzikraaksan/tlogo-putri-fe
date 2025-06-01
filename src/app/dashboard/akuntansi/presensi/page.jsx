"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx";
import withAuth from "/src/app/lib/withAuth";
import {
    CalendarDays,
    FileText,
    FileSpreadsheet,
    RotateCcw,
    Zap
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE_URL = "http://localhost:8000/api";

const formatDateToDisplay = (dateInput) => {
    if (!dateInput) return "-";
    let d;
    if (typeof dateInput === 'string') {
        if (dateInput.includes('T')) {
            d = new Date(dateInput);
        } else {
            const parts = dateInput.split(' ')[0].split('-');
            if (parts.length === 3 && parts[0].length === 4) {
                d = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
            } else {
                d = new Date(dateInput);
            }
        }
    } else if (dateInput instanceof Date) {
        d = dateInput;
    } else {
        return "-";
    }

    if (isNaN(d.getTime())) {
        return dateInput.toString();
    }
    const day = d.getUTCDate().toString().padStart(2, "0");
    const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}-${month}-${year}`;
};

const formatDateToDayOnly = (dateInput) => {
    if (!dateInput) return "-";
    let d;
    if (typeof dateInput === 'string') {
        if (dateInput.includes('T')) {
            d = new Date(dateInput);
        } else {
            const parts = dateInput.split(' ')[0].split('-');
            if (parts.length === 3 && parts[0].length === 4) {
                d = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
            } else {
                d = new Date(dateInput);
            }
        }
    } else if (dateInput instanceof Date) {
        d = dateInput;
    } else {
        return "-";
    }

    if (isNaN(d.getTime())) {
        return "-";
    }
    return d.getUTCDate().toString().padStart(2, "0");
};

const getMonthName = (monthNumber) => {
    if (monthNumber == null || isNaN(parseInt(monthNumber))) return "-";
    const num = parseInt(monthNumber);
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    if (num >= 1 && num <= 12) {
        return monthNames[num - 1];
    }
    return monthNumber.toString();
};

const formatToISODate = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    const year = d.getUTCFullYear();
    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = d.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const PresensiPage = ({ children }) => {
    const [dataPresensi, setDataPresensi] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDateForFilter, setSelectedDateForFilter] = useState(null);
    const [tempDateForPicker, setTempDateForPicker] = useState(null);
    const calendarRef = useRef(null);

    const fetchAndFilterPresensiData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/rekap-presensi/all`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Detail: ${errorText || 'Tidak ada detail error.'}`);
            }
            const result = await response.json();
            const fetchedRawData = Array.isArray(result) ? result : result.data || [];
            if (!Array.isArray(fetchedRawData)) {
                throw new Error("Format data dari backend tidak valid.");
            }
            setDataPresensi(fetchedRawData);

            if (selectedDateForFilter) {
                const formattedFilterDate = formatToISODate(selectedDateForFilter);
                setFilteredData(
                    fetchedRawData.filter(item => {
                        if (!item.tanggal_bergabung) return false;
                        const itemDate = formatToISODate(new Date(item.tanggal_bergabung));
                        return itemDate === formattedFilterDate;
                    })
                );
            } else {
                setFilteredData(fetchedRawData);
            }
        } catch (error) {
            setDataPresensi([]);
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDateForFilter]);

    useEffect(() => {
        fetchAndFilterPresensiData();
        const handleDataUpdateListener = () => fetchAndFilterPresensiData();
        window.addEventListener("dataPresensiUpdated", handleDataUpdateListener);
        return () => {
            window.removeEventListener("dataPresensiUpdated", handleDataUpdateListener);
        };
    }, [fetchAndFilterPresensiData]);

    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker);
        setIsDatePickerOpen(false);
    };

    const resetFilter = () => {
        setSelectedDateForFilter(null);
        setTempDateForPicker(null);
        setIsDatePickerOpen(false);
    };

    const getExportFileName = (ext) => {
        const dateSuffix = selectedDateForFilter ? formatToISODate(selectedDateForFilter).replace(/-/g, '') : "all";
        const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, '');
        return `laporan_rekap_presensi_${dateSuffix}_${currentDate}.${ext}`;
    };

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
                'Tanggal Bergabung': item.tanggal_bergabung ? formatDateToDayOnly(item.tanggal_bergabung) : '-',
                'Bulan': getMonthName(item.bulan),
                'Tahun': item.tahun,
                'Jumlah Kehadiran': item.jumlah_kehadiran,
            }));
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Rekap Presensi");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            alert("Gagal export Excel!");
        }
    };

    const handleExportPDF = () => {
        if (filteredData.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF('landscape');
            const tableColumn = [
                "Nama Lengkap", "No. HP", "Role", "Tgl. Bergabung", "Bulan", "Tahun", "Jml. Hadir"
            ];
            const tableRows = filteredData.map((item) => [
                item.nama_lengkap,
                item.no_hp || '-',
                item.role || '-',
                item.tanggal_bergabung ? formatDateToDayOnly(item.tanggal_bergabung) : '-',
                getMonthName(item.bulan),
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
                theme: 'grid',
                styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
                headStyles: { fillColor: [61, 108, 185], textColor: 255, fontStyle: 'bold', halign: 'center' },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                didDrawPage: function (data) {
                    let str = "Halaman " + doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
                    doc.text(str, data.settings.margin.left, pageHeight - 10);
                }
            });
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            alert("Gagal export PDF!");
        }
    };

    const handleGeneratePresensiReport = async () => {
        if (!confirm("Apakah Anda yakin ingin memicu rekapitulasi laporan presensi dari backend?")) {
            return;
        }
        const originalIsLoading = isLoading;
        setIsLoading(true);
        try {
            let payload = {};
            if (selectedDateForFilter) {
                const month = (selectedDateForFilter.getUTCMonth() + 1).toString();
                const year = selectedDateForFilter.getUTCFullYear().toString();
                payload = { bulan: month, tahun: year };
            } else {
                const now = new Date();
                payload = {
                    bulan: (now.getUTCMonth() + 1).toString(),
                    tahun: now.getUTCFullYear().toString()
                };
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
            await fetchAndFilterPresensiData();
        } catch (error) {
            setIsLoading(originalIsLoading);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [calendarRef]);

    const tableDisplayHeaders = [
        "Nama Lengkap", "No. HP", "Role", "Tgl. Bergabung", "Bulan", "Tahun", "Jumlah Kehadiran"
    ];
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                    marginLeft: isSidebarOpen ? 290 : 70,
                }}
            >
                <div className="flex-1 p-4 md:p-6 relative">
                    <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-6">
                        Presensi
                    </h1>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div className="flex flex-wrap gap-4 items-center">
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
                                {isDatePickerOpen && (
                                    <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12 left-0 md:left-auto" style={{ minWidth: '280px' }}>
                                        <DatePicker
                                            selected={tempDateForPicker}
                                            onChange={(date) => setTempDateForPicker(date)}
                                            inline
                                            dateFormat="dd-MM-yyyy"
                                            showPopperArrow={false}
                                        />
                                        <div className="mt-4 flex justify-between">
                                            <button
                                                onClick={() => setIsDatePickerOpen(false)}
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
                            <button
                                onClick={handleGeneratePresensiReport}
                                disabled={isLoading}
                                className={`flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                                    }`}
                            >
                                <Zap size={20} />
                                <span>Buat Laporan</span>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button
                                onClick={handleExportExcel}
                                disabled={filteredData.length === 0 || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${(filteredData.length === 0 || isLoading)
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-green-100 text-black hover:bg-green-200 cursor-pointer"
                                    }`}
                            >
                                <FileSpreadsheet size={20} color={(filteredData.length === 0 || isLoading) ? "gray" : "green"} />
                                <span>Ekspor Excel</span>
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={filteredData.length === 0 || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${(filteredData.length === 0 || isLoading)
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-red-100 text-black hover:bg-red-200 cursor-pointer"
                                    }`}
                            >
                                <FileText size={20} color={(filteredData.length === 0 || isLoading) ? "gray" : "red"} />
                                <span>Ekspor PDF</span>
                            </button>
                        </div>
                    </div>

                    {isLoading && !isDatePickerOpen ? (
                        <div className="text-center p-10 text-lg font-medium text-gray-700">
                            Memuat data rekap presensi, mohon tunggu...
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg shadow">
                            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                                <table className="min-w-full table-auto bg-white text-sm">
                                    <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                                        <tr>
                                            {tableDisplayHeaders.map((header, index, arr) => (
                                                <th
                                                    key={header}
                                                    className={`p-3 text-center whitespace-nowrap`}
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
                                            filteredData.map((item, idx) => (
                                                <tr
                                                    key={item.id_presensi || `presensi-${idx}`}
                                                    className="border-b text-center border-gray-200 hover:bg-gray-100 transition duration-150 ease-in-out"
                                                >
                                                    <td className="p-3 whitespace-nowrap">{item.nama_lengkap || '-'}</td>
                                                    <td className="p-3 whitespace-nowrap">{item.no_hp || '-'}</td>
                                                    <td className="p-3 whitespace-nowrap">{item.role || '-'}</td>
                                                    <td className="p-3 whitespace-nowrap">{formatDateToDayOnly(item.tanggal_bergabung)}</td>
                                                    <td className="p-3 whitespace-nowrap">{getMonthName(item.bulan)}</td>
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
                    {children}
                </div>
            </div>
        </div>
    );
};

export default withAuth(PresensiPage);