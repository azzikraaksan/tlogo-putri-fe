// "use client";

// import { useState, useEffect } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import { useRouter } from "next/navigation";
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer
// } from "recharts";

// // Dummy generator, nanti ganti fetch backend
// const generateChartData = (period) => {
//     const today = new Date();
//     const data = [];

//     const range = {
//         Harian: 7,
//         Bulanan: 6,
//         Triwulan: 4,
//         Tahunan: 12
//     };

//     const count = range[period] || 6;

//     for (let i = count - 1; i >= 0; i--) {
//         const date = new Date(today);
//         if (period === "Harian") {
//             date.setDate(today.getDate() - i);
//         } else {
//             date.setMonth(today.getMonth() - i);
//         }

//         const label =
//             period === "Harian"
//                 ? date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
//                 : date.toLocaleString("id-ID", { month: "short", year: "2-digit" });

//         // Contoh data dummy dengan rentang yang lebih besar untuk pengujian
//         // Pastikan nilai data tidak melebihi 100 juta jika ingin domain 0-100 juta terlihat rapi
//         const pemasukan = Math.floor(Math.random() * 80000000 + 10000000); // 10jt - 90jt
//         const pengeluaran = Math.floor(Math.random() * 60000000 + 5000000); // 5jt - 65jt
//         const kas = pemasukan - pengeluaran;

//         data.push({ label, pemasukan, pengeluaran, kas });
//     }

//     return data;
// };

// // Fungsi untuk format angka pada YAxis
// const formatCurrencyAxis = (tickItem) => {
//     if (tickItem === 0) return '0'; // Handle nol secara khusus
//     if (tickItem >= 1000000000) {
//         return `${(tickItem / 1000000000).toLocaleString('id-ID')} M`; // Miliar
//     }
//     if (tickItem >= 1000000) {
//         return `${(tickItem / 1000000).toLocaleString('id-ID')} Jt`; // Juta
//     }
//     if (tickItem >= 1000) {
//         return `${(tickItem / 1000).toLocaleString('id-ID')} Rb`; // Ribu
//     }
//     return tickItem.toLocaleString('id-ID');
// };

// const KeuanganPage = () => {
//     const [activePeriod, setActivePeriod] = useState("Bulanan");
//     const [chartData, setChartData] = useState([]);
//     const [filteredTotal, setFilteredTotal] = useState({ pemasukan: 0, pengeluaran: 0 });
//     const [currentTotal, setCurrentTotal] = useState({ pemasukan: 0, pengeluaran: 0 });
//     const router = useRouter();

//     useEffect(() => {
//         const nowData = generateChartData("Harian");
//         const pemasukan = nowData.reduce((sum, item) => sum + item.pemasukan, 0);
//         const pengeluaran = nowData.reduce((sum, item) => sum + item.pengeluaran, 0);
//         setCurrentTotal({ pemasukan, pengeluaran });
//     }, []);

//     useEffect(() => {
//         const data = generateChartData(activePeriod);
//         setChartData(data);

//         const pemasukan = data.reduce((sum, item) => sum + item.pemasukan, 0);
//         const pengeluaran = data.reduce((sum, item) => sum + item.pengeluaran, 0);
//         setFilteredTotal({ pemasukan, pengeluaran });
//     }, [activePeriod]);

//     const handleRedirect = (period) => {
//         const routes = {
//             Harian: "harian",
//             Bulanan: "bulanan",
//             Triwulan: "triwulan",
//             Tahunan: "tahunan"
//         };
//         router.push(`/dashboard/akuntansi/laporan-keuangan/${routes[period]}`);
//     };

//     return (
//         <div className="flex h-screen overflow-hidden">
//             <Sidebar />
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white-50">
//                     <UserMenu />
//                     <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
//                         Laporan Keuangan
//                     </h1>

