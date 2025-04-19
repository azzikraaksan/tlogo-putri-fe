// "use client";
// import { useState } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import { useRouter } from "next/navigation";

// const dummyData = [
//   {
//     lambung: "01",
//     name: "Bunde",
//     status: "Tersedia",
//     konfirmasi: "WhatsApp",
//     departure: "Pilih Driver",
//   },
//   {
//     lambung: "02",
//     name: "Sobray",
//     status: "Tersedia",
//     konfirmasi: "WhatsApp",
//     departure: "Pilih Driver",
//   },
//   {
//     lambung: "03",
//     name: "Zimut",
//     status: "On Track",
//     konfirmasi: "WhatsApp",
//     departure: "Pilih Driver",
//   },
//   {
//     lambung: "04",
//     name: "Peh",
//     status: "Tertunda",
//     konfirmasi: "WhatsApp",
//     departure: "Pilih Driver",
//   },
//   {
//     lambung: "05",
//     name: "Naon Maneh",
//     status: "Selesai",
//     konfirmasi: "WhatsApp",
//     departure: "Pilih Driver",
//   },
//   {
//     lambung: "06",
//     name: "Maneh Saha",
//     status: "Selesai",
//     konfirmasi: "WhatsApp",
//     departure: "Pilih Driver",
//   },
// ];

// const PenjadwalanPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedIds, setSelectedIds] = useState([]);
//   const router = useRouter();

//   const filteredData = dummyData.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleCheckboxChange = (lambung) => {
//     setSelectedIds((prevSelectedIds) => {
//       if (prevSelectedIds.includes(lambung)) return prevSelectedIds;
//       return [...prevSelectedIds, lambung];
//     });
//   };

//   const sortedData = [
//     ...filteredData.filter((item) => !selectedIds.includes(item.lambung)),
//     ...filteredData.filter((item) => selectedIds.includes(item.lambung)),
//   ];

//   // const handleAturJadwal = (id) => {
//   //   router.push(`/dashboard_fo/penjadwalan/rolling-driver`);
//   // };
//   const handleAturJadwal = (lambung) => {
//     setSelectedIds((prevSelectedIds) => {
//       if (prevSelectedIds.includes(lambung)) return prevSelectedIds;
//       return [...prevSelectedIds, lambung];
//     });

//     router.push(`/dashboard_fo/penjadwalan/rolling-driver`);
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-5xl font-semibold mb-6 text-black">
//           Rolling Driver
//         </h1>

//         <div className="flex justify-end mb-7">
//           <div className="relative w-72 max-w-sm">
//             <input
//               type="text"
//               placeholder="Search"
//               className="border border-gray-300 rounded-[13px] px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-black-200"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button
//                 type="button"
//                 onClick={() => setSearchTerm("")}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
//               >
//                 &times;
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center justify-center">
//           <table className="w-290 table-auto">
//             <thead className="text-gray-500">
//               <tr>
//                 <th className="p-2 text-center font-normal">No Lambung</th>
//                 <th className="p-2 text-center font-normal">Nama Driver</th>
//                 <th className="p-2 text-center font-normal">Status</th>
//                 <th className="p-2 text-center font-normal">Konfirmasi</th>
//                 <th className="p-2 text-center font-normal">Keberangkatan</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedData.length > 0 ? (
//                 sortedData.map((item) => (
//                   <tr
//                     key={item.lambung}
//                     className="border-t hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="p-2 text-center text-gray-750">
//                       {item.lambung}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.name}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <div className="flex items-center justify-center gap-2">
//                         <span
//                           className={`w-3 h-3 rounded-full ${
//                             item.status === "Tersedia"
//                               ? "bg-green-500"
//                               : item.status === "On Track"
//                                 ? "bg-red-500"
//                                 : item.status === "Tertunda"
//                                   ? "bg-orange-500"
//                                   : item.status === "Selesai"
//                                     ? "bg-blue-500"
//                                     : "bg-gray-300"
//                           }`}
//                         ></span>
//                         <span>{item.status}</span>
//                       </div>
//                     </td>

