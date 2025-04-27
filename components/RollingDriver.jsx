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
      <div className="flex-1 p-6">
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
                      className="bg-[#1C7AC8] text-white py-1 px-4 rounded-[10px] hover:bg-[#155d96] transition-colors"
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




// "use client";
// import { useState } from "react";
// import withAuth from "/src/app/lib/withAuth";

// const initialData = [
//   {
//     lambung: "01",
//     name: "Bunde",
//     status: "Tersedia",
//     kontak: "WhatsApp",
//     konfirmasi: "Bisa",
//     departure: "Pilih Driver",
//   },
//   {
//     lambung: "02",
//     name: "Utari",
//     status: "Tersedia",
//     kontak: "WhatsApp",
//     konfirmasi: "Bisa",
//     departure: "Pilih Driver",
//   },
// ];

// const RollingDriverPage = ({ onKembali, booking }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [data, setData] = useState(initialData);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDriver, setSelectedDriver] = useState(null);

//   const filteredData = data.filter((item) =>
//     item.lambung.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDepartureClick = (driver) => {
//     setSelectedDriver(driver);
//     setShowModal(true);
//   };

//   const handleModalChoice = (canWorkTomorrow) => {
//     if (!selectedDriver) return;

//     const updatedData = data.map((item) =>
//       item.lambung === selectedDriver.lambung
//         ? {
//             ...item,
//             status: canWorkTomorrow ? "On Track" : "Tertunda",
//             konfirmasi: canWorkTomorrow ? "-" : "Tidak Bisa",
//           }
//         : item
//     );

//     const remaining = updatedData.filter((item) => item.lambung !== selectedDriver.lambung);
//     const moved = updatedData.find((item) => item.lambung === selectedDriver.lambung);
//     const newData = [...remaining, moved];

//     setData(newData);
//     setShowModal(false);
//     setSelectedDriver(null);
//   };

//   const handleStatusButtonClick = (driver) => {
//     const updatedData = data.map((item) =>
//       item.lambung === driver.lambung
//         ? {
//             ...item,
//             status: item.status === "On Track" ? "Selesai" : "Tersedia",
//             konfirmasi: item.status === "On Track" ? "-" : item.konfirmasi,
//           }
//         : item
//     );

//     const remaining = updatedData.filter((item) => item.lambung !== driver.lambung);
//     const moved = updatedData.find((item) => item.lambung === driver.lambung);
//     const newData = [...remaining, moved];

//     setData(newData);
//   };

//   return (
//     <div className="flex">
//       <div className="flex flex-col flex-grow p-8">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-[32px] font-semibold text-black">
//             Atur Driver untuk {booking.name}
//           </h1>
//           {/* <button
//             onClick={onKembali}
//             className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
//           >
//             Kembali
//           </button> */}
//         </div>

//         <div className="flex items-center justify-center">
//           <table className="w-290 table-auto">
//             <thead className="text-gray-500">
//               <tr>
//                 <th className="p-2 text-center font-normal">No. Lambung</th>
//                 <th className="p-2 text-center font-normal">Nama Driver</th>
//                 <th className="p-2 text-center font-normal">Status</th>
//                 <th className="p-2 text-center font-normal">Kontak</th>
//                 <th className="p-2 text-center font-normal">Konfirmasi</th>
//                 <th className="p-2 text-center font-normal">Keberangkatan</th>
//                 <th className="p-2 text-center font-normal">Ubah Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((item) => (
//                   <tr
//                     key={item.lambung}
//                     className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="p-2 text-center text-gray-750">{item.lambung}</td>
//                     <td className="p-2 text-center text-gray-750">{item.name}</td>
//                     <td className="p-2 text-center text-gray-750">
//                       <div className="flex items-center justify-center gap-2">
//                         <span
//                           className={`w-3 h-3 rounded-full ${
//                             item.status === "Tersedia"
//                               ? "bg-green-500"
//                               : item.status === "On Track"
//                               ? "bg-red-500"
//                               : item.status === "Tertunda"
//                               ? "bg-[#FBBC05]"
//                               : item.status === "Selesai"
//                               ? "bg-[#3D6CB9]"
//                               : "bg-gray-300"
//                           }`}
//                         ></span>
//                         <span>{item.status}</span>
//                       </div>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <button className="px-3 bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer">
//                         {item.kontak}
//                       </button>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">{item.konfirmasi}</td>
//                     <td className="p-2 text-center text-gray-750">
//                       <button
//                         onClick={() => handleDepartureClick(item)}
//                         disabled={item.status !== "Tersedia"}
//                         className={`px-3 rounded-[10px] text-white ${
//                           item.status === "Tersedia"
//                             ? "bg-[#8FAFD9] hover:bg-[#7ba2d0] cursor-pointer"
//                             : "bg-gray-300 cursor-not-allowed"
//                         }`}
//                       >
//                         {item.departure}
//                       </button>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <button
//                         onClick={() => handleStatusButtonClick(item)}
//                         className={`px-3 rounded-[10px] text-white ${
//                           item.status === "On Track"
//                             ? "bg-[#3D6CB9] hover:bg-blue-600"
//                             : "bg-green-500 hover:bg-green-600"
//                         }`}
//                       >
//                         {item.status === "On Track" ? "Selesai" : "Tersedia"}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="p-4 text-center text-gray-500">
//                     Data tidak ditemukan.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {showModal && selectedDriver && (
//           <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
//               >
//                 &times;
//               </button>
//               <p className="text-lg mb-4 text-center font-medium">
//                 Apakah {selectedDriver.name} bisa bekerja besok?
//               </p>
//               <div className="flex justify-around">
//                 <button
//                   onClick={() => handleModalChoice(true)}
//                   className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//                 >
//                   Iya
//                 </button>
//                 <button
//                   onClick={() => handleModalChoice(false)}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//                 >
//                   Tidak
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default withAuth(RollingDriverPage);
