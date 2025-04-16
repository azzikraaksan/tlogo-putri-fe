"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";

const dummyData = [
  {
    lambung: "01",
    name: "Bunde",
    status: "Available",
    konfirmasi: "WhatsApp",
    departure: "Pilih Driver",
  },
  {
    lambung: "02",
    name: "Zimut",
    status: "On Track",
    konfirmasi: "WhatsApp",
    departure: "Pilih Driver",
  },
  {
    lambung: "03",
    name: "Naon Maneh",
    status: "Completed",
    konfirmasi: "WhatsApp",
    departure: "Pilih Driver",
  },
  {
    lambung: "04",
    name: "Maneh Saha",
    status: "Completed",
    konfirmasi: "WhatsApp",
    departure: "Pilih Driver",
  },
];

const PenjadwalanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const router = useRouter();

  const filteredData = dummyData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (lambung) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(lambung)) return prevSelectedIds;
      return [...prevSelectedIds, lambung];
    });
  };

  const sortedData = [
    ...filteredData.filter((item) => !selectedIds.includes(item.lambung)),
    ...filteredData.filter((item) => selectedIds.includes(item.lambung)),
  ];

  const handleAturJadwal = (id) => {
    router.push(`/dashboard_fo/penjadwalan/rolling-driver`);
  };

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-5xl font-semibold mb-6 text-black">Rolling Driver</h1>

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

        <div className="flex items-center justify-center">
          <table className="w-290 table-auto">
            <thead className="text-gray-500">
              <tr>
                <th className="p-2 text-center font-normal">No Lambung</th>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                <th className="p-2 text-center font-normal">Status</th>
                <th className="p-2 text-center font-normal">Konfirmasi</th>
                <th className="p-2 text-center font-normal">Keberangkatan</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length > 0 ? (
                sortedData.map((item) => (
                  <tr key={item.lambung} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-2 text-center text-gray-750">{item.lambung}</td>
                    <td className="p-2 text-center text-gray-750">{item.name}</td>
                    <td className="p-2 text-center text-gray-750">{item.status}</td>
                    <td className="p-2 text-center text-gray-750">
                      <button
                        onClick={() => handleAturJadwal(item.konfirmasi)}
                        className="w-30 bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] cursor-pointer"
                      >
                        {item.konfirmasi}
                      </button>
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      <button
                        onClick={() => handleAturJadwal(item.departure)}
                        className="w-30 bg-[#8FAFD9] rounded-[10px] text-white cursor-pointer"
                      >
                        {item.departure}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
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