//                     <td className="p-2 text-center text-gray-750">
//                       <button
//                         onClick={() => handleAturJadwal(item.konfirmasi)}
//                         className="w-30 bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] cursor-pointer"
//                       >
//                         {item.konfirmasi}
//                       </button>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <button
//                         onClick={() =>
//                           item.status === "Tersedia" &&
//                           handleAturJadwal(item.departure)
//                         }
//                         disabled={item.status !== "Tersedia"}
//                         className={`w-30 rounded-[10px] text-white ${
//                           item.status === "Tersedia"
//                             ? "bg-[#8FAFD9] cursor-pointer"
//                             : "bg-gray-300 cursor-not-allowed"
//                         }`}
//                       >
//                         {item.departure}
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
//       </div>
//     </div>
//   );
// };

// export default withAuth(PenjadwalanPage);

"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";

const initialData = [
  { lambung: "01", name: "Bunde", status: "Tersedia", kontak: "WhatsApp", konfirmasi: "Bisa", departure: "Pilih Driver" },
  { lambung: "02", name: "Utari", status: "Tersedia", kontak: "WhatsApp", konfirmasi: "Bisa", departure: "Pilih Driver" },
  { lambung: "03", name: "Zimut", status: "On Track", kontak: "WhatsApp", konfirmasi: "-", departure: "Pilih Driver" },
  { lambung: "04", name: "Peh", status: "Tertunda", kontak: "WhatsApp", konfirmasi: "Tidak Bisa", departure: "Pilih Driver" },
  { lambung: "05", name: "Naon Maneh", status: "Selesai", kontak: "WhatsApp", konfirmasi: "-", departure: "Pilih Driver" },
  { lambung: "06", name: "Maneh Saha", status: "Selesai", kontak: "WhatsApp", konfirmasi: "-", departure: "Pilih Driver" },
];

const PenjadwalanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(initialData);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDepartureClick = (driver) => {
    if (driver.status === "Tersedia") {
      const updatedData = data.map((item) =>
        item.lambung === driver.lambung ? { ...item, status: "On Track" } : item
      );
      const remaining = updatedData.filter((item) => item.lambung !== driver.lambung);
      const moved = updatedData.find((item) => item.lambung === driver.lambung);
      const newData = [...remaining, moved];
      setData(newData);
    }
  };

  const handleToggleStatus = (driver) => {
    const updatedData = data.map((item) => {
      if (item.lambung === driver.lambung) {
        const newStatus = item.status === "Tertunda" ? "Selesai" : "Tertunda";
        return { ...item, status: newStatus };
      }
      return item;
    });

    const remaining = updatedData.filter((item) => item.lambung !== driver.lambung);
    const moved = updatedData.find((item) => item.lambung === driver.lambung);
    const newData = [...remaining, moved];

    setData(newData);
  };

  const handleStatusChange = (lambung, newStatus) => {
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

    const remaining = updatedData.filter((item) => item.lambung !== selectedDriver.lambung);
    const moved = updatedData.find((item) => item.lambung === selectedDriver.lambung);
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
        <h1 className="text-5xl font-semibold mb-6 text-black">Atur Driver</h1>

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
                  <tr key={item.lambung} className="border-t border-[#808080] hover:bg-gray-50 transition-colors">
                    <td className="p-2 text-center text-gray-750">{item.lambung}</td>
                    <td className="p-2 text-center text-gray-750">{item.name}</td>
                    <td className="p-2 text-center text-gray-750">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            item.status === "Tersedia"
                              ? "bg-green-500"
                              : item.status === "On Track"
                              ? "bg-red-500"
                              : item.status === "Tertunda"
                              ? "bg-orange-500"
                              : item.status === "Selesai"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                        <span>{item.status}</span>
                      </div>
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      <button className="w-30 bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer">
                        {item.kontak}
                      </button>
                    </td>
                    <td className="p-2 text-center text-gray-750">{item.konfirmasi}</td>
                    <td className="p-2 text-center text-gray-750">
                      <button
                        onClick={() => handleDepartureClick(item)}
                        disabled={item.status !== "Tersedia"}
                        className={`w-30 rounded-[10px] text-white ${
                          item.status === "Tersedia"
                            ? "bg-[#8FAFD9] cursor-pointer"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {item.departure}
                      </button>
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.lambung, e.target.value)}
                        disabled={
                          (item.status === "Tersedia" && item.konfirmasi !== "Tidak Bisa") ||
                          (item.konfirmasi === "Tidak Bisa" &&
                            item.status !== "Tertunda" &&
                            item.status !== "Tersedia")
                        }
                        className={`rounded-[10px] px-2 py-1 ${
                          (item.status === "Tersedia" && item.konfirmasi !== "Tidak Bisa") ||
                          (item.konfirmasi === "Tidak Bisa" &&
                            item.status !== "Tertunda" &&
                            item.status !== "Tersedia")
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600 text-white"
                        }`}
                      >
                        {item.status === "On Track" && <option value="Selesai">Selesai</option>}
                        {(item.status === "Tertunda" ||
                          item.status === "Selesai" ||
                          item.konfirmasi === "Tidak Bisa") && (
                          <option value="Tersedia">Tersedia</option>
                        )}
                      </select>
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
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Iya
                </button>
                <button
                  onClick={() => handleModalChoice(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
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


// "use client";
// import { useState } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";
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
//   {
//     lambung: "03",
//     name: "Zimut",
//     status: "On Track",
//     kontak: "WhatsApp",
//     konfirmasi: "-",
//     departure: "Pilih Driver",
//   },
//   {
//     lambung: "04",
//     name: "Peh",
//     status: "Tertunda",
//     kontak: "WhatsApp",
//     konfirmasi: "Tidak Bisa",
//     departure: "Pilih Driver",
//   },
//   {
//     lambung: "05",
//     name: "Naon Maneh",
//     status: "Selesai",
//     kontak: "WhatsApp",
//     konfirmasi: "-",
//     departure: "Pilih Driver",
//   },
//   {
//     lambung: "06",
//     name: "Maneh Saha",
//     status: "Selesai",
//     kontak: "WhatsApp",
//     konfirmasi: "-",
//     departure: "Pilih Driver",
//   },
// ];

// const PenjadwalanPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [data, setData] = useState(initialData);
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const handleDepartureClick = (driver) => {
//     if (driver.status === "Tersedia") {
//       const updatedData = data.map((item) =>
//         item.lambung === driver.lambung ? { ...item, status: "On Track" } : item
//       );
//       const remaining = updatedData.filter((item) => item.lambung !== driver.lambung);
//       const moved = updatedData.find((item) => item.lambung === driver.lambung);
//       const newData = [...remaining, moved];
//       setData(newData);
//     }
//   };  

//   const handleToggleStatus = (driver) => {
//     const updatedData = data.map((item) => {
//       if (item.lambung === driver.lambung) {
//         const newStatus = item.status === "Tertunda" ? "Selesai" : "Tertunda";
//         return { ...item, status: newStatus };
//       }
//       return item;
//     });

//     const remaining = updatedData.filter(
//       (item) => item.lambung !== driver.lambung
//     );
//     const moved = updatedData.find((item) => item.lambung === driver.lambung);
//     const newData = [...remaining, moved];

//     setData(newData);
//   };

//   const handleStatusChange = (lambung, newStatus) => {
//     const updatedData = data.map((item) => {
//       if (item.lambung === lambung) {
//         if (item.konfirmasi === "Tidak Bisa" && newStatus !== "Tersedia") {
//           return item;
//         }
//         return { ...item, status: newStatus };
//       }
//       return item;
//     });
  
//     const remaining = updatedData.filter((item) => item.lambung !== lambung);
//     const moved = updatedData.find((item) => item.lambung === lambung);
//     const newData = [...remaining, moved];
//     setData(newData);
//   };
  

//     const remaining = updatedData.filter((item) => item.lambung !== lambung);
//     const moved = updatedData.find((item) => item.lambung === lambung);
//     const newData = [...remaining, moved];

//     setData(newData);
//   };

//   const handleModalChoice = (canWorkTomorrow) => {
//     const updatedData = data.map((item) => {
//       if (item.lambung === selectedDriver.lambung) {
//         return {
//           ...item,
//           status: canWorkTomorrow ? "On Track" : "Tertunda",
//         };
//       }
//       return item;
//     });

//     const remaining = updatedData.filter(
//       (item) => item.lambung !== selectedDriver.lambung
//     );
//     const moved = updatedData.find(
//       (item) => item.lambung === selectedDriver.lambung
//     );
//     const newData = [...remaining, moved];

//     setData(newData);
//     setShowModal(false);
//     setSelectedDriver(null);
//   };

//   const filteredData = data.filter(
//     (item) =>
//       item.lambung.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-5xl font-semibold mb-6 text-black">Atur Driver</h1>

//         <div className="flex justify-end mb-7">
//           <SearchInput
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onClear={() => setSearchTerm("")}
//             placeholder="Cari"
//           />
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
//                     <td className="p-2 text-center text-gray-750">
//                       {item.lambung}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.name}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <div className="flex items-center justify-center gap-2">
//                         <span
//                           className={`w-3 h-3 rounded-full ${
//                             item.status === "Tersedia"
//                               ? "bg-green-500"
//                               : item.status === "On Track"
//                                 ? "bg-red-500"
//                                 : item.status === "Tertunda"
//                                   ? "bg-orange-500"
//                                   : item.status === "Selesai"
//                                     ? "bg-blue-500"
//                                     : "bg-gray-300"
//                           }`}
//                         ></span>
//                         <span>{item.status}</span>
//                       </div>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <button className="w-30 bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer">
//                         {item.kontak}
//                       </button>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.konfirmasi}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <button
//                         onClick={() => handleDepartureClick(item)}
//                         disabled={item.status !== "Tersedia"}
//                         className={`w-30 rounded-[10px] text-white ${
//                           item.status === "Tersedia"
//                             ? "bg-[#8FAFD9] cursor-pointer"
//                             : "bg-gray-300 cursor-not-allowed"
//                         }`}
//                       >
//                         {item.departure}
//                       </button>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <select
//                         value={item.status}
//                         onChange={(e) =>
//                           handleStatusChange(item.lambung, e.target.value)
//                         }
//                         disabled={
//                           (item.status === "Tersedia" &&
//                             item.konfirmasi !== "Tidak Bisa") ||
//                           (item.konfirmasi === "Tidak Bisa" &&
//                             item.status !== "Tertunda" &&
//                             item.status !== "Tersedia")
//                         }
//                         className={`rounded-[10px] px-2 py-1 ${
//                           (item.status === "Tersedia" &&
//                             item.konfirmasi !== "Tidak Bisa") ||
//                           (item.konfirmasi === "Tidak Bisa" &&
//                             item.status !== "Tertunda" &&
//                             item.status !== "Tersedia")
//                             ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                             : "bg-yellow-500 hover:bg-yellow-600 text-white"
//                         }`}
//                       >
//                         {item.status === "On Track" && (
//                           <option value="Selesai">Selesai</option>
//                         )}
//                         {(item.status === "Tertunda" ||
//                           item.status === "Selesai" ||
//                           item.konfirmasi === "Tidak Bisa") && (
//                           <option value="Tersedia">Tersedia</option>
//                         )}
//                       </select>
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
//                 className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl cursor-pointer"
//               >
//                 &times;
//               </button>

//               <p className="text-lg mb-4 text-center font-medium">
//                 Apakah {selectedDriver.name} bisa bekerja besok?
//               </p>
//               <div className="flex justify-around">
//                 <button
//                   onClick={() => handleModalChoice(true)}
//                   className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
//                 >
//                   Iya
//                 </button>
//                 <button
//                   onClick={() => handleModalChoice(false)}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
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

// export default withAuth(PenjadwalanPage);
