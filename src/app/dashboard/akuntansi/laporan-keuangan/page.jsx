"use client";

import { useState, useEffect, useCallback, useMemo } from "react"; // Tambahkan useMemo
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, FileText, BarChart2, ChevronRight } from "lucide-react";

// Base URL (tidak terpakai karena simulasi, tapi tetap ada untuk struktur)
// const API_BASE_URL = "http://localhost:8000/api"; // Bisa di-uncomment jika API sudah ada

// Fungsi untuk format angka (Rupiah) - sudah di luar komponen
const formatCurrency = (value, type = "full") => {
    if (typeof value !== 'number' || isNaN(value)) return type === "axis" ? '0' : 'Rp 0';

    if (type === "axis") {
        if (value === 0) return '0';
        if (Math.abs(value) >= 1000000000) return `${(value / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
        if (Math.abs(value) >= 1000000) return `${(value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
        if (Math.abs(value) >= 1000) return `${(value / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Rb`;
        return value.toLocaleString('id-ID');
    }
    return `Rp ${value.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

// Definisikan monthNames di luar komponen agar stabil referensinya
const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

// Helper untuk merender kartu ringkasan - pindahkan ke luar komponen karena pure
const SummaryCard = ({ title, value, percentage, icon: IconComponent, colorTheme, isLoading }) => {
    const percentageText = title === "Kas Bersih" ? "Margin dari Pemasukan" : "Dari Total Aktivitas";
    return (
        <div className={`p-5 rounded-lg shadow-md flex flex-col justify-between ${colorTheme.bgFaint} border-l-4 ${colorTheme.border}`}>
            <div>
                <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-medium ${colorTheme.textHard}`}>{title}</h3>
                    <IconComponent className={`w-6 h-6 ${colorTheme.icon}`} />
                </div>
                {isLoading ? (
                    <>
                        <div className="h-7 bg-gray-300 rounded animate-pulse w-3/4 my-1"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2 mt-2"></div>
                    </>
                ) : (
                    <>
                        <p className={`text-2xl font-bold ${colorTheme.textHard}`}>{formatCurrency(value)}</p>
                        {percentage !== null && typeof percentage === 'number' && (
                            <p className={`text-xs ${colorTheme.textSoft} mt-1`}>
                                <span className={`${percentage >= 0 ? 'text-green-600' : 'text-red-500'} font-semibold`}>
                                    {percentage >= 0 ? `▲` : `▼`} {Math.abs(percentage).toFixed(1)}%
                                </span>
                                &nbsp;{percentageText}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Daftar laporan untuk navigasi - pindahkan ke luar atau memoize jika di dalam
// Karena menggunakan FileText (import) secara langsung, lebih baik di memoize jika tetap di dalam
// Atau jika FileText stabil (seperti import dari library), bisa juga di luar.
// Untuk kasus ini, kita bisa memoize di dalam komponen.
const initialReportNavigations = [
    { label: "Harian", route: "harian", icon: FileText, description: "Lihat transaksi harian." },
    { label: "Bulanan", route: "bulanan", icon: FileText, description: "Rekapitulasi per bulan." },
    { label: "Triwulan", route: "triwulan", icon: FileText, description: "Laporan per tiga bulan." },
    { label: "Tahunan", route: "tahunan", icon: FileText, description: "Ringkasan keuangan tahunan." },
];


const KeuanganPage = () => {
    const [summaryCardData, setSummaryCardData] = useState({
        totalPemasukan: 0,
        totalPengeluaran: 0,
        totalKas: 0,
        persenPemasukan: null, // Optimasi: Gunakan null untuk state awal persentase
        persenPengeluaran: null,
        marginKasBersih: null,
    });
    const [chartData12Months, setChartData12Months] = useState([]);
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);
    const [isLoadingChart, setIsLoadingChart] = useState(true);
    const router = useRouter();

    // Memoize reportNavigations karena mengandung komponen (FileText)
    // Meskipun FileText adalah import yang stabil, ini adalah praktik yang baik jika struktur datanya kompleks.
    const reportNavigations = useMemo(() => initialReportNavigations, []);


    // 1. Fungsi SIMULASI untuk mengambil dan mengkalkulasi data untuk Kartu Ringkasan
    const fetchAndCalculateSummaryDataSimulated = useCallback(async () => {
        setIsLoadingSummary(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const totalPemasukan = Math.random() * 1.5e9 + 0.5e9; 
            const totalPengeluaran = Math.random() * (totalPemasukan * 0.8) + (totalPemasukan * 0.2); // Pengeluaran antara 20% - 80% Pemasukan
            
            const totalKas = totalPemasukan - totalPengeluaran;
            const totalAktivitasFinansial = totalPemasukan + totalPengeluaran;

            const persenPemasukan = totalAktivitasFinansial > 0 ? (totalPemasukan / totalAktivitasFinansial) * 100 : 0;
            const persenPengeluaran = totalAktivitasFinansial > 0 ? (totalPengeluaran / totalAktivitasFinansial) * 100 : 0;
            const marginKasBersih = totalPemasukan > 0 ? (totalKas / totalPemasukan) * 100 : 0;

            setSummaryCardData({
                totalPemasukan,
                totalPengeluaran,
                totalKas,
                persenPemasukan,
                persenPengeluaran,
                marginKasBersih,
            });
        } catch (error) {
            console.error("Error (simulated) fetching summary data:", error);
            setSummaryCardData({ totalPemasukan: 0, totalPengeluaran: 0, totalKas: 0, persenPemasukan: null, persenPengeluaran: null, marginKasBersih: null });
        } finally {
            setIsLoadingSummary(false);
        }
    }, []);

    // 2. Fungsi SIMULASI untuk mengambil data Grafik 12 Bulan Terakhir
    const fetchChartData12MonthsSimulated = useCallback(async () => {
        setIsLoadingChart(true);
        await new Promise(resolve => setTimeout(resolve, 1200));

        try {
            const data = [];
            const today = new Date();
            for (let i = 11; i >= 0; i--) {
                const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthPemasukan = Math.random() * 80000000 + 20000000;
                const monthPengeluaran = Math.random() * (monthPemasukan * 0.7) + (monthPemasukan * 0.1); // Pengeluaran bulanan antara 10-70% Pemasukan bulan itu
                data.push({
                    year: date.getFullYear(),
                    month: date.getMonth() + 1, 
                    total_pemasukan: monthPemasukan,
                    total_pengeluaran: monthPengeluaran,
                });
            }
            
            const transformedData = data.map(item => ({
                label: `${monthNames[item.month - 1]} '${String(item.year).slice(-2)}`,
                pemasukan: parseFloat(item.total_pemasukan || 0),
                pengeluaran: parseFloat(item.total_pengeluaran || 0),
                kas: parseFloat(item.total_pemasukan || 0) - parseFloat(item.total_pengeluaran || 0),
            }));
            setChartData12Months(transformedData);
        } catch (error) {
            console.error("Error (simulated) fetching 12-month chart data:", error);
            setChartData12Months([]);
        } finally {
            setIsLoadingChart(false);
        }
    }, []); // monthNames diambil dari scope luar yang stabil, jadi dependensi bisa kosong

    useEffect(() => {
        fetchAndCalculateSummaryDataSimulated();
        fetchChartData12MonthsSimulated();
    }, [fetchAndCalculateSummaryDataSimulated, fetchChartData12MonthsSimulated]);

    // 3. Fungsi untuk navigasi ke halaman tabel detail
    const handleNavigateToReport = useCallback((reportType) => {
        router.push(`/dashboard/akuntansi/laporan-keuangan/${reportType}`);
    }, [router]); // router dari useRouter() stabil
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
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                        Laporan Keuangan
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 mb-4 md:mb-4">
                        <SummaryCard title="Total Pemasukan" value={summaryCardData.totalPemasukan} percentage={summaryCardData.persenPemasukan} icon={TrendingUp}
                            colorTheme={{ bgFaint: "bg-emerald-50", border: "border-emerald-500", textHard: "text-emerald-700", textSoft: "text-emerald-600", icon: "text-emerald-500" }} isLoading={isLoadingSummary} />
                        <SummaryCard title="Total Pengeluaran" value={summaryCardData.totalPengeluaran} percentage={summaryCardData.persenPengeluaran} icon={TrendingDown}
                            colorTheme={{ bgFaint: "bg-rose-50", border: "border-rose-500", textHard: "text-rose-700", textSoft: "text-rose-600", icon: "text-rose-500" }} isLoading={isLoadingSummary} />
                        <SummaryCard title="Kas Bersih" value={summaryCardData.totalKas} percentage={summaryCardData.marginKasBersih} icon={DollarSign}
                            colorTheme={{ bgFaint: "bg-sky-50", border: "border-sky-500", textHard: "text-sky-700", textSoft: "text-sky-600", icon: "text-sky-500" }} isLoading={isLoadingSummary} />
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-6 md:mb-8">
                        <div className="flex justify-between items-center mb-1">
                             <h2 className="text-lg font-semibold text-slate-700">Ringkasan Keuangan</h2>
                             {/* Opsional: Tombol refresh manual */}
                             {/* <button onClick={fetchChartData12MonthsSimulated} className="text-xs text-sky-600 hover:text-sky-800">Refresh Grafik</button> */}
                        </div>
                        <p className="text-sm text-slate-500 mb-4">
                            Tren 12 bulan terakhir ({chartData12Months.length > 0 && chartData12Months[0].label ? chartData12Months[0].label : ''} - {chartData12Months.length > 0 && chartData12Months[chartData12Months.length-1].label ? chartData12Months[chartData12Months.length-1].label: ''})
                        </p>
                        
                        {isLoadingChart ? (
                            <div className="flex flex-col justify-center items-center h-[350px] text-slate-500">
                                <BarChart2 className="w-10 h-10 text-slate-400 animate-pulse mb-2" />
                                Memuat data grafik...
                            </div>
                        ) : chartData12Months.length > 0 ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={chartData12Months} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 10 }} />
                                    <YAxis stroke="#6b7280" tickFormatter={(value) => formatCurrency(value, "axis")} tick={{ fontSize: 10 }} />
                                    <Tooltip 
                                        formatter={(value, name) => [formatCurrency(value), name]} 
                                        labelStyle={{ fontWeight: 'bold', color: '#374151' }} 
                                        itemStyle={{ color: '#4b5563'}}
                                        wrapperClassName="rounded-md shadow-lg !border-slate-200 !bg-white/90 backdrop-blur-sm !text-xs" 
                                    />
                                    <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                                    <Line type="monotone" dataKey="pemasukan" stroke="#10b981" strokeWidth={2} dot={{ r: 3, strokeWidth:1, fill: "#10b981" }} activeDot={{ r: 5, strokeWidth:1 }} name="Pemasukan" />
                                    <Line type="monotone" dataKey="pengeluaran" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, strokeWidth:1, fill: "#f43f5e" }} activeDot={{ r: 5, strokeWidth:1 }} name="Pengeluaran" />
                                    <Line type="monotone" dataKey="kas" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, strokeWidth:1, fill: "#3b82f6" }} activeDot={{ r: 5, strokeWidth:1 }} name="Kas Bersih" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                             <div className="flex flex-col justify-center items-center h-[350px] text-slate-500">
                                <BarChart2 className="w-10 h-10 text-slate-400 opacity-50 mb-2" />
                                Tidak ada data untuk ditampilkan pada grafik.
                            </div>
                        )}
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
                        <h2 className="text-lg font-semibold text-slate-700 mb-4">Laporan Keuangan Rinci</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {reportNavigations.map((report) => {
                                const Icon = report.icon; // Icon diambil dari objek report
                                return (
                                    <button
                                        key={report.route}
                                        onClick={() => handleNavigateToReport(report.route)}
                                        className="group flex items-center justify-between p-4 rounded-md bg-slate-50 hover:bg-sky-100 border border-slate-200 hover:border-sky-300 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
                                    >
                                        <div className="flex items-center">
                                            <Icon className="w-5 h-5 text-sky-600 mr-3 transition-colors duration-200 group-hover:text-sky-700" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700 group-hover:text-sky-800 text-left">{report.label}</p>
                                                <p className="text-xs text-slate-500 group-hover:text-sky-600 text-left">{report.description}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-500 transition-transform duration-200 group-hover:translate-x-1" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
            </div>
        </div>
    );
};

export default withAuth(KeuanganPage);