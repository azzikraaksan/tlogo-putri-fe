"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx"; // Dipertahankan sesuai kode Anda
import withAuth from "/src/app/lib/withAuth";
import { FileText, FileSpreadsheet, ArrowLeft } from "lucide-react"; // Ikon Zap dihapus
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

// Fungsi helper untuk memformat tanggal (digunakan kembali dari versi Bulanan)
const formatDateFull = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
        console.warn("Format tanggal tidak valid diterima di formatDateFull:", dateString);
        return dateString; 
    }
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const TriwulanPage = ({ children }) => {
    const router = useRouter();
    const [dataTriwulan, setDataTriwulan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedQuarter, setSelectedQuarter] = useState(() => {
        const currentMonth = new Date().getMonth() + 1; // 1-12
        if (currentMonth >= 1 && currentMonth <= 3) return 1;
        if (currentMonth >= 4 && currentMonth <= 6) return 2;
        if (currentMonth >= 7 && currentMonth <= 9) return 3;
        return 4; // Oktober-Desember
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const handleGoBack = () => {
        router.push("/dashboard/akuntansi/laporan-keuangan");
    };

    const loadDataFromBackend = useCallback(async () => {
        setIsLoading(true);
        console.log(`Memuat data untuk Triwulan: ${selectedQuarter}, Tahun: ${selectedYear}`);
        try {
            const response = await fetch(
                `${API_BASE_URL}/reports/triwulan?quarter=${selectedQuarter}&year=${selectedYear}`
            );
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Data laporan triwulan tidak ditemukan untuk Triwulan ${selectedQuarter}-${selectedYear}`);
                    setDataTriwulan([]);
                    return;
                }
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();
            const fetchedData = Array.isArray(rawData) ? rawData : rawData.data || [];

            const formattedData = fetchedData.map(item => ({
                reportId: item.report_id, // reportId tetap diambil, bisa digunakan untuk key atau detail jika perlu
                reportDate: item.report_date, // Diasumsikan backend mengirimkan tanggal relevan
                cash: parseFloat(item.cash || 0),
                operational: parseFloat(item.operational || 0),
                expenditure: parseFloat(item.expenditure || 0),
                netCash: parseFloat(item.net_cash || 0),
                cleanOperations: parseFloat(item.clean_operations || 0),
                jeepAmount: parseInt(item.jeep_amount || 0),
                // createdAt dan updatedAt bisa disertakan jika perlu, tapi tidak ditampilkan di tabel utama
                // createdAt: item.created_at, 
                // updatedAt: item.updated_at,
            }));
            setDataTriwulan(formattedData);
        } catch (error) {
            console.error("Gagal memuat laporan triwulan dari backend:", error);
            alert("Terjadi kesalahan saat memuat data laporan triwulan. Pastikan backend berjalan dan endpoint aktif.");
            setDataTriwulan([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedQuarter, selectedYear]);

    useEffect(() => {
        loadDataFromBackend();
    }, [loadDataFromBackend]);

    const totalNetCashTriwulan = useMemo(() => {
        return dataTriwulan.reduce((sum, item) => sum + (item.netCash || 0), 0);
    }, [dataTriwulan]);

    const getExportFileName = (ext) => {
        return `laporan_triwulan_${selectedQuarter}_${selectedYear}.${ext}`;
    };

    const handleExportExcelAction = () => {
        if (dataTriwulan.length === 0) {
            alert("Data kosong, tidak bisa export Excel!");
            return;
        }
        try {
            const dataToExport = dataTriwulan.map(item => ({
                "Tanggal Laporan": formatDateFull(item.reportDate), // Disesuaikan
                "Operasional": item.operational,
                "Kas": item.cash,
                "Pengeluaran": item.expenditure,
                "Operasional Bersih": item.cleanOperations,
                "Kas Bersih": item.netCash,
                "Jumlah Jeep": item.jeepAmount,
            }));

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, `Triwulan ${selectedQuarter} ${selectedYear}`);
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Export Excel error:", error);
            alert("Gagal export Excel!");
        }
    };

    const handleExportPDFAction = () => {
        if (dataTriwulan.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF('landscape');
            const tableColumn = [ // Disesuaikan urutannya
                "Tanggal Laporan", "Operasional", "Kas",
                "Pengeluaran", "Operasional Bersih", "Kas Bersih","Jumlah Jeep"
            ];
            const tableRows = dataTriwulan.map((item) => [ // Disesuaikan urutannya
                formatDateFull(item.reportDate),
                formatRupiah(item.operational),
                formatRupiah(item.cash),
                formatRupiah(item.expenditure),
                formatRupiah(item.cleanOperations),
                formatRupiah(item.netCash),
                item.jeepAmount,
            ]);

            doc.text(`Laporan Data Triwulan - Triwulan ${selectedQuarter} Tahun ${selectedYear}`, 14, 15);
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

    // Urutan header tabel disesuaikan
    const tableHeaders = [
        "Tanggal Laporan", "Operasional", "Kas",
        "Pengeluaran", "Operasional Bersih", "Kas Bersih","Jumlah Jeep"
    ];

    const quarters = [
        { value: 1, label: "Triwulan 1 (Jan-Mar)" },
        { value: 2, label: "Triwulan 2 (Apr-Jun)" },
        { value: 3, label: "Triwulan 3 (Jul-Sep)" },
        { value: 4, label: "Triwulan 4 (Okt-Des)" },
    ];

    const years = useMemo(() => {
        const _currentYear = new Date().getFullYear(); // Definisikan di dalam useMemo jika dependensi kosong
        const yearsArray = [];
        const startYear = _currentYear - 5; // 5 tahun ke belakang
        const endYear = _currentYear + 5;   // 5 tahun ke depan
        for (let i = startYear; i <= endYear; i++) {
            yearsArray.push(i);
        }
        return yearsArray;
    }, []); // Dependensi kosong agar hanya dihitung sekali

    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div
                className="flex-1 p-6 transition-all duration-300 ease-in-out"
                style={{ marginLeft: isSidebarOpen ? 290 : 70 }}
            >
                <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
                    <h1
                        className="text-[28px] md:text-[32px] font-semibold text-black flex items-center gap-3 cursor-pointer hover:text-[#3D6CB9] transition-colors mb-6"
                        onClick={handleGoBack}
                    >
                        <ArrowLeft size={28} />
                        Laporan Triwulan
                    </h1>

                    {/* Toolbar tanpa tombol "Buat Laporan" */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div className="flex gap-4 flex-wrap"> {/* Menambahkan flex-wrap */}
                            {/* Filter Triwulan dan Tahun */}
                            <div className="flex gap-2 items-center">
                                <select
                                    value={selectedQuarter}
                                    onChange={(e) => setSelectedQuarter(parseInt(e.target.value, 10))}
                                    className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black cursor-pointer"
                                >
                                    {quarters.map((quarter) => (
                                        <option key={quarter.value} value={quarter.value}>
                                            {quarter.label}
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
                        </div>
                        {/* Tombol Export */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleExportExcelAction}
                                disabled={dataTriwulan.length === 0 || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                    (dataTriwulan.length === 0 || isLoading)
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-green-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
                                }`}
                            >
                                <FileSpreadsheet size={20} color={(dataTriwulan.length === 0 || isLoading) ? "gray" : "green"} />
                                <span>Ekspor Excel</span>
                            </button>
                            <button
                                onClick={handleExportPDFAction}
                                disabled={dataTriwulan.length === 0 || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                    (dataTriwulan.length === 0 || isLoading)
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-red-100 text-black hover:bg-[#B8D4F9] cursor-pointer"
                                }`}
                            >
                                <FileText size={20} color={(dataTriwulan.length === 0 || isLoading) ? "gray" : "red"} />
                                <span>Ekspor PDF</span>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center p-10 text-lg font-medium text-gray-700">Memuat data laporan triwulan...</div>
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
                                        {dataTriwulan.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={tableHeaders.length}
                                                    className="text-center p-4 text-gray-500 font-medium"
                                                >
                                                    Data Tidak Ditemukan untuk Triwulan {selectedQuarter} Tahun {selectedYear}
                                                </td>
                                            </tr>
                                        ) : (
                                            dataTriwulan.map((item) => (
                                                <tr
                                                    key={item.reportId} // Menggunakan reportId sebagai key
                                                    className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                                                >
                                                    {/* Kolom data disesuaikan dengan tableHeaders */}
                                                    <td className="p-3 whitespace-nowrap">{formatDateFull(item.reportDate)}</td>
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
                        <span className="text-lg font-semibold text-[#3D6CB9]">{formatRupiah(totalNetCashTriwulan)}</span>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
};

export default withAuth(TriwulanPage);