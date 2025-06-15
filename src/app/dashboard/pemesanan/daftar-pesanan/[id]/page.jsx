"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar.jsx";
import withAuth from "/src/app/lib/withAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hashids from "hashids";

// KOMPONEN UNTUK SKELETON LOADING
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-6 w-48 bg-gray-300 rounded-md mb-6"></div>
    <div className="h-9 w-1/3 bg-gray-300 rounded-md mb-6"></div>
    <div className="h-5 w-1/4 bg-gray-300 rounded-md mb-4"></div>
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 w-1/5 bg-gray-200 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded-md"></div>
        </div>
      ))}
    </div>
    <div className="flex justify-end mt-4">
      <div className="h-10 w-36 bg-gray-300 rounded-md"></div>
    </div>
  </div>
);

const DetailPemesanan = () => {
  const router = useRouter();
  const { id: encodedId } = useParams();
  
  // States untuk data, UI, dan logika
  const [pesanan, setPesanan] = useState(null);
  const [originalBookingId, setOriginalBookingId] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [originalTourDate, setOriginalTourDate] = useState(null); // State untuk simpan tanggal asli (aturan H-1)

  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);

  useEffect(() => {
    if (!encodedId) return;

    const decodedArr = hashids.decode(encodedId);
    if (decodedArr.length === 0) {
      toast.error("ID Pesanan tidak valid.");
      setLoading(false);
      return;
    }
    const bookingId = decodedArr[0];
    setOriginalBookingId(bookingId);

    const fetchDetail = async () => {
      try {
        const res = await fetch(`https://tpapi.siunjaya.id/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error('Data pesanan tidak ditemukan');
        
        const data = await res.json();

        let statusPembayaran = "Belum Lunas";
        if (data.payment_status === "paid") statusPembayaran = "Sudah Bayar";
        else if (data.payment_status === "unpaid" && data.payment_type === "dp") statusPembayaran = "DP 50%";

        setPesanan({
          nama: data.customer_name || "-",
          email: data.customer_email || "-",
          phone: data.customer_phone || "-",
          waktupemesanan: data.start_time || "-",
          tanggaltour: data.tour_date || "-",
          statuspembayaran: statusPembayaran,
          bookingCode: data.order_id || "-",
          jenispaket: data.package?.package_name || "-",
          jumlahpesanan: data.qty || 0,
          kodeReferral: data.referral || "-",
          kodeVoucher: data.voucher || "-",
        });
        
        // Simpan tanggal tour asli untuk logika H-1
        setOriginalTourDate(data.tour_date);

      } catch (error) {
        console.error("Gagal mengambil detail pesanan:", error);
        toast.error(error.message || "Gagal memuat detail pemesanan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [encodedId]);

  // Logika untuk mengunci input tanggal berdasarkan aturan H-1
  let isDateLocked = true;
  if (originalTourDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tourDate = new Date(originalTourDate);
    tourDate.setHours(0, 0, 0, 0);
    const lockDate = new Date(tourDate);
    lockDate.setDate(tourDate.getDate() - 1);
    isDateLocked = today >= lockDate;
  }
  
  const handleSave = async () => {
    // 1. Pastikan data sudah siap sebelum menyimpan
    if (!pesanan || !originalBookingId) {
      toast.error("Data pesanan belum siap.");
      return;
    }

    // 2. Konversi status pembayaran dari teks (di UI) ke format yang dimengerti API
    let payment_status = "unpaid"; // Default
    let payment_type = "full";   // Default

    if (pesanan.statuspembayaran === "Sudah Bayar") {
      payment_status = "paid";
    } else if (pesanan.statuspembayaran === "DP 50%") { // Disesuaikan dengan pilihan baru Anda
      payment_status = "unpaid";
      payment_type = "dp";
    }
    // Jika "Belum Lunas", maka akan menggunakan nilai default di atas.

    // 3. Siapkan data (payload) yang akan dikirim ke API
    const payload = {
      customer_email: pesanan.email,
      customer_phone: pesanan.phone,
      tour_date: pesanan.tanggaltour,
      payment_status: payment_status,
      payment_type: payment_type,
      // Catatan: field lain yang readOnly seperti nama & waktu pemesanan tidak perlu dikirim
      // jika API tidak mengharapkannya saat update.
    };

    // 4. Kirim data ke API menggunakan metode PUT
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Sesi Anda telah berakhir, silakan login kembali.");
        return;
      }
      
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
        // Tampilkan pesan error dari API jika ada
        throw new Error(errorData.message || "Gagal menyimpan perubahan.");
      }

      // 5. Tampilkan notifikasi sukses dan arahkan kembali ke halaman daftar
      toast.success("Perubahan berhasil disimpan!");
      setTimeout(() => {
        router.push("/dashboard/pemesanan/daftar-pesanan");
      }, 1500);

    } catch (error) {
      console.error("Error saat menyimpan:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-between items-start min-h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarOpen ? 290 : 70 }}
      ></div>
      <div className="flex-1 p-6">
        <ToastContainer autoClose={1500} hideProgressBar />
        {loading ? (
          <SkeletonLoader />
        ) : !pesanan ? (
          <div className="text-center text-gray-500 mt-10">
            Gagal memuat data pesanan atau data tidak ditemukan.
          </div>
        ) : (
          <>
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
              
              <InputField label="Nama" value={pesanan.nama} onChange={(v) => setPesanan({ ...pesanan, nama: v })} readOnly />
              <InputField label="Email" value={pesanan.email} onChange={(v) => setPesanan({ ...pesanan, email: v })} />
              <InputField label="No. HP" value={pesanan.phone} onChange={(v) => setPesanan({ ...pesanan, phone: v })} />
              <InputField label="Waktu Pemesanan" value={pesanan.waktupemesanan} onChange={(v) => setPesanan({ ...pesanan, waktupemesanan: v })} type="time" readOnly />
              <InputField label="Jenis Paket" value={pesanan.jenispaket} readOnly />
              <SelectField label="Status Pembayaran" value={pesanan.statuspembayaran} options={["Sudah Bayar", "DP 50%", "Belum Lunas"]} onChange={(v) => setPesanan({ ...pesanan, statuspembayaran: v })} />
              
              {/* --- BAGIAN TANGGAL TOUR DENGAN LOGIKA BARU --- */}
              <InputField
                label="Tanggal Tour"
                value={pesanan.tanggaltour}
                onChange={(v) => setPesanan({ ...pesanan, tanggaltour: v })}
                type="date"
                readOnly={isDateLocked}
              />
              {isDateLocked && originalTourDate && (
                <div className="flex items-center gap-2 mt-1 px-1 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v3a1 1 0 11-2 0v-3zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  <span>Tanggal tour tidak bisa diubah karena sudah melewati batas waktu (H-1).</span>
                </div>
              )}
              {/* --- AKHIR BAGIAN TANGGAL TOUR --- */}
              
              <InputField label="Jumlah Pesanan" value={pesanan.jumlahpesanan} readOnly />
              <InputField label="Kode Referral" value={pesanan.kodeReferral} readOnly />
              <InputField label="Kode Voucher" value={pesanan.kodeVoucher} readOnly />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleSave} className="px-4 py-2 bg-[#3D6CB9] text-white rounded-md hover:bg-blue-700 cursor-pointer">
                Simpan Perubahan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Komponen helper (tidak ada perubahan)
const InputField = ({ label, value, onChange, readOnly = false, type = "text", min }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`mt-1 w-full p-2 border rounded-md ${readOnly ? "bg-gray-200 cursor-not-allowed" : "bg-white"}`}
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