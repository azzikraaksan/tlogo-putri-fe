// "use client";
// import { useState } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import { useRouter } from "next/navigation";
// import { Pencil, Trash2, Printer } from "lucide-react";

// const initialData = [
//   {
//     bookingCode: "JTP001",
//     name: "Bunde",
//     phone: "081234567890",
//     email: "bundee@gmail.com",
//     lambung: "001",
//     driver: "Sobray A",
//   },
//   {
//     bookingCode: "JTP002",
//     name: "Zimut",
//     phone: "089876543210",
//     email: "zimut@gmail.com",
//     lambung: "002",
//     driver: "Sobray B",
//   },
//   {
//     bookingCode: "JTP003",
//     name: "Naon Maneh",
//     phone: "081234567890",
//     email: "naon@gmail.com",
//     lambung: "003",
//     driver: "Sobray 1",
//   },
//   {
//     bookingCode: "JTP004",
//     name: "Maneh Saha",
//     phone: "089876543210",
//     email: "saha@gmail.com",
//     lambung: "004",
//     driver: "Sobray 2",
//   },
// ];

// const PenjadwalanPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [data, setData] = useState(initialData);
//   const [checked, setChecked] = useState([]);
//   const router = useRouter();

//   const handleCheckbox = (bookingCode) => {
//     const isChecked = checked.includes(bookingCode);
//     let newChecked;
//     if (isChecked) {
//       newChecked = checked.filter((code) => code !== bookingCode);
//     } else {
//       newChecked = [...checked, bookingCode];
//     }

//     const newData = [...data];
//     const index = newData.findIndex((d) => d.bookingCode === bookingCode);
//     const [selectedItem] = newData.splice(index, 1);
//     if (!isChecked) {
//       newData.push(selectedItem);
//     } else {
//       newData.unshift(selectedItem);
//     }

//     setChecked(newChecked);
//     setData(newData);
//   };

//   const filteredData = data.filter(
//     (item) =>
//       item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.lambung.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAturJadwal = (bookingCode, selectedDriver) => {
//     const newData = data.map((item) =>
//       item.bookingCode === bookingCode ? { ...item, driver: selectedDriver } : item
//     );
//     setData(newData);
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-[32px] font-semibold mb-6 text-black">Ticketing</h1>

