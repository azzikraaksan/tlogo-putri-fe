// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import { RefreshCcw } from "lucide-react";

// const PenjadwalanPage = () => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [data, setData] = useState([]);
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [jeepData, setJeepData] = useState(null);
//   const [rotationId, setRotationId] = useState(null);
//   const [loadingRotation, setLoadingRotation] = useState(false);
//   const [bookingData, setBookingData] = useState(null);
//   const [isAlreadyRolled, setIsAlreadyRolled] = useState(false);
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const params = useParams();
//   const bookingId = params?.bookingId;

//   useEffect(() => {
//     const fetchRotations = async () => {
//       const token = localStorage.getItem("access_token");
//       console.log("Token ditemukan?", !!token);

//       if (!token) return;

//       try {
//         const besok = new Date();
//         besok.setDate(besok.getDate() + 1);
//         const tanggalBesok = besok.toISOString().split("T")[0];

//         console.log("Tanggal besok:", tanggalBesok);

//         const response = await fetch(
//           `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         console.log("Status response:", response.status);

//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error("Respon tidak OK:", errorText);
//           throw new Error("Gagal mengambil data driver rotations");
//         }

//         const json = await response.json();
//         console.log("Data JSON diterima:", json);

//         setData(json);
//       } catch (error) {
//         console.error("Gagal mengambil data:", error);
//       }
//       console.log("Booking ID dari URL:", bookingId);
//     };

//     fetchRotations();

//     // ini tambahannn
//     // const fetchBookingDetail = async () => {
//     //   const token = localStorage.getItem("access_token");
//     //   if (!token || !bookingId) return;

//     //   try {
//     //     const res = await fetch(
//     //       `http://localhost:8000/api/payment/orders/${bookingId}`,
//     //       {
//     //         headers: { Authorization: `Bearer ${token}` },
//     //       }
//     //     );
//     //     if (!res.ok) throw new Error("Gagal mengambil detail booking");

//     //     const json = await res.json();
//     //     setBookingData(json);
//     //     console.log("FULL JSON (array):", json);

//     //     const detail = json[0];
//     //     setBookingData(detail);

//     //     console.log("Booking ID:", detail.booking_id);
//     //   } catch (error) {
//     //     console.error("Gagal mengambil detail order:", error);
//     //   }
//     // };

//     const fetchBookingDetail = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token || !bookingId) return;

//       try {
//         const res = await fetch(
//           `http://localhost:8000/api/bookings/${bookingId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (!res.ok) throw new Error("Gagal mengambil detail booking");

//         const json = await res.json();
//         setBookingData(json);
//         console.log("Booking detail:", json);
//       } catch (error) {
//         console.error("Gagal mengambil detail booking:", error);
//       }
//     };

//     fetchRotations();
//     fetchBookingDetail();
//     checkRollingStatus();
//     fetchDataAndCreateTicket();
//     // fetchJeepByDriver();
//     if (selectedDriver) {
//       fetchJeepByDriver(selectedDriver.driver_id);
//     }
//   }, [bookingId, selectedDriver]);

//   const fetchJeepByDriver = async (driverId) => {
//     const token = localStorage.getItem("access_token");
//     if (!token) return;

//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/jeeps/driver/${driverId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!response.ok) throw new Error("Gagal mengambil data jeep driver");

//       const jeepData = await response.json();
//       console.log("Jeep driver data:", jeepData);
//       return jeepData;
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   };

//   // const fetchDataAndCreateTicket = async (driverId) => {
//   //   const token = localStorage.getItem("access_token");
//   //   if (!token || !bookingId || !driverId) return;

//   //   try {
//   //     // Ambil data dari 3 endpoint
//   //     const [orderRes, jeepRes, bookingRes] = await Promise.all([
//   //       fetch(`http://localhost:8000/api/payment/orders/${bookingId}`, {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }),
//   //       fetch(`http://localhost:8000/api/jeeps/driver/${driverId}`, {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }),
//   //       fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }),
//   //     ]);

//   //     if (!orderRes.ok || !jeepRes.ok || !bookingRes.ok) {
//   //       throw new Error("Gagal mengambil data dari salah satu endpoint");
//   //     }

//   //     const orderData = await orderRes.json();
//   //     const jeepData = await jeepRes.json();
//   //     const bookingData = await bookingRes.json();

