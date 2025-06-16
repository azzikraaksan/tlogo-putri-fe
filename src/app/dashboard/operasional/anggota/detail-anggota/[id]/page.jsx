"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";
import { CircleArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar";
import LoadingFunny from "/components/LoadingFunny.jsx";
import Hashids from "hashids";

const DetailAnggota = () => {
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [driverName, setDriverName] = useState("-");

  const decoded = hashids.decode(params.id);
  const id = decoded[0];


  useEffect(() => {
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("access_token");
    if (!token || !id) return;

    try {
      setLoading(true);

      const resUser = await fetch("https://tpapi.siunjaya.id/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allUsers = await resUser.json();
      const foundUser = allUsers.find((u) => String(u.id) === String(id));
      if (foundUser) {
        setUserDetails(foundUser);
      }

      const resJeep = await fetch("https://tpapi.siunjaya.id/api/jeeps/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jeepData = await resJeep.json();

      const jeepsOwned = jeepData.data.filter(
        (j) => String(j.owner_id) === String(id)
      );

      const driverNames = [
        ...new Set(
          jeepsOwned
            .map((j) => j.driver?.name)
            .filter((name) => !!name)
        ),
      ];

      setDriverName(driverNames.length > 0 ? driverNames.join(", ") : "-");
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUserDetails();
}, [id]);


  const handleEditClick = () => {
    router.push(`/dashboard/operasional/anggota/edit-anggota/${params.id}`);
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
                onClick={() => router.push("/dashboard/operasional/anggota")}
                className="cursor-pointer"
              />
              <h1 className="text-[32px] font-semibold">Detail Anggota</h1>
            </div>
            <div className="flex items-center bg-[#EAEAEA] p-6 rounded-xl shadow-md w-[900px] mx-auto mt-16 gap-5">
              <div className="w-[300px] h-[400px] rounded-lg overflow-hidden border border-gray-300">
                {userDetails?.foto_profil ? (
                  <img
                    src={`https://tpapi.siunjaya.id/storage/app/public/profile_images/${userDetails.foto_profil}`}
                    // src={`https://tpapi.siunjaya.id/storage/5`}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (!e.target.dataset.error) {
                        e.target.dataset.error = "true";
                        e.target.src = "/default-profile.png";
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-lg">
                    Tidak ada foto
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                <button
                  onClick={handleEditClick}
                  className="absolute top-0 right-0 bg-[#B8D4F9] hover:bg-[#6CAEE5] text-[#1C7AC8] text-sm px-4 py-1 rounded-[8px] cursor-pointer"
                >
                  Edit Anggota
                </button>
                <div className="grid grid-cols-[250px_10px_auto] gap-y-4 text-gray-800 mt-10 mb-10">
                  <div className="font-semibold text-[#1C7AC8]">Username</div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {userDetails?.username || "-"}
                  </div>
                  
                  <div className="font-semibold text-[#1C7AC8]">
                    Nama Lengkap
                  </div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {userDetails?.name || "-"}
                  </div>

                  <div className="font-semibold text-[#1C7AC8]">Role</div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {userDetails?.role || "-"}
                  </div>

                  <div className="font-semibold text-[#1C7AC8]">Email</div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {userDetails?.email || "-"}
                  </div>

                  <div className="font-semibold text-[#1C7AC8]">
                    No. Handphone
                  </div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {userDetails?.telepon || "-"}
                  </div>

                  <div className="font-semibold text-[#1C7AC8]">Alamat</div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {userDetails?.alamat || "-"}
                  </div>

                  <div className="font-semibold text-[#1C7AC8]">
                    Tanggal Bergabung
                  </div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {userDetails?.tanggal_bergabung || "-"}
                  </div>
                  <div className="font-semibold text-[#1C7AC8]">
                    Jumlah Jeep
                  </div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {userDetails?.jumlah_jeep || "-"}
                  </div>
                  <div className="font-semibold text-[#1C7AC8]">
                    Nama Driver
                  </div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">{driverName || "-"}</div>

                  <div className="font-semibold text-[#1C7AC8]">Status</div>
                  <div className="text-[#808080]">:</div>
                  <div className="text-[#808080]">
                    {userDetails?.status || "-"}
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

export default withAuth(DetailAnggota);
