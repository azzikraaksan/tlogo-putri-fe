"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar"; // Import sidebar
import SlipGaji from "/components/SlipGaji";

export default function GajiCatatPage() {
  const router = useRouter();
  //const searchParams = useSearchParams();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [tanggal, setTanggal] = useState("");
  const [nama, setNama] = useState("");
  //const [status, setStatus] = useState(""); // Tambahan: status gaji
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params.id;
  const role = params.role;
  const [data, setData] = useState([]);
  const [totalGaji, setTotalGaji] = useState(0);
  const [status, setStatus] = useState("");

  const fetchGajiDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const resSalaryAll = await fetch("http://localhost:8000/api/salary/all");
      const allSalariesJson = await resSalaryAll.json();
      const allSalaries = allSalariesJson.data || [];

      // Cek apakah user ini sudah digaji berdasarkan id dan role
      const existingSalary = allSalaries.find(
        (item) =>
          item.user_id === parseInt(id) &&
          item.role.toLowerCase() === role.toLowerCase()
      );

      // Jika sudah digaji, langsung tampilkan datanya
      //if (existingSalary) {
      //  setData([existingSalary]);
      //  setNama(existingSalary.nama);
      //  setStatus("Berhasil");
      //  //setTotalGaji(existingSalary.total_salary || 0);
      //  return;
      //}

      let endpoint = "";
      if (role.toLowerCase() === "driver") {
        endpoint = `http://localhost:8000/api/salary/preview/${id}/driver`;
      } else if (role.toLowerCase() === "owner") {
        endpoint = `http://localhost:8000/api/salary/preview/${id}/owner`;
      } else if (role.toLowerCase() === "fron office") {
        endpoint = `http://localhost:8000/api/salary/preview/${id}/fron office`; // typo sebelumnya: "fron office"
      } else {
        throw new Error("Role tidak dikenali");
      }

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Gagal mengambil data gaji");

      const json = await res.json();
      const detail = json.data?.[0]; // Ambil objek pertama

      if (detail) {
        // Set nama dan status berdasarkan role
        setNama(getNamaByRole(detail, role));
        //setStatus(detail.status);
      }

      setData(json.data || []);
      // Jika sudah pernah dicatat, tampilkan status & total dari salary/all
      if (existingSalary) {
        setStatus("Berhasil");
        setTotalGaji(existingSalary.total_salary || 0);
      } else {
        // Jika belum dicatat, pakai dari preview (biar simulasi)
        if (role.toLowerCase() === "driver") {
          setTotalGaji(json.total_driver_share || 0);
        } else if (role.toLowerCase() === "owner") {
          setTotalGaji(json.total_owner_share || 0);
        } else if (role.toLowerCase() === "fron office") {
          setTotalGaji(json.total_fo_share || 0);
        }
        setStatus("Belum");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  //    // ✅ Pindahkan ini ke dalam blok try setelah json didefinisikan
  //    if (role.toLowerCase() === "driver") {
  //      setTotalGaji(json.total_driver_share || 0);
  //    } else if (role.toLowerCase() === "owner") {
  //      setTotalGaji(json.total_owner_share || 0);
  //    } else if (role.toLowerCase() === "fron office") {
  //      setTotalGaji(json.total_fo_share || 0); // gaji tetap
  //    }
  //  } catch (err) {
  //    setError(err.message || "Terjadi kesalahan");
  //  } finally {
  //    setLoading(false);
  //  }
  //};

  const getNamaByRole = (detail, role) => {
    switch (role.toLowerCase()) {
      case "driver":
        return detail.driver_name;
      case "owner":
        return detail.owner_name;
      case "fron office":
        return detail.name; // contoh, sesuaikan
      default:
        return "Tidak diketahui";
    }
  };

  const fetchTanggalGaji = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/salary/previews");
      if (!res.ok) throw new Error("Gagal mengambil data tanggal gaji");

      const json = await res.json();

      // Karena key-nya 'previews' di JSON
      const found = json.previews.find((item) => item.id == id);
      if (found) {
        setTanggal(found.payment_date);
      }
    } catch (err) {
      console.error("Error ambil tanggal:", err.message);
    }
  };

  useEffect(() => {
    fetchGajiDetail();
    fetchTanggalGaji();
  }, [id, role]);

  const formatRupiah = (num) => {
    if (typeof num !== "number") return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num);
  };

  const formatTanggal = (tgl) =>
    new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const isBelum = status.toLowerCase() === "belum";

  const handleTerbayarkan = async () => {
    setLoading(true);

    const selected = data?.[0];
    if (!selected) {
      console.error("Data tidak ditemukan:", selected);
      setLoading(false);
      return;
    }

    let user_id = null;

    switch (role?.toLowerCase()) {
      case "driver":
        user_id = selected.driver_id;
        break;
      case "owner":
        user_id = selected.owner_id;
        break;
      case "frontoffice":
        user_id = selected.front_office_id;
        break;
      default:
        console.error("Role tidak valid atau belum dipilih:", role);
        break;
    }

    if (!user_id) {
      console.error("user_id tidak ditemukan untuk role:", role);
      console.error("Data:", selected);
      setLoading(false);
      return;
    }

    const normalizedRole = role?.trim().toLowerCase();

    const payload = {
      salaries: data.map((item) => {
        let user_id, nama, roleName;

        if (normalizedRole === "driver") {
          user_id = item.driver_id;
          nama = item.driver_name;
          roleName = item.driver_role || "Driver";
        } else if (normalizedRole === "owner") {
          user_id = item.owner_id;
          nama = item.owner_name;
          roleName = "Owner";
        } else if (normalizedRole === "fron office") {
          user_id = item.front_office_id;
          nama = item.front_office_name;
          roleName = "Fron Office";
        }

        return {
          user_id,
          ticketing_id: item.ticketing_id,
          nama,
          role: roleName,
          no_lambung: item.no_lambung || "", // biasanya hanya driver yang punya
          kas: item.package?.kas || 0,
          operasional: item.package?.operasional || 0,
          salarie:
            normalizedRole === "driver"
              ? item.driver_share || 0
              : normalizedRole === "owner"
                ? item.owner_share || 0
                : item.front_office_share || 0,
          total_salary: item.net || 0,
          payment_date: tanggal,
        };
      }),
    };

    const endpoint = `http://localhost:8000/api/salary/store/${user_id}/${role.toLowerCase()}`;
    console.log("Mengirim data ke endpoint:", endpoint);
    console.log("Payload:", payload);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Berhasil mengubah status:", responseData);
        setStatus("Berhasil");
         const statusKey = `${user_id}-${role.toLowerCase()}`;
        localStorage.setItem(
          "statusUpdated", statusKey
        );
        console.log("✅ Disimpan ke localStorage:", statusKey);
        //router.push("/dashboard/penggajian/penggajian-utama");
         setTimeout(() => {
    //router.push("/dashboard/penggajian/penggajian-utama");
    router.push(`/dashboard/penggajian/penggajian-utama?updated=${user_id}-${role.toLowerCase()}`);

  }, 200); // 200ms sudah cukup
      } else {
        const errorText = await response.text();
        console.error("Gagal mengubah status. Status:", response.status);
        console.error("Pesan dari server:", errorText);
      }
    } catch (error) {
      console.error("Terjadi error saat fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCetak = () => {
    setShowSlipModal(true);
  };

  const renderGajiByRole = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data.length) return <p>Data kosong</p>;

    const normalizedRole = role.toLowerCase();

    switch (normalizedRole) {
      case "driver":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 rounded-md overflow-hidden">
              <div>
                <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                  Penerimaan
                </div>
                <div className="p-4 text-sm space-y-2">
                  {data.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{`Paket ${item.package?.slug.split("-")[1]}`}</span>
                      <span>{`Rp ${item.package?.price?.toLocaleString("id-ID")}`}</span>
                    </div>
                  ))}
                  {data.some((item) => item.bonus_driver > 0) && (
                    <>
                      <div className="mt-4 font-medium">Bonus Driver</div>
                      {data.map(
                        (item, index) =>
                          item.bonus_driver > 0 && (
                            <div key={index} className="flex justify-between">
                              <span>{`Paket ${item.package?.slug.split("-")[1]}`}</span>
                              <span>{`Rp ${item.bonus_driver?.toLocaleString("id-ID")}`}</span>
                            </div>
                          )
                      )}
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                  Potongan
                </div>
                <div className="p-4 text-sm space-y-2">
                  <div className="font-medium">Marketing</div>
                  {data.map((item, index) => (
                    <div key={`kas-${index}`} className="flex justify-between">
                      <span>{`Paket ${item.package?.slug.split("-")[1]}`}</span>
                      <span>{`Rp ${item.referral_cut?.toLocaleString("id-ID") || 0}`}</span>
                    </div>
                  ))}
                  <div className="font-medium">Kas</div>
                  {data.map((item, index) => (
                    <div key={`kas-${index}`} className="flex justify-between">
                      <span>{`Paket ${item.package?.slug.split("-")[1]}`}</span>
                      <span>{`Rp ${item.package?.kas?.toLocaleString("id-ID") || 0}`}</span>
                    </div>
                  ))}
                  <div className="font-medium">Operasional</div>
                  {data.map((item, index) => (
                    <div key={`kas-${index}`} className="flex justify-between">
                      <span>{`Paket ${item.package?.slug.split("-")[1]}`}</span>
                      <span>{`Rp ${item.package?.operasional?.toLocaleString("id-ID") || 0}`}</span>
                    </div>
                  ))}
                  <div className="mt-4 font-medium">Owner</div>
                  {data.map((item, index) => (
                    <div
                      key={`owner-${index}`}
                      className="flex justify-between"
                    >
                      <span>{`Paket ${item.package?.slug.split("-")[1]} (30%)`}</span>
                      <span>{`Rp ${item.owner_share?.toLocaleString("id-ID") || 0}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 text-sm mt-2 border-t">
              <div className="p-2 font-semibold flex justify-between">
                <span>Total Penerimaan</span>
                <span>
                  {formatRupiah(
                    data.reduce(
                      (acc, cur) =>
                        acc +
                        (cur.package?.price || 0) +
                        (cur.bonus_driver || 0),
                      0
                    )
                  )}
                </span>
              </div>
              <div className="p-2 font-semibold flex justify-between">
                <span>Total Potongan</span>
                <span>
                  {formatRupiah(
                    data.reduce(
                      (acc, cur) =>
                        acc +
                        (cur.package?.kas || 0) +
                        (cur.package?.operasional || 0) +
                        (cur.owner_share || 0),
                      0
                    )
                  )}
                </span>
              </div>
            </div>
            <div className="text-center font-bold text-lg py-2 border-t">
              Total Jumlah Gaji: {formatRupiah(totalGaji)}
            </div>
          </>
        );

      case "owner":
        return (
          <div className="border border-gray-300 rounded-md p-4">
            <h2 className="text-lg font-semibold mb-4">Pendapatan Owner</h2>
            {data.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{`Paket ${item.package?.slug.split("-")[1]}`}</span>
                <span>{`Rp ${item.owner_share?.toLocaleString("id-ID")}`}</span>
              </div>
            ))}
            <div className="mt-4 font-bold flex justify-between border-t pt-2">
              <span>Total Pendapatan:</span>
              <span>{formatRupiah(totalGaji)}</span>
            </div>
          </div>
        );

      case "fron office":
        return (
          <div className="border border-gray-300 rounded-md p-4">
            <h2 className="text-lg font-semibold mb-4">
              Gaji Tetap Front Office
            </h2>
            <div className="flex justify-between">
              <span>Gaji Bulanan</span>
              <span>{formatRupiah(totalGaji)}</span>
            </div>
          </div>
        );

      default:
        return <p>Role tidak dikenali</p>;
    }
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
        <div className="flex items-center gap-2 mb-4">
          <CircleArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
          />
          <h1 className="text-[28px] font-semibold">Catat Gaji</h1>
        </div>

        <div className="bg-[#f1f2f6] rounded-md shadow-md p-6 space-y-4">
          <div>
            <label className="text-gray-600 font-semibold">
              Periode Penggajian
            </label>
            <div className="mt-1 text-gray-700 font-medium">
              {tanggal ? formatTanggal(tanggal) : "Tidak ada periode"}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t-4 border-blue-500 pt-5 text-sm">
            <div>
              Nama: <span className="font-semibold">{nama}</span>
            </div>
            <div>
              Posisi: <span className="font-semibold">{role}</span>
            </div>
            <div>
              Status: <span className="font-semibold">{status}</span>
            </div>
          </div>
          <div className="border-b-4 border-blue-500 mt-4"></div>

          {renderGajiByRole()}
          <div className="flex justify-end mt-4 gap-4">
            {/*{status.toLowerCase() === "belum" && (
              //<button
              //  onClick={handleTerbayarkan}
              //  disabled={loading}
              //  className={`px-4 py-2 rounded text-white ${
              //    loading
              //      ? "bg-gray-400 cursor-not-allowed"
              //      : "bg-green-600 hover:bg-green-700"
              //  }`}
              //>
              //  {loading ? "Memproses..." : "Terbayarkan"}
              //</button>
              //<button
              //  onClick={handleTerbayarkan}
              //  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              //>
              //  Terbayarkan
              //</button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleTerbayarkan}
              >
                Terbayarkan
              </button>
            )}*/}
            {/*{status !== "Berhasil" && (
              <button
                onClick={handleTerbayarkan}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Memproses..." : "Terbayarkan"}
              </button>
            )}
            <button
              onClick={handleCetak}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cetak
            </button>*/}
            {isBelum && (
              <button
                onClick={handleTerbayarkan}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Terbayarkan
              </button>
            )}
            <button
              onClick={() => setShowSlipModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Cetak
            </button>
          </div>

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

          {/*
          {showSlipModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-[90%] max-w-3xl shadow-lg p-6 relative print:w-full print:max-w-full print:p-0 print:shadow-none print:rounded-none print:bg-white">
                <button
                  onClick={() => setShowSlipModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600 print:hidden"
                >
                  ✕
                </button>

                <SlipGaji
                  id={id}
                  nama={nama}
                  role={role}
                  status={status}
                  tanggal={tanggal}
                />
              </div>
            </div>
          )}*/}
        </div>
      </div>
    </div>
  );
}
