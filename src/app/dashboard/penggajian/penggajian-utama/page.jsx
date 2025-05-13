//"use client";

//import { useState } from "react";
//import Sidebar from "/components/Sidebar.jsx";
//import UserMenu from "/components/Pengguna.jsx";
//import SearchInput from "/components/Search.jsx";
//import withAuth from "/src/app/lib/withAuth";
//import { useRouter } from "next/navigation";

//const employeesData = [
//  { id: '01', name: 'Dudung Hasanudin', position: 'Driver', status: 'Belum' },
//  { id: '02', name: 'Doni', position: 'Driver', status: 'Belum' },
//  { id: '03', name: 'Ramdan', position: 'Driver', status: 'Belum' },
//  { id: '04', name: 'Dudung', position: 'Driver', status: 'Belum' },
//  { id: '05', name: 'Rendi Amarta', position: 'Driver', status: 'Belum' },
//  { id: '06', name: 'Tito Arfian', position: 'Driver', status: 'Belum' },
//  { id: '07', name: 'Rahmat', position: 'Driver', status: 'Belum' },
//  { id: '08', name: 'Andi Hidayat', position: 'Driver', status: 'Belum' },
//  { id: '09', name: 'Rizky', position: 'Driver', status: 'Belum' },
//  { id: '10', name: 'Amar', position: 'Driver', status: 'Belum' },
//  { id: '11', name: 'Owner 1', position: 'Owner', status: 'Belum' },
//  { id: '12', name: 'Owner 2', position: 'Owner', status: 'Belum' },
//  { id: '13', name: 'FO 1', position: 'FO', status: 'Belum' },
//  { id: '14', name: 'FO 2', position: 'FO', status: 'Belum' },
//];

//function DaftarGaji() {
//  const [positionFilter, setPositionFilter] = useState('Driver');
//  const [searchTerm, setSearchTerm] = useState('');
//  const router = useRouter();

//  const filteredEmployees = employeesData.filter(
//    (emp) =>
//      emp.position === positionFilter &&
//      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
//  );

//  const handleCatatClick = (employeeId) => {
//    // Update status jadi "Berhasil" tanpa reload
//    setEmployees((prev) =>
//      prev.map((emp) =>
//        emp.id === employeeId ? { ...emp, status: 'Berhasil' } : emp
//      )
//    );
//    // Arahkan ke halaman pencatatan
//    router.push(`/dashboard/penggajian/pencatatan/${employeeId}`);
//  };
//  //const handleCatatClick = (employeeId) => {
//  //  // Misalnya pindah ke /dashboard/penggajian/pencatatan/[id]
//  //  router.push(`/dashboard/penggajian/pencatatan/${employeeId}`);
//  //};

//  return (
//    <div className="flex">
//      <Sidebar />
//      <UserMenu />
//      <div className="flex-1 p-6">
//        <h1 className="text-[32px] font-semibold mb-6 text-black">
//          Daftar Gaji
//        </h1>

//        <div className="flex items-center mb-4">
//          <select
//            value={positionFilter}
//            onChange={(e) => setPositionFilter(e.target.value)}
//            className="bg-[#3D6CB9] text-white text-sm border border-blue-700 rounded px-2 py-1"
//          >
//            <option value="Driver">Driver</option>
//            <option value="Owner">Owner</option>
//            <option value="FO">FO</option>
//          </select>
//        </div>

//        <div className="flex justify-end mb-4">
//          <SearchInput
//            value={searchTerm}
//            onChange={(e) => setSearchTerm(e.target.value)}
//            onClear={() => setSearchTerm("")}
//            placeholder="Cari..."
//          />
//        </div>

//        <div className="overflow-x-auto rounded-lg shadow bg-white">
//          <table className="w-full table-auto text-center">
//            <thead className="bg-[#3D6CB9] text-white">
//              <tr>
//                <th className="p-3 ">ID Karyawan</th>
//                <th className="p-3 ">Nama Karyawan</th>
//                <th className="p-3 ">Posisi</th>
//                <th className="p-3 ">Status</th>
//                <th className="p-3 ">Aksi</th>
//              </tr>
//            </thead>
//            <tbody>
//              {filteredEmployees.map((emp) => (
//                <tr key={emp.id} className="border-b">
//                  <td className="p-3">{emp.id}</td>
//                  <td className="p-3">{emp.name}</td>
//                  <td className="p-3">{emp.position}</td>
//                  <td className="p-3">
//                    <span className="flex items-center justify-center gap-1">
//                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
//                      <span className="text-sm text-center">{emp.status}</span>
//                    </span>
//                  </td>
//                  <td className="p-3">
//                    <button
//                      onClick={() => handleCatatClick(emp.id)}
//                      className="px-4 py-2 text-sm rounded bg-[#8FAFD9] text-white hover:bg-blue-700"
//                    >
//                      Catat
//                    </button>
//                  </td>
//                </tr>
//              ))}
//            </tbody>
//          </table>
//        </div>

