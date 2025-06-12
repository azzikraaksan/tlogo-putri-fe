"use client";
import { CircleArrowLeft } from "lucide-react";
import React, { useState } from "react";
import EditAnggota from "/components/EditAnggota";

const DetailAnggota = ({ user, onKembali, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return <EditAnggota anggotaId={user.id} onKembali={onKembali} />;
  }

  if (!user) {
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
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
          <h1 className="text-[32px] font-semibold">Detail Anggota</h1>
        </div>
        <div className="flex items-start bg-[#EAEAEA] p-6 rounded-xl shadow-md w-[1080px] mx-auto mt-16">
          <div className="w-40 h-40 mr-8">
            {user?.foto_profil ? (
              <img
                src={`http://localhost/storage/${user.foto_profil}`}
                alt="Foto Profil"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              "-"
            )}
          </div>
          <div className="flex-1 relative">
            {/* <button className="absolute top-0 right-0 bg-[#B8D4F9] hover:bg-[#6CAEE5] text-[#1C7AC8] text-sm px-4 py-1 rounded-[8px] cursor-pointer">
              Edit Anggota
            </button> */}
            <button
              onClick={handleEdit}
              className="absolute top-0 right-0 bg-[#B8D4F9] hover:bg-[#6CAEE5] text-[#1C7AC8] text-sm px-4 py-1 rounded-[8px] cursor-pointer"
            >
              Edit Anggota
            </button>
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
};

export default DetailAnggota;