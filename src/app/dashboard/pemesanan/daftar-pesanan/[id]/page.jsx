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

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/bookings/${id}`);
        const data = await res.json();

        const statusPembayaran =
          data.payment_status === "paid"
            ? "Sudah Bayar"
            : data.payment_type === "dp"
            ? "DP 50%"
            : "Belum Bayar";

        setPesanan({
          bookingCode: data.order_id,
          nama: data.customer_name,
          email: data.customer_email,
          phone: data.customer_phone,
          waktupemesanan: data.created_at.slice(0, 10), // format YYYY-MM-DD
          jenispaket: data.package?.package_name || "-",
          statuspembayaran: statusPembayaran,
          tanggaltour: data.tour_date,
          jumlahpesanan: data.qty,
          kodeReffeal: data.referral || "",
          kodeVoucher: data.voucher || "",
        });
      } catch (error) {
        console.error("Gagal mengambil detail pesanan:", error);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleSave = () => {
    toast.success("Perubahan berhasil disimpan (simulasi)");
    setTimeout(() => {
      router.push("/dashboard/pemesanan/daftar-pesanan");
    }, 2000);
  };

  if (!pesanan) return <div className="p-6">Memuat data...</div>;

  return (
    <div className="flex justify-between items-start min-h-screen">
      <UserMenu />
      <Sidebar />
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
          <InputField label="Waktu Pemesanan" value={pesanan.waktupemesanan} onChange={(v) => setPesanan({ ...pesanan, waktupemesanan: v })} type="date" />
          <InputField label="Jenis Paket" value={pesanan.jenispaket} readOnly />
          <SelectField
            label="Status Pembayaran"
            value={pesanan.statuspembayaran}
            options={["Sudah Bayar", "DP 50%", "Belum Bayar"]}
            onChange={(v) => setPesanan({ ...pesanan, statuspembayaran: v })}
          />
          <InputField label="Tanggal Tour" value={pesanan.tanggaltour} onChange={(v) => setPesanan({ ...pesanan, tanggaltour: v })} type="date" />
          <InputField label="Jumlah Pesanan" value={pesanan.jumlahpesanan} readOnly />
          <InputField label="Kode Referral" value={pesanan.kodeReffeal} onChange={(v) => setPesanan({ ...pesanan, kodeReffeal: v })} />
          <InputField label="Kode Voucher" value={pesanan.kodeVoucher} onChange={(v) => setPesanan({ ...pesanan, kodeVoucher: v })} />
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

const InputField = ({ label, value, onChange, readOnly = false, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="mt-1 w-full p-2 border rounded-md bg-gray-100"
      readOnly={readOnly}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full p-2 border rounded-md"
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
