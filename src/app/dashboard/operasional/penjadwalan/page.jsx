// "use client";
// import { useState } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";
// import RollingDriverPage from "/components/RollingDriver.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import { useRouter } from "next/navigation";

// const dummyData = [
//   {
//     id: 1,
//     bookingCode: "JTP001",
//     name: "Bunde",
//     phone: "081234567890",
//     email: "bundee@gmail.com",
//     note: "Paket 2",
//     departure: "Atur Jadwal",
//   },
//   {
//     id: 2,
//     bookingCode: "JTP002",
//     name: "Zimut",
//     phone: "089876543210",
//     email: "zimut@gmail.com",
//     note: "Lieur sepanjang hari",
//     departure: "Atur Jadwal",
//   },
//   {
//     id: 3,
//     bookingCode: "JTP003",
//     name: "Naon Maneh",
//     phone: "081234567890",
//     email: "naon@gmail.com",
//     note: "Paket 3",
//     departure: "Atur Jadwal",
//   },
//   {
//     id: 4,
//     bookingCode: "JTP004",
//     name: "Maneh Saha",
//     phone: "089876543210",
//     email: "saha@gmail.com",
//     note: "Paket 1",
//     departure: "Atur Jadwal",
//   },
// ];

// const PenjadwalanPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   const handleAturJadwal = (booking) => {
//     setSelectedBooking(booking);
//   };

//   const handleKembali = () => {
//     setSelectedBooking(null);
//   };

//   const filteredData = dummyData.filter(
//     (item) =>
//       item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         {selectedBooking ? (
//           <RollingDriverPage onKembali={handleKembali} booking={selectedBooking} />
//         ) : (
//           <>
//             <h1 className="text-[32px] font-semibold mb-6 text-black">Data Pemesanan</h1>
//             <div className="flex justify-end mb-7">
//               <SearchInput
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onClear={() => setSearchTerm("")}
//                 placeholder="Cari"
//               />
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full table-auto">
//                 <thead className="text-gray-500">
//                   <tr>
//                     <th className="p-2 text-center font-normal">Kode Pemesanan</th>
//                     <th className="p-2 text-center font-normal">Nama</th>
//                     <th className="p-2 text-center font-normal">No. HP</th>
//                     <th className="p-2 text-center font-normal">Email</th>
//                     <th className="p-2 text-center font-normal">Catatan</th>
//                     <th className="p-2 text-center font-normal">Keberangkatan</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     filteredData.map((item) => (
//                       <tr key={item.id} className="border-t border-[#808080] hover:bg-gray-50 transition-colors">
//                         <td className="p-2 text-center text-gray-750">{item.bookingCode}</td>
//                         <td className="p-2 text-center text-gray-750">{item.name}</td>
//                         <td className="p-2 text-center text-gray-750">{item.phone}</td>
//                         <td className="p-2 text-center text-gray-750">{item.email}</td>
//                         <td className="p-2 text-center text-gray-750">{item.note}</td>
//                         <td className="p-2 text-center text-gray-750">
//                           <button
//                             onClick={() => handleAturJadwal(item)}
//                             className="w-[120px] bg-[#8FAFD9] rounded-[10px] hover:bg-[#7ba2d0] text-white cursor-pointer"
//                           >
//                             {item.departure}
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="p-4 text-center text-gray-500">Data tidak ditemukan.</td>
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
import RollingDriverPage from "/components/RollingDriver.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";

const PenjadwalanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

//   const fetchOrders = async () => {
//   try {
//     const token = localStorage.getItem("access_token");
//     const response = await fetch("http://localhost:8000/api/payment/orders", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Gagal mengambil data pemesanan");
//     }

//     const result = await response.json();

//     const filteredOrders = result.filter(order =>
//       order.payment_for.toLowerCase().includes("remaining") ||
//       order.payment_for.toLowerCase().includes("full")
//     );

