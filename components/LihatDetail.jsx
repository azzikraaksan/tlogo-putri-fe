// "use client";
// import { CircleArrowLeft } from "lucide-react";
// import { useState, useEffect } from "react";

// const DetailAnggota = ({ user, onKembali }) => {
//   const [formData] = useState({
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
//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="flex">
//       <div className="flex-1 p-6">
//         <div className="flex items-center gap-2">
//           <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
//           <h1 className="text-[32px] font-semibold">Detail Anggota</h1>
//         </div>
//         {formData.role === "Owner" && (
//           <>
//             <div>
//               <h3 className="text-sm font-medium text-gray-700">No Telepon</h3>
//               <p className="text-gray-900">{formData.telepon}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-700">Alamat</h3>
//               <p className="text-gray-900">{formData.alamat}</p>
//             </div>
//           </>
//         )}

//         {formData.role === "Driver" && (
//           <>
//             <div>
//               <h3 className="text-sm font-medium text-gray-700">No Telepon</h3>
//               <p className="text-gray-900">{formData.telepon}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-700">Alamat</h3>
//               <p className="text-gray-900">{formData.alamat}</p>
//             </div>
//           </>
//         )}

//         {formData.role === "Front Office" && (
//           <>
//             <div className="mb-2">
//               <strong>Nama:</strong> {user?.name || "-"}
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-700">Foto Profil</h3>
//               <img
//                 src={formData.foto_profil}
//                 alt="Foto Profil"
//                 className="w-32 h-32 rounded-full object-cover"
//               />
//             </div>
//           </>
//         )}
//         <div className="mb-2">
//           <strong>Email:</strong> {user?.email || "-"}
//         </div>
//         <div className="mb-2">
//           <strong>Peran:</strong> {user?.role || "-"}
//         </div>
//         <div className="mb-2">
//           <strong>Status:</strong> {user?.status || "-"}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailAnggota;

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { CircleArrowLeft } from "lucide-react";

// const DetailAnggota = ({ user, onKembali }) => {
//     const router = useRouter();
//     const [formData, setFormData] = useState({
//       name: "",
//       username: "",
//       email: "",
//       role: "",
//       alamat: "",
//       telepon: "",
//       status: "",
//       tanggal_bergabung: "",
//       plat_jeep: "",
//       jumlah_jeep: "",
//       jabatan: "",
//       foto_profil: "",
//     });

//     useEffect(() => {
//       const fetchAnggota = async () => {
//         try {
//           const token = localStorage.getItem("access_token");
//           const res = await fetch(`http://localhost:8000/api/users/me/${user.id}`, {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           if (res.ok) {
//             const data = await res.json();
//             setFormData(data);
//           } else {
//             console.error("Gagal mengambil data anggota");
//           }
//         } catch (err) {
//           console.error("Terjadi kesalahan saat mengambil data anggota", err);
//         }
//       };

//       fetchAnggota();
//     }, [user.id]);

//   return (
//     <div className="flex">
//       <div className="flex-1 p-6">
//         <div className="flex items-center gap-2">
//           <CircleArrowLeft
//             onClick={onKembali}
//             className="cursor-pointer"
//           />
//           <h1 className="text-[32px] font-semibold">Detail Anggota</h1>
//         </div>

//         <div className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4">
//           <div>
//             <h3 className="text-sm font-medium text-gray-700">Role</h3>
//             <p className="text-gray-900">{formData.role}</p>
//           </div>

//           {[
//             { label: "Nama", value: formData.name },
//             { label: "Username", value: formData.username },
//             { label: "Email", value: formData.email }
//           ].map(({ label, value }) => (
//             <div key={label}>
//               <h3 className="text-sm font-medium text-gray-700">{label}</h3>
//               <p className="text-gray-900">{value}</p>
//             </div>
//           ))}

//           {formData.role === "Owner" && (
//             <>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700">No Telepon</h3>
//                 <p className="text-gray-900">{formData.telepon}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700">Alamat</h3>
//                 <p className="text-gray-900">{formData.alamat}</p>
//               </div>
//             </>
//           )}

