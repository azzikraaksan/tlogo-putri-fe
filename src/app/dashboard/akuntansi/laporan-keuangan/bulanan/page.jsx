"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "/components/Sidebar.jsx";
import withAuth from "/src/app/lib/withAuth";
import ConfirmationPopup from "/components/akuntansi/ConfirmationPopup";
import {
    FileText,
    FileSpreadsheet,
    CircleArrowLeft,
    Zap
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from 'next/navigation';

// const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = "https://tpapi.siunjaya.id/api";

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

const getMonthName = (monthNumber) => {
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return monthNames[monthNumber - 1] || "";
};

const formatMonthYearForDisplay = (month, year) => {
    if (!month || !year) return "-";
    return `${getMonthName(month)} ${year}`;
};

const formatDateFull = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
        return dateString;
    }
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const BulananPage = ({ children }) => {
    const [dataBulanan, setDataBulanan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const router = useRouter();

    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");

    // Fungsi showNotification dikosongkan agar tidak menampilkan notifikasi
    const showNotification = useCallback((message, type) => {
        // Biarkan fungsi ini kosong
    }, []);

    const handleConfirm = useCallback(() => {
        if (confirmAction) {
            confirmAction();
        }
        setShowConfirmPopup(false);
        setConfirmAction(null);
        setConfirmMessage("");
    }, [confirmAction]);

    const handleCancel = useCallback(() => {
        setShowConfirmPopup(false);
        setConfirmAction(null);
        setConfirmMessage("");
    }, []);

    const loadDataFromBackend = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/reports/bulan?bulan=${selectedMonth}&tahun=${selectedYear}`
            );

            const result = await response.json();

            if (!response.ok) {
                let errorMessage = result.message || `Gagal memuat data: Status ${response.status}.`;
                let notificationType = 'error';

                if(response.status === 404 || result.status === 'not_found' || (result.message && result.message.toLowerCase().includes('tidak ditemukan'))) {
                    notificationType = 'info';
                    errorMessage = `Data tidak ditemukan untuk bulan ${new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}.`;
                }
                
                showNotification(errorMessage, notificationType);
                setDataBulanan([]);
                return;
            }

            const fetchedData = result.data || [];

            const formattedData = fetchedData.map(item => ({
                key: item.id || item.report_id,
                reportId: item.report_id,
                reportDate: item.report_date,
                cash: parseFloat(item.cash || 0),
                operational: parseFloat(item.operational || 0),
                expenditure: parseFloat(item.expenditure || 0),
                netCash: parseFloat(item.net_cash || 0),
                cleanOperations: parseFloat(item.clean_operations || 0),
                jeepAmount: parseInt(item.jeep_amount || 0),
            }));

            formattedData.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));

            setDataBulanan(formattedData);
        } catch (error) {
            // console.error("Gagal memuat data dari backend:", error); // DIKOMENTARI/DIHAPUS
            showNotification(`Gagal memuat data: ${error.message || 'Terjadi kesalahan.'}`, 'error');
            setDataBulanan([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedMonth, selectedYear, showNotification]);

    useEffect(() => {
        loadDataFromBackend();
    }, [loadDataFromBackend]);

    const totalNetCashBulanan = useMemo(() => {
        if (dataBulanan.length > 0) {
            return dataBulanan[0].netCash;
        }
        return 0;
    }, [dataBulanan]);

    const handleGenerateReport = () => {
        setConfirmMessage("Konfirmasi pembuatan laporan bulanan.");

        setConfirmAction(() => async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/reports/generate`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                });
                const result = await response.json();
                if (!response.ok) {
                    let errorMessage = result.message || `Gagal memicu generate laporan: Status ${response.status}.`;
                    throw new Error(errorMessage);
                }
                
                if (result.message && (result.message.toLowerCase().includes("sudah ada") || result.message.toLowerCase().includes("sudah dibuat") || result.message.toLowerCase().includes("latest") || result.message.toLowerCase().includes("no new data"))) {
                    showNotification(`Data laporan bulanan sudah terbaru.`, 'info');
                } else {
                    showNotification(result.message || 'Laporan berhasil dibuat.', 'success');
                }
                
                await loadDataFromBackend();
            } catch (error) {
                // console.error("Error generating report:", error); // DIKOMENTARI/DIHAPUS
                showNotification(`Gagal membuat laporan: ${error.message}`, 'error');
            } finally {
                setIsLoading(false);
            }
        });
        setShowConfirmPopup(true);
    };

    const getExportFileName = (ext) => {
        const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' });
        return `laporan_bulanan_${monthName}_${selectedYear}.${ext}`;
    };

    const handleExportExcelAction = () => {
        if (dataBulanan.length === 0) {
            showNotification("Tidak ada data untuk diekspor.", 'info');
            return;
        }
        try {
            const dataToExport = dataBulanan.map(item => ({
                "Tanggal Laporan": formatDateFull(item.reportDate),
                "Operasional": item.operational,
                "Kas": item.cash,
                "Pengeluaran": item.expenditure,
                "Operasional Bersih": item.cleanOperations,
                "Kas Bersih": item.netCash,
                "Jumlah Jeep": item.jeepAmount,
            }));
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Laporan Bulanan");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
            showNotification("Ekspor Excel berhasil.", 'success');
        } catch (error) {
            // console.error("Error exporting Excel:", error); // DIKOMENTARI/DIHAPUS
            showNotification("Ekspor Excel gagal.", 'error');
        }
    };

    const handleExportPDFAction = () => {
        if (dataBulanan.length === 0) {
            showNotification("Tidak ada data untuk diekspor.", 'info');
            return;
        }
        try {
            const doc = new jsPDF('landscape');
            const tableColumn = ["Tanggal Laporan", "Operasional", "Kas", "Pengeluaran", "Operasional Bersih", "Kas Bersih", "Jumlah Jeep"];
            const tableRows = dataBulanan.map(item => [
                formatDateFull(item.reportDate),
                formatRupiah(item.operational),
                formatRupiah(item.cash),
                formatRupiah(item.expenditure),
                formatRupiah(item.cleanOperations),
                formatRupiah(item.netCash),
                item.jeepAmount,
            ]);
            const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' });
            doc.text(`Laporan Data Bulanan - ${monthName} ${selectedYear}`, 14, 15);
            autoTable(doc, {
                head: [tableColumn], body: tableRows, startY: 20,
                styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
                headStyles: { fillColor: [61, 108, 185], fontSize: 9 },
                didDrawPage: data => {
                    doc.setFontSize(7);
                    doc.text("Page " + doc.internal.getNumberOfPages(), data.settings.margin.left, doc.internal.pageSize.height - 10);
                }
            });
            doc.save(getExportFileName("pdf"));
            showNotification("Ekspor PDF berhasil.", 'success');
        } catch (error) {
            // console.error("Gagal export PDF:", error); // DIKOMENTARI/DIHAPUS
            showNotification("Ekspor PDF gagal.", 'error');
        }
    };

    const tableHeaders = ["Tanggal Laporan", "Operasional", "Kas", "Pengeluaran", "Operasional Bersih", "Kas Bersih", "Jumlah Jeep"];
    const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(2000, i).toLocaleString('id-ID', { month: 'long' }) }));

    const years = useMemo(() => {
        const _currentYear = new Date().getFullYear();
        const yearsArray = [];
        const startYear = _currentYear - 10;
        const endYear = _currentYear + 5;
        for (let i = endYear; i >= startYear; i--) {
            yearsArray.push(i);
        }
        return yearsArray;
    }, []);

    const handleGoBack = () => router.push("/dashboard/akuntansi/laporan-keuangan");

    const isExportButtonDisabled = isLoading || dataBulanan.length === 0;
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden" style={{ marginLeft: isSidebarOpen ? 290 : 70 }}>
                <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
                    <h1 className="text-[28px] md:text-[32px] font-semibold text-black flex items-center gap-3 cursor-pointer hover:text-[#3D6CB9] transition-colors mb-6" onClick={handleGoBack}>
                        <CircleArrowLeft size={28} /> Laporan Bulanan
                    </h1>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex gap-2 items-center">
                                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))} className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black cursor-pointer">
                                    {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
                                </select>
                                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))} className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black cursor-pointer">
                                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                                </select>
                            </div>
                            <button onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-[#3D6CB9] hover:bg-[#B8D4F9] text-white hover:text-black cursor-pointer">
                                <Zap size={20} /> <span>Buat Laporan</span>
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleExportExcelAction} disabled={isExportButtonDisabled} className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isExportButtonDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-100 text-black hover:bg-[#B8D4F9] cursor-pointer"}`}>
                                <FileSpreadsheet size={20} color={isExportButtonDisabled ? "gray" : "green"} /> <span>Ekspor Excel</span>
                            </button>
                            <button onClick={handleExportPDFAction} disabled={isExportButtonDisabled} className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isExportButtonDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-red-100 text-black hover:bg-[#B8D4F9] cursor-pointer"}`}>
                                <FileText size={20} color={isExportButtonDisabled ? "gray" : "red"} /> <span>Ekspor PDF</span>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center p-10 text-lg font-medium text-gray-700">Memuat data laporan bulanan, mohon tunggu...</div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg shadow">
                            <div className="max-h-[600px] overflow-y-auto">
                                <table className="min-w-full table-auto bg-white text-sm">
                                    <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                                        <tr>
                                            {tableHeaders.map((header, index) => (
                                                <th key={header} className="p-2 text-center whitespace-nowrap">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataBulanan.length === 0 ? (
                                            <tr>
                                                <td colSpan={tableHeaders.length} className="text-center p-4 text-gray-500 font-medium">
                                                    Data Tidak Ditemukan untuk Bulan {new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' })} {selectedYear}
                                                </td>
                                            </tr>
                                        ) : (
                                            dataBulanan.map(item => (
                                                <tr key={item.key} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200">
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

                    {!isLoading && dataBulanan.length > 0 && (
                       <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
                               <span className="font-bold text-lg">Kas Bersih Terakhir Bulan Ini:</span>
                               <span className="text-lg font-semibold text-[#3D6CB9]">{formatRupiah(totalNetCashBulanan)}</span>
                       </div>
                    )}
                </div>
                {children}
            </div>

            {/* Confirmation Popup */}
            <ConfirmationPopup
                isOpen={showConfirmPopup}
                message={confirmMessage}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />

            {/* Notification Popup sudah dihapus */}
        </div>
    );
};

export default withAuth(BulananPage);