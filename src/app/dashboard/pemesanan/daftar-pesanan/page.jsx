"use client";

import { useEffect, useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx"; // Diasumsikan ini digunakan di tempat lain atau akan digunakan
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Archive } from "lucide-react";
import Hashids from "hashids";

const formatNomorWA = (no) => no.replace(/^0/, "62");

const DaftarPesanan = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Baru");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [remainingPayment, setRemainingPayment] = useState(null);
  const [countdownText, setCountdownText] = useState(""); // State untuk teks countdown
  const [paymentStatusMessage, setPaymentStatusMessage] = useState(""); // State untuk pesan status pembayaran umum

  const refreshOrders = (data) => {
    setOrders(data);
  };

  useEffect(() => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  }, [statusFilter, searchTerm, showHistory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://tpapi.siunjaya.id/api/bookings");
        const data = await res.json();
        refreshOrders(data);
      } catch (error) {
        console.error("Gagal mengambil data pemesanan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchRemainingPayment = async () => {
      // **PENTING:** Logika ini hanya relevan jika pembayaran BELUM LUNAS (unpaid)
      // DAN jika payment_type BUKAN 'full'.
      // Ini mencegah panggilan ke endpoint yang mungkin tidak relevan
      // atau mengembalikan error 400 jika pembayaran sudah 'full'
      if (!selectedOrder || !selectedOrder.order_id || selectedOrder.payment_status !== "unpaid" || selectedOrder.payment_type === "full") {
        setRemainingPayment(null); // Pastikan ini direset jika tidak relevan
        return; // Hentikan fungsi jika kondisi tidak terpenuhi
      }
      setRemainingPayment(null); // Reset untuk menampilkan "Memuat..."

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) throw new Error("Token otorisasi tidak ditemukan.");

          const res = await fetch(
            `https://tpapi.siunjaya.id/api/orders/${selectedOrder.order_id}/remaining-payment`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

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

    fetchRemainingPayment();

    // Logika untuk menghitung countdown dan mengatur pesan status pembayaran
    const calculateAndSetMessages = () => {
      if (selectedOrder) {
        const tourDate = new Date(selectedOrder.tour_date);
        const now = new Date();
        // Atur jam, menit, detik, milidetik ke 0 untuk perbandingan tanggal saja
        now.setHours(0, 0, 0, 0);
        tourDate.setHours(0, 0, 0, 0);

        const timeDiff = tourDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Selisih hari

        if (selectedOrder.payment_status === "unpaid") {
          // Reset pesan status pembayaran umum
          setPaymentStatusMessage("");

          if (daysDiff > 5) {
            setCountdownText(""); // Tidak ada notifikasi khusus jika > H-5
          } else if (daysDiff >= 0 && daysDiff <= 5) {
            // H-5 sampai H-0 (hari H)
            setCountdownText(`🚨 Sisa ${daysDiff} hari lagi menuju tur! Harap segera lunasi pembayaran.`);
          } else if (daysDiff < 0) {
            // Tanggal tur sudah terlewat dan belum lunas
            // Pastikan tidak menampilkan pesan ini jika booking_status sudah 'cancel' atau 'expire'
            if (selectedOrder.booking_status !== "cancel" && selectedOrder.booking_status !== "expire") {
                setCountdownText(`⚠️ Tanggal tur telah terlewat (${Math.abs(daysDiff)} hari lalu) dan pembayaran masih belum lunas.`);
            } else {
                setCountdownText(""); // Jika sudah terlewat dan booking_status sudah dibatalkan/expired
            }
          }
        } else if (selectedOrder.payment_status === "paid") {
          // Jika status pembayaran adalah "paid" (lunas)
          setCountdownText(""); // Kosongkan countdown
          setRemainingPayment(null); // Pastikan ini juga direset jika sudah lunas
          setPaymentStatusMessage("Pembayaran telah lunas.");
        } else {
          // Kasus status pembayaran lain yang tidak ditangani secara spesifik
          setCountdownText("");
          setPaymentStatusMessage("");
        }
      } else {
        // Reset semua state terkait modal jika tidak ada pesanan yang dipilih (modal tertutup)
        setCountdownText("");
        setRemainingPayment(null);
        setPaymentStatusMessage("");
      }
    };

    if (isModalOpen && selectedOrder) { // Panggil fungsi ini hanya saat modal terbuka dan ada pesanan dipilih
      calculateAndSetMessages();
      // Opsional: Jika Anda ingin countdown real-time (detik, menit),
      // Anda perlu mengaktifkan setInterval di sini dan membersihkannya di cleanup.
      // const interval = setInterval(calculateAndSetMessages, 1000); // Perbarui setiap detik
      // return () => clearInterval(interval);
    } else {
        // Pastikan semua state yang terkait modal direset saat modal ditutup
        setCountdownText("");
        setRemainingPayment(null);
        setPaymentStatusMessage("");
    }

  }, [selectedOrder, isModalOpen]); // Tambahkan isModalOpen sebagai dependency

  if (!isMounted) return null;

  const handleArchive = async (item) => {
    // Hitung tanggal H-1 dari tour_date
    const tourDate = new Date(item.tour_date);
    const today = new Date();
    // Penting: Atur jam, menit, detik, milidetik ke 0 untuk perbandingan tanggal saja
    today.setHours(0, 0, 0, 0);
    tourDate.setHours(0, 0, 0, 0);

    // Dapatkan tanggal "besok" untuk perbandingan H-1
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Cek apakah status booking adalah 'pending' atau 'settlement'
    // DAN tanggal tur adalah hari ini (H-0) atau besok (H-1)
    const isSpecialCaseForArchiveRestriction =
      (item.booking_status === "pending" ||
        item.booking_status === "settlement") &&
      (tourDate <= tomorrow); // Jika tanggal tur <= tanggal besok (artinya H-1 atau H-0)

    // Jika masuk ke kondisi khusus pembatasan pengarsipan
    if (isSpecialCaseForArchiveRestriction) {
      alert("Pesanan ini tidak dapat diarsipkan karena sudah H-1 atau kurang dari tanggal tur dan statusnya Pending/Settlement.");
      return; // Hentikan proses pengarsipan
    }

    // Untuk status selain "expire", minta konfirmasi
    if (item.booking_status !== "expire") {
      const confirmArchive = confirm("Apakah Anda yakin ingin mengarsipkan pesanan ini? Status pesanan akan menjadi 'cancel'.");
      if (!confirmArchive) {
        return; // Hentikan jika pengguna membatalkan
      }
    }

    // Lanjutkan pengarsipan jika tidak ada pembatasan atau konfirmasi disetujui
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Token tidak ditemukan.");
        return;
      }
      const res = await fetch(`https://tpapi.siunjaya.id/api/bookings/${item.booking_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      if (showHistory) {
        return item.booking_status === "cancel";
      }
      return item.booking_status !== "cancel";
    })
    .filter((item) => {
      const matchesSearch =
        (item.order_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.created_at || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer_phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase());

      if (showHistory) {
        return matchesSearch;
      }

      let matchesStatus = false;
      if (statusFilter === "Baru") {
        matchesStatus = item.created_at?.split("T")[0] === today;
      } else if (statusFilter === "Sudah Bayar") {
        matchesStatus = item.payment_status === "paid";
      } else if (statusFilter === "Belum Lunas") {
        matchesStatus = item.payment_status === "unpaid";
      } else if (statusFilter === "Semua") {
        matchesStatus = true;
      }

      return matchesSearch && matchesStatus;
    });

  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarOpen ? 290 : 70 }}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-[32px] font-semibold mb-6 text-black">
          {loading ? (
            <div className="h-8 w-56 bg-gray-300 rounded animate-pulse" />
          ) : showHistory ? (
            "Arsip Pesanan"
          ) : (
            "Daftar Pesanan"
          )}
        </h1>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          {/* Kiri: Tombol status dan Arsip */}
          <div className="flex flex-wrap items-center gap-2">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-24 rounded-full bg-gray-200 animate-pulse"
                  />
                ))
              : ["Baru", "Sudah Bayar", "Belum Lunas", "Semua"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowHistory(false); // Pastikan history mati saat memilih filter ini
                    }}
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
                onClick={() => {
                  setShowHistory(!showHistory);
                }}
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

          {/* Kanan: SearchInput */}
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

        {loading ? (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white p-4 rounded-xl shadow flex items-center justify-between"
              >
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
            <div className="overflow-x-auto bg-white rounded-xl shadow max-h-[60vh]">
              <table className="min-w-full table-auto">
                <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-center font-semibold">No</th>
                    <th className="p-3 text-center font-semibold">
                      Kode Pesanan
                    </th>
                    <th className="p-3 text-center font-semibold">Nama</th>
                    <th className="p-3 text-center font-semibold">
                      No. HP
                    </th>
                    <th className="p-3 text-center font-semibold">
                      Waktu
                    </th>
                    <th className="p-3 text-center font-semibold">
                      Paket
                    </th>
                    <th className="p-3 text-center font-semibold">Tipe</th>
                    <th className="p-3 text-center font-semibold">
                      Status
                    </th>
                    <th className="p-3 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => {
                      // Hanya tampilkan tombol arsip jika tidak dalam tampilan riwayat
                      const showArchiveButton = !showHistory;

                      return (
                        <tr
                          key={item.booking_id}
                          className="border-b text-center hover:bg-gray-50"
                        >
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{item.order_id}</td>
                          <td className="p-2">{item.customer_name}</td>
                          <td className="p-2">{item.customer_phone}</td>
                          <td className="p-2">
                            {
                              new Date(item.created_at)
                                .toISOString()
                                .split("T")[0]
                            }
                          </td>
                          <td className="p-2">
                            {item.package?.package_name}
                          </td>
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
                              onClick={() => {
                                setSelectedOrder(item);
                                setIsModalOpen(true);
                              }}
                              className="text-gray-600 hover:text-black cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                            {showArchiveButton && (
                              <>
                                <button
                                  onClick={() => {
                                    const encodeId = hashids.encode(
                                      item.booking_id
                                    );
                                    router.push(
                                      `/dashboard/pemesanan/daftar-pesanan/${encodeId}`
                                    );
                                  }}
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => handleArchive(item)}
                                  className="text-red-600 hover:text-red-800 cursor-pointer"
                                  title="Arsipkan pesanan ini."
                                >
                                  <Archive size={16} />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="p-4 text-center text-gray-500"
                      >
                        Belum Ada Pesanan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {isModalOpen && selectedOrder && (
              <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                <div className="bg-white rounded-xl shadow-xl p-4 w-[90%] max-w-md relative">
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold text-center flex justify-center items-center gap-2 mb-2">
                    🧾 Detail Pesanan
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="border p-3 rounded-lg bg-gray-50 shadow-sm space-y-2">
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">🔖 Kode Pemesanan</span>
                        <span>: {selectedOrder.order_id}</span>
                      </p>
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">👤 Nama</span>
                        <span>: {selectedOrder.customer_name}</span>
                      </p>
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">📧 Email</span>
                        <span>: {selectedOrder.customer_email}</span>
                      </p>
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">📞 No. HP</span>
                        <span>: {selectedOrder.customer_phone}</span>
                      </p>
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">📦 Paket</span>
                        <span>: {selectedOrder.package?.package_name}</span>
                      </p>
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">🕒 Waktu Pemesanan</span>
                        <span>
                          : {new Date(selectedOrder.created_at).toISOString().split("T")[0]}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">📌 Status Booking</span>
                        <span>:{" "}
                          <span
                              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                selectedOrder.booking_status === "confirmed" || selectedOrder.booking_status === "settlement"
                                  ? "bg-green-100 text-green-800"
                                  : selectedOrder.booking_status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : selectedOrder.booking_status === "expire" || selectedOrder.booking_status === "cancel"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {selectedOrder.booking_status}
                          </span>
                        </span>
                      </p>
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">📅 Waktu Tour</span>
                        <span>
                          : {selectedOrder.start_time?.slice(0, 5)} WIB, {selectedOrder.tour_date}
                        </span>
                      </p>
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">👥 Jumlah Pesanan</span>
                        <span>: {selectedOrder.qty}</span>
                      </p>
                    </div>
                    <div className="border p-3 rounded-lg bg-gray-50 shadow-sm space-y-2">
                      <p className="text-base font-semibold mb-2 flex items-center gap-2">
                        💳 Status Pembayaran
                      </p>
                      <p className="flex items-center">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">Status</span>
                        <span>:{" "}
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedOrder.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-600"
                          }`}>
                            {selectedOrder.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                          </span>
                        </span>
                      </p>
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">Metode Pembayaran</span>
                        <span>: {selectedOrder.payment_type}</span>
                      </p>
                      <p className="flex">
                        <span className="w-44 font-semibold text-gray-600 shrink-0">Jenis Pembayaran</span>
                        <span>: {selectedOrder.payment_type === "dp" ? "DP" : "Full"}</span>
                      </p>
                      {/* --- KONDISI KHUSUS UNTUK PEMBAYARAN BELUM LUNAS --- */}
                      {selectedOrder.payment_status === "unpaid" && (
                        <>
                          <p className="flex">
                            <span className="w-44 font-semibold text-gray-600 shrink-0">Total Tagihan</span>
                            <span>: Rp {Number(selectedOrder.gross_amount * selectedOrder.qty).toLocaleString("id-ID")}</span>
                          </p>
                          {selectedOrder.payment_type === "dp" && (
                            <>
                              <p className="flex">
                                <span className="w-44 font-semibold text-gray-600 shrink-0">Dibayar (DP)</span>
                                <span>: Rp {Number(selectedOrder.dp_amount).toLocaleString("id-ID")}</span>
                              </p>
                              <p className="flex">
                                <span className="w-44 font-semibold text-gray-600 shrink-0">Sisa Pembayaran</span>
                                <span>:{" "}
                                  {remainingPayment !== null
                                    ? `Rp ${Number(remainingPayment).toLocaleString("id-ID")}`
                                    : "Memuat..."}
                                </span>
                              </p>
                              <p className="text-red-600 text-xs mt-2">
                                Ini adalah pembayaran DP. Silakan lunasi sebelum{" "}
                                <strong className="text-red-700">{selectedOrder.due_date}</strong>
                              </p>
                            </>
                          )}
                          {/* Notifikasi Countdown atau Tanggal Terlewat untuk 'unpaid' */}
                          {countdownText && (
                            <p className="text-xs font-semibold text-orange-600 bg-orange-50 p-2 rounded-md border border-orange-200 mt-2">
                              {countdownText}
                            </p>
                          )}
                        </>
                      )}
                      {/* --- KONDISI KHUSUS UNTUK PEMBAYARAN SUDAH LUNAS --- */}
                      {selectedOrder.payment_status === "paid" && (
                        <>
                          <p className="flex">
                            <span className="w-44 font-semibold text-gray-600 shrink-0">Total Pembayaran</span>
                            <span>: Rp {Number(selectedOrder.gross_amount * selectedOrder.qty).toLocaleString("id-ID")}</span>
                          </p>
                          {/* Pesan status pembayaran umum untuk 'paid' */}
                          {paymentStatusMessage && (
                            <p className="text-xs font-semibold text-green-600 bg-green-50 p-2 rounded-md border border-green-200 mt-2">
                                {paymentStatusMessage}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-center mt-4">
                      <a
                        href={`https://wa.me/${formatNomorWA(
                          selectedOrder.customer_phone
                        )}?text=Halo ${
                          selectedOrder.customer_name
                        }, kami dari tim admin ingin mengonfirmasi pesanan Anda dengan kode ${
                          selectedOrder.order_id
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#3D6CB9] hover:bg-blue-700 transition-all duration-150 text-white font-medium py-2 px-4 rounded text-sm"
                      >
                        Hubungi Pelanggan via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(DaftarPesanan);