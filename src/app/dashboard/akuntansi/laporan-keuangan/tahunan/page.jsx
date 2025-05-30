"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { FileText, FileSpreadsheet, ArrowLeft } from "lucide-react"; // Menghapus import Zap
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from 'next/navigation';

const API_BASE_URL = "http://localhost:8000/api";

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

// Helper function to format report date for display (e.g., "Tahun 2023")
const formatYearForReport = (year) => {
    return `Tahun ${year}`;
};

const TahunanPage = ({ children }) => {
    const [dataTahunan, setDataTahunan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const router = useRouter();

    const handleGoBack = () => {
        router.push("/dashboard/akuntansi/laporan-keuangan");
    };

    const loadDataFromBackend = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/reports/tahun?year=${selectedYear}`
            );
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Data laporan tahunan tidak ditemukan untuk Tahun ${selectedYear}`);
                    setDataTahunan([]);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();
            const fetchedData = Array.isArray(rawData) ? rawData : rawData.data || [];

            const formattedData = fetchedData.map(item => ({
                reportId: item.report_id,
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
            setDataTahunan(formattedData);
        } catch (error) {
            console.error("Gagal memuat laporan tahunan dari backend:", error);
            alert("Terjadi kesalahan saat memuat data laporan tahunan. Pastikan backend berjalan dan endpoint '/api/reports/tahun' mengembalikan data yang valid.");
            setDataTahunan([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedYear]);

    useEffect(() => {
        loadDataFromBackend();
    }, [loadDataFromBackend]);

    const totalNetCashTahunan = useMemo(() => {
        return dataTahunan.reduce((sum, item) => sum + (item.netCash || 0), 0);
    }, [dataTahunan]);

    // Bagian handleGenerateReport telah dihapus

    const getExportFileName = (ext) => {
        return `laporan_tahunan_${selectedYear}.${ext}`;
    };

    const handleExportExcelAction = () => {
        if (dataTahunan.length === 0) {
            alert("Data kosong, tidak bisa export Excel!");
            return;
        }
        try {
            const dataToExport = dataTahunan.map(item => ({
                // "ID Laporan": item.reportId,
                "Periode Laporan": formatYearForReport(selectedYear),
                "Operasional": item.operational,
                "Kas": item.cash,
                "Pengeluaran": item.expenditure,
                "Operasional Bersih": item.cleanOperations,
                "Kas Bersih": item.netCash,
                "Jumlah Jeep": item.jeepAmount,
            }));

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Laporan Tahunan");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Export Excel error:", error);
            alert("Gagal export Excel!");
        }
    };

    const handleExportPDFAction = () => {
        if (dataTahunan.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF('landscape');
            const tableColumn = [
                "Periode Laporan", "Operasional", "Kas",
                "Pengeluaran", "Operasional Bersih", "Kas Bersih","Jumlah Jeep"
            ];
            const tableRows = dataTahunan.map((item) => [
                // item.reportId, // Dihapus karena tidak ada di header Excel
                formatYearForReport(selectedYear),
                formatRupiah(item.operational),
                formatRupiah(item.cash),
                formatRupiah(item.expenditure),
                formatRupiah(item.cleanOperations),
                formatRupiah(item.netCash),
                item.jeepAmount,
            ]);

            doc.text(`Laporan Data Tahunan - Tahun ${selectedYear}`, 14, 15);
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
                headStyles: { fillColor: [61, 108, 185], fontSize: 9 },
                didDrawPage: function(data) {
                    let str = "Page " + doc.internal.getNumberOfPages();
                    doc.setFontSize(7);
                    doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
                }
            });
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            console.error("Export PDF error:", error);
            alert("Gagal export PDF!");
        }
    };

    const tableHeaders = [
        "Periode Laporan",  "Operasional", "Kas",
        "Pengeluaran", "Operasional Bersih","Kas Bersih", "Jumlah Jeep"
    ];

    const currentYear = new Date().getFullYear();
    const years = useMemo(() => {
        const yearsArray = [];
        const startYear = 2015;
        const endYear = currentYear + 5;

        for (let i = startYear; i <= endYear; i++) {
            yearsArray.push(i);
        }
        return yearsArray;
    }, [currentYear]);

    // Variabel isGenerateButtonDisabled dihapus karena tombolnya dihilangkan
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
                    Laporan Tahunan
                </h1>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex gap-4">
                        <div className="flex gap-2 items-center">
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
                        {/* Tombol "Buat Laporan Otomatis" telah dihapus */}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportExcelAction}
                            disabled={dataTahunan.length === 0 || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                dataTahunan.length === 0 || isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
                            }`}
                        >
                            <FileSpreadsheet size={20} color={dataTahunan.length === 0 || isLoading ? "gray" : "green"} />{" "}
                            <span>Ekspor Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDFAction}
                            disabled={dataTahunan.length === 0 || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                dataTahunan.length === 0 || isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-red-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
                            }`}
                        >
                            <FileText size={20} color={dataTahunan.length === 0 || isLoading ? "gray" : "red"} />{" "}
                            <span>Ekspor PDF</span>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center p-10 text-lg font-medium text-gray-700">Memuat data laporan tahunan...</div>
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
                                    {dataTahunan.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={tableHeaders.length}
                                                className="text-center p-4 text-gray-500 font-medium"
                                            >
                                                Data Tidak Ditemukan untuk Tahun {selectedYear}
                                            </td>
                                        </tr>
                                    ) : (
                                        dataTahunan.map((item) => (
                                            <tr
                                                key={item.reportId}
                                                className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                                            >
                                                {/* <td className="p-3 whitespace-nowrap">{item.reportId}</td> */}
                                                <td className="p-3 whitespace-nowrap">{formatYearForReport(selectedYear)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.operational)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.cash)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.expenditure)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.cleanOperations)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.netCash)}</td>
                                                <td className="p-3 whitespace-nowrap">{item.jeepAmount !== null ? item.jeepAmount : '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
                    <span className="font-bold text-lg">Total Kas:</span>
                    <span className="text-lg font-semibold text-[#3D6CB9]">{formatRupiah(totalNetCashTahunan)}</span>
                </div>
            </div>

            {children}
        </div>
        </div>
    );
};

export default withAuth(TahunanPage);