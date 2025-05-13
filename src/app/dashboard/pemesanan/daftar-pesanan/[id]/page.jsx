"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dummy data untuk sementara
const dummyData = [
  {
    id: 1,
    bookingCode: "JTP001",
    nama: "Bunde",
    email: "baragajul@gmail.com",
    phone: "081234567890",
    waktupemesanan: "2025-01-12",
    jenispaket: "Paket 2",
    statuspembayaran: "Sudah Bayar",
    waktutour: "13:00",
    tanggaltour: "2025-01-18",
    jumlahpesanan: 1,
    kodeReffeal: "", // Menambahkan kodeReffeal
    kodeVoucher: "", // Menambahkan kodeVoucher
  },
];

const DetailPemesanan = () => {
  const router = useRouter();
  const { id } = useParams();

  const [pesanan, setPesanan] = useState({
    bookingCode: "",
    nama: "",
    email: "",
    phone: "",
    waktupemesanan: "",
    jenispaket: "",
    statuspembayaran: "",
    waktutour: "",
    tanggaltour: "",
    jumlahpesanan: "",
    kodeReffeal: "",
    kodeVoucher: "",
  });

  useEffect(() => {
    if (id) {
      const data = dummyData.find((item) => item.id === parseInt(id, 10));
      setPesanan(data || {
        bookingCode: "",
        nama: "",
        email: "",
        phone: "",
        waktupemesanan: "",
        jenispaket: "",
        statuspembayaran: "",
        waktutour: "",
        tanggaltour: "",
        jumlahpesanan: "",
        kodeReffeal: "",
        kodeVoucher: "",
      });
    }
  }, [id]);

  const handleSave = () => {
    const storedData = JSON.parse(localStorage.getItem("dataPemesanan")) || [];
    const updatedData = storedData.map((item) =>
      item.id === pesanan.id ? pesanan : item
    );
    localStorage.setItem("dataPemesanan", JSON.stringify(updatedData));

    toast.success("Data berhasil diperbaharui!");
    setTimeout(() => {
      router.push("/dashboard/pemesanan/daftar-pesanan");
    }, 3000);
  };

  if (!pesanan) return null;

  return (
    <div className="flex justify-between items-start min-h-screen">
      <UserMenu />
      <Sidebar />
      <div className="flex-1 p-6">
        <ToastContainer />
        <button
          onClick={() => router.push("/dashboard/pemesanan/daftar-pesanan")}
          className="flex items-center text-black hover:text-black mb-6 cursor-pointer"
        >
          <ArrowLeft className="mr-2" size={20} />
          Kembali ke Daftar Pesanan
        </button>

        <h1 className="text-3xl font-bold mb-6 text-black">Detail Pemesanan</h1>
        <h3 className="text-lg font-semibold mb-4 text-gray-500">
          Booking Code: {pesanan.bookingCode}
        </h3>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-full max-h-[65vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={pesanan.nama}
              onChange={(e) =>
                setPesanan({ ...pesanan, nama: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={pesanan.email}
              onChange={(e) =>
                setPesanan({ ...pesanan, email: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">No. HP</label>
            <input
              type="text"
              value={pesanan.phone}
              onChange={(e) =>
                setPesanan({ ...pesanan, phone: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 cursor-pointer">Waktu Pemesanan</label>
            <input
              type="date"
              value={pesanan.waktupemesanan}
              onChange={(e) =>
                setPesanan({ ...pesanan, waktupemesanan: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Jenis Paket</label>
            <select
              value={pesanan.jenispaket}
              onChange={(e) =>
                setPesanan({ ...pesanan, jenispaket: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md cursor-pointer"
            >
              <option value="Paket 1">Paket 1</option>
              <option value="Paket 2">Paket 2</option>
              <option value="Paket 3">Paket 3</option>
              <option value="Paket 4">Paket 4</option>
              <option value="Paket 5">Paket 5</option>
              <option value="Paket Sunrise">Paket Sunrise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Tour</label>
            <input
              type="date"
              value={pesanan.tanggaltour}
              onChange={(e) =>
                setPesanan({ ...pesanan, tanggaltour: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status Pembayaran</label>
            <select
              value={pesanan.statuspembayaran}
              onChange={(e) =>
                setPesanan({ ...pesanan, statuspembayaran: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md cursor-pointer"
            >
              <option value="Sudah Bayar">Sudah Bayar</option>
              <option value="DP 50%">DP 50%</option>
            </select>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700">Waktu Tour</label>
            <input
            type="time"
            value={pesanan.waktutour}
            onChange={(e) =>
              setPesanan({ ...pesanan, waktutour: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Jumlah Pesanan</label>
            <input
              type="text"
              value={pesanan.jumlahpesanan}
              readOnly
              className="mt-1 w-full p-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kode Referral</label>
            <input
              type="text"
              value={pesanan.kodeReffeal}
              readOnly
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kode Voucher</label>
            <input
              type="text"
              value={pesanan.kodeVoucher}
              readOnly
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#3D6CB9] text-white rounded-md hover:bg-[#3D6CB9] cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DetailPemesanan);
