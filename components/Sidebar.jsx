"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div>
      <aside className="w-[240px] h-screen bg-[#3D6CB9] text-white p-4">
        {/* <h2 className="text-xl font-bold mb-4">LOGO</h2><br /> */}
        <div className="flex justify-center mt-10">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-30 h-auto"
          />
        </div><br />
        <ul>
          <li>
            <Link
              href="/dashboard_fo"
              className={pathname === "/dashboard_fo" ? "font-bold" : ""}
            >
              Dashboard
            </Link>
          </li>
          <br />
          <br />
          <li>
            <Link
              href="/dashboard_fo/penjadwalan"
              className={
                pathname.startsWith("/dashboard_fo/penjadwalan")
                  ? "font-bold"
                  : ""
              }
            >
              Penjadwalan
            </Link>
          </li>
          <br />
          <li>
            <Link
              href="/daftar_anggota"
              className={pathname === "/daftar_anggota" ? "font-bold" : ""}
            >
              Daftar Anggota
            </Link>
          </li>
          <br />
          <li>
            <Link
              href="/daftar_jeep"
              className={pathname === "/daftar_jeep" ? "font-bold" : ""}
            >
              Daftar Jeep
            </Link>
          </li>
          <br />
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
