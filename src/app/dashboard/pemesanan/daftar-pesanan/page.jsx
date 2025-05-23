"use client";
import { useEffect, useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash } from "lucide-react";

const formatNomorWA = (no) => {
  return no.replace(/^0/, "62");
};

const DaftarPesanan = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) return <div className="p-6">Memuat data pemesanan...</div>;
  if (!isMounted) return null;

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Apakah kamu yakin ingin menghapus pesanan ini?");
    if (confirmDelete) {
      setOrders((prev) => prev.filter((item) => item.booking_id !== id));
    }
  };

  const filteredData = orders.filter((item) => {
    const matchesSearch =
      (item.order_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.created_at || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.customer_phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Sudah Bayar" && item.payment_status === "paid") ||
      (statusFilter === "Belum Lunas" && item.payment_status === "dp");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-5xl font-semibold mb-6 text-black">Daftar Pesanan</h1>

        <div className="flex gap-2 mb-6">
          {["Semua", "Sudah Bayar", "Belum Lunas"].map((status) => (
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

        <div className="flex justify-end mb-4">
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
                <th className="p-3 text-center font-semibold">No</th>
                <th className="p-3 text-center font-semibold">Kode Pemesanan</th>
                <th className="p-3 text-center font-semibold">Nama</th>
                <th className="p-3 text-center font-semibold">No. HP</th>
                <th className="p-3 text-center font-semibold">Waktu Pemesanan</th>
                <th className="p-3 text-center font-semibold">Paket</th>
                <th className="p-3 text-center font-semibold">Status Pembayaran</th>
                <th className="p-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.booking_id} className="border-t text-center hover:bg-gray-50">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.order_id}</td>
                    <td className="p-2">{item.customer_name}</td>
                    <td className="p-2">{item.customer_phone}</td>
                    <td className="p-2">{item.created_at}</td>
                    <td className="p-2">{item.package?.package_name}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.payment_status === "paid" ? "Sudah Bayar" : "DP 50%"}
                      </span>
                    </td>
                    <td className="p-2 flex justify-center gap-2">
                      <button
                        className="text-gray-600 hover:text-black cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(item);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/pemesanan/daftar-pesanan/${item.booking_id}`);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.booking_id);
                        }}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
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
              <h2 className="text-xl font-bold mb-4">Detail Pesanan</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Nama:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>No. HP:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Waktu Pemesanan:</strong> {selectedOrder.created_at}</p>
                <p><strong>Paket:</strong> {selectedOrder.package?.package_name}</p>
                <p><strong>Status Pembayaran:</strong> {selectedOrder.payment_status === "paid" ? "Sudah Bayar" : "DP 50%"}</p>
                <p><strong>Tanggal Tour:</strong> {selectedOrder.tour_date}</p>
                <p><strong>Jumlah Pesanan:</strong> {selectedOrder.qty}</p>
                <div className="text-center mt-4">
                  <a
                    href={`https://wa.me/${formatNomorWA(selectedOrder.customer_phone)}?text=Halo ${selectedOrder.customer_name}, kami dari tim admin ingin mengonfirmasi pesanan Anda dengan kode ${selectedOrder.order_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#3D6CB9] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm"
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
