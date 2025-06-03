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

//"use client";

//import { useState } from "react";
//import Sidebar from "/components/Sidebar";
//import UserMenu from "/components/Pengguna";
//import SearchInput from "/components/Search";
//import GajiCatat from "/components/GajiCatat";
//import withAuth from "/src/app/lib/withAuth";
//import { useRouter, useParams, useSearchParams } from "next/navigation";
//import { Eye, Printer } from "lucide-react";
//import axios from "axios";

////const initialEmployees = [
////  { id: "01", name: "Dudung Hasanudin", position: "Driver", status: "Belum", ownerId: "11", nomorLambung: "01"},
////  { id: "02", name: "Doni", position: "Driver", status: "Belum", ownerId: "12", nomorLambung: "02"},
////  { id: "03", name: "Ramdan", position: "Driver", status: "Belum" },
////  { id: "04", name: "Dudung", position: "Driver", status: "Belum" },
////  { id: "05", name: "Rendi Amarta", position: "Driver", status: "Belum" },
////  { id: "06", name: "Tito Arfian", position: "Driver", status: "Belum" },
////  { id: "07", name: "Rahmat", position: "Driver", status: "Belum" },
////  { id: "08", name: "Andi Hidayat", position: "Driver", status: "Belum" },
////  { id: "09", name: "Rizky", position: "Driver", status: "Belum" },
////  { id: "10", name: "Amar", position: "Driver", status: "Belum" },
////  { id: "11", name: "Owner 1", position: "Owner", status: "Belum" },
////  { id: "12", name: "Owner 2", position: "Owner", status: "Belum" },
////  { id: "13", name: "FO 1", position: "Front Office", status: "Belum" },
////  { id: "14", name: "FO 2", position: "Front Office", status: "Belum" },
////];

//function DaftarGaji() {
//  //const [employees, setEmployees] = useState(initialEmployees);
//  const [positionFilter, setPositionFilter] = useState("Driver");
//  const [statusFilter, setStatusFilter] = useState("Semua");
//  //const [searchTerm, setSearchTerm] = useState("");
//  const [data, setData] = useState([]);
//  const [searchQuery, setSearchQuery] = useState("");
//  const [currentPage, setCurrentPage] = useState(1);
//  const itemsPerPage = 5;
//  const router = useRouter();
//  const params = useParams();
//  const searchParams = useSearchParams();
//  const id = params.id;
//  const role = searchParams.get("role");
//  const [modeCatat, setModeCatat] = useState(false);
//  const [selectedRole, setSelectedRole] = useState(null);
//  const [selectedEmployee, setSelectedEmployee] = useState(null);

//  //const filteredEmployees = employees
//  //  .filter(
//  //    (emp) =>
//  //      emp.position === positionFilter &&
//  //      (statusFilter === "Semua" || emp.status === statusFilter) &&
//  //      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
//  //  )
//  //  //.sort((a, b) => a.status === 'Belum' ? -1 : 1);
//  //  .sort((a, b) => {
//  //    if (a.status === b.status) {
//  //      return parseInt(a.id) - parseInt(b.id); // urut berdasarkan ID jika status sama
//  //    }
//  //    return a.status === "Belum" ? -1 : 1; // Belum di atas
//  //  });

//  const filteredData = data
//  .filter(
//    (item) =>
//      item.role === positionFilter &&
//      (statusFilter === "Semua" || item.status === statusFilter) &&
//      item.nama.toLowerCase().includes(searchQuery.toLowerCase())
//  )
//  .sort((a, b) => {
//      if (a.status === b.status) {
//        return parseInt(a.id) - parseInt(b.id); // urut berdasarkan ID jika status sama
//      }
//      return a.status === "Belum" ? -1 : 1; // Belum di atas
//    });

//  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//  const paginatedEmployees = filteredData.slice(
//    (currentPage - 1) * itemsPerPage,
//    currentPage * itemsPerPage
//  );

//  //const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
//  //const paginatedEmployees = filteredEmployees.slice(
//  //  (currentPage - 1) * itemsPerPage,
//  //  currentPage * itemsPerPage
//  //);

//  //const handleGajiCatat = (id, position) => {
//  //  setSelectedRole(position);
//  //  setModeCatat(true);
//  //};
//  useEffect(() => {
//    const fetchSalaryData = async () => {
//      try {
//        const response = await axios.get("http://localhost:8000/api/salary/calculate");
//        setData(response.data.data);
//      } catch (error) {
//        console.error("Gagal mengambil data:", error);
//      }
//    };

//    fetchSalaryData();
//  }, []);

//  const handleGajiCatat = async (id, position) => {
//  try {
//    const res = await fetch('http://localhost:8000/api/salary/calculate', {
//      method: 'GET',
//      headers: {
//        'Content-Type': 'application/json',
//        // Jika pakai token auth:
//        // 'Authorization': `Bearer ${your_token_here}`
//      },
//    });

//    const data = await res.json();

//    if (res.ok) {
//      alert("Gaji berhasil dihitung!");
//      setSelectedRole(position);
//      setModeCatat(true);
//    } else {
//      alert("Gagal menghitung gaji: " + data.message);
//    }
//  } catch (error) {
//    console.error("Terjadi kesalahan:", error);
//    alert("Terjadi kesalahan saat menghitung gaji.");
//  }
//};

