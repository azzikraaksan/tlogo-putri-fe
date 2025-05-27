"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from 'next/navigation';
import {
    CalendarDays,
    FileText,
    FileSpreadsheet,
    RotateCcw,
    ArrowLeft,
    Zap // Icon untuk generate laporan
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Base URL untuk API backend Anda
const API_BASE_URL = "http://localhost:8000/api";

// Fungsi helper untuk format tanggal ke tampilan (DD-MM-YYYY)
const formatDateToDisplay = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
        return dateString; // Kembali string asli jika tidak bisa di-parse
    }
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Fungsi helper untuk format tanggal ke ISO (YYYY-MM-DD)
const formatToISODate = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
};

// Fungsi helper untuk format angka ke Rupiah
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

const HarianPage = () => {
    const [dataHarian, setDataHarian] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDateForFilter, setSelectedDateForFilter] = useState(null);
    const [tempDateForPicker, setTempDateForPicker] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const calendarRef = useRef(null);

    const router = useRouter();

    // Fungsi untuk kembali ke halaman sebelumnya
    const handleGoBack = () => {
        router.push("/dashboard/akuntansi/laporan-keuangan");
    };

    // Fungsi untuk memuat dan memfilter data dari backend
    const loadAndFilterData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/dailyreports/alldaily`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Detail: ${errorText || 'Tidak ada detail error.'}`);
            }
            const data = await response.json();

            const fetchedRawData = Array.isArray(data) ? data : data.data || [];

            if (!Array.isArray(fetchedRawData)) {
                console.error("Data dari backend bukan array atau tidak memiliki properti 'data':", fetchedRawData);
                throw new Error("Format data dari backend tidak valid.");
            }

            const formattedData = fetchedRawData.map(item => ({
                idDailyReport: item.id_daily_report,
                bookingId: item.booking_id,
                salariesId: item.salaries_id,
                stomachNo: item.stomach_no,
                touringPacket: item.touring_packet,
                information: item.information,
                code: item.code,
                marketing: parseFloat(item.marketing),
                cash: parseFloat(item.cash),
                oop: parseFloat(item.oop),
                payDriver: parseFloat(item.pay_driver),
                totalCash: parseFloat(item.total_cash),
                amount: parseInt(item.amount),
                price: parseFloat(item.price),
                driverAccept: parseFloat(item.driver_accept),
                payingGuest: parseFloat(item.paying_guest),
                arrivalTime: item.arrival_time,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
            }));

            setDataHarian(formattedData);

            if (selectedDateForFilter) {
                const formattedFilterDate = formatToISODate(selectedDateForFilter);
                setFilteredData(
                    formattedData.filter(
                        (item) => item.arrivalTime && formatToISODate(item.arrivalTime) === formattedFilterDate
                    )
                );
            } else {
                setFilteredData(formattedData);
            }
        } catch (error) {
            console.error("Gagal memuat laporan harian dari backend:", error);
            alert(`Terjadi kesalahan saat memuat data laporan harian: ${error.message}. Pastikan backend berjalan dan mengembalikan data yang valid.`);
            setDataHarian([]);
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDateForFilter]);

    useEffect(() => {
        loadAndFilterData();
    }, [loadAndFilterData]);

    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker);
        setIsDatePickerOpen(false);
    };

    const resetFilter = () => {
        setSelectedDateForFilter(null);
        setTempDateForPicker(null);
        setIsDatePickerOpen(false);
    };

    const handleGenerateDailyReport = async () => {
        if (!confirm("Apakah Anda yakin ingin memicu perhitungan laporan harian otomatis dari backend? Proses ini mungkin memerlukan waktu.")) {
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/dailyreports/generate-report`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => response.text());
                let errorMessage = `Gagal memicu generate laporan harian: ${response.status} ${response.statusText}`;
                if (typeof errorData === 'object' && errorData !== null && errorData.message) {
                    errorMessage += `. Detail: ${errorData.message}`;
                } else if (typeof errorData === 'string') {
                    errorMessage += `. Detail: ${errorData}`;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            alert(`Proses perhitungan laporan harian berhasil dipicu di backend. ${result.message || 'Memuat data terbaru...'}`);
            await loadAndFilterData();
        } catch (error) {
            console.error("Error saat memicu generate laporan harian:", error);
            alert(`Gagal memicu generate laporan harian: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getExportFileName = (ext) => {
        const date = selectedDateForFilter ? formatToISODate(selectedDateForFilter) : "all_dates";
        return `laporan_harian_${date}.${ext}`;
    };

    const handleExportExcelAction = () => {
        if (filteredData.length === 0) {
            alert("Data kosong, tidak bisa export Excel!");
            return;
        }
        try {
            const dataToExport = filteredData.map(item => ({
                "ID Laporan Harian": item.idDailyReport,
                "ID Pemesanan": item.bookingId,
                "ID Gaji": item.salariesId,
                "No. LB": item.stomachNo,
                "Paket Tur": item.touringPacket,
                "Keterangan": item.information,
                "Kode": item.code,
                "Marketing": item.marketing,
                "Kas": item.cash,
                "OPP": item.oop,
                "Driver Bayar": item.payDriver,
                "Total Kas": item.totalCash,
                "Jumlah": item.amount,
                "Harga": item.price,
                "Driver Terima": item.driverAccept,
                "Tamu Bayar": item.payingGuest,
                "Waktu Tiba": formatDateToDisplay(item.arrivalTime),
                "Dibuat Pada": item.createdAt ? formatDateToDisplay(item.createdAt) : '-',
                "Diperbarui Pada": item.updatedAt ? formatDateToDisplay(item.updatedAt) : '-',
            }));

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Laporan Harian");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Export Excel error:", error);
            alert("Gagal export Excel!");
        }
    };

    const handleExportPDFAction = () => {
        if (filteredData.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF('landscape');
            const tableColumn = [
                "No. LB", "Paket Tur", "Info", "Kode", "Marketing", "Kas", "OOP",
                "Bayar Driver", "Total Kas", "Jumlah", "Harga", "Driver Terima",
                "Tamu Bayar", "Waktu Tiba"
            ];
            const tableRows = filteredData.map((item) => [
                item.stomachNo || '-',
                item.touringPacket || '-',
                item.information || '-',
                item.code || '-',
                formatRupiah(item.marketing),
                formatRupiah(item.cash),
                formatRupiah(item.oop),
                formatRupiah(item.payDriver),
                formatRupiah(item.totalCash),
                item.amount || 0,
                formatRupiah(item.price),
                formatRupiah(item.driverAccept),
                formatRupiah(item.payingGuest),
                formatDateToDisplay(item.arrivalTime),
            ]);

            doc.text(`Laporan Data Harian`, 14, 15);
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: {
                    fontSize: 6,
                    cellPadding: 1,
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [61, 108, 185],
                    fontSize: 7,
                },
                didDrawPage: function(data) {
                    let str = "Page " + doc.internal.getNumberOfPages()
                    doc.setFontSize(7)
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

    const tableDisplayHeaders = [
        "No. LB", "Paket Tur", "Keterangan", "Kode", "Marketing", "Kas", "OPP",
        "Driver Bayar", "Total Kas", "Jumlah", "Harga", "Driver Terima",
        "Tamu Bayar", "Waktu Tiba"
    ];

    // Tentukan apakah ada data atau tidak
    const hasData = filteredData.length > 0;

    return (
        <div className="flex relative bg-white-50 min-h-screen">
            <UserMenu />
            <Sidebar />
            <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
                <h1
                    className="text-[28px] md:text-[32px] font-semibold text-black flex items-center gap-3 cursor-pointer hover:text-[#3D6CB9] transition-colors mb-6"
                    onClick={handleGoBack}
                >
                    <ArrowLeft size={28} />
                    Laporan Harian
                </h1>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    {/* Filter Section */}
                    <div className="flex gap-4">
                        {/* Date Picker untuk Filter */}
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
                                    <RotateCcw size={20} /> <span>Set Ulang Filter</span>
                                </button>
                            )}
                            {isDatePickerOpen && (
                                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12">
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

                        {/* Tombol Generate Laporan Harian */}
                        <button
                            onClick={handleGenerateDailyReport}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                isLoading || !hasData // Kondisi disesuaikan: abu-abu jika loading atau tidak ada data
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-[#3D6CB9] text-white hover:bg-[#B8D4F9] hover:text-black"
                            }`}
                        >
                            <Zap size={20} color={isLoading || !hasData ? "gray" : "white"} /> {/* Warna ikon disesuaikan */}
                            <span>Buat Laporan</span>
                        </button>
                    </div>

                    {/* Export Section */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportExcelAction}
                            disabled={!hasData || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                !hasData || isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-100 text-black hover:bg-[#B8D4F9]"
                            }`}
                        >
                            <FileSpreadsheet
                                size={20}
                                color={!hasData || isLoading ? "gray" : "green"}
                            />{" "}
                            <span>Ekspor Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDFAction}
                            disabled={!hasData || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                !hasData || isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-red-100 text-black hover:bg-[#B8D4F9]"
                            }`}
                        >
                            <FileText
                                size={20}
                                color={!hasData || isLoading ? "gray" : "red"}
                            />{" "}
                            <span>Ekspor PDF</span>
                        </button>
                    </div>
                </div>

                {/* Tabel dengan scrolling */}
                {isLoading ? (
                    <div className="text-center p-10 text-lg font-medium text-gray-700">
                        Memuat data laporan harian, mohon tunggu...
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow">
                        <div className="max-h-[600px] overflow-y-auto">
                            <table className="min-w-full table-auto bg-white text-sm">
                                <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                                    <tr>
                                        {tableDisplayHeaders.map((header, index) => (
                                            <th
                                                key={header}
                                                className={`p-2 text-center whitespace-nowrap`}
                                                style={{
                                                    borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
                                                    borderTopRightRadius:
                                                        index === tableDisplayHeaders.length - 1 ? "0.5rem" : undefined,
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
                                                colSpan={tableDisplayHeaders.length}
                                                className="text-center p-4 text-gray-500 font-medium bg-white-100"
                                            >
                                                Data Tidak Ditemukan
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr
                                                key={item.idDailyReport}
                                                className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                                            >
                                                <td className="p-3 whitespace-nowrap">{item.stomachNo || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{item.touringPacket || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{item.information || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{item.code || '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.marketing)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.cash)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.oop)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.payDriver)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.totalCash)}</td>
                                                <td className="p-3 whitespace-nowrap">{item.amount !== null ? item.amount : '-'}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.price)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.driverAccept)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.payingGuest)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatDateToDisplay(item.arrivalTime)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default withAuth(HarianPage);