//   //     const order = orderData[0];
//   //     const jeep = jeepData.data[0];
//   //     const booking = bookingData;

//   //     console.log("Order:", order);
//   //     console.log("Booking:", booking);
//   //     console.log("Jeep:", jeep);

//   //     const payload = {
//   //       code_booking: order.order_id,
//   //       nama_pemesan: booking.customer_name || "",
//   //       no_handphone: booking.customer_phone || "",
//   //       email: booking.customer_email || "",
//   //       driver_id: String(jeep?.driver_id),
//   //       jeep_id: String(jeep?.jeep_id),
//   //       booking_id: String(order.booking_id),
//   //     };

//   //     console.log("Payload siap dikirim:", payload);

//   //     const ticketRes = await fetch(
//   //       "http://localhost:8000/api/ticketings/create",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //         body: JSON.stringify(payload),
//   //       }
//   //     );

//   //     if (!ticketRes.ok) {
//   //       const errorText = await ticketRes.text();
//   //       console.error("Respon Gagal:", errorText);
//   //       throw new Error("Gagal mencetak tiket");
//   //     }

//   //     const ticketResult = await ticketRes.json();
//   //     console.log("Tiket berhasil dicetak:", ticketResult);
//   //   } catch (error) {
//   //     console.error("Terjadi kesalahan:", error.message);
//   //   }
//   // };

//   const fetchDataAndCreateTicket = async (driverId) => {
//   const token = localStorage.getItem("access_token");
//   if (!token || !bookingId || !driverId) return;

//   try {
//     // Ambil data dari 2 endpoint: booking + jeep
//     const [jeepRes, bookingRes] = await Promise.all([
//       fetch(`http://localhost:8000/api/jeeps/driver/${driverId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//     ]);

//     if (!jeepRes.ok || !bookingRes.ok) {
//       throw new Error("Gagal mengambil data dari endpoint");
//     }

//     const jeepData = await jeepRes.json();
//     const booking = await bookingRes.json();

//     const jeep = jeepData.data[0];

//     const payload = {
//       code_booking: booking.order_id || "", // sesuaikan dengan struktur dari endpoint `bookings/:id`
//       nama_pemesan: booking.customer_name || "",
//       no_handphone: booking.customer_phone || "",
//       email: booking.customer_email || "",
//       driver_id: String(jeep?.driver_id),
//       jeep_id: String(jeep?.jeep_id),
//       booking_id: booking.booking_id,
//     };

//     console.log("Payload siap dikirim:", payload);

//     const ticketRes = await fetch(
//       "http://localhost:8000/api/ticketings/create",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     if (!ticketRes.ok) {
//       const errorText = await ticketRes.text();
//       console.error("Respon Gagal:", errorText);
//       throw new Error("Gagal mencetak tiket");
//     }

//     const ticketResult = await ticketRes.json();
//     console.log("Tiket berhasil dicetak:", ticketResult);
//   } catch (error) {
//     console.error("Terjadi kesalahan:", error.message);
//   }
// };

//   const handleLanjutTicketing = () => {
//     router.push("/dashboard/operasional/ticketing");
//   };

//   const fetchJeepByDriverId = async (driverId) => {
//     const token = localStorage.getItem("access_token");
//     if (!token || !driverId) return null;

//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/jeeps/driver/${driverId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (!response.ok) throw new Error("Gagal mengambil data jeep");

//       const data = await response.json();
//       return data.data[0]; // asumsikan jeep di index 0
//     } catch (error) {
//       console.error("Error fetch jeep:", error);
//       return null;
//     }
//   };

// const handleDepartureClick = async (item) => {
//   const token = localStorage.getItem("access_token");
//   if (!token) {
//     alert("Token tidak ditemukan. Silakan login ulang.");
//     return;
//   }

//   try {
//     // assign driver dulu (tanpa kirim jeep_id karena belum ada)
//     const assignResponse = await fetch(
//       `http://localhost:8000/api/driver-rotations/${item.id}/assign`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           driver_id: item.driver_id,
//           // jangan kirim jeep_id di sini kalau belum ada
//         }),
//       }
//     );

//     if (!assignResponse.ok) throw new Error("Gagal assign driver");