//  const handleKembaliDariGaji = () => {
//    setModeCatat(false);
//    setSelectedRole(null);
//  };

//  const handleLihat = (id) => {
//    router.push(`/dashboard/penggajian/penggajian-utama/GajiCatat/${id}`);
//  };

//  const handleCetak = (id) => {
//    router.push(`/dashboard/penggajian/penggajian-utama/SlipGaji/${id}`);
//  };

//  return (
//    <div className="flex">
//      <Sidebar />
//      <UserMenu />

//      <div className="flex-1 p-6">
//        {modeCatat ? (
//          <GajiCatat onKembali={handleKembaliDariGaji} role={selectedRole} />
//        ) : (
//          <>
//            <h1 className="text-[32px] font-semibold mb-6 text-black">
//              Daftar Gaji
//            </h1>

//            {/* Filter */}
//            <div className="flex items-center gap-4 mb-4">
//              <label className="text-sm font-medium text-gray-700">
//                Posisi
//              </label>
//              <select
//                value={positionFilter}
//                onChange={(e) => setPositionFilter(e.target.value)}
//                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
//              >
//                <option value="Driver">Driver</option>
//                <option value="Owner">Owner</option>
//                <option value="Front Office">Front Office</option>
//              </select>

//              <label className="text-sm font-medium text-gray-700">
//                Status
//              </label>
//              <select
//                value={statusFilter}
//                onChange={(e) => setStatusFilter(e.target.value)}
//                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
//              >
//                <option value="Semua">Semua</option>
//                <option value="Belum">Belum</option>
//                <option value="Berhasil">Berhasil</option>
//              </select>
//            </div>

//            {/* Pencarian */}
//            <div className="flex justify-end mb-4">
//              <SearchInput
//                value={searchQuery}
//                onChange={(e) => setSearchQuery(e.target.value)}
//                onClear={() => setSearchQuery("")}
//                placeholder="Cari..."
//              />
//            </div>

//            {/* Tabel */}
//            <div className="overflow-x-auto rounded-xl shadow bg-white">
//              <div className="max-h-[530px] overflow-y-auto">
//                <table className="w-full table-auto text-center">
//                  <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
//                    <tr>
//                      <th className="p-3">ID Karyawan</th>
//                      <th className="p-3">Nama Karyawan</th>
//                      <th className="p-3">Posisi</th>
//                      <th className="p-3">Status</th>
//                      <th className="p-3">Aksi</th>
//                    </tr>
//                  </thead>
//                  <tbody>
//                    {paginatedEmployees.map((item) => (
//                      <tr key={item.id} className="border-b last:border-b-0">
//                        <td className="p-3">{item.id}</td>
//                        <td className="p-3">{item.nama}</td>
//                        <td className="p-3">{item.role}</td>
//                        <td className="p-3">
//                          <span
//                            className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium ${
//                              item.status === "Belum"
//                                ? "bg-red-100 text-red-800"
//                                : "bg-green-100 text-green-800"
//                            }`}
//                          >
//                            <span
//                              className={`w-2 h-2 rounded-full ${
//                                item.status === "Belum"
//                                  ? "bg-red-500"
//                                  : "bg-green-500"
//                              }`}
//                            ></span>
//                            {item.status}
//                          </span>
//                        </td>
//                        <td className="p-3 flex justify-center gap-2">
//                          {item.status === "Belum" ? (
//                            <button
//                              onClick={() =>
//                                handleGajiCatat(item.id, item.role)
//                              }
//                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
//                            >
//                              Catat
//                            </button>
//                          ) : (
//                            //<button
//                            //  onClick={() => handleGajiCatat (emp.id, emp.position)}
//                            //  //onClick={() => router.push(`/dashboard/penggajian/penggajian-utama/GajiCatat/${emp.id}?role=${emp.position}`)}
//                            //  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
//                            //>
//                            //  Catat
//                            //</button>
//                            <>
//                              <button
//                                onClick={() => handleLihat(item.id)}
//                                className="text-blue-600 hover:text-blue-800"
//                              >
//                                <Eye size={20} />
//                              </button>
//                              <button
//                                onClick={() => handleCetak(item.id)}
//                                className="text-green-600 hover:text-green-800"
//                              >
//                                <Printer size={20} />
//                              </button>
//                            </>
//                          )}
//                        </td>
//                      </tr>
//                    ))}
//                    {paginatedEmployees.length === 0 && (
//                      <tr>
//                        <td colSpan="5" className="p-4 text-gray-500">
//                          Tidak ada data.
//                        </td>
//                      </tr>
//                    )}
//                  </tbody>
//                </table>
//              </div>
//            </div>

