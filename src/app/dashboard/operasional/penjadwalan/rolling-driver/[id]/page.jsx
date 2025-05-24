// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";

// const PenjadwalanPage = () => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [data, setData] = useState([]);
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [loadingRotation, setLoadingRotation] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       try {
//         const [driversRes, jeepsRes] = await Promise.all([
//           fetch("http://localhost:8000/api/users/by-role?role=Driver", {
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
//           const driver = drivers.find((d) => d.id === jeep.driver_id);
//           return {
//             users_id: driver?.id,
//             driver_id: driver?.id,
//             driver_name: driver?.name || "-",
//             lambung: jeep.no_lambung,
//             jeep_id: jeep.jeep_id,
//             plat: jeep.plat_jeep,
//             merek: jeep.merek,
//             tipe: jeep.tipe,
//             tahun: jeep.tahun_kendaraan,
//             status_jeep: jeep.status,
//             status: driver?.status || "Tidak diketahui",
//             kapasitas: jeep.kapasitas || "4",
//             foto: jeep.foto_jeep,
//             kontak: "WhatsApp",
//             konfirmasi: "Bisa",
//             rotation_id: null,
//           };
//         });

//         setData(mergedData);
//       } catch (error) {
//         console.error("Gagal mengambil data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleRolling = async () => {
//     setLoadingRotation(true);
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("Token tidak ditemukan. Silakan login ulang.");
//       setLoadingRotation(false);
//       return;
//     }

//     try {
//       const res = await fetch(
//         "http://localhost:8000/api/driver-rotations/generate",
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!res.ok) throw new Error("Gagal generate driver rotation");

//       const besok = new Date();
//       besok.setDate(besok.getDate() + 1);
//       const tanggalBesok = besok.toISOString().split("T")[0];

//       const rotasiRes = await fetch(
//         `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!rotasiRes.ok) throw new Error("Gagal mengambil data rotasi");

//       const rotasiJson = await rotasiRes.json();
//       const rotasiData = rotasiJson.data || [];

//       const updatedData = data.map((item) => {
//         const match = rotasiData.find(
//           (rotasi) => rotasi.driver_id === item.driver_id
//         );
//         return {
//           ...item,
//           rotation_id: match?.id || null,
//         };
//       });

//       setData(updatedData);
//       alert("Generate rotation berhasil. Silakan pilih driver.");
//     } catch (error) {
//       console.error("Gagal generate rotation:", error);
//       alert("Gagal generate rotation. Coba lagi.");
//     } finally {
//       setLoadingRotation(false);
//     }
//   };

//   const handleDepartureClick = async (driver) => {
//     console.log("cek driver id:", driver.driver_id);
//     console.log("cek rotation_id:", driver.rotation_id);
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("Token tidak ditemukan. Silakan login ulang.");
//       return;
//     }

//     try {
//       const assignRes = await fetch(
//         `http://localhost:8000/api/driver-rotations/52/assign`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             driver_id: driver.driver_id,
//             jeep_id: driver.jeep_id,
//           }),
//         }
//       );

//       if (!assignRes.ok) throw new Error("Gagal assign driver");

//       const updatedData = data.map((item) =>
//         item.lambung === driver.lambung
//           ? {
//               ...item,
//               status: "Tidak Tersedia",
//               status_jeep: "Tidak Tersedia",
//               konfirmasi: "-",
//             }
//           : item
//       );
//       setData(updatedData);
//       setSelectedDriver(driver);

//       alert("Driver berhasil ditugaskan.");
//     } catch (error) {
//       console.error("Gagal assign driver:", error);
//       alert("Gagal menugaskan driver.");
//     }
//   };

//   const filteredData = data.filter((item) => {
//     const lambungMatch = item.lambung
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const nameMatch = item.driver_name
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return lambungMatch || nameMatch;
//   });

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-[32px] font-semibold mb-6 text-black">
//           Atur Driver
//         </h1>