//         <div className="flex justify-end mb-7">
//           <SearchInput
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onClear={() => setSearchTerm("")}
//             placeholder="Cari"
//           />
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full table-auto">
//             <thead className="text-gray-500">
//               <tr>
//                 <th className="p-2 text-center font-normal">Pilih</th>
//                 <th className="p-2 text-center font-normal">Kode Pemesanan</th>
//                 <th className="p-2 text-center font-normal">Nama Pemesan</th>
//                 <th className="p-2 text-center font-normal">No. HP</th>
//                 <th className="p-2 text-center font-normal">Email</th>
//                 <th className="p-2 text-center font-normal">No. Lambung</th>
//                 <th className="p-2 text-center font-normal">Nama Driver</th>
//                 <th className="p-2 text-center font-normal">Ubah Driver</th>
//                 <th className="p-2 text-center font-normal">Cetak Tiket</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((item) => (
//                   <tr
//                     key={item.bookingCode}
//                     className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="p-2 text-center">
//                       <input
//                         type="checkbox"
//                         checked={checked.includes(item.bookingCode)}
//                         onChange={() => handleCheckbox(item.bookingCode)}
//                         className="cursor-pointer"
//                       />
//                     </td>
//                     <td className="p-2 text-center text-gray-750">{item.bookingCode}</td>
//                     <td className="p-2 text-center text-gray-750">{item.name}</td>
//                     <td className="p-2 text-center text-gray-750">{item.phone}</td>
//                     <td className="p-2 text-center text-gray-750">{item.email}</td>
//                     <td className="p-2 text-center text-gray-750">{item.lambung}</td>
//                     <td className="p-2 text-center text-gray-750">{item.driver}</td>
//                     <td className="p-2 text-center text-gray-750">
//                       <div className="relative inline-block w-[140px]">
//                         <select
//                           value={item.driver}
//                           onChange={(e) =>
//                             handleAturJadwal(item.bookingCode, e.target.value)
//                           }
//                           className="w-full bg-[#1C7AC8] text-white rounded-[10px] cursor-pointer appearance-none py-1 pl-3 pr-8"
//                         >
//                           <option value="">Pilih Driver</option>
//                           <option value="Zimut">Zimut</option>
//                           <option value="Bunde">Bunde</option>
//                           <option value="Lis">Lis</option>
//                         </select>
//                         <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white">
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M19 9l-7 7-7-7"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-2 text-center text-gray-750 space-x-2">
//                       <button
//                         className="text-gray-500 hover:text-gray-700 cursor-pointer"
//                         onClick={() => console.log("Print", item.bookingCode)}
//                         title="Print"
//                       >
//                         <Printer size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="9" className="p-4 text-center text-gray-500">
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
import { useState, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { Printer, ArchiveRestore } from "lucide-react";

const TicketingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    const savedDrivers =
      JSON.parse(localStorage.getItem("selectedDrivers")) || [];
    const mappedData = savedDrivers.map((driver, index) => ({
      bookingCode: `JTP${(index + 1).toString().padStart(3, "0")}`,
      name: driver.name,
      phone: "081234567890",
      email: `${driver.name.toLowerCase()}@gmail.com`,
      lambung: `00${index + 1}`,
      driver: driver.name,
    }));
    setData(mappedData);
  }, []);

  const handleCheckbox = (bookingCode) => {
    const isChecked = checked.includes(bookingCode);
    let newChecked;
    if (isChecked) {
      newChecked = checked.filter((code) => code !== bookingCode);
    } else {
      newChecked = [...checked, bookingCode];
    }

    const newData = [...data];
    const index = newData.findIndex((d) => d.bookingCode === bookingCode);
    const [selectedItem] = newData.splice(index, 1);
    if (!isChecked) {
      newData.push(selectedItem);
    } else {
      newData.unshift(selectedItem);
    }

    setChecked(newChecked);
    setData(newData);
  };

  const filteredData = data.filter(
    (item) =>
      item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lambung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAturJadwal = (bookingCode, selectedDriver) => {
    const newData = data.map((item) =>
      item.bookingCode === bookingCode
        ? { ...item, driver: selectedDriver }
        : item
    );
    setData(newData);
  };

  const handleClickArsip = () => {
    console.log("Arsip diklik");
  };
  

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-[32px] font-semibold mb-6 text-black">Ticketing</h1>

        <div className="flex justify-end mb-2">
          <button
            onClick={handleClickArsip}
            className="flex items-center gap-2 border border-gray-300 rounded-[13px] px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArchiveRestore input="text" className="text-gray-500 size-[18px]" />
            <div className="text-gray-500">Arsip</div>
          </button>
        </div>

        <div className="flex justify-end mb-7">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Cari"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-gray-500">
              <tr>
                <th className="p-2 text-center font-normal">Pilih</th>
                <th className="p-2 text-center font-normal">Kode Pemesanan</th>
                <th className="p-2 text-center font-normal">Nama Pemesan</th>
                <th className="p-2 text-center font-normal">No. HP</th>
                <th className="p-2 text-center font-normal">Email</th>
                <th className="p-2 text-center font-normal">No. Lambung</th>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                <th className="p-2 text-center font-normal">Ubah Driver</th>
                <th className="p-2 text-center font-normal">Cetak Tiket</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.bookingCode}
                    className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={checked.includes(item.bookingCode)}
                        onChange={() => handleCheckbox(item.bookingCode)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.bookingCode}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.name}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.phone}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.email}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.lambung}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.driver}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      <div className="relative inline-block w-[140px]">
                        <select
                          value={item.driver}
                          onChange={(e) =>
                            handleAturJadwal(item.bookingCode, e.target.value)
                          }
                          className="w-full bg-[#1C7AC8] text-white rounded-[10px] cursor-pointer appearance-none py-1 pl-3 pr-8"
                        >
                          <option value="">Pilih Driver</option>
                          <option value="Zimut">Zimut</option>
                          <option value="Bunde">Bunde</option>
                          <option value="Lis">Lis</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-center text-gray-750 space-x-2">
                      <button
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => console.log("Print", item.bookingCode)}
                        title="Print"
                      >
                        <Printer size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
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

export default withAuth(TicketingPage);
