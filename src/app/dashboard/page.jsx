"use client";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth.jsx";
import React, { useState, useEffect, useRef } from "react";
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
import label from "daisyui/components/label";

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
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ],
  datasets: [
    {
      label: "pemesanan",
      data: [
        1000, 1200, 800, 1500, 1300, 1700, 1600, 1400, 1800, 1900, 2000, 2100,
      ],
      backgroundColor: "rgba(0, 123, 255, 0.2)",
      borderColor: "rgba(0, 123, 255, 1)",
      borderWidth: 1,
    },
  ],
};

const DashboardPage = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/api/fo/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success && data.data?.name) {
          setUserName(data.data.name);
          setUserRole(data.data.role);
        }
      } catch (error) {
        console.error("Gagal ambil profil user:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6 pl-10 ml-10">
        <div className="mb-16 flex items-center gap-4 mt-8">
          <h1 className="text-[32px] font-normal text-gray-700">
            Selamat datang,
          </h1>
          <p className="text-[32px] font-bold text-[#3D6CB9]">{userRole}</p>
        </div>
        <div className="flex flex-row gap-16 items-start">
          <div className="w-[700px] h-110 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#3D6CB9]">
              Grafik Pemesanan
            </h2>
            <div style={{ height: "400px" }}>
              <Bar data={data} />
            </div>
          </div>

          <div className="flex flex-col gap-14 mt-10 ml-6">
            {" "}
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="p-4 bg-[#21ad11] rounded-lg">
                {" "}
                <FaUsers className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[#3D6CB9]">
                  Daftar Anggota
                </p>
                <p className="text-[24px] font-bold text-[#3D6CB9]">32</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="p-4 bg-[#3D6CB9] rounded-lg">
                {" "}
                <FaPeopleCarry className="text-2xl text-white" />{" "}
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[#3D6CB9]">
                  Daftar Driver
                </p>
                <p className="text-[24px] font-bold text-[#3D6CB9]">12</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="p-4 bg-[#c7b70c] rounded-lg">
                {" "}
                <FaCar className="text-2xl text-white" />{" "}
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[#3D6CB9]">
                  Daftar Jeep
                </p>
                <p className="text-[24px] font-bold text-[#3D6CB9]">16</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
