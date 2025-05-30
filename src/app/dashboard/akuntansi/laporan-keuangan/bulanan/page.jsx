"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import {
    FileText,
    FileSpreadsheet,
    ArrowLeft,
    Zap
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from 'next/navigation';

// Base URL untuk API backend Anda
const API_BASE_URL = "http://localhost:8000/api";

// Fungsi helper untuk memformat angka menjadi format Rupiah
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

// Fungsi helper untuk memformat tanggal datetime dari BE menjadi 'Bulan Tahun'
const formatDateToMonthYear = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
        return dateString;
    }
    return d.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
};

// Komponen utama halaman Laporan Bulanan
const BulananPage = ({ children }) => {
    const [dataBulanan, setDataBulanan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const router = useRouter();

    // Fungsi untuk memuat data dari Backend
    const loadDataFromBackend = useCallback(async () => {
        setIsLoading(true);
        try {
            // Menggunakan GET untuk menampilkan rekap bulanan
            const response = await fetch(
                `${API_BASE_URL}/reports/bulan?month=${selectedMonth}&year=${selectedYear}`
            );
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Data laporan bulanan tidak ditemukan untuk ${selectedMonth}-${selectedYear}`);
                    setDataBulanan([]);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();

            const fetchedData = Array.isArray(rawData) ? rawData : rawData.data || [];

            const formattedData = fetchedData.map(item => ({
                reportId: item.report_id, // Tetap ambil ID untuk key React, tapi tidak ditampilkan
                reportDate: item.report_date,
                cash: parseFloat(item.cash || 0),
                operational: parseFloat(item.operational || 0),
                expenditure: parseFloat(item.expenditure || 0),
                netCash: parseFloat(item.net_cash || 0),
                cleanOperations: parseFloat(item.clean_operations || 0),
                jeepAmount: parseInt(item.jeep_amount || 0),
                createdAt: item.created_at,
                updatedAt: item.updated_at,
            }));
            setDataBulanan(formattedData);
        } catch (error) {
            console.error("Gagal memuat laporan bulanan dari backend:", error);
            alert("Terjadi kesalahan saat memuat data laporan bulanan. Pastikan backend berjalan dan endpoint '/api/reports/bulan' mengembalikan data yang valid.");
            setDataBulanan([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedMonth, selectedYear]);

    // Efek samping untuk memuat data saat komponen dimuat pertama kali
    useEffect(() => {
        loadDataFromBackend();
    }, [loadDataFromBackend]);

    // Hitung total Kas Bersih dari semua laporan bulanan yang ditampilkan
    const totalNetCashBulanan = useMemo(() => {
        return dataBulanan.reduce((sum, item) => sum + (item.netCash || 0), 0);
    }, [dataBulanan]);

    // Fungsi untuk memicu pembuatan/perhitungan laporan bulanan baru di BE
    const handleGenerateReport = async () => {
        if (!confirm("Apakah Anda yakin ingin memicu pembuatan laporan bulanan otomatis dari backend untuk bulan/tahun saat ini?")) {
            return;
        }
        setIsLoading(true);

        try {
            // Menggunakan POST untuk generate rekap laporan bulanan
            const response = await fetch(`${API_BASE_URL}/reports/generate`, {
                method: 'POST', // Pastikan ini adalah POST
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                // Jika backend membutuhkan bulan/tahun untuk generate, uncomment baris di bawah:
                // body: JSON.stringify({ month: selectedMonth, year: selectedYear }),
            });

            if (!response.ok) {
                throw new Error(`Gagal memicu generate laporan bulanan: ${response.statusText || 'Unknown Error'}`);
            }

            alert("Proses pembuatan laporan bulanan berhasil dipicu di backend. Memuat data terbaru...");
            await loadDataFromBackend();
        } catch (error) {
            console.error("Error saat memicu generate laporan bulanan:", error);
            alert(`Gagal memicu generate laporan bulanan: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk mendapatkan nama file export (Excel/PDF)
    const getExportFileName = (ext) => {
        const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' });
        return `laporan_bulanan_${monthName}_${selectedYear}.${ext}`;
    };


    // Fungsi untuk export data ke Excel
    const handleExportExcelAction = () => {
        if (dataBulanan.length === 0) {
            alert("Data kosong, tidak bisa export Excel!");
            return;
        }
        try {
            const dataToExport = dataBulanan.map(item => ({
                // Tidak menampilkan ID Laporan di export Excel
                "Tanggal Laporan": formatDateToMonthYear(item.reportDate),
                "Kas": item.cash,
                "Operasional": item.operational,
                "Pengeluaran": item.expenditure,
                "Kas Bersih": item.netCash,
                "Operasional Bersih": item.cleanOperations,
                "Jumlah Jeep": item.jeepAmount,
            }));

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Laporan Bulanan");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Export Excel error:", error);
            alert("Gagal export Excel!");
        }
    };

    // Fungsi untuk export data ke PDF
    const handleExportPDFAction = () => {
        if (dataBulanan.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF('landscape');
            const tableColumn = [
                // Tidak menampilkan ID Laporan di export PDF
                "Tanggal Laporan", "Kas", "Operasional",
                "Pengeluaran", "Kas Bersih", "Operasional Bersih", "Jumlah Jeep"
            ];
            const tableRows = dataBulanan.map((item) => [
                formatDateToMonthYear(item.reportDate),
                formatRupiah(item.cash),
                formatRupiah(item.operational),
                formatRupiah(item.expenditure),
                formatRupiah(item.netCash),
                formatRupiah(item.cleanOperations),
                item.jeepAmount,
            ]);

            const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' });
            doc.text(`Laporan Data Bulanan - ${monthName} ${selectedYear}`, 14, 15);
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [61, 108, 185],
                    fontSize: 9,
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

    // Daftar kolom tabel yang akan ditampilkan di UI
    const tableHeaders = [
        "Tanggal Laporan", "Kas", "Operasional",
        "Pengeluaran", "Kas Bersih", "Operasional Bersih", "Jumlah Jeep" // Menambahkan "Kas Bersih"
    ];

    // Opsi bulan dan tahun untuk dropdown
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(2000, i).toLocaleString('id-ID', { month: 'long' }),
    }));

    // Generate years dynamically: dari 5 tahun ke belakang sampai 5 tahun ke depan
    const currentYear = new Date().getFullYear();
    const years = useMemo(() => {
        const yearsArray = [];
        const startYear = currentYear - 5;
        const endYear = currentYear + 5;

        for (let i = startYear; i <= endYear; i++) {
            yearsArray.push(i);
        }
        return yearsArray;
    }, [currentYear]);

    // Fungsi untuk kembali
    const handleGoBack = () => {
        router.push("/dashboard/akuntansi/laporan-keuangan");
    };

    // Tentukan kondisi untuk warna tombol "Buat Laporan"
    const isGenerateButtonDisabled = isLoading;
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
                <h1
                    className="text-[28px] md:text-[32px] font-semibold text-black flex items-center gap-3 cursor-pointer hover:text-[#3D6CB9] transition-colors mb-6"
                    onClick={handleGoBack}
                >
                    <ArrowLeft size={28} />
                    Laporan Bulanan
                </h1>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex gap-4">
                        {/* Month and Year Selectors */}
                        <div className="flex gap-2 items-center">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                                className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black cursor-pointer"
                            >
                                {months.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                                className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black cursor-pointer"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Tombol "Buat Laporan" */}
                        <button
                            onClick={handleGenerateReport}
                            disabled={isGenerateButtonDisabled}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                isGenerateButtonDisabled
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-[#3D6CB9] hover:bg-[#B8D4F9] text-white hover:text-black cursor-pointer"
                            }`}
                        >
                            <Zap size={20} color={isGenerateButtonDisabled ? "gray" : "white"} />
                            <span>Buat Laporan</span>
                        </button>
                    </div>
                    {/* Tombol Export */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportExcelAction}
                            disabled={dataBulanan.length === 0 || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                dataBulanan.length === 0 || isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
                            }`}
                        >
                            <FileSpreadsheet
                                size={20}
                                color={dataBulanan.length === 0 || isLoading ? "gray" : "green"}
                            />{" "}
                            <span>Ekspor Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDFAction}
                            disabled={dataBulanan.length === 0 || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                dataBulanan.length === 0 || isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-red-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
                            }`}
                        >
                            <FileText
                                size={20}
                                color={dataBulanan.length === 0 || isLoading ? "gray" : "red"}
                            />{" "}
                            <span>Ekspor PDF</span>
                        </button>
                    </div>
                </div>

                {/* Tabel dengan scrolling */}
                {isLoading ? (
                    <div className="text-center p-10 text-lg font-medium text-gray-700">Memuat data laporan bulanan, mohon tunggu...</div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow">
                        <div className="max-h-[600px] overflow-y-auto">
                            <table className="min-w-full table-auto bg-white text-sm">
                                <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                                    <tr>
                                        {tableHeaders.map((header, index) => (
                                            <th
                                                key={header}
                                                className={`p-2 text-center whitespace-nowrap`}
                                                style={{
                                                    borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
                                                    borderTopRightRadius:
                                                        index === tableHeaders.length - 1 ? "0.5rem" : undefined,
                                                }}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataBulanan.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={tableHeaders.length}
                                                className="text-center p-4 text-gray-500 font-medium"
                                            >
                                                Data Tidak Ditemukan untuk Bulan {new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' })} {selectedYear}
                                            </td>
                                        </tr>
                                    ) : (
                                        dataBulanan.map((item) => (
                                            <tr
                                                key={item.reportId} // Menggunakan reportId sebagai key, tapi tidak ditampilkan
                                                className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                                            >
                                                <td className="p-3 whitespace-nowrap">{formatDateToMonthYear(item.reportDate)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.cash)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.operational)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.expenditure)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.netCash)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.cleanOperations)}</td>
                                                <td className="p-3 whitespace-nowrap">{item.jeepAmount !== null ? item.jeepAmount : '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tampilan Total Kas yang fixed di kanan bawah */}
                <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
                    <span className="font-bold text-lg">Total Kas:</span>
                    <span className="text-lg font-semibold text-[#3D6CB9]">{formatRupiah(totalNetCashBulanan)}</span>
                </div>
            </div>

            {children}
        </div>
        </div>
    );
};

export default withAuth(BulananPage);