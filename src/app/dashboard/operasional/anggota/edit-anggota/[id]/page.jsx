"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";

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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Anggota</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Nama"
        />
        <input
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Email"
        />
        {/* Conditional rendering based on role */}
        {formData.role === "Owner" && (
          <>
            <input
              name="telepon"
              value={formData.telepon || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="No Telepon"
            />
            <input
              name="alamat"
              value={formData.alamat || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Alamat"
            />
            <input
              name="jumlah_jeep"
              value={formData.jumlah_jeep || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Jumlah Jeep"
            />
            <input
              type="file"
              name="foto_jeep"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        {formData.role === "Driver" && (
          <>
            <input
              name="plat_jeep"
              value={formData.plat_jeep || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Plat Jeep"
            />
            <input
              type="file"
              name="foto_profil"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        {formData.role === "Pengurus" && (
          <>
            <input
              name="telepon"
              value={formData.telepon || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="No Telepon"
            />
            <input
              name="alamat"
              value={formData.alamat || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Alamat"
            />
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Simpan Perubahan
        </button>
      </form>
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
