// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { CircleArrowLeft } from "lucide-react";

// const EditAnggota = ({ onKembali, anggotaId }) => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     role: "",
//     alamat: "",
//     telepon: "",
//     status: "",
//     tanggal_bergabung: "",
//     plat_jeep: "",
//     jumlah_jeep: "",
//     jabatan: "",
//     foto_profil: "",
//   });

//   useEffect(() => {
//     const fetchAnggotaData = async () => {
//       const token = localStorage.getItem("access_token");
//       const res = await fetch(
//         `http://localhost:8000/api/users/update/${anggotaId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.ok) {
//         const data = await res.json();
//         setFormData(data);
//       } else {
//         alert("Gagal memuat data anggota");
//       }
//     };

//     fetchAnggotaData();
//   }, [anggotaId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: files[0] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("access_token");
//     try {
//       const formDataToSubmit = new FormData();
//       for (let key in formData) {
//         formDataToSubmit.append(key, formData[key]);
//       }

//       const res = await fetch(
//         `http://localhost:8000/api/users/update/${anggotaId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formDataToSubmit,
//         }
//       );

//       if (res.ok) {
//         alert("Anggota berhasil diperbarui!");
//         onKembali();
//       } else {
//         const err = await res.json();
//         alert("Gagal memperbarui anggota: " + err.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Terjadi kesalahan saat menyimpan data");
//     }
//   };

//   return (
//     <div className="flex">
//       <div className="flex-1">
//         <div className="flex items-center gap-2">
//           <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
//           <h1 className="text-[32px] font-semibold">Edit Anggota</h1>
//         </div>
//         <form
//           onSubmit={handleSubmit}
//           className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4"
//         >
//           <div>
//             <label className="block text-sm text-gray-700 font-bold">
//               Peran
//             </label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="mt-2 p-2 block w-full border border-gray-300 rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//             >
//               <option value="">Pilih Peran</option>
//               <option value="Front Office">Front Office</option>
//               <option value="Owner">Owner</option>
//               <option value="Driver">Driver</option>
//               <option value="Pengurus">Pengurus</option>
//             </select>
//           </div>

//           {[
//             {
//               label: "Nama Lengkap",
//               name: "name",
//               placeholder: "Masukkan Nama",
//             },
//             {
//               label: "Username",
//               name: "username",
//               placeholder: "Masukkan Username",
//             },
//             {
//               label: "Email",
//               name: "email",
//               type: "email",
//               placeholder: "Masukkan Email",
//             },
//             {
//               label: "Password",
//               name: "password",
//               type: "password",
//               placeholder: "Masukkan Password",
//             },
//           ].map(({ label, name, type = "text", placeholder }) => (
//             <div key={name}>
//               <label className="block text-sm font-bold text-gray-700">
//                 {label}
//               </label>
//               <input
//                 type={type}
//                 name={name}
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 placeholder={placeholder}
//                 className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//               />
//             </div>
//           ))}

//           {formData.role === "Owner" && (
//             <>
//               <div>
//                 <label className="block text-sm font-bold text-gray-700">
//                   No Telepon
//                 </label>
//                 <input
//                   type="tel"
//                   name="telepon"
//                   value={formData.telepon}
//                   onChange={handleChange}
//                   placeholder="Masukkan No Telepon"
//                   className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700">
//                   Alamat
//                 </label>
//                 <input
//                   type="text"
//                   name="alamat"
//                   value={formData.alamat}
//                   onChange={handleChange}
//                   placeholder="Masukkan Alamat"
//                   className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700">
//                   Jumlah Jeep
//                 </label>
//                 <input
//                   type="number"
//                   name="jumlah_jeep"
//                   value={formData.jumlah_jeep}
//                   onChange={handleChange}
//                   placeholder="Masukkan Jumlah Jeep"
//                   className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//                 />
//               </div>
//             </>
//           )}

//           <div>
//             <label className="block text-sm font-bold text-gray-700">
//               Tanggal Bergabung
//             </label>
//             <input
//               type="date"
//               name="tanggal_bergabung"
//               value={formData.tanggal_bergabung}
//               onChange={handleChange}
//               className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-700">
//               Status
//             </label>
//             <input
//               type="text"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               placeholder="Masukkan Status"
//               className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
//             />
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-[#1C7AC8] text-white py-2 px-4 rounded-[15px] hover:bg-[#6CAEE5] transition cursor-pointer"
//             >
//               Simpan
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditAnggota;



// import { useState, useEffect } from "react";

// const EditAnggota = ({ onDone }) => {
//   const [member, setMember] = useState(null);
//   const [nama, setNama] = useState("");
//   const [email, setEmail] = useState("");
//   const [nomor, setNomor] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const stored = localStorage.getItem("anggotaTerpilih");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setMember(parsed);
//       setNama(parsed.nama || "");
//       setEmail(parsed.email || "");
//       setNomor(parsed.nomor || "");
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch(`/api/users/update/${member.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ nama, email, nomor }),
//       });

//       if (!res.ok) throw new Error("Gagal update");

//       alert("Berhasil update!");
//       localStorage.removeItem("anggotaTerpilih");
//       onDone();
//     } catch (err) {
//       console.error(err);
//       alert("Terjadi kesalahan saat update.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!member) return <div>Loading data anggota...</div>;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Edit Anggota</h2>
//       <div>
//         <label>Nama</label>
//         <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full border rounded px-3 py-2" />
//       </div>
//       <div>
//         <label>Email</label>
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
//       </div>
//       <div>
//         <label>Nomor Telepon</label>
//         <input type="text" value={nomor} onChange={(e) => setNomor(e.target.value)} className="w-full border rounded px-3 py-2" />
//       </div>
//       <div className="flex justify-end gap-3">
//         <button type="button" onClick={onDone} className="bg-gray-300 px-4 py-2 rounded">
//           Batal
//         </button>
//         <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
//           {loading ? "Menyimpan..." : "Simpan"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default EditAnggota;


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";

const EditAnggota = ({ user }) => {
  const [userDetails, setUserDetails] = useState(user || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserDetails(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:8000/api/users/all/${userDetails.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (res.ok) {
        router.push(`/detail-anggota/${userDetails.id}`);
      } else {
        console.error("Gagal update anggota");
      }
    } catch (error) {
      console.error("Error saat mengupdate anggota:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <button
          onClick={() => router.push(`/detail-anggota/${userDetails.id}`)}
          className="text-blue-500 underline mb-4"
        >
          Kembali ke Detail Anggota
        </button>
        <h1 className="text-2xl font-semibold mb-6">Edit Anggota</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nama</label>
            <input
              type="text"
              name="name"
              value={userDetails.name || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userDetails.email || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Peran</label>
            <input
              type="text"
              name="role"
              value={userDetails.role || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <input
              type="text"
              name="status"
              value={userDetails.status || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={userDetails.alamat || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Telepon</label>
            <input
              type="text"
              name="telepon"
              value={userDetails.telepon || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Plat Jeep</label>
            <input
              type="text"
              name="plat_jeep"
              value={userDetails.plat_jeep || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-[#1C7AC8] text-white py-2 px-4 rounded mt-6 hover:bg-[#7ba2d0] transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Mengirim..." : "Update Anggota"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default withAuth(EditAnggota);