//        {/* Pagination Dummy */}
//        <div className="flex justify-center mt-6 gap-2">
//          <button className="px-3 py-1 rounded border">&lt;</button>
//          <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
//          <button className="px-3 py-1 rounded border">2</button>
//          <button className="px-3 py-1 rounded border">3</button>
//          <button className="px-3 py-1 rounded border">...</button>
//          <button className="px-3 py-1 rounded border">10</button>
//          <button className="px-3 py-1 rounded border">&gt;</button>
//        </div>
//      </div>
//    </div>
//  );
//}

//export default withAuth(DaftarGaji);

//"use client";

//import { useState } from "react";
//import Sidebar from "/components/Sidebar";
//import UserMenu from "/components/Pengguna";
//import SearchInput from "/components/Search";
//import GajiCatat from "/components/GajiCatat";
//import withAuth from "/src/app/lib/withAuth";
//import { useRouter, useParams, useSearchParams } from "next/navigation";
//import { Eye, Printer } from "lucide-react";

//const initialEmployees = [
//  { id: '01', name: 'Dudung Hasanudin', position: 'Driver', status: 'Belum' },
//  { id: '02', name: 'Doni', position: 'Driver', status: 'Belum' },
//  { id: '03', name: 'Ramdan', position: 'Driver', status: 'Belum' },
//  { id: '04', name: 'Dudung', position: 'Driver', status: 'Belum' },
//  { id: '05', name: 'Rendi Amarta', position: 'Driver', status: 'Belum' },
//  { id: '06', name: 'Tito Arfian', position: 'Driver', status: 'Belum' },
//  { id: '07', name: 'Rahmat', position: 'Driver', status: 'Belum' },
//  { id: '08', name: 'Andi Hidayat', position: 'Driver', status: 'Belum' },
//  { id: '09', name: 'Rizky', position: 'Driver', status: 'Belum' },
//  { id: '10', name: 'Amar', position: 'Driver', status: 'Belum' },
//  { id: '11', name: 'Owner 1', position: 'Owner', status: 'Belum' },
//  { id: '12', name: 'Owner 2', position: 'Owner', status: 'Belum' },
//  { id: '13', name: 'FO 1', position: 'Front Office', status: 'Belum' },
//  { id: '14', name: 'FO 2', position: 'Front Office', status: 'Belum' },
//];

//function DaftarGaji() {
//  const [employees, setEmployees] = useState(initialEmployees);
//  const [positionFilter, setPositionFilter] = useState('Driver');
//  const [statusFilter, setStatusFilter] = useState('Semua');
//  const [searchTerm, setSearchTerm] = useState('');
//  const router = useRouter();

//  const handleCatatGaji = (employeeId) => {
//    setEmployees((prev) =>
//      prev.map((emp) =>
//        emp.id === employeeId ? { ...emp, status: 'Berhasil' } : emp
//      )
//    );
//    //router.push(`/dashboard/penggajian/penggajian-utama/[id]/GajiCatat.jsx/${employeeId}`);
//  };

//  const filteredEmployees = employees
//    .filter(emp =>
//      emp.position === positionFilter &&
//      (statusFilter === 'Semua' || emp.status === statusFilter) &&
//      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
//    )
//    .sort((a, b) => a.status === 'Belum' ? -1 : 1); // Prioritaskan status 'Belum'

//  return (
//    <div className="flex">
//      <Sidebar />
//      <UserMenu />
//      <div className="flex-1 p-6">
//        <h1 className="text-[32px] font-semibold mb-6 text-black">Daftar Gaji</h1>

