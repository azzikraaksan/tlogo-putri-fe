"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";

const initialData = [
  {
    lambung: "01",
    name: "Bunde",
    status: "Tersedia",
    kontak: "WhatsApp",
    konfirmasi: "Bisa",
    departure: "Pilih Driver",
  },
  {
    lambung: "02",
    name: "Utari",
    status: "Tersedia",
    kontak: "WhatsApp",
    konfirmasi: "Bisa",
    departure: "Pilih Driver",
  },
];

const PenjadwalanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(initialData);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleButtonClick = (lambung, newStatus) => {
    const updatedData = data.map((d) => {
      if (d.lambung === lambung) {
        return {
          ...d,
          status: newStatus,
          konfirmasi: newStatus === "Tersedia" ? "-" : d.konfirmasi,
        };
      }
      return d;
    });

    const reordered = [
      ...updatedData.filter((d) => d.lambung !== lambung),
      updatedData.find((d) => d.lambung === lambung),
    ];

    setData(reordered);
  };

  const handleStatusChange = (driver) => {
    const updatedData = data.map((item) => {
      if (item.lambung === lambung) {
        if (item.konfirmasi === "Tidak Bisa" && newStatus === "On Track") {
          return item;
        }
        return { ...item, status: newStatus };
      }
      return item;
    });

    const remaining = updatedData.filter((item) => item.lambung !== lambung);
    const moved = updatedData.find((item) => item.lambung === lambung);
    const newData = [...remaining, moved];

    setData(newData);
  };

  const handleToggleStatus = (driver) => {
    const updatedData = data.map((item) => {
      if (item.lambung === driver.lambung) {
        const newStatus = item.status === "Tertunda" ? "Selesai" : "Tertunda";
        return { ...item, status: newStatus };
      }
      return item;
    });

    const remaining = updatedData.filter(
      (item) => item.lambung !== driver.lambung
    );
    const moved = updatedData.find((item) => item.lambung === driver.lambung);
    const newData = [...remaining, moved];

    setData(newData);
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

  const filteredData = data.filter(
    (item) =>
      item.lambung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-[32px] font-semibold mb-6 text-black">Atur Driver</h1>

        <div className="flex justify-end mb-7">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Cari"
          />
        </div>

        <div className="flex items-center justify-center">
          <table className="w-290 table-auto">
            <thead className="text-gray-500">
              <tr>
                <th className="p-2 text-center font-normal">No. Lambung</th>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                <th className="p-2 text-center font-normal">Status</th>
                <th className="p-2 text-center font-normal">Kontak</th>
                <th className="p-2 text-center font-normal">Konfirmasi</th>
                <th className="p-2 text-center font-normal">Keberangkatan</th>
                <th className="p-2 text-center font-normal">Ubah Status</th>
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
                      {item.name}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            item.status === "Tersedia"
                              ? "bg-green-500"
                              : item.status === "On Track"
                                ? "bg-red-500"
                                : item.status === "Tertunda"
                                  ? "bg-[#FBBC05]"
                                  : item.status === "Selesai"
                                    ? "bg-[#3D6CB9]"
                                    : "bg-gray-300"
                          }`}
                        ></span>
                        <span>{item.status}</span>
                      </div>
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      <button className="px-3 bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer">
                        {item.kontak}
                      </button>
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.konfirmasi}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      <button
                        onClick={() => handleDepartureClick(item)}
                        disabled={item.status !== "Tersedia"}
                        className={`px-3 rounded-[10px] text-white cursor-pointer ${
                          item.status === "Tersedia"
                            ? "bg-[#8FAFD9] cursor-pointer"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {item.departure}
                      </button>
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.status === "Tersedia" ? (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-600 rounded-[10px] px-3 cursor-not-allowed"
                        >
                          Tidak Bisa
                        </button>
                      ) : item.status === "On Track" ? (
                        <button
                          onClick={() => {
                            const updatedData = data.map((d) =>
                              d.lambung === item.lambung
                                ? { ...d, status: "Selesai" }
                                : d
                            );
                            const reordered = [
                              ...updatedData.filter(
                                (d) => d.lambung !== item.lambung
                              ),
                              updatedData.find(
                                (d) => d.lambung === item.lambung
                              ),
                            ];
                            setData(reordered);
                          }}
                          className="bg-[#3D6CB9] hover:bg-blue-600 text-white rounded-[10px] px-3 cursor-pointer"
                        >
                          Selesai
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const updatedData = data.map((d) =>
                              d.lambung === item.lambung
                                ? { ...d, status: "Tersedia", konfirmasi: "-" }
                                : d
                            );
                            const reordered = [
                              ...updatedData.filter(
                                (d) => d.lambung !== item.lambung
                              ),
                              updatedData.find(
                                (d) => d.lambung === item.lambung
                              ),
                            ];
                            setData(reordered);
                          }}
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
