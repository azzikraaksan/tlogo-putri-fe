"use client";
import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

const UserNavbar = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  // 1. Tambahkan state untuk loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false); // Hentikan loading jika tidak ada token
        return;
      }

      try {
        const res = await fetch("https://tpapi.siunjaya.id/api/users/me", {
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
      } finally {
        // 2. Set loading ke false setelah proses fetch selesai
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 3. Hapus blok `if (!userName && !userRole)` yang lama
  // ...

  // 4. Gunakan state `loading` untuk menampilkan skeleton atau konten asli
  return (
    <div className="absolute top-4 right-4 flex items-center gap-4 text-[#3D6CB9]">
      {loading ? (
        // Tampilan Skeleton saat loading
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-gray-300"></div> {/* Placeholder ikon */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-24 rounded-md bg-gray-300"></div> {/* Placeholder nama */}
            <div className="h-4 w-16 rounded-md bg-gray-300"></div> {/* Placeholder role */}
          </div>
        </div>
      ) : (
        // Tampilan asli setelah data dimuat
        <Link
          href="/dashboard/profil"
          className="flex items-center gap-4 hover:opacity-80 transition"
        >
          <FaUserCircle className="text-4xl" />
          <div className="flex flex-col text-left">
            {/* Beri nilai default jika nama/role kosong setelah load */}
            <span className="text-[16px] font-semibold text-gray-800">
              {userName || "Pengguna"}
            </span>
            <span className="text-sm text-gray-500">
              {userRole || "Role"}
            </span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default UserNavbar;