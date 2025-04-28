
//function gaji() {
//  return (
//    <div>gaji 2</div>
//  )
//}

//export default gaji

"use client";

import { useState } from "react";
import Sidebar from "/components/Sidebar.jsx";
import UserMenu from "/components/Pengguna.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";

const employeesData = [
  { id: '01', name: 'Dudung Hasanudin', position: 'Driver', status: 'Belum' },
  { id: '02', name: 'Doni', position: 'Driver', status: 'Belum' },
  { id: '03', name: 'Ramdan', position: 'Driver', status: 'Belum' },
  { id: '04', name: 'Dudung', position: 'Driver', status: 'Belum' },
  { id: '05', name: 'Rendi Amarta', position: 'Driver', status: 'Belum' },
  { id: '06', name: 'Tito Arfian', position: 'Driver', status: 'Belum' },
  { id: '07', name: 'Rahmat', position: 'Driver', status: 'Belum' },
  { id: '08', name: 'Andi Hidayat', position: 'Driver', status: 'Belum' },
  { id: '09', name: 'Rizky', position: 'Driver', status: 'Belum' },
  { id: '10', name: 'Amar', position: 'Driver', status: 'Belum' },
  { id: '11', name: 'Owner 1', position: 'Owner', status: 'Belum' },
  { id: '12', name: 'Owner 2', position: 'Owner', status: 'Belum' },
  { id: '13', name: 'FO 1', position: 'FO', status: 'Belum' },
  { id: '14', name: 'FO 2', position: 'FO', status: 'Belum' },
];

function DaftarGaji() {
  const [positionFilter, setPositionFilter] = useState('Driver');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredEmployees = employeesData.filter(
    (emp) =>
      emp.position === positionFilter &&
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCatatClick = (employeeId) => {
    // Update status jadi "Berhasil" tanpa reload
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, status: 'Berhasil' } : emp
      )
    );
    // Arahkan ke halaman pencatatan
    router.push(`/dashboard/penggajian/pencatatan/${employeeId}`);
  };
  //const handleCatatClick = (employeeId) => {
  //  // Misalnya pindah ke /dashboard/penggajian/pencatatan/[id]
  //  router.push(`/dashboard/penggajian/pencatatan/${employeeId}`);
  //};

  return (
    <div className="flex">
      <Sidebar />
      <UserMenu />
      <div className="flex-1 p-6">
        <h1 className="text-[32px] font-semibold mb-6 text-black">
          Daftar Gaji
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <div>
            {/*<label className="block mb-1 text-sm font-medium">Posisi</label>*/}
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="Driver">Driver</option>
              <option value="Owner">Owner</option>
              <option value="FO">FO</option>
            </select>
          </div>
        
        <div className="flex justify-end mb-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Cari..."
          />
        </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full table-auto text-center">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                <th className="p-3 ">ID Karyawan</th>
                <th className="p-3 text-center">Nama Karyawan</th>
                <th className="p-3 text-center">Posisi</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-b">
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.position}</td>
                  <td className="p-3 text-center">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm text-center">{emp.status}</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleCatatClick(emp.id)}
                      className="px-4 py-2 text-sm rounded bg-[#8FAFD9] text-white hover:bg-blue-700"
                    >
                      Catat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Dummy */}
        <div className="flex justify-center mt-6 gap-2">
          <button className="px-3 py-1 rounded border">&lt;</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
          <button className="px-3 py-1 rounded border">2</button>
          <button className="px-3 py-1 rounded border">3</button>
          <button className="px-3 py-1 rounded border">...</button>
          <button className="px-3 py-1 rounded border">10</button>
          <button className="px-3 py-1 rounded border">&gt;</button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DaftarGaji);
