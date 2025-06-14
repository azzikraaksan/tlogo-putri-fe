"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "/components/Sidebar";
import LoadingFunny from "/components/LoadingFunny.jsx";

export default function ProfilPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
  
      if (!token) return;
  
      try {
        const res = await fetch("https://tpapi.siunjaya.id/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
  
        if (data.success && data.data) {
          setUser(data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data profil:", err);
      }
    };
  
    fetchUser();
  }, []);
  
  const handleEditClick = () => {
    router.push(
      `/dashboard/profil/edit-profil`
    );
  };
  if (!user) {
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
          <h1 className="text-[32px] font-semibold">Profil Saya</h1>
        </div>
        <div className="flex items-start bg-[#EAEAEA] p-6 rounded-xl shadow-md w-[1080px] mx-auto mt-16">
          <div className="w-40 h-40 mr-8">
            {user?.foto_profil ? (
              <img
                src={`https://tpapi.siunjaya.id/storage/${user.foto_profil}`}
                alt="Foto Profil"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              "-"
            )}
          </div>
          <div className="flex-1 relative">
          {/* INI GATAUUU WKWKWKW */}
          {/* <button
              onClick={handleEditClick}
              className="absolute top-0 right-0 bg-[#B8D4F9] hover:bg-[#6CAEE5] text-[#1C7AC8] text-sm px-4 py-1 rounded-[8px] cursor-pointer"
            >
              Edit Profil Saya
            </button> */}
            <div className="grid grid-cols-[250px_10px_auto] gap-y-6 text-gray-800 ml-70 mt-10 mb-10">
              <div className="font-semibold text-[#1C7AC8]">Nama Lengkap</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{user?.name || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">Username</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{user?.username || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">Email</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{user?.email || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">No. Handphone</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{user?.telepon || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">Alamat</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{user?.alamat || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">
                Tanggal Bergabung
              </div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">
                {user?.tanggal_bergabung || "-"}
              </div>

              <div className="font-semibold text-[#1C7AC8]">Status</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{user?.status || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
