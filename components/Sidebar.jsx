"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div>
      <aside className="w-50 h-screen bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">LOGO</h2><br />
        <ul>
          <li>
            <Link
              href="/dashboard"
              className={pathname === "/dashboard" ? "font-bold" : ""}
            >
              Dashboard
            </Link>
          </li><br /><br />
          <li>
            <Link
              href="/profile"
              className={pathname === "/penjadwalan" ? "font-bold" : ""}
            >
              Penjadwalan
            </Link>
          </li><br />
          <li>
            <Link
              href="/settings"
              className={pathname === "/daftar_anggota" ? "font-bold" : ""}
            >
              Daftar Anggota
            </Link>
          </li><br />
          <li>
            <Link
              href="/settings"
              className={pathname === "/settings" ? "font-bold" : ""}
            >
              Daftar Jeep
            </Link>
          </li><br />
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;


