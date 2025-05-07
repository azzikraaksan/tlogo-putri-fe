"use client";
import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import withAuth from "/src/app/lib/withAuth";

function Page() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  return (
    <div className="flex min-h-screen bg-white-100">
      <Sidebar />
      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-end">
          <UserMenu />
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Laporan Penggajian</h1>

        <div className="bg-white p-6 rounded-xl shadow-xl">
          {/* Filter Bulan & Tahun */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <select className="border border-gray-300 p-2 rounded-md shadow-sm text-[14px]" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">Pilih Bulan</option>
              {months.map((month, index) => <option key={index} value={month}>{month}</option>)}
            </select>
            <select className="border border-gray-300 p-2 rounded-md shadow-sm text-[14px]" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">Pilih Tahun</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>

            <div className="ml-auto">
              <div className="relative w-full max-w-xs">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]"
                />
              </div>
            </div>
          </div>

          {/* Header Judul */}
          <div className="bg-blue-600 text-white text-[14px] font-medium rounded-lg px-4 py-3 mb-4 shadow-md">
            Laporan Gaji Karyawan
            {selectedMonth && ` - Bulan: ${selectedMonth}`}
            {selectedYear && `, Tahun: ${selectedYear}`}
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-md text-xs text-[14px]">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-3 text-center">No</th>
                  <th className="p-3 text-center">Nomor Lambung</th>
                  <th className="p-3 text-left">Nama Karyawan</th>
                  <th className="p-3 text-center">Tanggal</th>
                  <th className="p-3 text-center">Waktu</th>
                  <th className="p-3 text-center">Posisi</th>
                  <th className="p-3 text-right">Nominal Gaji</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {[
                  ["0", "0", "0", "0", "0", "Rp. 0"],
                  ["Danang", "1/3/2025", "11.30", "Driver", "Rp. 2.000.000"],
                  ["Gading", "2/3/2025", "09.00", "Driver", "Rp. 1.500.000"],
                  ["Nanto", "3/3/2025", "09.00", "Driver", "Rp. 1.500.000"],
                  ["Rian", "4/3/2025", "09.00", "Driver", "Rp. 1.500.000"]
                ].map((data, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{index === 0 ? data[0] : `0${index}`}</td>
                    <td className="p-3">{index === 0 ? data[1] : data[0]}</td>
                    <td className="p-3 text-center">{index === 0 ? data[2] : data[1]}</td>
                    <td className="p-3 text-center">{index === 0 ? data[3] : data[2]}</td>
                    <td className="p-3 text-center">{index === 0 ? data[4] : data[3]}</td>
                    <td className="p-3 text-right">{index === 0 ? data[5] : data[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 gap-2">
            <button className="p-2 border rounded disabled:opacity-50">&#8592;</button>
            {[1, 2, 3, 4, 5].map(page => (
              <button key={page} className="p-2 border rounded hover:bg-blue-600 hover:text-white transition">{page}</button>
            ))}
            <span className="px-2">...</span>
            <button className="p-2 border rounded">10</button>
            <button className="p-2 border rounded">&#8594;</button>
          </div>

          {/* Tombol Cetak */}
          <div className="flex justify-end mt-6">
            <button className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition text-[14px] flex items-center gap-2">
              {/* Ikon Cetak */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9V2h12v7m4 4H4v6h4v3h8v-3h4v-6z" />
              </svg>
              Cetak Laporan Penggajian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
