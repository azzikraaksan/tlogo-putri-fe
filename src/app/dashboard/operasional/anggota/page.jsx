"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "/components/Sidebar";
import UserMenu from "/components/Pengguna";
import TambahAnggota from "/components/TambahAnggota";
import SearchInput from "/components/Search";
import withAuth from "/src/app/lib/withAuth";
import { Trash2, Plus, ListFilter } from "lucide-react";

const AnggotaPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modeTambah, setModeTambah] = useState(false);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");

        if (!token) return;

        try {
          const res = await fetch("http://localhost:8000/api/users/all", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();
          setUsers(data);
        } catch (err) {
          console.error("Gagal ambil data users:", err);
        }
      }
    };

    fetchUsers();
  }, []);

  const filteredData = users.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      (item?.email || "").toLowerCase().includes(search) ||
      (item?.peran || "").toLowerCase().includes(search) ||
      (item?.status || "").toLowerCase().includes(search)
    );
  });

  const handleTambahAnggota = () => {
    setModeTambah(true);
  };

  const handleKembali = () => {
    setModeTambah(false);
  };

  const LihatDetailPage  = (id) => {
    router.push(`/dashboard/penjadwalan/lihat-detail/${id}`);
  };

  const handleHapusUser = async (id) => {
    if (!id) return;
  
    const konfirmasi = window.confirm("Yakin mau hapus user ini?");
    if (!konfirmasi) return;
  
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
  
      const res = await fetch(`http://localhost:8000/api/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        alert("User berhasil dihapus!");
      } else {
        console.error("Gagal hapus user");
        alert("Gagal hapus user.");
      }
    } catch (error) {
      console.error("Error saat hapus user:", error);
      alert("Terjadi kesalahan saat menghapus.");
    }
  };
  

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />

      <div className="flex-1 p-6">
        {modeTambah ? (
          <TambahAnggota onKembali={handleKembali} />
        ) : (
          <>
            <h1 className="text-[32px] font-semibold mb-6 text-black">
              Daftar Anggota
            </h1>

            <div className="flex">
              <button
                onClick={() => {}}
                className="bg-[#1C7AC8] rounded-[10px] text-white py-1 px-3 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
              >
                <ListFilter size={20} className="mr-2 w-[20px] h-auto" />
                Filter
              </button>
            </div>

            <div className="flex">
              <button
                onClick={handleTambahAnggota}
                className="bg-[#1C7AC8] rounded-[10px] text-white py-1 px-3 mt-2 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
              >
                <Plus size={18} className="mr-2 w-[20px] h-auto" />
                Tambah Anggota
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
                    <th className="p-2 text-center font-normal">ID</th>
                    <th className="p-2 text-center font-normal">Nama</th>
                    <th className="p-2 text-center font-normal">Email</th>
                    <th className="p-2 text-center font-normal">Peran</th>
                    <th className="p-2 text-center font-normal">Status</th>
                    <th className="p-2 text-center font-normal">Aksi</th>
                    <th className="p-2 text-center font-normal">Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item?.id || index}
                        className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-2 text-center text-gray-700">
                          {item?.id || "-"}
                        </td>
                        <td className="p-2 text-center text-gray-700">
                          {item?.name || "-"}
                        </td>
                        <td className="p-2 text-center text-gray-700">
                          {item?.email || "-"}
                        </td>
                        <td className="p-2 text-center text-gray-700">
                          {item?.role || "-"}
                        </td>
                        <td className="p-2 text-center text-gray-700">
                          {item?.status || "-"}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() =>
                              item?.id && LihatDetailPage (item.id)
                            }
                            className="w-[120px] bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] py-1 px-3 hover:bg-[#7ba2d0] transition cursor-pointer"
                          >
                            Lihat Detail
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => item?.id && handleHapusUser(item.id)}
                            title="Hapus"
                          >
                            <Trash2 size={18} />
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
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(AnggotaPage);

// "use client";
// import { useState, useEffect } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import TambahAnggota from "/components/TambahAnggota.jsx";
// import SearchInput from "/components/Search.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import { useRouter } from "next/navigation";
// import { Trash2, Plus, ListFilter } from "lucide-react";

// const AnggotaPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [users, setUsers] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem("access_token");

//       if (!token) return;

//       try {
//         const res = await fetch("http://localhost:8000/api/users", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         console.log(data);
//         setUsers(data);
//       } catch (err) {
//         console.error("Gagal ambil data users:", err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const filteredData = (users || []).filter((item) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       (item?.email || "").toLowerCase().includes(search) ||
//       (item?.peran || "").toLowerCase().includes(search) ||
//       (item?.status || "").toLowerCase().includes(search)
//     );
//   });

//   const handleTambahAnggota = () => {
//     router.push('/TambahAnggota');
//   };

//   const handleAturJadwal = (id) => {
//     router.push(`/dashboard/penjadwalan/atur-jadwal/${id}`);
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-[32px] font-semibold mb-6 text-black">
//           Daftar Anggota
//         </h1>

// <div className="flex">
//   <button
//     onClick={() => handleTambahAnggota(item.id)}
//     className="bg-[#1C7AC8] rounded-[10px] text-white py-1 px-3 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
//   >
//     <ListFilter size={20} className="mr-2 w-[20px] h-auto" />
//     Filter
//   </button>
// </div>
// <div className="flex">
//   <button
//     onClick={handleTambahAnggota}
//     className="bg-[#1C7AC8] rounded-[10px] text-white py-1 px-3 mt-2 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
//   >
//     <Plus size={18} className="mr-2 w-[20px] h-auto"/>
//     Tambah Anggota
//   </button>
// </div>

//         <div className="flex justify-end mb-7 mt-4">
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
//                 <th className="p-2 text-center font-normal">ID</th>
//                 <th className="p-2 text-center font-normal">Nama</th>
//                 <th className="p-2 text-center font-normal">Email</th>
//                 <th className="p-2 text-center font-normal">Peran</th>
//                 <th className="p-2 text-center font-normal">Status</th>
//                 <th className="p-2 text-center font-normal">Aksi</th>
//                 <th className="p-2 text-center font-normal">Hapus</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((item, index) => (
//                   <tr
//                     key={item?.id || index}
//                     className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="p-2 text-center text-gray-700">
//                       {item?.id || "-"}
//                     </td>
//                     <td className="p-2 text-center text-gray-700">
//                       {item?.name || "-"}
//                     </td>
//                     <td className="p-2 text-center text-gray-700">
//                       {item?.email || "-"}
//                     </td>
//                     <td className="p-2 text-center text-gray-700">
//                       {item?.role || "-"}
//                     </td>
//                     <td className="p-2 text-center text-gray-700">
//                       {item?.status || "-"}
//                     </td>
//                     <td className="p-2 text-center">
//                       <button
//                         onClick={() => item?.id && handleAturJadwal(item.id)}
//                         className="w-[120px] bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] py-1 px-3 cursor-pointer hover:bg-[#7ba2d0] transition"
//                       >
//                         Lihat Detail
//                       </button>
//                     </td>
//                     <td className="text-center">
//                       <button
//                         className="text-gray-500 hover:text-gray-700 cursor-pointer"
//                         onClick={() =>
//                           item?.id && console.log("Hapus", item.id)
//                         }
//                         title="Hapus"
//                       >
//                         <Trash2 size={18} />
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

// export default withAuth(AnggotaPage);
