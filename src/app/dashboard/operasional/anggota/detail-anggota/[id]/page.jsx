"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";
import { CircleArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar";
import UserMenu from "/components/Pengguna";

const DetailAnggota = () => {
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("access_token");
      if (!token || !id) return;

      try {
        const res = await fetch("http://localhost:8000/api/users/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const foundUser = data.find((u) => String(u.id) === String(id));
        if (foundUser) {
          setUserDetails(foundUser);
        } else {
          console.error("User tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleEditClick = () => {
    router.push(
      `/dashboard/operasional/anggota/edit-anggota/${id}`
    );
  };

  if (!userDetails) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-red bg-opacity-75">
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">Loading...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        {/* <button
          onClick={() => router.back()}
          className="text-blue-500 underline mb-4"
        >
          Kembali ke Daftar Anggota
        </button> */}
        <div className="flex items-center gap-2">
          <CircleArrowLeft
            onClick={() => router.push("/dashboard/operasional/anggota")}
            className="cursor-pointer"
          />
          <h1 className="text-[32px] font-semibold">Detail Anggota</h1>
        </div>
      <div className="flex items-start bg-[#EAEAEA] p-6 rounded-xl shadow-md w-[1080px] mx-auto mt-16">
          <div className="w-40 h-40 mr-8">
            {userDetails?.foto_profil ? (
              <img
                src={`http://localhost/storage/${userDetails.foto_profil}`}
                alt="Foto Profil"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              "-"
            )}
          </div>
          <div className="flex-1 relative">
            <button
              onClick={handleEditClick}
              className="absolute top-0 right-0 bg-[#B8D4F9] hover:bg-[#6CAEE5] text-[#1C7AC8] text-sm px-4 py-1 rounded-[8px] cursor-pointer"
            >
              Edit Anggota
            </button>
            <div className="grid grid-cols-[250px_10px_auto] gap-y-6 text-gray-800 ml-70 mt-10 mb-10">
              <div className="font-semibold text-[#1C7AC8]">Nama Lengkap</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{userDetails?.name || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">Username</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{userDetails?.username || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">Role</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{userDetails?.role || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">Email</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{userDetails?.email || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">No. Handphone</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{userDetails?.telepon || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">Alamat</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{userDetails?.alamat || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">
                Tanggal Bergabung
              </div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">
                {userDetails?.tanggal_bergabung || "-"}
              </div>

              <div className="font-semibold text-[#1C7AC8]">Status</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{userDetails?.status || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DetailAnggota);