//            {/* Pagination */}
//            <div className="flex justify-center mt-4">
//              <button
//                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                disabled={currentPage === 1}
//                className="px-3 py-1 mx-1 text-sm border rounded disabled:opacity-50"
//              >
//                Sebelumnya
//              </button>
//              <span className="px-2 py-1 text-sm">
//                {currentPage} / {totalPages}
//              </span>
//              <button
//                onClick={() =>
//                  setCurrentPage((p) => Math.min(p + 1, totalPages))
//                }
//                disabled={currentPage === totalPages}
//                className="px-3 py-1 mx-1 text-sm border rounded disabled:opacity-50"
//              >
//                Selanjutnya
//              </button>
//            </div>
//          </>
//        )}
//      </div>
//    </div>
//  );
//}

//export default withAuth(DaftarGaji);

//"use client";

//import { useState, useEffect } from "react";
//import Sidebar from "/components/Sidebar";
//import UserMenu from "/components/Pengguna";
//import SearchInput from "/components/Search";
//import GajiCatat from "/components/GajiCatat";
//import withAuth from "/src/app/lib/withAuth";
//import { useRouter, useParams, useSearchParams } from "next/navigation";
//import { Eye, Printer } from "lucide-react";
//import axios from "axios";

//function DaftarGaji() {
//  const [data, setData] = useState([]);
//  const [searchQuery, setSearchQuery] = useState("");
//  const [positionFilter, setPositionFilter] = useState("Driver");
//  const [statusFilter, setStatusFilter] = useState("Semua");
//  const [currentPage, setCurrentPage] = useState(1);
//  const [modeCatat, setModeCatat] = useState(false);
//  const [selectedRole, setSelectedRole] = useState(null);
//  const itemsPerPage = 5;

//  const router = useRouter();

//  useEffect(() => {
//    const fetchSalaryData = async () => {
//      try {
//        const response = await axios.get("http://localhost:8000/api/salary/calculate");
//        setData(response.data.data);
//      } catch (error) {
//        console.error("Gagal mengambil data:", error);
//      }
//    };

//    fetchSalaryData();
//  }, []);

//const filteredData = (data || [])
//  .filter(
//    (item) =>
//      item.role === positionFilter &&
//      (statusFilter === "Semua" || item.status === statusFilter) &&
//      item.name.toLowerCase().includes(searchQuery.toLowerCase())
//  )
//    .sort((a, b) => {
//      if (a.status === b.status) {
//        return parseInt(a.id) - parseInt(b.id);
//      }
//      return a.status === "Belum" ? -1 : 1;
//    });

//  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//  const paginatedData = filteredData.slice(
//    (currentPage - 1) * itemsPerPage,
//    currentPage * itemsPerPage
//  );

//  const handleGajiCatat = async (id, role) => {
//    try {
//      const res = await fetch("http://localhost:8000/api/salary/calculate", {
//        method: "GET",
//        headers: {
//          "Content-Type": "application/json",
//        },
//      });

//      const result = await res.json();

//      if (res.ok) {
//        alert("Gaji berhasil dihitung!");
//        setSelectedRole(role);
//        setModeCatat(true);
//      } else {
//        alert("Gagal menghitung gaji: " + result.message);
//      }
//    } catch (error) {
//      console.error("Terjadi kesalahan:", error);
//      alert("Terjadi kesalahan saat menghitung gaji.");
//    }
//  };

//  const handleKembaliDariGaji = () => {
//    setModeCatat(false);
//    setSelectedRole(null);
//  };

//  const handleLihat = (id) => {
//    router.push(`/dashboard/penggajian/penggajian-utama/GajiCatat/${id}`);
//  };

//  const handleCetak = (id) => {
//    router.push(`/dashboard/penggajian/penggajian-utama/SlipGaji/${id}`);
//  };

//  return (
//    <div className="flex">
//      <Sidebar />
//      <UserMenu />

//      <div className="flex-1 p-6">
//        {modeCatat ? (
//          <GajiCatat onKembali={handleKembaliDariGaji} role={selectedRole} />
//        ) : (
//          <>
//            <h1 className="text-[32px] font-semibold mb-6 text-black">Daftar Gaji</h1>

//            {/* Filter */}
//            <div className="flex items-center gap-4 mb-4">
//              <label className="text-sm font-medium text-gray-700">Posisi</label>
//              <select
//                value={positionFilter}
//                onChange={(e) => setPositionFilter(e.target.value)}
//                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
//              >
//                <option value="Driver">Driver</option>
//                <option value="Owner">Owner</option>
//                <option value="Front Office">Front Office</option>
//              </select>

//              <label className="text-sm font-medium text-gray-700">Status</label>
//              <select
//                value={statusFilter}
//                onChange={(e) => setStatusFilter(e.target.value)}
//                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
//              >
//                <option value="Semua">Semua</option>
//                <option value="Belum">Belum</option>
//                <option value="Berhasil">Berhasil</option>
//              </select>
//            </div>

//            {/* Pencarian */}
//            <div className="flex justify-end mb-4">
//              <SearchInput
//                value={searchQuery}
//                onChange={(e) => setSearchQuery(e.target.value)}
//                onClear={() => setSearchQuery("")}
//                placeholder="Cari..."
//              />
//            </div>

