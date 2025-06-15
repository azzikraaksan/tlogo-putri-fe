// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import {
//     FileText,
//     FileSpreadsheet,
//     ArrowLeft,
//     Zap
// } from "lucide-react";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { useRouter } from 'next/navigation';

// // const API_BASE_URL = "http://localhost:8000/api";
// const API_BASE_URL = "https://tpapi.siunjaya.id/api";

// const formatRupiah = (number) => {
//     if (number === null || typeof number === 'undefined' || isNaN(number)) {
//         return 'Rp. 0';
//     }
//     const formatter = new Intl.NumberFormat('id-ID', {
//         style: 'currency',
//         currency: 'IDR',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 2,
//     });
//     return formatter.format(number).replace(/,/g, '.').replace('Rp', 'Rp.');
// };

// const formatDateFull = (dateString) => {
//     if (!dateString) return "-";
//     const d = new Date(dateString);
//     if (isNaN(d.getTime())) {
//         return dateString; 
//     }
//     return d.toLocaleDateString('id-ID', {
//         day: '2-digit',
//         month: 'long',
//         year: 'numeric'
//     });
// };

// const BulananPage = ({ children }) => {
//     const [dataBulanan, setDataBulanan] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const router = useRouter();

//     const loadDataFromBackend = useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const response = await fetch(
//                 `${API_BASE_URL}/reports/bulan?month=${selectedMonth}&year=${selectedYear}`
//             );

//             const rawData = await response.json(); 

//             if (rawData.success === false || !Array.isArray(rawData.data)) {
//                 setDataBulanan([]); 
//                 return;
//             }

//             const fetchedData = rawData.data;

//             const formattedData = fetchedData.map(item => ({
//                 reportId: item.report_id,
//                 reportDate: item.report_date,
//                 cash: parseFloat(item.cash || 0),
//                 operational: parseFloat(item.operational || 0),
//                 expenditure: parseFloat(item.expenditure || 0),
//                 netCash: parseFloat(item.net_cash || 0),
//                 cleanOperations: parseFloat(item.clean_operations || 0),
//                 jeepAmount: parseInt(item.jeep_amount || 0),
//             }));

//             formattedData.sort((a, b) => {
//                 const dateA = new Date(a.reportDate);
//                 const dateB = new Date(b.reportDate);

//                 if (isNaN(dateA.getTime())) return 1;
//                 if (isNaN(dateB.getTime())) return -1;

//                 return dateB - dateA;
//             });

//             setDataBulanan(formattedData);
//         } catch (error) {
//             setDataBulanan([]); 
//         } finally {
//             setIsLoading(false);
//         }
//     }, [selectedMonth, selectedYear]);

//     useEffect(() => {
//         loadDataFromBackend();
//     }, [loadDataFromBackend]); 

//     const totalNetCashBulanan = useMemo(() => {
//         return dataBulanan.reduce((sum, item) => sum + (item.netCash || 0), 0);
//     }, [dataBulanan]);

