"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  Archive,
  CalendarCheck,
  ClipboardList,
  Wallet,
  FileBarChart,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isPemesananOpen, setIsPemesananOpen] = useState(false);
  const [isOperasionalOpen, setIsOperasionalOpen] = useState(false);
  const [isAkuntansiOpen, setIsAkuntansiOpen] = useState(false);
  const [isAkuntansi2Open, setIsAkuntansi2Open] = useState(false);
  const [isPenggajianOpen, setIsPenggajianOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/dashboard/pemesanan/daftar-pesanan")) {
      setIsPemesananOpen(true);
    } else {
      setIsPemesananOpen(false);
    }

    if (
      pathname.startsWith("/dashboard/operasional/penjadwalan") ||
      pathname.startsWith("/dashboard/operasional/kelola-driver") ||
      pathname.startsWith("/dashboard/operasional/ticketing") ||
      pathname.startsWith("/dashboard/operasional/anggota") ||
      pathname.startsWith("/dashboard/operasional/jeep")
    ) {
      setIsOperasionalOpen(true);
    } else {
      setIsOperasionalOpen(false);
    }

    if (
      pathname.startsWith("/dashboard/akuntansi/pemasukan") ||
      pathname.startsWith("/dashboard/akuntansi/pengeluaran") ||
      pathname.startsWith("/dashboard/akuntansi/laporan-keuangan") ||
      pathname.startsWith("/dashboard/akuntansi/data-driver")
    ) {
      setIsAkuntansiOpen(true);
    } else {
      setIsAkuntansiOpen(false);
    }

    if (
      pathname.startsWith("/dashboard/akuntansi/harian") ||
      pathname.startsWith("/dashboard/akuntansi/bulanan") ||
      pathname.startsWith("/dashboard/akuntansi/triwulan") ||
      pathname.startsWith("/dashboard/akuntansi/tahunan")
    ) {
      setIsAkuntansi2Open(true);
    } else {
      setIsAkuntansi2Open(false);
    }

    if (
      pathname.startsWith("/dashboard/penggajian/penggajian-utama") ||
      pathname.startsWith("/dashboard/penggajian/laporan-gaji")
    ) {
      setIsPenggajianOpen(true);
    } else {
      setIsPenggajianOpen(false);
    }

    if (
      pathname.startsWith("/dashboard/ai-generate/generate") ||
      pathname.startsWith("/dashboard/ai-generate/draft")
    ) {
      setIsGenerateOpen(true);
    } else {
      setIsGenerateOpen(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_exp");
    router.push("/");
  };

  return (
    // <aside className="w-[275px] min-h-screen overflow-auto bg-[#3D6CB9] text-white p-4 flex flex-col justify-between">
    <aside className="w-[275px] min-h-screen overflow-auto bg-[#3D6CB9] text-white p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-center mt-10 mb-6">
          <img src="/images/logo.png" alt="Logo" className="w-[100px] h-auto" />
        </div>

        <ul>
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center pl-4 py-2 rounded-[6px] hover:bg-blue-400 ${
                pathname === "/dashboard" ? "bg-blue-300" : ""
              }`}
            >
              <Compass size={20} className="mr-2" />
              Dashboard
            </Link>
          </li>
          <br />
          <li>
            <button
              onClick={() => setIsPemesananOpen(!isPemesananOpen)}
              className="flex items-center justify-between w-full pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer"
            >
              <div className="flex items-center">
                <CalendarCheck size={20} className="mr-2" />
                Pemesanan
              </div>
              {isPemesananOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {isPemesananOpen && (
              <ul className="pl-8 mt-2 space-y-2">
                <li>
                  <Link
                    href="/dashboard/pemesanan/daftar-pesanan"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/pemesanan/daftar-pesanan")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/daftar-pesanan.png"
                      alt="daftar-pesanan"
                      className="w-[20px] h-auto mr-2"
                    />
                    Daftar Pesanan
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <br />
          <li>
            <button
              onClick={() => setIsOperasionalOpen(!isOperasionalOpen)}
              className="flex items-center justify-between w-full pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer"
            >
              <div className="flex items-center">
                <ClipboardList size={20} className="mr-2" />
                Operasional
              </div>
              {isOperasionalOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {isOperasionalOpen && (
              <ul className="pl-8 mt-2 space-y-2">
                <li>
                  <Link
                    href="/dashboard/operasional/penjadwalan"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/operasional/penjadwalan")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/penjadwalan.png"
                      alt="penjadwalan"
                      className="w-[20px] h-auto mr-2"
                    />
                    Penjadwalan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/operasional/kelola-driver"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith(
                        "/dashboard/operasional/kelola-driver"
                      )
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/kelola-driver.png"
                      alt="kelola-driver"
                      className="w-[20px] h-auto mr-2"
                    />
                    Kelola Driver
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/operasional/ticketing"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/operasional/ticketing")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/ticketing.png"
                      alt="ticketing"
                      className="w-[20px] h-auto mr-2"
                    />
                    Ticketing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/operasional/anggota"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/operasional/anggota")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    {/* <img src="/images/daftar-anggota.png" alt="daftar-anggota" className="w-[20px] h-auto mr-2" /> */}
                    <Users size={20} className="mr-2 w-[20px] h-auto" />
                    Daftar Anggota
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/operasional/jeep"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/operasional/jeep")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/daftar-jeep.png"
                      alt="daftar-jeep"
                      className="w-[20px] h-auto mr-2"
                    />
                    Daftar Jeep
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <br />
          <li>
            <button
              onClick={() => setIsAkuntansiOpen(!isAkuntansiOpen)}
              className="flex items-center justify-between w-full pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer"
            >
              <div className="flex items-center">
                <FileBarChart size={20} className="mr-2" />
                Akuntansi
              </div>
              {isAkuntansiOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {isAkuntansiOpen && (
              <ul className="pl-8 mt-2 space-y-2">
                <li>
                  <Link
                    href="/dashboard/akuntansi/pemasukan"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/akuntansi/pemasukan")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/pemasukan.png"
                      alt="pemasukan"
                      className="w-[20px] h-auto mr-2"
                    />
                    Pemasukan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/akuntansi/pengeluaran"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/akuntansi/pengeluaran")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/pengeluaran.png"
                      alt="pengeluaran"
                      className="w-[20px] h-auto mr-2"
                    />
                    Pengeluaran
                  </Link>
                </li>
                <button
                  onClick={() => setIsAkuntansi2Open(!isAkuntansi2Open)}
                  className="flex items-center justify-between w-full pl-2 py-1 rounded-[6px] hover:bg-blue-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    <img
                      src="/images/laporan-keuangan.png"
                      alt="laporan-keuangan"
                      className="w-[20px] h-auto mr-2"
                    />
                    Laporan Keuangan
                  </div>
                  {isAkuntansi2Open ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                </button>
                {isAkuntansi2Open && (
                  <ul className="pl-8 mt-2 space-y-2">
                    <li>
                      <Link
                        href="/dashboard/akuntansi/laporan-keuangan/harian"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith(
                            "/dashboard/akuntansi/laporan-keuangan/harian"
                          )
                            ? "bg-blue-300"
                            : ""
                        }`}
                      >
                        Harian
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/akuntansi/laporan-keuangan/bulanan"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith(
                            "/dashboard/akuntansi/laporan-keuangan/bulanan"
                          )
                            ? "bg-blue-300"
                            : ""
                        }`}
                      >
                        Bulanan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/akuntansi/laporan-keuangan/triwulan"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith(
                            "/dashboard/akuntansi/laporan-keuangan/triwulan"
                          )
                            ? "bg-blue-300"
                            : ""
                        }`}
                      >
                        Triwulan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/akuntansi/laporan-keuangan/tahunan"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith(
                            "/dashboard/akuntansi/laporan-keuangan/tahunan"
                          )
                            ? "bg-blue-300"
                            : ""
                        }`}
                      >
                        Tahunan
                      </Link>
                    </li>
                  </ul>
                )}
                <li>
                  <Link
                    href="/dashboard/akuntansi/data-driver"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/akuntansi/data-driver")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/data-driver.png"
                      alt="data-driver"
                      className="w-[20px] h-auto mr-2"
                    />
                    Data Driver
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <br />
          <li>
            <button
              onClick={() => setIsPenggajianOpen(!isPenggajianOpen)}
              className="flex items-center justify-between w-full pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer"
            >
              <div className="flex items-center">
                <Wallet size={20} className="mr-2" />
                Penggajian
              </div>
              {isPenggajianOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {isPenggajianOpen && (
              <ul className="pl-8 mt-2 space-y-2">
                <li>
                  <Link
                    href="/dashboard/penggajian/penggajian-utama"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith(
                        "/dashboard/penggajian/penggajian-utama"
                      )
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/gaji.png"
                      alt="gaji"
                      className="w-[20px] h-auto mr-2"
                    />
                    Gaji
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/penggajian/laporan-gaji"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/penggajian/laporan-gaji")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/laporan-penggajian.png"
                      alt="laporan-penggajian"
                      className="w-[20px] h-auto mr-2"
                    />
                    Laporan Gaji
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <br />
          <li>
            <button
              onClick={() => setIsGenerateOpen(!isGenerateOpen)}
              className="flex items-center justify-between w-full pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer"
            >
              <div className="flex items-center">
                <Sparkles size={20} className="mr-2" />
                AI Generate Content
              </div>
              {isGenerateOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {isGenerateOpen && (
              <ul className="pl-8 mt-2 space-y-2">
                <li>
                  <Link
                    href="/dashboard/ai-generate/generate"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/ai-generate/generate")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <img
                      src="/images/generate.png"
                      alt="generate"
                      className="w-[20px] h-auto mr-2"
                    />
                    AI Generate Content
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/ai-generate/draft"
                    className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                      pathname.startsWith("/dashboard/ai-generate/draft")
                        ? "bg-blue-300"
                        : ""
                    }`}
                  >
                    <Archive size={20} className="mr-2 w-[20px] h-auto" />
                    Draft
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <br />
        </ul>
      </div>

      <div className="mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center pl-4 py-2 text-white hover:bg-blue-400 rounded-[6px] w-full cursor-pointer"
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