//     setOrders(filteredOrders);
//   } catch (error) {
//     console.error("Error saat mengambil data:", error);
//   }
// };

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const ordersResponse = await fetch("http://localhost:8000/api/payment/orders", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const ticketingResponse = await fetch("http://localhost:8000/api/ticketings/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!ordersResponse.ok || !ticketingResponse.ok) {
      throw new Error("Gagal mengambil data");
    }

    const ordersData = await ordersResponse.json();
    const ticketingsData = await ticketingResponse.json();

    const ticketingBookingIds = ticketingsData.map((t) => t.booking_id);

    const filteredOrders = ordersData.filter(order =>
      (
        order.payment_for.toLowerCase().includes("remaining") ||
        order.payment_for.toLowerCase().includes("full")
      ) &&
      !ticketingBookingIds.includes(order.booking.booking_id)
    );

    setOrders(filteredOrders);
  } catch (error) {
    console.error("Error saat mengambil data:", error);
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAturJadwal = (bookingId) => {
    router.push(`/dashboard/operasional/penjadwalan/rolling-driver/${bookingId}`);
  };

  const handleKembali = () => {
    setSelectedBooking(null);
  };

  const filteredData = orders.filter((item) => {
    const booking = item.booking;
    return (
      // booking?.booking_id?.includes(searchTerm) ||
      booking?.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking?.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        {selectedBooking ? (
          <RollingDriverPage onKembali={handleKembali} booking={selectedBooking} />
        ) : (
          <>
            <h1 className="text-[32px] font-semibold mb-6 text-black">Data Pemesanan</h1>
            <div className="flex justify-end mb-7">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                placeholder="Cari"
              />
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="w-full table-auto">
                <thead className="bg-[#3D6CB9] text-white ">
                  <tr>
                    <th className="p-2 text-center font-normal">ID Pemesanan</th>
                    <th className="p-2 text-center font-normal">Nama</th>
                    <th className="p-2 text-center font-normal">No. HP</th>
                    <th className="p-2 text-center font-normal">Email</th>
                    <th className="p-2 text-center font-normal">Paket</th>
                    <th className="p-2 text-center font-normal">Keberangkatan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.transaction_id} className="border-t border-[#808080] hover:bg-gray-50 transition-colors">
                        <td className="p-2 text-center text-gray-750">{item.booking_id}</td>
                        <td className="p-2 text-center text-gray-750">{item.booking.customer_name}</td>
                        <td className="p-2 text-center text-gray-750">{item.booking.customer_phone}</td>
                        <td className="p-2 text-center text-gray-750">{item.booking.customer_email}</td>
                        <td className="p-2 text-center text-gray-750">{item.booking.package_id}</td>
                        <td className="p-2 text-center text-gray-750">
                          <button
                            onClick={() => handleAturJadwal(item.booking.booking_id)}
                            className="w-[120px] bg-[#8FAFD9] rounded-[10px] hover:bg-[#7ba2d0] text-white cursor-pointer"
                          >
                            Atur Jadwal
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">Data tidak ditemukan.</td>
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

export default withAuth(PenjadwalanPage);



// "use client";
// import { useState } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";
// import RollingDriverPage from "/components/RollingDriver.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import { useRouter } from "next/navigation";

// const dummyData = [
//   {
//     id: 1,
//     bookingCode: "JTP001",
//     name: "Bunde",
//     phone: "081234567890",
//     email: "bundee@gmail.com",
//     note: "Paket 2",
//     departure: "Atur Jadwal",
//   },
//   {
//     id: 2,
//     bookingCode: "JTP002",
//     name: "Zimut",
//     phone: "089876543210",
//     email: "zimut@gmail.com",
//     note: "Lieur sepanjang hari",
//     departure: "Atur Jadwal",
//   },
//   {
//     id: 3,
//     bookingCode: "JTP003",
//     name: "Naon Maneh",
//     phone: "081234567890",
//     email: "naon@gmail.com",
//     note: "Paket 3",
//     departure: "Atur Jadwal",
//   },
//   {
//     id: 4,
//     bookingCode: "JTP004",
//     name: "Maneh Saha",
//     phone: "089876543210",
//     email: "saha@gmail.com",
//     note: "Paket 1",
//     departure: "Atur Jadwal",
//   },
// ];

// const PenjadwalanPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const router = useRouter();

//   const handleAturJadwal = (bookingCode) => {
//     router.push(`/dashboard/operasional/penjadwalan/rolling-driver/${bookingCode}`);
//   };

//   const handleKembali = () => {
//     setSelectedBooking(null);
//   };

//   const filteredData = dummyData.filter(
//     (item) =>
//       item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         {selectedBooking ? (
//           <RollingDriverPage onKembali={handleKembali} booking={selectedBooking} />
//         ) : (
//           <>
//             <h1 className="text-[32px] font-semibold mb-6 text-black">Data Pemesanan</h1>
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
//                     <th className="p-2 text-center font-normal">Kode Pemesanan</th>
//                     <th className="p-2 text-center font-normal">Nama</th>
//                     <th className="p-2 text-center font-normal">No. HP</th>
//                     <th className="p-2 text-center font-normal">Email</th>
//                     <th className="p-2 text-center font-normal">Catatan</th>
//                     <th className="p-2 text-center font-normal">Keberangkatan</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     filteredData.map((item) => (
//                       <tr key={item.id} className="border-t border-[#808080] hover:bg-gray-50 transition-colors">
//                         <td className="p-2 text-center text-gray-750">{item.bookingCode}</td>
//                         <td className="p-2 text-center text-gray-750">{item.name}</td>
//                         <td className="p-2 text-center text-gray-750">{item.phone}</td>
//                         <td className="p-2 text-center text-gray-750">{item.email}</td>
//                         <td className="p-2 text-center text-gray-750">{item.note}</td>
//                         <td className="p-2 text-center text-gray-750">
//                           <button
//                             onClick={() => handleAturJadwal(item.bookingCode)}
//                             className="w-[120px] bg-[#8FAFD9] rounded-[10px] hover:bg-[#7ba2d0] text-white cursor-pointer"
//                           >
//                             {item.departure}
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="p-4 text-center text-gray-500">Data tidak ditemukan.</td>
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
