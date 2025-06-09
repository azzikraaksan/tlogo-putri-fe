"use client";

import { useEffect, useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Archive } from "lucide-react";
import Hashids from "hashids";
import LoadingFunny from "/components/LoadingFunny.jsx";

const formatNomorWA = (no) => no.replace(/^0/, "62");

const DaftarPesanan = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [remainingPayment, setRemainingPayment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/bookings");
        const data = await res.json();
        setOrders(data);
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
    const fetchRemainingPayment = async () => {
      if (!selectedOrder) return;

      try {
        const res = await fetch(`http://localhost:8000/api/orders/${selectedOrder.order_id}/remaining-payment`);
        if (!res.ok) throw new Error(`Gagal fetch, status: ${res.status}`);
        const text = await res.text();
        if (!text) throw new Error("Response kosong dari server");

        const data = JSON.parse(text);
        setRemainingPayment(data.remaining_amount);
      } catch (error) {
        console.error("Gagal mengambil sisa pembayaran:", error.message);
        setRemainingPayment(null);
      }
    };

    fetchRemainingPayment();
  }, [selectedOrder]);

  if (loading)
    return (
      <LoadingFunny/>
    );
  if (!isMounted) return null;

  const handleArchive = async (id) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("Token tidak ditemukan. Pastikan user sudah login.");
        return;
      }
      
      const res = await fetch(`http://localhost:8000/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ booking_status: "cancel" }),
      });
      

  
      const responseText = await res.text(); // ambil teks respon apa pun
      console.log("Server response:", res.status, responseText);
  
      if (!res.ok) {
        alert(`Gagal mengarsipkan pesanan. Status: ${res.status}`);
        return;
      }
  
      const updated = await fetch("http://localhost:8000/api/bookings");
      const updatedData = await updated.json();
      setOrders(updatedData);
    } catch (error) {
      console.error("Network/Parsing error saat arsip:", error);
      alert("Terjadi kesalahan jaringan saat mengarsipkan.");
    }
  };
  

  const filteredData = orders
    .filter((item) => showHistory ? item.booking_status === "cancel" : item.booking_status !== "cancel")
    .filter((item) => {
      const matchesSearch =
        (item.order_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.created_at || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer_phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "Semua" ||
        (statusFilter === "Sudah Bayar" && item.payment_status === "paid") ||
        (statusFilter === "Belum Lunas" && item.payment_status === "unpaid");

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
          {showHistory ? "Arsip Pesanan" : "Daftar Pesanan"}
        </h1>

        <div className="flex gap-2 mb-6">
          {showHistory ? null : ["Semua", "Sudah Bayar", "Belum Lunas"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-150 ${
                statusFilter === status
                  ? "bg-[#3D6CB9] text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
          >
            {showHistory ? "Tutup Arsip" : "Arsip"}
          </button>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Cari"
          />
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full table-auto">
          <thead className="bg-[#3D6CB9] text-white">
            <tr>
              {showHistory ? (
                Object.keys(filteredData[0] || {}).map((key, index) => (
                  <th key={index} className="p-3 text-center font-semibold">
                    {key}
                  </th>
                ))
              ) : (
                <>
                  <th className="p-3 text-center font-semibold">No</th>
                  <th className="p-3 text-center font-semibold">Kode Pemesanan</th>
                  <th className="p-3 text-center font-semibold">Nama</th>
                  <th className="p-3 text-center font-semibold">No. HP</th>
                  <th className="p-3 text-center font-semibold">Waktu Pemesanan</th>
                  <th className="p-3 text-center font-semibold">Paket</th>
                  <th className="p-3 text-center font-semibold">Status Pembayaran</th>
                  <th className="p-3 text-center font-semibold">Booking Status</th>
                  <th className="p-3 text-center font-semibold">Aksi</th>
                </>
              )}
            </tr>
          </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.booking_id} className="border-b text-center hover:bg-gray-50">
                    {showHistory ? (
                      Object.values(item).map((value, i) => (
                        <td key={i} className="p-2 text-sm text-center">
                          {typeof value === "object" && value !== null ? JSON.stringify(value) : value?.toString() || "-"}
                        </td>
                      ))
                    ) : (
                      <>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{item.order_id}</td>
                        <td className="p-2">{item.customer_name}</td>
                        <td className="p-2">{item.customer_phone}</td>
                        <td className="p-2">{item.created_at}</td>
                        <td className="p-2">{item.package?.package_name}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {item.payment_status === "paid" ? "Sudah Bayar" : "DP 30%"}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.booking_status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : item.booking_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.booking_status === "expire"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-200 text-gray-700"
                          }`}>
                            {item.booking_status}
                          </span>
                        </td>
                        <td className="p-2 flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(item);
                              setIsModalOpen(true);
                            }}
                            className="text-gray-600 hover:text-black cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() =>  {
                              const encodeId =hashids.encode(item.booking_id);
                              router.push(`/dashboard/pemesanan/daftar-pesanan/${encodeId}`)}}
                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleArchive(item.booking_id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <Archive size={16} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showHistory ? 99 : 9} className="p-4 text-center text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>

              {/* Judul Tengah */}
              <h2 className="text-xl font-bold text-center flex justify-center items-center gap-2 mb-4">
                🧾 Detail Pesanan
              </h2>

              <div className="space-y-6 text-sm">
                {/* Informasi Pemesanan */}
                <div className="border p-4 rounded-lg bg-gray-50 shadow-sm space-y-1">
                  <p><strong>🔖 Kode Pemesanan:</strong> {selectedOrder.order_id}</p>
                  <p><strong>👤 Nama:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>📧 Email:</strong> {selectedOrder.customer_email}</p>
                  <p><strong>📞 No. HP:</strong> {selectedOrder.customer_phone}</p>
                  <p><strong>📦 Paket:</strong> {selectedOrder.package?.package_name}</p>
                  <p><strong>🕒 Waktu Pemesanan:</strong> {selectedOrder.created_at}</p>
                  <p>
                    <strong>📌 Status Booking:</strong>{" "}
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedOrder.booking_status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : selectedOrder.booking_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedOrder.booking_status === "expire"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {selectedOrder.booking_status}
                    </span>
                  </p>
                  <p><strong>📅 Tanggal Tour:</strong> {selectedOrder.tour_date}</p>
                  <p><strong>👥 Jumlah Pesanan:</strong> {selectedOrder.qty}</p>
                </div>

                {/* Informasi Pembayaran */}
                <div className="border p-4 rounded-lg bg-gray-50 shadow-sm space-y-1">
                  <p className="text-base font-semibold mb-2 flex items-center gap-2">💳 Status Pembayaran</p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedOrder.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {selectedOrder.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                    </span>
                  </p>
                  <p><strong>Metode Pembayaran:</strong> {selectedOrder.payment_type}</p>
                  <p><strong>Jenis Pembayaran:</strong> {selectedOrder.payment_type === "dp" ? "DP" : "Full"}</p>

                  {/* Jika statusnya unpaid */}
                  {selectedOrder.payment_status === "unpaid" && (
                    <>
                      <p><strong>Total Tagihan:</strong> Rp {Number(selectedOrder.gross_amount*selectedOrder.qty).toLocaleString("id-ID")}</p>

                      {selectedOrder.payment_type === "dp" && (
                        <>
                          <p><strong>Dibayar (DP):</strong> Rp {Number(selectedOrder.dp_amount).toLocaleString("id-ID")}</p>
                          <p><strong>Sisa Pembayaran:</strong> {remainingPayment !== null ? `Rp ${Number(remainingPayment).toLocaleString("id-ID")}` : "Memuat..."}</p>
                          <p className="text-red-600 text-sm mt-2">
                            Ini adalah pembayaran DP. Silakan lunasi sebelum{" "}
                            <strong className="text-red-700">{selectedOrder.due_date}</strong>
                          </p>
                        </>
                      )}
                    </>
                  )}

                  {/* Jika statusnya paid */}
                  {selectedOrder.payment_status === "paid" && (
                    <>
                      <p><strong>Total Pembayaran:</strong> Rp {Number(selectedOrder.gross_amount).toLocaleString("id-ID")}</p>
                      <p className="text-green-600 text-sm mt-2">
                        Pembayaran telah lunas. Terima kasih 🙏
                      </p>
                    </>
                  )}
                </div>


                {/* Tombol WhatsApp */}
                <div className="text-center mt-4">
                  <a
                    href={`https://wa.me/${formatNomorWA(selectedOrder.customer_phone)}?text=Halo ${selectedOrder.customer_name}, kami dari tim admin ingin mengonfirmasi pesanan Anda dengan kode ${selectedOrder.order_id}`}
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

      </div>
    </div>
  );
};

export default withAuth(DaftarPesanan);