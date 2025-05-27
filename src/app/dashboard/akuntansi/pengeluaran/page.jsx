"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx"; 
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

// Base URL for your API
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

const PengeluaranPage = ({ children }) => {
    const [dataPengeluaran, setDataPengeluaran] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDateForFilter, setSelectedDateForFilter] = useState(null);
    const [tempDateForPicker, setTempDateForPicker] = useState(null);
    const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const calendarRef = useRef(null);

    const applyFilterToData = useCallback((rawData, dateFilter) => {
        if (!Array.isArray(rawData)) {
            console.warn("Data mentah untuk filter bukan array, mengatur filteredData menjadi array kosong.");
            setFilteredData([]);
            return;
        }

        if (dateFilter) {
            const formattedFilterDate = formatDateToDisplay(dateFilter);
            const filtered = rawData.filter(item => {
                const itemDate = item.issue_date ? new Date(item.issue_date) : null;
                return itemDate && formatDateToDisplay(itemDate) === formattedFilterDate;
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(rawData);
        }
    }, []);

    const fetchExpenditureData = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = `${API_BASE_URL}/expenditures/all`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`[fetchExpenditureData] HTTP Error! Status: ${response.status}, Status Text: ${response.statusText}, Response Body: ${errorBody}`);
                throw new Error(`Gagal mengambil data pengeluaran: ${response.statusText || 'Kesalahan Server'}`);
            }

            const result = await response.json();
            console.log("[fetchExpenditureData] Raw API Response:", result);

            let extractedData = [];
            if (Array.isArray(result)) {
                extractedData = result;
            } else if (result && Array.isArray(result.data)) {
                extractedData = result.data;
            } else if (result && Array.isArray(result.expenditures)) { 
                extractedData = result.expenditures;
            } else if (result && Array.isArray(result.salaries)) { 
                extractedData = result.salaries;
            } else {
                console.warn("[fetchExpenditureData] Struktur data respons API tidak sesuai harapan. Pastikan API mengembalikan array atau objek dengan properti 'data'/'expenditures'/'salaries' yang berisi array.", result);
                extractedData = [];
            }
            
            const cleanData = extractedData.filter(item => 
                item && typeof item.expenditure_id !== 'undefined'
            );

            setDataPengeluaran(cleanData);
            applyFilterToData(cleanData, selectedDateForFilter);
            
        } catch (error) {
            console.error("[fetchExpenditureData] Kesalahan saat mengambil atau memproses data pengeluaran:", error);
            alert(`Gagal mengambil data pengeluaran: ${error.message}`);
            setDataPengeluaran([]);
            setFilteredData([]);
        } finally {
            setIsLoading(false);
        }
    }, [applyFilterToData, selectedDateForFilter]);

    const handleGenerateReport = async () => {
        if (confirm("Apakah Anda yakin ingin membuat laporan pengeluaran?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/expenditures/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = `Kesalahan HTTP saat membuat laporan! Status: ${response.status}`;
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage += `, Pesan: ${errorJson.message || JSON.stringify(errorJson)}`;
                    } catch {
                        errorMessage += `, Respons Mentah: ${errorText.substring(0, 200)}...`;
                    }
                    throw new Error(errorMessage);
                }

                alert("Laporan pengeluaran berhasil dibuat.");
            } catch (error) {
                console.error("Gagal membuat laporan pengeluaran:", error);
                alert(`Gagal membuat laporan pengeluaran: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        fetchExpenditureData();
        const handleDataUpdate = () => {
            console.log("Menerima event dataPengeluaranUpdated, memuat ulang data pengeluaran...");
            fetchExpenditureData();
        };
        window.addEventListener('dataPengeluaranUpdated', handleDataUpdate);
        return () => {
            window.removeEventListener('dataPengeluaranUpdated', handleDataUpdate);
        };
    }, [fetchExpenditureData]);

    useEffect(() => {
        applyFilterToData(dataPengeluaran, selectedDateForFilter);
    }, [dataPengeluaran, selectedDateForFilter, applyFilterToData]);

    const applyDateFilter = () => {
        setSelectedDateForFilter(tempDateForPicker);
        setIsDatePickerOpen(false);
    };

    const resetFilter = () => {
        setSelectedDateForFilter(null);
        setTempDateForPicker(null);
        setIsDatePickerOpen(false);
    };

    const handleOpenTambahModal = () => {
        setIsTambahModalOpen(true);
    };

    const handleCloseTambahModal = () => {
        setIsTambahModalOpen(false);
    };

    const handleDeleteAction = async (expenditure_id) => {
        if (!expenditure_id) {
            console.error("[handleDeleteAction] ID Pengeluaran tidak ditemukan atau tidak valid untuk dihapus.");
            alert("Gagal menghapus data: ID tidak valid.");
            return;
        }

        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                const deleteUrl = `${API_BASE_URL}/expenditures/delete/${expenditure_id}`;
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                    },
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
                console.error("[handleDeleteAction] Kesalahan menghapus data pengeluaran:", error);
                alert(`Gagal menghapus data pengeluaran: ${error.message}`);
            }
        }
    };

    const getExportFileName = (ext) => {
        const date = new Date().toISOString().split("T")[0];
        const filterInfo = selectedDateForFilter ? `_${formatDateToDisplay(selectedDateForFilter).replace(/\-/g, '')}` : '_all';
        return `laporan_pengeluaran${filterInfo}_${date}.${ext}`;
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
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pengeluaran");
            XLSX.writeFile(wb, getExportFileName("xlsx"));
        } catch (error) {
            console.error("Kesalahan export Excel:", error);
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
            const tableColumn = [
                "Tanggal Pengeluaran",
                "Total",
                "Keterangan",
                "Kategori",
            ];
            const tableRows = filteredData.map((item) => [
                formatDateToDisplay(item.issue_date),
                formatCurrency(parseFloat(item.amount)),
                item.information,
                item.action,
            ]);

            doc.text(`Laporan Data Pengeluaran ${selectedDateForFilter ? `(${formatDateToDisplay(selectedDateForFilter)})` : '(Semua Data)'}`, 14, 15);
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: {
                    fontSize: 8,
                    cellPadding: 2
                },
                headStyles: {
                    fillColor: [61, 108, 185]
                }
            });
            doc.save(getExportFileName("pdf"));
        } catch (error) {
            console.error("Kesalahan export PDF:", error);
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
    }, []);

    const isDataAvailableForExport = !isLoading && Array.isArray(filteredData) && filteredData.length > 0;

    return (
        <div className="flex relative bg-white-50 min-h-screen">
            <UserMenu />
            <Sidebar />
            <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
                <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
                    Pengeluaran
                </h1>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex gap-4">
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
                                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12 left-0">
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
                            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-blue-100 text-black hover:bg-[#B8D4F9]"
                        >
                            <Zap size={20} color="blue" /> <span>Buat Laporan</span>
                        </button>
                    </div>
                    <div className="flex gap-4">
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
                    <div className="overflow-y-auto max-h-[541px] rounded-lg shadow mb-8">
                        <table className="min-w-full table-auto bg-white text-sm">
                            <thead className="bg-[#3D6CB9] text-white">
                                <tr>
                                    {["Tanggal Pengeluaran", "Total", "Keterangan", "Kategori", "Aksi"]
                                        .map((header, index, arr) => (
                                            <th
                                                key={header}
                                                className={`p-2 text-center sticky top-0 z-10 bg-[#3D6CB9]`}
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
                                        <td colSpan={5} className="text-center p-4 text-gray-500 font-medium">Data Tidak Ditemukan</td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.expenditure_id} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200">
                                            <td className="p-3">{formatDateToDisplay(item.issue_date)}</td>
                                            <td className="p-3">{formatCurrency(parseFloat(item.amount))}</td>
                                            <td className="p-3">{item.information}</td>
                                            <td className="p-3">{item.action}</td>
                                            <td className="p-3">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={`/dashboard/akuntansi/pengeluaran/edit-pengeluaran/${item.expenditure_id}`}
                                                        className="text-indigo-600 hover:underline"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteAction(item.expenditure_id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <TambahPengeluaran
                isOpen={isTambahModalOpen}
                onClose={handleCloseTambahModal}
                onAddData={() => window.dispatchEvent(new CustomEvent('dataPengeluaranUpdated'))}
                initialDate={new Date()}
            />

            {children}
        </div>
    );
};

export default withAuth(PengeluaranPage);