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
    plat_jeep: "",
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
          <CircleArrowLeft
            onClick={onKembali}
            className="cursor-pointer"
          />
          <h1 className="text-[32px] font-semibold">Tambah Anggota</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-[650px] mx-auto mt-8 p-6 bg-white shadow-md rounded-xl space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Role</option>
              <option value="Front Office">Front Office</option>
              <option value="Owner">Owner</option>
              <option value="Driver">Driver</option>
            </select>
          </div>

          {[
            { label: "Nama", name: "name", placeholder: "Masukkan Nama" },
            {
              label: "Username",
              name: "username",
              placeholder: "Masukkan Username",
            },
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "Masukkan Email",
            },
            {
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "Masukkan Password",
            },
          ].map(({ label, name, type = "text", placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          {formData.role === "Owner" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  No Telepon
                </label>
                <input
                  type="tel"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  placeholder="Masukkan No Telepon"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan Alamat"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jumlah Jeep
                </label>
                <input
                  type="number"
                  name="jumlah_jeep"
                  value={formData.jumlah_jeep}
                  onChange={handleChange}
                  placeholder="Masukkan Jumlah Jeep"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Foto Jeep (opsional)
                </label>
                <input
                  type="file"
                  name="foto_jeep"
                  onChange={handleFileChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {formData.role === "Driver" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  No Telepon
                </label>
                <input
                  type="tel"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  placeholder="Masukkan No Telepon"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan Alamat"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {formData.role === "Front Office" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Foto Profil (opsional)
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  onChange={handleFileChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Bergabung
            </label>
            <input
              type="date"
              name="tanggal_bergabung"
              value={formData.tanggal_bergabung}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Masukkan Status"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="justify-end bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
};

export default TambahAnggota;
