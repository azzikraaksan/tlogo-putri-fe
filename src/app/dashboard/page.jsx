"use client";
import Sidebar from "/components/Sidebar.jsx";
import LoadingFunny from "/components/LoadingFunny.jsx";
import withAuth from "/src/app/lib/withAuth.jsx";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { FaUsers, FaCar, FaRegListAlt, FaPeopleCarry } from "react-icons/fa";
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
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ],
  datasets: [
    {
      label: "pemesanan",
      data: [1000, 1200, 800, 1500, 1300, 1700, 1600, 1400, 1800, 1900, 2000, 2100],
      backgroundColor: "rgba(0, 123, 255, 0.2)",
      borderColor: "rgba(0, 123, 255, 1)",
      borderWidth: 1,
    },
  ],
};

const DashboardPage = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const [jumlahAnggota, setJumlahAnggota] = useState(0);
  const [jumlahDriver, setJumlahDriver] = useState(0);
  const [jumlahJeep, setJumlahJeep] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchDataCounts = async () => {
      try {
        const token = localStorage.getItem("access_token");
  
        const meRes = await fetch("https://tpapi.siunjaya.id/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const meData = await meRes.json();
        if (meData.success && meData.data?.name) {
          setUserName(meData.data.name);
          setUserRole(meData.data.role);
        }
  
        const [anggotaRes, driverRes, jeepRes] = await Promise.all([
          fetch("https://tpapi.siunjaya.id/api/users/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://tpapi.siunjaya.id/api/users/by-role?role=DRIVER", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://tpapi.siunjaya.id/api/jeeps/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        if (!anggotaRes.ok) {
          console.error("anggotaRes error:", await anggotaRes.text());
        }        
  
        const anggotaData = await anggotaRes.json();
        const driverData = await driverRes.json();
        const jeepData = await jeepRes.json();
        console.log("Data anggota:", anggotaData);
        
        if (Array.isArray(anggotaData)) {
          setJumlahAnggota(anggotaData.length);
        } else {
          console.error("Data anggota tidak valid", anggotaData);
        }
        setJumlahDriver(driverData.data?.length || 0);
        setJumlahJeep(jeepData.data?.length || 0);
      } catch (error) {
        console.error("Gagal ambil data jumlah:", error);
      }
    };
  
    fetchDataCounts();
  }, []);
  
  if (!jumlahAnggota && !jumlahDriver && !jumlahJeep && !userName && !userRole) {
    return <LoadingFunny />;
  }

  return (
     <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 p-10 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? 290 : 70,
        }}
      >
        <div className="mb-16 flex items-center gap-2 mt-8">
          <h1 className="text-[32px] font-normal text-gray-700">Selamat datang,</h1>
          <p className="text-[32px] font-bold text-[#3D6CB9]">{userRole}</p>
        </div>
        <div className="flex flex-row ">
          <div className="w-[700px] h-110 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#3D6CB9]">
              Grafik Pemesanan
            </h2>
            <div style={{ height: "400px" }}>
              <Bar data={data} />
            </div>
          </div>

          <div className="flex flex-col gap-14 mt-10 ml-12">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="p-4 bg-[#21ad11] rounded-lg">
                <FaUsers className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#3D6CB9]">Daftar Anggota</p>
                <p className="text-[18px] font-bold text-[#3D6CB9]">{jumlahAnggota}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="p-4 bg-[#3D6CB9] rounded-lg">
                <FaPeopleCarry className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#3D6CB9]">Daftar Driver</p>
                <p className="text-[18px] font-bold text-[#3D6CB9]">{jumlahDriver}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="p-4 bg-[#c7b70c] rounded-lg">
                <FaCar className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#3D6CB9]">Daftar Jeep</p>
                <p className="text-[18px] font-bold text-[#3D6CB9]">{jumlahJeep}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