//     // ambil data jeep berdasar driver_id
//     const jeep = await fetchJeepByDriverId(item.driver_id);

//     if (!jeep || !jeep.jeep_id) {
//       alert("Jeep terkait driver tidak ditemukan");
//       return;
//     }

//     // update status jeep pakai jeep_id yang baru didapat
//     const updateJeepResponse = await fetch(
//       `http://localhost:8000/api/jeeps/update/${jeep.jeep_id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           status: "On Track",
//         }),
//       }
//     );

//     if (!updateJeepResponse.ok) throw new Error("Gagal update status jeep");

//     alert("Driver berhasil dipilih dan status jeep diperbarui!");

//     setLoadingRotation(true);
//     setLoadingRotation(false);
//     setSelectedDriver(item);
//     setJeepData(jeep);
//     await fetchDataAndCreateTicket(item.driver_id);
//     await handleLanjutTicketing(item);
//   } catch (error) {
//     console.error("Error saat assign driver atau update jeep:", error);
//     alert("Terjadi kesalahan saat memilih driver atau update status jeep.");
//   }
// };

//   const handleRolling = async () => {
//     setLoadingRotation(true);
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("Token tidak ditemukan. Silakan login ulang.");
//       setLoadingRotation(false);
//       return;
//     }

//     const besok = new Date();
//     besok.setDate(besok.getDate() + 1);
//     const tanggalBesok = besok.toISOString().split("T")[0];

