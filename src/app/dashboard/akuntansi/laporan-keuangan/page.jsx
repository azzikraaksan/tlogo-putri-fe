"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "/components/Sidebar.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, FileText, BarChart2, ChevronRight } from "lucide-react";

// const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = "https://tpapi.siunjaya.id/api";

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

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

const SummaryCard = ({ title, value, percentage, icon: IconComponent, colorTheme, isLoading }) => {
    const percentageText = title === "Kas Bersih" ? "Margin dari Pemasukan" : "Dari Total Aktivitas";
    const isPositive = percentage >= 0;
    const percentageToShow = percentage !== null && typeof percentage === 'number' && isFinite(percentage);

    return (
        // PERUBAHAN: Menambahkan cursor-pointer dan efek hover
        <div className={`p-3 rounded-lg shadow-md flex flex-col justify-between ${colorTheme.bgFaint} border-l-4 ${colorTheme.border} cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-all duration-300`}>
            <div>
                <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-medium ${colorTheme.textHard}`}>{title}</h3>
                    <IconComponent className={`w-5 h-5 ${colorTheme.icon}`} />
                </div>
                {isLoading ? (
                    <>
                        <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4 my-1"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2 mt-2"></div>
                    </>
                ) : (
                    <>
                        <p className={`text-xl font-bold ${colorTheme.textHard}`}>{formatCurrency(value)}</p>
                        {percentageToShow && (
                            <p className={`text-xs ${colorTheme.textSoft} mt-1`}>
                                <span className={`${isPositive ? 'text-green-600' : 'text-red-500'} font-semibold`}>
                                    {isPositive ? `▲` : `▼`} {Math.abs(percentage).toFixed(1)}%
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

const initialReportNavigations = [
    { label: "Harian", route: "harian", icon: FileText },
    { label: "Bulanan", route: "bulanan", icon: FileText },
    { label: "Triwulan", route: "triwulan", icon: FileText },
    { label: "Tahunan", route: "tahunan", icon: FileText },
];

const KeuanganPage = () => {
    const [summaryCardData, setSummaryCardData] = useState({
        totalPemasukan: 0,
        totalPengeluaran: 0,
        totalKas: 0,
        persenPemasukan: null,
        persenPengeluaran: null,
        marginKasBersih: null,
    });
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Variabel ini tetap ada, tapi penggunaannya dikomentari
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const reportNavigations = useMemo(() => initialReportNavigations, []);

    const fetchFinancialData = useCallback(async () => {
        setIsLoading(true);
        // setError(null); // Dikomentari: jangan set error ke null di awal fetch
        try {
            const currentYear = new Date().getFullYear();
            
            const response = await fetch(`${API_BASE_URL}/reports/statistik?tahun=${currentYear}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // throw new Error(errorData.message || `HTTP error! status: ${response.status}`); // Dikomentari
                // Mengatur error agar UI bisa menampilkan pesan umum
                // setError("Gagal mengambil data statistik."); // Dikomentari: untuk menonaktifkan pesan error spesifik
                throw new Error("Failed to fetch data."); // Buat error generik yang tidak akan dicatat
            }
            const result = await response.json();
            
            if (result.status !== 'success' || !Array.isArray(result.data) || result.data.length === 0) {
                // throw new Error(result.message || "Data statistik tidak ditemukan untuk tahun ini."); // Dikomentari
                // setError("Data statistik tidak ditemukan untuk tahun ini."); // Dikomentari: untuk menonaktifkan pesan error spesifik
                throw new Error("No statistical data found for this year."); // Buat error generik yang tidak akan dicatat
            }
            
            const rawData = result.data;

            // 1. Kalkulasi untuk Summary Cards
            const totalPemasukanTahunan = rawData.reduce((sum, item) => sum + parseFloat(item.total_pemasukan || 0), 0);
            const totalPengeluaranTahunan = rawData.reduce((sum, item) => sum + parseFloat(item.total_pengeluaran || 0), 0);
            
            const dataBulanTerakhir = rawData[rawData.length - 1];
            const kasBersihTerakhir = parseFloat(dataBulanTerakhir.net_cash || 0);

            const totalAktivitasFinansial = totalPemasukanTahunan + totalPengeluaranTahunan;
            const persenPemasukan = totalAktivitasFinansial > 0 ? (totalPemasukanTahunan / totalAktivitasFinansial) * 100 : 0;
            const persenPengeluaran = totalAktivitasFinansial > 0 ? (totalPengeluaranTahunan / totalAktivitasFinansial) * 100 : 0;
            const marginKasBersih = totalPemasukanTahunan > 0 ? (kasBersihTerakhir / totalPemasukanTahunan) * 100 : 0;

            setSummaryCardData({
                totalPemasukan: totalPemasukanTahunan,
                totalPengeluaran: totalPengeluaranTahunan,
                totalKas: kasBersihTerakhir,
                persenPemasukan,
                persenPengeluaran,
                marginKasBersih,
            });

            // 2. Transformasi data untuk Grafik (Chart)
            const transformedData = rawData.map(item => {
                const [year, month] = item.bulan.split('-');
                return {
                    label: `${monthNames[parseInt(month, 10) - 1]} '${String(year).slice(-2)}`,
                    pemasukan: parseFloat(item.total_pemasukan || 0),
                    pengeluaran: parseFloat(item.total_pengeluaran || 0),
                    kas: parseFloat(item.net_cash || 0),
                };
            });

            setChartData(transformedData);
            // setError(null); // Dikomentari: Hapus error jika fetch berhasil

        } catch (err) {
            // console.error("Gagal mengambil data keuangan:", err); // Dikomentari
            // setError(err.message); // Dikomentari: untuk menonaktifkan pesan error spesifik
            setError("Terjadi kesalahan saat memuat data."); // Pesan generik
            setSummaryCardData({ totalPemasukan: 0, totalPengeluaran: 0, totalKas: 0, persenPemasukan: null, persenPengeluaran: null, marginKasBersih: null });
            setChartData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFinancialData();
    }, [fetchFinancialData]);

    const handleNavigateToReport = useCallback((reportType) => {
        router.push(`/dashboard/akuntansi/laporan-keuangan/${reportType}`);
    }, [router]);

    return (
     <div className="flex bg-gray-50 min-h-screen">
       <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
       <div
         className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
         style={{
         marginLeft: isSidebarOpen ? 290 : 70,
         }}
       >
        <div className="flex-1 flex flex-col overflow-hidden">
         <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
           <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-6">
            Laporan Keuangan
           </h1>

           <div className="bg-blue-100 shadow-lg rounded-lg p-4 md:p-6 mb-4">
            <h2 className="text-lg font-semibold text-slate-700 mb-2 ">Periode Laporan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {reportNavigations.map((report) => {
             const Icon = report.icon;
             return (
               <button
               key={report.route}
               onClick={() => handleNavigateToReport(report.route)}
               // PERUBAHAN: Menambahkan cursor-pointer secara eksplisit
               className="group flex items-center justify-between p-2 rounded-md bg-slate-50 hover:bg-sky-100 border border-slate-200 hover:border-sky-300 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 cursor-pointer"
               >
               <div className="flex items-center">
                <Icon className="w-4 h-4 text-sky-600 mr-2 transition-colors duration-200 group-hover:text-sky-700" />
                <div>
                 <p className="text-sm font-medium text-slate-700 group-hover:text-sky-800 text-left">{report.label}</p>
                 <p className="text-xs text-slate-500 group-hover:text-sky-600 text-left">{report.description}</p>
                </div>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-transform duration-200 group-hover:translate-x-0.5" />
               </button>
             );
             })}
            </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 mb-4">
            <SummaryCard title="Total Pemasukan" value={summaryCardData.totalPemasukan} percentage={summaryCardData.persenPemasukan} icon={TrendingUp}
             colorTheme={{ bgFaint: "bg-emerald-50", border: "border-emerald-500", textHard: "text-emerald-700", textSoft: "text-emerald-600", icon: "text-emerald-500" }} isLoading={isLoading} />
            <SummaryCard title="Total Pengeluaran" value={summaryCardData.totalPengeluaran} percentage={summaryCardData.persenPengeluaran} icon={TrendingDown}
             colorTheme={{ bgFaint: "bg-rose-50", border: "border-rose-500", textHard: "text-rose-700", textSoft: "text-rose-600", icon: "text-rose-500" }} isLoading={isLoading} />
            <SummaryCard title="Kas Bersih" value={summaryCardData.totalKas} percentage={summaryCardData.marginKasBersih} icon={DollarSign}
             colorTheme={{ bgFaint: "bg-sky-50", border: "border-sky-500", textHard: "text-sky-700", textSoft: "text-sky-600", icon: "text-sky-500" }} isLoading={isLoading} />
           </div>

           <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-1">
               <h2 className="text-lg font-semibold text-slate-700">Ringkasan Keuangan</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">
               Tren untuk tahun {new Date().getFullYear()}
            </p>
            
            {isLoading ? (
               <div className="flex flex-col justify-center items-center h-[350px] text-slate-500">
                <BarChart2 className="w-10 h-10 text-slate-400 animate-pulse mb-2" />
                Memuat data grafik...
               </div>
            ) : error || chartData.length === 0 ? (
                // Menampilkan pesan error generik
                <div className="flex flex-col justify-center items-center h-[350px] text-slate-500">
                    <BarChart2 className="w-10 h-10 text-slate-400 opacity-50 mb-2" />
                    Terjadi kesalahan saat memuat data atau tidak ada data untuk ditampilkan.
                </div>
            ) : (
               <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                   <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 10 }} />
                   <YAxis stroke="#6b7280" tickFormatter={(value) => formatCurrency(value, "axis")} tick={{ fontSize: 10 }} />
                   <Tooltip 
                   formatter={(value, name) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]} 
                   labelStyle={{ fontWeight: 'bold', color: '#374151' }} 
                   itemStyle={{ color: '#4b5563'}}
                   wrapperClassName="rounded-md shadow-lg !border-slate-200 !bg-white/90 backdrop-blur-sm !text-xs !p-2"
                   />
                   <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                   <Line type="monotone" dataKey="pemasukan" stroke="#10b981" strokeWidth={2} dot={{ r: 3, strokeWidth:1, fill: "#10b981" }} activeDot={{ r: 5, strokeWidth:1 }} name="Pemasukan" />
                   <Line type="monotone" dataKey="pengeluaran" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, strokeWidth:1, fill: "#f43f5e" }} activeDot={{ r: 5, strokeWidth:1 }} name="Pengeluaran" />
                   <Line type="monotone" dataKey="kas" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, strokeWidth:1, fill: "#3b82f6" }} activeDot={{ r: 5, strokeWidth:1 }} name="Kas Bersih" />
                </LineChart>
               </ResponsiveContainer>
            )}
           </div>

         </main>
        </div>
       </div>
      </div>
    );
};

export default withAuth(KeuanganPage);