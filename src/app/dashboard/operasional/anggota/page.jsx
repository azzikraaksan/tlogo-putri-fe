// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "/components/Sidebar";
// import UserMenu from "/components/Pengguna";
// import TambahAnggota from "/components/TambahAnggota";
// import DetailAnggota from "/components/LihatDetail";
// import SearchInput from "/components/Search";
// import withAuth from "/src/app/lib/withAuth";
// import { Trash2, Plus, ListFilter } from "lucide-react";

// const AnggotaPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [modeTambah, setModeTambah] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       if (typeof window !== "undefined") {
//         const token = localStorage.getItem("access_token");

//         if (!token) return;

//         try {
//           const res = await fetch("http://localhost:8000/api/users/all", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           const data = await res.json();
//           setUsers(data);
//         } catch (err) {
//           console.error("Gagal ambil data users:", err);
//         }
//       }
//     };

//     fetchUsers();
//   }, []);

//   const filteredData = users.filter((item) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       (item?.email || "").toLowerCase().includes(search) ||
//       (item?.peran || "").toLowerCase().includes(search) ||
//       (item?.status || "").toLowerCase().includes(search)
//     );
//   });

//   const handleTambahAnggota = () => {
//     setModeTambah(true);
//   };

//   const handleKembali = () => {
//     setModeTambah(false);
//   };

//   const handleLihatDetail = (user) => {
//     if (user?.id) {
//       router.push(`/dashboard/operasional/anggota/detail-anggota/${user.id}`);
//     }
//   };

//   const handleKembaliDariDetail = () => {
//     setSelectedUser(null);
//   };

//   const handleHapusUser = async (id) => {
//     if (!id) return;

//     const konfirmasi = window.confirm("Yakin mau hapus user ini?");
//     if (!konfirmasi) return;

//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       const res = await fetch(`http://localhost:8000/api/users/delete/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
//         alert("User berhasil dihapus!");
//       } else {
//         console.error("Gagal hapus user");
//         alert("Gagal hapus user.");
//       }
//     } catch (error) {
//       console.error("Error saat hapus user:", error);
//       alert("Terjadi kesalahan saat menghapus.");
//     }
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />

//       <div className="flex-1 p-6">
//         {modeTambah ? (
//           <TambahAnggota onKembali={handleKembali} />
//         ) : selectedUser ? (
//           <DetailAnggota
//             user={selectedUser}
//             onKembali={handleKembaliDariDetail}
//           />
//         ) : (
//           <>
//             <h1 className="text-[32px] font-semibold mb-6 text-black">
//               Daftar Anggota
//             </h1>

//             <div className="flex relative">
//               <button
//                 onClick={toggleDropdown}
//                 className="bg-[#1C7AC8] rounded-[10px] text-white py-1 px-3 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
//               >
//                 <ListFilter size={20} className="mr-2 w-[20px] h-auto" />
//                 Filter
//               </button>

//               {isDropdownOpen && (
//                 <div className="absolute top-full mt-2 shadow-md z-10">
//                   <ul>
//                     <li
//                       className="px-4 py-2 cursor-pointer hover:bg-[#7ba2d0] text-white bg-[#1C7AC8]"
//                       onClick={() => console.log("Front Office selected")}
//                     >
//                       Front Office
//                     </li>
//                     <li
//                       className="px-4 py-2 cursor-pointer hover:bg-[#7ba2d0] text-white bg-[#1C7AC8]"
//                       onClick={() => console.log("Owner selected")}
//                     >
//                       Owner
//                     </li>
//                     <li
//                       className="px-4 py-2 cursor-pointer hover:bg-[#7ba2d0] text-white bg-[#1C7AC8]"
//                       onClick={() => console.log("Driver selected")}
//                     >
//                       Driver
//                     </li>
//                     <li
//                       className="px-4 py-2 cursor-pointer hover:bg-[#7ba2d0] text-white bg-[#1C7AC8]"
//                       onClick={() => console.log("Pengurus selected")}
//                     >
//                       Pengurus
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* <div className="flex">
//               <button
//                 onClick={() => {}}
//                 className="bg-[#1C7AC8] rounded-[10px] text-white py-1 px-3 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
//               >
//                 <ListFilter size={20} className="mr-2 w-[20px] h-auto" />
//                 Filter
//               </button>
//             </div> */}

