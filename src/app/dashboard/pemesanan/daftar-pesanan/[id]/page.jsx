"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar.jsx";
// Hapus UserMenu jika tidak digunakan di halaman ini
// import UserMenu from "/components/Pengguna.jsx"; 
import withAuth from "/src/app/lib/withAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hashids from "hashids"; // <-- 1. TAMBAHKAN INI

const DetailPemesanan = () => {
  const router = useRouter();
  const { id: encodedId } = useParams(); // Ganti nama `id` agar lebih jelas
  const [pesanan, setPesanan] = useState(null);
  const [originalBookingId, setOriginalBookingId] = useState(null); // State untuk simpan ID asli
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // <-- 2. Inisialisasi Hashids (pastikan secret sama dengan halaman sebelumnya)
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);

  useEffect(() => {
    if (!encodedId) return;

    // --- DEKODE ID ---
    const decodedArr = hashids.decode(encodedId);
    if (decodedArr.length === 0) {
      toast.error("ID Pesanan tidak valid.");
      return;
    }
    const bookingId = decodedArr[0]; // Ambil ID asli (angka)
    setOriginalBookingId(bookingId); // Simpan ID asli untuk fungsi save

    const fetchDetail = async () => {
      try {
        // Gunakan ID yang sudah di-dekode
        const res = await fetch(`https://tpapi.siunjaya.id/api/bookings/${bookingId}`);
        if (!res.ok) {
           throw new Error('Data pesanan tidak ditemukan');
        }
        const data = await res.json();

        // Logika status pembayaran Anda sudah bagus
        let statusPembayaran = "Belum Lunas";
        if (data.payment_status === "paid") {
          statusPembayaran = "Sudah Bayar";
        } else if (data.payment_status === "unpaid" && data.payment_type === "dp") {
          statusPembayaran = "DP 30%";
        }

        // Set state dengan data dari API
        setPesanan({
          nama: data.customer_name || "-",
          email: data.customer_email || "-",
          phone: data.customer_phone || "-",
          waktupemesanan: data.start_time || "-",
          tanggaltour: data.tour_date || "-",
          statuspembayaran: statusPembayaran,
          // Data read-only
          bookingCode: data.order_id || "-",
          jenispaket: data.package?.package_name || "-",
          jumlahpesanan: data.qty || 0,
          kodeReferral: data.referral || "-",
          kodeVoucher: data.voucher || "-",
        });

      } catch (error) {
        console.error("Gagal mengambil detail pesanan:", error);
        toast.error(error.message || "Gagal memuat detail pemesanan.");
      }
    };

    fetchDetail();
  }, [encodedId]); // dependency array tetap

  // <-- 3. MODIFIKASI FUNGSI SIMPAN
  const handleSave = async () => {
    if (!pesanan || !originalBookingId) return;

    // Konversi status pembayaran kembali ke format API
    let payment_status = "unpaid"; // default
    let payment_type = "full"; // default
    if (pesanan.statuspembayaran === "Sudah Bayar") {
      payment_status = "paid";
    } else if (pesanan.statuspembayaran === "DP 30%") {
      payment_type = "dp";
    }

    // Siapkan data (payload) untuk dikirim ke API
    const payload = {
      customer_name: pesanan.nama,
      customer_email: pesanan.email,
      customer_phone: pesanan.phone,
      start_time: pesanan.waktupemesanan,
      tour_date: pesanan.tanggaltour,
      payment_status: payment_status,
      payment_type: payment_type
    };

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`https://tpapi.siunjaya.id/api/bookings/${originalBookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan perubahan.");
      }

      toast.success("Perubahan berhasil disimpan!");
      setTimeout(() => {
        router.push("/dashboard/pemesanan/daftar-pesanan");
      }, 1500);

    } catch (error) {
      console.error("Error saat menyimpan:", error);
      toast.error(error.message);
    }
  };

  if (!pesanan) {
    return (
      <div className="flex items-center justify-center h-screen">
        Memuat data...
      </div>
    );
  }

  // --- TIDAK ADA PERUBAHAN PADA TAMPILAN (RETURN JSX) ---
  return (
    <div className="flex justify-between items-start min-h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarOpen ? 290 : 70 }}
      ></div>
      <div className="flex-1 p-6">
        <ToastContainer autoClose={1500} hideProgressBar />
        <button
          onClick={() => router.push("/dashboard/pemesanan/daftar-pesanan")}
          className="flex items-center text-black hover:text-black mb-6 cursor-pointer"
        >
          <ArrowLeft className="mr-2 cursor-pointer" size={20} />
          Kembali ke Daftar Pesanan
        </button>
        <h1 className="text-3xl font-bold mb-6 text-black">Detail Pemesanan</h1>
        <h3 className="text-lg font-semibold mb-4 text-gray-500">
          Booking Code: {pesanan.bookingCode}
        </h3>
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-full max-h-[65vh] overflow-y-auto">
          {/* Input fields tidak diubah */}
          <InputField label="Nama" value={pesanan.nama} onChange={(v) => setPesanan({ ...pesanan, nama: v })} />
          <InputField label="Email" value={pesanan.email} onChange={(v) => setPesanan({ ...pesanan, email: v })} />
          <InputField label="No. HP" value={pesanan.phone} onChange={(v) => setPesanan({ ...pesanan, phone: v })} />
          <InputField
            label="Waktu Pemesanan"
            value={pesanan.waktupemesanan}
            onChange={(v) => setPesanan({ ...pesanan, waktupemesanan: v })}
            type="time"
          />
          <InputField label="Jenis Paket" value={pesanan.jenispaket} readOnly />
          <SelectField
            label="Status Pembayaran"
            value={pesanan.statuspembayaran}
            options={["Sudah Bayar", "DP 30%", "Belum Lunas"]}
            onChange={(v) => setPesanan({ ...pesanan, statuspembayaran: v })}
          />
          <InputField
            label="Tanggal Tour"
            value={pesanan.tanggaltour}
            onChange={(v) => setPesanan({ ...pesanan, tanggaltour: v })}
            type="date"
            min={new Date().toISOString().split("T")[0]}
          />
          <InputField label="Jumlah Pesanan" value={pesanan.jumlahpesanan} readOnly />
          <InputField label="Kode Referral" value={pesanan.kodeReferral} readOnly />
          <InputField label="Kode Voucher" value={pesanan.kodeVoucher} readOnly />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#3D6CB9] text-white rounded-md hover:bg-blue-700"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN INPUT TIDAK DIUBAH ---
const InputField = ({ label, value, onChange, readOnly = false, type = "text", min }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`mt-1 w-full p-2 border rounded-md ${readOnly ? "bg-gray-200" : "bg-white"}`}
      readOnly={readOnly}
      min={min}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full p-2 border rounded-md bg-white"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default withAuth(DetailPemesanan);