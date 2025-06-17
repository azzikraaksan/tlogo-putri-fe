"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";
import Sidebar from "/components/Sidebar";
import LoadingFunny from "/components/LoadingFunny.jsx";
import { CircleArrowLeft } from "lucide-react";
import Hashids from "hashids";

const EditAnggota = () => {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [errorTelepon, setErrorTelepon] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    alamat: "",
    telepon: "",
    plat_jeep: "",
    foto_profil: null,
    foto_jeep: null,
  });
  const params = useParams();
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);

  const decoded = hashids.decode(params.id);
  const id = decoded[0];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token || !id) return;

      try {
        setLoading(true);
        const res = await fetch("https://tpapi.siunjaya.id/api/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const foundUser = data.find((u) => String(u.id) === String(id));
        if (foundUser) {
          setFormData({
            ...foundUser,
            foto_profil: null,
            foto_jeep: null,
          });
        } else {
          alert("User tidak ditemukan!");
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const form = new FormData();
    form.append("_method", "PUT");

    for (const key in formData) {
      if (
        formData[key] !== null &&
        key !== "foto_profil" &&
        key !== "foto_jeep"
      ) {
        form.append(key, formData[key]);
      }
    }

    if (formData.foto_profil instanceof File) {
      form.append("foto_profil", formData.foto_profil);
    }

    if (formData.foto_jeep instanceof File) {
      form.append("foto_jeep", formData.foto_jeep);
    }

    try {
      const res = await fetch(
        `https://tpapi.siunjaya.id/api/users/update/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const result = await res.json();
      if (res.ok) {
        router.back();
      } else if (res.status === 422) {
        const errors = result.errors;
        const teleponError = errors?.telepon?.[0] || "";

        if (teleponError === "The telepon has already been taken.") {
          setErrorTelepon("Nomor telepon sudah digunakan.");
        } else {
          setErrorTelepon(teleponError);
        }
      } else {
        alert("Gagal update: " + (result.message || "Terjadi kesalahan."));
      }
    } catch (error) {}
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
              <h1 className="text-[32px] font-semibold">Edit Anggota</h1>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4"
            >
              <div className="text-[16px] font-semibold text-[#1C7AC8] mb-2">
                Role : {formData.role || "-"}
              </div>
              <div className="text-[16px] font-semibold text-[#1C7AC8] mb-2">
                Username : {formData.username || "-"}
              </div>
              <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">Nama : </label>
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="Nama"
              />
              <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">Email : </label>
              <input
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                placeholder="Email"
              />
              {formData.role === "Owner" && (
                <>
                  <div>
                    {errorTelepon && (
                      <p className="text-red-500 text-sm mb-1">
                        {errorTelepon}
                      </p>
                    )}
                    <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                      No Telepon (wajib diawali 08 atau 628){" "}
                      <span className="text-red-500">*</span>
                     : </label>
                    <input
                      required
                      type="number"
                      name="telepon"
                      value={formData.telepon}
                      onChange={(e) => {
                        handleChange(e);
                        setErrorTelepon(""); // reset error saat user mengedit
                      }}
                      placeholder="Masukkan No Telepon"
                      className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    />
                  </div>
                  <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">Alamat : </label>
                  <input
                    name="alamat"
                    value={formData.alamat || ""}
                    onChange={handleChange}
                    className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    placeholder="Alamat"
                  />
                  <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                    Jumlah Jeep
                   : </label>
                  <input
                    name="jumlah_jeep"
                    value={formData.jumlah_jeep || ""}
                    onChange={handleChange}
                    className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    placeholder="Jumlah Jeep"
                  />
                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                      Status
                     : </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                      Foto Profil (opsional)
                     : </label>
                    <input
                      type="file"
                      name="foto_profil"
                      onChange={handleChange}
                      className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    />
                  </div>
                </>
              )}

              {formData.role === "Driver" && (
                <>
                  <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">Alamat : </label>
                  <input
                    name="alamat"
                    value={formData.alamat || ""}
                    onChange={handleChange}
                    className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    placeholder="Alamat"
                  />
                  <div>
                    {errorTelepon && (
                      <p className="text-red-500 text-sm mb-1">
                        {errorTelepon}
                      </p>
                    )}
                    <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                      No Telepon (wajib diawali 08 atau 628){" "}
                      <span className="text-red-500">*</span>
                     : </label>
                    <input
                      required
                      type="number"
                      name="telepon"
                      value={formData.telepon}
                      onChange={(e) => {
                        handleChange(e);
                        setErrorTelepon(""); // reset error saat user mengedit
                      }}
                      placeholder="Masukkan No Telepon"
                      className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                      Status
                     : </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                      Foto Profil (opsional)
                     : </label>
                    <input
                      type="file"
                      name="foto_profil"
                      onChange={handleChange}
                      className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    />
                  </div>
                </>
              )}

              {formData.role === "Pengurus" && (
                <>
                  <div>
                    {errorTelepon && (
                      <p className="text-red-500 text-sm mb-1">
                        {errorTelepon}
                      </p>
                    )}
                    <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                      No Telepon (wajib diawali 08 atau 628){" "}
                      <span className="text-red-500">*</span>
                     : </label>
                    <input
                      required
                      type="number"
                      name="telepon"
                      value={formData.telepon}
                      onChange={(e) => {
                        handleChange(e);
                        setErrorTelepon("");
                      }}
                      placeholder="Masukkan No Telepon"
                      className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    />
                  </div>
                  <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">Alamat : </label>
                  <input
                    name="alamat"
                    value={formData.alamat || ""}
                    onChange={handleChange}
                    className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    placeholder="Alamat"
                  />
                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                      Foto Profil (opsional)
                     : </label>
                    <input
                      type="file"
                      name="foto_profil"
                      onChange={handleChange}
                      className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1 mt-1">
                      Status
                     : </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                </>
              )}
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
};

export default withAuth(EditAnggota);