//             <div className="flex">
//               <button
//                 onClick={handleTambahAnggota}
//                 className="bg-[#1C7AC8] rounded-[10px] text-white py-1 px-3 mt-2 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
//               >
//                 <Plus size={18} className="mr-2 w-[20px] h-auto" />
//                 Tambah Anggota
//               </button>
//             </div>

//             <div className="flex justify-end mb-7">
//               <SearchInput
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onClear={() => setSearchTerm("")}
//                 placeholder="Cari"
//               />
//             </div>

//             {/* <div className="overflow-x-auto">
//               <table className="w-full table-auto">
//                 <thead className="text-gray-500"> */}
//             <div className="overflow-x-auto bg-white rounded-xl shadow">
//               <table className="w-full table-auto">
//                 <thead className="bg-[#3D6CB9] text-white ">
//                   <tr>
//                     <th className="p-2 text-center font-normal">ID</th>
//                     <th className="p-2 text-center font-normal">Nama</th>
//                     <th className="p-2 text-center font-normal">Email</th>
//                     <th className="p-2 text-center font-normal">Peran</th>
//                     <th className="p-2 text-center font-normal">Status</th>
//                     <th className="p-2 text-center font-normal">Aksi</th>
//                     <th className="p-2 text-center font-normal">Hapus</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     filteredData.map((item, index) => (
//                       <tr
//                         key={item?.id || index}
//                         className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.id || "-"}
//                         </td>
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.name || "-"}
//                         </td>
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.email || "-"}
//                         </td>
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.role || "-"}
//                         </td>
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.status || "-"}
//                         </td>
//                         <td className="p-2 text-center">
//                           <button
//                             onClick={() => handleLihatDetail(item)}
//                             className="w-[120px] bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] transition cursor-pointer"
//                           >
//                             Lihat Detail
//                           </button>
//                         </td>
//                         <td className="text-center">
//                           <button
//                             className="text-gray-500 hover:text-gray-700 cursor-pointer"
//                             onClick={() => item?.id && handleHapusUser(item.id)}
//                             title="Hapus"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="p-4 text-center text-gray-500">
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

// export default withAuth(AnggotaPage);

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "/components/Sidebar";
import UserMenu from "/components/Pengguna";
import TambahAnggota from "/components/TambahAnggota";
import DetailAnggota from "/components/LihatDetail";
import SearchInput from "/components/Search";
import withAuth from "/src/app/lib/withAuth";
import { Trash2, Plus, ListFilter } from "lucide-react";
import Hashids from "hashids";

