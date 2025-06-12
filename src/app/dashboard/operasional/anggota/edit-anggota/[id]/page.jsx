// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import withAuth from "/src/app/lib/withAuth";
// import Sidebar from "/components/Sidebar";
// import UserMenu from "/components/Pengguna";
// import { CircleArrowLeft } from "lucide-react";

// const EditAnggota = () => {
//   const router = useRouter();
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     role: "",
//     status: "",
//     alamat: "",
//     telepon: "",
//     plat_jeep: "",
//     jumlah_jeep: "",
//     foto_profil: null,
//     foto_jeep: null,
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token || !id) return;

//       try {
//         const res = await fetch("http://localhost:8000/api/users/all", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         const foundUser = data.find((u) => String(u.id) === String(id));
// if (foundUser) {
//   setFormData({
//     ...foundUser,
//     foto_profil: null,
//     foto_jeep: null,
//   });
// } else {
//   alert("User tidak ditemukan!");
// }
//       } catch (error) {
//         console.error("Gagal ambil data:", error);
//       }
//     };

//     fetchUser();
//   }, [id]);

// const handleChange = (e) => {
//   const { name, type, value, files } = e.target;
//   if (type === "file") {
//     setFormData((prev) => ({ ...prev, [name]: files[0] }));
//   } else {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const token = localStorage.getItem("access_token");
//   if (!token) return;

//   const form = new FormData();
//   form.append("_method", "PUT");

//   for (const key in formData) {
//     if (formData[key] !== null && key !== "foto_profil" && key !== "foto_jeep") {
//       form.append(key, formData[key]);
//     }
//   }

//   if (formData.foto_profil instanceof File) {
//     form.append("foto_profil", formData.foto_profil);
//   }

//   if (formData.foto_jeep instanceof File) {
//     form.append("foto_jeep", formData.foto_jeep);
//   }

//   try {
//     const res = await fetch(`http://localhost:8000/api/users/update/${id}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: form,
//     });

//     const result = await res.json();
//     if (res.ok) {
//       alert("Data berhasil diperbarui!");
//       router.push(`/dashboard/operasional/anggota/detail-anggota/${id}`);
//     } else {
//       alert("Gagal update: " + (result.message || "Terjadi kesalahan."));
//     }
//   } catch (error) {
//     console.error("Update error:", error);
//   }
// };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <div className="flex items-center gap-2">
//           <CircleArrowLeft onClick={() => router.back()} className="cursor-pointer" />
//           <h1 className="text-[32px] font-semibold">Edit Anggota</h1>
//         </div>

//         <form onSubmit={handleSubmit} className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4">
//           <div className="text-[16px] font-semibold text-[#1C7AC8]">Role : {formData.role || "-"}</div>
//           <div className="text-[16px] font-semibold text-[#1C7AC8]">Username : {formData.username || "-"}</div>
//           <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Nama" className="input-style" />
//           <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" className="input-style" />

//           {formData.role === "Owner" && (
//             <>
//               <input name="telepon" type="number" value={formData.telepon || ""} onChange={handleChange} placeholder="No Telepon" className="input-style" />
//               <input name="alamat" value={formData.alamat || ""} onChange={handleChange} placeholder="Alamat" className="input-style" />
//               <input name="jumlah_jeep" value={formData.jumlah_jeep || ""} onChange={handleChange} placeholder="Jumlah Jeep" className="input-style" />
//               <input type="file" name="foto_jeep" onChange={handleChange} className="input-style" />
//               <label className="block text-sm text-gray-700">Status</label>
//               <select name="status" value={formData.status} onChange={handleChange} className="input-style">
//                 <option value="Aktif">Aktif</option>
//                 <option value="Tidak Aktif">Tidak Aktif</option>
//               </select>
//             </>
//           )}

//           {formData.role === "Driver" && (
//             <>
//               <input name="plat_jeep" value={formData.plat_jeep || ""} onChange={handleChange} placeholder="Plat Jeep" className="input-style" />
//               <input name="alamat" value={formData.alamat || ""} onChange={handleChange} placeholder="Alamat" className="input-style" />
//               <input type="file" name="foto_profil" onChange={handleChange} className="input-style" />
//               <input name="telepon" type="number" value={formData.telepon || ""} onChange={handleChange} placeholder="No Telepon" className="input-style" />
//               <label className="block text-sm text-gray-700">Status</label>
//               <select name="status" value={formData.status} onChange={handleChange} className="input-style">
//                 <option value="Tersedia">Tersedia</option>
//                 <option value="Tidak Tersedia">Tidak Tersedia</option>
//               </select>
//             </>
//           )}

//           {formData.role === "Pengurus" && (
//             <>
//               <input name="telepon" type="number" value={formData.telepon || ""} onChange={handleChange} placeholder="No Telepon" className="input-style" />
//               <input name="alamat" value={formData.alamat || ""} onChange={handleChange} placeholder="Alamat" className="input-style" />
//             </>
//           )}

//           <div className="flex justify-end">
//             <button type="submit" className="bg-[#1C7AC8] text-[13px] text-white py-1 px-3 rounded-[12px] hover:bg-[#6CAEE5] transition cursor-pointer">
//               Simpan Perubahan
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const inputClass = "mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]";
// export default withAuth(EditAnggota);

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";
import Sidebar from "/components/Sidebar";
import LoadingFunny from "/components/LoadingFunny.jsx";
import { CircleArrowLeft } from "lucide-react";
import Hashids from "hashids";