//     const handleGenerateReport = async () => {
//         if (!confirm("Apakah Anda yakin ingin memicu pembuatan laporan bulanan otomatis dari backend untuk bulan/tahun saat ini?")) {
//             return;
//         }
//         setIsLoading(true);
//         try {
//             const response = await fetch(`${API_BASE_URL}/reports/generate`, {
//                 method: 'POST',
//                 headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
//             });
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Gagal memicu generate laporan: ${response.statusText || 'Unknown Error'}`);
//             }
//             alert("Proses pembuatan laporan berhasil dipicu di backend. Memuat data terbaru untuk bulan/tahun saat ini...");
//             await loadDataFromBackend(); 
//         } catch (error) {
//             setIsLoading(false); 
//         }
//     };

//     const getExportFileName = (ext) => {
//         const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' });
//         return `laporan_bulanan_${monthName}_${selectedYear}.${ext}`;
//     };

//     const handleExportExcelAction = () => {
//         if (dataBulanan.length === 0) {
//             alert("Data kosong, tidak bisa export Excel!");
//             return;
//         }
//         try {
//             const dataToExport = dataBulanan.map(item => ({
//                 "Tanggal Laporan": formatDateFull(item.reportDate),
//                 "Operasional": item.operational,
//                 "Kas": item.cash,
//                 "Pengeluaran": item.expenditure,
//                 "Operasional Bersih": item.cleanOperations,
//                 "Kas Bersih": item.netCash,
//                 "Jumlah Jeep": item.jeepAmount,
//             }));
//             const ws = XLSX.utils.json_to_sheet(dataToExport);
//             const wb = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(wb, ws, "Laporan Bulanan");
//             XLSX.writeFile(wb, getExportFileName("xlsx"));
//         } catch (error) {
//             alert("Gagal export Excel!");
//         }
//     };

//     const handleExportPDFAction = () => {
//         if (dataBulanan.length === 0) {
//             alert("Data kosong, tidak bisa export PDF!");
//             return;
//         }
//         try {
//             const doc = new jsPDF('landscape');
//             const tableColumn = ["Tanggal Laporan", "Operasional", "Kas", "Pengeluaran", "Operasional Bersih", "Kas Bersih", "Jumlah Jeep"];
//             const tableRows = dataBulanan.map(item => [
//                 formatDateFull(item.reportDate),
//                 formatRupiah(item.operational),
//                 formatRupiah(item.cash),
//                 formatRupiah(item.expenditure),
//                 formatRupiah(item.cleanOperations),
//                 formatRupiah(item.netCash),
//                 item.jeepAmount,
//             ]);
//             const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' });
//             doc.text(`Laporan Data Bulanan - ${monthName} ${selectedYear}`, 14, 15);
//             autoTable(doc, {
//                 head: [tableColumn], body: tableRows, startY: 20,
//                 styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
//                 headStyles: { fillColor: [61, 108, 185], fontSize: 9 },
//                 didDrawPage: data => {
//                     doc.setFontSize(7);
//                     doc.text("Page " + doc.internal.getNumberOfPages(), data.settings.margin.left, doc.internal.pageSize.height - 10);
//                 }
//             });
//             doc.save(getExportFileName("pdf"));
//         } catch (error) {
//             alert("Gagal export PDF!");
//         }
//     };

//     const tableHeaders = ["Tanggal Laporan", "Operasional", "Kas", "Pengeluaran", "Operasional Bersih", "Kas Bersih", "Jumlah Jeep"];
//     const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(2000, i).toLocaleString('id-ID', { month: 'long' }) }));
    
//     const years = useMemo(() => {
//         const _currentYear = new Date().getFullYear();
//         const yearsArray = [];
//         const startYear = _currentYear - 5;
//         const endYear = _currentYear + 5;
//         for (let i = startYear; i <= endYear; i++) {
//             yearsArray.push(i);
//         }
//         return yearsArray;
//     }, []);

//     const handleGoBack = () => router.push("/dashboard/akuntansi/laporan-keuangan");
    
//     const isExportButtonDisabled = isLoading || dataBulanan.length === 0; 
//     const [isSidebarOpen, setSidebarOpen] = useState(true);

//     return (
//         <div className="flex">
//             <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
//             <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden" style={{ marginLeft: isSidebarOpen ? 290 : 70 }}>
//                 <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
//                     <h1 className="text-[28px] md:text-[32px] font-semibold text-black flex items-center gap-3 cursor-pointer hover:text-[#3D6CB9] transition-colors mb-6" onClick={handleGoBack}>
//                         <ArrowLeft size={28} /> Laporan Bulanan
//                     </h1>

//                     <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
//                         <div className="flex gap-4 flex-wrap">
//                             <div className="flex gap-2 items-center">
//                                 <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))} className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black cursor-pointer">
//                                     {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
//                                 </select>
//                                 <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))} className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black cursor-pointer">
//                                     {years.map(year => <option key={year} value={year}>{year}</option>)}
//                                 </select>
//                             </div>
//                             <button onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-[#3D6CB9] hover:bg-[#B8D4F9] text-white hover:text-black cursor-pointer">
//                                 <Zap size={20} color="white" /> <span>Buat Laporan</span>
//                             </button>
//                         </div>
//                         <div className="flex gap-4">
//                             <button onClick={handleExportExcelAction} disabled={isExportButtonDisabled} className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isExportButtonDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-100 text-black hover:bg-[#B8D4F9] cursor-pointer"}`}>
//                                 <FileSpreadsheet size={20} color={isExportButtonDisabled ? "gray" : "green"} /> <span>Ekspor Excel</span>
//                             </button>
//                             <button onClick={handleExportPDFAction} disabled={isExportButtonDisabled} className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isExportButtonDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-red-100 text-black hover:bg-[#B8D4F9] cursor-pointer"}`}>
//                                 <FileText size={20} color={isExportButtonDisabled ? "gray" : "red"} /> <span>Ekspor PDF</span>
//                             </button>
//                         </div>
//                     </div>

