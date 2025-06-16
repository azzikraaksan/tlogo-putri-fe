"use client";

import { useEffect, useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Archive, RefreshCw } from "lucide-react";
import Hashids from "hashids";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatNomorWA = (no) => no.replace(/^0/, "62");

const DaftarPesanan = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Baru");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshingItemId, setRefreshingItemId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [remainingPayment, setRemainingPayment] = useState(null);
  const [countdownText, setCountdownText] = useState("");
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");

  const refreshOrders = (data) => {
    setOrders(data);
  };

  const handleRefreshList = async () => {
    try {
      const res = await fetch("https://tpapi.siunjaya.id/api/bookings");
      const data = await res.json();
      refreshOrders(data);
    } catch (error) {
      console.error("Gagal memperbarui daftar:", error);
      toast.error("Gagal memuat ulang daftar pesanan.");
    }
  };

  const handleSyncStatus = async (orderId, bookingId) => {
    setRefreshingItemId(bookingId);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login kembali.");
        return;
      }
      const res = await fetch(`https://tpapi.siunjaya.id/api/payment/sync-status/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Gagal menyinkronkan status.');
      }
      toast.success(result.message || 'Status berhasil disinkronkan!');
      await handleRefreshList();
    } catch (error) {
      console.error("Gagal sinkronisasi status:", error);
      toast.error(error.message);
    } finally {
      setRefreshingItemId(null);
    }
  };

  useEffect(() => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  }, [statusFilter, searchTerm, showHistory]);

  useEffect(() => {
    setLoading(true);
    handleRefreshList().finally(() => setLoading(false));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchRemainingPayment = async () => {
      if (!selectedOrder || !selectedOrder.order_id || selectedOrder.payment_status !== "unpaid" || selectedOrder.payment_type === "full") {
        setRemainingPayment(null);
        return;
      }
      setRemainingPayment(null);

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) throw new Error("Token otorisasi tidak ditemukan.");
          const res = await fetch(`https://tpapi.siunjaya.id/api/orders/${selectedOrder.order_id}/remaining-payment`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error(`Gagal fetch, status: ${res.status}`);
          const text = await res.text();
          if (!text) throw new Error("Response kosong dari server");
          const data = JSON.parse(text);
          setRemainingPayment(data.remaining_amount);
          return;
        } catch (error) {
          console.error(`Percobaan ke-${attempt} gagal:`, error.message);
          if (attempt === 3) {
            setRemainingPayment(null);
          } else {
            await delay(2000);
          }
        }
      }
    };

    const calculateAndSetMessages = () => {
      if (selectedOrder) {
        const tourDate = new Date(selectedOrder.tour_date);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        tourDate.setHours(0, 0, 0, 0);
        const timeDiff = tourDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (selectedOrder.payment_status === "unpaid") {
          setPaymentStatusMessage("");
          if (daysDiff > 5) {
            setCountdownText("");
          } else if (daysDiff >= 0 && daysDiff <= 5) {
            setCountdownText(`🚨 Sisa ${daysDiff} hari lagi menuju tur! Harap segera lunasi pembayaran.`);
          } else if (daysDiff < 0) {
            if (selectedOrder.booking_status !== "cancel" && selectedOrder.booking_status !== "expire") {
              setCountdownText(`⚠️ Tanggal tur telah terlewat (${Math.abs(daysDiff)} hari lalu) dan pembayaran masih belum lunas.`);
            } else {
              setCountdownText("");
            }
          }
        } else if (selectedOrder.payment_status === "paid") {
          setCountdownText("");
          setRemainingPayment(null);
          setPaymentStatusMessage("Pembayaran telah lunas.");
        } else {
          setCountdownText("");
          setPaymentStatusMessage("");
        }
      } else {
        setCountdownText("");
        setRemainingPayment(null);
        setPaymentStatusMessage("");
      }
    };

    if (isModalOpen && selectedOrder) {
      calculateAndSetMessages();
      fetchRemainingPayment();
    } else {
      setCountdownText("");
      setRemainingPayment(null);
      setPaymentStatusMessage("");
    }
  }, [selectedOrder, isModalOpen]);

  if (!isMounted) return null;

  const handleArchive = async (item) => {
    const tourDate = new Date(item.tour_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    tourDate.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const isSpecialCaseForArchiveRestriction =
      (item.booking_status === "pending" || item.booking_status === "settlement") &&
      (tourDate <= tomorrow);

    if (isSpecialCaseForArchiveRestriction) {
      alert("Pesanan ini tidak dapat diarsipkan karena sudah H-1 atau kurang dari tanggal tur dan statusnya Pending/Settlement.");
      return;
    }

    if (item.booking_status !== "expire") {
      const confirmArchive = confirm("Apakah Anda yakin ingin mengarsipkan pesanan ini? Status pesanan akan menjadi 'cancel'.");
      if (!confirmArchive) {
        return;
      }
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Token tidak ditemukan.");
        return;
      }
      const res = await fetch(`https://tpapi.siunjaya.id/api/bookings/${item.booking_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ booking_status: "cancel" }),
      });
      if (!res.ok) {
        alert(`Gagal mengarsipkan pesanan. Status: ${res.status}`);
        return;
      }
      const updated = await fetch("https://tpapi.siunjaya.id/api/bookings");
      const updatedData = await updated.json();
      refreshOrders(updatedData);
    } catch (error) {
      alert("Terjadi kesalahan jaringan saat mengarsipkan.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredData = orders
    .filter((item) => {
      if (showHistory) return item.booking_status === "cancel";
      return item.booking_status !== "cancel";
    })
    .filter((item) => {
      const matchesSearch =
        (item.order_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.created_at || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer_phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      if (showHistory) return matchesSearch;
      let matchesStatus = false;
      if (statusFilter === "Baru") matchesStatus = item.created_at?.split("T")[0] === today;
      else if (statusFilter === "Sudah Bayar") matchesStatus = item.payment_status === "paid";
      else if (statusFilter === "Belum Lunas") matchesStatus = item.payment_status === "unpaid";
      else if (statusFilter === "Semua") matchesStatus = true;
      return matchesSearch && matchesStatus;
    });

  return (
    <div className="flex h-screen bg-gray-50"> {/* Menambahkan h-screen dan bg-gray-50 */}
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarOpen ? 290 : 70 }}
      />

      {/* 1. UBAH DIV INI MENJADI FLEX-COL UNTUK LAYOUT UTAMA */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden"> {/* Tambahkan flex, flex-col, dan overflow-hidden */}
        <ToastContainer autoClose={3000} hideProgressBar={false} />
        
        {/* Bagian Header (Judul dan Filter) */}
        <div>
          <h1 className="text-[32px] font-semibold mb-6 text-black">
            {loading ? ( <div className="h-8 w-56 bg-gray-300 rounded animate-pulse" /> ) : showHistory ? "Arsip Pesanan" : "Daftar Pesanan"}
          </h1>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            {/* ... (Filter, Arsip, Search tidak berubah) ... */}
            <div className="flex flex-wrap items-center gap-2">
              {loading ? [...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-24 rounded-full bg-gray-200 animate-pulse" />
                ))
                : ["Baru", "Sudah Bayar", "Belum Lunas", "Semua"].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setShowHistory(false); }}
                      className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-150 cursor-pointer ${
                        statusFilter === status && !showHistory
                          ? "bg-[#3D6CB9] text-white"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
              {!loading && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-150 cursor-pointer ${
                    showHistory
                      ? "bg-[#3D6CB9] text-white"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Arsip
                </button>
              )}
            </div>
            <div className="flex-shrink-0">
              {loading ? (
                <div className="h-10 w-96 bg-gray-200 rounded animate-pulse" />
              ) : (
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm("")}
                  placeholder="Cari"
                />
              )}
            </div>
          </div>
        </div>

        {/* Bagian Konten (Tabel atau Skeleton) */}
        {loading ? (
          <div className="flex-grow space-y-4 p-4"> {/* Menambahkan flex-grow */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white p-4 rounded-xl shadow flex items-center justify-between">
                <div className="flex flex-col space-y-2 w-full">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-8 w-24 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* 2. UBAH PEMBUNGKUS TABEL INI */}
            <div className="flex-grow overflow-y-auto bg-white rounded-xl shadow"> {/* Tambahkan flex-grow dan overflow-y-auto */}
              <table className="min-w-full table-auto">
                <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                  {/* ... (Header tabel tidak berubah) ... */}
                   <tr>
                    <th className="p-3 text-center font-semibold">No</th>
                    <th className="p-3 text-center font-semibold">Kode Pesanan</th>
                    <th className="p-3 text-center font-semibold">Nama</th>
                    <th className="p-3 text-center font-semibold">No. HP</th>
                    <th className="p-3 text-center font-semibold">Waktu</th>
                    <th className="p-3 text-center font-semibold">Paket</th>
                    <th className="p-3 text-center font-semibold">Tipe</th>
                    <th className="p-3 text-center font-semibold">Status</th>
                    <th className="p-3 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => {
                      // ... (map logic tidak berubah)
                      const showArchiveButton = !showHistory;
                      return (
                        <tr key={item.booking_id} className="border-b text-center hover:bg-gray-50">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{item.order_id}</td>
                          <td className="p-2">{item.customer_name}</td>
                          <td className="p-2">{item.customer_phone}</td>
                          <td className="p-2">{new Date(item.created_at).toISOString().split("T")[0]}</td>
                          <td className="p-2">{item.package?.package_name}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium">
                              {item.payment_type === "dp" ? "DP" : "Full"}
                            </span>
                          </td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.booking_status === "confirmed" || item.booking_status === "settlement"
                                  ? "bg-green-100 text-green-800"
                                  : item.booking_status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : item.booking_status === "expire" || item.booking_status === "cancel"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {item.booking_status}
                            </span>
                          </td>
                          <td className="p-2 flex justify-center gap-3">
                            <button
                              onClick={() => { setSelectedOrder(item); setIsModalOpen(true); }}
                              className="text-gray-600 hover:text-black cursor-pointer"
                              title="Lihat Detail"
                            >
                              <Eye size={16} />
                            </button>
                            {showArchiveButton && (
                              <>
                                <button
                                  onClick={() => {
                                    const encodeId = hashids.encode(item.booking_id);
                                    router.push(`/dashboard/pemesanan/daftar-pesanan/${encodeId}`);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                  title="Ubah Pesanan"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => handleArchive(item)}
                                  className="text-red-600 hover:text-red-800 cursor-pointer"
                                  title="Arsipkan Pesanan"
                                >
                                  <Archive size={16} />
                                </button>
                                <button
                                  onClick={() => handleSyncStatus(item.order_id, item.booking_id)}
                                  disabled={!!refreshingItemId}
                                  className="text-green-600 hover:text-black cursor-pointer disabled:cursor-not-allowed"
                                  title="Sinkronkan status pembayaran"
                                >
                                  <RefreshCw
                                    size={16}
                                    className={refreshingItemId === item.booking_id ? 'animate-spin' : ''}
                                  />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-4 text-center text-gray-500">
                        Belum Ada Pesanan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {isModalOpen && selectedOrder && (
              <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                {/* ... (Modal tidak berubah) ... */}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(DaftarPesanan);
