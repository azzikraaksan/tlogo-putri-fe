"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx"; 
import withAuth from "/src/app/lib/withAuth"; 
import {
    CalendarDays,
    FileText,
    FileSpreadsheet,
    RotateCcw,
    Zap
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

const formatDateToDisplay = (dateString) => {
    if (!dateString) return "-";
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    
    if (isNaN(date.getTime())) {
        const parts = typeof dateString === 'string' ? dateString.split(' ')[0].split('-') : [];
        if (parts.length === 3) {
            const newDateFromParts = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
            if (!isNaN(newDateFromParts.getTime())) {
                const day = newDateFromParts.getUTCDate().toString().padStart(2, "0");
                const month = (newDateFromParts.getUTCMonth() + 1).toString().padStart(2, "0");
                const year = newDateFromParts.getUTCFullYear();
                return `${day}-${month}-${year}`;
            }
        }
        return typeof dateString === 'string' ? dateString : "-"; 
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatToLocalDateString = (dateObject) => {
    if (!dateObject) return null;
    const d = dateObject instanceof Date ? dateObject : new Date(dateObject);
    if (isNaN(d.getTime())) {
        console.error("Invalid date passed to formatToLocalDateString:", dateObject);
        return null;
    }
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const PemasukanPage = () => {
    const [dataPemasukan, setDataPemasukan] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const [selectedDateForFilter, setSelectedDateForFilter] = useState(null);
    const [tempDateForPicker, setTempDateForPicker] = useState(new Date());
    
    const calendarRef = useRef(null); 
    const datePickerDropdownRef = useRef(null); 

    const autoUpdateTargetDateStringRef = useRef(formatToLocalDateString(new Date()));
    const currentFilterDateStringRef = useRef(formatToLocalDateString(new Date()));

    useEffect(() => {
        currentFilterDateStringRef.current = selectedDateForFilter ? formatToLocalDateString(selectedDateForFilter) : null;
    }, [selectedDateForFilter]);

    const fetchAndFilterIncomeData = useCallback(async () => {
        setIsLoading(true);
        try {
            let apiUrl = `${API_BASE_URL}/income/all`;
            if (selectedDateForFilter) { 
                const formattedFilterLocalDate = formatToLocalDateString(selectedDateForFilter);
                if (formattedFilterLocalDate) {
                    apiUrl = `${API_BASE_URL}/income/all?tanggal=${formattedFilterLocalDate}`;
                }
            }

            const response = await fetch(apiUrl);
            const rawData = await response.json();

            if (!response.ok) {
                const errorMessage = rawData.message || `HTTP error! Status: ${response.status}.`;
                if (rawData.status === 'not_found') {
                    console.warn(errorMessage);
                    setFilteredData([]);
                    setDataPemasukan([]);
                } else {
                    throw new Error(errorMessage);
                }
            } else { 
                const fetchedRawData = rawData.income || [];
                if (!Array.isArray(fetchedRawData)) {
                    console.error("Properti 'income' dari backend bukan array:", fetchedRawData);
                    throw new Error("Format data dari backend (properti 'income') tidak valid.");
                }

                const cleanedData = fetchedRawData.map(item => ({
                    booking_date: item.booking_date ? formatDateToDisplay(item.booking_date) : '-',
                    income: parseFloat(item.income || 0),
                    expediture: parseFloat(item.expediture || 0),
                    cash: parseFloat(item.cash || 0),
                }));

                setDataPemasukan(cleanedData);
                
                if (selectedDateForFilter) { 
                    const formattedFilterLocalDate = formatToLocalDateString(selectedDateForFilter);
                    setFilteredData(
                        cleanedData.filter(
                            (item) => {
                                if (!item.booking_date || item.booking_date === '-') return false;
                                const dateParts = item.booking_date.split('-'); 
                                if (dateParts.length === 3) {
                                    const itemLocalDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                                    return itemLocalDateString === formattedFilterLocalDate;
                                }
                                return false;
                            }
                        )
                    );
                } else { 
                    setFilteredData(cleanedData); 
                }
            }
        } catch (error) {
            if (!error.message.toLowerCase().includes("data tidak ditemukan")) {
                //  alert(`Terjadi kesalahan: ${error.message}.`);
            }
            setDataPemasukan([]);
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDateForFilter]);

    useEffect(() => {
        fetchAndFilterIncomeData();
    }, [fetchAndFilterIncomeData]);

    const applyDateFilter = () => {
        if (!tempDateForPicker) return; 

        setSelectedDateForFilter(tempDateForPicker);

        const todayString = formatToLocalDateString(new Date());
        const pickedDateString = formatToLocalDateString(tempDateForPicker);

        if (pickedDateString === todayString) {
            autoUpdateTargetDateStringRef.current = todayString; 
        } else {
            autoUpdateTargetDateStringRef.current = null; 
        }
        setIsDatePickerOpen(false);
    };

    const resetFilter = () => { 
        setSelectedDateForFilter(null);
        setTempDateForPicker(null); 
        
        autoUpdateTargetDateStringRef.current = null; 
        setIsDatePickerOpen(false);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const newTodayString = formatToLocalDateString(now);

            if (autoUpdateTargetDateStringRef.current) { 
                if (currentFilterDateStringRef.current === autoUpdateTargetDateStringRef.current &&
                    newTodayString !== autoUpdateTargetDateStringRef.current) {
                    
                    console.log(`Auto-updating filter dari ${autoUpdateTargetDateStringRef.current} ke 'hari ini' yang baru: ${newTodayString}`);
                    
                    setSelectedDateForFilter(now); 
                    setTempDateForPicker(now);     
                    autoUpdateTargetDateStringRef.current = newTodayString; 
                }
            }
        }, 60000); 

        return () => clearInterval(intervalId); 
    }, []); 
    


    const calculateTotalKas = () => {
        const total = filteredData.reduce((sum, item) => sum + (typeof item.cash === 'number' && !isNaN(item.cash) ? item.cash : 0), 0);
        return formatRupiah(total);
    };

    const getExportFileName = (ext) => {
        const datePart = selectedDateForFilter ? formatToLocalDateString(selectedDateForFilter) : "all_dates";
        return `laporan_pemasukan_${datePart}.${ext}`;
    };

    const handleExportExcel = () => {
        if (filteredData.length === 0) {
            alert("Data kosong, tidak bisa export Excel!");
            return;
        }
        try {
            const exportData = filteredData.map(item => ({
                'Tanggal Pemesanan': item.booking_date,
                'Pemasukan (Rp)': item.income,
                'Pengeluaran (Rp)': item.expediture,
                'Kas (Rp)': item.cash,
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pemasukan");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Gagal export Excel:", error);
            alert("Gagal export Excel!");
        }
    };

    const handleExportPDF = () => {
        if (filteredData.length === 0) {
            alert("Data kosong, tidak bisa export PDF!");
            return;
        }
        try {
            const doc = new jsPDF('portrait');
            const tableColumn = ["Tgl. Pemesanan", "Pemasukan", "Pengeluaran", "Kas"];
            const tableRows = filteredData.map((item) => [
                item.booking_date,
                formatRupiah(item.income),
                formatRupiah(item.expediture),
                formatRupiah(item.cash),
            ]);
            doc.text(
                `Laporan Data Pemasukan ${selectedDateForFilter ? `(${formatDateToDisplay(selectedDateForFilter)})` : "(Semua Data)"}`,
                14, 15
            );
            autoTable(doc, {
                head: [tableColumn], body: tableRows, startY: 20,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [61, 108, 185] },
                didDrawPage: function (data) {
                    if (data && data.settings && doc && doc.internal && doc.internal.pageSize) {
                        doc.setFontSize(10);
                        const totalKasText = `Total Kas Kotor: ${calculateTotalKas()}`;
                        const textWidth = doc.getStringUnitWidth(totalKasText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                        const xOffset = doc.internal.pageSize.width - data.settings.margin.right - textWidth;
                        doc.text(totalKasText, xOffset, doc.internal.pageSize.height - 10);
                    }
                }
            });
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            console.error("Gagal export PDF:", error);
            alert("Gagal export PDF!");
        }
    };

    const handleGenerateIncomeReport = async () => {
        if (!confirm("Apakah Anda yakin ingin memicu perhitungan laporan pemasukan dari data harian? Proses ini akan menyimpan data baru jika belum ada.")) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/income/create`, { 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || `Gagal memicu generate laporan: Status ${response.status}`);
            }
            alert(result.message || 'Proses perhitungan laporan pemasukan berhasil dipicu.');
            await fetchAndFilterIncomeData();
        } catch (error) {
            alert(`Gagal memicu generate laporan: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDatePickerOpen && calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDatePickerOpen]); 
    const tableDisplayHeaders = ["Tanggal Pemesanan", "Pemasukan", "Pengeluaran", "Kas"];
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
                style={{ marginLeft: isSidebarOpen ? 290 : 70 }}
            >
                <div className="flex-1 p-4 md:p-6 relative overflow-y-auto">
                    <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-6">
                        Pemasukan
                    </h1>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div className="flex gap-4">
                            {/* calendarRef membungkus tombol dan dropdown */}
                            <div className="relative" ref={calendarRef}> 
                                {!selectedDateForFilter ? (
                                    <button
                                        onClick={() => {
                                            setTempDateForPicker(new Date()); 
                                            setIsDatePickerOpen(!isDatePickerOpen);
                                        }}
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
                                                    setIsDatePickerOpen(false);
                                                }}
                                                className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={applyDateFilter}
                                                disabled={!tempDateForPicker}
                                                className={`px-4 py-2 rounded hover:text-white ${!tempDateForPicker ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#B8D4F9] text-black hover:bg-[#3D6CB9]"}`}
                                            >
                                                Pilih Tanggal
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleGenerateIncomeReport}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${isLoading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#3D6CB9] text-white hover:bg-[#B8D4F9] hover:text-black cursor-pointer"}`}
                            >
                                <Zap size={20} />
                                <span>Buat Laporan</span>
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleExportExcel}
                                disabled={filteredData.length === 0 || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${filteredData.length === 0 || isLoading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-100 text-black hover:bg-[#B8D4F9] cursor-pointer"}`}
                            >
                                <FileSpreadsheet size={20} color={filteredData.length === 0 || isLoading ? "gray" : "green"} />
                                <span>Ekspor Excel</span>
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={filteredData.length === 0 || isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${filteredData.length === 0 || isLoading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-red-100 text-black hover:bg-[#B8D4F9] cursor-pointer"}`}
                            >
                                <FileText size={20} color={filteredData.length === 0 || isLoading ? "gray" : "red"} />
                                <span>Ekspor PDF</span>
                            </button>
                        </div>
                    </div>

                    {isLoading && !isDatePickerOpen ? (
                        <div className="text-center p-10 text-lg font-medium text-gray-700">
                            Memuat data laporan pemasukan, mohon tunggu...
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg shadow">
                            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                                <table className="min-w-full table-auto bg-white text-sm">
                                    <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                                        <tr>
                                            {tableDisplayHeaders.map((header, index, arr) => (
                                                <th key={header} className={`p-2 text-center whitespace-nowrap`}
                                                    style={{
                                                        borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
                                                        borderTopRightRadius: index === arr.length - 1 ? "0.5rem" : undefined,
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
                                                <td colSpan={tableDisplayHeaders.length} className="text-center p-4 text-gray-500 font-medium">
                                                    {isLoading ? "Memuat..." : (selectedDateForFilter ? "Data tidak ditemukan untuk tanggal yang dipilih." : "Belum ada data pemasukan.")}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredData.map((item, index) => (
                                                <tr key={`row-${index}-${item.booking_date || index}`} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200">
                                                    <td className="p-3 whitespace-nowrap">{item.booking_date}</td>
                                                    <td className="p-3 whitespace-nowrap">{formatRupiah(item.income)}</td>
                                                    <td className="p-3 whitespace-nowrap">{formatRupiah(item.expediture)}</td>
                                                    <td className="p-3 whitespace-nowrap">{formatRupiah(item.cash)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
                        <span className="font-bold text-lg">Total Kas Kotor:</span>
                        <span className="text-lg font-semibold text-[#3D6CB9]">{calculateTotalKas()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(PemasukanPage);