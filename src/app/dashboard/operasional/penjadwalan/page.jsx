// "use client";
// import { useEffect, useState } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";
// import RollingDriverPage from "/components/RollingDriver.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import { useRouter } from "next/navigation";

// const PenjadwalanPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const router = useRouter();
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//   try {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");
//     }

//     const [ordersResponse, ticketingResponse] = await Promise.all([
//       fetch("http://localhost:8000/api/bookings", {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }),
//       fetch("http://localhost:8000/api/ticketings/all", {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }),
//     ]);

//     if (!ordersResponse.ok || !ticketingResponse.ok) {
//       const ordersError = await ordersResponse.text();
//       const ticketingError = await ticketingResponse.text();
//       throw new Error(
//         `Gagal mengambil data:\nBookings: ${ordersError}\nTicketings: ${ticketingError}`
//       );
//     }

//     const ordersData = await ordersResponse.json();
//     const ticketingsData = await ticketingResponse.json();

//     const ticketingBookingIds = ticketingsData.map((t) => t.booking_id);

//     const filteredOrders = ordersData.filter((order) => {
//       return !ticketingBookingIds.includes(order.booking_id);
//     });

//     filteredOrders.sort((a, b) => {
//       const dateA = new Date(`${a.tour_date}T${a.start_time}`);
//       const dateB = new Date(`${b.tour_date}T${b.start_time}`);
//       return dateA - dateB;
//     });

//     setOrders(filteredOrders);
//   } catch (error) {
//     console.error("Error saat mengambil data:", error.message);
//   }
// };

//   const handleAturJadwal = (bookingId) => {
//     router.push(
//       `/dashboard/operasional/penjadwalan/rolling-driver/${bookingId}`
//     );
//   };

//   const handleKembali = () => {
//     setSelectedBooking(null);
//   };

