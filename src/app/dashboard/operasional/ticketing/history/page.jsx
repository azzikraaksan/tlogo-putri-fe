"use client";
import React from "react";
import Sidebar from "/components/Sidebar.jsx";
import SearchInput from "/components/Search.jsx";
import LoadingFunny from "/components/LoadingFunny.jsx";
import { CircleArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ArsipPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchTicketings();
  }, []);

  const handleKembali = () => {
    router.back();
  };

  const fetchTicketings = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/ticketings/all");
      const ticketingData = await response.json();
      console.log("✅ Data ticketing:", ticketingData);
      setData(ticketingData); 
    } catch (error) {
      console.error("❌ Error fetch ticketing/rotasi:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(
    (item) =>
      (item.code_booking ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.nama_pemesan ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.no_handphone ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.jeep?.no_lambung ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.driver?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) {
    return <LoadingFunny />;
  }
  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? 290 : 70,
        }}
      ></div>
      <div className="flex-1 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CircleArrowLeft
            onClick={handleKembali}
            className="cursor-pointer"
            size={28}
          />
          <h1 className="text-[32px] font-semibold text-black">
            History Tiket
          </h1>
        </div>
        <div className="flex justify-end mb-3">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Cari"
          />
        </div>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
              <div className="max-h-[470px] overflow-y-auto">
                <table className="w-full table-auto">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                <th className="p-2 text-center font-normal">
                  Tanggal Keberangkatan
                </th>
                <th className="p-2 text-center font-normal">Nama Pemesan</th>
                <th className="p-2 text-center font-normal">No. Lambung</th>
                <th className="p-2 text-center font-normal">Nama Driver</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-2 text-center">
                      {item.booking?.tour_date && item.booking?.start_time
                        ? `${item.booking?.tour_date} ${item.booking?.start_time}`
                        : "-"}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.nama_pemesan}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.jeep?.no_lambung}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.driver?.name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ArsipPage;
