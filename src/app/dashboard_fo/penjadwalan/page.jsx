// "use client";
// import Sidebar from "/components/Sidebar.jsx";
// import withAuth from "/src/app/lib/withAuth.jsx";

// const DashboardPage = () => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="p-4 flex-1">
//         <h1 className="text-6xl text-center font-semibold mt-4 mb-2 text-teal-600">
//           Halo ini Penjadwalan
//         </h1>
//         <p className="text-center max-w-xl mx-auto">
//           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eius
//           repudiandae iure a asperiores! Amet magnam incidunt non consequatur,
//           voluptates veniam iusto sunt, velit omnis alias autem. Aliquid,
//           recusandae? Et, laudantium.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default withAuth(DashboardPage);

"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import withAuth from "/src/app/lib/withAuth";

const dummyData = [
  {
    id: 1,
    bookingCode: "JTP001",
    name: "Budi Santoso",
    phone: "081234567890",
    email: "budi@example.com",
    note: "Butuh jeep besar",
    departure: "2025-04-20",
  },
  {
    id: 2,
    bookingCode: "JTP002",
    name: "Sari Wulandari",
    phone: "089876543210",
    email: "sari@example.com",
    note: "Berangkat pagi",
    departure: "2025-04-21",
  },
];

const PenjadwalanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredData = dummyData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-teal-700">
          EndPoint Pemesanan
        </h2>

        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-2 text-left">Pilih</th>
                <th className="p-2 text-left">Kode Booking</th>
                <th className="p-2 text-left">Nama</th>
                <th className="p-2 text-left">No HP</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Catatan</th>
                <th className="p-2 text-left">Keberangkatan</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </td>
                    <td className="p-2">{item.bookingCode}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.phone}</td>
                    <td className="p-2">{item.email}</td>
                    <td className="p-2">{item.note}</td>
                    <td className="p-2">{item.departure}</td>
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
