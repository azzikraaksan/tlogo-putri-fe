"use client";
import { useEffect, useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import LoadingFunny from "/components/LoadingFunny.jsx";
import SearchInput from "/components/Search.jsx";
import TambahJeep from "/components/TambahJeep";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import Hashids from "hashids";

const JeepPage = () => {
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [jeepData, setJeepData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modeTambah, setModeTambah] = useState(false);
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDriversAndJeeps = async () => {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const [driversRes, jeepsRes] = await Promise.all([
          fetch("http://localhost:8000/api/users/by-role?role=Driver", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/jeeps/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const driversData = await driversRes.json();
        const jeepsData = await jeepsRes.json();

        const drivers = driversData.data || [];
        const jeeps = jeepsData.data || [];

        const mergedData = jeeps.map((jeep) => {
          const driver = drivers.find((d) => d.id === jeep.driver_id);

          return {
            driver_id: driver?.id,
            driver_name: driver?.name || "-",
            telepon: driver?.telepon || "-",
            lambung: jeep.no_lambung,
            jeep_id: jeep.jeep_id,
            plat: jeep.plat_jeep,
            merek: jeep.merek,
            tipe: jeep.tipe,
            tahun: jeep.tahun_kendaraan,
            status_jeep: jeep.status,
            status: driver?.status || "Tidak diketahui",
            kapasitas: jeep.kapasitas || "4",
            foto: jeep.foto_jeep,
            kontak: "WhatsApp",
            konfirmasi: "-",
            departure: "Pilih Driver",
          };
        });

        setJeepData(mergedData);
      } catch (error) {
        console.error("Gagal mengambil data driver dan jeep:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriversAndJeeps();
  }, []);

  const filteredData = jeepData.filter(
    (item) =>
      item.jeep_id?.toString().includes(searchTerm.toLowerCase()) ||
      item.lambung?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.telepon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kapasitas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHapusJeep = async (id) => {
    if (!id) return;

    const konfirmasi = window.confirm("Yakin mau hapus jeep ini?");
    if (!konfirmasi) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch(`http://localhost:8000/api/jeeps/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setJeepData((prevJeep) =>
          prevJeep.filter((jeep) => jeep.jeep_id !== id)
        );
      } else {
        console.error("Gagal hapus jeep");
        alert("Gagal hapus jeep.");
      }
    } catch (error) {
      console.error("Error saat hapus jeep:", error);
      alert("Terjadi kesalahan saat menghapus.");
    }
  };

  const handleAturJeep = (jeep_id) => {
    const encryptedId = hashids.encode(jeep_id);
    router.push(`/dashboard/operasional/jeep/detail-jeep/${encryptedId}`);
  };

  const handleKembali = () => setModeTambah(false);
  const handleTambahJeep = () => setModeTambah(true);

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
        {modeTambah ? (
          <TambahJeep onKembali={handleKembali} />
        ) : (
          <>
            <h1 className="text-[32px] font-semibold mb-6 text-black">
              Daftar Jeep
            </h1>

            <div className="flex">
              <button
                onClick={handleTambahJeep}
                className="bg-[#3D6CB9] rounded-[10px] text-white py-1 px-3 mt-2 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
              >
                <Plus size={18} className="mr-2 w-[20px] h-auto" />
                Tambah Jeep
              </button>
            </div>

            <div className="flex justify-end mb-7">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                placeholder="Cari"
              />
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow max-h-[470px] overflow-y-auto">
              <table className="w-full table-auto">
                <thead className="bg-[#3D6CB9] text-white sticky top-0">
                  <tr>
                    <th className="p-2 text-center font-normal">No. Lambung</th>
                    <th className="p-2 text-center font-normal">Nama Driver</th>
                    <th className="p-2 text-center font-normal">Plat</th>
                    <th className="p-2 text-center font-normal">Kapasitas</th>
                    <th className="p-2 text-center font-normal">Status Jeep</th>
                    <th className="p-2 text-center font-normal">Kontak</th>
                    <th className="p-2 text-center font-normal">Aksi</th>
                    <th className="p-2 text-center font-normal">Hapus Jeep</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr
                        key={item.lambung}
                        className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-2 text-center text-gray-750">
                          {item.lambung}
                        </td>
                        <td className="p-2 text-center text-gray-750">
                          {item.driver_name}
                        </td>
                        <td className="p-2 text-center text-gray-750">
                          {item.plat}
                        </td>
                        <td className="p-2 text-center text-gray-750">
                          {item.kapasitas}
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`inline-flex items-center gap-2 px-2 py-1 text-[14px] font-semibold rounded-full ${
                              item.status_jeep === "Tersedia"
                                ? "bg-green-100 text-green-600"
                                : item.status_jeep === "On Track"
                                  ? "bg-red-100 text-red-600"
                                  : "text-gray-700"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.status_jeep === "Tersedia"
                                  ? "bg-green-600"
                                  : item.status_jeep === "On Track"
                                    ? "bg-red-600"
                                    : "bg-gray-400"
                              }`}
                            ></span>
                            {item.status_jeep}
                          </span>
                        </td>

                        <td className="p-2 text-center">
                          <button
                            onClick={() => {
                              if (item?.telepon) {
                                window.open(
                                  `https://wa.me/${item.telepon.replace(/^0/, "62")}`,
                                  "_blank"
                                );
                              }
                            }}
                            disabled={!item?.telepon}
                            className={`px-3 rounded-[10px] text-white ${
                              item?.telepon
                                ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                                : "bg-gray-400 cursor-not-allowed"
                            } inline-block`}
                          >
                            WhatsApp
                          </button>
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleAturJeep(item.jeep_id)}
                            className="w-[120px] bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] cursor-pointer hover:bg-[#7ba2d0] transition"
                          >
                            Lihat Detail
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() =>
                              item?.jeep_id && handleHapusJeep(item.jeep_id)
                            }
                            title="Hapus"
                          >
                            <Trash2 size={18} />
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
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(JeepPage);
