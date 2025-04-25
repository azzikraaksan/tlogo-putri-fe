"use client";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth.jsx";
import { Bar } from "react-chartjs-2";
import { FaUsers, FaCar, FaRegListAlt, FaPeopleCarry } from "react-icons/fa"; // Import FaPeopleCarry untuk Daftar Driver
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Pendapatan",
      data: [
        1000, 1200, 800, 1500, 1300, 1700, 1600, 1400, 1800, 1900, 2000, 2100,
      ],
      backgroundColor: "rgba(0, 123, 255, 0.2)", // Warna biru cerah dengan transparansi
      borderColor: "rgba(0, 123, 255, 1)", // Warna biru cerah untuk border
      borderWidth: 1,
    },
  ],
};

const DashboardPage = () => {
  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="p-6 pl-16 ml-16 flex-1">
        {/* Header horizontal */}
        <div className="mb-16 flex items-center gap-4 mt-8">
          <h1 className="text-lg font-normal lowercase text-gray-700">
            selamat datang,
          </h1>
          <p className="text-2xl font-bold uppercase text-[#3D6CB9]">
            Front Office
          </p>
        </div>
        {/* Grafik dan Kolom */}
        <div className="flex flex-row gap-16 items-start">
          {/* Grafik */}
          <div className="w-[700px] bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#3D6CB9]">
              Grafik Pendapatan Bulanan
            </h2>
            <div style={{ height: "400px" }}>
              <Bar data={data} />
            </div>
          </div>

          {/* Kolom dengan Icon dan Angka */}
          <div className="flex flex-col gap-8 ml-16">
            {" "}
            {/* Memindahkan kolom sedikit ke kanan */}
            {/* Kolom Daftar Anggota */}
            <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
              <div className="p-4 bg-[#21ad11] rounded-lg">
                {" "}
                {/* Ganti rounded-full menjadi rounded-lg */}
                <FaUsers className="text-4xl text-white" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[#3D6CB9]">
                  Daftar Anggota
                </p>
                <p className="text-2xl font-bold text-[#3D6CB9]">32</p>
              </div>
            </div>
            {/* Kolom Daftar Driver */}
            <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
              <div className="p-4 bg-[#3D6CB9] rounded-lg">
                {" "}
                {/* Ganti rounded-full menjadi rounded-lg */}
                <FaPeopleCarry className="text-4xl text-white" />{" "}
                {/* Ganti dengan FaPeopleCarry */}
              </div>
              <div>
                <p className="text-xl font-semibold text-[#3D6CB9]">
                  Daftar Driver
                </p>
                <p className="text-2xl font-bold text-[#3D6CB9]">12</p>
              </div>
            </div>
            {/* Kolom Daftar Jeep */}
            <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
              <div className="p-4 bg-[#c7b70c] rounded-lg">
                {" "}
                {/* Ganti rounded-full menjadi rounded-lg */}
                <FaCar className="text-4xl text-white" />{" "}
                {/* Ganti dengan FaCar */}
              </div>
              <div>
                <p className="text-xl font-semibold text-[#3D6CB9]">
                  Daftar Jeep
                </p>
                <p className="text-2xl font-bold text-[#3D6CB9]">16</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