//   const filteredData = orders.filter((item) => {
//     return (
//       item.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

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
//         {selectedBooking ? (
//           <RollingDriverPage
//             onKembali={handleKembali}
//             booking={selectedBooking}
//           />
//         ) : (
//           <>
//             <h1 className="text-[32px] font-semibold mb-6 text-black">
//               Daftar Pemesanan
//             </h1>
//             <div className="flex justify-end mb-7">
//               <SearchInput
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onClear={() => setSearchTerm("")}
//                 placeholder="Cari"
//               />
//             </div>
//             <div className="overflow-x-auto bg-white rounded-xl shadow">
//               <table className="w-full table-auto">
//                 <thead className="bg-[#3D6CB9] text-white ">
//                   <tr>
//                     <th className="p-2 text-center font-normal">
//                       Tanggal Keberangkatan
//                     </th>
//                     <th className="p-2 text-center font-normal">Pukul</th>
//                     <th className="p-2 text-center font-normal">Nama</th>
//                     <th className="p-2 text-center font-normal">Kontak</th>
//                     <th className="p-2 text-center font-normal">Pilihan Paket</th>
//                     <th className="p-2 text-center font-normal">
//                       Keberangkatan
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     filteredData.map((item) => (
//                       <tr
//                         key={item.booking_id}
//                         className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="p-2 text-center text-gray-750">
//                           {item.tour_date}
//                         </td>
//                         <td className="p-2 text-center text-gray-750">
//                           {item.start_time}
//                         </td>
//                         <td className="p-2 text-center text-gray-750">
//                           {item.customer_name}
//                         </td>
//                         <td className="p-2 text-center text-gray-750">
//                           <button
//                             onClick={() =>
//                               window.open(
//                                 `https://wa.me/${item.customer_phone.replace(/^0/, "62")}`,
//                                 "_blank"
//                               )
//                             }
//                             className="px-3 bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer inline-block"
//                           >
//                             WhatsApp
//                           </button>
//                         </td>
//                         <td className="p-2 text-center text-gray-750">
//                           Paket {item.package_id}
//                         </td>
//                         <td className="p-2 text-center text-gray-750">
//                           <button
//                             onClick={() => handleAturJadwal(item.booking_id)}
//                             className="w-[120px] bg-[#8FAFD9] rounded-[10px] hover:bg-[#7ba2d0] text-white cursor-pointer"
//                           >
//                             Atur Jadwal
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="p-4 text-center text-gray-500">
//                         Data tidak ditemukan.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default withAuth(PenjadwalanPage);

"use client";
import { useEffect, useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import LoadingFunny from "/components/LoadingFunny.jsx";
import RollingDriverPage from "/components/RollingDriver.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import Hashids from "hashids";

const PenjadwalanPage = () => {
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [availableDriversCount, setAvailableDriversCount] = useState(0);
  const [hasRolledToday, setHasRolledToday] = useState(false);
  const [loadingRotation, setLoadingRotation] = useState(false);
  const [isAlreadyRolled, setIsAlreadyRolled] = useState(false);
  const [driversBesok, setDriversBesok] = useState([]);
  const [loadingDriversBesok, setLoadingDriversBesok] = useState(false);
  const [showDriversBesok, setShowDriversBesok] = useState(false);
  const [isRolled, setIsRolled] = useState(false);
  const now = new Date();
  const [rotations, setRotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const lastRollingDate = localStorage.getItem("lastRollingDate");
    if (lastRollingDate === today) {
      setHasRolledToday(true);
    }
    fetchOrders();
    fetchAvailableDriversCount();
    checkRollingStatus();
    Promise.all([fetchOrders(), fetchAvailableDriversCount()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // const fetchOrders = async () => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem("access_token");
  //     if (!token) {
  //       throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");
  //     }

  //     const [ordersResponse, ticketingResponse] = await Promise.all([
  //       fetch("http://localhost:8000/api/bookings", {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }),
  //       fetch("http://localhost:8000/api/ticketings/all", {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }),
  //     ]);

  //     if (!ordersResponse.ok || !ticketingResponse.ok) {
  //       const ordersError = await ordersResponse.text();
  //       const ticketingError = await ticketingResponse.text();
  //       throw new Error(
  //         `Gagal mengambil data:\nBookings: ${ordersError}\nTicketings: ${ticketingError}`
  //       );
  //     }

  //     const ordersData = await ordersResponse.json();
  //     const ticketingsData = await ticketingResponse.json();

  //     const ticketingBookingIds = ticketingsData.map((t) => t.booking_id);
  //     const filteredOrders = ordersData.filter((order) => {
  //       if (ticketingBookingIds.includes(order.booking_id)) return false;

  //       const startOfToday = new Date();
  //       startOfToday.setHours(0, 0, 0, 0);
  //       const endOfTomorrow = new Date();
  //       endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
  //       endOfTomorrow.setHours(23, 59, 59, 999);
  //       const tourDateTime = new Date(`${order.tour_date}T${order.start_time}`);

  //       return tourDateTime >= startOfToday && tourDateTime <= endOfTomorrow;
  //     });

  //     filteredOrders.sort((a, b) => {
  //       const dateA = new Date(`${a.tour_date}T${a.start_time}`);
  //       const dateB = new Date(`${b.tour_date}T${b.start_time}`);
  //       return dateA - dateB;
  //     });

  //     setOrders(filteredOrders);
  //   } catch (error) {
  //     console.error("Error saat mengambil data:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");
      }

      const [ordersResponse, ticketingResponse] = await Promise.all([
        fetch("http://localhost:8000/api/bookings", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:8000/api/ticketings/all", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!ordersResponse.ok || !ticketingResponse.ok) {
        const ordersError = await ordersResponse.text();
        const ticketingError = await ticketingResponse.text();
        throw new Error(
          `Gagal mengambil data:\nBookings: ${ordersError}\nTicketings: ${ticketingError}`
        );
      }

      const ordersData = await ordersResponse.json();
      const ticketingsData = await ticketingResponse.json();

      const ticketingBookingIds = ticketingsData.map((t) => t.booking_id);

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfTomorrow = new Date();
      endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
      endOfTomorrow.setHours(23, 59, 59, 999);

      const filteredOrders = ordersData.filter((order) => {
        const statusLower = order.booking_status?.toLowerCase();

        // filter status selain cancel dan expire
        const isValidStatus =
          statusLower !== "cancel" && statusLower !== "expire";

        // filter yang belum ada tiket
        const isNotAlreadyTicketed = !ticketingBookingIds.includes(
          order.booking_id
        );

        // filter tanggal booking hari ini sampai besok
        const tourDateTime = new Date(`${order.tour_date}T${order.start_time}`);
        const isInDateRange =
          tourDateTime >= startOfToday && tourDateTime <= endOfTomorrow;

        return isValidStatus && isNotAlreadyTicketed && isInDateRange;
      });

      filteredOrders.sort((a, b) => {
        const dateA = new Date(`${a.tour_date}T${a.start_time}`);
        const dateB = new Date(`${b.tour_date}T${b.start_time}`);
        return dateA - dateB;
      });

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error saat mengambil data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCetakTiket = async () => {
    if (selectedBookings.length === 0) {
      alert("Pilih minimal satu booking untuk mencetak tiket.");
      return;
    }

    setLoading(true);
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token)
        throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");

      const tanggalBesok = new Date();
      tanggalBesok.setDate(tanggalBesok.getDate() + 1);
      const tanggalBesokStr = tanggalBesok.toISOString().split("T")[0];

      const [rotationRes, jeepRes, ticketingRes] = await Promise.all([
        fetch(
          `http://localhost:8000/api/driver-rotations?date=${tanggalBesokStr}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(`http://localhost:8000/api/jeeps/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:8000/api/ticketings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!rotationRes.ok || !jeepRes.ok || !ticketingRes.ok) {
        throw new Error("Gagal ambil data dari salah satu endpoint.");
      }

      const rotations = await rotationRes.json();
      const jeepsData = await jeepRes.json();
      const ticketings = await ticketingRes.json();

      // Map driver_id -> Set of booking_id yang sudah punya tiket
      const usedDriversMap = new Map();
      ticketings.forEach((t) => {
        if (t.tanggal_pemesanan === tanggalBesokStr) {
          if (!usedDriversMap.has(t.driver_id)) {
            usedDriversMap.set(t.driver_id, new Set());
          }
          usedDriversMap.get(t.driver_id).add(t.booking_id);
        }
      });

      const availableRotations = rotations
        .filter((r) => {
          const driverId = r.driver?.id || r.driver_id;
          const alreadyUsed = usedDriversMap.get(driverId);
          const usedForSelected =
            alreadyUsed &&
            [...alreadyUsed].some((id) => selectedBookings.includes(id));
          return (
            r.date === tanggalBesokStr &&
            r.assigned === 0 &&
            (r.skip_reason === null || r.skip_reason === "") &&
            !usedForSelected &&
            driverId
          );
        })
        .sort((a, b) => a.id - b.id);
      if (availableRotations.length < selectedBookings.length) {
        alert("Jumlah driver yang tersedia tidak cukup.");
        return;
      }
      // Map driver -> jeep
      const driverToJeepMap = {};
      jeepsData?.data?.forEach((jeep) => {
        if (jeep.driver_id) {
          driverToJeepMap[jeep.driver_id] = jeep.jeep_id;
        }
      });

      const results = await Promise.all(
        selectedBookings.map(async (bookingId, idx) => {
          const order = orders.find((o) => o.booking_id === bookingId);
          if (!order) {
            return {
              bookingId,
              success: false,
              message: "Booking tidak ditemukan.",
            };
          }

          const rotation = availableRotations[idx];
          const driverId = rotation?.driver?.id || rotation?.driver_id;
          const jeepId = driverToJeepMap[driverId];

          if (!driverId || !jeepId) {
            return {
              bookingId,
              success: false,
              message: "Driver atau Jeep tidak valid.",
            };
          }

          const payload = {
            code_booking: order.code_booking,
            nama_pemesan: order.customer_name,
            no_handphone: order.customer_phone,
            email: order.customer_email,
            driver_id: driverId,
            jeep_id: jeepId,
            booking_id: order.booking_id,
          };

          try {
            const res = await fetch(
              "http://localhost:8000/api/ticketings/create",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              }
            );

            if (!res.ok) {
              const errText = await res.text();
              return { bookingId, success: false, message: errText };
            }

            return { bookingId, success: true };
          } catch (err) {
            return { bookingId, success: false, message: err.message };
          }
        })
      );
      const failed = results.filter((r) => !r.success);
      if (failed.length > 0) {
        const msg = failed
          .map((f) => `• Booking ${f.bookingId}: ${f.message}`)
          .join("\n");
        alert(`❌ Beberapa tiket gagal dicetak:\n\n${msg}`);
        // tetap reset loading dan selesai di finally
      } else {
        setShowSuccessModal(true);
        setSelectedBookings([]);
        fetchOrders();

        setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/dashboard/operasional/ticketing");
        }, 1500);
        return;
      }
    } catch (error) {
      console.error("Gagal cetak tiket:", error.message);
      alert("Terjadi kesalahan saat cetak tiket.");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  // const handleAturJadwal = (bookingId) => {
  //   router.push(
  //     `/dashboard/operasional/penjadwalan/rolling-driver/${bookingId}`
  //   );
  // };
  const handleAturJadwal = (bookingId) => {
    const encryptedId = hashids.encode(bookingId);
    router.push(
      `/dashboard/operasional/penjadwalan/rolling-driver/${encryptedId}`
    );
  };

  const handleKembali = () => {
    setSelectedBooking(null);
  };

  const filteredData = orders.filter((item) => {
    return (
      item.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // const fetchAvailableDriversCount = async () => {
  //   try {
  //     const token = localStorage.getItem("access_token");
  //     if (!token) throw new Error("Token tidak ditemukan.");

  //     const tanggalBesok = new Date();
  //     tanggalBesok.setDate(tanggalBesok.getDate() + 1);
  //     const tanggalBesokStr = tanggalBesok.toISOString().split("T")[0];

  //     const res = await fetch(
  //       `http://localhost:8000/api/driver-rotations?date=${tanggalBesokStr}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (!res.ok) throw new Error("Gagal mengambil data driver-rotations");

  //     const rotations = await res.json();

  //     // Hitung driver dengan assigned=0
  //     const count = rotations.filter(
  //       (rotation) => rotation.assigned === 0
  //     ).length;
  //     setAvailableDriversCount(count);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchAvailableDriversCount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token tidak ditemukan.");

      const tanggalBesok = new Date();
      tanggalBesok.setDate(tanggalBesok.getDate() + 1);
      const tanggalBesokStr = tanggalBesok.toISOString().split("T")[0];

      const res = await fetch(
        `http://localhost:8000/api/driver-rotations?date=${tanggalBesokStr}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Gagal mengambil data driver-rotations");

      const rotations = await res.json();

      // ✅ Hitung driver yang bisa dipilih:
      // assigned = 0 DAN skip_reason = null
      // const count = rotations.filter(
      //   (rotation) =>
      //     rotation.assigned === 0 &&
      //     (rotation.skip_reason === null || rotation.skip_reason === "")
      // ).length;
      const count = rotations.filter(
        (rotation) =>
          rotation.date === tanggalBesokStr &&
          rotation.assigned === 0 &&
          (rotation.skip_reason === null || rotation.skip_reason === "")
      ).length;

      setAvailableDriversCount(count);
    } catch (error) {
      console.error("❌ Error fetchAvailableDriversCount:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAvailableDriversCount();
  }, []);

  const handleSelectBooking = (bookingId) => {
    // jika sudah dipilih, unselect saja
    if (selectedBookings.includes(bookingId)) {
      setSelectedBookings(selectedBookings.filter((id) => id !== bookingId));
      return;
    }

    // batasi jumlah pilihan sesuai availableDriversCount
    if (selectedBookings.length >= availableDriversCount) {
      alert(
        `Driver yang tersedia saat ini hanya ${availableDriversCount}, tidak bisa memilih lebih dari itu.`
      );
      return;
    }

    setSelectedBookings([...selectedBookings, bookingId]);
  };

  const handleRolling = async () => {
    setLoadingRotation(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "http://localhost:8000/api/driver-rotations/generate",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal rolling: ${errorText}`);
      }

      // Update status rolling di localStorage dan state
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("lastRollingDate", today);
      setIsAlreadyRolled(true);
      setHasRolledToday(true);

      // Refresh data booking
      await fetchOrders(); // penting biar tabel ke-refresh

      // Bisa juga refresh jumlah driver atau rotation data kalau diperlukan
      await fetchAvailableDriversCount();
    } catch (error) {
      console.error("Error saat rolling driver:", error.message);
      alert("Terjadi kesalahan saat rolling driver.");
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
      // Ambil data driver-rotations untuk tanggal besok
      const resRotations = await fetch(
        `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resRotations.ok) throw new Error("Gagal fetch driver-rotations");
      const rotationsData = await resRotations.json();

      const unassignedRotations = rotationsData.filter(
        (r) => r.assigned === 0 && (!r.skip_reason || r.skip_reason === "")
      );

      console.log("✅ Driver yang bisa dipilih:", unassignedRotations);

      setIsAlreadyRolled(rotationsData.length > 0); 
      setRotations(unassignedRotations);
    } catch (err) {
      console.error("Error cek rolling:", err);
    }
  };

  const fetchDriversBesok = async () => {
    setLoadingDriversBesok(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Silakan login ulang");
      setLoadingDriversBesok(false);
      return;
    }

    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    const tanggalBesok = besok.toISOString().split("T")[0];

    try {
      const res = await fetch(
        `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Gagal mengambil data driver besok");

      const data = await res.json();
      setDriversBesok(data);
      setShowDriversBesok(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingDriversBesok(false);
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-white">
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //         <p className="text-blue-600 text-lg font-semibold animate-pulse">
  //           Memuat data...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }
  if (loading) {
    return <LoadingFunny />;
  }

  //   if (loading) {
  //   return (
  //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-90">
  //       <div className="shadow-md p-6 rounded-lg text-center">
  //         <p className="text-lg text-gray-800 mb-2">Memuat data...</p>
  //         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-[spin_0.5s_linear_infinite] mx-auto"></div>
  //       </div>
  //     </div>
  //   );
  // }

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
        {selectedBooking ? (
          <RollingDriverPage
            onKembali={handleKembali}
            booking={selectedBooking}
          />
        ) : (
          <>
            <h1 className="text-[32px] font-semibold mb-6 text-black">
              Daftar Pesanan
            </h1>

            <div className="flex justify-end mb-3">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                placeholder="Cari"
              />
            </div>

            <div className="flex justify-between mb-3">
              {selectedBookings.length > 0 ? (
                <button
                  onClick={handleCetakTiket}
                  className={`px-2 py-1 rounded-[7px] transition text-white 
        ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 cursor-pointer"
        }`}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Memproses..."
                    : `Cetak Tiket (${selectedBookings.length})`}
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <button
                  onClick={fetchDriversBesok}
                  disabled={loadingDriversBesok}
                  className={`bg-green-500 text-white px-2 py-1 rounded-[7px] transition ${
                    loadingDriversBesok
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-600 cursor-pointer"
                  }`}
                >
                  {loadingDriversBesok ? "Memuat..." : "Lihat Driver Besok"}
                </button>

                <button
                  onClick={handleRolling}
                  disabled={loadingRotation || isAlreadyRolled}
                  className={`bg-[#8FAFD9] text-white px-2 py-1 rounded-[7px] transition ${
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

            {!isAlreadyRolled && (
              <p className="text-sm text-gray-500 italic text-right mb-4">
                *Klik <span className="font-semibold">Rolling Driver</span>{" "}
                terlebih dahulu
              </p>
            )}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <div className="max-h-[470px] overflow-y-auto">
                <table className="w-full table-auto">
                  {/* <thead className="bg-[#3D6CB9] text-white"> */}
                  <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                    <tr>
                      <th className="p-2 text-center font-normal">Pilih</th>
                      <th className="p-2 text-center font-normal">
                        Tanggal dan Waktu Keberangkatan
                      </th>
                      <th className="p-2 text-center font-normal">Nama</th>
                      <th className="p-2 text-center font-normal">
                        Pilihan Paket
                      </th>
                      <th className="p-2 text-center font-normal">
                        Custom Driver
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr
                          key={item.booking_id}
                          className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              className={`${
                                selectedBookings.includes(item.booking_id) ||
                                (filteredData.findIndex(
                                  (o) => o.booking_id === item.booking_id
                                ) === selectedBookings.length &&
                                  selectedBookings.length <
                                    availableDriversCount)
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                              }`}
                              checked={selectedBookings.includes(
                                item.booking_id
                              )}
                              disabled={
                                !selectedBookings.includes(item.booking_id) &&
                                (filteredData.findIndex(
                                  (o) => o.booking_id === item.booking_id
                                ) !== selectedBookings.length ||
                                  selectedBookings.length >=
                                    availableDriversCount)
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBookings([
                                    ...selectedBookings,
                                    item.booking_id,
                                  ]);
                                } else {
                                  setSelectedBookings(
                                    selectedBookings.filter(
                                      (id) => id !== item.booking_id
                                    )
                                  );
                                }
                              }}
                            />
                          </td>
                          <td className="p-2 text-center text-gray-750">
                            {item.tour_date && item.start_time
                              ? `${item.tour_date} - ${item.start_time}`
                              : "-"}
                          </td>
                          <td className="p-2 text-center text-gray-750">
                            {item.customer_name}
                          </td>
                          <td className="p-2 text-center text-gray-750">
                            Paket {item.package_id}
                          </td>
                          <td className="p-2 text-center text-gray-750">
                            <button
                              onClick={() => handleAturJadwal(item.booking_id)}
                              className={`px-2 rounded-[10px] text-white transition ${
                                !selectedBookings.includes(item.booking_id) &&
                                selectedBookings.length >= availableDriversCount
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : "bg-[#8FAFD9] hover:bg-[#7ba2d0] cursor-pointer"
                              }`}
                              disabled={
                                !selectedBookings.includes(item.booking_id) &&
                                selectedBookings.length >= availableDriversCount
                              }
                            >
                              Custom Driver
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-4 text-center text-gray-500"
                        >
                          Data tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {showDriversBesok && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-auto">
            <div className="relative">
              <button
                onClick={() => setShowDriversBesok(false)}
                className="absolute top-[-10px] right-[-4px] text-gray-500 hover:text-red-600 text-2xl font-bold cursor-pointer"
                aria-label="Tutup"
              >
                &times;
              </button>

              <h2 className="text-xl font-semibold mb-4 text-center">
                Daftar Driver Besok
              </h2>

              {driversBesok.length === 0 ? (
                <p className="text-center text-gray-600">
                  Silakan rolling driver terlebih dahulu.
                </p>
              ) : (
                <ul className="list-disc pl-5 space-y-2 mt-5">
                  {driversBesok.map((item) => (
                    <li key={item.id} className="mb-2">
                      <div>
                        <span className="font-medium">
                          {item.driver?.name ?? "Nama tidak tersedia"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        Dijadwalkan:{" "}
                        <span className="font-semibold">
                          {item.assigned === 1 ? "Sudah" : "Belum"}
                        </span>{" "}
                        | Alasan Skip:{" "}
                        <span className="italic font-semibold">
                          {item.skip_reason ?? "-"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-600 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Berhasil!</h2>
            <p className="text-gray-600">
              Tunggu sebentar, kamu akan diarahkan...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(PenjadwalanPage);
