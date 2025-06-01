"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailPemesanan = () => {
  const router = useRouter();
  const { id } = useParams();
  const [pesanan, setPesanan] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/bookings/${id}`);
        const data = await res.json();

        let statusPembayaran = "Belum Bayar";
        if (data.payment_status === "paid") {
          statusPembayaran = "Sudah Bayar";
        } else if (data.payment_type === "dp") {
          statusPembayaran = "DP 30%";
        }

        setPesanan({
          bookingCode: data.order_id || "-",
          nama: data.customer_name || "-",
          email: data.customer_email || "-",
          phone: data.customer_phone || "-",
          waktupemesanan: data.start_time || "-",
          jenispaket: data.package?.package_name || "-",
          statuspembayaran: statusPembayaran,
          tanggaltour: data.tour_date || "-",
          jumlahpesanan: data.qty || 0,
          kodeReferral: data.referral || "-",
          kodeVoucher: data.voucher || "-",
        });
      } catch (error) {
        console.error("Gagal mengambil detail pesanan:", error);
        toast.error("Gagal memuat detail pemesanan.");
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleSave = () => {
    toast.success("Perubahan berhasil disimpan");
    setTimeout(() => {
      router.push("/dashboard/pemesanan/daftar-pesanan");
    }, 2000);
  };

  if (!pesanan) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="flex justify-between items-start min-h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="transition-all duration-300 ease-in-out"
        style={{
        marginLeft: isSidebarOpen ? 290 : 70,
        }}>
     </div>
      <div className="flex-1 p-6">
        <ToastContainer />
        <button
          onClick={() => router.push("/dashboard/pemesanan/daftar-pesanan")}
          className="flex items-center text-black hover:text-black mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Kembali ke Daftar Pesanan
        </button>

        <h1 className="text-3xl font-bold mb-6 text-black">Detail Pemesanan</h1>
        <h3 className="text-lg font-semibold mb-4 text-gray-500">
          Booking Code: {pesanan.bookingCode}
        </h3>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-full max-h-[65vh] overflow-y-auto">
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
            options={["Sudah Bayar", "DP 30%", "Belum Bayar"]}
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