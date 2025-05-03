"use client";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";

const dummyData = [
  {
    id: 1,
    bookingCode: "JTP001",
    nama: "Bunde",
    email: "baragajul@gmail.com",
    phone: "081234567890",
    waktupemesanan: "12 Januari 2025",
    jenispaket: "Paket 2",
    statuspembayaran: "Sudah Bayar",
    tanggaltour: "18 Januari 2025",
    jumlahpesanan: 1,
  },
  {
    id: 2,
    bookingCode: "JTP002",
    nama: "Zimut",
    email: "zimut@gmail.com",
    phone: "089876543210",
    waktupemesanan: "12 Januari 2025",
    jenispaket: "Paket 1",
    statuspembayaran: "Sudah Bayar",
    tanggaltour: "25 Januari 2025",
    jumlahpesanan: 2,
  },
  {
    id: 3,
    bookingCode: "JTP003",
    nama: "Naon Maneh",
    email: "manehnaon@gmail.com",
    phone: "081234567890",
    waktupemesanan: "15 Januari 2025",
    jenispaket: "Paket 3",
    statuspembayaran: "DP 50%",
    tanggaltour: "25 Januari 2025",
    jumlahpesanan: 1,
  },
  {
    id: 4,
    bookingCode: "JTP004",
    nama: "Maneh Saha",
    email: "sahamaneh@gmail.com",
    phone: "089876543210",
    waktupemesanan: "15 Januari 2025",
    jenispaket: "Paket 1",
    statuspembayaran: "DP 50%",
    tanggaltour: "27 Januari 2025",
    jumlahpesanan: 1,
  },
];

const DetailPesanan = () => {
  const { id } = useParams();
  const router = useRouter();

  const data = dummyData.find((item) => item.id === parseInt(id));

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Data tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm text-black hover:underline"
        >
          ← Kembali
        </button>

        <h1 className="text-4xl font-semibold mb-4 text-black">
          Detail Pesanan
        </h1>
        <p className="text-lg text-gray-500 font-regular mt-0 leading-tight">
          #{data.bookingCode}
        </p>
        

        <div className="bg-white rounded-xl shadow-lg p-10 space-y-4 ">
          <div><strong>Nama:</strong> {data.nama}</div>
          <div><strong>Email:</strong> {data.email}</div>
          <div><strong>No. HP:</strong> {data.phone}</div>
          <div><strong>Waktu Pemesanan:</strong> {data.waktupemesanan}</div>
          <div><strong>Paket:</strong> {data.jenispaket}</div>
          <div><strong>Status Pembayaran:</strong> {data.statuspembayaran}</div>
          <div><strong>Tanggal Tour:</strong> {data.tanggaltour}</div>
          <div><strong>Jumlah Pemesanan:</strong> {data.jumlahpesanan}</div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DetailPesanan);