//           {formData.role === "Driver" && (
//             <>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700">No Telepon</h3>
//                 <p className="text-gray-900">{formData.telepon}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700">Alamat</h3>
//                 <p className="text-gray-900">{formData.alamat}</p>
//               </div>
//             </>
//           )}

//           {formData.role === "Front Office" && (
//             <>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700">Foto Profil</h3>
//                 <img src={formData.foto_profil} alt="Foto Profil" className="w-32 h-32 rounded-full object-cover" />
//               </div>
//             </>
//           )}

//           <div>
//             <h3 className="text-sm font-medium text-gray-700">Tanggal Bergabung</h3>
//             <p className="text-gray-900">{formData.tanggal_bergabung}</p>
//           </div>

//           <div>
//             <h3 className="text-sm font-medium text-gray-700">Status</h3>
//             <p className="text-gray-900">{formData.status}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailAnggota;


"use client";
import { CircleArrowLeft } from "lucide-react";

const DetailAnggota = ({ user, onKembali }) => {
  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
          <h1 className="text-[32px] font-semibold">Detail Anggota</h1>
        </div>
        <div className="w-[1000px] mx-auto mt-16 p-6 bg-[#EAEAEA] shadow-md rounded-xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              {user?.foto_profil ? (
                <img
                  src={`http://localhost/storage/${user.foto_profil}`}
                  alt="Foto Profil"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                " -"
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div>
                <strong>Nama : </strong>
                <span>{user?.name || "-"}</span>
              </div>
              <div>
                <strong>Username : </strong>
                <span>{user?.username || "-"}</span>
              </div>
              <div>
                <strong>Email : </strong>
                <span>{user?.email || "-"}</span>
              </div>
              <div>
                <strong>No. HP : </strong>
                <span>{user?.telepon || "-"}</span>
              </div>
              <div>
                <strong>Alamat : </strong>
                <span>{user?.alamat || "-"}</span>
              </div>
              <div>
                <strong>Tanggal Bergabung : </strong>
                <span>{user?.tanggal_bergabung || "-"}</span>
              </div>
              <div>
                <strong>Peran : </strong>
                <span>{user?.role || "-"}</span>
              </div>
              <div>
                <strong>Status : </strong>
                <span>{user?.status || "-"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAnggota;




// "use client";
// import { CircleArrowLeft } from "lucide-react";

// const DetailAnggota = ({ user, onKembali }) => {
//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="flex">
//       <div className="flex-1">
//         <div className="flex items-center gap-2">
//           <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
//           <h1 className="text-[32px] font-semibold">Detail Anggota</h1>
//         </div>
//         <div className="w-[650px] mx-auto mt-16 p-6 bg-[#EAEAEA] shadow-md rounded-xl space-y-4">
//           <div className="mb-2">
//             Foto Profil :
//             <strong>
//             {user?.foto_profil ? (
//               <img
//                 src={`http://localhost/storage/${user.foto_profil}`}
//                 alt="Foto Profil"
//                 className="w-24 h-24 rounded-full object-cover"
//               />
//             ) : (
//               " -"
//             )}</strong>
//           </div>
//           <div className="mb-2">
//             Nama: <strong>{user?.name || "-"}</strong>
//           </div>
//           <div className="mb-2">
//             Username: <strong>{user?.username || "-"}</strong>
//           </div>
//           <div className="mb-2">
//             Email: <strong>{user?.email || "-"}</strong>
//           </div>
//           <div className="mb-2">
//             No. HP :<strong> {user?.telepon || "-"}</strong>
//           </div>
//           <div className="mb-2">
//             Alamat :<strong> {user?.alamat || "-"}</strong>
//           </div>
//           <div className="mb-2">
//             Tanggal Bergabung :<strong>{" "}
//             {user?.tanggal_bergabung || "-"}</strong>
//           </div>
//           <div className="mb-2">
//             Peran:<strong> {user?.role || "-"}</strong>
//           </div>
//           <div className="mb-2">
//             Status:<strong> {user?.status || "-"}</strong>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailAnggota;
