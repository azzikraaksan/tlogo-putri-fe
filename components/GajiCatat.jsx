//"use client";
//import { useState } from "react";
//import { useRouter, useParams, useSearchParams } from "next/navigation";
//import { CircleArrowLeft, Calendar } from "lucide-react";

//export default function GajiCatat({ onKembali, id, role }) {
//  const [tanggal, setTanggal] = useState("");
//  const [showInput, setShowInput] = useState(false);
//  const router = useRouter();

//  //const handleDateChange = (e) => {
//  //  setTanggal(e.target.value);
//  //};
//  const handleDateChange = (e) => {
//    setTanggal(e.target.value);
//    setShowInput(false); // sembunyikan input setelah dipilih
//  };

//  const toggleDateInput = () => {
//    setShowInput(!showInput);
//  };

//  const handleSimpan = () => {
//    // Simulasi penyimpanan dan navigasi kembali
//    if (onKembali) {
//      onKembali(); // bisa untuk ubah status jadi "Berhasil"
//    } else {
//      router.push("/dashboard/penggajian/penggajian-utama");
//    }
//  };

//  return (
//    //<div className="p-6 max-w-5xl mx-auto bg-[#f1f2f6] rounded-md shadow-md space-y-4">
//    <div className="flex">
//      <div className="flex-1">
//        <div className="flex items-center gap-2">
//          <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
//          <h1 className="text-[32px] font-semibold">Catat Gaji</h1>
//        </div>

//        {/* Tanggal Gaji */}
//        <div className="p-6 bg-[#f1f2f6] rounded-md shadow-md space-y-4">
//          <div>
//            <label className="text-gray-600 font-semibold">
//              Periode Penggajian
//            </label>
//            <div className="flex items-center gap-2 mt-1">
//              <button onClick={toggleDateInput}>
//                <Calendar className="w-6 h-6 text-blue-500 cursor-pointer" />
//              </button>

//              {showInput && (
//                <input
//                  type="date"
//                  className="border border-gray-300 rounded px-3 py-1"
//                  onChange={handleDateChange}
//                  value={tanggal}
//                  autoFocus
//                />
//              )}

//              {tanggal && (
//                <span className="text-gray-700">
//                  {new Date(tanggal).toLocaleDateString("id-ID", {
//                    day: "numeric",
//                    month: "long",
//                    year: "numeric",
//                  })}
//                </span>
//              )}
//            </div>
//          </div>

//          {/*<div className="p-6 bg-[#f1f2f6] rounded-md shadow-md space-y-4">
//          <div>
//            <label className="text-gray-600 font-semibold">
//              Periode Penggajian
//            </label>
//            <div className="flex items-center gap-2 mt-1">
//              <Calendar className="w-6 h-6 text-blue-500" />
//              <input
//                type="date"
//                className="border border-gray-300 rounded px-3 py-1"
//                onChange={handleDateChange}
//                value={tanggal}
//              />
//              {tanggal && (
//                <span className="text-gray-700">
//                  {new Date(tanggal).toLocaleDateString("id-ID", {
//                    day: "numeric",
//                    month: "long",
//                    year: "numeric",
//                  })}
//                </span>
//              )}
//            </div>
//          </div>*/}

//          {/* Identitas */}
//          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t-4 border-blue-500 pt-5 text-sm">
//            <div>
//              ID Karyawan: <span className="font-semibold">01</span>
//            </div>
//            <div>
//              Nomor Lambung: <span className="font-semibold">01</span>
//            </div>
//            <div>
//              ID Karyawan: <span className="font-semibold">10</span>
//            </div>
//            <div>
//              Nama Owner: <span className="font-semibold">Ramon Ridwan</span>
//            </div>
//            <div>
//              Nama: <span className="font-semibold">Dudung Hasanudin</span>
//            </div>
//            <div>
//              Posisi: <span className="font-semibold">Driver</span>
//            </div>
//          </div>
//          <div className="border-b-4 border-blue-500 mt-4"></div>

//          {/* Tabel Gaji */}
//          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 rounded-md overflow-hidden">
//            {/* Penerimaan */}
//            <div>
//              <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
//                Penerimaan
//              </div>
//              <div className="p-4 space-y-2 text-sm">
//                <div className="flex justify-between">
//                  <span>Paket 1</span>
//                  <span>Rp 400.000</span>
//                </div>
//                <div className="flex justify-between">
//                  <span>Paket 3</span>
//                  <span>Rp 405.000</span>
//                </div>
//                <div className="mt-4 font-medium">Bonus Marketing</div>
//                <div className="flex justify-between">
//                  <span>Paket 3 (OP)</span>
//                  <span>Rp 30.000</span>
//                </div>
//              </div>
//            </div>

