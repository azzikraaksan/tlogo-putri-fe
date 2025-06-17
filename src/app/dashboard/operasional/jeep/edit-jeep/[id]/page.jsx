"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar";
import LoadingFunny from "/components/LoadingFunny.jsx";
import Hashids from "hashids";

export default function AddJeepForm({ onKembali }) {
  const router = useRouter();

  const [form, setForm] = useState({
    users_id: "",
    no_lambung: "",
    plat_jeep: "",
    foto_jeep: "",
    merek: "",
    tipe: "",
    tahun_kendaraan: "",
    status: "",
  });
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const decoded = hashids.decode(params.id);
  const jeep_id = decoded.length > 0 ? decoded[0] : null;

  useEffect(() => {
    const fetchJeepData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `https://tpapi.siunjaya.id/api/jeeps/id/${jeep_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setForm(res.data.data); 
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchJeepData();
  }, [jeep_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.put(
        `https://tpapi.siunjaya.id/api/jeeps/update/${jeep_id}`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        router.back(); 
      }
    } catch (error) {
      alert(
        "Gagal memperbarui Jeep: " +
          (error.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan.")
      );
    }
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
            onClick={() => router.back()}
            className="cursor-pointer"
          />
          <h1 className="text-[32px] font-semibold">Edit Jeep</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4 "
        >
          <label className="block text-sm font-medium mb-1">
            Masukkan No Lambung:{" "}
          </label>
          <input
            name="no_lambung"
            value={form.no_lambung}
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-gray-300 rounded-[14px]"
            placeholder="Nomor Lambung"
          />
          <label className="block text-sm font-medium mb-1">
            Masukkan Plat Jeep:{" "}
          </label>
          <input
            name="plat_jeep"
            value={form.plat_jeep}
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-gray-300 rounded-[14px]"
            placeholder="Plat Jeep"
          />
          <label className="block text-sm font-medium mb-1">
            Masukkan Merek:{" "}
          </label>
          <input
            name="merek"
            value={form.merek}
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-gray-300 rounded-[14px]"
            placeholder="Merek"
          />
          <label className="block text-sm font-medium mb-1">
            Masukkan Tipe:{" "}
          </label>
          <input
            name="tipe"
            value={form.tipe}
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-gray-300 rounded-[14px]"
            placeholder="Tipe"
          />
          <label className="block text-sm font-medium mb-1">
            Masukkan Tahun Kendaraan:{" "}
          </label>
          <input
            name="tahun_kendaraan"
            value={form.tahun_kendaraan}
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-gray-300 rounded-[14px]"
            placeholder="Tahun Kendaraan"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#1C7AC8] text-[13px] text-white py-1 px-3 rounded-[12px] hover:bg-[#6CAEE5] transition cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
