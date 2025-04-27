"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import Link from "next/link";

const UserMenu = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="absolute top-4 right-4 z-50 flex items-center gap-4 text-[#3D6CB9]"
      ref={menuRef}
    >
      <FaUserCircle className="text-4xl cursor-default" />

      <div className="h-10 border-l border-[#858585]"></div>

      <div className="flex flex-col text-left">
        <span className="text-[16px] font-semibold text-gray-800">
          {userName}
        </span>
        <span className="text-sm text-gray-500">{userRole}</span>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[#3D6CB9] cursor-pointer"
      >
        <FaChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48 text-sm z-50">
          <Link
            href="/dashboard/profil"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profil
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

