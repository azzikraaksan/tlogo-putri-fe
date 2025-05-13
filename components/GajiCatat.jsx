"use client";
import { useState } from "react";
import { useRouter,useParams, useSearchParams } from "next/navigation";
import { CircleArrowLeft,Calendar } from "lucide-react";

//const CatatGaji = ({ onKembali, role }) => {
//  const router = useRouter();
//  const [selectedDate, setSelectedDate] = useState(new Date());
//  const [paketData, setPaketData] = useState({});
//  const [diskon, setDiskon] = useState(0);

//  const paketHarga = {
//    1: 400000,
//    2: 450000,
//    3: 450000,
//    4: 500000,
//    5: 550000,
//    6: 550000,
//  };

//  const potongan = {
//    1: { induk: [30, 35], rn: [50, 30, 30], op: [30, 25, 25] },
//    2: { induk: [35, 40], rn: [50, 30, 30], op: [30, 25, 25] },
//    3: { induk: [35, 40], rn: [50, 30, 30], op: [30, 25, 25] },
//    4: { induk: [35, 40], rn: [50, 30, 30], op: [30, 25, 25] },
//    5: { induk: [40, 45], rn: [50, 30, 30], op: [30, 25, 25] },
//    6: { induk: [40, 45], rn: [50, 30, 30], op: [30, 25, 25] },
//  };

//  const umrJogja = 2270000;

//  const handleChangeJumlah = (paket, jumlah) => {
//    setPaketData({ ...paketData, [paket]: parseInt(jumlah || 0) });
//  };

//  const handleSimpan = () => {
//    const gajiData = {
//      tanggal: selectedDate.toLocaleDateString(),
//      role,
//      paketData,
//      diskon,
//      totalPenerimaan,
//      bonusMarketing,
//      totalPotongan,
//      gajiAkhir,
//      status: 'Berhasil',
//    };
  
//    // Simpan data ke localStorage sementara (atau ganti dengan context/API sesuai kebutuhan)
//    const existing = JSON.parse(localStorage.getItem('daftarGaji') || '[]');
//    localStorage.setItem('daftarGaji', JSON.stringify([...existing, gajiData]));
  
//    // Kembali ke daftar
//    onKembali();
//  };
  
//  const totalPerhitungan = () => {
//    let totalPenerimaan = 0;
//    let totalPotongan = 0;
//    let bonusMarketing = 0;
//    let potonganOwner = 0;
//    Object.entries(paketData).forEach(([paket, jumlah]) => {
//      const harga = paketHarga[paket];
//      const pot = potongan[paket];
//      const total = harga * jumlah;

//      totalPenerimaan += total;
//      if (role === 'driver') {
//        bonusMarketing += pot.op[0] * jumlah;
//        totalPotongan += (pot.op[1] + pot.op[2]) * jumlah;
//        potonganOwner += total * 0.3;
//      } else if (role === 'owner') {
//        potonganOwner += total * 0.3;
//      }
//    });

//    let totalPot = totalPotongan + potonganOwner + parseInt(diskon || 0);
//    let gajiAkhir = 0;
//    if (role === 'driver') {
//      gajiAkhir = totalPenerimaan + bonusMarketing - totalPot;
//    } else if (role === 'owner') {
//      gajiAkhir = potonganOwner;
//    } else if (role === 'front office') {
//      gajiAkhir = umrJogja;
//    }

//    return {
//      totalPenerimaan,
//      totalPotongan: totalPot,
//      bonusMarketing,
//      gajiAkhir,
//    };
//  };

//  const { totalPenerimaan, totalPotongan, bonusMarketing, gajiAkhir } = totalPerhitungan();

//  return (
//    <div className="flex">
//      <div className="flex-1">
//        <div className="flex items-center gap-2">
//          <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
//          <h1 className="text-[32px] font-semibold">Catat Gaji</h1>
//        </div>

//        <div className="mt-4">
//          <p className="text-sm text-gray-600">Periode Penggajian</p>
//          <p className="mt-2">Periode: {selectedDate.toLocaleDateString()}</p>
//        </div>

//        {(role === 'driver' || role === 'owner') && (
//          <div className="mt-6">
//            {[1, 2, 3, 4, 5, 6].map((paket) => (
//              <div key={paket} className="mb-2">
//                <label className="mr-2">Jumlah Paket {paket}:</label>
//                <input
//                  type="number"
//                  min="0"
//                  className="border rounded px-2 py-1"
//                  value={paketData[paket] || ''}
//                  onChange={(e) => handleChangeJumlah(paket, e.target.value)}
//                />
//              </div>
//            ))}

