"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";

const TambahAnggota = ({ onKembali }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "",
    alamat: "",
    telepon: "",
    status: "",
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
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      const formDataToSubmit = new FormData();
      for (let key in formData) {
        formDataToSubmit.append(key, formData[key]);
      }

      const res = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });

      if (res.ok) {
        alert("Anggota berhasil ditambahkan!");
        onKembali();
      } else {
        const err = await res.json();
        alert("Gagal menambahkan anggota: " + err.message);
      }
    } catch (err) {
      console.error(err);
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
              Peran
            </label>
            <select
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
              label: "Password",
              className: "font-bold",
              name: "password",
              type: "password",
              placeholder: "Masukkan Password",
            },
          ].map(({ label, name, type = "text", placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-bold text-gray-700">
                {label}
              </label>
              <input
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
                  No Telepon (wajib diawali 628, misal 6281234567890)
                </label>
                <input
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
                  Alamat
                </label>
                <input
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
                  Jumlah Jeep
                </label>
                <input
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
                  Tanggal Bergabung
                </label>
                <input
                  type="date"
                  name="tanggal_bergabung"
                  value={formData.tanggal_bergabung}
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                >
                  <option value="">Pilih Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  onChange={handleFileChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
            </>
          )}

          {formData.role === "Driver" && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  No Telepon (wajib diawali 628, misal 6281234567890)
                </label>
                <input
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
                  Alamat
                </label>
                <input
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
                  Tanggal Bergabung
                </label>
                <input
                  type="date"
                  name="tanggal_bergabung"
                  value={formData.tanggal_bergabung}
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                >
                  <option value="">Pilih Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  onChange={handleFileChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>
            </>
          )}

          {formData.role === "Pengurus" && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  No Telepon (wajib diawali 628, misal 6281234567890)
                </label>
                <input
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
                  Alamat
                </label>
                <input
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
                  Tanggal Bergabung
                </label>
                <input
                  type="date"
                  name="tanggal_bergabung"
                  value={formData.tanggal_bergabung}
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
                >
                  <option value="">Pilih Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  onChange={handleFileChange}
                  className="mt-2 p-2 block w-full border border-[#E5E7EB] rounded-[14px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-[14px]"
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
