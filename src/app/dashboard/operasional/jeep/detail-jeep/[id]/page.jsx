"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";
import { CircleArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar";
import LoadingFunny from "/components/LoadingFunny.jsx";
import Hashids from "hashids";

const DetailJeep = () => {
  const [jeepDetails, setJeepDetails] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { id } = useParams();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [jeepId, setJeepId] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      const decoded = hashids.decode(id);

      if (decoded.length === 0) {
        console.error("ID tidak valid atau gagal didecode.");
        return;
      }

      const decodedId = decoded[0];
      setJeepId(decodedId);

      const fetchDetailsWithDriver = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("access_token");

          const [jeepRes, driversRes] = await Promise.all([
            fetch(`https://tpapi.siunjaya.id/api/jeeps/id/${decodedId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("https://tpapi.siunjaya.id/api/users/by-role?role=Driver", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          if (!jeepRes.ok || !driversRes.ok) throw new Error("Gagal fetch");

          const jeepData = await jeepRes.json();
          const driversData = await driversRes.json();

          const driver = driversData?.data?.find(
            (d) => d.id === jeepData.data.driver_id
          );

          const combinedData = {
            ...jeepData.data,
            driver_name: driver?.name || "-",
          };

          setJeepDetails(combinedData);
        } catch (error) {
          console.error("Gagal mengambil data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDetailsWithDriver();
    }
  }, [id]);

  const handleEditClick = () => {
    router.push(`/dashboard/operasional/jeep/edit-jeep/${params.id}`);
  };

  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? 290 : 70,
        }}
      ></div>
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <LoadingFunny />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <CircleArrowLeft
                onClick={() => router.push("/dashboard/operasional/jeep")}
                className="cursor-pointer"
              />
              <h1 className="text-[32px] font-semibold">Detail Jeep</h1>
            </div>
            <div className="flex items-start bg-[#EAEAEA] p-6 rounded-xl shadow-md w-[600px] mx-auto mt-16">
              <div className="flex-1 relative">
                <button
                  onClick={handleEditClick}
                  className="absolute top-0 right-0 bg-[#B8D4F9] hover:bg-[#6CAEE5] text-[#1C7AC8] text-sm px-4 py-1 rounded-[8px] cursor-pointer"
                >
                  Edit Jeep
                </button>
                <div className="grid grid-cols-[200px_10px_auto] gap-y-6 text-gray-800 mt-10 mb-10 ml-20">
                  <div className="font-semibold text-[#1C7AC8]">
                    Nama Driver
                  </div>
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
                  <div className="text-[#808080]">
                    {jeepDetails?.merek || "-"}
                  </div>

                  <div className="font-semibold text-[#1C7AC8]">Tipe</div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {jeepDetails?.tipe || "-"}
                  </div>

                  <div className="font-semibold text-[#1C7AC8]">
                    Tahun Kendaraan
                  </div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {jeepDetails?.tahun_kendaraan || "-"}
                  </div>

                  <div className="font-semibold text-[#1C7AC8]">
                    Status Jeep
                  </div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {jeepDetails?.status || "-"}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(DetailJeep);