//        <div className="flex items-center gap-4 mb-4">
//            <label htmlFor="position" className="text-sm font-medium text-gray-700">Posisi</label>
//            <select
//              value={positionFilter}
//              onChange={(e) => setPositionFilter(e.target.value)}
//              className="text-black text-sm border border-gray-700 rounded px-2 py-1 shadow-sm hover:blue-500"
//            >
//              <option value="Driver">Driver</option>
//              <option value="Owner">Owner</option>
//              <option value="Front Office">Front Office</option>
//            </select>

//            <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
//            <select
//              value={statusFilter}
//              onChange={(e) => setStatusFilter(e.target.value)}
//              className="text-black text-sm border border-gray-700 rounded px-2 py-1 shadow-sm hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//            >
//              <option value="Semua">Semua</option>
//              <option value="Belum">Belum</option>
//              <option value="Berhasil">Berhasil</option>
//            </select>
//        </div>

//        <div className="flex justify-end mb-4">
//          <SearchInput
//            value={searchTerm}
//            onChange={(e) => setSearchTerm(e.target.value)}
//            onClear={() => setSearchTerm("")}
//            placeholder="Cari..."
//          />
//        </div>

//        <div className="overflow-x-auto rounded-lg shadow bg-white">
//          <div className="max-h-[530px] overflow-y-auto">
//            <table className="w-full table-auto text-center">
//              <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
//                <tr>
//                  <th className="p-3">ID Karyawan</th>
//                  <th className="p-3">Nama Karyawan</th>
//                  <th className="p-3">Posisi</th>
//                  <th className="p-3">Status</th>
//                  <th className="p-3">Aksi</th>
//                </tr>
//              </thead>
//              <tbody>
//                {filteredEmployees.map((emp) => (
//                  <tr key={emp.id} className="border-b">
//                    <td className="p-3">{emp.id}</td>
//                    <td className="p-3">{emp.name}</td>
//                    <td className="p-3">{emp.position}</td>
//                    <td className="p-3">
//                    <span
//                      className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium ${
//                        emp.status === "Belum"
//                          ? "bg-red-100 text-red-800"
//                          : "bg-green-100 text-green-800"
//                      }`}
//                    >
//                      <span
//                        className={`w-2 h-2 rounded-full ${
//                          emp.status === "Belum" ? "bg-red-500" : "bg-green-500"
//                        }`}
//                      ></span>
//                      {emp.status}
//                    </span>

//                    </td>
//                    <td className="p-3">
//                      {emp.status === 'Belum' ? (
//                        <button
//                          onClick={() => router.push(`/dashboard/penggajian/penggajian-utama/GajiCatat/${emp.id}?role=${emp.position}`)}
//                          className="px-2 py-2 text-sm rounded bg-[#8FAFD9] text-white hover:bg-blue-700"
//                        >
//                          Catat
//                        </button>

//                        //<button
//                        //  onClick={() => handleCatatGaji}
//                        //  className="px-2 py-2 text-sm rounded bg-[#8FAFD9] text-white hover:bg-blue-700"
//                        //>
//                        //  Catat
//                        //</button>
//                      ) : (
//                        <button
//                          onClick={() => router.push(`/dashboard/penggajian/penggajian-utama/GajiCatat/${emp.id}`)}
//                          className="px-2 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-800"
//                        >
//                          Lihat
//                        </button>
//                      )}
//                    </td>
//                  </tr>
//                ))}
//                {filteredEmployees.length === 0 && (
//                  <tr>
//                    <td colSpan="5" className="p-4 text-gray-500">Tidak ada data.</td>
//                  </tr>
//                )}
//              </tbody>
//            </table>
//          </div>
//        </div>
//      </div>
//    </div>
//  );
//}

//export default withAuth(DaftarGaji);

"use client";

import { useState } from "react";
import Sidebar from "/components/Sidebar";
import UserMenu from "/components/Pengguna";
import SearchInput from "/components/Search";
import GajiCatat from "/components/GajiCatat";
import withAuth from "/src/app/lib/withAuth";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Eye, Printer } from "lucide-react";