const EditAnggota = () => {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    alamat: "",
    telepon: "",
    plat_jeep: "",
    foto_profil: null,
    foto_jeep: null,
  });
  const params = useParams();
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);

  const decoded = hashids.decode(params.id);
  const id = decoded[0];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token || !id) return;

      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const foundUser = data.find((u) => String(u.id) === String(id));
        if (foundUser) {
          setFormData({
            ...foundUser,
            foto_profil: null,
            foto_jeep: null,
          });
        } else {
          alert("User tidak ditemukan!");
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const form = new FormData();
    form.append("_method", "PUT");

    for (const key in formData) {
      if (
        formData[key] !== null &&
        key !== "foto_profil" &&
        key !== "foto_jeep"
      ) {
        form.append(key, formData[key]);
      }
    }

    if (formData.foto_profil instanceof File) {
      form.append("foto_profil", formData.foto_profil);
    }

    if (formData.foto_jeep instanceof File) {
      form.append("foto_jeep", formData.foto_jeep);
    }

    try {
      const res = await fetch(`http://localhost:8000/api/users/update/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();
      if (res.ok) {
        // alert("Data berhasil diperbarui!");
        router.back();
        // router.push(`/dashboard/operasional/anggota/detail-anggota/${params.id}`);
      } else {
        alert("Gagal update: " + (result.message || "Terjadi kesalahan."));
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("access_token");
  //   if (!token) return;

  //   try {
  //     const res = await fetch(`http://localhost:8000/api/users/update/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     const result = await res.json();
  //     if (result.success) {
  //       alert("Data berhasil diperbarui!");
  //       router.push(`/dashboard/operasional/anggota/detail-anggota/${id}`);
  //     } else {
  //       alert("Gagal update data: " + result.message);
  //       if (result.errors) {
  //         console.error("Validasi gagal:", result.errors);
  //         alert("Kesalahan validasi: " + JSON.stringify(result.errors));
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("access_token");
  //   if (!token) return;

  //   // Validasi data di frontend (misalnya cek apakah nama sudah diisi)
  //   if (!formData.name) {
  //     alert("Nama tidak boleh kosong!");
  //     return;
  //   }

  //   const formDataToSend = new FormData();

  //   // Menambahkan data ke FormData (perhatikan untuk file)
  //   for (let key in formData) {
  //     if (formData[key]) {
  //       formDataToSend.append(key, formData[key]);
  //     }
  //   }

  //   try {
  //     const res = await fetch(`http://localhost:8000/api/users/update/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //       },
  //       body: formDataToSend, // Kirimkan FormData
  //     });

  //     const result = await res.json();
  //     if (result.success) {
  //       alert("Data berhasil diperbarui!");
  //       router.push(`/dashboard/operasional/anggota/detail-anggota/${id}`);
  //     } else {
  //       alert("Gagal update data: " + result.message);
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("access_token");
  //   if (!token) return;

  //   try {
  //     const res = await fetch(`http://localhost:8000/api/users/update/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     const result = await res.json();
  //     if (result.success) {
  //       alert("Data berhasil diperbarui!");
  //       router.push(`/dashboard/operasional/anggota/detail-anggota/${id}`);
  //     } else {
  //       alert("Gagal update data: " + result.message);
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error);
  //   }
  // };
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
        <div className="flex items-center gap-2">
          <CircleArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
          />
          <h1 className="text-[32px] font-semibold">Edit Anggota</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4"
        >
          <div className="text-[16px] font-semibold text-[#1C7AC8]">
            Role : {formData.role || "-"}
          </div>
          <div className="text-[16px] font-semibold text-[#1C7AC8]">
            Username : {formData.username || "-"}
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
          {formData.role === "Owner" && (
            <>
              <input
                name="telepon"
                type="number"
                value={formData.telepon || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="No Telepon"
                style={{
                  appearance: "textfield",
                  MozAppearance: "textfield",
                }}
              />
              <input
                name="alamat"
                value={formData.alamat || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="Alamat"
              />
              <input
                name="jumlah_jeep"
                value={formData.jumlah_jeep || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="Jumlah Jeep"
              />
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
              <div>
                <label className="block text-sm text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
            </>
          )}

          {formData.role === "Driver" && (
            <>
              <input
                name="alamat"
                value={formData.alamat || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="Alamat"
              />
              <input
                name="telepon"
                type="number"
                value={formData.telepon || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="No Telepon"
                style={{
                  appearance: "textfield",
                  MozAppearance: "textfield",
                }}
              />
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
              <div>
                <label className="block text-sm text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
            </>
          )}

          {formData.role === "Pengurus" && (
            <>
              <input
                name="telepon"
                type="number"
                value={formData.telepon || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="No Telepon"
                style={{
                  appearance: "textfield",
                  MozAppearance: "textfield",
                }}
              />
              <input
                name="alamat"
                value={formData.alamat || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="Alamat"
              />
              <div>
                <label className="block text-sm text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
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
            </>
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

export default withAuth(EditAnggota);
