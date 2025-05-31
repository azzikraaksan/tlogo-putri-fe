"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx"; // Pastikan path ini benar
// import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth"; // Pastikan path ini benar
import { useRouter } from 'next/navigation';
import {
    CalendarDays,
    FileText,
    FileSpreadsheet,
    RotateCcw,
    ArrowLeft,
    Zap
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
        return dateString; 
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
    return formatter.format(number).replace(/,00$/, '').replace(/,/g, '.').replace('Rp', 'Rp.');
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

    const handleGoBack = () => {
        router.push("/dashboard/akuntansi/laporan-keuangan");
    };

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
        const date = selectedDateForFilter ? formatToISODate(selectedDateForFilter) : "semua_tanggal";
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
                "Marketing (Rp)": item.marketing,
                "Kas (Rp)": item.cash,
                "OPP (Rp)": item.oop,
                "Driver Bayar (Rp)": item.payDriver,
                "Total Kas (Rp)": item.totalCash,
                "Jumlah (Pax/Unit)": item.amount,
                "Harga (Rp)": item.price,
                "Driver Terima (Rp)": item.driverAccept,
                "Tamu Bayar (Rp)": item.payingGuest,
                "Waktu Tiba": formatDateToDisplay(item.arrivalTime),
                "Dibuat Pada": item.createdAt ? formatDateToDisplay(item.createdAt) : '-',
                "Diperbarui Pada": item.updatedAt ? formatDateToDisplay(item.updatedAt) : '-',
            }));

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const columnWidths = Object.keys(dataToExport[0] || {}).map(key => ({ wch: Math.max(key.length, ...dataToExport.map(row => (row[key]?.toString() || "").length)) + 2 }));
            ws['!cols'] = columnWidths;

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
            const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
            const tableColumn = [
                "No. LB", "Paket Tur", "Info", "Kode", "Marketing", "Kas", "OPP",
                "Bayar Drv", "Total Kas", "Jml", "Harga", "Drv Terima",
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
                item.amount !== null ? item.amount : 0,
                formatRupiah(item.price),
                formatRupiah(item.driverAccept),
                formatRupiah(item.payingGuest),
                formatDateToDisplay(item.arrivalTime),
            ]);

            const title = `Laporan Data Harian ${selectedDateForFilter ? `(${formatDateToDisplay(selectedDateForFilter)})` : '(Semua Tanggal)'}`;
            doc.setFontSize(14);
            doc.text(title, 40, 40);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 55,
                theme: 'grid',
                styles: {
                    fontSize: 7,
                    cellPadding: 2,
                    overflow: 'ellipsize', 
                    halign: 'center', // Perataan default untuk semua sel jika tidak di-override
                    valign: 'middle'
                },
                headStyles: {
                    fillColor: [61, 108, 185],
                    textColor: [255, 255, 255],
                    fontSize: 8,
                    fontStyle: 'bold',
                    halign: 'center', // Header juga center
                },
                didDrawPage: function (data) {
                    let str = "Halaman " + doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    const pageWidth = doc.internal.pageSize.getWidth();
                    doc.text(str, pageWidth - data.settings.margin.right - 40, doc.internal.pageSize.height - 30);
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
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
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

    const hasData = filteredData.length > 0;
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                    marginLeft: isSidebarOpen ? 290 : 70, 
                }}
            >
                <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
                    <h1
                        className="text-[28px] md:text-[32px] font-semibold text-black flex items-center gap-3 cursor-pointer hover:text-[#3D6CB9] transition-colors mb-6"
                        onClick={handleGoBack}
                    >
                        <ArrowLeft size={28} />
                        Laporan Harian
                    </h1>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="relative" ref={calendarRef}>
                                {!selectedDateForFilter ? (
                                    <button
                                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                        className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black transition-colors"
                                    >
                                        <CalendarDays size={20} /> <span>Pilih Tanggal</span>
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700">
                                            Filter: {formatDateToDisplay(selectedDateForFilter)}
                                        </span>
                                        <button
                                            onClick={resetFilter}
                                            className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg shadow text-gray-700 hover:text-black transition-colors text-sm"
                                            title="Set Ulang Filter"
                                        >
                                            <RotateCcw size={16} /> <span>Reset</span>
                                        </button>
                                    </div>
                                )}
                                {isDatePickerOpen && (
                                    <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-full">
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
                                                className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={applyDateFilter}
                                                className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white transition-colors"
                                                disabled={!tempDateForPicker}
                                            >
                                                Pilih
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleGenerateDailyReport}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-colors ${
                                    isLoading
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-[#3D6CB9] text-white hover:bg-[#B8D4F9] hover:text-black"
                                }`}
                            >
                                <Zap size={20} color={isLoading ? "gray" : "white"} />
                                <span>Buat Laporan</span>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleExportExcelAction}
                                disabled={!hasData || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-colors ${
                                    !hasData || isLoading
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-green-100 text-black hover:bg-green-200"
                                }`}
                            >
                                <FileSpreadsheet size={20} color={!hasData || isLoading ? "gray" : "green"} />
                                <span>Ekspor Excel</span>
                            </button>
                            <button
                                onClick={handleExportPDFAction}
                                disabled={!hasData || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-colors ${
                                    !hasData || isLoading
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-red-100 text-black hover:bg-red-200"
                                }`}
                            >
                                <FileText size={20} color={!hasData || isLoading ? "gray" : "red"} />
                                <span>Ekspor PDF</span>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center p-10 text-lg font-medium text-gray-700">
                            Memuat data laporan harian, mohon tunggu...
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                                <table className="min-w-full table-auto text-sm">
                                    <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            {tableDisplayHeaders.map((header) => (
                                                <th
                                                    key={header}
                                                    className="p-3 text-center whitespace-nowrap font-semibold"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredData.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={tableDisplayHeaders.length}
                                                    className="text-center p-6 text-gray-500 font-medium"
                                                >
                                                    Data Tidak Ditemukan
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredData.map((item) => (
                                                <tr
                                                    key={item.idDailyReport}
                                                    className="hover:bg-gray-50 transition duration-150"
                                                >
                                                    {/* PERUBAHAN: Semua <td> diubah ke text-center */}
                                                    <td className="p-3 whitespace-nowrap text-center">{item.stomachNo || '-'}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{item.touringPacket || '-'}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{item.information || '-'}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{item.code || '-'}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.marketing)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.cash)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.oop)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.payDriver)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.totalCash)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{item.amount !== null ? item.amount : '-'}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.price)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.driverAccept)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.payingGuest)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatDateToDisplay(item.arrivalTime)}</td>
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
        </div>
    );
};

export default withAuth(HarianPage);