//         <div>
//           <div className="flex justify-end mb-3">
//             <SearchInput
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onClear={() => setSearchTerm("")}
//               placeholder="Cari"
//             />
//           </div>
//           <div className="flex justify-end mb-6">
//             <button
//               onClick={handleRolling}
//               disabled={loadingRotation}
//               className={`bg-[#8FAFD9] text-white px-2 py-1 rounded-xl cursor-pointer transition ${
//                 loadingRotation
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:bg-[#7ba2d0]"
//               }`}
//             >
//               {loadingRotation ? "Memproses..." : "Rolling Driver"}
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto bg-white rounded-xl">
//           <table className="w-full table-auto">
//             <thead className="bg-[#3D6CB9] text-white">
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
//                       {item.driver_name}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <div className="flex items-center justify-center gap-2">
//                         <span
//                           className={`w-3 h-3 rounded-full ${
//                             item.status_jeep === "Tersedia"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           }`}
//                         ></span>
//                         {item.status_jeep}
//                       </div>
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.kontak}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.konfirmasi}
//                     </td>
//                     <td className="p-2 text-center">
//                       <button
//                         onClick={() => handleDepartureClick(item)}
//                         disabled={item.status === "Tidak Tersedia"}
//                         className={`bg-[#3D6CB9] text-white px-3 py-1 rounded-xl cursor-pointer transition ${
//                           item.status === "Tidak Tersedia"
//                             ? "opacity-50 cursor-not-allowed"
//                             : "hover:bg-[#155d96]"
//                         }`}
//                       >
//                         Pilih Driver
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="text-center p-4">
//                     Data tidak ditemukan.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {selectedDriver && (
//           <div className="mt-6 bg-green-100 p-4 rounded">
//             Driver {selectedDriver.driver_name} dengan nomor lambung{" "}
//             {selectedDriver.lambung} berhasil dipilih.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PenjadwalanPage;

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
  const [loadingRotation, setLoadingRotation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
            users_id: driver?.id,
            driver_id: driver?.id,
            driver_name: driver?.name || "-",
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
            konfirmasi: "Bisa", //nanti diperbaiki seusai data presensi
            departure: "Pilih Driver",
            rotation_id: null,
          };
        });

        setData(mergedData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  //   const handleRolling = async () => {
  //   setLoadingRotation(true);
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     alert("Token tidak ditemukan. Silakan login ulang.");
  //     setLoadingRotation(false);
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
  //     const newRotationId = result.data?.id || null;

  //     const updatedData = data.map((item) => ({
  //       ...item,
  //       rotation_id: newRotationId,
  //     }));

  //     setData(updatedData);
  //     setRotationId(newRotationId);
  //     alert("Generate rotation berhasil. Silakan pilih driver.");
  //   } catch (error) {
  //     console.error("Gagal generate rotation:", error);
  //     alert("Gagal generate rotation. Coba lagi.");
  //   } finally {
  //     setLoadingRotation(false);
  //   }
  // };
  // ini udah bisa ngirim data rolling

  const handleRolling = async () => {
    setLoadingRotation(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      setLoadingRotation(false);
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

      const besok = new Date();
      besok.setDate(besok.getDate() + 1);
      const tanggalBesok = besok.toISOString().split("T")[0];

      const rotasiRes = await fetch(
        `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!rotasiRes.ok) throw new Error("Gagal mengambil data rotasi");

      const rotasiJson = await rotasiRes.json();
      const rotasiData = rotasiJson.data || [];

      const updatedData = data.map((item) => {
        const match = rotasiData.find(
          (rotasi) => rotasi.driver_id === item.driver_id
        );
        return {
          ...item,
          rotation_id: match?.id || null,
        };
      });

      setData(updatedData);
      alert("Generate rotation berhasil. Silakan pilih driver.");
    } catch (error) {
      console.error("Gagal generate rotation:", error);
      alert("Gagal generate rotation. Coba lagi.");
    } finally {
      setLoadingRotation(false);
    }
  };

  const handleDepartureClick = async (driver) => {
    console.log("Driver dipilih:", driver);
    console.log("Rotation ID:", driver.rotation_id);
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      // misal endpoint assign-nya fixed, contoh pakai id rotation = 1
      const assignRes = await fetch(
        `http://localhost:8000/api/driver-rotations/${driver.rotation_id}/assign`,
        // `http://localhost:8000/api/driver-rotations/54/assign`,
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
  // ini bisa ngirim assign sesuai id rotation dengan nyebutin id rotation langsung

  // const handleDepartureClick = async (driver) => {
  //   console.log("Driver dipilih:", driver);
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     alert("Token tidak ditemukan. Silakan login ulang.");
  //     return;
  //   }

  //   if (!driver.rotation_id) {
  //     alert("Rotation ID tidak ditemukan untuk driver ini.");
  //     return;
  //   }

  //   try {
  //     const assignRes = await fetch(
  //       `http://localhost:8000/api/driver-rotations/${driver.rotation_id}/assign`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           driver_id: driver.driver_id,
  //           jeep_id: driver.jeep_id,
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
              onClick={handleRolling}
              disabled={loadingRotation}
              className={`bg-[#8FAFD9] text-white px-2 py-1 rounded-xl cursor-pointer transition
    ${loadingRotation ? "opacity-50 cursor-not-allowed" : "hover:bg-[#7ba2d0]"}`}
            >
              {loadingRotation ? "Memproses..." : "Rolling Driver"}
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
                      {item.driver_name}
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
