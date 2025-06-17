"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "/components/Sidebar";
import LoadingRow from "/components/LoadingRow.jsx";
import TambahAnggota from "/components/TambahAnggota";
import DetailAnggota from "/components/LihatDetail";
import SearchInput from "/components/Search";
import withAuth from "/src/app/lib/withAuth";
import { Trash2, Plus, ListFilter } from "lucide-react";
import Hashids from "hashids";

const AnggotaPage = () => {
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [searchTerm, setSearchTerm] = useState("");
  const [modeTambah, setModeTambah] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch("https://tpapi.siunjaya.id/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const filteredData = users.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchSearch =
      (item?.name || "").toLowerCase().includes(search) ||
      (item?.role || "").toLowerCase().includes(search) ||
      (item?.email || "").toLowerCase().includes(search) ||
      (item?.peran || "").toLowerCase().includes(search) ||
      (item?.status || "").toLowerCase().includes(search);

    const matchRole = roleFilter ? item?.role === roleFilter : true;

    return matchSearch && matchRole;
  });

  const handleTambahAnggota = () => {
    setModeTambah(true);
  };

  const handleKembali = () => {
    setModeTambah(false);
    fetchUsers();
  };

  const handleLihatDetail = (user) => {
    if (user?.id) {
      const encryptedId = hashids.encode(user.id);
      router.push(
        `/dashboard/operasional/anggota/detail-anggota/${encryptedId}`
      );
    }
  };

  const handleKembaliDariDetail = () => {
    setSelectedUser(null);
  };

  const confirmDelete = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleHapusUser = async () => {
    if (!selectedUserId) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch(
        `https://tpapi.siunjaya.id/api/users/delete/${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== selectedUserId)
        );
      } else {
        alert("Gagal hapus user.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus.");
    } finally {
      setIsModalOpen(false);
      setSelectedUserId(null);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRoleSelect = (role) => {
    setRoleFilter(role);
    setIsDropdownOpen(false);
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
        {modeTambah ? (
          <TambahAnggota onKembali={handleKembali} />
        ) : selectedUser ? (
          <DetailAnggota
            user={selectedUser}
            onKembali={handleKembaliDariDetail}
          />
        ) : (
          <>
            <h1 className="text-[32px] font-semibold mb-6 text-black">
              Daftar Anggota
            </h1>
            <div className="flex relative">
              <button
                onClick={toggleDropdown}
                className="bg-[#3D6CB9] rounded-[10px] text-white py-1 px-3 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
              >
                <ListFilter size={20} className="mr-2 w-[20px] h-auto" />
                {roleFilter === "" ? "Filter" : roleFilter}
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-10 bg-[#3D6CB9] text-white rounded-[10px] shadow-lg p-2">
                  <button
                    onClick={() => handleRoleSelect("")}
                    className="block px-4 py-2 hover:bg-[#7ba2d0] hover:rounded-[10px] cursor-pointer w-full text-left"
                  >
                    Semua Role
                  </button>
                  <button
                    onClick={() => handleRoleSelect("Front Office")}
                    className="block px-4 py-2 hover:bg-[#7ba2d0] hover:rounded-[10px] cursor-pointer w-full text-left"
                  >
                    Front Office
                  </button>
                  <button
                    onClick={() => handleRoleSelect("Driver")}
                    className="block px-4 py-2 hover:bg-[#7ba2d0] hover:rounded-[10px] cursor-pointer w-full text-left"
                  >
                    Driver
                  </button>
                  <button
                    onClick={() => handleRoleSelect("Owner")}
                    className="block px-4 py-2 hover:bg-[#7ba2d0] hover:rounded-[10px] cursor-pointer w-full text-left"
                  >
                    Owner
                  </button>
                  <button
                    onClick={() => handleRoleSelect("Pengurus")}
                    className="block px-4 py-2 hover:bg-[#7ba2d0] hover:rounded-[10px] cursor-pointer w-full text-left"
                  >
                    Pengurus
                  </button>
                </div>
              )}
            </div>

            <div className="flex">
              <button
                onClick={handleTambahAnggota}
                className="bg-[#3D6CB9] rounded-[10px] text-white py-1 px-3 mt-2 mb-2 cursor-pointer hover:bg-[#7ba2d0] transition flex items-center"
              >
                <Plus size={18} className="mr-2 w-[20px] h-auto" />
                Tambah Anggota
              </button>
            </div>

            <div className="flex justify-end mb-7">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                placeholder="Cari"
              />
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow max-h-[460px]">
              <table className="w-full table-auto">
                <thead className="bg-[#3D6CB9] text-white sticky top-0">
                  <tr>
                    <th className="p-2 text-center font-normal">No</th>
                    <th className="p-2 text-center font-normal">Nama</th>
                    <th className="p-2 text-center font-normal">Email</th>
                    <th className="p-2 text-center font-normal">Peran</th>
                    <th className="p-2 text-center font-normal">Status</th>
                    <th className="p-2 text-center font-normal">Kontak</th>
                    <th className="p-2 text-center font-normal">Aksi</th>
                    <th className="p-2 text-center font-normal">Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <>
                      <LoadingRow colCount={8} />
                    </>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item?.id || index}
                        className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-2 text-center text-gray-750">
                          {index + 1}
                        </td>
                        <td className="p-2 text-center text-gray-750">
                          {item?.name || "-"}
                        </td>
                        <td className="p-2 text-center text-gray-750">
                          {item?.email || "-"}
                        </td>
                        <td className="p-2 text-center text-gray-750">
                          {item?.role || "-"}
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`inline-flex items-center gap-2 px-2 py-1 text-[14px] font-semibold rounded-full ${
                              item.status === "Aktif"
                                ? "bg-green-100 text-green-600"
                                : item.status === "Tidak Aktif"
                                  ? "bg-red-100 text-red-600"
                                  : "text-gray-750"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.status === "Aktif"
                                  ? "bg-green-600"
                                  : item.status === "Tidak Aktif"
                                    ? "bg-red-600"
                                    : "bg-gray-400"
                              }`}
                            ></span>
                            {item?.status || "-"}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => {
                              if (item?.telepon) {
                                window.open(
                                  `https://wa.me/${item.telepon.replace(/^0/, "62")}`,
                                  "_blank"
                                );
                              }
                            }}
                            disabled={!item?.telepon}
                            className={`px-3 rounded-[10px] text-white ${
                              item?.telepon
                                ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                                : "bg-gray-400 cursor-not-allowed"
                            } inline-block`}
                          >
                            WhatsApp
                          </button>
                        </td>

                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleLihatDetail(item)}
                            className="w-[120px] bg-[#B8D4F9] rounded-[10px] text-[#1C7AC8] hover:bg-[#7ba2d0] transition cursor-pointer"
                          >
                            Lihat Detail
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            className="text-gray-500 hover:text-gray-750 cursor-pointer"
                            onClick={() => item?.id && confirmDelete(item.id)}
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">
                        Data tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
                  <h2 className="text-xl font-semibold mb-4">
                    Konfirmasi Hapus
                  </h2>
                  <p className="mb-6">Yakin ingin menghapus user ini?</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded-[10px] cursor-pointer hover:bg-gray-400"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleHapusUser}
                      className="px-3 py-1 bg-red-500 text-white rounded-[10px] cursor-pointer hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(AnggotaPage);
