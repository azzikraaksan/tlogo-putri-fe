"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { RefreshCcw } from "lucide-react";

const PenjadwalanPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [rotationId, setRotationId] = useState(null);

  useEffect(() => {
    const fetchDriversAndJeeps = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const [driversRes, jeepsRes] = await Promise.all([
          fetch("http://localhost:8000/api/users/by-role?role=DRIVER", {
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
          const driver = drivers.find((d) => d.id === jeep.users_id);
          return {
            id_jeep: jeep.jeep_id,
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
            kontak: "WhatsApp",
            konfirmasi: "Bisa",
            departure: "Pilih Driver",
          };
        });

        setData(mergedData);
      } catch (error) {
        console.error("Gagal mengambil data driver dan jeep:", error);
      }
    };

    fetchDriversAndJeeps();
  }, []);

  // const handleRolling = () => {
  //   alert("Fitur rolling belum diimplementasikan.");
  // };

  const handleRolling = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8000/api/driver-rotations/generate",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Gagal generate driver rotation");

      await res.json();
      alert("Generate rotation berhasil. Silakan pilih driver.");
    } catch (error) {
      console.error("Gagal generate rotation:", error);
      alert("Gagal generate rotation. Coba lagi.");
    }
  };

  // const handleRolling = async () => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     alert("Token tidak ditemukan. Silakan login ulang.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch(
  //       "http://localhost:8000/api/driver-rotations/generate",
  //       {
  //         method: "POST",
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (!res.ok) throw new Error("Gagal generate driver rotation");

  //     const result = await res.json();
  //     // setRotationId(result.data.id_jeep);
  //     alert("Generate rotation berhasil. Silakan pilih driver.");
  //   } catch (error) {
  //     console.error("Gagal generate rotation:", error);
  //     alert("Gagal generate rotation. Coba lagi.");
  //   }
  // };

  const handleDepartureClick = async (driver) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Token tidak ditemukan. Silakan login ulang.");
    return;
  }

  try {
    // misal endpoint assign-nya fixed, contoh pakai id rotation = 1
    const assignRes = await fetch(
      `http://localhost:8000/api/driver-rotations/25/assign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          driver_id: driver.users_id,
          jeep_id: driver.id_jeep,
        }),
      }
    );

    if (!assignRes.ok) throw new Error("Gagal assign driver");

    const updatedData = data.map((item) =>
      item.lambung === driver.lambung
        ? {
            ...item,
            status: "Tidak Tersedia",
            status_jeep: "Tidak Tersedia",
            konfirmasi: "-",
          }
        : item
    );
    setData(updatedData);
    setSelectedDriver(driver);

    alert("Driver berhasil ditugaskan.");
  } catch (error) {
    console.error("Gagal assign driver:", error);
    alert("Gagal menugaskan driver.");
  }
};


  // const handleDepartureClick = async (driver) => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     alert("Token tidak ditemukan. Silakan login ulang.");
  //     return;
  //   }

  //   // if (!rotationId) {
  //   //   alert("Silakan klik 'Rolling Driver' terlebih dahulu.");
  //   //   return;
  //   // }

  //   try {
  //     const assignRes = await fetch(
  //       `http://localhost:8000/api/driver-rotations/${rotationId}/assign`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           driver_id: driver.users_id,
  //           jeep_id: driver.id_jeep,
  //         }),
  //       }
  //     );

  //     if (!assignRes.ok) throw new Error("Gagal assign driver");

  //     const updatedData = data.map((item) =>
  //       item.lambung === driver.lambung
  //         ? {
  //             ...item,
  //             status: "Tidak Tersedia",
  //             status_jeep: "Tidak Tersedia",
  //             konfirmasi: "-",
  //           }
  //         : item
  //     );
  //     setData(updatedData);
  //     setSelectedDriver(driver);

  //     alert("Driver berhasil ditugaskan.");
  //   } catch (error) {
  //     console.error("Gagal assign driver:", error);
  //     alert("Gagal menugaskan driver.");
  //   }
  // };

  // const handleDepartureClick = async (driver) => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     alert("Token tidak ditemukan. Silakan login ulang.");
  //     return;
  //   }

  //   const updatedData = data.map((item) =>
  //     item.lambung === driver.lambung
  //       ? {
  //           ...item,
  //           status: "Tidak Tersedia",
  //           status_jeep: "Tidak Tersedia",
  //           konfirmasi: "-",
  //         }
  //       : item
  //   );
  //   setData(updatedData);
  //   setSelectedDriver(driver);

  //   try {
  //     const res = await fetch(
  //       `http://localhost:8000/api/jeeps/update/${driver.id_jeep}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ status: "Tidak Tersedia" }),
  //       }
  //     );

  //     if (!res.ok) throw new Error("Gagal update status jeep di server");

  //   const generateRes = await fetch(
  //     "http://localhost:8000/api/driver-rotations/generate",
  //     {
  //       method: "POST",
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );

  //   if (!generateRes.ok) throw new Error("Gagal generate driver rotation");

  //   const generateData = await generateRes.json();
  //   console.log("Driver rotation berhasil dibuat:", generateData);
  // } catch (error) {
  //   console.error("Error:", error);

  //     const rollbackData = data.map((item) =>
  //       item.lambung === driver.lambung
  //         ? {
  //             ...item,
  //             status: "Tersedia",
  //             status_jeep: "Tersedia",
  //             konfirmasi: "Bisa",
  //           }
  //         : item
  //     );
  //     setData(rollbackData);
  //     setSelectedDriver(null);
  //     alert("Terjadi kesalahan. Silakan coba lagi.");
  //   }
  // };

  const filteredData = data.filter((item) => {
    const lambungMatch = item.lambung
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nameMatch = item.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return lambungMatch || nameMatch;
  });

  const handleLanjutTicketing = () => {
    router.push("/dashboard/operasional/ticketing");
  };

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-[32px] font-semibold mb-6 text-black">
          Atur Driver
        </h1>

        <div>
          <div className="flex justify-end mb-3">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              placeholder="Cari"
            />
          </div>
          <div className="flex justify-end mb-6">
            <button
              className="bg-[#8FAFD9] text-white px-2 py-1 rounded-xl cursor-pointer hover:bg-[#7ba2d0] transition"
              onClick={handleRolling}
            >
              Rolling Driver
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl">
          <table className="w-full table-auto">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                <th className="p-2 text-center font-normal">No. Lambung</th>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                <th className="p-2 text-center font-normal">Status Jeep</th>
                <th className="p-2 text-center font-normal">Kontak</th>
                <th className="p-2 text-center font-normal">Konfirmasi</th>
                <th className="p-2 text-center font-normal">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={`${item.users_id}-${item.lambung}`}
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
                            item.status_jeep === "Tersedia"
                              ? "bg-green-500"
                              : item.status_jeep === "Tidak Tersedia"
                                ? "bg-gray-300"
                                : item.status_jeep === "Tertunda"
                                  ? "bg-yellow-400"
                                  : item.status_jeep === "Selesai"
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                          }`}
                        ></span>
                        <span>{item.status_jeep}</span>
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
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDepartureClick(item)}
                        className={`px-2 rounded-[10px] transition-colors ${
                          item.status_jeep === "Tidak Tersedia" ||
                          item.konfirmasi?.toLowerCase() !== "bisa"
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-[#3D6CB9] text-white hover:bg-[#155d96] cursor-pointer"
                        }`}
                        disabled={
                          item.status_jeep === "Tidak Tersedia" ||
                          item.konfirmasi?.toLowerCase() !== "bisa"
                        }
                      >
                        {item.status_jeep === "Tidak Tersedia"
                          ? "Sudah Dipilih"
                          : "Pilih Driver"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedDriver && (
          <div className="mt-6 flex justify-end">
            <button
              className="bg-[#8FAFD9] text-white px-2 py-1 rounded-xl cursor-pointer hover:bg-[#7ba2d0] transition"
              onClick={handleLanjutTicketing}
            >
              Lanjut ke Ticketing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(PenjadwalanPage);

// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";
// import withAuth from "/src/app/lib/withAuth";

// const PenjadwalanPage = () => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [data, setData] = useState([]);
//   const [selectedDriver, setSelectedDriver] = useState(null);

//   useEffect(() => {
//     const fetchDriversAndJeeps = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       try {
//         const [driversRes, jeepsRes] = await Promise.all([
//           fetch("http://localhost:8000/api/users/by-role?role=DRIVER", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch("http://localhost:8000/api/jeeps/all", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         const driversData = await driversRes.json();
//         const jeepsData = await jeepsRes.json();

//         const drivers = driversData.data || [];
//         const jeeps = jeepsData.data || [];

//         const mergedData = jeeps.map((jeep) => {
//           const driver = drivers.find((d) => d.id === jeep.users_id);
//           return {
//             id_jeep: jeep.jeep_id,
//             users_id: driver?.id,
//             name: driver?.name || "-",
//             lambung: jeep.no_lambung,
//             plat: jeep.plat_jeep,
//             merek: jeep.merek,
//             tipe: jeep.tipe,
//             status_jeep: jeep.status,
//             tahun: jeep.tahun_kendaraan,
//             status: driver?.status || "Tidak diketahui",
//             foto: jeep.foto_jeep,
//             kontak: "WhatsApp",
//             konfirmasi: "Bisa",
//             departure: "Pilih Driver",
//           };
//         });

//         setData(mergedData);
//       } catch (error) {
//         console.error("Gagal mengambil data driver dan jeep:", error);
//       }
//     };

//     fetchDriversAndJeeps();
//   }, []);

//   const handleDepartureClick = async (driver) => {
//     const updatedData = data.map((item) =>
//       item.lambung === driver.lambung
//         ? {
//             ...item,
//             status: "Tidak Tersedia",
//             status_jeep: "Tidak Tersedia",
//             konfirmasi: "-",
//           }
//         : item
//     );
//     setData(updatedData);
//     setSelectedDriver(driver);

//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("Token tidak ditemukan");

//       const res = await fetch(
//         `http://localhost:8000/api/jeeps/update/${driver.id_jeep}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             status: "Tidak Tersedia",
//           }),
//         }
//       );

//       if (!res.ok) throw new Error("Gagal update status jeep di server");

//       const generateRes = await fetch(
//         "http://localhost:8000/api/driver-rotations/generate",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!generateRes.ok)
//         throw new Error("Gagal generate driver rotation di server");

//       const generateData = await generateRes.json();
//       console.log("Driver rotation berhasil dibuat:", generateData);
//     } catch (error) {
//       console.error("Error:", error);

//       // Rollback jika gagal
//       const rollbackData = data.map((item) =>
//         item.lambung === driver.lambung
//           ? {
//               ...item,
//               status: "Tersedia",
//               status_jeep: "Tersedia",
//               konfirmasi: "Bisa",
//             }
//           : item
//       );
//       setData(rollbackData);
//       setSelectedDriver(null);
//       alert("Terjadi kesalahan. Silakan coba lagi.");
//     }
//   };

//   // const handleDepartureClick = async (driver) => {
//   //   const updatedData = data.map((item) =>
//   //     item.lambung === driver.lambung
//   //       ? {
//   //           ...item,
//   //           status: "Tidak Tersedia",
//   //           status_jeep: "Tidak Tersedia",
//   //           konfirmasi: "-",
//   //         }
//   //       : item
//   //   );
//   //   setData(updatedData);

//   //   setSelectedDriver(driver);
//   //   try {
//   //     const token = localStorage.getItem("access_token");
//   //     if (!token) throw new Error("Token tidak ditemukan");

//   //     const res = await fetch(
//   //       `http://localhost:8000/api/jeeps/update/${driver.id_jeep}`,
//   //       {
//   //         method: "PUT",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //         body: JSON.stringify({
//   //           status: "Tidak Tersedia",
//   //         }),
//   //       }
//   //     );

//   //     if (!res.ok) throw new Error("Gagal update status jeep di server");
//   //   } catch (error) {
//   //     console.error("Error update status jeep:", error);
//   //     const rollbackData = data.map((item) =>
//   //       item.lambung === driver.lambung
//   //         ? {
//   //             ...item,
//   //             status: "Tersedia",
//   //             status_jeep: "Tersedia",
//   //             konfirmasi: "Bisa",
//   //           }
//   //         : item
//   //     );
//   //     setData(rollbackData);
//   //     setSelectedDriver(null);
//   //     alert("Gagal update status jeep. Silakan coba lagi.");
//   //   }
//   // };

//   const filteredData = data.filter((item) => {
//     const lambungMatch = item.lambung
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const nameMatch = item.name
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return lambungMatch || nameMatch;
//   });

//   const handleSelectDriver = (driver) => {
//     setSelectedDriver(driver);
//     setShowModal(true);
//   };

//   const handleLanjutTicketing = () => {
//     router.push("/dashboard/operasional/ticketing");
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-[32px] font-semibold mb-6 text-black">
//           Atur Driver
//         </h1>
//         <div className="flex justify-end mb-7">
//           <SearchInput
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onClear={() => setSearchTerm("")}
//             placeholder="Cari"
//           />
//         </div>
//         <div className="overflow-x-auto bg-white rounded-xl">
//           <table className="w-full table-auto">
//             <thead className="bg-[#3D6CB9] text-white ">
//               <tr>
//                 <th className="p-2 text-center font-normal">No. Lambung</th>
//                 <th className="p-2 text-center font-normal">Nama Driver</th>
//                 <th className="p-2 text-center font-normal">Status Jeep</th>
//                 <th className="p-2 text-center font-normal">Kontak</th>
//                 <th className="p-2 text-center font-normal">Konfirmasi</th>
//                 <th className="p-2 text-center font-normal">Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((item) => (
//                   <tr
//                     key={`${item.users_id}-${item.lambung}`}
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
//                             item.status_jeep === "Tersedia"
//                               ? "bg-green-500"
//                               : item.status_jeep === "Tidak Tersedia"
//                                 ? "bg-gray-300"
//                                 : item.status_jeep === "Tertunda"
//                                   ? "bg-[#FBBC05]"
//                                   : item.status_jeep === "Selesai"
//                                     ? "bg-[#3D6CB9]"
//                                     : "bg-gray-300"
//                           }`}
//                         ></span>
//                         <span>{item.status_jeep}</span>
//                       </div>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <button className="px-3 bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer">
//                         {item.kontak}
//                       </button>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.konfirmasi}
//                     </td>
//                     <td className="p-2 text-center">
//                       <button
//                         onClick={() => handleDepartureClick(item)}
//                         className={`px-2 rounded-[10px] transition-colors ${
//                           item.status_jeep === "Tidak Tersedia" ||
//                           item.konfirmasi?.toLowerCase() !== "bisa"
//                             ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                             : "bg-[#3D6CB9] text-white hover:bg-[#155d96] cursor-pointer"
//                         }`}
//                         disabled={
//                           item.status_jeep === "Tidak Tersedia" ||
//                           item.konfirmasi?.toLowerCase() !== "bisa"
//                         }
//                       >
//                         {item.status_jeep === "Tidak Tersedia"
//                           ? "Sudah Dipilih"
//                           : "Pilih Driver"}
//                       </button>
//                     </td>

//                     {/* <td className="p-2 text-center">
//                       <button
//                         onClick={() => handleDepartureClick(item)}
//                         className={`px-2 rounded-[10px] transition-colors ${
//                           item.status === "Tidak Tersedia" ||
//                           item.konfirmasi.toLowerCase() !== "bisa"
//                             ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                             : "bg-[#1C7AC8] text-white hover:bg-[#155d96] cursor-pointer"
//                         }`}
//                         disabled={
//                           item.status === "Tidak Tersedia" ||
//                           item.konfirmasi.toLowerCase() !== "bisa"
//                         }
//                       >
//                         {item.status === "Tidak Tersedia"
//                           ? "Sudah Dipilih"
//                           : "Pilih Driver"}
//                       </button>
//                     </td> */}
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

//           {selectedDriver && (
//             <div className="mt-6 text-right">
//               <button
//                 onClick={handleLanjutTicketing}
//                 className="bg-green-600 text-white px-3 py-1 rounded-xl hover:bg-green-800 transition cursor-pointer"
//               >
//                 Lanjut ke Ticketing
//               </button>
//             </div>
//           )}
//         </div>{" "}
//       </div>
//     </div>
//   );
// };

// export default withAuth(PenjadwalanPage);

// "use client";
// import { useState } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import { useRouter, useParams } from "next/navigation";
// import withAuth from "/src/app/lib/withAuth";

// const initialData = [
//   {
//     id: 1,
//     lambung: "01",
//     name: "Bunde",
//     status: "Tersedia",
//     kontak: "WhatsApp",
//     konfirmasi: "Bisa",
//   },
//   {
//     id: 2,
//     lambung: "02",
//     name: "Utari",
//     status: "Tersedia",
//     kontak: "WhatsApp",
//     konfirmasi: "Bisa",
//   },
// ];

// const RollingDriverPage = () => {
//   const { id: bookingCode } = useParams();
//   const [drivers, setDrivers] = useState(initialData);
//   const [selectedDrivers, setSelectedDrivers] = useState([]);
//   const router = useRouter();

//   const handleSelectDriver = (driver) => {
//     const updatedDrivers = drivers.map((d) =>
//       d.id === driver.id ? { ...d, status: "On Track" } : d
//     );
//     setDrivers(updatedDrivers);
//     setSelectedDrivers((prev) => [...prev, driver]);
//   };

//   const handleGoToTicketing = () => {
//     localStorage.setItem("selectedDrivers", JSON.stringify(selectedDrivers));
//     localStorage.setItem("bookingCode", bookingCode);
//     router.push("/dashboard/operasional/ticketing");
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-[32px] font-semibold mb-6 text-black">
//           Rolling Driver
//         </h1>
//         <div className="overflow-x-auto">
//           <table className="w-full table-auto">
//             <thead className="text-gray-500">
//               <tr>
//                 <th className="p-2 text-center font-normal">No. Lambung</th>
//                 <th className="p-2 text-center font-normal">Nama Driver</th>
//                 <th className="p-2 text-center font-normal">Status</th>
//                 <th className="p-2 text-center font-normal">Kontak</th>
//                 <th className="p-2 text-center font-normal">Konfirmasi</th>
//                 <th className="p-2 text-center font-normal">Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {drivers.map((driver) => (
//                 <tr
//                   key={driver.id}
//                   className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="p-2 text-center text-gray-750">
//                     {driver.lambung}
//                   </td>
//                   <td className="p-2 text-center text-gray-750">
//                     {driver.name}
//                   </td>
//                   <td className="p-2 text-center text-gray-750">
//                     {driver.status}
//                   </td>
//                   <td className="p-2 text-center text-gray-750">
//                     {driver.kontak}
//                   </td>
//                   <td className="p-2 text-center text-gray-750">
//                     {driver.konfirmasi}
//                   </td>
//                   <td className="p-2 text-center">
//                     <button
//                       onClick={() => handleSelectDriver(driver)}
//                       className="bg-[#1C7AC8] text-white px-2 rounded-[10px] hover:bg-[#155d96] transition-colors cursor-pointer"
//                       disabled={driver.status === "On Track"}
//                     >
//                       {driver.status === "On Track"
//                         ? "Sudah Dipilih"
//                         : "Pilih Driver"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

// {selectedDrivers.length > 0 && (
//   <div className="flex justify-end mt-6">
//     <button
//       onClick={handleGoToTicketing}
//       className="bg-green-600 text-white py-2 px-6 rounded-[10px] hover:bg-green-700 transition-colors cursor-pointer"
//     >
//       Lanjut ke Ticketing
//     </button>
//   </div>
// )}
//       </div>
//     </div>
//   );
// };

// export default withAuth(RollingDriverPage);
