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

  useEffect(() => {
    fetchOwnersWithJeepLimit();
    fetchDrivers();
  }, []);

  const fetchOwnersWithJeepLimit = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.get(
        "http://localhost:8000/api/users/by-role?role=Owner",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const allOwners = res.data.data;

      const filteredOwners = allOwners.filter((owner) => owner.jumlah_jeep < 2);
      setOwners(filteredOwners);

      setOwners(filteredOwners.filter(Boolean));
    } catch (err) {
      console.error("Gagal memuat data owner:", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const jeepsRes = await axios.get("http://localhost:8000/api/jeeps/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usedUserIds = jeepsRes.data.data.map((jeep) => jeep.driver_id);

      const driverRes = await axios.get(
        "http://localhost:8000/api/users/by-role?role=Driver",
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
      console.error("Gagal ambil data:", err);
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
    const maxSize = 3 * 1024 * 1024; // 3MB dalam byte

    if (!allowedTypes.includes(file.type)) {
      alert("Format file tidak valid. Harus jpeg, jpg, atau png.");
      e.target.value = ""; // reset input file supaya bisa upload ulang
      return;
    }

    if (file.size > maxSize) {
      alert("Ukuran file maksimal 3MB.");
      e.target.value = ""; // reset input file
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
      alert("Semua field wajib diisi!");
      return;
    }

    // if (submitData.foto_jeep === "") {
    //   submitData.foto_jeep = null;
    // }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/jeeps/create",
        submitData,
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("access_token");
  //   const requiredFields = [
  //     "no_lambung",
  //     "plat_jeep",
  //     "merek",
  //     "tipe",
  //     "tahun_kendaraan",
  //     "status",
  //   ];
  //   console.log("Form sebelum submit:", form);

  //   const isAnyEmpty = requiredFields.some(
  //     (field) => String(form[field]).trim() === ""
  //   );

  //   if (isAnyEmpty) {
  //     alert("Semua field wajib diisi!");
  //     return;
  //   }

  //   requiredFields.forEach((field) => {
  //     console.log(`${field}:`, `"${String(form[field]).trim()}"`);
  //   });

  //   if (form.foto_jeep === "") {
  //     form.foto_jeep = null;
  //   }

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
  //       onKembali();
  //     }
  //   } catch (error) {
  //     console.error("Gagal tambah jeep:", error.response?.data);
  //     alert(
  //       "Gagal menambahkan Jeep: " + error.response?.data?.message ||
  //         "Terjadi masalah!"
  //     );
  //   }
  // };

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
          <div>
            <label className="block text-sm font-medium mb-1">
              Pilih Owner:
            </label>
            <select
              name="owner_id"
              value={form.owner_id}
              onChange={handleChange}
              className="mt-2 p-2 block w-full border border-gray-300 rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
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
              Pilih Driver :
            </label>
            <select
              name="driver_id"
              value={form.driver_id}
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
          </div>
          <label className="block text-sm font-medium mb-1">
            Masukan No Lambung :
          </label>
          <input
            name="no_lambung"
            value={form.no_lambung}
            placeholder="Nomor Lambung"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          <label className="block text-sm font-medium mb-1">
            Masukan No Plat :
          </label>
          <input
            name="plat_jeep"
            value={form.plat_jeep}
            placeholder="Plat Jeep"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />

          {/* <label className="block text-sm font-medium mb-1">
            Masukan Foto Jeep :
          </label>
          <input
            name="foto_jeep"
            value={form.foto_jeep}
            placeholder="Nama File Foto (contoh: jeep1.jpg)"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          /> */}

          <label className="block text-sm font-medium mb-1">
            Masukan Merek Jeep :
          </label>
          <input
            name="merek"
            value={form.merek}
            placeholder="Merek"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />

          <label className="block text-sm font-medium mb-1">
            Masukan Tipe Jeep :
          </label>
          <input
            name="tipe"
            value={form.tipe}
            placeholder="Tipe"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          <label className="block text-sm font-medium mb-1">
            Masukan Tahun Kendaraan :
          </label>
          <input
            name="tahun_kendaraan"
            value={form.tahun_kendaraan}
            placeholder="Tahun Kendaraan"
            onChange={handleChange}
            className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
          />
          {/* <label className="block text-sm font-bold text-gray-700">
            Foto Jeep (opsional)
          </label>
          <input
            type="file"
            name="foto_jeep"
            accept=".jpeg, .jpg, .png"
            onChange={handleFileChange}
            className="mt-2 p-2 pr-10 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
            style={{ paddingRight: "2.5rem" }} // kasih space kanan buat icon
          />
          <Upload
            size={15}
            style={{
              position: "absolute",
              top: "70%",
              right: "10px",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#9CA3AF",
            }}
          /> */}
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
                ? "Tidak Ada Driver Tersedia"
                : "Tambah Jeep"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