//            {/* Potongan */}
//            <div>
//              <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
//                Potongan
//              </div>
//              <div className="p-4 space-y-2 text-sm">
//                <div className="font-medium">Kas</div>
//                <div className="flex justify-between">
//                  <span>Paket 1</span>
//                  <span>Rp 65.000</span>
//                </div>
//                <div className="flex justify-between">
//                  <span>Paket 3</span>
//                  <span>Rp 50.000</span>
//                </div>
//                <div className="mt-4 font-medium">Diskon</div>
//                <div className="flex justify-between">
//                  <span>Paket 3 (10%)</span>
//                  <span>Rp 40.500</span>
//                </div>
//                <div className="mt-4 font-medium">Owner</div>
//                <div className="flex justify-between">
//                  <span>Paket 1 (30%)</span>
//                  <span>Rp 120.000</span>
//                </div>
//                <div className="flex justify-between">
//                  <span>Paket 3 (30%)</span>
//                  <span>Rp 121.500</span>
//                </div>
//              </div>
//            </div>
//          </div>

//          {/* Total */}
//          <div className="grid grid-cols-2 text-sm mt-2 border-t">
//            <div className="p-2 font-semibold flex justify-between">
//              <span>Total Penerimaan</span>
//              <span>Rp 835.000</span>
//            </div>
//            <div className="p-2 font-semibold flex justify-between">
//              <span>Total Potongan</span>
//              <span>Rp 397.000</span>
//            </div>
//          </div>

//          <div className="text-center font-bold text-lg py-2 border-t">
//            Jumlah Gaji: Rp 438.000
//          </div>

//          {/* Tombol Simpan */}
//          <div className="flex justify-end">
//            <button
//              onClick={handleSimpan}
//              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//            >
//              💾 Simpan
//            </button>
//          </div>
//        </div>
//      </div>
//    </div>
//  );
//}

//nanti ngeproops ambil id, saat di push ke halaman Catat kirim id (driver id)
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, Calendar } from "lucide-react";