//            {/* Tabel */}
//            <div className="overflow-x-auto rounded-xl shadow bg-white">
//              <div className="max-h-[530px] overflow-y-auto">
//                <table className="w-full table-auto text-center">
//                  <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
//                    <tr>
//                      <th className="p-3">ID Karyawan</th>
//                      <th className="p-3">Nama Karyawan</th>
//                      <th className="p-3">Posisi</th>
//                      <th className="p-3">Status</th>
//                      <th className="p-3">Aksi</th>
//                    </tr>
//                  </thead>
//                  <tbody>
//                    {paginatedData.map((item) => (
//                      <tr key={item.id} className="border-b last:border-b-0">
//                        <td className="p-3">{item.id}</td>
//                        <td className="p-3">{item.nama}</td>
//                        <td className="p-3">{item.role}</td>
//                        <td className="p-3">
//                          <span
//                            className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium ${
//                              item.status === "Belum"
//                                ? "bg-red-100 text-red-800"
//                                : "bg-green-100 text-green-800"
//                            }`}
//                          >
//                            <span
//                              className={`w-2 h-2 rounded-full ${
//                                item.status === "Belum"
//                                  ? "bg-red-500"
//                                  : "bg-green-500"
//                              }`}
//                            ></span>
//                            {item.status}
//                          </span>
//                        </td>
//                        <td className="p-3 flex justify-center gap-2">
//                          {item.status === "Belum" ? (
//                            <button
//                              onClick={() => handleGajiCatat(item.id, item.role)}
//                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
//                            >
//                              Catat
//                            </button>
//                          ) : (
//                            <>
//                              <button
//                                onClick={() => handleLihat(item.id)}
//                                className="text-blue-600 hover:text-blue-800"
//                              >
//                                <Eye size={20} />
//                              </button>
//                              <button
//                                onClick={() => handleCetak(item.id)}
//                                className="text-green-600 hover:text-green-800"
//                              >
//                                <Printer size={20} />
//                              </button>
//                            </>
//                          )}
//                        </td>
//                      </tr>
//                    ))}
//                    {paginatedData.length === 0 && (
//                      <tr>
//                        <td colSpan="5" className="p-4 text-gray-500">
//                          Tidak ada data.
//                        </td>
//                      </tr>
//                    )}
//                  </tbody>
//                </table>
//              </div>
//            </div>

//            {/* Pagination */}
//            <div className="flex justify-center mt-4">
//              <button
//                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                disabled={currentPage === 1}
//                className="px-3 py-1 mx-1 text-sm border rounded disabled:opacity-50"
//              >
//                Sebelumnya
//              </button>
//              <span className="px-2 py-1 text-sm">
//                {currentPage} / {totalPages}
//              </span>
//              <button
//                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                disabled={currentPage === totalPages}
//                className="px-3 py-1 mx-1 text-sm border rounded disabled:opacity-50"
//              >
//                Selanjutnya
//              </button>
//            </div>
//          </>
//        )}
//      </div>
//    </div>
//  );
//}

//export default withAuth(DaftarGaji);

//"use client";

//import { useState, useEffect } from "react";
//import Sidebar from "/components/Sidebar";
//import UserMenu from "/components/Pengguna";
//import SearchInput from "/components/Search";
//import GajiCatat from "/components/GajiCatat";
//import withAuth from "/src/app/lib/withAuth";
//import { useRouter } from "next/navigation";
//import { Eye, Printer } from "lucide-react";
//import axios from "axios";

//function DaftarGaji() {
//  const [data, setData] = useState([]);
//  const [searchQuery, setSearchQuery] = useState("");
//  const [positionFilter, setPositionFilter] = useState("Driver");
//  const [statusFilter, setStatusFilter] = useState("Semua");
//  const [currentPage, setCurrentPage] = useState(1);
//  const [modeCatat, setModeCatat] = useState(false);
//  const [selectedRole, setSelectedRole] = useState(null);
//  const itemsPerPage = 5;

//  const router = useRouter();

//  useEffect(() => {
//    const fetchSalaryData = async () => {
//      try {
//        const response = await axios.get("http://localhost:8000/api/salary/calculate");
//        // asumsi data ada di response.data.data
//        setData(response.data.data || []);
//      } catch (error) {
//        console.error("Gagal mengambil data:", error);
//      }
//    };

//    fetchSalaryData();
//  }, []);

//  // Filter & search di frontend
//  const filteredData = (data || [])
//    .filter(
//      (item) =>
//        item.role === positionFilter &&
//        (statusFilter === "Semua" || item.status.toLowerCase() === statusFilter.toLowerCase()) &&
//        item.nama.toLowerCase().includes(searchQuery.toLowerCase())
//    )
//    .sort((a, b) => {
//      if (a.status === b.status) {
//        return parseInt(a.user_id) - parseInt(b.user_id);
//      }
//      return a.status.toLowerCase() === "belum" ? -1 : 1;
//    });

//  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//  const paginatedData = filteredData.slice(
//    (currentPage - 1) * itemsPerPage,
//    currentPage * itemsPerPage
//  );

//  const handleGajiCatat = (user_id, role) => {
//    setSelectedRole(role);
//    setModeCatat(true);
//  };

//  const handleKembaliDariGaji = () => {
//    setModeCatat(false);
//    setSelectedRole(null);
//  };

