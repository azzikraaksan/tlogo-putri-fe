// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import withAuth from "/src/app/lib/withAuth";
// import Sidebar from "/components/Sidebar";
// import UserMenu from "/components/Pengguna";
// import { CircleArrowLeft } from "lucide-react";

// const EditAnggota = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     role: "",
//     status: "",
//     alamat: "",
//     telepon: "",
//     plat_jeep: "",
//     foto_profil: null,
//     foto_jeep: null,
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       try {
//         const res = await fetch("http://localhost:8000/api/users/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setFormData(data);
//       } catch (error) {
//         console.error("Gagal ambil data:", error);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleChange = (e) => {
//     if (e.target.type === "file") {
//       setFormData({ ...formData, [e.target.name]: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("access_token");
//     if (!token) return;

//     try {
//       const res = await fetch("http://localhost:8000/api/users/update", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();
//       if (result.success) {
//         alert("Data berhasil diperbarui!");
//         router.push(`/dashboard/profil`);
//       } else {
//         alert("Gagal update data: " + result.message);
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//     }
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <div className="flex items-center gap-2">
//           <CircleArrowLeft
//             onClick={() => router.back()}
//             className="cursor-pointer"
//           />
//           <h1 className="text-[32px] font-semibold">Edit Anggota</h1>
//         </div>
//         <form
//           onSubmit={handleSubmit}
//           className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4"
//         >
//           <div className="text-[16px] font-semibold text-[#1C7AC8]">Role : {formData.role || "-"}</div>
//           <div className="text-[16px] font-semibold text-[#1C7AC8]">Username : {formData.username || "-"}</div>

//           <input
//             name="name"
//             value={formData.name || ""}
//             onChange={handleChange}
//             className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//             placeholder="Nama"
//           />

//           <input
//             name="email"
//             value={formData.email || ""}
//             onChange={handleChange}
//             className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//             placeholder="Email"
//           />

//           {formData.role === "Owner" && (
//             <>
//               <input
//                 name="telepon"
//                 type="number"
//                 value={formData.telepon || ""}
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 placeholder="No Telepon"
//               />
//               <input
//                 name="alamat"
//                 value={formData.alamat || ""}
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 placeholder="Alamat"
//               />
//               <input
//                 name="jumlah_jeep"
//                 value={formData.jumlah_jeep || ""}
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 placeholder="Jumlah Jeep"
//               />
//               <input
//                 type="file"
//                 name="foto_jeep"
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//               />
//               <div>
//                 <label className="block text-sm text-gray-700">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 >
//                   <option value="Aktif">Aktif</option>
//                   <option value="Tidak Aktif">Tidak Aktif</option>
//                 </select>
//               </div>
//             </>
//           )}

//           {formData.role === "Driver" && (
//             <>
//               <input
//                 name="plat_jeep"
//                 value={formData.plat_jeep || ""}
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 placeholder="Plat Jeep"
//               />
//               <input
//                 name="alamat"
//                 value={formData.alamat || ""}
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 placeholder="Alamat"
//               />
//               <input
//                 type="file"
//                 name="foto_profil"
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//               />
//               <input
//                 name="telepon"
//                 type="number"
//                 value={formData.telepon || ""}
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 placeholder="No Telepon"
//               />
//               <div>
//                 <label className="block text-sm text-gray-700">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 >
//                   <option value="Aktif">Aktif</option>
//                   <option value="Tidak Aktif">Tidak Aktif</option>
//                 </select>
//               </div>
//             </>
//           )}

//           {formData.role === "Pengurus" && (
//             <>
//               <input
//                 name="telepon"
//                 type="number"
//                 value={formData.telepon || ""}
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 placeholder="No Telepon"
//               />
//               <input
//                 name="alamat"
//                 value={formData.alamat || ""}
//                 onChange={handleChange}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 placeholder="Alamat"
//               />
//             </>
//           )}

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-[#1C7AC8] text-[13px] text-white py-1 px-3 rounded-[12px] hover:bg-[#6CAEE5] transition cursor-pointer"
//             >
//               Simpan Perubahan
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default withAuth(EditAnggota);

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar";
import LoadingFunny from "/components/LoadingFunny.jsx";

const EditProfil = () => {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
    status: "",
    alamat: "",
    telepon: "",
    foto_profil: null,
    foto_jeep: null,
    plat_jeep: "",
    jumlah_jeep: "",
  });

  const [loading, setLoading] = useState(true);

  const roleFields = {
    "Front Office": [],
    Owner: ["alamat", "telepon", "foto_profil", "status", "jumlah_jeep"],
    Driver: ["alamat", "telepon", "foto_profil", "status"],
    Pengurus: ["alamat", "telepon", "foto_profil", "status"],
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data) {
          setFormData(data.data); // ✅ hanya ambil data-nya saja
        }
        setLoading(false);
      } catch (error) {
        console.error("Gagal ambil data:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files ? files[0] : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          id: user.role === "Front Office" ? userTargetId : undefined, // hanya kirim kalau FO
          name: "Sky Muhammad Zulfan",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Gagal update:", data.message || data);
      } else {
        console.log("Update berhasil:", data);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("access_token");
  //   if (!token) return;

  //   try {
  //     const res = await fetch("http://localhost:8000/api/users/update", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         id: userRole === "FO" ? userIdTarget : undefined,
  //       }),
  //     });

  //     const result = await res.json();
  //     if (result.success) {
  //       alert("Data berhasil diperbarui!");
  //       router.push("/dashboard/profil");
  //     } else {
  //       alert("Gagal update data: " + result.message);
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error);
  //   }
  // };

  if (loading) return <div>Loading...</div>;

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
        <div className="flex items-center gap-2">
          <CircleArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
          />
          <h1 className="text-[32px] font-semibold">Edit Profil</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4"
        >
          <div className="text-[16px] font-semibold text-[#1C7AC8]">
            Role: {formData.role || "-"}
          </div>
          <div className="text-[16px] font-semibold text-[#1C7AC8]">
            Username: {formData.username || "-"}
          </div>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
            placeholder="Nama"
          />
          <input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
            placeholder="Email"
          />

          {roleFields[formData.role]?.includes("alamat") && (
            <input
              name="alamat"
              value={formData.alamat || ""}
              onChange={handleChange}
              className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
              placeholder="Alamat"
            />
          )}

          {roleFields[formData.role]?.includes("telepon") && (
            <input
              name="telepon"
              value={formData.telepon || ""}
              onChange={handleChange}
              className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
              placeholder="Telepon"
            />
          )}

          {roleFields[formData.role]?.includes("foto_profil") && (
            <input
              type="file"
              name="foto_profil"
              onChange={handleChange}
              className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
            />
          )}

          {formData.role === "Owner" && (
            <>
              {roleFields[formData.role]?.includes("jumlah_jeep") && (
                <input
                  name="jumlah_jeep"
                  value={formData.jumlah_jeep || ""}
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                  placeholder="Jumlah Jeep"
                />
              )}
            </>
          )}

          {formData.role !== "Front Office" && (
            <div>
              <label className="block text-sm text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#1C7AC8] text-[13px] text-white py-1 px-3 rounded-[12px] hover:bg-[#6CAEE5] transition cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfil;
