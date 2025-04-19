"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const dummyData = [
  {
    fo_id: 1,
    email: "bundee@gmail.com",
    peran: "Front Office",
    status: "Aktif",
    action: "Lihat Detail",
  },
  {
    owner_id: 2,
    email: "zimut@gmail.com",
    peran: "Owner",
    status: "Aktif",
    action: "Lihat Detail",
  },
  {
    driver_id: 3,
    email: "naon@gmail.com",
    peran: "Driver",
    status: "Aktif",
    action: "Lihat Detail",
  },
  {
    bendahara_id: 4,
    email: "saha@gmail.com",
    peran: "Bendahara",
    status: "Aktif",
    action: "Lihat Detail",
  },
  {
    pengurus_id: 5,
    email: "maneh@gmail.com",
    peran: "Pengurus",
    status: "Aktif",
    action: "Lihat Detail",
  },
];

const PenjadwalanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredData = dummyData.filter(
    (item) =>
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.peran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAturJadwal = (id) => {
    router.push(`/dashboard_fo/penjadwalan/rolling-driver`);
  };

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-5xl font-semibold mb-6 text-black">
          Daftar Anggota
        </h1>

        <div className="flex justify-end mb-7">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Cari"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-gray-500">
              <tr>
                <th className="p-2 text-center font-normal">Email</th>
                <th className="p-2 text-center font-normal">Peran</th>
                <th className="p-2 text-center font-normal">Status</th>
                <th className="p-2 text-center font-normal">Aksi</th>
                <th className="p-2 text-center font-normal">Hapus Anggota</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={
                      item.driver_id ||
                      item.fo_id ||
                      item.owner_id ||
                      item.jeep_id ||
                      item.pengurus_id ||
                      item.bendahara_id
                    }
                    className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-2 text-center text-gray-750">
                      {item.email}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.peran}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.status}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleAturJadwal(item.id)}
                        className="w-[120px] bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] py-1 px-3 cursor-pointer hover:bg-[#7ba2d0] transition"
                      >
                        {item.action}
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => console.log("Hapus", item.id)}
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
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
