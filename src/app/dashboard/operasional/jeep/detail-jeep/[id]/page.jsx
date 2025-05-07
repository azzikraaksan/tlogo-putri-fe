"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";
import { CircleArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar";
import UserMenu from "/components/Pengguna";

const DetailJeep = () => {
  const [jeepDetails, setJeepDetails] = useState(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      const fetchDetailsWithDriver = async () => {
        try {
          const token = localStorage.getItem("access_token");

          const [jeepRes, driversRes] = await Promise.all([
            fetch(`http://localhost:8000/api/jeeps/id/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://localhost:8000/api/users/by-role?role=DRIVER", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          if (!jeepRes.ok || !driversRes.ok) throw new Error("Gagal fetch");

          const jeepData = await jeepRes.json();
          const driversData = await driversRes.json();

          const driver = driversData?.data?.find(
            (d) => d.id === jeepData.data.users_id
          );

          const combinedData = {
            ...jeepData.data,
            driver_name: driver?.name || "-",
          };

          setJeepDetails(combinedData);
        } catch (error) {
          console.error("Gagal mengambil data:", error);
        }
      };

      fetchDetailsWithDriver();
    }
  }, [id]);

  const handleEditClick = () => {
    router.push(`/dashboard/operasional/jeep/edit-jeep/${id}`);
  };

  if (!jeepDetails) {
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
        <div className="flex items-center gap-2">
          <CircleArrowLeft
            onClick={() => router.push("/dashboard/operasional/jeep")}
            className="cursor-pointer"
          />
          <h1 className="text-[32px] font-semibold">Detail Jeep</h1>
        </div>
        <div className="flex items-start bg-[#EAEAEA] p-6 rounded-xl shadow-md w-[1080px] mx-auto mt-16">
          <div className="w-40 h-40 mr-8">
            {jeepDetails?.foto_jeep ? (
              <img
                src={`http://localhost/storage/${jeepDetails.foto_jeep}`}
                alt="Foto Jeep"
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
              Edit Jeep
            </button>
            <div className="grid grid-cols-[250px_10px_auto] gap-y-6 text-gray-800 ml-70 mt-10 mb-10">
              <div className="font-semibold text-[#1C7AC8]">Jeep ID</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">
                {jeepDetails?.jeep_id || "-"}
              </div>

              <div className="font-semibold text-[#1C7AC8]">Nama Driver</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">
                {jeepDetails?.driver_name || "-"}
              </div>

              <div className="font-semibold text-[#1C7AC8]">No Lambung</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">
                {jeepDetails?.no_lambung || "-"}
              </div>

              <div className="font-semibold text-[#1C7AC8]">Plat Jeep</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">
                {jeepDetails?.plat_jeep || "-"}
              </div>

              <div className="font-semibold text-[#1C7AC8]">Merek</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{jeepDetails?.merek || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">Tipe</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{jeepDetails?.tipe || "-"}</div>

              <div className="font-semibold text-[#1C7AC8]">
                Tahun Kendaraan
              </div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">
                {jeepDetails?.tahun_kendaraan || "-"}
              </div>

              <div className="font-semibold text-[#1C7AC8]">Status Jeep</div>
              <div className="text-[#808080]">:</div>
              <div className="text-[#808080]">{jeepDetails?.status || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DetailJeep);