//                     {isLoading ? (
//                         <div className="text-center p-10 text-lg font-medium text-gray-700">Memuat data laporan bulanan, mohon tunggu...</div>
//                     ) : (
//                         <div className="overflow-x-auto rounded-lg shadow">
//                             <div className="max-h-[600px] overflow-y-auto">
//                                 <table className="min-w-full table-auto bg-white text-sm">
//                                     <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
//                                         <tr>
//                                             {tableHeaders.map((header, index) => (
//                                                 <th key={header} className="p-2 text-center whitespace-nowrap" style={{ borderTopLeftRadius: index === 0 ? "0.5rem" : undefined, borderTopRightRadius: index === tableHeaders.length - 1 ? "0.5rem" : undefined }}>
//                                                     {header}
//                                                 </th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {dataBulanan.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan={tableHeaders.length} className="text-center p-4 text-gray-500 font-medium">
//                                                     Data Tidak Ditemukan untuk Bulan {new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' })} {selectedYear}
//                                                 </td>
//                                             </tr>
//                                         ) : (
//                                             dataBulanan.map(item => (
//                                                 <tr key={item.reportId} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200">
//                                                     <td className="p-3 whitespace-nowrap">{formatDateFull(item.reportDate)}</td>
//                                                     <td className="p-3 whitespace-nowrap">{formatRupiah(item.operational)}</td>
//                                                     <td className="p-3 whitespace-nowrap">{formatRupiah(item.cash)}</td>
//                                                     <td className="p-3 whitespace-nowrap">{formatRupiah(item.expenditure)}</td>
//                                                     <td className="p-3 whitespace-nowrap">{formatRupiah(item.cleanOperations)}</td>
//                                                     <td className="p-3 whitespace-nowrap">{formatRupiah(item.netCash)}</td>
//                                                     <td className="p-3 whitespace-nowrap">{item.jeepAmount !== null ? item.jeepAmount : '-'}</td>
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}

//                     <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
//                         <span className="font-bold text-lg">Total Kas:</span>
//                         <span className="text-lg font-semibold text-[#3D6CB9]">{formatRupiah(totalNetCashBulanan)}</span>
//                     </div>
//                 </div>
//                 {children}
//             </div>
//         </div>
//     );
// };

// export default withAuth(BulananPage);


// // // // // // 

// // import { Suspense } from "react";

// // import Sidebar from "/components/Sidebar.jsx";
// // import withAuth from "/src/app/lib/withAuth";
// // import { ambilLaporanBulanan } from "/components/akuntansi/bulanan/Utilitas.js";
// // import LaporanBulananClient from "/components/akuntansi/bulanan/LaporanBulananClient.jsx";

// // const BulananPageContent = async ({ searchParams }) => {
// //     // Tentukan bulan dan tahun dari URL (aman dilakukan di server)
// //     const bulan = searchParams.month ? parseInt(searchParams.month) : new Date().getMonth() + 1;
// //     const tahun = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear();

// //     // Ambil data awal di server
// //     const dataAwal = await ambilLaporanBulanan(bulan, tahun);

// //     return (
        
// //         // Suspense untuk menampilkan fallback saat Client Component dimuat
// //         <Suspense fallback={<div className="flex min-h-screen w-full items-center justify-center bg-gray-50 text-lg font-medium text-gray-700">Memuat laporan...</div>}>
// //             <LaporanBulananClient 
// //                 dataAwal={dataAwal} 
// //                 bulanAwal={bulan} 
// //                 tahunAwal={tahun} 
// //             />
// //         </Suspense>
// //     );
// // };

// // // Ekspor komponen server secara langsung
// // export default BulananPageContent;

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "/components/Sidebar.jsx";
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

    const loadDataFromBackend = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/reports/bulan?bulan=${selectedMonth}&tahun=${selectedYear}`
            );

            const result = await response.json();

            if (!response.ok) {
                if(response.status === 404 || result.status === 'not_found') {
                    setDataBulanan([]);
                    return; 
                }
                throw new Error(result.message || 'Gagal memuat data');
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
            console.error("Gagal memuat data dari backend:", error);
            setDataBulanan([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        loadDataFromBackend();
    }, [loadDataFromBackend]);

    const totalNetCashBulanan = useMemo(() => {
        if (dataBulanan.length > 0) {
            return dataBulanan[0].netCash;
        }
        return 0; 
    }, [dataBulanan]);

    const handleGenerateReport = async () => {
        if (!confirm("Apakah Anda yakin ingin memicu pembuatan laporan bulanan otomatis dari backend untuk bulan/tahun saat ini?")) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/reports/generate`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`Gagal memicu generate laporan: ${response.statusText || 'Unknown Error'}`);
            }
            alert("Proses pembuatan laporan berhasil dipicu di backend. Memuat data terbaru untuk bulan/tahun saat ini...");
            await loadDataFromBackend();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getExportFileName = (ext) => {
        const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' });
        return `laporan_bulanan_${monthName}_${selectedYear}.${ext}`;
    };

    const handleExportExcelAction = () => {
        if (dataBulanan.length === 0) {
            alert("Data kosong, tidak bisa export Excel!");
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
        } catch (error) {
            alert("Gagal export Excel!");
        }
    };

    const handleExportPDFAction = () => {
        if (dataBulanan.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
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
        } catch (error) {
            alert("Gagal export PDF!");
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
                        <ArrowLeft size={28} /> Laporan Bulanan
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
                           {/* PERUBAHAN: Mengubah label */}
                           <span className="font-bold text-lg">Kas Bersih Terakhir Bulan Ini:</span>
                           <span className="text-lg font-semibold text-[#3D6CB9]">{formatRupiah(totalNetCashBulanan)}</span>
                       </div>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};

export default withAuth(BulananPage);