"use client";
import { useEffect, useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import LoadingFunny from "/components/LoadingFunny.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";

const PenjadwalanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDriversAndJeeps = async () => {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const [driversRes, jeepsRes] = await Promise.all([
          fetch("https://tpapi.siunjaya.id/api/users/by-role?role=Driver", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://tpapi.siunjaya.id/api/jeeps/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const driversData = await driversRes.json();
        const jeepsData = await jeepsRes.json();

        const drivers = driversData.data || [];
        const jeeps = jeepsData.data || [];

        const mergedData = jeeps.map((jeep) => {
          console.log("jeep driver_id:", jeep.driver_id);
          const driver = drivers.find((d) => d.id === jeep.driver_id);
          console.log("matched driver:", driver);

          return {
            jeep_id: jeep.jeep_id,
            users_id: driver?.id,
            name: driver?.name || "-",
            lambung: jeep.no_lambung,
            plat: jeep.plat_jeep,
            merek: jeep.merek,
            tipe: jeep.tipe,
            status_jeep: jeep.status,
            tahun: jeep.tahun_kendaraan,
            status: driver?.status || "Tidak diketahui",
            foto: jeep.foto_jeep,
            kontak: driver?.telepon,
            konfirmasi: driver?.konfirmasi || "Bisa",
            departure: "Pilih Driver",
          };
        });

        setData(mergedData);
        console.log("driversData:", driversData);
        console.log("jeepsData:", jeepsData);
        console.log("Merged Data:", mergedData);
      } catch (error) {
        console.error("Gagal mengambil data driver dan jeep:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriversAndJeeps();
  }, []);

  const handleDepartureClick = (driver) => {
    if (driver.status === "Tersedia") {
      const updatedData = data.map((item) =>
        item.lambung === driver.lambung
          ? { ...item, status: "On Track", konfirmasi: "-" }
          : item
      );
      const remaining = updatedData.filter(
        (item) => item.lambung !== driver.lambung
      );
      const moved = updatedData.find((item) => item.lambung === driver.lambung);
      const newData = [...remaining, moved];
      setData(newData);
    }
  };

  const handleModalChoice = (canWorkTomorrow) => {
    const updatedData = data.map((item) => {
      if (item.lambung === selectedDriver.lambung) {
        return {
          ...item,
          status: canWorkTomorrow ? "On Track" : "Tertunda",
        };
      }
      return item;
    });

    const remaining = updatedData.filter(
      (item) => item.lambung !== selectedDriver.lambung
    );
    const moved = updatedData.find(
      (item) => item.lambung === selectedDriver.lambung
    );
    const newData = [...remaining, moved];

    setData(newData);
    setShowModal(false);
    setSelectedDriver(null);
  };

  const filteredData = data.filter((item) => {
    const lambungMatch = item.lambung
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nameMatch = item.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return lambungMatch || nameMatch;
  });

  const handleStatusUpdate = async (item, statusBaru) => {
    console.log("Item diterima:", item);
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Token tidak ditemukan");
      return;
    }

    try {
      const response = await fetch(
        `https://tpapi.siunjaya.id/api/jeeps/update/${item.jeep_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: statusBaru }),
        }
      );

      if (!response.ok) throw new Error("Gagal mengubah status");

      const updatedData = data.map((d) =>
        d.jeep_id === item.jeep_id ? { ...d, status_jeep: statusBaru } : d
      );

      const reordered = [
        ...updatedData.filter((d) => d.jeep_id !== item.jeep_id),
        updatedData.find((d) => d.jeep_id === item.jeep_id),
      ];

      setData(reordered);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengubah status Jeep.");
    }
  };

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
        <h1 className="text-[32px] font-semibold mb-6 text-black">
          Kelola Driver
        </h1>

        <div className="flex justify-end mb-7">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Cari"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow max-h-[520px] overflow-y-auto">
          <table className="w-full table-auto">
            <thead className="bg-[#3D6CB9] text-white sticky top-0">
              <tr>
                <th className="p-2 text-center font-normal">No</th>
                <th className="p-2 text-center font-normal">No. Lambung</th>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                <th className="p-2 text-center font-normal">Status Jeep</th>
                <th className="p-2 text-center font-normal">Kontak</th>
                <th className="p-2 text-center font-normal">Ubah Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={`${item.users_id}-${item.lambung}`}
                    className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-2 text-center text-gray-750">{index + 1}</td>
                    <td className="p-2 text-center text-gray-750">
                      {item.lambung}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.name}
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
                    <td className="p-2 text-center text-gray-750">
                      <button
                        onClick={() =>
                          window.open(
                            `https://wa.me/${item.kontak.replace(/^0/, "62")}`,
                            "_blank"
                          )
                        }
                        className="px-3 rounded-[10px] text-white bg-green-500 hover:bg-green-600 cursor-pointer inline-block"
                      >
                        WhatsApp 
                      </button>
                    </td>

                    <td className="p-2 text-center">
                      {item.status_jeep === "Tersedia" ? (
                        <button
                          onClick={() => handleStatusUpdate(item, "On Track")}
                          className="bg-red-500 text-white hover:bg-red-600 rounded-[10px] px-3 cursor-pointer"
                        >
                          On Track
                        </button>
                      ) : item.status_jeep === "On Track" ? (
                        <button
                          onClick={() => handleStatusUpdate(item, "Tersedia")}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-[10px] px-3 cursor-pointer"
                        >
                          Tersedia
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(item, "Tersedia")}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-[10px] px-3 cursor-pointer"
                        >
                          Tersedia
                        </button>
                      )}
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

        {showModal && selectedDriver && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl cursor-pointer"
              >
                &times;
              </button>

              <p className="text-lg mb-4 text-center font-medium">
                Apakah {selectedDriver.name} bisa bekerja besok?
              </p>
              <div className="flex justify-around">
                <button
                  onClick={() => handleModalChoice(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded cursor-pointer"
                >
                  Iya
                </button>
                <button
                  onClick={() => handleModalChoice(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded cursor-pointer"
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(PenjadwalanPage);
