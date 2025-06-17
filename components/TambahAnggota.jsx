"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, Upload } from "lucide-react";

const TambahAnggota = ({ onKembali }) => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "",
    alamat: "",
    telepon: "",
    status: "Aktif",
    tanggal_bergabung: "",
    jumlah_jeep: "",
    jabatan: "",
    foto_profil: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      const formDataToSubmit = new FormData();
      for (let key in formData) {
        formDataToSubmit.append(key, formData[key]);
      }

      const res = await fetch("https://tpapi.siunjaya.id/api/users/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });

      if (res.ok) {
        onKembali();
      } else {
        const err = await res.json();
        alert("Gagal menambahkan anggota: " + err.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
          <h1 className="text-[32px] font-semibold">Tambah Anggota</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-700 font-bold">
              Peran <span className="text-red-500">*</span>
            </label>
            <select
              required
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-2 p-2 block w-full border border-gray-300 rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
            >
              <option value="">Pilih Peran</option>
              <option value="Front Office">Front Office</option>
              <option value="Owner">Owner</option>
              <option value="Driver">Driver</option>
              <option value="Pengurus">Pengurus</option>
            </select>
          </div>

          {[
            {
              label: "Nama Lengkap",
              name: "name",
              className: "font-bold",
              placeholder: "Masukkan Nama",
            },
            {
              label: "Username",
              className: "font-bold",
              name: "username",
              placeholder: "Masukkan Username",
            },
            {
              label: "Email",
              className: "font-bold",
              name: "email",
              type: "email",
              placeholder: "Masukkan Email",
            },
            {
              label: "Password (Minimal 8 Karakter)",
              className: "font-bold",
              name: "password",
              type: "password",
              placeholder: "Masukkan Password (Minimal 8 Karakter)",
            },
          ].map(({ label, name, type = "text", placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-bold text-gray-700">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
              />
            </div>
          ))}

          {formData.role === "Owner" && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  No Telepon (wajib diawali 08 atau 628){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  placeholder="Masukkan No Telepon"
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan Alamat"
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Jumlah Jeep (Maksimal 2){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  name="jumlah_jeep"
                  value={formData.jumlah_jeep}
                  onChange={handleChange}
                  placeholder="Masukkan Jumlah Jeep"
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Tanggal Bergabung <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  name="tanggal_bergabung"
                  value={formData.tanggal_bergabung}
                  onChange={handleChange}
                  max={today}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <label className="block text-sm font-bold text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  accept=".jpeg, .jpg, .png"
                  onChange={handleFileChange}
                  className="cursor-pointer mt-2 p-2 pr-10 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                  style={{ paddingRight: "2.5rem" }}
                />
                <Upload
                  size={15}
                  style={{
                    position: "absolute",
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </>
          )}

          {formData.role === "Driver" && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  No Telepon (wajib diawali 08 atau 628){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  placeholder="Masukkan No Telepon"
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan Alamat"
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Tanggal Bergabung <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  name="tanggal_bergabung"
                  value={formData.tanggal_bergabung}
                  onChange={handleChange}
                  max={today}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <label className="block text-sm font-bold text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  accept=".jpeg, .jpg, .png"
                  onChange={handleFileChange}
                  className="cursor-pointer mt-2 p-2 pr-10 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                  style={{ paddingRight: "2.5rem" }}
                />
                <Upload
                  size={15}
                  style={{
                    position: "absolute",
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </>
          )}

          {formData.role === "Pengurus" && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  No Telepon (wajib diawali 08 atau 628){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  placeholder="Masukkan No Telepon"
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan Alamat"
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Tanggal Bergabung <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  name="tanggal_bergabung"
                  value={formData.tanggal_bergabung}
                  onChange={handleChange}
                  max={today}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <label className="block text-sm font-bold text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  accept=".jpeg, .jpg, .png"
                  onChange={handleFileChange}
                  className="cursor-pointer mt-2 p-2 pr-10 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                  style={{ paddingRight: "2.5rem" }}
                />
                <Upload
                  size={15}
                  style={{
                    position: "absolute",
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </>
          )}

          <div className="flex justify-end">
            {" "}
            <button
              type="submit"
              className="bg-[#1C7AC8] text-[13px] text-white py-1 px-3 rounded-[12px] hover:bg-[#6CAEE5] transition cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahAnggota;
