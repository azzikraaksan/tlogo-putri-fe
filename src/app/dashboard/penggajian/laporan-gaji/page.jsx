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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-end">
          <UserMenu />
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Laporan Penggajian</h1>

        <div className="bg-white p-6 rounded-xl shadow-xl">
          {/* Filter Bulan & Tahun */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <select className="border border-gray-300 p-2 rounded-md shadow-sm" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">Pilih Bulan</option>
              {months.map((month, index) => <option key={index} value={month}>{month}</option>)}
            </select>
            <select className="border border-gray-300 p-2 rounded-md shadow-sm" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mb-4">
            Laporan Gaji Karyawan
            {selectedMonth && ` - Bulan: ${selectedMonth}`}
            {selectedYear && `, Tahun: ${selectedYear}`}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full table-auto text-sm border-collapse">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nomor Lambung</th>
                  <th className="p-3 text-left">Nama Karyawan</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Posisi</th>
                  <th className="p-3">No Rekening</th>
                  <th className="p-3 text-right">Nominal Gaji</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 bg-white">
                {[
                  ["01", "0", "0", "0", "0", "0", "Rp. 0"],
                  ["02", "Danang", "1/3/2025", "11.30", "Driver", "2020101016", "Rp. 2.000.000"],
                  ["03", "Gading", "2/3/2025", "09.00", "Driver", "1010304576", "Rp. 1.500.000"],
                  ["04", "Nanto", "3/3/2025", "09.00", "Driver", "1010304576", "Rp. 1.500.000"],
                  ["05", "Rian", "4/3/2025", "09.00", "Driver", "1010304576", "Rp. 1.500.000"]
                ].map((data, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 transition">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2 text-center">{data[0]}</td>
                    <td className="p-2">{data[1]}</td>
                    <td className="p-2 text-center">{data[2]}</td>
                    <td className="p-2 text-center">{data[3]}</td>
                    <td className="p-2 text-center">{data[4]}</td>
                    <td className="p-2 text-center">{data[5]}</td>
                    <td className="p-2 text-right">{data[6]}</td>
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

          {/* Cetak Button */}
          <div className="flex justify-end mt-6">
            <button className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition">
              Cetak Laporan Penggajian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