//     try {
//       //coba generate rotasi
//       const res = await fetch(
//         "http://localhost:8000/api/driver-rotations/generate",
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (res.status === 400) {
//         alert("Rolling driver sudah dilakukan hari ini. Tidak bisa mengulang.");
//         return;
//       }

//       if (!res.ok) {
//         throw new Error("Gagal generate driver rotation");
//       }

//       //ambil data rotasi setelah berhasil generate
//       const rotasiRes = await fetch(
//         `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!rotasiRes.ok) throw new Error("Gagal mengambil data rotasi");

//       const rotasiJson = await rotasiRes.json();
//       setData(rotasiJson.data || []);
//     } catch (error) {
//       console.error("Gagal generate rotation:", error);
//       alert("Gagal generate rotation.");
//     } finally {
//       setLoadingRotation(false);
//     }
//   };

//   const checkRollingStatus = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) return;

//     const besok = new Date();
//     besok.setDate(besok.getDate() + 1);
//     const tanggalBesok = besok.toISOString().split("T")[0];

//     try {
//       const res = await fetch(
//         `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!res.ok) throw new Error("Gagal cek status rolling");

//       const json = await res.json();
//       console.log("DATA ROTASI BESOK:", json);
//       if (json.length > 0) {
//         setIsAlreadyRolled(true);
//       }
//     } catch (err) {
//       console.error("Error cek rolling:", err);
//     }
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div
//         className="transition-all duration-300 ease-in-out"
//         style={{
//           marginLeft: isSidebarOpen ? 275 : 80,
//         }}
//       ></div>
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
//               disabled={loadingRotation || isAlreadyRolled}
//               className={`bg-[#8FAFD9] text-white px-2 py-1 rounded-xl transition
// ${
//   loadingRotation || isAlreadyRolled
//     ? "opacity-50 cursor-not-allowed"
//     : "hover:bg-[#7ba2d0] cursor-pointer"
// }`}
//             >
//               {loadingRotation
//                 ? "Memproses..."
//                 : isAlreadyRolled
//                   ? "Sudah Rolling"
//                   : "Rolling Driver"}
//             </button>
//           </div>
//         </div>
//         <div className="overflow-x-auto bg-white rounded-xl shadow">
//           <table className="w-full table-auto">
//             <thead className="bg-[#3D6CB9] text-white">
//               <tr>
//                 <th className="p-2 text-center font-normal">
//                   Tanggal Keberangkatan
//                 </th>
//                 <th className="p-2 text-center font-normal">Nama Driver</th>
//                 <th className="p-2 text-center font-normal">Status</th>
//                 <th className="p-2 text-center font-normal">Kontak</th>
//                 <th className="p-2 text-center font-normal">Konfirmasi</th>
//                 <th className="p-2 text-center font-normal">Alasan Skip</th>
//                 <th className="p-2 text-center font-normal">Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.length > 0 ? (
//                 data
//                   .filter((item) => item.assigned !== 1)
//                   .map((item) => (
//                     <tr
//                       key={item.id}
//                       className="border-t border-gray-300 hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="p-2 text-center text-gray-700">
//                         {item.date}
//                       </td>
//                       <td className="p-2 text-center text-gray-700">
//                         {item.driver?.name}
//                       </td>
//                       <td className="p-2 text-center text-gray-700">
//                         {item.assigned ? "Sudah" : "Belum"}
//                       </td>
//                       <td className="p-2 text-center text-gray-700">
//                         <a
//                           href={`https://wa.me/${item.driver?.telepon}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="px-3 bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer inline-block"
//                         >
//                           WhatsApp
//                         </a>
//                       </td>
//                       <td className="p-2 text-center text-gray-700">
//                         {item.driver?.konfirmasi || "Bisa"}
//                       </td>
//                       <td className="p-2 text-center text-gray-700">
//                         {item.skip_reason || "-"}
//                       </td>
//                       <td className="p-2 text-center">
//                         <button
//                           onClick={() => handleDepartureClick(item)}
//                           disabled={item.assigned}
//                           className={`w-[120px] rounded-[10px] px-3 py-1 text-white ${
//                             item.assigned
//                               ? "bg-[#8FAFD9] opacity-50 cursor-not-allowed"
//                               : "bg-[#3D6CB9] hover:bg-[#155d96] cursor-pointer"
//                           }`}
//                         >
//                           {item.assigned ? "✔ Sudah" : "Pilih Driver"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))
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
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "/components/Sidebar.jsx";
import LoadingFunny from "/components/LoadingFunny.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { CircleArrowLeft } from "lucide-react";
import Hashids from "hashids";

const PenjadwalanPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [jeepData, setJeepData] = useState(null);
  const [rotationId, setRotationId] = useState(null);
  const [loadingRotation, setLoadingRotation] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isAlreadyRolled, setIsAlreadyRolled] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const params = useParams();
  const bookingId = params?.bookingId;
  const [rotations, setRotations] = useState([]);
  const [unassignedDrivers, setUnassignedDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const bookingHash = params?.bookingId;
  const decoded = hashids.decode(bookingHash);
  const decodedBookingId = decoded?.[0];

  useEffect(() => {
    const fetchBookingDetail = async () => {
      const token = localStorage.getItem("access_token");
      if (!token || !decodedBookingId) return;

      try {
        const res = await fetch(
          `http://localhost:8000/api/bookings/${decodedBookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil detail booking");

        const json = await res.json();
        setBookingData(json);
        console.log("Booking detail:", json);
      } catch (error) {
        console.error("Gagal mengambil detail booking:", error);
      }
    };

    fetchBookingDetail();
    checkRollingStatus();

    if (selectedDriver) {
      fetchJeepByDriver(selectedDriver.driver_id);
    }
  }, [decodedBookingId, selectedDriver]);
  // useEffect(() => {
  //   const fetchBookingDetail = async () => {
  //     const token = localStorage.getItem("access_token");
  //     if (!token || !bookingId) return;

  //     try {
  //       const res = await fetch(
  //         `http://localhost:8000/api/bookings/${bookingId}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       if (!res.ok) throw new Error("Gagal mengambil detail booking");

  //       const json = await res.json();
  //       setBookingData(json);
  //       console.log("Booking detail:", json);
  //     } catch (error) {
  //       console.error("Gagal mengambil detail booking:", error);
  //     }
  //   };

  //   // Hanya panggil checkRollingStatus, karena sudah lengkap dan difilter
  //   fetchBookingDetail();
  //   checkRollingStatus();

  //   if (selectedDriver) {
  //     fetchJeepByDriver(selectedDriver.driver_id);
  //   }
  // }, [bookingId, selectedDriver]);

  const fetchJeepByDriver = async (driverId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/jeeps/driver/${driverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data jeep driver");

      const jeepData = await response.json();
      console.log("Jeep driver data:", jeepData);
      return jeepData;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const handleDepartureClick = async (item) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      // langsung cetak tiket tanpa assign
      await fetchDataAndCreateTicket(item.driver_id);
      alert("Tiket berhasil dicetak!");
    } catch (error) {
      console.error("Gagal mencetak tiket:", error);
      alert("Terjadi kesalahan saat mencetak tiket.");
    }
  };

  // const fetchDataAndCreateTicket = async (driverId) => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token || !bookingId || !driverId) return;

  //   try {
  //     // Ambil data dari 2 endpoint: booking + jeep
  //     const [jeepRes, bookingRes] = await Promise.all([
  //       fetch(`http://localhost:8000/api/jeeps/driver/${driverId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //       fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //     ]);

  //     if (!jeepRes.ok || !bookingRes.ok) {
  //       throw new Error("Gagal mengambil data dari endpoint");
  //     }

  //     const jeepData = await jeepRes.json();
  //     const booking = await bookingRes.json();

  //     const jeep = jeepData.data[0];

  //     const payload = {
  //       code_booking: booking.order_id || "", // sesuaikan dengan struktur dari endpoint `bookings/:id`
  //       nama_pemesan: booking.customer_name || "",
  //       no_handphone: booking.customer_phone || "",
  //       email: booking.customer_email || "",
  //       driver_id: String(jeep?.driver_id),
  //       jeep_id: String(jeep?.jeep_id),
  //       booking_id: booking.booking_id,
  //     };

  //     console.log("Payload siap dikirim:", payload);

  //     const ticketRes = await fetch(
  //       "http://localhost:8000/api/ticketings/create",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (!ticketRes.ok) {
  //       const errorText = await ticketRes.text();
  //       console.error("Respon Gagal:", errorText);
  //       throw new Error("Gagal mencetak tiket");
  //     }

  //     const ticketResult = await ticketRes.json();
  //     console.log("Tiket berhasil dicetak:", ticketResult);
  //   } catch (error) {
  //     console.error("Terjadi kesalahan:", error.message);
  //   }
  // };

  const fetchDataAndCreateTicket = async (driverId) => {
    const token = localStorage.getItem("access_token");
    if (!token || !bookingId || !driverId) return;

    const decoded = hashids.decode(bookingId);
    const decodedBookingId = decoded?.[0];

    if (!decodedBookingId) {
      console.error("Gagal decode bookingId");
      return;
    }

    try {
      const [jeepRes, bookingRes] = await Promise.all([
        fetch(`http://localhost:8000/api/jeeps/driver/${driverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:8000/api/bookings/${decodedBookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!jeepRes.ok || !bookingRes.ok) {
        throw new Error("Gagal mengambil data dari endpoint");
      }

      const jeepData = await jeepRes.json();
      const booking = await bookingRes.json();

      const jeep = jeepData.data[0];

      const payload = {
        code_booking: booking.order_id || "",
        nama_pemesan: booking.customer_name || "",
        no_handphone: booking.customer_phone || "",
        email: booking.customer_email || "",
        driver_id: String(jeep?.driver_id),
        jeep_id: String(jeep?.jeep_id),
        booking_id: booking.booking_id,
      };

      const ticketRes = await fetch(
        "http://localhost:8000/api/ticketings/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!ticketRes.ok) {
        const errorText = await ticketRes.text();
        console.error("Respon Gagal:", errorText);
        throw new Error("Gagal mencetak tiket");
      }

      const ticketResult = await ticketRes.json();
      console.log("Tiket berhasil dicetak:", ticketResult);

      // ✅ Redirect setelah berhasil
      router.push("/dashboard/operasional/ticketing");
    } catch (error) {
      console.error("Terjadi kesalahan:", error.message);
    }
  };

  const handleLanjutTicketing = () => {
    router.push("/dashboard/operasional/ticketing");
  };

  const fetchJeepByDriverId = async (driverId) => {
    const token = localStorage.getItem("access_token");
    if (!token || !driverId) return null;

    try {
      const response = await fetch(
        `http://localhost:8000/api/jeeps/driver/${driverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Gagal mengambil data jeep");

      const data = await response.json();
      return data.data[0]; // asumsikan jeep di index 0
    } catch (error) {
      console.error("Error fetch jeep:", error);
      return null;
    }
  };

  const handleRolling = async () => {
    setLoadingRotation(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      setLoadingRotation(false);
      return;
    }

    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    const tanggalBesok = besok.toISOString().split("T")[0];

    try {
      //coba generate rotasi
      const res = await fetch(
        "http://localhost:8000/api/driver-rotations/generate",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 400) {
        alert("Rolling driver sudah dilakukan hari ini. Tidak bisa mengulang.");
        return;
      }

      if (!res.ok) {
        throw new Error("Gagal generate driver rotation");
      }

      //ambil data rotasi setelah berhasil generate
      const rotasiRes = await fetch(
        `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!rotasiRes.ok) throw new Error("Gagal mengambil data rotasi");

      const rotasiJson = await rotasiRes.json();
      setData(rotasiJson.data || []);
    } catch (error) {
      console.error("Gagal generate rotation:", error);
      alert("Gagal generate rotation.");
    } finally {
      setLoadingRotation(false);
    }
  };

  const checkRollingStatus = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    const tanggalBesok = besok.toISOString().split("T")[0];

    try {
      setLoading(true);
      // Ambil data driver-rotations untuk tanggal besok
      const resRotations = await fetch(
        `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resRotations.ok) throw new Error("Gagal fetch driver-rotations");
      const rotationsData = await resRotations.json();

      // ✅ Filter driver yang:
      // belum assigned DAN tidak memiliki skip_reason
      const unassignedRotations = rotationsData.filter(
        (r) => r.assigned === 0 && (!r.skip_reason || r.skip_reason === "")
      );

      console.log("✅ Driver yang bisa dipilih:", unassignedRotations);

      // Set state jika perlu
      setIsAlreadyRolled(rotationsData.length > 0); // Atur ini sesuai logika kamu
      setRotations(unassignedRotations);
    } catch (err) {
      console.error("Error cek rolling:", err);
    } finally {
      setLoading(false);
    }
  };

  // const checkRollingStatus = async () => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) return;

  //   const besok = new Date();
  //   besok.setDate(besok.getDate() + 1);
  //   const tanggalBesok = besok.toISOString().split("T")[0];

  //   try {
  //     // Ambil data driver-rotations untuk tanggal besok
  //     const resRotations = await fetch(
  //       `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     if (!resRotations.ok) throw new Error("Gagal fetch driver-rotations");
  //     const rotationsData = await resRotations.json();

  //     // Filter hanya driver yang belum assigned (assigned === 0)
  //     const unassignedRotations = rotationsData.filter((r) => r.assigned === 0);

  //     console.log("✅ Driver yang belum assigned:", unassignedRotations);

  //     // Set state jika perlu
  //     setIsAlreadyRolled(rotationsData.length > 0); // Atau tergantung logika kamu
  //     setRotations(unassignedRotations);
  //   } catch (err) {
  //     console.error("Error cek rolling:", err);
  //   }
  // };
  const handleKembali = () => {
    router.back();
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
        <div className="flex items-center gap-3 mb-6">
          <CircleArrowLeft
            onClick={handleKembali}
            className="cursor-pointer"
            size={28}
          />
          <h1 className="text-[32px] font-semibold text-black">Atur Driver</h1>
        </div>

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
              disabled={loadingRotation || isAlreadyRolled}
              className={`bg-[#8FAFD9] text-white px-2 py-1 rounded-xl transition
${
  loadingRotation || isAlreadyRolled
    ? "opacity-50 cursor-not-allowed"
    : "hover:bg-[#7ba2d0] cursor-pointer"
}`}
            >
              {loadingRotation
                ? "Memproses..."
                : isAlreadyRolled
                  ? "Sudah Rolling"
                  : "Rolling Driver"}
            </button>
          </div>
        </div>
          <div className="flex justify-between items-center mb-4 px-2">
            <p className="text-gray-700">
              <span className="font-semibold">| Tanggal Keberangkatan:</span>{" "}
              {bookingData?.tour_date || "-"}
              <span className="font-semibold ml-10">| Nama Pemesan:</span>{" "}
              {bookingData?.customer_name || "-"}
            </p>
          </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow">

          <table className="w-full table-auto">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                <th className="p-2 text-center font-normal">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rotations.length > 0 ? (
                rotations
                  .filter((item) => item.assigned !== 1)
                  .map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-2 text-center text-gray-700">
                        {item.driver?.name}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleDepartureClick(item)}
                          className="w-[120px] bg-[#3D6CB9] rounded-[10px] hover:bg-[#155d96] text-white cursor-pointer transition-colors"
                        >
                          Pilih Driver
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