const initialEmployees = [
  { id: "01", name: "Dudung Hasanudin", position: "Driver", status: "Belum" },
  { id: "02", name: "Doni", position: "Driver", status: "Belum" },
  { id: "03", name: "Ramdan", position: "Driver", status: "Belum" },
  { id: "04", name: "Dudung", position: "Driver", status: "Belum" },
  { id: "05", name: "Rendi Amarta", position: "Driver", status: "Belum" },
  { id: "06", name: "Tito Arfian", position: "Driver", status: "Belum" },
  { id: "07", name: "Rahmat", position: "Driver", status: "Belum" },
  { id: "08", name: "Andi Hidayat", position: "Driver", status: "Belum" },
  { id: "09", name: "Rizky", position: "Driver", status: "Belum" },
  { id: "10", name: "Amar", position: "Driver", status: "Belum" },
  { id: "11", name: "Owner 1", position: "Owner", status: "Belum" },
  { id: "12", name: "Owner 2", position: "Owner", status: "Belum" },
  { id: "13", name: "FO 1", position: "Front Office", status: "Belum" },
  { id: "14", name: "FO 2", position: "Front Office", status: "Belum" },
];

function DaftarGaji() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [positionFilter, setPositionFilter] = useState("Driver");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
  const role = searchParams.get("role");
  const [modeCatat, setModeCatat] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // jika perlu untuk detail

  const filteredEmployees = employees
    .filter(
      (emp) =>
        emp.position === positionFilter &&
        (statusFilter === "Semua" || emp.status === statusFilter) &&
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    //.sort((a, b) => a.status === 'Belum' ? -1 : 1);
    .sort((a, b) => {
      if (a.status === b.status) {
        return parseInt(a.id) - parseInt(b.id); // urut berdasarkan ID jika status sama
      }
      return a.status === "Belum" ? -1 : 1; // Belum di atas
    });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGajiCatat = (id, position) => {
    setSelectedRole(position);
    setModeCatat(true);
  };

  const handleKembaliDariGaji = () => {
    setModeCatat(false);
    setSelectedRole(null);
  };

  const handleLihat = (id) => {
    router.push(`/dashboard/penggajian/penggajian-utama/GajiCatat/${id}`);
  };

  const handleCetak = (id) => {
    router.push(`/dashboard/penggajian/penggajian-utama/SlipGaji/${id}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <UserMenu />

      <div className="flex-1 p-6">
        {modeCatat ? (
          <GajiCatat onKembali={handleKembaliDariGaji} role={selectedRole} />
        ) : (
          <>
            <h1 className="text-[32px] font-semibold mb-6 text-black">
              Daftar Gaji
            </h1>

            {/* Filter */}
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium text-gray-700">
                Posisi
              </label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
              >
                <option value="Driver">Driver</option>
                <option value="Owner">Owner</option>
                <option value="Front Office">Front Office</option>
              </select>

              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
              >
                <option value="Semua">Semua</option>
                <option value="Belum">Belum</option>
                <option value="Berhasil">Berhasil</option>
              </select>
            </div>

            {/* Pencarian */}
            <div className="flex justify-end mb-4">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                placeholder="Cari..."
              />
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto rounded-lg shadow bg-white">
              <div className="max-h-[530px] overflow-y-auto">
                <table className="w-full table-auto text-center">
                  <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                    <tr>
                      <th className="p-3">ID Karyawan</th>
                      <th className="p-3">Nama Karyawan</th>
                      <th className="p-3">Posisi</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.map((emp) => (
                      <tr key={emp.id} className="border-b">
                        <td className="p-3">{emp.id}</td>
                        <td className="p-3">{emp.name}</td>
                        <td className="p-3">{emp.position}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium ${
                              emp.status === "Belum"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                emp.status === "Belum"
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            ></span>
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-3 flex justify-center gap-2">
                          {emp.status === "Belum" ? (
                            <button
                              onClick={() =>
                                handleGajiCatat(emp.id, emp.position)
                              }
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
                            >
                              Catat
                            </button>
                          ) : (
                            //<button
                            //  onClick={() => handleGajiCatat (emp.id, emp.position)}
                            //  //onClick={() => router.push(`/dashboard/penggajian/penggajian-utama/GajiCatat/${emp.id}?role=${emp.position}`)}
                            //  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
                            //>
                            //  Catat
                            //</button>
                            <>
                              <button
                                onClick={() => handleLihat(emp.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Eye size={20} />
                              </button>
                              <button
                                onClick={() => handleCetak(emp.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Printer size={20} />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {paginatedEmployees.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-4 text-gray-500">
                          Tidak ada data.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 text-sm border rounded disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <span className="px-2 py-1 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 text-sm border rounded disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(DaftarGaji);
