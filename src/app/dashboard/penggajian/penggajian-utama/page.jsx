"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "/components/Sidebar";
import SearchInput from "/components/Search";
import GajiCatat from "/components/GajiCatat";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import SlipGaji from "/components/SlipGaji";
import Hashids from "hashids";

function DaftarGaji() {
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [modeCatat, setModeCatat] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const itemsPerPage = 10;
  const [allPreviews, setAllPreviews] = useState([]); // untuk semua entri
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [dataGaji, setDataGaji] = useState([]);
  const [showSlipModal, setShowSlipModal] = useState(false);

  const router = useRouter();

  const fetchSalaryDataGabungan = async () => {
    try {
      const [previewRes, allRes] = await Promise.all([
        fetch("http://localhost:8000/api/salary/previews"),
        fetch("http://localhost:8000/api/salary/all"),
      ]);

      const previewJson = await previewRes.json();
      const allJsonRaw = await allRes.json();

      //console.log("Data salary/all:", allJsonRaw); // Cek dulu struktur

      // Misal data yang benar ada di properti `all`
      const allJson = allJsonRaw.all || allJsonRaw;
      //console.log("Data salary/all:", allJsonRaw);

      const previews = previewJson.previews.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        nama: item.nama,
        posisi: item.role,
        role: item.role,
        tanggal: item.payment_date,
        status: item.status,
      }));

      const formatDate = (dateStr) =>
        new Date(dateStr).toISOString().slice(0, 10);

      const merged = previews.map((preview) => {
        const previewDate = formatDate(preview.tanggal);
        const isMatched =
          Array.isArray(allJson) &&
          allJson.some(
            (s) =>
              s.user_id === preview.user_id &&
              s.role.toLowerCase() === preview.role.toLowerCase() &&
              formatDate(s.payment_date) === previewDate
          );

        return {
          ...preview,
          status: isMatched ? "Sudah" : "Belum",
        };
      });

      // Filter unik per user dan tanggal
      const unique = new Map();
      merged.forEach((item) => {
        const dateKey = new Date(item.tanggal).toISOString().slice(0, 10);
        const key = `${item.user_id}_${dateKey}`;
        if (!unique.has(key)) {
          unique.set(key, item);
        }
      });

      setAllPreviews([...merged]);
      setData([...unique.values()]);
    } catch (error) {
      console.error("Gagal fetch gabungan:", error);
    }
  };

  const fetchSalaryAllData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/salary/all");
      const json = await res.json();
      //console.log("Data salary/all diterima:", json);

      const rawData = json.data || json;

      const mappedData = rawData.map((item) => ({
        ...item,
        posisi: item.role, // Tambahkan posisi agar bisa difilter
        tanggal: item.date ?? item.payment_date, // Pastikan ada tanggal
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Gagal fetch salary/all:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      //console.log("⏳ INIT useEffect jalan");

      const updated = localStorage.getItem("statusUpdated");
      //console.log("📦 statusUpdated dari localStorage:", updated);

      // Ambil data dari API
      const [previewRes, allRes] = await Promise.all([
        fetch("http://localhost:8000/api/salary/previews"),
        fetch("http://localhost:8000/api/salary/all"),
      ]);

      const previewJson = await previewRes.json();
      const allJsonRaw = await allRes.json();
      const allJson = allJsonRaw.all || allJsonRaw.data || [];

      const previews = previewJson.previews.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        nama: item.nama,
        posisi: item.role,
        role: item.role,
        tanggal: item.payment_date,
        status: item.status,
      }));

      const formatDate = (dateStr) =>
        new Date(dateStr).toISOString().slice(0, 10);

      const merged = previews.map((preview) => {
        const previewDate = formatDate(preview.tanggal);
        const isMatched =
          Array.isArray(allJson) &&
          allJson.some(
            (s) =>
              s.user_id === preview.user_id &&
              s.role.toLowerCase() === preview.role.toLowerCase() &&
              formatDate(s.payment_date) === previewDate
          );

        return {
          ...preview,
          status: isMatched ? "Sudah" : "Belum",
        };
      });

      // 🔑 Filter agar tidak duplikat user-role-tanggal
      const uniqueMap = new Map();
      merged.forEach((item) => {
        const dateKey = new Date(item.tanggal).toISOString().slice(0, 10);
        const key = `${item.user_id}_${item.role.toLowerCase()}_${dateKey}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      });

      const filteredMerged = [...uniqueMap.values()];

      setAllPreviews(filteredMerged);
      setData(filteredMerged);

      // SIMPAN DATA SEBELUM DIUBAH STATUS SECARA MANUAL
      //setAllPreviews([...merged]);
      //setData([...merged]);

      // ✅ INI BAGIAN YANG KAMU MAKSUD
      if (updated && updated.includes("-")) {
        const [uid, r, pdate] = updated.split("-");

        // Ganti status di data yang sesuai dengan statusUpdated
        setData((prev) =>
          prev.map((item) => {
            const match =
              String(item.user_id) === uid &&
              item.role.toLowerCase() === r.toLowerCase() &&
              formatDate(item.tanggal) === formatDate(pdate);
            return match ? { ...item, status: "Sudah" } : item;
          })
        );

        setAllPreviews((prev) =>
          prev.map((item) => {
            const match =
              String(item.user_id) === uid &&
              item.role.toLowerCase() === r.toLowerCase() &&
              formatDate(item.tanggal) === formatDate(pdate);
            return match ? { ...item, status: "Sudah" } : item;
          })
        );

        localStorage.removeItem("statusUpdated");
      }
    };

    init();
  }, [reloadTrigger]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updated = localStorage.getItem("statusUpdated");
      if (updated) {
        //console.log("📦 Triggered via storage event:", updated);
        setReloadTrigger((prev) => prev + 1); // ⬅️ ini akan memicu ulang useEffect utama
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const updated = localStorage.getItem("statusUpdated");
    if (updated) {
      setReloadTrigger((prev) => prev + 1);
    }
  }, []);

  const filteredData = useMemo(() => {
    return (data || [])
      .filter((item) => {
        const matchesSearch =
          item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.posisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tanggal?.toLowerCase().includes(searchQuery.toLowerCase());

        return (
          (positionFilter === "Semua" || item.posisi === positionFilter) &&
          (statusFilter === "Semua" ||
            item.status.toLowerCase() === statusFilter.toLowerCase()) &&
          matchesSearch &&
          (!selectedDate || item.tanggal?.slice(0, 10) === selectedDate)
        );
      })
      .sort((a, b) => {
        if (a.status === b.status) {
          return parseInt(a.id) - parseInt(b.id);
        }
        return a.status.toLowerCase() === "belum" ? -1 : 1;
      });
  }, [data, searchQuery, positionFilter, statusFilter, selectedDate]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredData, currentPage, itemsPerPage]);

  const fetchGaji = async () => {
    const res = await fetch("http://localhost:8000/api/salary/previews");
    const data = await res.json();
    setDataGaji(data);
  };

  const handleCatat = (user_id, role, payment_date) => {
    //console.log("Diterima payment_date:", payment_date); // debug

    let encodedDate = "";
    if (payment_date && !isNaN(new Date(payment_date))) {
      encodedDate = encodeURIComponent(
        new Date(payment_date).toISOString().slice(0, 10)
      );
    } else {
      console.warn("Tanggal tidak valid, default ke kosong.");
    }
    router.push(
      `/dashboard/penggajian/penggajian-utama/catat/${user_id}/${role}?payment_date=${encodedDate}`
    );
  };

  const handleLihat = (user_id, role, payment_date) => {
    //console.log("Lihat detail:", user_id, role, payment_date);

    let encodedDate = "";
    if (payment_date && !isNaN(new Date(payment_date))) {
      encodedDate = encodeURIComponent(
        new Date(payment_date).toISOString().slice(0, 10)
      );
    } else {
      console.warn("Tanggal tidak valid, default ke kosong.");
    }

    // ⬅️ Simpan status agar halaman utama tahu mana yang perlu diupdate nanti
    localStorage.setItem("statusUpdated", `${user_id}-${role}-${encodedDate}`);

    router.push(
      `/dashboard/penggajian/penggajian-utama/catat/${user_id}/${role}?payment_date=${encodedDate}`
    );
  };

  const handleCetak = () => {
    setShowSlipModal(true);
  };

  const handleKembaliDariGaji = () => {
    setModeCatat(false);
    setSelectedRole(null);
  };

  const updateStatus = (user_id, role, payment_date) => {
    setAllPreviews((prev) =>
      prev.map((item) => {
        if (
          item.user_id === user_id &&
          item.role.toLowerCase() === role.toLowerCase() &&
          item.tanggal?.slice(0, 10) === payment_date
        ) {
          return { ...item, status: "Sudah" };
        }
        return item;
      })
    );

    setData((prev) =>
      prev.map((item) => {
        if (
          item.user_id === user_id &&
          item.role.toLowerCase() === role.toLowerCase() &&
          item.tanggal?.slice(0, 10) === payment_date
        ) {
          return { ...item, status: "Sudah" };
        }
        return item;
      })
    );
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

      <div className="flex-1 p-6">
        {modeCatat ? (
          <GajiCatat onKembali={handleKembaliDariGaji} role={selectedRole} />
        ) : (
          <>
            <h1 className="text-[32px] font-semibold mb-6 text-black">
              Daftar Gaji
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium text-gray-700">
                Posisi
              </label>
              <select
                value={positionFilter}
                onChange={(e) => {
                  setPositionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
              >
                <option value="Semua">Semua</option>
                <option value="Driver">Driver</option>
                <option value="Owner">Owner</option>
                <option value="Front Office">Front Office</option>
              </select>

              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
              >
                <option value="Semua">Semua</option>
                <option value="Belum">Belum</option>
                <option value="Sudah">Sudah</option>
              </select>

              <label className="text-sm font-medium text-gray-700">
                Tanggal
              </label>
              <input
                type="date"
                //defaultValue={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-1 block w-40 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => {
                  setSelectedDate("");
                  setPositionFilter("Semua");
                  setStatusFilter("Semua");
                }}
                className="text-sm text-blue-600"
              >
                Reset Semua Filter
              </button>
            </div>

            <div className="flex justify-end mb-4">
              <SearchInput
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => setSearchQuery("")}
                placeholder="Cari..."
              />
            </div>

            <div className="overflow-x-auto rounded-xl shadow bg-white">
              <div className="max-h-[530px] overflow-y-auto">
                <table className="w-full table-auto text-center">
                  <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Nama Karyawan</th>
                      <th className="p-3">Posisi</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item) => (
                        <tr key={item.id} className="border-b last:border-b-0">
                          <td className="p-3">{item.nama}</td>
                          <td className="p-3">{item.posisi}</td>
                          <td className="p-3">{item.tanggal}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium ${
                                item.status.toLowerCase() === "belum"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.status.toLowerCase() === "belum"
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                }`}
                              ></span>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 flex justify-center gap-2">
                            {item.status.toLowerCase() === "belum" ? (
                              <button
                                onClick={() => {
                                  handleCatat(
                                    item.user_id,
                                    item.role,
                                    item.tanggal
                                  );
                                }}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
                              >
                                Catat
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleLihat(
                                      item.user_id,
                                      item.role,
                                      item.tanggal
                                    )
                                  }
                                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
                                >
                                  Lihat
                                </button>

                                {showSlipModal && (
                                  <SlipGaji
                                    onClose={() => setShowSlipModal(false)}
                                    nama={nama}
                                    tanggal={tanggal}
                                    role={role}
                                    totalGaji={totalGaji}
                                    data={data}
                                  />
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-gray-500">
                          Data penggajian tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-1 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded disabled:opacity-30 hover:bg-gray-200"
              >
                &lt;
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const shouldShow =
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 2;

                if (page === 2 && currentPage > 4)
                  return <span key="start-dots">...</span>;
                if (page === totalPages - 1 && currentPage < totalPages - 3)
                  return <span key="end-dots">...</span>;

                return (
                  shouldShow && (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-[#3D6CB9] text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded disabled:opacity-30 hover:bg-gray-200"
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(DaftarGaji);
