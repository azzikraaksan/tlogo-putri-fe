"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";

const initialData = [
  {
    id: 1,
    lambung: "01",
    name: "Bunde",
    status: "Tersedia",
    kontak: "WhatsApp",
    konfirmasi: "Bisa",
  },
  {
    id: 2,
    lambung: "02",
    name: "Utari",
    status: "Tersedia",
    kontak: "WhatsApp",
    konfirmasi: "Bisa",
  },
];

const RollingDriverPage = () => {
  const [drivers, setDrivers] = useState(initialData);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const router = useRouter();

  const handleSelectDriver = (driver) => {
    const updatedDrivers = drivers.map((d) =>
      d.id === driver.id ? { ...d, status: "On Track" } : d
    );
    setDrivers(updatedDrivers);
    setSelectedDrivers((prev) => [...prev, driver]);
  };

  const handleGoToTicketing = () => {
    localStorage.setItem("selectedDrivers", JSON.stringify(selectedDrivers));
    router.push("/dashboard/operasional/ticketing");
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <h1 className="text-[32px] font-semibold mb-6 text-black">
          Rolling Driver
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-gray-500">
              <tr>
                <th className="p-2 text-center font-normal">No. Lambung</th>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                <th className="p-2 text-center font-normal">Status</th>
                <th className="p-2 text-center font-normal">Kontak</th>
                <th className="p-2 text-center font-normal">Konfirmasi</th>
                <th className="p-2 text-center font-normal">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                >
                  <td className="p-2 text-center text-gray-750">
                    {driver.lambung}
                  </td>
                  <td className="p-2 text-center text-gray-750">
                    {driver.name}
                  </td>
                  <td className="p-2 text-center text-gray-750">
                    {driver.status}
                  </td>
                  <td className="p-2 text-center text-gray-750">
                    {driver.kontak}
                  </td>
                  <td className="p-2 text-center text-gray-750">
                    {driver.konfirmasi}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleSelectDriver(driver)}
                      className="bg-[#1C7AC8] text-white px-2 rounded-[10px] hover:bg-[#155d96] transition-colors cursor-pointer"
                      disabled={driver.status === "On Track"}
                    >
                      {driver.status === "On Track" ? "Sudah Dipilih" : "Pilih Driver"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedDrivers.length > 0 && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleGoToTicketing}
              className="bg-green-600 text-white py-2 px-6 rounded-[10px] hover:bg-green-700 transition-colors"
            >
              Lanjut ke Ticketing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(RollingDriverPage);
