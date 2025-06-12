"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar"; // Import sidebar
//import SlipGaji from "/components/SlipGaji";
import SlipGajiModal from "/components/SlipGaji";
import Hashids from "hashids";

export default function GajiCatatPage() {
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
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
  const [payment_date, setPaymentDate] = useState("");
  //const payment_date = searchParams.get("payment_date");

  const fetchGajiDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch data previews untuk mapping ticketing_id ⇄ payment_date
      const resPreview = await fetch(
        "http://localhost:8000/api/salary/previews"
      );
      const previewJson = await resPreview.json();

      // 2. Ambil semua ticketing_id yang milik user & role & tanggal yang sesuai
      const ticketingIDs = previewJson.previews
        .filter(
          (item) =>
            item.user_id === parseInt(id) &&
            item.role.toLowerCase() === role.toLowerCase() &&
            item.payment_date?.slice(0, 10) === payment_date
        )
        .map((item) => item.ticketing_id);

      //console.log("🎯 Ticketing ID untuk tanggal ini:", ticketingIDs);

      // 3. Fetch detail dari endpoint preview/:id/:role
      let endpoint = "";
      if (role.toLowerCase() === "driver") {
        endpoint = `http://localhost:8000/api/salary/preview/${id}/driver`;
      } else if (role.toLowerCase() === "owner") {
        endpoint = `http://localhost:8000/api/salary/preview/${id}/owner`;
      } else if (role.toLowerCase() === "front office") {
        `http://localhost:8000/api/salary/preview/${id}/fron office`;
      } else {
        throw new Error("Role tidak dikenali");
      }

      const resDetail = await fetch(endpoint);
      const json = await resDetail.json();
      const allData = json.data || [];

      // 4. Filter data detail berdasarkan ticketing_id
      const filteredData = allData.filter((item) =>
        ticketingIDs.includes(item.ticketing_id)
      );

      setData(filteredData);

      // 5. Set nama dari data pertama
      if (filteredData.length > 0) {
        setNama(getNamaByRole(filteredData[0], role));
      }

      // 6. Fetch salary/all untuk cek status gaji
      const resSalaryAll = await fetch("http://localhost:8000/api/salary/all");
      const allSalariesJson = await resSalaryAll.json();
      const allSalaries = allSalariesJson.data || [];

      const existingSalary = allSalaries.find(
        (item) =>
          item.user_id === parseInt(id) &&
          item.role.toLowerCase() === role.toLowerCase() &&
          item.payment_date?.slice(0, 10) === payment_date
      );

      if (existingSalary) {
        setStatus("Sudah");
        setTotalGaji(existingSalary.total_salary || 0);
      } else {
        setStatus("Belum");

        const total = filteredData.reduce((acc, cur) => {
          if (role.toLowerCase() === "driver")
            return acc + (cur.driver_share || 0);
          if (role.toLowerCase() === "owner")
            return acc + (cur.owner_share || 0);
          if (role.toLowerCase() === "front office")
            return acc + (cur.front_office_share || 0);
          return acc;
        }, 0);

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
      case "fron office":
        return detail.name; // contoh, sesuaikan
      default:
        return "Tidak diketahui";
    }
  };

  //useEffect(() => {
  //  fetchGajiDetail();
  //  //fetchTanggalGaji();
  //  if (payment_date) {
  //    setTanggal(payment_date);
  //  }
  //}, [id, role, payment_date]);

  useEffect(() => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const param = url.searchParams.get("payment_date");
    setPaymentDate(param || "");
    setTanggal(param || ""); // langsung set tanggal di sini
  }
}, []);


  useEffect(() => {
  if (id && role && payment_date) {
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

    //console.log(
    //  "✅ Terbayarkan diklik, statusUpdated diset:",
    //  `${user_id}-${role}-${payment_date}`
    //);

    const normalizedRole = role?.trim().toLowerCase();

    const validSalaries = data
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
        } else if (normalizedRole === "fron office") {
          user_id = item.front_office_id;
          nama = item.front_office_name;
          roleName = "Front Office";
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
              : normalizedRole === "owner"
                ? item.owner_share || 0
                : item.front_office_share || 0,
          total_salary: item.net || 0,
          payment_date: tanggal,
        };
      })
      .filter(
        (item) =>
          item.user_id &&
          item.ticketing_id &&
          item.payment_date &&
          item.total_salary !== 0 // ⬅️ Bisa dihapus jika tidak wajib
      );

    const payload = { salaries: validSalaries };

    const endpoint = `http://localhost:8000/api/salary/store/${user_id}/${role.toLowerCase()}`;
    //console.log("Mengirim data ke endpoint:", endpoint);
    //console.log("Payload:", payload);

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
        //console.log("Berhasil mengubah status:", responseData);
        setStatus("Sudah");

        const statusKey = `${user_id}-${role.toLowerCase()}-${payment_date}`;
        localStorage.setItem("statusUpdated", statusKey);
        window.dispatchEvent(new Event("storage")); // ✅ Paksa trigger ke tab lain tanpa reload
        //console.log("✅ Disimpan ke localStorage:", statusKey);
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
            {isBelum && (
              <button
                onClick={handleTerbayarkan}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Terbayarkan
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
            {/*<button
              onClick={() => setShowSlipModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Cetak
            </button>*/}
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

          {/*{showSlipModal && (
            <SlipGaji
              onClose={() => setShowSlipModal(false)}
              nama={nama}
              tanggal={tanggal}
              role={role}
              totalGaji={totalGaji}
              data={data}
            />
          )}*/}
        </div>
      </div>
    </div>
  );
}
