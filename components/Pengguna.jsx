"use client";
import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

const UserMenu = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/api/users/me", {
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
    <div className="absolute top-4 right-4 z-50 flex items-center gap-4 text-[#3D6CB9]">
      <Link
        href="/dashboard/profil"
        className="flex items-center gap-4 hover:opacity-80 transition"
      >
        <FaUserCircle className="text-4xl" />

        <div className="h-10 border-l border-[#858585]"></div>

        <div className="flex flex-col text-left">
          <span className="text-[16px] font-semibold text-gray-800">
            {userName}
          </span>
          <span className="text-sm text-gray-500">{userRole}</span>
        </div>
      </Link>
    </div>
  );
};

export default UserMenu;