const AnggotaPage = () => {
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [searchTerm, setSearchTerm] = useState("");
  const [modeTambah, setModeTambah] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const url = roleFilter
          ? `http://localhost:8000/api/users/by-role?role=${roleFilter}`
          : "http://localhost:8000/api/users/all";

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Gagal ambil data users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter]);

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

  const handleLihatDetail = (user) => {
    if (user?.id) {
      const encryptedId = hashids.encode(user.id);
      router.push(
        `/dashboard/operasional/anggota/detail-anggota/${encryptedId}`
      );
      // router.push(`/dashboard/operasional/anggota/detail-anggota/${user.id}`);
    }
  };

  const handleKembaliDariDetail = () => {
    setSelectedUser(null);
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-90">
        <div className="shadow-md p-6 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">Loading...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
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
        {modeTambah ? (
          <TambahAnggota onKembali={handleKembali} />
        ) : selectedUser ? (
          <DetailAnggota
            user={selectedUser}
            onKembali={handleKembaliDariDetail}
          />
        ) : (
          <>
            <h1 className="text-[32px] font-semibold mb-6 text-black">
              Daftar Anggota
            </h1>

            <div className="flex relative">
              <button
                onClick={toggleDropdown}
                className="bg-[#3D6CB9] rounded-[10px] text-white py-1 px-3 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
              >
                <ListFilter size={20} className="mr-2 w-[20px] h-auto" />
                Filter
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-2 shadow-md z-10">
                  <ul>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-[#7ba2d0] text-white bg-[#1C7AC8]"
                      onClick={() => {
                        setRoleFilter("");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Semua
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-[#7ba2d0] text-white bg-[#1C7AC8]"
                      onClick={() => {
                        setRoleFilter("Front Office");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Front Office
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-[#7ba2d0] text-white bg-[#1C7AC8]"
                      onClick={() => {
                        setRoleFilter("Owner");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Owner
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-[#7ba2d0] text-white bg-[#1C7AC8]"
                      onClick={() => {
                        setRoleFilter("Driver");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Driver
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-[#7ba2d0] text-white bg-[#1C7AC8]"
                      onClick={() => {
                        setRoleFilter("Pengurus");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Pengurus
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* <div className="flex">
              <button 
                onClick={() => {}}
                className="bg-[#1C7AC8] rounded-[10px] text-white py-1 px-3 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
              >
                <ListFilter size={20} className="mr-2 w-[20px] h-auto" />
                Filter
              </button>
            </div> */}

            <div className="flex">
              <button
                onClick={handleTambahAnggota}
                className="bg-[#3D6CB9] rounded-[10px] text-white py-1 px-3 mt-2 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
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

            {/* <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="text-gray-500"> */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="w-full table-auto">
                <thead className="bg-[#3D6CB9] text-white ">
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
                            onClick={() => handleLihatDetail(item)}
                            className="w-[120px] bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] transition cursor-pointer"
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
// import { useRouter } from "next/navigation"; // Import useRouter untuk navigasi
// import Sidebar from "/components/Sidebar";
// import UserMenu from "/components/Pengguna";
// import TambahAnggota from "/components/TambahAnggota";
// import SearchInput from "/components/Search";
// import withAuth from "/src/app/lib/withAuth";
// import { Trash2, Plus, ListFilter } from "lucide-react";

// const AnggotaPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [modeTambah, setModeTambah] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const router = useRouter(); // Inisialisasi router untuk navigasi

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       try {
//         const res = await fetch("http://localhost:8000/api/users/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         setUsers(data);
//       } catch (err) {
//         console.error("Gagal ambil data users:", err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const filteredData = users.filter((item) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       (item?.email || "").toLowerCase().includes(search) ||
//       (item?.peran || "").toLowerCase().includes(search) ||
//       (item?.status || "").toLowerCase().includes(search)
//     );
//   });

//   const handleLihatDetail = (id) => {
//     // Navigasi ke halaman detail-anggota dengan ID
//     router.push(`/dashboard/operasional/anggota/detail-anggota/${id}`);
//   };

//   const handleHapusUser = async (id) => {
//     if (!id) return;

//     const konfirmasi = window.confirm("Yakin mau hapus user ini?");
//     if (!konfirmasi) return;

//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       const res = await fetch(`http://localhost:8000/api/users/delete/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
//         alert("User berhasil dihapus!");
//       } else {
//         console.error("Gagal hapus user");
//         alert("Gagal hapus user.");
//       }
//     } catch (error) {
//       console.error("Error saat hapus user:", error);
//       alert("Terjadi kesalahan saat menghapus.");
//     }
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         {modeTambah ? (
//           <TambahAnggota />
//         ) : (
//           <>
//             <h1 className="text-[32px] font-semibold mb-6 text-black">
//               Daftar Anggota
//             </h1>

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
//                     <th className="p-2 text-center font-normal">ID</th>
//                     <th className="p-2 text-center font-normal">Nama</th>
//                     <th className="p-2 text-center font-normal">Email</th>
//                     <th className="p-2 text-center font-normal">Peran</th>
//                     <th className="p-2 text-center font-normal">Status</th>
//                     <th className="p-2 text-center font-normal">Aksi</th>
//                     <th className="p-2 text-center font-normal">Hapus</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     filteredData.map((item, index) => (
//                       <tr
//                         key={item?.id || index}
//                         className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.id || "-"}
//                         </td>
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.name || "-"}
//                         </td>
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.email || "-"}
//                         </td>
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.role || "-"}
//                         </td>
//                         <td className="p-2 text-center text-gray-700">
//                           {item?.status || "-"}
//                         </td>
//                         <td className="p-2 text-center">
//                           <button
//                             onClick={() => handleLihatDetail(item.id)} // Panggil handleLihatDetail dengan id
//                             className="w-[120px] bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] py-1 px-3 hover:bg-[#7ba2d0] transition cursor-pointer"
//                           >
//                             Lihat Detail
//                           </button>
//                         </td>
//                         <td className="text-center">
//                           <button
//                             className="text-gray-500 hover:text-gray-700 cursor-pointer"
//                             onClick={() => item?.id && handleHapusUser(item.id)}
//                             title="Hapus"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="p-4 text-center text-gray-500">
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

// export default withAuth(AnggotaPage);
