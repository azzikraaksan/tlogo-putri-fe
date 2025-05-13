"use client";
import { useEffect, useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash } from "lucide-react";

const dummyData = [
  {
    id: 1,
    bookingCode: "JTP001",
    nama: "Bunde",
    email: "baragajul@gmail.com",
    phone: "081234567890",
    waktupemesanan: "12 Januari 2025",
    jenispaket: "Paket 2",
    statuspembayaran: "Sudah Bayar",
    tanggaltour: "18 Januari 2025",
    jumlahpesanan: 1,
  },
  {
    id: 2,
    bookingCode: "JTP002",
    nama: "Zimut",
    email: "zimut@gmail.com",
    phone: "089876543210",
    waktupemesanan: "12 Januari 2025",
    jenispaket: "Paket 1",
    statuspembayaran: "Sudah Bayar",
    tanggaltour: "25 Januari 2025",
    jumlahpesanan: 2,
  },
  {
    id: 3,
    bookingCode: "JTP003",
    nama: "Naon Maneh",
    email: "manehnaon@gmail.com",
    phone: "081234567890",
    waktupemesanan: "15 Januari 2025",
    jenispaket: "Paket 3",
    statuspembayaran: "DP 50%",
    tanggaltour: "25 Januari 2025",
    jumlahpesanan: 1,
  },
  {
    id: 4,
    bookingCode: "JTP004",
    nama: "Maneh Saha",
    email: "sahamaneh@gmail.com",
    phone: "089876543210",
    waktupemesanan: "15 Januari 2025",
    jenispaket: "Paket 1",
    statuspembayaran: "DP 50%",
    tanggaltour: "27 Januari 2025",
    jumlahpesanan: 1,
  },
];

const DaftarPesanan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const filteredData = dummyData.filter((item) => {
    const matchesSearch =
      item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.waktupemesanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Sudah Bayar" && item.statuspembayaran === "Sudah Bayar") ||
      (statusFilter === "Belum Lunas" && item.statuspembayaran === "DP 50%");

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
                  ? "bg-blue-600 text-white"
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
            <thead className="bg-blue-500 text-white">
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
                  <tr key={item.id} className="border-t text-center hover:bg-gray-50">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.bookingCode}</td>
                    <td className="p-2">{item.nama}</td>
                    <td className="p-2">{item.phone}</td>
                    <td className="p-2">{item.waktupemesanan}</td>
                    <td className="p-2">{item.jenispaket}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.statuspembayaran === "Sudah Bayar"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.statuspembayaran}
                      </span>
                    </td>
                    <td className="p-2 flex justify-center gap-2">
                      <button
                        className="text-gray-600 hover:text-black"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(item);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          // aksi edit
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          // aksi hapus
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

        {/* Modal Detail Pesanan */}
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
                <p><strong>Nama:</strong> {selectedOrder.nama}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>No. HP:</strong> {selectedOrder.phone}</p>
                <p><strong>Waktu Pemesanan:</strong> {selectedOrder.waktupemesanan}</p>
                <p><strong>Paket:</strong> {selectedOrder.jenispaket}</p>
                <p><strong>Status Pembayaran:</strong> {selectedOrder.statuspembayaran}</p>
                <p><strong>Tanggal Tour:</strong> {selectedOrder.tanggaltour}</p>
                <p><strong>Jumlah Pesanan:</strong> {selectedOrder.jumlahpesanan}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(DaftarPesanan);
