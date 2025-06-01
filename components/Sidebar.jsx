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
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingFunny from "/components/LoadingFunny.jsx";

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const [isPemesananOpen, setIsPemesananOpen] = useState(false);
  const [isOperasionalOpen, setIsOperasionalOpen] = useState(false);
  const [isAkuntansiOpen, setIsAkuntansiOpen] = useState(false);
  const [isAkuntansi2Open, setIsAkuntansi2Open] = useState(false);
  const [isPenggajianOpen, setIsPenggajianOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role) {
      setUserRole(role);
    }

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
      pathname.startsWith("/dashboard/akuntansi/presensi")
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

  // const handleLogout = () => {
  //   localStorage.removeItem("access_token");
  //   localStorage.removeItem("token_exp");
  //   router.push("/");
  // };

  // const handleLogout = async () => {
  //   const token = localStorage.getItem("access_token");

  //   const confirmLogout = window.confirm(
  //     "Apakah kamu yakin ingin keluar dari halaman ini?"
  //   );
  //   if (!confirmLogout) return; // user batal

  //   try {
  //     const response = await fetch("http://localhost:8000/api/auth/logout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ token }), // token dikirim di body
  //     });

  //     if (!response.ok) {
  //       throw new Error("Logout gagal");
  //     }

  //     // Bersihkan token
  //     localStorage.removeItem("access_token");
  //     localStorage.removeItem("token_exp");

  //     // Redirect ke halaman login
  //     router.push("/");
  //   } catch (error) {
  //     console.error("Gagal logout:", error);
  //   }
  // };

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) throw new Error("Logout gagal");

      localStorage.removeItem("access_token");
      localStorage.removeItem("token_exp");
      router.push("/");
    } catch (error) {
      console.error("Gagal logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true); // buka popup konfirmasi
  };

  // if (loading) {
  //   return (
  //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-90">
  //       <div className="shadow-md p-6 rounded-lg text-center">
  //         <p className="text-lg font-semibold text-gray-800 mb-2">Loading...</p>
  //         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
  //       </div>
  //     </div>
  //   );
  // }
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-90">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-[spin_0.5s_linear_infinite] mx-auto"></div>
          <p className="text-blue-600 text-lg font-semibold animate-pulse">
            Logging Out...
          </p>
        </div>
      </div>
    );
  }
  // if (loading) {
  //   return <LoadingFunny className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-90" />;
  // }
  return (
    <>
      {/* Tombol Toggle */}
      <button
        className="fixed top-4 left-4 z-50 text-white p-2 rounded-md cursor-pointer"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-[300px]" : "w-[64px]"
          // } min-h-screen overflow-auto bg-[#3D6CB9] text-white p-4 flex flex-col justify-between `}
        } min-h-screen overflow-y-auto bg-[#3D6CB9] text-white pl-4 flex flex-col justify-between`}
      >
        <div className="flex-1 overflow-y-auto max-h-screen pr-2">
          <div
            className={`flex justify-center mb-6 ${isSidebarOpen ? "mt-10" : "mt-14"}`}
          >
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-[100px] h-auto"
            />
          </div>

          {userRole === "Front Office" && (
            <ul className={`space-y-4`}>
              <div className="mb-4 mt-4">
                <Link
                  href="/dashboard"
                  title="Dashboard"
                  // className={`flex items-center pl-4 py-2 rounded-[6px] w-full hover:bg-blue-400 ${
                  //   pathname === "/dashboard" ? "bg-blue-300" : ""
                  // }`}
                  className={`
  flex items-center px-2 pl-4 py-2 text-white hover:bg-blue-400 rounded-[6px] cursor-pointer
  ${isSidebarOpen ? "w-full pr-4" : "w-[32px]"}
  ${pathname === "/dashboard" ? "bg-blue-300" : ""}
`}

                  //                   className={`
                  //   flex items-center px-2 pl-4 py-2 text-white hover:bg-blue-400 rounded-[6px] cursor-pointer
                  //   ${
                  //     pathname === "/dashboard"
                  //       ? "w-[275px] pr-4 hover:bg-blue-400"
                  //       : "w-[32px] hover:bg-blue-400"
                  //   }
                  // `}
                  // className={`flex items-center rounded-[6px] py-2 ${
                  //   pathname === "/dashboard" ? "bg-blue-300" : ""
                  // } ${
                  //   isSidebarOpen
                  //     ? "pl-4 pr-4 w-full hover:bg-blue-400"
                  //     : "w-[64px] justify-center hover:bg-blue-400"
                  // }`}
                >
                  <div className="w-6 flex justify-center items-center -ml-3 mr-3">
                    <Compass size={20} />
                  </div>
                  <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                    Dashboard
                  </span>
                </Link>
              </div>
              <li>
                <button
                  onClick={() => {
                    if (!isSidebarOpen) {
                      setSidebarOpen(true);
                      setIsPemesananOpen(true);
                      setIsOperasionalOpen(false);
                      setIsAkuntansiOpen(false);
                      setIsPenggajianOpen(false);
                      setIsGenerateOpen(false);
                    } else {
                      setIsPemesananOpen((prev) => {
                        const nextState = !prev;
                        setIsOperasionalOpen(false);
                        setIsAkuntansiOpen(false);
                        setIsPenggajianOpen(false);
                        setIsGenerateOpen(false);
                        return nextState;
                      });
                    }
                  }}
                  title="Pemesanan"
                  className={`
    flex items-center justify-between pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer
    ${
      isSidebarOpen
        ? "w-full pl-4 hover:bg-blue-400"
        : "w-[32px] hover:bg-blue-400"
    }
  `}
                >
                  <div className="flex items-center flex-1">
                    <div className="w-6 flex justify-center items-center -ml-3 mr-3">
                      <CalendarCheck size={20} />
                    </div>
                    <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                      Pemesanan
                    </span>
                  </div>

                  {isPemesananOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {/* {isSidebarOpen && isPemesananOpen && ( */}
                <div
                  className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    isSidebarOpen && isPemesananOpen
                      ? "max-h-40 opacity-100 mt-2"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  <ul className="pl-8 mt-2 space-y-2">
                    <li>
                      <Link
                        href="/dashboard/pemesanan/daftar-pesanan"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith(
                            "/dashboard/pemesanan/daftar-pesanan"
                          )
                            ? "bg-blue-300"
                            : "[w-32px]"
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
                </div>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!isSidebarOpen) {
                      setSidebarOpen(true);
                      setIsOperasionalOpen(true);
                      setIsPemesananOpen(false);
                      setIsAkuntansiOpen(false);
                      setIsPenggajianOpen(false);
                      setIsGenerateOpen(false);
                    } else {
                      setIsOperasionalOpen((prev) => {
                        const nextState = !prev;
                        setIsPemesananOpen(false);
                        setIsAkuntansiOpen(false);
                        setIsPenggajianOpen(false);
                        setIsGenerateOpen(false);
                        return nextState;
                      });
                    }
                  }}
                  title="Operasional"
                  className={`
    flex items-center justify-between pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer
    ${
      isSidebarOpen
        ? "w-full pl-4 hover:bg-blue-400"
        : "w-[32px] hover:bg-blue-400"
    }
  `}
                >
                  <div className="flex items-center flex-1">
                    <div className="w-6 flex justify-center items-center -ml-3 mr-3">
                      <ClipboardList size={20} />
                    </div>
                    <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                      Operasional
                    </span>
                  </div>

                  {isOperasionalOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                <div
                  className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    isSidebarOpen && isOperasionalOpen
                      ? "max-h-[500px] opacity-100 mt-2"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  <ul className="pl-8 mt-2 space-y-2">
                    <li>
                      <Link
                        href="/dashboard/operasional/penjadwalan"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith(
                            "/dashboard/operasional/penjadwalan"
                          )
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
                        href="/dashboard/operasional/ticketing"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith(
                            "/dashboard/operasional/ticketing"
                          )
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
                        href="/dashboard/operasional/anggota"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith("/dashboard/operasional/anggota")
                            ? "bg-blue-300"
                            : ""
                        }`}
                      >
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
                </div>
              </li>

              <li>
                <button
                  onClick={() => {
                    if (!isSidebarOpen) {
                      setSidebarOpen(true);
                      setIsOperasionalOpen(false);
                      setIsPemesananOpen(false);
                      setIsAkuntansiOpen(false);
                      setIsPenggajianOpen(true);
                      setIsGenerateOpen(false);
                    } else {
                      setIsPenggajianOpen((prev) => {
                        const nextState = !prev;
                        setIsPemesananOpen(false);
                        setIsAkuntansiOpen(false);
                        setIsOperasionalOpen(false);
                        setIsGenerateOpen(false);
                        return nextState;
                      });
                    }
                  }}
                  className={`
    flex items-center justify-between pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer
    ${
      isSidebarOpen
        ? "w-full pl-4 hover:bg-blue-400"
        : "w-[32px] hover:bg-blue-400"
    }
  `}
                  title="Penggajian"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-6 flex justify-center items-center -ml-3 mr-3">
                      <Wallet size={20} />
                    </div>
                    <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                      Penggajian
                    </span>
                  </div>
                  {isPenggajianOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                <div
                  className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    isSidebarOpen && isPenggajianOpen
                      ? "max-h-40 opacity-100 mt-2"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
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
                          pathname.startsWith(
                            "/dashboard/penggajian/laporan-gaji"
                          )
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
                </div>
              </li>
              <li>
                <button
                  // onClick={() => {
                  //   if (!isSidebarOpen) {
                  //     setSidebarOpen(true);
                  //     setIsAkuntansiOpen(true);
                  //   } else {
                  //     setIsAkuntansiOpen((prev) => !prev);
                  //   }
                  // }}
                  onClick={() => {
                    if (!isSidebarOpen) {
                      setSidebarOpen(true);
                      setIsOperasionalOpen(false);
                      setIsPemesananOpen(false);
                      setIsAkuntansiOpen(true);
                      setIsPenggajianOpen(false);
                      setIsGenerateOpen(false);
                    } else {
                      setIsAkuntansiOpen((prev) => {
                        const nextState = !prev;
                        setIsPemesananOpen(false);
                        setIsPenggajianOpen(false);
                        setIsOperasionalOpen(false);
                        setIsGenerateOpen(false);
                        return nextState;
                      });
                    }
                  }}
                  // className="flex items-center justify-between w-full pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer"
                  className={`
    flex items-center justify-between pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer
    ${
      isSidebarOpen
        ? "w-full pl-4 hover:bg-blue-400"
        : "w-[32px] hover:bg-blue-400"
    }
  `}
                  title="Akuntansi"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-6 flex justify-center items-center -ml-3 mr-3">
                      <FileBarChart size={20} />
                    </div>
                    <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                      Akuntansi
                    </span>
                  </div>
                  {isAkuntansiOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                <div
                  className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    isSidebarOpen && isAkuntansiOpen
                      ? "max-h-40 opacity-100 mt-2"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
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
                          pathname.startsWith(
                            "/dashboard/akuntansi/pengeluaran"
                          )
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
                    <li>
                      <Link
                        href="/dashboard/akuntansi/laporan-keuangan"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith(
                            "/dashboard/akuntansi/laporan-keuangan"
                          )
                            ? "bg-blue-300"
                            : ""
                        }`}
                      >
                        <img
                          src="/images/laporan-keuangan.png"
                          alt="laporan-keuangan"
                          className="w-[20px] h-auto mr-2"
                        />
                        Laporan Keuangan
                      </Link>
                    </li>

                    {/* Nested Dropdown: Laporan Keuangan */}
                    {/* <li>
                      <button
                        onClick={() => setIsAkuntansi2Open(!isAkuntansi2Open)}
                        className="flex items-center justify-between w-full pl-2 py-1 rounded-[6px] hover:bg-blue-400 cursor-pointer"
                      >
                        <div className="flex items-center flex-1">
                          <img
                            src="/images/laporan-keuangan.png"
                            alt="laporan-keuangan"
                            className="w-[20px] h-auto mr-2"
                          />
                          Laporan Keuangan
                        </div>
                      </button>
                    </li> */}

                    <li>
                      <Link
                        href="/dashboard/akuntansi/presensi"
                        className={`block py-1 px-2 rounded hover:bg-blue-400 flex items-center ${
                          pathname.startsWith("/dashboard/akuntansi/presensi")
                            ? "bg-blue-300"
                            : ""
                        }`}
                      >
                        <img
                          src="/images/presensi.png"
                          alt="presensi"
                          className="w-[20px] h-auto mr-2"
                        />
                        Presensi
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <button
                  // onClick={() => {
                  //   if (!isSidebarOpen) {
                  //     setSidebarOpen(true);
                  //     setIsGenerateOpen(true);
                  //   } else {
                  //     setIsGenerateOpen((prev) => !prev);
                  //   }
                  // }}
                  onClick={() => {
                    if (!isSidebarOpen) {
                      setSidebarOpen(true);
                      setIsOperasionalOpen(false);
                      setIsPemesananOpen(false);
                      setIsAkuntansiOpen(true);
                      setIsPenggajianOpen(false);
                      setIsGenerateOpen(true);
                    } else {
                      setIsGenerateOpen((prev) => {
                        const nextState = !prev;
                        setIsPemesananOpen(false);
                        setIsPenggajianOpen(false);
                        setIsOperasionalOpen(false);
                        setIsAkuntansiOpen(false);
                        return nextState;
                      });
                    }
                  }}
                  // className="flex items-center justify-between w-full pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer"
                  className={`
    flex items-center justify-between pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer
    ${
      isSidebarOpen
        ? "w-full pl-4 hover:bg-blue-400"
        : "w-[32px] hover:bg-blue-400"
    }
  `}
                  title="AI Generate Content"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-6 flex justify-center items-center -ml-3 mr-3">
                      <Sparkles size={20} />
                    </div>
                    <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                      AI Generate Content
                    </span>
                  </div>
                  {isGenerateOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                <div
                  className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    isSidebarOpen && isGenerateOpen
                      ? "max-h-40 opacity-100 mt-2"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
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
                </div>
              </li>
            </ul>
          )}

          {userRole === "Owner" && (
            <ul className="pl-8 mt-2 space-y-2">
              <li>
                <div className="mb-4 mt-4">
                  <Link
                    href="/dashboard/penggajian/penggajian-utama"
                    title="Gaji"
                    className={`
  flex items-center px-2 pl-4 py-2 text-white hover:bg-blue-400 rounded-[6px] cursor-pointer
  ${isSidebarOpen ? "w-full pr-4" : "w-[32px]"}
  ${pathname === "/dashboard/penggajian/penggajian-utama" ? "bg-blue-300" : ""}
`}
                  >
                    <img
                      src="/images/gaji.png"
                      alt="gaji"
                      className="w-[20px] h-auto mr-2"
                    />
                    <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                      Gaji
                    </span>
                  </Link>
                </div>
                <div className="mb-4 mt-4">
                  <Link
                    href="/dashboard/penggajian/laporan-gaji"
                    title="Gaji"
                    className={`
  flex items-center px-2 pl-4 py-2 text-white hover:bg-blue-400 rounded-[6px] cursor-pointer
  ${isSidebarOpen ? "w-full pr-4" : "w-[32px]"}
  ${pathname === "/dashboard/penggajian/laporan-gaji" ? "bg-blue-300" : ""}
`}
                  >
                    <img
                      src="/images/laporan-penggajian.png"
                      alt="laporan-penggajian"
                      className="w-[20px] h-auto mr-2"
                    />
                    <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                      Laporan Gaji
                    </span>
                  </Link>
                </div>
              </li>
              {/* <li>
                <button
                  onClick={() => {
                    if (!isSidebarOpen) {
                      setSidebarOpen(true);
                      setIsPenggajianOpen(true);
                    } else {
                      setIsPenggajianOpen((prev) => !prev);
                    }
                  }}
                  className={`
    flex items-center justify-between pl-4 py-2 rounded-[6px] hover:bg-blue-400 cursor-pointer
    ${
      isSidebarOpen
        ? "w-full pl-4 hover:bg-blue-400"
        : "w-[32px] hover:bg-blue-400"
    }
  `}
                  title="Operasional"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-6 flex justify-center items-center -ml-3 mr-3">
                      <Wallet size={20} />
                    </div>
                    <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                      Penggajian
                    </span>
                  </div>
                  {isPenggajianOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {isSidebarOpen && isPenggajianOpen && (
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
                          pathname.startsWith(
                            "/dashboard/penggajian/laporan-gaji"
                          )
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
              </li> */}
            </ul>
          )}
          <div className="mb-4 mt-4">
            <button
              onClick={handleLogoutClick}
              //           className={`flex items-center px-2 gap-3 py-2 text-white hover:bg-blue-400 rounded-[6px] cursor-pointer
              // ${isSidebarOpen ? "w-[275px] pr-4 hover:bg-blue-400" : "w-[32px] hover:bg-blue-400"}`}
              className={`
  flex items-center px-2 py-2 gap-3 text-white hover:bg-blue-400 rounded-[6px] cursor-pointer
  ${isSidebarOpen ? "w-full pr-4" : "w-[32px]"}
`}
            >
              <LogOut size={20} />
              <span className={`${isSidebarOpen ? "inline" : "hidden"}`}>
                Logout
              </span>
            </button>

            {/* <button
              onClick={handleLogout}
              className={`
    flex items-center px-2 gap-3 py-2 text-white hover:bg-blue-400 rounded-[6px] cursor-pointer
    ${
      isSidebarOpen
        ? "w-[250px] pr-4 hover:bg-blue-400"
        : "w-[32px] hover:bg-blue-400"
    }
  `}
            >
              <LogOut size={20} />
              <span className={`  ${isSidebarOpen ? "inline" : "hidden"}`}>
                Logout
              </span>
            </button> */}
          </div>
        </div>
      </aside>
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "300px",
              textAlign: "center",
            }}
          >
            <p>Apakah kamu yakin ingin keluar dari halaman ini?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-[10px] hover:bg-gray-400 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="px-4 py-2 bg-red-500 rounded-[10px] hover:bg-red-600 text-white cursor-pointer"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
