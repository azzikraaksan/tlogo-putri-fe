"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth"; // Pastikan path ini benar
import {
    FileText,
    FileSpreadsheet,
    RotateCcw, // Tambahkan ikon untuk reset filter jika diperlukan
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Base URL untuk API backend Anda
const API_BASE_URL = "http://localhost:8000/api";

// Fungsi helper untuk memformat angka menjadi format Rupiah
const formatRupiah = (number) => {
    // Pastikan number adalah angka, jika tidak, return 'Rp. 0' atau sesuai kebutuhan
    if (number === null || typeof number === 'undefined' || isNaN(number)) {
        return 'Rp. 0';
    }
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Tidak menampilkan desimal jika angka bulat
        maximumFractionDigits: 2, // Maksimal 2 desimal
    });
    // Menghilangkan 'Rp' bawaan dan menggantinya dengan 'Rp.'
    return formatter.format(number).replace(/,/g, '.').replace('Rp', 'Rp.');
};

// Fungsi helper untuk memformat tanggal datetime dari BE menjadi 'Bulan Tahun'
const formatDateToMonthYear = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
        return dateString; // Fallback jika parsing gagal
    }
    return d.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
};

// Komponen utama halaman Laporan Bulanan
const BulananPage = ({ children }) => {
    const [dataBulanan, setDataBulanan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State untuk filter bulan dan tahun (default: bulan dan tahun saat ini)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Bulan saat ini (1-12)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Tahun saat ini

    // Fungsi untuk memuat data dari Backend
    const loadDataFromBackend = useCallback(async () => {
        setIsLoading(true);
        try {
            // Mengirim bulan dan tahun sebagai query parameter
            const response = await fetch(
                `${API_BASE_URL}/reports/bulan?month=${selectedMonth}&year=${selectedYear}`
            );
            if (!response.ok) {
                // Jika response 404, mungkin data tidak ada untuk bulan/tahun tersebut, bukan error fatal
                if (response.status === 4.04) {
                    console.warn(`Data laporan bulanan tidak ditemukan untuk ${selectedMonth}-${selectedYear}`);
                    setDataBulanan([]);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();

            // Pastikan data yang diterima adalah array
            // Jika backend mengembalikan { data: [...] } atau sejenisnya, sesuaikan di sini
            const fetchedData = Array.isArray(rawData) ? rawData : rawData.data || [];

            // Memetakan data dari snake_case (BE) ke camelCase (FE) dan parsing angka
            const formattedData = fetchedData.map(item => ({
                reportId: item.report_id,
                reportDate: item.report_date, // Akan diformat saat ditampilkan
                cash: parseFloat(item.cash || 0), // Tambahkan default 0 jika null/undefined
                operational: parseFloat(item.operational || 0),
                expenditure: parseFloat(item.expenditure || 0),
                netCash: parseFloat(item.net_cash || 0), // Ini adalah "Kas Bersih" yang akan dijumlahkan
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
    }, [selectedMonth, selectedYear]); // Dependencies: muat ulang jika bulan/tahun berubah

    // Efek samping untuk memuat data saat komponen dimuat pertama kali
    // dan saat selectedMonth/selectedYear berubah
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
        setIsLoading(true); // Tunjukkan loading

        try {
            // Endpoint generate mungkin tidak perlu parameter bulan/tahun jika ia menghitung bulan terakhir atau saat ini.
            // Sesuai dokumentasi '/api/reports/generate' tidak menerima parameter.
            const response = await fetch(`${API_BASE_URL}/reports/generate`, {
                method: 'GET', // Metode GET sesuai dokumentasi API Anda
                headers: {
                    'Accept': 'application/json',
                    // Tambahkan Authorization header jika diperlukan
                    // 'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Gagal memicu generate laporan bulanan: ${response.statusText || 'Unknown Error'}`);
            }

            alert("Proses pembuatan laporan bulanan berhasil dipicu di backend. Memuat data terbaru...");
            await loadDataFromBackend(); // Muat ulang data setelah generate
        } catch (error) {
            console.error("Error saat memicu generate laporan bulanan:", error);
            alert(`Gagal memicu generate laporan bulanan: ${error.message}`);
        } finally {
            setIsLoading(false); // Selesai loading
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
            // Siapkan data untuk export, sesuaikan dengan nama header yang diinginkan
            const dataToExport = dataBulanan.map(item => ({
                "ID Laporan": item.reportId,
                "Tanggal Laporan": formatDateToMonthYear(item.reportDate), // Untuk tampilan
                "Kas": item.cash, // Export sebagai angka untuk Excel
                "Operasional": item.operational,
                "Pengeluaran": item.expenditure,
                // "Kas Bersih": item.netCash, // Dihapus dari export Excel
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
            const doc = new jsPDF('landscape'); // Gunakan landscape jika kolom banyak
            // Sesuaikan kolom dan baris tabel untuk PDF
            const tableColumn = [
                "ID Laporan", "Tanggal Laporan", "Kas", "Operasional",
                "Pengeluaran", "Operasional Bersih", "Jumlah Jeep" // "Kas Bersih" dihapus
            ];
            const tableRows = dataBulanan.map((item) => [
                item.reportId,
                formatDateToMonthYear(item.reportDate),
                formatRupiah(item.cash),
                formatRupiah(item.operational),
                formatRupiah(item.expenditure),
                // formatRupiah(item.netCash), // Dihapus dari export PDF
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
                    overflow: 'linebreak', // Pastikan teks terpotong jika terlalu panjang
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
    // Kolom "Kas Bersih" telah dihapus dari sini
    const tableHeaders = [
        "ID Laporan", "Tanggal Laporan", "Kas", "Operasional",
        "Pengeluaran", "Operasional Bersih", "Jumlah Jeep"
    ];

    // Opsi bulan dan tahun untuk dropdown
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(2000, i).toLocaleString('id-ID', { month: 'long' }),
    }));
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // 2 tahun ke belakang, tahun ini, 2 tahun ke depan

    return (
        <div className="flex relative bg-white-50 min-h-screen">
            <UserMenu />
            <Sidebar />
            <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
                <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
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
                                className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black"
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
                                className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Tombol "Buat Laporan Otomatis" */}
                        <button
                            onClick={handleGenerateReport}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-[#3D6CB9] hover:bg-[#B8D4F9] text-white hover:text-black"
                            }`}
                        >
                            <span>Buat Laporan Otomatis</span>
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
                                    : "bg-green-100 text-black hover:bg-[#B8D4F9]"
                            }`}
                        >
                            <FileSpreadsheet
                                size={20}
                                color={dataBulanan.length === 0 || isLoading ? "gray" : "green"}
                            />{" "}
                            <span>Export Excel</span>
                        </button>
                        <button
                            onClick={handleExportPDFAction}
                            disabled={dataBulanan.length === 0 || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                                dataBulanan.length === 0 || isLoading
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-red-100 text-black hover:bg-[#B8D4F9]"
                            }`}
                        >
                            <FileText
                                size={20}
                                color={dataBulanan.length === 0 || isLoading ? "gray" : "red"}
                            />{" "}
                            <span>Export PDF</span>
                        </button>
                    </div>
                </div>

                {/* Tabel dengan scrolling */}
                {isLoading ? (
                    <div className="text-center p-10">Memuat data laporan bulanan...</div>
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
                                                key={item.reportId}
                                                className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200"
                                            >
                                                <td className="p-3 whitespace-nowrap">{item.reportId}</td>
                                                <td className="p-3 whitespace-nowrap">{formatDateToMonthYear(item.reportDate)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.cash)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.operational)}</td>
                                                <td className="p-3 whitespace-nowrap">{formatRupiah(item.expenditure)}</td>
                                                {/* Kolom Kas Bersih dihapus dari tabel */}
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

                {/* Tampilan Total Kas (Kas Bersih) yang fixed di kanan bawah */}
                {/* Menggantikan div sebelumnya yang menggunakan mt-6 */}
                <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20"> {/* Tambahkan z-index agar selalu di atas */}
                    <span className="font-bold text-lg">Total Kas:</span> {/* Diubah menjadi "Total Kas (Bersih)" */}
                    <span className="text-lg font-semibold text-[#3D6CB9]">{formatRupiah(totalNetCashBulanan)}</span>
                </div>
            </div>

            {children}
        </div>
    );
};

export default withAuth(BulananPage);