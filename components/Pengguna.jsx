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

  if (!userName && !userRole) { 
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-red bg-opacity-75">
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">Loading...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

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