//                     {/* Total Saat Ini */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                         <div className="p-4 rounded-md shadow-sm bg-blue-50">
//                             <p className="text-sm text-gray-600">Total Pemasukan Saat Ini</p>
//                             <p className="text-xl font-bold text-blue-700">
//                                 Rp {currentTotal.pemasukan.toLocaleString("id-ID")}
//                             </p>
//                         </div>
//                         <div className="p-4 rounded-md shadow-sm bg-red-50">
//                             <p className="text-sm text-gray-600">Total Pengeluaran Saat Ini</p>
//                             <p className="text-xl font-bold text-red-700">
//                                 Rp {currentTotal.pengeluaran.toLocaleString("id-ID")}
//                             </p>
//                         </div>
//                         <div className="p-4 rounded-md shadow-sm bg-green-50">
//                             <p className="text-sm text-gray-600">Kas Bersih Saat Ini</p>
//                             <p className="text-xl font-bold text-green-700">
//                                 Rp {(currentTotal.pemasukan - currentTotal.pengeluaran).toLocaleString("id-ID")}
//                             </p>
//                         </div>
//                     </div>

//                     {/* PILIH PERIODE */}
//                     <div className="mb-6">
//                         <p className="font-medium mb-2">Pilih Periode:</p>
//                         <div className="flex flex-wrap justify-between items-center gap-2">
//                             <div className="flex gap-2 flex-wrap">
//                                 {["Harian", "Bulanan", "Triwulan", "Tahunan"].map((period) => (
//                                     <button
//                                         key={period}
//                                         onClick={() => setActivePeriod(period)}
//                                         className={`px-3 py-1.5 text-sm rounded-md shadow-sm font-medium ${
//                                             activePeriod === period
//                                                 ? "bg-blue-600 text-white"
//                                                 : "bg-gray-200 text-gray-800"
//                                         }`}
//                                     >
//                                         {period}
//                                     </button>
//                                 ))}
//                             </div>

//                             <div className="text-right">
//                                 <button
//                                     onClick={() => handleRedirect(activePeriod)}
//                                     className="text-blue-600 hover:underline font-medium text-sm whitespace-nowrap"
//                                 >
//                                     Lihat Tabel {activePeriod}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* GRAFIK */}
//                     <div className="bg-white shadow-md rounded-lg p-8 mb-6">
//                         <h3 className="text-lg font-semibold mb-4">Grafik {activePeriod}</h3>
//                         <ResponsiveContainer width="100%" height={375}>
//                             <LineChart data={chartData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="label" />
//                                 <YAxis
//                                     domain={[0, 100000000]} // Mengatur domain dari 0 hingga 100 juta
//                                     ticks={[0, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000]} // Menentukan ticks setiap 10 juta
//                                     tickFormatter={formatCurrencyAxis} // Menggunakan formatter untuk tampilan lebih ringkas
//                                     width={80} // Memberikan lebar yang cukup untuk label
//                                 />
//                                 <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
//                                 <Legend />
//                                 <Line type="linear" dataKey="pemasukan" stroke="#2563eb" strokeWidth={2} name="Pemasukan" />
//                                 <Line type="linear" dataKey="pengeluaran" stroke="#dc2626" strokeWidth={2} name="Pengeluaran" />
//                                 <Line type="linear" dataKey="kas" stroke="#16a34a" strokeWidth={2} name="Kas Bersih" />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default withAuth(KeuanganPage);

"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

// Base URL untuk API backend Anda
const API_BASE_URL = "http://localhost:8000/api";

// Fungsi untuk format angka pada YAxis
const formatCurrencyAxis = (tickItem) => {
    if (tickItem === 0) return '0';
    if (tickItem >= 1000000000) {
        return `${(tickItem / 1000000000).toLocaleString('id-ID')} M`; // Miliar
    }
    if (tickItem >= 1000000) {
        return `${(tickItem / 1000000).toLocaleString('id-ID')} Jt`; // Juta
    }
    if (tickItem >= 1000) {
        return `${(tickItem / 1000).toLocaleString('id-ID')} Rb`; // Ribu
    }
    return tickItem.toLocaleString('id-ID');
};

