"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";

const dummyData = [
  {
    id: 1,
    bookingCode: "JTP001",
    name: "Bunde",
    phone: "081234567890",
    email: "bundee@gmail.com",
    note: "Paket 2",
    departure: "Atur Jadwal",
  },
  {
    id: 2,
    bookingCode: "JTP002",
    name: "Zimut",
    phone: "089876543210",
    email: "zimut@gmail.com",
    note: "Lieur sepanjang hari",
    departure: "Atur Jadwal",
  },
  {
    id: 3,
    bookingCode: "JTP003",
    name: "Naon Maneh",
    phone: "081234567890",
    email: "naon@gmail.com",
    note: "Paket 3",
    departure: "Atur Jadwal",
  },
  {
    id: 4,
    bookingCode: "JTP004",
    name: "Maneh Saha",
    phone: "089876543210",
    email: "saha@gmail.com",
    note: "Paket 1",
    departure: "Atur Jadwal",
  },
];

const PenjadwalanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredData = dummyData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAturJadwal = (id) => {
    router.push(`/dashboard_fo/penjadwalan/rolling-driver`);
  };

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-5xl font-semibold mb-6 text-black">EndPoint Pemesanan</h1>

        <div className="flex justify-end mb-7">
          <div className="relative w-72 max-w-sm">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-[13px] px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-black-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-gray-500">
              <tr>
                <th className="p-2 text-center font-normal">Kode Booking</th>
                <th className="p-2 text-center font-normal">Nama</th>
                <th className="p-2 text-center font-normal">No HP</th>
                <th className="p-2 text-center font-normal">Email</th>
                <th className="p-2 text-center font-normal">Catatan</th>
                <th className="p-2 text-center font-normal">Keberangkatan</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-2 text-center text-gray-750">{item.bookingCode}</td>
                    <td className="p-2 text-center text-gray-750">{item.name}</td>
                    <td className="p-2 text-center text-gray-750">{item.phone}</td>
                    <td className="p-2 text-center text-gray-750">{item.email}</td>
                    <td className="p-2 text-center text-gray-750">{item.note}</td>
                    <td className="p-2 text-center text-gray-750">
                      <button
                        onClick={() => handleAturJadwal(item.id)}
                        className="w-[120px] bg-[#8FAFD9] rounded-[10px] text-white cursor-pointer"
                      >
                        {item.departure}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
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

export default withAuth(PenjadwalanPage);
