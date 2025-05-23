"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";

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

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchDrivers = async () => {
  //     try {
  //       const token = localStorage.getItem("access_token");
  //       const res = await axios.get(
  //         "http://localhost:8000/api/users/by-role?role=DRIVER",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const availableDrivers = res.data.data.filter(
  //         (d) => d.status === "Aktif"
  //       );
  //       setDrivers(availableDrivers);
  //     } catch (err) {
  //       console.error("Gagal ambil driver:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDrivers();
  // }, []);

  useEffect(() => {
  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const jeepsRes = await axios.get("http://localhost:8000/api/jeeps/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usedUserIds = jeepsRes.data.data.map((jeep) => jeep.users_id);

      const driverRes = await axios.get(
        "http://localhost:8000/api/users/by-role?role=DRIVER",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const availableDrivers = driverRes.data.data.filter(
        (driver) => driver.status === "Aktif" && !usedUserIds.includes(driver.id)
      );

      setDrivers(availableDrivers);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDrivers();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("access_token");

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/api/jeeps/create",
  //       form,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 201) {
  //       alert("Data Jeep berhasil ditambahkan");
  //       router.push("/jeeps");
  //     }
  //   } catch (error) {
  //     console.error("Gagal tambah jeep:", error.response?.data);
  //     alert("Gagal menambahkan Jeep");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const requiredFields = [
      "users_id",
      "no_lambung",
      "plat_jeep",
      "merek",
      "tipe",
      "tahun_kendaraan",
      "status",
    ];
    console.log("Form sebelum submit:", form);

    const isAnyEmpty = requiredFields.some(
      (field) => String(form[field]).trim() === ""
    );

    if (isAnyEmpty) {
      alert("Semua field wajib diisi!");
      return;
    }

    requiredFields.forEach((field) => {
      console.log(`${field}:`, `"${String(form[field]).trim()}"`);
    });

    if (form.foto_jeep === "") {
      form.foto_jeep = null;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/jeeps/create",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Data Jeep berhasil ditambahkan");
        onKembali();
      }
    } catch (error) {
      console.error("Gagal tambah jeep:", error.response?.data);
      alert(
        "Gagal menambahkan Jeep: " + error.response?.data?.message ||
          "Terjadi masalah!"
      );
    }
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
          <h1 className="text-[32px] font-semibold">Tambah Jeep</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4 "
        >
          <label className="block text-sm font-medium mb-1">Pilih Driver :</label>
          <select
            name="users_id"
            value={form.users_id}
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-gray-300 rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
            disabled={loading || drivers.length === 0}
          >
            <option value="">-- Pilih Driver --</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>

          {/* <input
          name="users_id"
          value={form.users_id}
          placeholder="Users ID"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        /> */}
          <label className="block text-sm font-medium mb-1">Masukan No Lambung :</label>
          <input
            name="no_lambung"
            value={form.no_lambung}
            placeholder="Nomor Lambung"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          <label className="block text-sm font-medium mb-1">Masukan No Plat :</label>
          <input
            name="plat_jeep"
            value={form.plat_jeep}
            placeholder="Plat Jeep"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          
          <label className="block text-sm font-medium mb-1">Masukan Foto Jeep :</label>
          <input
            name="foto_jeep"
            value={form.foto_jeep}
            placeholder="Nama File Foto (contoh: jeep1.jpg)"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          
          <label className="block text-sm font-medium mb-1">Masukan Merek Jeep :</label>   
          <input
            name="merek"
            value={form.merek}
            placeholder="Merek"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          
          <label className="block text-sm font-medium mb-1">Masukan Tipe Jeep :</label>
          <input
            name="tipe"
            value={form.tipe}
            placeholder="Tipe"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          <label className="block text-sm font-medium mb-1">Masukan Tahun Kendaraan :</label>
          <input
            name="tahun_kendaraan"
            value={form.tahun_kendaraan}
            placeholder="Tahun Kendaraan"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          <label className="block text-sm font-medium mb-1">Pilih Status :</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          >
            <option value="">Pilih Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Tidak Tersedia">Tidak Tersedia</option>
          </select>

          {/* <input
          name="status"
          value={form.status}
          placeholder="Status"
          onChange={handleChange}
          className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
        /> */}
          {/* <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
        >
          <option value="Tersedia">Tersedia</option>
          <option value="Dipakai">Dipakai</option>
        </select> */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-[#1C7AC8] text-[13px] text-white py-1 px-3 rounded-[12px] hover:bg-[#6CAEE5] transition cursor-pointer ${
                drivers.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1C7AC8] hover:bg-blue-700 cursor-pointer"
              }`}
              disabled={drivers.length === 0}
            >
              {drivers.length === 0
                ? "Tidak Ada Driver Tersedia"
                : "Tambah Jeep"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