//            <div className="mt-4">
//              <label className="mr-2">Diskon (Rp):</label>
//              <input
//                type="number"
//                className="border rounded px-2 py-1"
//                value={diskon}
//                onChange={(e) => setDiskon(e.target.value)}
//              />
//            </div>
//          </div>
//        )}

//        <div className="mt-6 border-t pt-4">
//          <p>Total Penerimaan: Rp {totalPenerimaan.toLocaleString()}</p>
//          {role === 'driver' && <p>Bonus Marketing (OP): Rp {bonusMarketing.toLocaleString()}</p>}
//          <p>Total Potongan: Rp {totalPotongan.toLocaleString()}</p>
//          <p className="text-lg font-semibold mt-2">Jumlah Gaji: Rp {gajiAkhir.toLocaleString()}</p>
//        </div>

//        <button
//        onClick={handleSimpan}
//        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition cursor-pointer"
//        >
//        Simpan
//        </button>
//      </div>
//    </div>
//  );
//};

//export default CatatGaji;

export default function GajiCatat({ onKembali, id, role }) {
  const [tanggal, setTanggal] = useState('');
  const router = useRouter();

  const handleDateChange = (e) => {
    setTanggal(e.target.value);
  };

  const handleSimpan = () => {
    // Simulasi penyimpanan dan navigasi kembali
    if (onKembali) {
      onKembali(); // bisa untuk ubah status jadi "Berhasil"
    } else {
      router.push('/dashboard/penggajian/penggajian-utama');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#f1f2f6] rounded-md shadow-md space-y-4">
      <div className="flex items-center gap-2">
        <CircleArrowLeft onClick={onKembali} className="cursor-pointer" />
        <h1 className="text-[32px] font-semibold">Catat Gaji</h1>
      </div>

      {/* Tanggal Gaji */}
      <div>
        <label className="text-gray-600 font-semibold">Periode Penggajian</label>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="w-6 h-6 text-blue-500" />
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-1"
            onChange={handleDateChange}
            value={tanggal}
          />
          {tanggal && (
            <span className="text-gray-700">
              {new Date(tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>

      {/* Identitas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-blue-500 pt-4 text-sm">
        <div>ID Karyawan: <span className="font-semibold">01</span></div>
        <div>Nomor Lambung: <span className="font-semibold">01</span></div>
        <div>ID Karyawan: <span className="font-semibold">10</span></div>
        <div>Nama Owner: <span className="font-semibold">Ramon Ridwan</span></div>
        <div>Nama: <span className="font-semibold">Dudung Hasanudin</span></div>
        <div>Posisi: <span className="font-semibold">Driver</span></div>
      </div>

      {/* Tabel Gaji */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 rounded-md overflow-hidden">
        {/* Penerimaan */}
        <div>
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold">Penerimaan</div>
          <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Paket 1</span><span>Rp 400.000</span></div>
            <div className="flex justify-between"><span>Paket 3</span><span>Rp 405.000</span></div>
            <div className="mt-4 font-medium">Bonus Marketing</div>
            <div className="flex justify-between"><span>Paket 3 (OP)</span><span>Rp 30.000</span></div>
          </div>
        </div>

        {/* Potongan */}
        <div>
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold">Potongan</div>
          <div className="p-4 space-y-2 text-sm">
            <div className="font-medium">Kas</div>
            <div className="flex justify-between"><span>Paket 1</span><span>Rp 65.000</span></div>
            <div className="flex justify-between"><span>Paket 3</span><span>Rp 50.000</span></div>
            <div className="mt-4 font-medium">Diskon</div>
            <div className="flex justify-between"><span>Paket 3 (10%)</span><span>Rp 40.500</span></div>
            <div className="mt-4 font-medium">Owner</div>
            <div className="flex justify-between"><span>Paket 1 (30%)</span><span>Rp 120.000</span></div>
            <div className="flex justify-between"><span>Paket 3 (30%)</span><span>Rp 121.500</span></div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="grid grid-cols-2 text-sm mt-2 border-t">
        <div className="p-2 font-semibold flex justify-between">
          <span>Total Penerimaan</span><span>Rp 835.000</span>
        </div>
        <div className="p-2 font-semibold flex justify-between">
          <span>Total Potongan</span><span>Rp 397.000</span>
        </div>
      </div>

      <div className="text-center font-bold text-lg py-2">
        Jumlah Gaji: Rp 438.000
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <button
          onClick={handleSimpan}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          💾 Simpan
        </button>
      </div>
    </div>
  );
}