export default function GajiCatat({ onKembali, id, role }) {
  const [tanggal, setTanggal] = useState("");
  const [showInput, setShowInput] = useState(false);
  const router = useRouter();
  const [nama, setNama] = useState(""); // state untuk nama karyawan

  const toggleDateInput = () => {
    setShowInput(!showInput);
  };

  const handleDateChange = (e) => {
    setTanggal(e.target.value);
    setShowInput(false);
  };

  useEffect(() => {
    const fetchCalculateData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const params = new URLSearchParams({
          user_id: id,
          role: role,
        });

        const res = await fetch(
          `http://localhost:8000/api/salary/calculate?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok && data) {
          setTanggal(data.payment_date || "");
          setNama(data.name || ""); // asumsikan response punya 'name'
        } else {
          console.warn("Gagal mengambil data periode atau nama");
        }
      } catch (error) {
        console.error("Error fetch data calculate:", error);
      }
    };

    fetchCalculateData();
  }, [id, role]);

  //const handleSimpan = () => {
  //  if (!tanggal) {
  //    alert("Harap pilih periode penggajian terlebih dahulu.");
  //    return;
  //  }

  //  // Simulasi simpan dan update status
  //  console.log("Gaji disimpan:", { id, role, tanggal });

  //  if (onKembali) {
  //    onKembali(id); // kirim ID untuk update status di halaman sebelumnya
  //  } else {
  //    router.push("/dashboard/penggajian/penggajian-utama");
  //  }
  //};

  const handleSimpan = async () => {
    //if (!tanggal) {
    //  alert("Harap pilih periode penggajian terlebih dahulu.");
    //  return;
    //}

    try {
      const token = localStorage.getItem("access_token");

      // Membuat query params
      const params = new URLSearchParams({
        user_id: id,
        role: role,
        periode: tanggal,
      });

      const res = await fetch(
        `http://localhost:8000/api/salary/calculate?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await res.json();

      if (!res.ok) {
        console.error("Gagal menghitung/mengambil data gaji:", responseData);
        alert("Gagal mengambil data gaji.");
        return;
      }

      console.log("Data gaji berhasil didapatkan:", responseData);

      // Lakukan sesuatu dengan responseData jika perlu,
      // lalu redirect ke halaman history
      router.push("/dashboard/penggajian/penggajian-utama");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mengambil data gaji.");
    }
  };

  // Format tanggal untuk ditampilkan
  const formatTanggal = (tgl) =>
    new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const renderGajiByRole = () => {
    switch (role) {
      case "Driver":
        return (
          <>
            {/* Tabel Gaji Driver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 rounded-md overflow-hidden">
              <div>
                <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                  Penerimaan
                </div>
                <div className="p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Paket 1</span>
                    <span>Rp 400.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paket 3</span>
                    <span>Rp 405.000</span>
                  </div>
                  <div className="mt-4 font-medium">Bonus Marketing</div>
                  <div className="flex justify-between">
                    <span>Paket 3 (OP)</span>
                    <span>Rp 30.000</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                  Potongan
                </div>
                <div className="p-4 text-sm space-y-2">
                  <div className="font-medium">Kas</div>
                  <div className="flex justify-between">
                    <span>Paket 1</span>
                    <span>Rp 65.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paket 3</span>
                    <span>Rp 50.000</span>
                  </div>
                  <div className="mt-4 font-medium">Owner</div>
                  <div className="flex justify-between">
                    <span>Paket 1 (30%)</span>
                    <span>Rp 120.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paket 3 (30%)</span>
                    <span>Rp 121.500</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 text-sm mt-2 border-t">
              <div className="p-2 font-semibold flex justify-between">
                <span>Total Penerimaan</span>
                <span>Rp 835.000</span>
              </div>
              <div className="p-2 font-semibold flex justify-between">
                <span>Total Potongan</span>
                <span>Rp 356.500</span>
              </div>
            </div>
            <div className="text-center font-bold text-lg py-2 border-t">
              Jumlah Gaji: Rp 478.500
            </div>
          </>
        );

      case "Owner":
        return (
          <>
            {/* Gaji Owner dari bagi hasil */}
            <div className="grid grid-cols-1 border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                Pendapatan Owner
              </div>
              <div className="p-4 text-sm">
                <div className="flex justify-between">
                  <span>Paket 1 (30%)</span>
                  <span>Rp 120.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Paket 3 (30%)</span>
                  <span>Rp 121.500</span>
                </div>
              </div>
              <div className="border-t p-2 font-semibold flex justify-between text-sm">
                <span>Total Pendapatan</span>
                <span>Rp 241.500</span>
              </div>
            </div>
          </>
        );

      case "Front Office":
        return (
          <>
            {/* Gaji Tetap Front Office */}
            <div className="grid grid-cols-1 border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                Gaji Tetap
              </div>
              <div className="p-4 text-sm">
                <div className="flex justify-between">
                  <span>UMR Jogja</span>
                  <span>Rp 2.125.000</span>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return <div className="text-red-500">Role tidak dikenali.</div>;
    }
  };

  return (
    <div className="flex">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <CircleArrowLeft
            onClick={() => onKembali?.(id)}
            className="cursor-pointer"
          />
          <h1 className="text-[28px] font-semibold">Catat Gaji</h1>
        </div>

        {/* Container */}
        <div className="p-6 bg-[#f1f2f6] rounded-md shadow-md space-y-4">
          {/* Tanggal */}
          <div>
            <label className="text-gray-600 font-semibold">
              Periode Penggajian
            </label>
            <div className="mt-1 text-gray-700 font-medium">
              {tanggal
                ? formatTanggal(tanggal)
                : "Tidak ada periode penggajian"}
            </div>
          </div>

          {/*<div>
            <label className="text-gray-600 font-semibold">Periode Penggajian</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={toggleDateInput}>
                <Calendar className="w-6 h-6 text-blue-500 cursor-pointer" />
              </button>
              {showInput && (
                <input
                  type="date"
                  className="border border-gray-300 rounded px-3 py-1"
                  onChange={handleDateChange}
                  value={tanggal}
                  autoFocus
                />
              )}
              {tanggal && (
                <span className="text-gray-700">{formatTanggal(tanggal)}</span>
              )}
            </div>
          </div>*/}

          {/* Identitas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t-4 border-blue-500 pt-5 text-sm">
            <div>
              ID Karyawan: <span className="font-semibold">{id}</span>
            </div>
            <div>
              Nama: <span className="font-semibold">{nama}</span>
            </div>
            <div>
              Posisi: <span className="font-semibold">{role}</span>
            </div>
          </div>
          <div className="border-b-4 border-blue-500 mt-4"></div>

          {/* Rincian Gaji Berdasarkan Role */}
          {renderGajiByRole()}

          {/* Tombol Simpan */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSimpan}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
