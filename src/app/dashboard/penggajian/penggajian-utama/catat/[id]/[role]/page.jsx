"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar";
import SlipGajiModal from "/components/SlipGaji";
import Hashids from "hashids";

export default function GajiCatatPage() {
  const matchRole = (sourceRole, compareToUrlRole) => {
    return sourceRole?.toLowerCase().replace(/\s+/g, "-") === compareToUrlRole;
  };

  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [tanggal, setTanggal] = useState("");
  const [nama, setNama] = useState("");
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const role = params.role;
  const [data, setData] = useState([]);
  const [totalGaji, setTotalGaji] = useState(0);
  const [status, setStatus] = useState("");
  const [payment_date, setPaymentDate] = useState("");
  const decoded = hashids.decode(params.id);
  const id = decoded[0];
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchGajiDetail = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("access_token");
    console.log("\ud83d\udd50 Memulai fetchGajiDetail:", {
      id,
      role,
      payment_date,
    });

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      //const normalizeDate = (dateStr) =>
      //  new Date(dateStr).toISOString().slice(0, 10);
      const normalizeDate = (dateStr) => {
        if (!dateStr || isNaN(new Date(dateStr))) return "";
        return new Date(dateStr).toISOString().slice(0, 10);
      };

      const normalizedPaymentDate = normalizeDate(payment_date);

      const roleForData = decodeURIComponent(role).trim();
      const roleForUrl = roleForData.toLowerCase().replace(/\s+/g, "-");

      console.log("✅ roleForData:", roleForData);
      console.log("✅ roleForUrl:", roleForUrl);

      const resPreview = await fetch(
        "https://tpapi.siunjaya.id/api/salary/previews",
        { headers }
      );
      const previewJson = await resPreview.json();

      let ticketingIDs = [];
      if (roleForUrl !== "front-office") {
        ticketingIDs = previewJson.previews
          .filter(
            (item) =>
              item.user_id === parseInt(id) &&
              item.role === roleForData &&
              normalizeDate(item.payment_date) === normalizedPaymentDate
          )
          .map((item) => item.ticketing_id);
      }

      const endpoint = `https://tpapi.siunjaya.id/api/salary/preview/${id}/${roleForUrl}`;
      console.log("Endpoint yang akan dipanggil:", endpoint);

      const resDetail = await fetch(endpoint, { headers });
      const json = await resDetail.json();
      console.log("API Response:", json);

      let filteredData = [];

      if (json.data && Array.isArray(json.data)) {
        filteredData = json.data.filter((item) =>
          ticketingIDs.includes(item.ticketing_id)
        );
      } else if (json.data && roleForUrl === "front-office") {
        filteredData = [
          {
            ...json.data,
            total_fo_share: json.total_fo_share || 0,
          },
        ];
      } else {
        console.warn("Format data tidak dikenali:", json);
      }

      if (filteredData.length > 0) {
        setData(filteredData);
        setNama(getNamaByRole(filteredData[0], roleForUrl));
      } else {
        setData([]);
        setNama("Tidak ditemukan");
      }

      const resSalaryAll = await fetch(
        "https://tpapi.siunjaya.id/api/salary/all",
        { headers }
      );
      const allSalariesJson = await resSalaryAll.json();
      const allSalaries = allSalariesJson.data || [];
      const existingSalary = allSalaries.find(
        (item) =>
          item.user_id === parseInt(id) &&
          item.role?.toLowerCase().replace(/\s+/g, "-") === roleForUrl &&
          normalizeDate(item.payment_date) === normalizedPaymentDate
      );

      console.log("🧪 DEBUG: ALL SALARIES", allSalaries);
      console.log("🧪 DEBUG: Looking for user_id", parseInt(id));
      console.log("🧪 DEBUG: roleForData", roleForData);
      console.log("🧪 DEBUG: normalizedPaymentDate", normalizedPaymentDate);
      console.log("🧪 DEBUG: Ditemukan?", existingSalary);

      let total = 0;

      if (matchRole(roleForData, "driver")) {
        total = filteredData.reduce((acc, cur) => {
          const pemasukan = (cur.package?.price || 0) + (cur.bonus_driver || 0);
          const potongan =
            (cur.package?.kas || 0) +
            (cur.package?.operasional || 0) +
            (cur.referral_cut || 0) +
            (cur.owner_share || 0);
          return acc + (pemasukan - potongan);
        }, 0);
      } else if (matchRole(roleForData, "owner")) {
        total = filteredData.reduce(
          (acc, cur) => acc + (cur.owner_share || 0),
          0
        );
      } else if (matchRole(roleForData, "front-office")) {
        total = filteredData.reduce(
          (acc, cur) => acc + (cur.total_fo_share || 0),
          0
        );
      }

      if (existingSalary) {
        setStatus("Sudah");
        setTotalGaji(total);
      } else {
        setStatus("Belum");
        setTotalGaji(total);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const getNamaByRole = (detail, role) => {
    switch (role.toLowerCase()) {
      case "driver":
        return detail.driver_name;
      case "owner":
        return detail.owner_name;
      case "front-office":
        return detail.name;
      default:
        return "Tidak diketahui";
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const param = url.searchParams.get("payment_date");

      if (param) {
        setPaymentDate(param);
        setTanggal(param);
      }
    }
  }, []);

  useEffect(() => {
    if (id && role && payment_date && !isNaN(new Date(payment_date))) {
      fetchGajiDetail();
    }
  }, [id, role, payment_date]);

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
    const normalizedRole = decodeURIComponent(role)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    switch (normalizedRole) {
      case "driver":
        user_id = selected.driver_id;
        break;
      case "owner":
        user_id = selected.owner_id;
        break;
      case "front-office":
        user_id = selected.user_id;
        break;
      default:
        console.error("Role tidak valid:", normalizedRole);
        break;
    }

    if (!user_id) {
      console.error("user_id tidak ditemukan untuk role:", role);
      setLoading(false);
      return;
    }

    // ✅ GANTI LOGIKA validSalaries DI SINI:
    let validSalaries = [];

    if (normalizedRole === "front-office") {
      const total_fo_share = data.reduce(
        (acc, item) => acc + (item.total_fo_share || 0),
        0
      );

      if (data.length > 0) {
        const first = data[0]; // ambil satu sample
        validSalaries = [
          {
            user_id: first.user_id,
            ticketing_id: first.ticketing_id,
            nama: first.name,
            role: "Front Office",
            no_lambung: "",
            kas: 0,
            operasional: 0,
            salarie: total_fo_share,
            total_salary: total_fo_share,
            payment_date: tanggal,
          },
        ];
      }
    } else {
      validSalaries = data
        .map((item) => {
          let user_id, nama, roleName;

          if (normalizedRole === "driver") {
            user_id = item.driver_id;
            nama = item.driver_name;
            roleName = item.driver_role || "Driver";
          } else if (normalizedRole === "owner") {
            user_id = item.owner_id;
            nama = item.owner_name;
            roleName = "Owner";
          }

          return {
            user_id,
            ticketing_id: item.ticketing_id,
            nama,
            role: roleName,
            no_lambung: item.no_lambung || "",
            kas: item.package?.kas || 0,
            operasional: item.package?.operasional || 0,
            salarie:
              normalizedRole === "driver"
                ? item.driver_share || 0
                : item.owner_share || 0,
            total_salary: item.net || 0,
            payment_date: tanggal,
          };
        })
        .filter(
          (item) =>
            item.user_id &&
            item.ticketing_id &&
            item.payment_date &&
            item.total_salary !== 0
        );
    }

    const payload = { salaries: validSalaries };
    const token = localStorage.getItem("access_token");
    const endpoint = `https://tpapi.siunjaya.id/api/salary/store/${user_id}/${normalizedRole}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Status berhasil disimpan:", responseData);

        setStatus("Sudah");
        const statusKey = `${user_id}-${normalizedRole}-${payment_date}`;
        localStorage.setItem("statusUpdated", statusKey);
        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          fetchGajiDetail();
        }, 800);
      } else {
        const errorText = await response.text();
        console.error("❌ Gagal update status:", errorText);
      }
    } catch (error) {
      console.error("❌ Error saat simpan:", error);
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

    const normalizedRole = decodeURIComponent(role).trim().toLowerCase();

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
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
              Gaji Owner
            </div>
            <div className="p-4 text-sm space-y-2">
              {data.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{`Paket ${item.package?.slug.split("-")[1]}`}</span>
                  <span>{`Rp ${item.owner_share?.toLocaleString("id-ID")}`}</span>
                </div>
              ))}
              <div className="mt-4 font-bold flex justify-between border-t pt-2">
                <span>Total Jumlah Gaji:</span>
                <span>{formatRupiah(totalGaji)}</span>
              </div>
            </div>
          </div>
        );

      case "front office":
        return (
          <div className="border border-gray-300 rounded-md p-4">
            <h2 className="bg-blue-600 text-white px-4 py-2 font-semibold">
              Gaji Front Office
            </h2>
            <div className="p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Gaji Bulanan</span>
                <span>{formatRupiah(totalGaji)}</span>
              </div>
              <div className="mt-4 font-bold flex justify-between border-t pt-2">
                <span>Total Jumlah Gaji</span>
                <span>{formatRupiah(totalGaji)}</span>
              </div>
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
              Posisi:{" "}
              <span className="font-semibold">{decodeURIComponent(role)}</span>
            </div>
            <div>
              Status: <span className="font-semibold">{status}</span>
            </div>
          </div>
          <div className="border-b-4 border-blue-500 mt-4"></div>

          {renderGajiByRole()}
          <div className="flex justify-end mt-4 gap-4">
            {isBelum && (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Ubah Status
              </button>
            )}
            <button
              onClick={() => !isBelum && setShowSlipModal(true)}
              disabled={isBelum}
              title={
                isBelum ? "Harap klik tombol 'Terbayarkan' terlebih dahulu" : ""
              }
              className={`px-4 py-2 rounded transition-all duration-200 ${
                isBelum
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Cetak
            </button>
          </div>

          {showSlipModal && (
            <SlipGajiModal
              onClose={() => setShowSlipModal(false)}
              nama={nama}
              tanggal={tanggal}
              role={role}
              totalGaji={totalGaji}
              data={data}
            />
          )}

          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">Konfirmasi</h2>
                <p className="mb-6">
                  Apakah Anda yakin ingin mengubah status menjadi{" "}
                  <strong>'Sudah Terbayar'</strong>?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      handleTerbayarkan();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
