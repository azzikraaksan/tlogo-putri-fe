"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { Pencil, Trash } from "lucide-react";


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
  const router = useRouter();

  const filteredData = dummyData.filter((item) => {
    const matchesSearch =
      item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.waktupemesanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Sudah Bayar" && item.status === "Sudah Bayar") ||
      (statusFilter === "Belum Lunas" && item.status === "DP 50%");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-5xl font-semibold mb-6 text-black">
          Daftar Pesanan
        </h1>

        {/* Filter Status */}
        <div className="flex gap-2 mb-6">
          {['Semua', 'Sudah Bayar', 'Belum Lunas'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-150 ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
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
                  <tr
                    key={item.id}
                    onClick={() => router.push(`/dashboard/pemesanan/daftar-pesanan/${item.id}`)}
                    className="border-t text-center hover:bg-gray-50"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.bookingCode}</td>
                    <td className="p-2">{item.nama}</td>
                    <td className="p-2">{item.phone}</td>
                    <td className="p-2">{item.waktupemesanan}</td>
                    <td className="p-2">{item.jenispaket}</td>
                    <td className="p-2">
                      {/* Status Pembayaran */}
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
                      <button className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                        e.stopPropagation(); // agar tidak ikut trigger ke halaman detail
                        // aksi edit nantinya
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800"
                        onClick={(e) => {
                        e.stopPropagation(); // agar tidak ikut trigger ke halaman detail
                        // aksi hapus nantinya
                        }}
                      >
                        {/* Hapus */}
                        <Trash size={16}  />
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
      </div>
    </div>
  );
};

export default withAuth(DaftarPesanan);