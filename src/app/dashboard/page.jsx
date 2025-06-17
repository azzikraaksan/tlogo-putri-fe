"use client";

import Sidebar from "/components/Sidebar.jsx";
import LoadingFunny from "/components/LoadingFunny.jsx";
import withAuth from "/src/app/lib/withAuth.jsx";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend as RechartsLegend, ResponsiveContainer
} from "recharts";
import { FaUsers, FaCar, FaPeopleCarry } from "react-icons/fa";
import { BarChart2 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, ChartJSTooltip, ChartJSLegend
);

const API_BASE_URL = "https://tpapi.siunjaya.id/api";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

const formatCurrency = (value, type = "full") => {
  if (typeof value !== 'number' || isNaN(value)) return type === "axis" ? '0' : 'Rp 0';
  if (type === "axis") {
    if (value === 0) return '0';
    if (Math.abs(value) >= 1000000) return `${(value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
    if (Math.abs(value) >= 1000) return `${(value / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Rb`;
    return value.toLocaleString('id-ID');
  }
  return `Rp ${value.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const StatCard = ({ title, value, icon: IconComponent, iconBgColor, isLoading }) => (
  <div className="p-3 bg-white rounded-xl shadow-lg flex items-center gap-3">
    <div className={`p-3 ${iconBgColor} rounded-lg`}>
      <IconComponent className="text-2xl text-white" />
    </div>
    <div className="flex-1">
      <p className="text-xs font-semibold text-gray-600">{title}</p>
      {isLoading ? (
        <div className="h-6 bg-gray-300 rounded animate-pulse w-1/2 mt-1"></div>
      ) : (
        <p className="text-xl font-bold text-[#3D6CB9]">{value}</p>
      )}
    </div>
  </div>
);

const DashboardPage = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [jumlahDriver, setJumlahDriver] = useState(0);
  const [jumlahAnggota, setJumlahAnggota] = useState(0);
  const [jumlahJeep, setJumlahJeep] = useState(0);
  const [jumlahPemesanan, setJumlahPemesanan] = useState(0);

  const [chartData, setChartData] = useState([]);
  const [summaryCardData, setSummaryCardData] = useState({
    totalPemasukan: 0, totalPengeluaran: 0, totalKas: 0, persenPemasukan: null, persenPengeluaran: null, marginKasBersih: null,
  });
  const [pemesananChartData, setPemesananChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Pemesanan',
      data: [],
      backgroundColor: 'rgba(61, 108, 185, 0.2)',
      borderColor: 'rgba(61, 108, 185, 1)',
      borderWidth: 1,
    }]
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token tidak ditemukan");
      const headers = { Authorization: `Bearer ${token}` };

      const [meRes, anggotaRes, driverRes, jeepRes, financialRes, bookingMonthlyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/me`, { headers }),
        fetch(`${API_BASE_URL}/users/all`, { headers }),
        fetch(`${API_BASE_URL}/users/by-role?role=DRIVER`, { headers }),
        fetch(`${API_BASE_URL}/jeeps/all`, { headers }),
        fetch(`${API_BASE_URL}/reports/statistik?tahun=${new Date().getFullYear()}`, { headers }),
        fetch(`${API_BASE_URL}/count/bookings`, { headers }),
      ]);

      const meData = await meRes.json();
      if (meData.success) {
        setUserName(meData.data.name);
        setUserRole(meData.data.role);
      }

      const anggotaData = await anggotaRes.json();
      if (Array.isArray(anggotaData)) {
        setJumlahAnggota(anggotaData.length);
      } else {
        console.warn("Data anggota tidak dalam array:", anggotaData);
        setJumlahAnggota(0);
      }
      setLoadingUsers(false);
      setJumlahAnggota(anggotaData.length);


      setJumlahDriver((await driverRes.json()).data?.length || 0);
      setJumlahJeep((await jeepRes.json()).data?.length || 0);

      if (bookingMonthlyRes.ok) {
        const bookingMonthlyData = await bookingMonthlyRes.json();
        if (bookingMonthlyData.success && Array.isArray(bookingMonthlyData.data)) {
          const totalBookings = bookingMonthlyData.data.reduce((sum, item) => sum + item.total, 0);
          setJumlahPemesanan(totalBookings);

          const sortedData = bookingMonthlyData.data.reverse();
          const labels = sortedData.map(item => item.month);
          const totals = sortedData.map(item => item.total);

          setPemesananChartData({
            labels: labels,
            datasets: [{
              label: 'Pemesanan',
              data: totals,
              backgroundColor: 'rgba(61, 108, 185, 0.2)',
              borderColor: 'rgba(61, 108, 185, 1)',
              borderWidth: 1,
            }]
          });
        }
      }

      if (financialRes.ok) {
        const financialResult = await financialRes.json();
        if (financialResult.status === 'success' && Array.isArray(financialResult.data)) {
          const rawData = financialResult.data;
          const totalPemasukanTahunan = rawData.reduce((sum, item) => sum + parseFloat(item.total_pemasukan || 0), 0);
          const totalPengeluaranTahunan = rawData.reduce((sum, item) => sum + parseFloat(item.total_pengeluaran || 0), 0);
          const kasBersihTerakhir = rawData.length > 0 ? parseFloat(rawData[rawData.length - 1].net_cash || 0) : 0;
          setSummaryCardData({
            totalPemasukan: totalPemasukanTahunan,
            totalPengeluaran: totalPengeluaranTahunan,
            totalKas: kasBersihTerakhir,
            persenPemasukan: (totalPemasukanTahunan + totalPengeluaranTahunan) > 0 ? (totalPemasukanTahunan / (totalPemasukanTahunan + totalPengeluaranTahunan)) * 100 : 0,
            persenPengeluaran: (totalPemasukanTahunan + totalPengeluaranTahunan) > 0 ? (totalPengeluaranTahunan / (totalPemasukanTahunan + totalPengeluaranTahunan)) * 100 : 0,
            marginKasBersih: totalPemasukanTahunan > 0 ? (kasBersihTerakhir / totalPemasukanTahunan) * 100 : 0,
          });
          setChartData(rawData.map(item => ({
            label: `${monthNames[parseInt(item.bulan.split('-')[1], 10) - 1]} '${String(item.bulan.split('-')[0]).slice(-2)}`,
            pemasukan: parseFloat(item.total_pemasukan || 0),
            pengeluaran: parseFloat(item.total_pengeluaran || 0),
            kas: parseFloat(item.net_cash || 0),
          })));
        } else {
          setError(financialResult.message || "Data statistik keuangan tidak valid.");
        }
      } else {
        setError(`Gagal mengambil data keuangan: ${financialRes.statusText}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading && chartData.length === 0) {
    return <LoadingFunny />;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 p-6 md:p-10 transition-all duration-300 ease-in-out" style={{ marginLeft: isSidebarOpen ? 290 : 70 }}>
        <div className="mb-8 flex items-center gap-2 mt-4">
          <h1 className="text-2xl md:text-[32px] font-normal text-gray-700">Selamat datang,</h1>
          <p className="text-2xl md:text-[32px] font-bold text-[#3D6CB9]">{userRole}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Daftar Anggota"
            value={jumlahAnggota}
            icon={FaUsers}
            iconBgColor="bg-[#21ad11]"
            isLoading={loadingUsers}
          />
          <StatCard
            title="Daftar Driver"
            value={jumlahDriver}
            icon={FaPeopleCarry}
            iconBgColor="bg-[#3D6CB9]"
            isLoading={isLoading}
          />
          <StatCard
            title="Daftar Jeep"
            value={jumlahJeep}
            icon={FaCar}
            iconBgColor="bg-[#c7b70c]"
            isLoading={isLoading}
          />
        </div>

        <h2 className="text-xl font-semibold text-slate-700 mb-4">Analisis Grafik</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-[#3D6CB9]">Grafik Pemesanan</h3>
            <div className="h-[300px]">
              <Bar data={pemesananChartData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#3D6CB9]">Tren Keuangan Bulanan</h3>
            <p className="text-sm text-slate-500 mb-4">Tahun {new Date().getFullYear()}</p>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-[300px] text-slate-500">
                <BarChart2 className="w-10 h-10 text-slate-400 animate-pulse mb-2" />
                Memuat data...
              </div>
            ) : error || chartData.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-[300px] text-slate-500">
                <BarChart2 className="w-10 h-10 text-slate-400 opacity-50 mb-2" />
                {error || "Tidak ada data."}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => formatCurrency(value, "axis")} tick={{ fontSize: 10 }} />
                  <ChartJSTooltip formatter={(value, name) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]} labelStyle={{ fontWeight: 'bold' }} wrapperClassName="rounded-md shadow-lg !border-slate-200 !bg-white/90 !text-xs !p-2" />
                  <RechartsLegend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                  <Line type="monotone" dataKey="pemasukan" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} name="Pemasukan" dot={false} />
                  <Line type="monotone" dataKey="pengeluaran" stroke="#f43f5e" strokeWidth={2} activeDot={{ r: 6 }} name="Pengeluaran" dot={false} />
                  <Line type="monotone" dataKey="kas" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} name="Kas Bersih" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);