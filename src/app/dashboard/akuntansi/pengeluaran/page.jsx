"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx";
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
import Hashids from "hashids";

const HASHIDS_SECRET = process.env.NEXT_PUBLIC_HASHIDS_SECRET || "fallback_secret_salt_pengeluaran_jika_env_tidak_ada";
const hashids = new Hashids(HASHIDS_SECRET, 20);

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

const filterByMonthAndYearHelper = (data, referenceDate) => {
    if (!Array.isArray(data) || !referenceDate) return [];
    const targetMonth = referenceDate.getMonth();
    const targetYear = referenceDate.getFullYear();

    return data.filter(item => {
        if (!item.issue_date) return false;
        let itemDate;
        if (typeof item.issue_date === 'string' && item.issue_date.includes('T')) {
            itemDate = new Date(item.issue_date);
        } else if (typeof item.issue_date === 'string' && item.issue_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const parts = item.issue_date.split('-');
            itemDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
        } else {
            itemDate = new Date(item.issue_date);
        }
        if (isNaN(itemDate.getTime())) return false;
        return itemDate.getMonth() === targetMonth && itemDate.getFullYear() === targetYear;
    });
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
    const datePickerDropdownRef = useRef(null);

    const [currentMonthExpenditures, setCurrentMonthExpenditures] = useState([]);
    const [totalCurrentMonthExpenditure, setTotalCurrentMonthExpenditure] = useState(0);
    const [reportedMonths, setReportedMonths] = useState({});

    const [totalForDisplayedPeriod, setTotalForDisplayedPeriod] = useState(0);
    const [labelForDisplayedPeriod, setLabelForDisplayedPeriod] = useState("Total Bulan Ini:");


    const getCurrentMonthDateRange = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const startDate = new Date(year, month, 1);
        return { startDate };
    };

    const filterByCurrentMonth = useCallback((rawData) => {
        if (!Array.isArray(rawData)) return [];
        const { startDate } = getCurrentMonthDateRange();
        const currentMonthSystem = startDate.getMonth();
        const currentYearSystem = startDate.getFullYear();
        const currentMonthKey = `${currentYearSystem}-${(currentMonthSystem + 1).toString().padStart(2, '0')}`;

        return rawData.filter(item => {
            if (!item.issue_date) return false;
            const itemDate = new Date(item.issue_date);
            if (isNaN(itemDate.getTime())) return false;
            const itemMonth = itemDate.getMonth();
            const itemYear = itemDate.getFullYear();
            return itemMonth === currentMonthSystem && itemYear === currentYearSystem && !reportedMonths[currentMonthKey];
        });
    }, [reportedMonths]);


    const filterBySpecificDate = useCallback((rawData, dateFilter) => {
        if (!Array.isArray(rawData) || !dateFilter) return [];
        const formattedFilterDate = formatDateToDisplay(dateFilter);
        return rawData.filter(item => {
            if (!item.issue_date) return false;
            const itemDisplayDate = formatDateToDisplay(item.issue_date);
            return itemDisplayDate === formattedFilterDate;
        });
    }, []);

    const applyFilterToData = useCallback((rawData, dateFilter) => {
        if (!Array.isArray(rawData)) {
            setFilteredData([]);
            setTotalForDisplayedPeriod(0);
            setLabelForDisplayedPeriod("Total Bulan Ini:");
            setCurrentMonthExpenditures([]);
            setTotalCurrentMonthExpenditure(0);
            return;
        }
    
        let dataToDisplayInTable = [];
        let expendituresForSumCalculation; 
        const today = new Date();
    
        if (dateFilter) { 
            dataToDisplayInTable = filterBySpecificDate(rawData, dateFilter);
            expendituresForSumCalculation = dataToDisplayInTable; 
            
            setLabelForDisplayedPeriod(`Total ${formatDateToDisplay(dateFilter)}:`);
    
        } else { 
            expendituresForSumCalculation = filterByMonthAndYearHelper(rawData, today);
            dataToDisplayInTable = expendituresForSumCalculation; 
            
            setLabelForDisplayedPeriod("Total Bulan Ini:");
        }
    
        const totalSumForPeriod = expendituresForSumCalculation.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        setTotalForDisplayedPeriod(totalSumForPeriod);
        setFilteredData(dataToDisplayInTable);
    
        const dataForCurrentMonthReportProcessing = filterByCurrentMonth(rawData);
        setCurrentMonthExpenditures(dataForCurrentMonthReportProcessing);
        const totalForCurrentSystemMonthReport = dataForCurrentMonthReportProcessing.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        setTotalCurrentMonthExpenditure(totalForCurrentSystemMonthReport);
    
    }, [filterBySpecificDate, filterByCurrentMonth]); 


    const fetchExpenditureData = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = `${API_BASE_URL}/expenditures/all`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Gagal mengambil data pengeluaran: ${response.statusText || 'Kesalahan Server'}`);
            }
            const result = await response.json();
            let extractedData = [];
            if (Array.isArray(result)) extractedData = result;
            else if (result && Array.isArray(result.data)) extractedData = result.data;
            else if (result && Array.isArray(result.expenditures)) extractedData = result.expenditures;
            else if (result && Array.isArray(result.expenditure)) extractedData = result.expenditure;
            else if (result && Array.isArray(result.salaries)) extractedData = result.salaries;
            else extractedData = [];
            
            const cleanData = extractedData.filter(item => 
                item && 
                typeof item.expenditure_id !== 'undefined' && 
                !isNaN(Number(item.expenditure_id)) 
            );
            setDataPengeluaran(cleanData);
            applyFilterToData(cleanData, selectedDateForFilter);
        } catch (error) {
            setDataPengeluaran([]);
            applyFilterToData([], selectedDateForFilter); 
        } finally {
            setIsLoading(false);
        }
    }, [applyFilterToData, selectedDateForFilter]);

    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker);
        setIsDatePickerOpen(false);
    };

    const resetFilter = useCallback(() => {
        setSelectedDateForFilter(null);
        setTempDateForPicker(null);
        setIsDatePickerOpen(false);
    }, []);


    const handleGenerateReport = async () => {
        const today = new Date();
        const currentMonthKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
        if (reportedMonths[currentMonthKey]) {
            alert("Laporan untuk bulan ini sudah dibuat.");
            return;
        }
        if (currentMonthExpenditures.length === 0) {
            alert("Tidak ada pengeluaran (yang belum dilaporkan) untuk bulan ini yang dapat dilaporkan.");
            return;
        }
        if (confirm(`Apakah Anda yakin ingin membuat laporan pengeluaran untuk bulan ini (Total Pengeluaran: ${formatCurrency(totalCurrentMonthExpenditure)})? Data bulan ini akan ditandai sebagai 'dilaporkan' di tampilan.`)) {
            try {
                const reportData = {
                    monthKey: currentMonthKey,
                    expenditures: currentMonthExpenditures,
                    totalExpenditure: totalCurrentMonthExpenditure,
                    reportDate: today.toISOString()
                };
                const response = await fetch(`${API_BASE_URL}/expenditures/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reportData)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    throw new Error(errorData.message || `Gagal menghubungi server: ${response.status}`);
                }
                await response.json();
                setReportedMonths(prev => ({ ...prev, [currentMonthKey]: true }));
                alert("Laporan pengeluaran bulanan berhasil dibuat dan dikirim ke server.");
                fetchExpenditureData();
            } catch (error) {
                alert(`Gagal membuat laporan: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        fetchExpenditureData();
        const handleDataUpdate = () => fetchExpenditureData();
        window.addEventListener('dataPengeluaranUpdated', handleDataUpdate);
        return () => window.removeEventListener('dataPengeluaranUpdated', handleDataUpdate);
    }, [fetchExpenditureData]);

    useEffect(() => {
        const periodicCheck = () => {
            const today = new Date();
            const currentSystemMonth = today.getMonth();
            const currentSystemYear = today.getFullYear();
            if (selectedDateForFilter) {
                const selectedDateObject = new Date(selectedDateForFilter.getFullYear(), selectedDateForFilter.getMonth(), 1);
                const currentSystemDateObject = new Date(currentSystemYear, currentSystemMonth, 1);
                if (selectedDateObject < currentSystemDateObject &&
                    (selectedDateForFilter.getMonth() !== currentSystemMonth || selectedDateForFilter.getFullYear() !== currentSystemYear)) {
                }
            }
        };
        const intervalId = setInterval(periodicCheck, 1000 * 60 * 60 * 24);
        return () => clearInterval(intervalId);
    }, [selectedDateForFilter, resetFilter]);


    const handleOpenTambahModal = () => setIsTambahModalOpen(true);
    const handleCloseTambahModal = () => setIsTambahModalOpen(false);

    const handleDeleteAction = async (expenditureIdHash) => {
        if (!expenditureIdHash) {
            alert("Gagal menghapus data: ID Hash tidak valid.");
            return;
        }
        const decodedIds = hashids.decode(expenditureIdHash);
        if (decodedIds.length === 0) {
            alert("Gagal menghapus data: Gagal decode ID Hash.");
            return;
        }
        const expenditureIdNumeric = Number(decodedIds[0]); 
        if (isNaN(expenditureIdNumeric)) {
            alert("Gagal menghapus data: Hasil decode ID tidak numerik.");
            return;
        }
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                const deleteUrl = `${API_BASE_URL}/expenditures/delete/${expenditureIdNumeric}`;
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: { 'Accept': 'application/json' },
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
                alert(`Gagal menghapus data: ${error.message}`);
            }
        }
    };

    const getExportFileName = (ext) => {
        const date = new Date().toISOString().split("T")[0];
        let filterInfo;
        if (selectedDateForFilter) {
            const d = selectedDateForFilter.getDate().toString().padStart(2,'0');
            const m = (selectedDateForFilter.getMonth() + 1).toString().padStart(2,'0');
            const y = selectedDateForFilter.getFullYear();
            filterInfo = `_tanggal_${d}${m}${y}`;
        } else {
            const today = new Date();
            const m = (today.getMonth() + 1).toString().padStart(2,'0');
            const y = today.getFullYear();
            filterInfo = `_bulan_${m}${y}`;
        }
        return `laporan_pengeluaran${filterInfo}_${date.replace(/-/g, '')}.${ext}`;
    };

    const handleExportExcelAction = () => {
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
            ws['!cols'] = [{wch:20}, {wch:15, z: '#,##0'}, {wch:40}, {wch:20}];
            
            const totalRow = filteredData.length + 2; 
            XLSX.utils.sheet_add_aoa(ws, [
                [`${labelForDisplayedPeriod}`, totalForDisplayedPeriod]
            ], { origin: `A${totalRow}` });
            if(ws[`B${totalRow}`]) ws[`B${totalRow}`].z = '#,##0';


            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pengeluaran");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            alert("Gagal export Excel!");
        }
    };

    const handleExportPDFAction = () => {
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
            alert("Tidak ada data untuk diekspor ke PDF (sesuai filter saat ini)!");
            return;
        }
        try {
            const doc = new jsPDF();
            const tableColumn = ["Tanggal Pengeluaran", "Total", "Keterangan", "Kategori"];
            const tableRows = filteredData.map((item) => [
                formatDateToDisplay(item.issue_date),
                formatCurrency(parseFloat(item.amount)),
                item.information,
                item.action,
            ]);
            
            let title = "Laporan Data Pengeluaran";
            if (selectedDateForFilter) {
                title += ` (${formatDateToDisplay(selectedDateForFilter)})`;
            } else {
                const today = new Date();
                const monthYearFormat = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(today);
                title += ` (Bulan Ini: ${monthYearFormat})`;
            }
            doc.text(title, 14, 15);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [61, 108, 185] }
            });

            const finalY = (doc).lastAutoTable.finalY || 25;
            doc.setFontSize(10);
            doc.text(`${labelForDisplayedPeriod} ${formatCurrency(totalForDisplayedPeriod)}`, 14, finalY + 10);

            doc.save(getExportFileName("pdf"));
        } catch (error) {
            alert("Gagal export PDF!");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                calendarRef.current && !calendarRef.current.contains(event.target) &&
                (!datePickerDropdownRef.current || !datePickerDropdownRef.current.contains(event.target))
            ) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isDataAvailableForExport = !isLoading && Array.isArray(filteredData) && filteredData.length > 0;
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
                style={{ marginLeft: isSidebarOpen ? 290 : 70 }}
            >
                <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-6">
                        Pengeluaran
                    </h1>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div className="flex gap-4 flex-wrap">
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
                                    <div
                                        ref={datePickerDropdownRef}
                                        className="absolute z-[1000] mt-2 bg-white border rounded-lg shadow-lg p-4 top-full left-0 min-w-[280px]"
                                    >
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
                            <button
                                onClick={handleGenerateReport}
                                className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black"
                                title={reportedMonths[`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`] ? "Laporan bulan ini sudah dibuat" : (totalCurrentMonthExpenditure === 0 ? "Tidak ada data (unreported) untuk dilaporkan bulan ini" : "Buat laporan untuk bulan ini")}
                            >
                                <Zap size={20} />
                                <span>Buat Laporan</span>
                            </button>
                        </div>
                        <div className="flex gap-4 flex-wrap">
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
                        <div className="flex flex-col">
                            <div className="overflow-y-auto max-h-[calc(100vh-320px)] rounded-lg shadow mb-8">
                                <table className="min-w-full table-auto bg-white text-sm">
                                    <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                                        <tr>
                                            {["Tanggal Pengeluaran", "Total", "Keterangan", "Kategori", "Aksi"]
                                                .map((header, index, arr) => (
                                                    <th
                                                        key={header}
                                                        className={`p-2 text-center`}
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
                                                <td colSpan={5} className="text-center p-4 text-gray-500 font-medium">
                                                    Data Tidak Ditemukan 
                                                    {selectedDateForFilter ? 
                                                        ` untuk tanggal ${formatDateToDisplay(selectedDateForFilter)}` : 
                                                        ` untuk bulan ${new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date())}`
                                                    }
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredData.map((item) => {
                                                const expenditureIdNumeric = Number(item.expenditure_id);
                                                let encodedIdForLink = null;
                                                let encodedIdForDelete = null;

                                                if (!isNaN(expenditureIdNumeric)) {
                                                    encodedIdForLink = hashids.encode(expenditureIdNumeric);
                                                    encodedIdForDelete = hashids.encode(expenditureIdNumeric); 
                                                }

                                                return (
                                                    <tr key={item.expenditure_id + (encodedIdForLink || Math.random())} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200">
                                                        <td className="p-3">{formatDateToDisplay(item.issue_date)}</td>
                                                        <td className="p-3">{formatCurrency(parseFloat(item.amount))}</td>
                                                        <td className="p-3">{item.information}</td>
                                                        <td className="p-3">{item.action}</td>
                                                        <td className="p-3">
                                                            <div className="flex justify-center gap-2">
                                                                {encodedIdForLink ? (
                                                                    <Link
                                                                        href={`/dashboard/akuntansi/pengeluaran/edit-pengeluaran/${encodedIdForLink}`}
                                                                        className="text-indigo-600 hover:underline"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit size={18} />
                                                                    </Link>
                                                                ) : (
                                                                    <span title="ID tidak valid untuk edit">
                                                                        <Edit size={18} className="text-gray-400 cursor-not-allowed" />
                                                                    </span>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDeleteAction(encodedIdForDelete)} 
                                                                    className="text-red-600 hover:text-red-800"
                                                                    title="Hapus"
                                                                    disabled={!encodedIdForDelete} 
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {!isLoading && (
                                <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
                                    <span className="font-bold text-lg">{labelForDisplayedPeriod}</span>
                                    <span className="text-lg font-semibold text-[#3D6CB9]">{formatCurrency(totalForDisplayedPeriod)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <TambahPengeluaran
                    isOpen={isTambahModalOpen}
                    onClose={handleCloseTambahModal}
                    onAddData={() => window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'))}
                    initialDate={selectedDateForFilter || new Date()}
                />
                {children}
            </div>
        </div>
    );
};

export default withAuth(PengeluaranPage);