//  const handleLihat = (id) => {
//    router.push(`/dashboard/penggajian/penggajian-utama/GajiCatat/${id}`);
//  };

//  const handleCetak = (id) => {
//    router.push(`/dashboard/penggajian/penggajian-utama/SlipGaji/${id}`);
//  };

//  return (
//    <div className="flex">
//      <Sidebar />
//      <UserMenu />

//      <div className="flex-1 p-6">
//        {modeCatat ? (
//          <GajiCatat onKembali={handleKembaliDariGaji} role={selectedRole} />
//        ) : (
//          <>
//            <h1 className="text-[32px] font-semibold mb-6 text-black">Daftar Gaji</h1>

//            {/* Filter */}
//            <div className="flex items-center gap-4 mb-4">
//              <label className="text-sm font-medium text-gray-700">Posisi</label>
//              <select
//                value={positionFilter}
//                onChange={(e) => {
//                  setPositionFilter(e.target.value);
//                  setCurrentPage(1); // reset page ke 1 saat ganti filter
//                }}
//                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
//              >
//                <option value="Driver">Driver</option>
//                <option value="Owner">Owner</option>
//                <option value="Front Office">Front Office</option>
//              </select>

//              <label className="text-sm font-medium text-gray-700">Status</label>
//              <select
//                value={statusFilter}
//                onChange={(e) => {
//                  setStatusFilter(e.target.value);
//                  setCurrentPage(1); // reset page ke 1 saat ganti filter
//                }}
//                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
//              >
//                <option value="Semua">Semua</option>
//                <option value="Belum">Belum</option>
//                <option value="Berhasil">Berhasil</option>
//              </select>
//            </div>

//            {/* Pencarian */}
//            <div className="flex justify-end mb-4">
//              <SearchInput
//                value={searchQuery}
//                onChange={(e) => {
//                  setSearchQuery(e.target.value);
//                  setCurrentPage(1);
//                }}
//                onClear={() => setSearchQuery("")}
//                placeholder="Cari..."
//              />
//            </div>

//            {/* Tabel */}
//            <div className="overflow-x-auto rounded-xl shadow bg-white">
//              <div className="max-h-[530px] overflow-y-auto">
//                <table className="w-full table-auto text-center">
//                  <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
//                    <tr>
//                      <th className="p-3">ID Karyawan</th>
//                      <th className="p-3">Nama Karyawan</th>
//                      <th className="p-3">Posisi</th>
//                      <th className="p-3">Status</th>
//                      <th className="p-3">Aksi</th>
//                    </tr>
//                  </thead>
//                  <tbody>
//                    {paginatedData.length > 0 ? (
//                      paginatedData.map((item) => (
//                        <tr key={item.user_id} className="border-b last:border-b-0">
//                          <td className="p-3">{item.user_id}</td>
//                          <td className="p-3">{item.nama}</td>
//                          <td className="p-3">{item.role}</td>
//                          <td className="p-3">
//                            <span
//                              className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium ${
//                                item.status.toLowerCase() === "belum"
//                                  ? "bg-red-100 text-red-800"
//                                  : "bg-green-100 text-green-800"
//                              }`}
//                            >
//                              <span
//                                className={`w-2 h-2 rounded-full ${
//                                  item.status.toLowerCase() === "belum"
//                                    ? "bg-red-500"
//                                    : "bg-green-500"
//                                }`}
//                              ></span>
//                              {item.status}
//                            </span>
//                          </td>
//                          <td className="p-3 flex justify-center gap-2">
//                            {item.status.toLowerCase() === "belum" ? (
//                              <button
//                                onClick={() => handleGajiCatat(item.user_id, item.role)}
//                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
//                              >
//                                Catat
//                              </button>
//                            ) : (
//                              <>
//                                <button
//                                  onClick={() => handleLihat(item.user_id)}
//                                  className="text-blue-600 hover:text-blue-800"
//                                >
//                                  <Eye size={20} />
//                                </button>
//                                <button
//                                  onClick={() => handleCetak(item.user_id)}
//                                  className="text-green-600 hover:text-green-800"
//                                >
//                                  <Printer size={20} />
//                                </button>
//                              </>
//                            )}
//                          </td>
//                        </tr>
//                      ))
//                    ) : (
//                      <tr>
//                        <td colSpan="5" className="p-4 text-gray-500">
//                          Tidak ada data.
//                        </td>
//                      </tr>
//                    )}
//                  </tbody>
//                </table>
//              </div>
//            </div>

//            {/* Pagination */}
//            <div className="flex justify-center mt-4">
//              <button
//                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                disabled={currentPage === 1}
//                className="px-3 py-1 mx-1 text-sm border rounded disabled:opacity-50"
//              >
//                Sebelumnya
//              </button>
//              <span className="px-2 py-1 text-sm">
//                {currentPage} / {totalPages}
//              </span>
//              <button
//                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                disabled={currentPage === totalPages}
//                className="px-3 py-1 mx-1 text-sm border rounded disabled:opacity-50"
//              >
//                Selanjutnya
//              </button>
//            </div>
//          </>
//        )}
//      </div>
//    </div>
//  );
//}

//export default withAuth(DaftarGaji);
//

"use client";

