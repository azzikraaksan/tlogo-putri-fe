"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import TambahPengeluaran from "/components/TambahPengeluaran.jsx";
import {
    CalendarDays, FileText, FileSpreadsheet, PlusCircle,
    Edit, Trash2, RotateCcw, Zap
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";

// Base URL for your API
const API_BASE_URL = 'http://localhost:8000/api';

const formatDateToDisplay = (dateInput) => {
    if (!dateInput) return "";
    let d;
    if (typeof dateInput === 'string') {
        if (dateInput.includes('T')) {
            d = new Date(dateInput);
        } else {
            const parts = dateInput.split('-');
            if (parts.length === 3 && parts[0].length === 4) {
                d = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
            } else {
                d = new Date(dateInput);
            }
        }
    } else if (dateInput instanceof Date) {
        d = dateInput;
    } else {
        return "";
    }

    if (isNaN(d.getTime())) return "";

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatCurrency = (number) => {
    if (typeof number === 'number' && !isNaN(number)) {
        return `Rp ${number.toLocaleString("id-ID")}`;
    }
    return `Rp 0`;
};

const PengeluaranPage = ({ children }) => {
    const [dataPengeluaran, setDataPengeluaran] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDateForFilter, setSelectedDateForFilter] = useState(null);
    const [tempDateForPicker, setTempDateForPicker] = useState(null);
    const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const calendarRef = useRef(null);

    // State untuk menyimpan data pengeluaran bulan ini saja
    const [currentMonthExpenditures, setCurrentMonthExpenditures] = useState([]);
    const [totalCurrentMonthExpenditure, setTotalCurrentMonthExpenditure] = useState(0);

    // State untuk melacak bulan yang sudah dilaporkan
    const [reportedMonths, setReportedMonths] = useState({}); // { 'YYYY-MM': true/false }

    // Fungsi untuk mendapatkan tanggal awal dan akhir bulan saat ini
    const getCurrentMonthDateRange = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0-indexed

        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0); // Last day of the current month
        return { startDate, endDate };
    };

    // Fungsi untuk memfilter data berdasarkan bulan saat ini
    const filterByCurrentMonth = useCallback((rawData) => {
        if (!Array.isArray(rawData)) {
            console.warn("Raw data for month filter is not an array, setting to empty array.");
            return [];
        }

        const { startDate, endDate } = getCurrentMonthDateRange();
        const currentMonthKey = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`;

        // Filter data yang berada di bulan ini DAN belum dilaporkan (jika ada flag di data)
        const filtered = rawData.filter(item => {
            const itemDate = item.issue_date ? new Date(item.issue_date) : null;
            const itemMonthKey = itemDate ? `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1).toString().padStart(2, '0')}` : null;
            // Jika Anda menambahkan properti `is_reported` di backend, gunakan:
            // return itemDate && itemDate >= startDate && itemDate <= endDate && !item.is_reported;
            
            // Karena tidak ada perubahan BE, kita akan mengandalkan state `reportedMonths`
            // Ini akan menyembunyikan data jika bulan sudah ditandai dilaporkan secara lokal
            return itemDate && itemMonthKey === currentMonthKey && !reportedMonths[currentMonthKey];
        });
        return filtered;
    }, [reportedMonths]);


    // Fungsi untuk memfilter data berdasarkan tanggal spesifik yang dipilih
    const filterBySpecificDate = useCallback((rawData, dateFilter) => {
        if (!Array.isArray(rawData) || !dateFilter) {
            return [];
        }
        const formattedFilterDate = formatDateToDisplay(dateFilter);
        return rawData.filter(item => {
            const itemDate = item.issue_date ? new Date(item.issue_date) : null;
            return itemDate && formatDateToDisplay(itemDate) === formattedFilterDate;
        });
    }, []);

    // Memperbarui applyFilterToData untuk memperhitungkan filter bulan ini dan filter tanggal spesifik
    const applyFilterToData = useCallback((rawData, dateFilter) => {
        if (!Array.isArray(rawData)) {
            console.warn("Data mentah untuk filter bukan array, mengatur filteredData menjadi array kosong.");
            setFilteredData([]);
            setCurrentMonthExpenditures([]);
            setTotalCurrentMonthExpenditure(0);
            return;
        }

        let dataToDisplayInTable = [];
        let dataForCurrentMonthProcessing = [];

        if (dateFilter) {
            // Jika ada filter tanggal spesifik, gunakan itu untuk tampilan tabel
            dataToDisplayInTable = filterBySpecificDate(rawData, dateFilter);
        } else {
            // Default: tampilkan data bulan ini yang belum dilaporkan
            dataToDisplayInTable = filterByCurrentMonth(rawData);
        }
        
        // Selalu hitung dan simpan pengeluaran bulan ini terlepas dari filter tampilan
        // Ini adalah data yang akan dilaporkan
        dataForCurrentMonthProcessing = filterByCurrentMonth(rawData);
        
        setCurrentMonthExpenditures(dataForCurrentMonthProcessing); // Data bulan ini untuk laporan
        setFilteredData(dataToDisplayInTable); // Data untuk ditampilkan di tabel

        // Hitung total hanya untuk data bulan ini (yang akan dilaporkan)
        const total = dataForCurrentMonthProcessing.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        setTotalCurrentMonthExpenditure(total);
    }, [filterByCurrentMonth, filterBySpecificDate]);


    const fetchExpenditureData = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = `${API_BASE_URL}/expenditures/all`;
            const response = await fetch(url);

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`[fetchExpenditureData] HTTP Error! Status: ${response.status}, Status Text: ${response.statusText}, Response Body: ${errorBody}`);
                throw new Error(`Gagal mengambil data pengeluaran: ${response.statusText || 'Kesalahan Server'}`);
            }

            const result = await response.json();
            console.log("[fetchExpenditureData] Raw API Response:", result);

            let extractedData = [];
            if (Array.isArray(result)) {
                extractedData = result;
            } else if (result && Array.isArray(result.data)) {
                extractedData = result.data;
            } else if (result && Array.isArray(result.expenditures)) {
                extractedData = result.expenditures;
            } else if (result && Array.isArray(result.expenditure)) {
                extractedData = result.expenditure;
            } else if (result && Array.isArray(result.salaries)) {
                extractedData = result.salaries;
            } else {
                console.warn("[fetchExpenditureData] Struktur data respons API tidak sesuai harapan.", result);
                extractedData = [];
            }

            console.log("[fetchExpenditureData] extractedData:", extractedData);

            const cleanData = extractedData.filter(item =>
                item && typeof item.expenditure_id !== 'undefined'
            );

            setDataPengeluaran(cleanData);
            applyFilterToData(cleanData, selectedDateForFilter);

        } catch (error) {
            console.error("[fetchExpenditureData] Kesalahan saat mengambil atau memproses data pengeluaran:", error);
            alert(`Gagal mengambil data pengeluaran: ${error.message}`);
            setDataPengeluaran([]);
            setFilteredData([]);
            setCurrentMonthExpenditures([]);
            setTotalCurrentMonthExpenditure(0);
        } finally {
            setIsLoading(false);
        }
    }, [applyFilterToData, selectedDateForFilter]);

    // Pindahkan definisi fungsi-fungsi ini ke atas, sebelum useEffect yang menggunakannya
    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker);
        setIsDatePickerOpen(false);
    };

    const resetFilter = useCallback(() => {
        setSelectedDateForFilter(null);
        setTempDateForPicker(null);
        setIsDatePickerOpen(false);
        fetchExpenditureData(); // Panggil ini untuk kembali ke tampilan bulan ini
    }, [fetchExpenditureData]);

    const handleGenerateReport = async () => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const currentMonthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
        // const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate(); // Tidak digunakan lagi untuk logika disabled

        // Pengecekan apakah bulan ini sudah pernah dilaporkan
        if (reportedMonths[currentMonthKey]) {
            alert("Laporan untuk bulan ini sudah dibuat.");
            return;
        }

        // Pengecekan apakah ada data untuk dilaporkan
        if (currentMonthExpenditures.length === 0) {
            alert("Tidak ada pengeluaran untuk bulan ini yang dapat dilaporkan.");
            return;
        }

        if (confirm(`Apakah Anda yakin ingin membuat laporan pengeluaran untuk bulan ini (Total: ${formatCurrency(totalCurrentMonthExpenditure)})? Data bulan ini akan ditandai sebagai 'dilaporkan' di tampilan.`)) {
            try {
                // Simulasi pengiriman laporan ke database (tanpa endpoint baru)
                // Di sini, Anda akan menyimpan `currentMonthExpenditures` dan `totalCurrentMonthExpenditure`
                // ke dalam database laporan bulanan Anda.
                // Karena Anda tidak ingin membuat endpoint baru, Anda harus memikirkan cara
                // mengelola ini di backend yang sudah ada atau secara manual.
                // Untuk demo ini, kita hanya akan mengubah status lokal di frontend.

                console.log("Simulating report generation for month:", currentMonthKey);
                console.log("Data to report:", currentMonthExpenditures);
                console.log("Total expenditure for month:", totalCurrentMonthExpenditure);

                // Tandai bulan ini sebagai sudah dilaporkan secara lokal
                setReportedMonths(prev => ({
                    ...prev,
                    [currentMonthKey]: true
                }));

                alert("Laporan pengeluaran bulanan berhasil dibuat dan ditandai.");
                
                // Setelah laporan dibuat dan ditandai, segarkan tampilan untuk menyembunyikan data bulan ini
                // Tanpa perubahan BE, kita hanya akan memfilter ulang data yang sudah ada
                fetchExpenditureData(); 
                
            } catch (error) {
                console.error("Gagal membuat laporan pengeluaran bulanan:", error);
                alert(`Gagal membuat laporan pengeluaran bulanan: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        fetchExpenditureData();
        const handleDataUpdate = () => {
            console.log("Menerima event dataPengeluaranUpdated, memuat ulang data pengeluaran...");
            fetchExpenditureData();
        };
        window.addEventListener('dataPengeluaranUpdated', handleDataUpdate);
        return () => {
            window.removeEventListener('dataPengeluaranUpdated', handleDataUpdate);
        };
    }, [fetchExpenditureData]);

    useEffect(() => {
        applyFilterToData(dataPengeluaran, selectedDateForFilter);
    }, [dataPengeluaran, selectedDateForFilter, applyFilterToData]);

    // Efek untuk memeriksa perubahan bulan dan mengatur ulang filter jika diperlukan
    useEffect(() => {
        const checkMonthChange = () => {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            
            // Jika ada filter tanggal spesifik yang tidak lagi berada di bulan ini, reset
            if (selectedDateForFilter && 
                (selectedDateForFilter.getMonth() !== currentMonth || 
                 selectedDateForFilter.getFullYear() !== currentYear)) {
                resetFilter();
            }
        };

        // Jalankan sekali saat komponen dimuat
        checkMonthChange();

        // Atur interval untuk memeriksa perubahan bulan (misalnya setiap jam atau setiap hari)
        const interval = setInterval(checkMonthChange, 1000 * 60 * 60 * 24); // Setiap hari

        return () => clearInterval(interval);
    }, [selectedDateForFilter, resetFilter]);


    const handleOpenTambahModal = () => {
        setIsTambahModalOpen(true);
    };

    const handleCloseTambahModal = () => {
        setIsTambahModalOpen(false);
    };

    const handleDeleteAction = async (expenditure_id) => {
        if (!expenditure_id) {
            console.error("[handleDeleteAction] ID Pengeluaran tidak ditemukan atau tidak valid untuk dihapus.");
            alert("Gagal menghapus data: ID tidak valid.");
            return;
        }

        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                const deleteUrl = `${API_BASE_URL}/expenditures/delete/${expenditure_id}`;
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
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
                window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'));
            } catch (error) {
                console.error("[handleDeleteAction] Kesalahan menghapus data pengeluaran:", error);
                alert(`Gagal menghapus data pengeluaran: ${error.message}`);
            }
        }
    };

    const getExportFileName = (ext) => {
        const date = new Date().toISOString().split("T")[0];
        const filterInfo = selectedDateForFilter ? `_${formatDateToDisplay(selectedDateForFilter).replace(/\-/g, '')}` : '_current_month';
        return `laporan_pengeluaran${filterInfo}_${date}.${ext}`;
    };

    const handleExportExcelAction = () => {
        // Ekspor berdasarkan filteredData yang ditampilkan di tabel (bulan ini atau tanggal spesifik)
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
            alert("Tidak ada data untuk diekspor ke Excel (sesuai filter saat ini)!");
            return;
        }
        try {
            const dataToExport = filteredData.map(item => ({
                "Tanggal Pengeluaran": formatDateToDisplay(item.issue_date),
                "Total": parseFloat(item.amount),
                "Keterangan": item.information,
                "Kategori": item.action,
            }));
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pengeluaran");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Kesalahan export Excel:", error);
            alert("Gagal export Excel!");
        }
    };

    const handleExportPDFAction = () => {
        // Ekspor berdasarkan filteredData yang ditampilkan di tabel (bulan ini atau tanggal spesifik)
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
            alert("Tidak ada data untuk diekspor ke PDF (sesuai filter saat ini)!");
            return;
        }
        try {
            const doc = new jsPDF();
            const tableColumn = [
                "Tanggal Pengeluaran",
                "Total",
                "Keterangan",
                "Kategori",
            ];
            const tableRows = filteredData.map((item) => [
                formatDateToDisplay(item.issue_date),
                formatCurrency(parseFloat(item.amount)),
                item.information,
                item.action,
            ]);

            doc.text(`Laporan Data Pengeluaran ${selectedDateForFilter ? `(${formatDateToDisplay(selectedDateForFilter)})` : '(Bulan Ini)'}`, 14, 15);
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
                // Menghilangkan didDrawPage di sini karena total akan di luar tabel
            });
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            console.error("Kesalahan export PDF:", error);
            alert("Gagal export PDF!");
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
    }, []);

    const isDataAvailableForExport = !isLoading && Array.isArray(filteredData) && filteredData.length > 0;
    // Logika untuk disabled tidak lagi digunakan di tombol, tapi masih bisa berguna untuk logika lain jika perlu
    // const isReportGenerationAvailable = !isLoading && Array.isArray(currentMonthExpenditures) && currentMonthExpenditures.length > 0;
    // const today = new Date();
    // const currentMonthKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    // const isCurrentMonthReported = reportedMonths[currentMonthKey];
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
            <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
                <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-6">
                    Pengeluaran
                </h1>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex gap-4">
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
                        <button
                            onClick={handleOpenTambahModal}
                            className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                        >
                            <PlusCircle size={20} /> <span>Tambah</span>
                        </button>
                        {/* Tombol Buat Laporan diubah di sini */}
                        <button
                            onClick={handleGenerateReport}
                            className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                        >
                            <Zap size={20} /> {/* Warna ikon akan mengikuti warna teks */}
                            <span>Buat Laporan</span>
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportExcelAction}
                            disabled={!isDataAvailableForExport}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isDataAvailableForExport ? "bg-green-100 text-black hover:bg-[#B8D4F9]" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                        >
                            <FileSpreadsheet size={20} color={isDataAvailableForExport ? "green" : "gray"} /> <span>Ekspor Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDFAction}
                            disabled={!isDataAvailableForExport}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isDataAvailableForExport ? "bg-red-100 text-black hover:bg-[#B8D4F9]" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                        >
                            <FileText size={20} color={isDataAvailableForExport ? "red" : "gray"} /> <span>Ekspor PDF</span>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center p-10">Memuat data pengeluaran...</div>
                ) : (
                    <div className="flex flex-col"> {/* Tambahkan flex-col untuk menempatkan total di bawah */}
                        <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8">
                            <table className="min-w-full table-auto bg-white text-sm">
                                <thead className="bg-[#3D6CB9] text-white">
                                    <tr>
                                        {["Tanggal Pengeluaran", "Total", "Keterangan", "Kategori", "Aksi"]
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
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center p-4 text-gray-500 font-medium">Data Tidak Ditemukan {selectedDateForFilter ? `untuk tanggal ${formatDateToDisplay(selectedDateForFilter)}` : (reportedMonths[`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`] ? "untuk bulan ini (sudah dilaporkan)" : "")}</td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.expenditure_id} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200">
                                                <td className="p-3">{formatDateToDisplay(item.issue_date)}</td>
                                                <td className="p-3">{formatCurrency(parseFloat(item.amount))}</td>
                                                <td className="p-3">{item.information}</td>
                                                <td className="p-3">{item.action}</td>
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={`/dashboard/akuntansi/pengeluaran/edit-pengeluaran/${item.expenditure_id}`}
                                                            className="text-indigo-600 hover:underline"
                                                            title="Edit"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>
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
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Total Pengeluaran dipindahkan ke pojok kanan bawah */}
                        {filteredData.length > 0 && (
                            <div className="flex justify-end p-4 text-lg font-semibold text-gray-700">
                                Total Pengeluaran: <span className="ml-2 text-blue-700">{formatCurrency(totalCurrentMonthExpenditure)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <TambahPengeluaran
                isOpen={isTambahModalOpen}
                onClose={handleCloseTambahModal}
                onAddData={() => window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'))}
                initialDate={new Date()}
            />

            {children}
        </div>
        </div>
    );
};

export default withAuth(PengeluaranPage);