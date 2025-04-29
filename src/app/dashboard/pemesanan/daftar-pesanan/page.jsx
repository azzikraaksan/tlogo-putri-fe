"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const dummyData = [
  {
    id: 1,
    bookingCode: "JTP001",
    name: "Bunde",
    phone: "081234567890",
    waktupemesanan: "12 Januari 2025",
    note: "Paket 2",
    status: "Sudah Bayar",
  },
  {
    id: 2,
    bookingCode: "JTP002",
    name: "Zimut",
    phone: "089876543210",
    waktupemesanan: "12 Januari 2025",
    note: "Paket 1",
    status: "Sudah Bayar",
  },
  {
    id: 3,
    bookingCode: "JTP003",
    name: "Naon Maneh",
    phone: "081234567890",
    waktupemesanan: "15 Januari 2025",
    note: "Paket 3",
    status: "DP 50%",
  },
  {
    id: 4,
    bookingCode: "JTP004",
    name: "Maneh Saha",
    phone: "089876543210",
    waktupemesanan: "15 Januari 2025",
    note: "Paket 1",
    status: "DP 50%",
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
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Sudah Bayar" && item.status === "Sudah Bayar") ||
      (statusFilter === "Belum Bayar" && item.status === "DP 50%");

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
          {['Semua', 'Sudah Bayar', 'Belum Bayar'].map((status) => (
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
                <th className="p-3 text-center font-semibold">Status</th>
                <th className="p-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t text-center hover:bg-gray-50"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.bookingCode}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.phone}</td>
                    <td className="p-2">{item.waktupemesanan}</td>
                    <td className="p-2">{item.note}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Sudah Bayar"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2 flex justify-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-5 h-5" />
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