import { useState, useEffect } from "react";
import Sidebar from "/components/Sidebar";
import SearchInput from "/components/Search";
import GajiCatat from "/components/GajiCatat";
import withAuth from "/src/app/lib/withAuth";
import { useRouter } from "next/navigation";
import { Eye, Printer } from "lucide-react";
import SlipGaji from "/components/SlipGaji";

function DaftarGaji() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("Driver");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [modeCatat, setModeCatat] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const itemsPerPage = 5;
  const [allPreviews, setAllPreviews] = useState([]); // untuk semua entri
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dataGaji, setDataGaji] = useState([]);
  const [showSlipModal, setShowSlipModal] = useState(false);

  const router = useRouter();

  //const fetchSalaryPreview = async () => {
  //  try {
  //    const response = await fetch("http://localhost:8000/api/salary/previews");
  //    if (!response.ok)
  //      throw new Error(`HTTP error! status: ${response.status}`);

  //    const data = await response.json();

  //    console.log("Data dari backend:", data); // <-- ini untuk cek data apa yang didapat

  //    const previews = data.previews.map((item) => ({
  //      id: item.id,
  //      user_id: item.user_id, // sesuai dengan API
  //      nama: item.nama,
  //      posisi: item.role, // pakai 'role' dari API
  //      role: item.role, // simpan juga role jika diperlukan
  //      status: item.status,
  //      //tanggal: item.created_at ?? new Date().toISOString(),
  //      tanggal: item.payment_date,
  //    }));

  //    setAllPreviews(previews);

  //    // Filter agar unik per user per hari
  //    const unique = new Map();
  //    previews.forEach((item) => {
  //      const dateKey = new Date(item.tanggal).toISOString().slice(0, 10);
  //      const key = `${item.user_id}_${dateKey}`;
  //      if (!unique.has(key)) {
  //        unique.set(key, item);
  //      }
  //    });

  //    setData([...unique.values()]);
  //  } catch (error) {
  //    console.error(
  //      "Error saat mengambil salary preview:",
  //      error?.message || error
  //    );
  //  }
  //};

  const fetchSalaryDataGabungan = async () => {
    try {
      const [previewRes, allRes] = await Promise.all([
        fetch("http://localhost:8000/api/salary/previews"),
        fetch("http://localhost:8000/api/salary/all"),
      ]);

      const previewJson = await previewRes.json();
      const allJsonRaw = await allRes.json();

      console.log("Data salary/all:", allJsonRaw); // Cek dulu struktur

      // Misal data yang benar ada di properti `all`
      const allJson = allJsonRaw.all || allJsonRaw;
      console.log("Data salary/all:", allJsonRaw);

      const previews = previewJson.previews.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        nama: item.nama,
        posisi: item.role,
        role: item.role,
        tanggal: item.payment_date,
        status: item.status,
      }));

      //const merged = previews.map((preview) => {
      //  const isMatched = Array.isArray(allJson) && allJson.some(
      //    (s) =>
      //      s.driver_id === preview.user_id &&
      //      s.role.toLowerCase() === preview.role.toLowerCase() &&
      //      s.date === preview.payment_date
      //  );

      //  return {
      //    ...preview,
      //    status: isMatched ? "Berhasil" : "Belum",
      //  };
      //});

      const formatDate = (dateStr) =>
        new Date(dateStr).toISOString().slice(0, 10);

      const merged = previews.map((preview) => {
        const previewDate = formatDate(preview.tanggal);
        const isMatched =
          Array.isArray(allJson) &&
          allJson.some(
            (s) =>
              s.user_id === preview.user_id &&
              s.role.toLowerCase() === preview.role.toLowerCase() &&
              formatDate(s.payment_date) === previewDate
          );

        return {
          ...preview,
          status: isMatched ? "Berhasil" : "Belum",
        };
      });

      // Filter unik per user dan tanggal
      const unique = new Map();
      merged.forEach((item) => {
        const dateKey = new Date(item.tanggal).toISOString().slice(0, 10);
        const key = `${item.user_id}_${dateKey}`;
        if (!unique.has(key)) {
          unique.set(key, item);
        }
      });

      setAllPreviews([...merged]);
      setData([...unique.values()]);
    } catch (error) {
      console.error("Gagal fetch gabungan:", error);
    }
  };

  const fetchSalaryAllData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/salary/all");
      const json = await res.json();
      console.log("Data salary/all diterima:", json);

      const rawData = json.data || json;

      const mappedData = rawData.map((item) => ({
        ...item,
        posisi: item.role, // Tambahkan posisi agar bisa difilter
        tanggal: item.date ?? item.payment_date, // Pastikan ada tanggal
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Gagal fetch salary/all:", error);
    }
  };

  //useEffect(() => {
  //  const init = async () => {
  //    const updated = localStorage.getItem("statusUpdated"); // ✅ ambil di sini
  //    console.log("📦 Ambil dari localStorage:", updated);

  //    //await fetchSalaryDataGabungan();

  //    //  //  if (updated) {
  //    //  //    //const [user_id, role] = updated.split("-");
  //    //  //    //console.log("📌 updateStatus akan dipanggil dengan:", user_id, role);
  //    //  //    //updateStatus(Number(user_id), role);
  //    //  //    localStorage.removeItem("statusUpdated");
  //    //  //  }
  //    //  //};

  //    //  //if (updated) {
  //    //  //        const [user_id, role] = updated.split("-");
  //    //  //    console.log("📌 updateStatus akan dipanggil dengan:", user_id, role);
  //    //  //    //updateStatus(Number(user_id), role);
  //    //  //    //await fetchSalaryDataGabungan();  // refresh data dari backend
  //    //  //    //localStorage.removeItem("statusUpdated");
  //    //  //    await updateStatus(Number(user_id), role);
  //    //  //    await fetchSalaryDataGabungan();  // refresh data setelah update
  //    //  //    localStorage.removeItem("statusUpdated");
  //    //  //  } else {
  //    //  //    await fetchSalaryDataGabungan();  // load data pertama kali
  //    //  //  }
  //    //  //};
  //    if (updated) {
  //      // Kalau sudah update, langsung fetch dari salary/all
  //      await fetchSalaryAllData(); // fungsi fetch untuk ambil data dari /salary/all
  //      localStorage.removeItem("statusUpdated");
  //    } else {
  //      // Kalau belum ada update, fetch data previews seperti biasa (atau gabungan)
  //      await fetchSalaryDataGabungan();
  //    }
  //  };

  //  init();
  //}, []);

  //useEffect(() => {
  //  fetchSalaryDataGabungan();

  //  fetchSalaryAllData();
  //}, []);

  //  useEffect(() => {
  //  const init = async () => {
  //    const updated = localStorage.getItem("statusUpdated");
  //    console.log("📦 Ambil dari localStorage:", updated);

  //    if (updated && updated.includes("-")) {
  //      const [user_id, role] = updated.split("-");
  //      await updateStatus(Number(user_id), role); // update di state lokal
  //      await fetchSalaryDataGabungan(); // sinkron ulang dari backend
  //      localStorage.removeItem("statusUpdated");
  //    } else {
  //      await fetchSalaryDataGabungan();
  //    }
  //  };

  //  init();
  //}, []);

  //useEffect(() => {
  //  const init = async () => {
  //    if (typeof window !== "undefined") {
  //      const updated = localStorage.getItem("statusUpdated");

  //      await fetchSalaryAllData(); // Fetch tetap dijalankan

  //      if (updated && updated.includes("-")) {
  //        const [user_id, role] = updated.split("-");
  //        updateStatus(Number(user_id), role); // Update lokal state
  //        localStorage.removeItem("statusUpdated");
  //      } else {
  //        await fetchSalaryDataGabungan();
  //      }
  //    }
  //  };
  //  init();
  //}, []);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        const updated = localStorage.getItem("statusUpdated");

        const [previewRes, allRes] = await Promise.all([
          fetch("http://localhost:8000/api/salary/previews"),
          fetch("http://localhost:8000/api/salary/all"),
        ]);

        const previewJson = await previewRes.json();
        const allJsonRaw = await allRes.json();
        const allJson = allJsonRaw.all || allJsonRaw;

        const previews = previewJson.previews.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          nama: item.nama,
          posisi: item.role,
          role: item.role,
          tanggal: item.payment_date,
          status: item.status,
        }));

        //const merged = previews.map((preview) => {
        //  const previewDate = new Date(preview.tanggal)
        //    .toISOString()
        //    .slice(0, 10);
        //  const isMatched =
        //    Array.isArray(allJson) &&
        //    allJson.some(
        //      (s) =>
        //        s.user_id === preview.user_id &&
        //        s.role.toLowerCase() === preview.role &&
        //        s.payment_date === previewDate
        //    );

        //  //const isMatched =
        //  //  Array.isArray(allJson) &&
        //  //  allJson.some(
        //  //    (s) =>
        //  //      s.user_id === preview.user_id &&
        //  //      s.role.toLowerCase() === preview.role.toLowerCase() &&
        //  //      s.date === preview.tanggal
        //  //  );

        //  return {
        //    ...preview,
        //    status: isMatched ? "Berhasil" : "Belum",
        //  };
        //});

        const formatDate = (dateStr) =>
          new Date(dateStr).toISOString().slice(0, 10);

        const merged = previews.map((preview) => {
          const previewDate = formatDate(preview.tanggal);
          const isMatched =
            Array.isArray(allJson) &&
            allJson.some(
              (s) =>
                s.user_id === preview.user_id &&
                s.role.toLowerCase() === preview.role.toLowerCase() &&
                formatDate(s.payment_date) === previewDate
            );

          return {
            ...preview,
            status: isMatched ? "Berhasil" : "Belum",
          };
        });

        const unique = new Map();
        merged.forEach((item) => {
          const dateKey = new Date(item.tanggal).toISOString().slice(0, 10);
          const key = `${item.user_id}_${dateKey}`;
          if (!unique.has(key)) {
            unique.set(key, item);
          }
        });

        // ⬇️ Set data hasil fetch dulu
        setAllPreviews([...merged]);
        setData([...unique.values()]);

        // ⬇️ Setelah data fresh ter-set, baru update status jika perlu
        if (updated && updated.includes("-")) {
          const [user_id, role] = updated.split("-");
          updateStatus(Number(user_id), role);
          localStorage.removeItem("statusUpdated");
        }
      }
    };

    init();
  }, []);

  const filteredData = (data || [])
    .filter(
      (item) =>
        item.posisi === positionFilter && // posisi, bukan role
        (statusFilter === "Semua" ||
          item.status.toLowerCase() === statusFilter.toLowerCase()) &&
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
        item.tanggal?.slice(0, 10) === selectedDate
    )
    .sort((a, b) => {
      if (a.status === b.status) {
        return parseInt(a.id) - parseInt(b.id);
      }
      return a.status.toLowerCase() === "belum" ? -1 : 1;
    });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchGaji = async () => {
    const res = await fetch("http://localhost:8000/api/salary/previews");
    const data = await res.json();
    setDataGaji(data);
  };

  const handleCatat = (user_id, role) => {
    localStorage.setItem("statusUpdated", `${user_id}-${role}`);

    router.push(
      `/dashboard/penggajian/penggajian-utama/catat/${user_id}/${role}`
    );
  };

  const handleLihat = (user_id, role) => {
    router.push(
      `/dashboard/penggajian/penggajian-utama/catat/${user_id}/${role.toLowerCase()}`
    );
  };

  const handleCetak = () => {
    setShowSlipModal(true);
  };

  const handleKembaliDariGaji = () => {
    setModeCatat(false);
    setSelectedRole(null);
  };

  const updateStatus = (user_id, role) => {
    setAllPreviews((prevPreviews) =>
      prevPreviews.map((item) => {
        console.log("🔍 Mencocokkan preview:", item.user_id, item.role);
        if (
          item.user_id === user_id &&
          item.role.toLowerCase() === role.toLowerCase()
        ) {
          console.log("✅ Status diubah jadi Berhasil untuk", item.user_id);
          return { ...item, status: "berhasil" };
        }
        return item;
      })
    );

    setData((prevData) =>
      prevData.map((item) => {
        if (
          item.user_id === user_id &&
          item.role.toLowerCase() === role.toLowerCase()
        ) {
          return { ...item, status: "berhasil" };
        }
        return item;
      })
    );

    // ✅ Tambahkan bagian ini:
    console.log("📦 Menyimpan ke localStorage:", `${user_id}-${role}`);
    localStorage.setItem("statusUpdated", `${user_id}-${role}`);
  };

  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? 290 : 70,
        }}
      ></div>

      <div className="flex-1 p-6">
        {modeCatat ? (
          <GajiCatat onKembali={handleKembaliDariGaji} role={selectedRole} />
        ) : (
          <>
            <h1 className="text-[32px] font-semibold mb-6 text-black">
              Daftar Gaji
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium text-gray-700">
                Posisi
              </label>
              <select
                value={positionFilter}
                onChange={(e) => {
                  setPositionFilter(e.target.value);
                  setCurrentPage(1);
                }}
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
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-black text-sm border border-gray-700 rounded px-2 py-1"
              >
                <option value="Semua">Semua</option>
                <option value="Belum">Belum</option>
                <option value="Berhasil">Berhasil</option>
              </select>

              <label className="text-sm font-medium text-gray-700">
                Tanggal
              </label>
              <input
                type="date"
                //defaultValue={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-1 block w-40 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end mb-4">
              <SearchInput
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => setSearchQuery("")}
                placeholder="Cari..."
              />
            </div>

            <div className="overflow-x-auto rounded-xl shadow bg-white">
              <div className="max-h-[530px] overflow-y-auto">
                <table className="w-full table-auto text-center">
                  <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                    <tr>
                      {/*<th className="p-3">ID Karyawan</th>*/}
                      <th className="p-3">Nama Karyawan</th>
                      <th className="p-3">Posisi</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item) => (
                        <tr key={item.id} className="border-b last:border-b-0">
                          {/*<td className="p-3">{item.user_id}</td>*/}
                          <td className="p-3">{item.nama}</td>
                          <td className="p-3">{item.posisi}</td>
                          <td className="p-3">{item.tanggal}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium ${
                                item.status.toLowerCase() === "belum"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.status.toLowerCase() === "belum"
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                }`}
                              ></span>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 flex justify-center gap-2">
                            {item.status.toLowerCase() === "belum" ? (
                              <button
                                onClick={() =>
                                  handleCatat(item.user_id, item.role)
                                }
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
                              >
                                Catat
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleLihat(item.user_id, item.role)
                                  }
                                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
                                >
                                  Lihat
                                  {/*<Eye size={20} />*/}
                                </button>
                                {/*<button
                                  onClick={() => setShowSlipModal(true)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Printer size={20} />
                                </button>*/}

                                {showSlipModal && (
                                  <SlipGaji
                                    onClose={() => setShowSlipModal(false)}
                                    nama={nama}
                                    tanggal={tanggal}
                                    role={role}
                                    totalGaji={totalGaji}
                                    data={data}
                                  />
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-gray-500">
                          Data tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Halaman {currentPage} dari {totalPages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(DaftarGaji);