const KeuanganPage = () => {
    const [activePeriod, setActivePeriod] = useState("Bulanan");
    const [chartData, setChartData] = useState([]);
    const [isLoadingChart, setIsLoadingChart] = useState(false);
    const [currentTotal, setCurrentTotal] = useState({ pemasukan: 0, pengeluaran: 0 });
    const [isLoadingTotals, setIsLoadingTotals] = useState(true);
    const router = useRouter();

    // Fungsi untuk mengambil total pemasukan dan pengeluaran saat ini
    const fetchCurrentTotals = useCallback(async () => {
        setIsLoadingTotals(true);
        let totalIncome = 0;
        let totalExpenditure = 0;

        try {
            // Fetch total income
            const incomeResponse = await fetch(`${API_BASE_URL}/income/all`);
            if (incomeResponse.ok) {
                const incomeResult = await incomeResponse.json();
                // Memastikan incomeResult adalah array atau memiliki properti 'data' yang merupakan array
                const incomeArray = Array.isArray(incomeResult) ? incomeResult : (incomeResult && Array.isArray(incomeResult.data) ? incomeResult.data : []);
                totalIncome = incomeArray.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            } else {
                console.error("Failed to fetch income data:", incomeResponse.status, incomeResponse.statusText);
            }

            // Fetch total expenditure
            const expenditureResponse = await fetch(`${API_BASE_URL}/expenditures/all`);
            if (expenditureResponse.ok) {
                const expenditureResult = await expenditureResponse.json();
                // Memastikan expenditureResult adalah array atau memiliki properti 'data' yang merupakan array
                const expenditureArray = Array.isArray(expenditureResult) ? expenditureResult : (expenditureResult && Array.isArray(expenditureResult.data) ? expenditureResult.data : []);
                totalExpenditure = expenditureArray.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            } else {
                console.error("Failed to fetch expenditure data:", expenditureResponse.status, expenditureResponse.statusText);
            }

            setCurrentTotal({ pemasukan: totalIncome, pengeluaran: totalExpenditure });

        } catch (error) {
            console.error("Error fetching current totals:", error);
            setCurrentTotal({ pemasukan: 0, pengeluaran: 0 });
        } finally {
            setIsLoadingTotals(false);
        }
    }, []);

    // Fungsi untuk mengambil data grafik berdasarkan periode aktif
    const fetchChartData = useCallback(async () => {
        setIsLoadingChart(true);
        let endpoint = '';
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
        const currentQuarter = Math.ceil(currentMonth / 3);

        switch (activePeriod) {
            case "Harian":
                endpoint = `${API_BASE_URL}/dailyreports/alldaily`;
                break;
            case "Bulanan":
                endpoint = `${API_BASE_URL}/reports/bulan?month=${currentMonth}&year=${currentYear}`;
                break;
            case "Triwulan":
                endpoint = `${API_BASE_URL}/reports/triwulan?quarter=${currentQuarter}&year=${currentYear}`;
                break;
            case "Tahunan":
                endpoint = `${API_BASE_URL}/reports/tahun?year=${currentYear}`;
                break;
            default:
                endpoint = `${API_BASE_URL}/reports/bulan?month=${currentMonth}&year=${currentYear}`;
                break;
        }

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                console.error(`Failed to fetch ${activePeriod} chart data:`, response.status, response.statusText);
                setChartData([]);
                return;
            }
            const rawData = await response.json();
            const fetchedData = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);

            // Transform fetchedData to chartData format { label, pemasukan, pengeluaran, kas }
            const transformedData = fetchedData.map(item => {
                let label = '';
                // Asumsi nama properti dari API sesuai dengan skema 'report'
                const pemasukan = parseFloat(item.cash || 0);
                const pengeluaran = parseFloat(item.expenditure || 0);
                const kas = parseFloat(item.net_cash || (pemasukan - pengeluaran)); // Jika net_cash tidak langsung ada, hitung

                if (activePeriod === "Harian") {
                    // Asumsi dailyreports/alldaily memiliki 'report_date' atau 'created_at'
                    label = new Date(item.report_date || item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
                } else if (activePeriod === "Bulanan") {
                    // Asumsi reports/bulan memiliki 'report_date'
                    label = new Date(item.report_date).toLocaleString("id-ID", { month: "short", year: "2-digit" });
                } else if (activePeriod === "Triwulan") {
                    // Asumsi reports/triwulan memiliki 'quarter' dan 'year'
                    label = `T${item.quarter || currentQuarter} ${item.year || currentYear}`;
                } else if (activePeriod === "Tahunan") {
                    // Asumsi reports/tahun memiliki 'year'
                    label = `${item.year || currentYear}`;
                }

                return { label, pemasukan, pengeluaran, kas };
            });

            setChartData(transformedData);

        } catch (error) {
            console.error(`Error fetching ${activePeriod} chart data:`, error);
            setChartData([]);
        } finally {
            setIsLoadingChart(false);
        }
    }, [activePeriod]);

    // Initial fetch for current totals
    useEffect(() => {
        fetchCurrentTotals();
    }, [fetchCurrentTotals]);

    // Fetch chart data whenever activePeriod changes
    useEffect(() => {
        fetchChartData();
    }, [activePeriod, fetchChartData]);

    const handleRedirect = (period) => {
        const routes = {
            Harian: "harian",
            Bulanan: "bulanan",
            Triwulan: "triwulan",
            Tahunan: "tahunan"
        };
        router.push(`/dashboard/akuntansi/laporan-keuangan/${routes[period]}`);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white-50">
                    <UserMenu />
                    <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-black">
                        Laporan Keuangan
                    </h1>

                    {/* Total Saat Ini */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-4 rounded-md shadow-sm bg-blue-50">
                            <p className="text-sm text-gray-600">Total Pemasukan Saat Ini</p>
                            {isLoadingTotals ? (
                                <p className="text-xl font-bold text-blue-700">Memuat...</p>
                            ) : (
                                <p className="text-xl font-bold text-blue-700">
                                    Rp {currentTotal.pemasukan.toLocaleString("id-ID")}
                                </p>
                            )}
                        </div>
                        <div className="p-4 rounded-md shadow-sm bg-red-50">
                            <p className="text-sm text-gray-600">Total Pengeluaran Saat Ini</p>
                            {isLoadingTotals ? (
                                <p className="text-xl font-bold text-red-700">Memuat...</p>
                            ) : (
                                <p className="text-xl font-bold text-red-700">
                                    Rp {currentTotal.pengeluaran.toLocaleString("id-ID")}
                                </p>
                            )}
                        </div>
                        <div className="p-4 rounded-md shadow-sm bg-green-50">
                            <p className="text-sm text-gray-600">Kas Bersih Saat Ini</p>
                            {isLoadingTotals ? (
                                <p className="text-xl font-bold text-green-700">Memuat...</p>
                            ) : (
                                <p className="text-xl font-bold text-green-700">
                                    Rp {(currentTotal.pemasukan - currentTotal.pengeluaran).toLocaleString("id-ID")}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* PILIH PERIODE */}
                    <div className="mb-6">
                        <p className="font-medium mb-2">Pilih Periode:</p>
                        <div className="flex flex-wrap justify-between items-center gap-2">
                            <div className="flex gap-2 flex-wrap">
                                {["Harian", "Bulanan", "Triwulan", "Tahunan"].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setActivePeriod(period)}
                                        className={`px-3 py-1.5 text-sm rounded-md shadow-sm font-medium ${
                                            activePeriod === period
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>

                            <div className="text-right">
                                <button
                                    onClick={() => handleRedirect(activePeriod)}
                                    className="text-blue-600 hover:underline font-medium text-sm whitespace-nowrap"
                                >
                                    Lihat Tabel {activePeriod}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* GRAFIK */}
                    <div className="bg-white shadow-md rounded-lg p-8 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Grafik {activePeriod}</h3>
                        {isLoadingChart ? (
                            <div className="text-center p-10 text-lg font-medium text-gray-700">Memuat data grafik, mohon tunggu...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={375}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="label" />
                                    <YAxis
                                        domain={[0, 'auto']}
                                        tickFormatter={formatCurrencyAxis}
                                        width={80}
                                    />
                                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
                                    <Legend />
                                    <Line type="linear" dataKey="pemasukan" stroke="#2563eb" strokeWidth={2} name="Pemasukan" />
                                    <Line type="linear" dataKey="pengeluaran" stroke="#dc2626" strokeWidth={2} name="Pengeluaran" />
                                    <Line type="linear" dataKey="kas" stroke="#16a34a" strokeWidth={2} name="Kas Bersih" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(KeuanganPage);