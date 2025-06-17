"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, Upload } from "lucide-react";

export default function AddJeepForm({ onKembali }) {
  const router = useRouter();

  const [form, setForm] = useState({
    no_lambung: "",
    plat_jeep: "",
    foto_jeep: "",
    merek: "",
    tipe: "",
    tahun_kendaraan: "",
    status: "Tersedia",
    driver_id: "",
    owner_id: "",
    users_id: "",
  });
  const [owners, setOwners] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [existingLambung, setExistingLambung] = useState([]);
  const [existingPlat, setExistingPlat] = useState([]);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("https://tpapi.siunjaya.id/api/jeeps/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const jeeps = res.data.data;
        setExistingLambung(jeeps.map((item) => item.no_lambung));
        setExistingPlat(jeeps.map((item) => item.plat_jeep));
      } catch (error) {
      }
    };

    fetchExistingData();
    fetchOwnersWithJeepLimit();
    fetchDrivers();
  }, []);

  const fetchOwnersWithJeepLimit = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const [resOwners, resJeeps] = await Promise.all([
        axios.get("https://tpapi.siunjaya.id/api/users/by-role?role=Owner", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://tpapi.siunjaya.id/api/jeeps/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const allOwners = resOwners.data.data;
      const allJeeps = resJeeps.data.data;

      const filteredOwners = allOwners.filter((owner) => {
        const jeepsOfOwner = allJeeps.filter(
          (jeep) => jeep.owner_id === owner.id
        );

        if (jeepsOfOwner.length === 0) return true;

        const adaYangBelumAdaDriver = jeepsOfOwner.some(
          (jeep) => !jeep.driver_id
        );

        return adaYangBelumAdaDriver;
      });

      setOwners(filteredOwners);
    } catch (err) {
    }
  };

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const jeepsRes = await axios.get(
        "https://tpapi.siunjaya.id/api/jeeps/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const usedUserIds = jeepsRes.data.data.map((jeep) => jeep.driver_id);

      const driverRes = await axios.get(
        "https://tpapi.siunjaya.id/api/users/by-role?role=Driver",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const availableDrivers = driverRes.data.data.filter(
        (driver) =>
          driver.status === "Aktif" && !usedUserIds.includes(driver.id)
      );

      setDrivers(availableDrivers);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 3 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("Format file tidak valid. Harus jpeg, jpg, atau png.");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("Ukuran file maksimal 3MB.");
      e.target.value = "";
      return;
    }

    setForm((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    const submitData = {
      ...form,
      users_id: form.owner_id,
    };

    const requiredFields = [
      "no_lambung",
      "plat_jeep",
      "merek",
      "tipe",
      "tahun_kendaraan",
      "status",
    ];

    const isAnyEmpty = requiredFields.some(
      (field) => String(submitData[field]).trim() === ""
    );

    if (isAnyEmpty || !submitData.owner_id) {
      setErrors({ form: "Semua field wajib diisi!" });
      return;
    }

    // ✅ Cek duplikasi sebelum kirim ke backend
    if (existingLambung.includes(submitData.no_lambung)) {
      setErrors({ no_lambung: "Nomor lambung sudah digunakan." });
      return;
    }

    if (existingPlat.includes(submitData.plat_jeep)) {
      setErrors({ plat_jeep: "Plat jeep sudah digunakan." });
      return;
    }

    try {
      const response = await axios.post(
        "https://tpapi.siunjaya.id/api/jeeps/create",
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setErrors({});
        onKembali();
      }
    } catch (error) {
      console.error("Gagal tambah jeep:", error.response?.data);
      setErrors({ form: "Terjadi kesalahan saat menyimpan data." });
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
          className="w-[650px] mt-3 mx-auto p-6 bg-white shadow-md rounded-xl space-y-4 "
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Pilih Owner: <span className="text-red-500">*</span>
            </label>
            <select
              name="owner_id"
              value={form.owner_id}
              onChange={handleChange}
              className="p-2 block w-full border border-gray-300 rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
              required
            >
              <option value="">-- Pilih Owner --</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Pilih Driver : <span className="text-red-500">*</span>
            </label>
            <select
              required
              name="driver_id"
              value={form.driver_id}
              onChange={handleChange}
              className="p-2 block w-full border border-gray-300 rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
              disabled={loading || drivers.length === 0}
            >
              <option value="">-- Pilih Driver --</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>
          <label className="block text-sm font-medium mb-1">
            Masukan No Lambung : <span className="text-red-500">*</span>
          </label>
          {errors.no_lambung && (
            <p className="text-red-500 text-sm mb-1">{errors.no_lambung}</p>
          )}
          <input
            name="no_lambung"
            value={form.no_lambung}
            placeholder="Nomor Lambung"
            onChange={handleChange}
            className="p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />

          <label className="block text-sm font-medium mb-1 mt-4">
            Masukan No Plat : <span className="text-red-500">*</span>
          </label>
          {errors.plat_jeep && (
            <p className="text-red-500 text-sm mb-1">{errors.plat_jeep}</p>
          )}
          <input
            name="plat_jeep"
            value={form.plat_jeep}
            placeholder="Plat Jeep"
            onChange={handleChange}
            className="p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />

          <label className="block text-sm font-medium mb-1">
            Masukan Merek Jeep : <span className="text-red-500">*</span>
          </label>
          <input
            name="merek"
            value={form.merek}
            placeholder="Merek"
            onChange={handleChange}
            className="p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />

          <label className="block text-sm font-medium mb-1">
            Masukan Tipe Jeep : <span className="text-red-500">*</span>
          </label>
          <input
            name="tipe"
            value={form.tipe}
            placeholder="Tipe"
            onChange={handleChange}
            className="p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          <label className="block text-sm font-medium mb-1">
            Masukan Tahun Kendaraan : <span className="text-red-500">*</span>
          </label>
          <input
            name="tahun_kendaraan"
            value={form.tahun_kendaraan}
            placeholder="Tahun Kendaraan"
            onChange={handleChange}
            className="p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-[#1C7AC8] text-[13px] text-white py-1 px-3 rounded-[12px] transition ${
                drivers.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1C7AC8] hover:bg-[#6CAEE5] cursor-pointer"
              }`}
              disabled={drivers.length === 0}
            >
              {drivers.length === 0
                ? "Tidak Ada Driver yang Kosong"
                : "Tambah Jeep"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
