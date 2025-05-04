"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";
import Sidebar from "/components/Sidebar";
import UserMenu from "/components/Pengguna";
import { CircleArrowLeft } from "lucide-react";

const EditAnggota = () => {
  const router = useRouter();
  const { id } = useParams();
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

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token || !id) return;

      try {
        const res = await fetch("http://localhost:8000/api/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const foundUser = data.find((u) => String(u.id) === String(id));
        if (foundUser) {
          setFormData(foundUser);
        } else {
          alert("User tidak ditemukan!");
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/api/users/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        alert("Data berhasil diperbarui!");
        router.push(`/dashboard/operasional/anggota/detail-anggota/${id}`);
      } else {
        alert("Gagal update data: " + result.message);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
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
          <div className="text-[16px] font-semibold text-[#1C7AC8]">Role : {formData.role || "-"}</div>
          <div className="text-[16px] font-semibold text-[#1C7AC8]">Username : {formData.username || "-"}</div>
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
              <input
                type="file"
                name="foto_jeep"
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
              />
              <div>
                <label className="block text-sm text-gray-700">
                  Status
                </label>
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

          {formData.role === "Driver" && (
            <>
              <input
                name="plat_jeep"
                value={formData.plat_jeep || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="Plat Jeep"
              />
              <input
                name="alamat"
                value={formData.alamat || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="Alamat"
              />
              <input
                type="file"
                name="foto_profil"
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
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
                <label className="block text-sm text-gray-700">
                  Status
                </label>
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

// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import withAuth from "/src/app/lib/withAuth";

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
//         if (foundUser) setFormData(foundUser);
//         else alert("User tidak ditemukan!");
//       } catch (error) {
//         console.error("Gagal ambil data:", error);
//       }
//     };

//     fetchUser();
//   }, [id]);

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
//       const res = await fetch(`http://localhost:8000/api/users/update/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();
//       console.log("Server Response:", result);
//       if (result.success) {
//         alert("Data berhasil diperbarui!");
//         router.push(`/dashboard/operasional/anggota/detail-anggota/${id}`);
//       } else {
//         alert("Gagal update data: " + result.message);
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const token = localStorage.getItem("access_token");
//   //   if (!token) return;

//   //   const form = new FormData();
//   //   form.append("name", formData.name);
//   //   form.append("email", formData.email);
//   //   form.append("role", formData.role);
//   //   form.append("status", formData.status);
//   //   form.append("alamat", formData.alamat);
//   //   form.append("telepon", formData.telepon);
//   //   form.append("plat_jeep", formData.plat_jeep);

//   //   if (formData.foto_profil) form.append("foto_profil", formData.foto_profil);
//   //   if (formData.foto_jeep) form.append("foto_jeep", formData.foto_jeep);

//   //   try {
//   //     const res = await fetch(`http://localhost:8000/api/users/update/${id}`, {
//   //       method: "PUT",
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: form,
//   //     });

//   //     const result = await res.json();
//   //     if (result.success) {
//   //       alert("Data berhasil diperbarui!");
//   //       router.push(`/dashboard/operasional/anggota/detail-anggota/${id}`);
//   //     } else {
//   //       alert("Gagal update data: " + result.message);
//   //     }
//   //   } catch (error) {
//   //     console.error("Update error:", error);
//   //   }
//   // };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Edit Anggota</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="name"
//           value={formData.name || ""}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Nama"
//         />
//         <input
//           name="email"
//           value={formData.email || ""}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Email"
//         />
//         <input
//           name="role"
//           value={formData.role || ""}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Role"
//         />
//         <input
//           name="status"
//           value={formData.status || ""}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Status"
//         />
//         <input
//           name="alamat"
//           value={formData.alamat || ""}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Alamat"
//         />
//         <input
//           name="telepon"
//           value={formData.telepon || ""}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Telepon"
//         />
//         <input
//           name="plat_jeep"
//           value={formData.plat_jeep || ""}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           placeholder="Plat Jeep"
//         />
//         <input
//           type="file"
//           name="foto_profil"
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="file"
//           name="foto_jeep"
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Simpan Perubahan
//         </button>
//       </form>
//     </div>
//   );
// };

// export default withAuth(EditAnggota);
