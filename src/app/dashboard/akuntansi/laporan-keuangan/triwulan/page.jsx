"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react"; // Added useRef
import Sidebar from "/components/Sidebar.jsx";
import withAuth from "/src/app/lib/withAuth";
import ConfirmationPopup from "/components/akuntansi/ConfirmationPopup"; // Import ConfirmationPopup
// import NotificationPopup from "/components/akuntansi/NotificationPopup"; // DIKOMENTARI/DIHAPUS
import { FileText, FileSpreadsheet, CircleArrowLeft, } from "lucide-react";
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

const TriwulanPage = ({ children }) => {
    const router = useRouter();
    const [dataTriwulan, setDataTriwulan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const [selectedQuarter, setSelectedQuarter] = useState(() => {
        const currentMonth = new Date().getMonth() + 1;
        if (currentMonth >= 1 && currentMonth <= 3) return 1;
        if (currentMonth >= 4 && currentMonth <= 6) return 2;
        if (currentMonth >= 7 && currentMonth <= 9) return 3;
        return 4;
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // State for custom pop-ups
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");
    // const [notification, setNotification] = useState({ message: '', type: '' }); // DIKOMENTARI/DIHAPUS

    // Fungsi showNotification dikosongkan agar tidak menampilkan notifikasi
    const showNotification = useCallback((message, type) => {
        // Biarkan fungsi ini kosong agar tidak ada notifikasi yang muncul
        // Jika ingin mengaktifkannya kembali, uncomment baris: setNotification({ message, type });
    }, []);

    const handleGoBack = () => {
        router.push("/dashboard/akuntansi/laporan-keuangan");
    };

    const loadDataFromBackend = useCallback(async () => {
        setIsLoading(true);
        setDataTriwulan([]);
        try {
            const response = await fetch(
                `${API_BASE_URL}/reports/triwulan?quarter=${selectedQuarter}&year=${selectedYear}`
            );
            if (!response.ok) {
                // Notifikasi dan error handling di sini dinonaktifkan dari console dan UI
                // const errorText = await response.text();
                // let errorMessage = `Gagal memuat data: Status ${response.status}.`;
                // try {
                //     const errorJson = JSON.parse(errorText);
                //     errorMessage = errorJson.message || errorMessage;
                // } catch { /* ignore parse error */ }

                // if (response.status === 404) {
                //     showNotification(`Data triwulan tidak ditemukan untuk Q${selectedQuarter} Tahun ${selectedYear}.`, 'info'); // showNotification kosong
                //     setDataTriwulan([]);
                //     return;
                // } else {
                //     throw new Error(errorMessage); // Throw error ini juga tidak akan terlihat di console jika tidak ada console.error di catch
                // }
                setDataTriwulan([]); // Tetap set data kosong
                setIsLoading(false);
                return; // Langsung keluar dari fungsi
            }
            const rawData = await response.json();
            const fetchedData = Array.isArray(rawData) ? rawData : (rawData.data || []);

            const formattedData = fetchedData.map(item => ({
                id: `${item.tahun}-${item.bulan}-${item.minggu}`,
                minggu_display: `${item.minggu} (${getMonthName(item.bulan)} ${item.tahun})`,
                original_minggu: item.minggu,
                original_bulan: item.bulan,
                original_tahun: item.tahun,
                total_cash: parseFloat(item.total_cash || 0),
                total_operational: parseFloat(item.total_operational || 0),
                total_expenditure: parseFloat(item.total_expenditure || 0),
                total_net_cash: parseFloat(item.total_net_cash || 0),
                total_clean_operations: parseFloat(item.total_clean_operations || 0),
                total_jeep_amount: parseInt(item.total_jeep_amount || 0),
            }));
            setDataTriwulan(formattedData);
        } catch (error) {
            // console.error("Error fetching quarterly data:", error); // DIKOMENTARI/DIHAPUS
            // showNotification(`Gagal memuat data: ${error.message}`, 'error'); // showNotification kosong
            setDataTriwulan([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedQuarter, selectedYear, showNotification]);

    useEffect(() => {
        loadDataFromBackend();
    }, [loadDataFromBackend]);

    const nilaiKasBersihAkhirPeriode = useMemo(() => {
        if (dataTriwulan.length > 0) {
            const lastWeekData = dataTriwulan[dataTriwulan.length - 1];
            return lastWeekData.total_net_cash || 0;
        }
        return 0;
    }, [dataTriwulan]);

    const getExportFileName = (ext) => {
        return `laporan_triwulan_Q${selectedQuarter}_${selectedYear}.${ext}`;
    };

    const handleExportExcelAction = () => {
        if (dataTriwulan.length === 0) {
            // showNotification("Tidak ada data untuk diekspor.", 'info'); // showNotification kosong
            return;
        }
        try {
            const dataToExport = dataTriwulan.map(item => ({
                "Periode Laporan": item.minggu_display,
                "Total Kas (Rp)": item.total_cash,
                "Total Operasional (Rp)": item.total_operational,
                "Total Pengeluaran (Rp)": item.total_expenditure,
                "Total Operasional Bersih (Rp)": item.total_clean_operations,
                "Total Kas Bersih (Rp)": item.total_net_cash,
                "Total Jeep": item.total_jeep_amount,
            }));

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const columnWidths = Object.keys(dataToExport[0] || {}).map(key => ({ wch: Math.max(key.length, ...dataToExport.map(row => (row[key]?.toString() || "").length)) + 2 }));
            ws['!cols'] = columnWidths;

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, `Triwulan ${selectedQuarter} ${selectedYear}`);
            XLSX.writeFile(wb, getExportFileName("xlsx"));
            // showNotification("Ekspor Excel berhasil.", 'success'); // showNotification kosong
        } catch (error) {
            // console.error("Error exporting Excel:", error); // DIKOMENTARI/DIHAPUS
            // showNotification("Ekspor Excel gagal.", 'error'); // showNotification kosong
        }
    };

    const handleExportPDFAction = () => {
        if (dataTriwulan.length === 0) {
            // showNotification("Tidak ada data untuk diekspor.", 'info'); // showNotification kosong
            return;
        }
        try {
            const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
            const tableColumn = [
                "Periode Laporan", "Total Kas", "Tot. Operasional",
                "Tot. Pengeluaran", "Tot. Op. Bersih", "Tot. Kas Bersih", "Total Jeep"
            ];
            const tableRows = dataTriwulan.map((item) => [
                item.minggu_display,
                formatRupiah(item.total_cash),
                formatRupiah(item.total_operational),
                formatRupiah(item.total_expenditure),
                formatRupiah(item.total_clean_operations),
                formatRupiah(item.total_net_cash),
                item.total_jeep_amount,
            ]);

            doc.setFontSize(14);
            doc.text(`Laporan Data Triwulan - Q${selectedQuarter} Tahun ${selectedYear}`, 40, 40);
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 55,
                theme: 'grid',
                styles: { fontSize: 7, cellPadding: 2, overflow: 'ellipsize', halign: 'center', valign: 'middle' },
                headStyles: { fillColor: [61, 108, 185], textColor: [255,255,255], fontSize: 8, fontStyle: 'bold', halign: 'center' },
                didDrawPage: function (data) {
                    let str = "Halaman " + doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    const pageWidth = doc.internal.pageSize.getWidth();
                    doc.text(str, pageWidth - data.settings.margin.right - 40, doc.internal.pageSize.height - 30);
                }
            });
            doc.save(getExportFileName("pdf"));
            // showNotification("Ekspor PDF berhasil.", 'success'); // showNotification kosong
        } catch (error) {
            // console.error("Error exporting PDF:", error); // DIKOMENTARI/DIHAPUS
            // showNotification("Ekspor PDF gagal.", 'error'); // showNotification kosong
        }
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
        setShowConfirmPopup(false);
        setConfirmAction(null);
        setConfirmMessage("");
    };

    const handleCancel = () => {
        setShowConfirmPopup(false);
        setConfirmAction(null);
        setConfirmMessage("");
    };

    const tableHeaders = [
        "Periode Laporan", "Total Kas", "Total Operasional",
        "Total Pengeluaran", "Total Operasional Bersih", "Total Kas Bersih", "Total Jeep"
    ];

    const quarters = [
        { value: 1, label: "Triwulan 1 (Jan-Mar)" },
        { value: 2, label: "Triwulan 2 (Apr-Jun)" },
        { value: 3, label: "Triwulan 3 (Jul-Sep)" },
        { value: 4, label: "Triwulan 4 (Okt-Des)" },
    ];

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const yearsArray = [];
        const startYear = currentYear - 5; // Display 5 years prior
        const endYear = currentYear + 5;   // Display 5 years after
        for (let i = startYear; i <= endYear; i++) {
            yearsArray.push(i);
        }
        return yearsArray;
    }, []);

    return (
        <div className="flex">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
                style={{ marginLeft: isSidebarOpen ? 290 : 70 }}
            >
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <h1
                        className="text-[28px] md:text-[32px] font-semibold text-black flex items-center gap-3 cursor-pointer hover:text-[#3D6CB9] transition-colors mb-6"
                        onClick={handleGoBack}
                    >
                        <CircleArrowLeft size={28} />
                        Laporan Triwulan
                    </h1>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div className="flex gap-4 flex-wrap items-center">
                            <div className="flex gap-2 items-center">
                                <span className="text-sm font-medium text-gray-700">Pilih Periode:</span>
                                <select
                                    value={selectedQuarter}
                                    onChange={(e) => setSelectedQuarter(parseInt(e.target.value, 10))}
                                    className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm bg-white text-black cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#3D6CB9]"
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
                                    className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm bg-white text-black cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#3D6CB9]"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <button
                                onClick={handleExportExcelAction}
                                disabled={dataTriwulan.length === 0 || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-colors ${
                                    (dataTriwulan.length === 0 || isLoading)
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-green-100 text-black hover:bg-green-200"
                                }`}
                            >
                                <FileSpreadsheet size={20} color={(dataTriwulan.length === 0 || isLoading) ? "gray" : "green"} />
                                <span>Ekspor Excel</span>
                            </button>
                            <button
                                onClick={handleExportPDFAction}
                                disabled={dataTriwulan.length === 0 || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-colors ${
                                    (dataTriwulan.length === 0 || isLoading)
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-red-100 text-black hover:bg-red-200"
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
                        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                            <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
                                <table className="min-w-full table-auto text-sm">
                                    <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            {tableHeaders.map((header) => (
                                                <th key={header} className="p-3 text-center whitespace-nowrap font-semibold">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {dataTriwulan.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={tableHeaders.length}
                                                    className="text-center p-6 text-gray-500 font-medium"
                                                >
                                                    Data tidak ditemukan.
                                                </td>
                                            </tr>
                                        ) : (
                                            dataTriwulan.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                                                    <td className="p-3 whitespace-nowrap text-center">{item.minggu_display}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.total_cash)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.total_operational)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.total_expenditure)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.total_clean_operations)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{formatRupiah(item.total_net_cash)}</td>
                                                    <td className="p-3 whitespace-nowrap text-center">{item.total_jeep_amount !== null ? item.total_jeep_amount : '-'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!isLoading && dataTriwulan.length > 0 && (
                        <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
                            <span className="font-bold text-lg">Total Kas Bersih Triwulan Ini:</span>
                            <span className="text-lg font-semibold text-[#3D6CB9]">{formatRupiah(nilaiKasBersihAkhirPeriode)}</span>
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

            {/* Notification Popup (sudah dihapus/dikomentari) */}
            {/*
            <NotificationPopup
                message={notification.message}
                type={notification.type}
            />
            */}
        </div>
    );
};

export default withAuth(TriwulanPage);