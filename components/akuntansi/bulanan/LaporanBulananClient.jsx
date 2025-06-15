// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useRouter, useSearchParams } from 'next/navigation';

// // Impor komponen dan utilitas
// import KepalaHalaman from "./KepalaHalaman.jsx";
// import AksiLaporan from "./AksiLaporan.jsx";
// import TabelLaporan from "./TabelLaporan.jsx";
// import TampilanTotalKas from "./TampilanTotalKas.jsx";
// import { 
//     ambilLaporanBulanan, 
//     buatLaporanBulanan, 
//     eksporKeExcel, 
//     eksporKePDF 
// } from "./Utilitas.js";

// // Komponen ini menerima data awal dari Server Component
// const LaporanBulananClient = ({ dataAwal, bulanAwal, tahunAwal }) => {
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     // State management menggunakan data awal dari props
//     const [dataBulanan, setDataBulanan] = useState(dataAwal);
//     const [sedangMemuat, setSedangMemuat] = useState(false); // Awalnya false karena data sudah ada
//     const [pesanError, setPesanError] = useState(null);
//     const [bulanDipilih, setBulanDipilih] = useState(bulanAwal);
//     const [tahunDipilih, setTahunDipilih] = useState(tahunAwal);

//     // Fungsi untuk memperbarui URL saat filter berubah
//     const perbaruiURL = (bulan, tahun) => {
//         router.push(`/dashboard/akuntansi/laporan-keuangan/bulanan?month=${bulan}&year=${tahun}`);
//     };

//     // Handler untuk perubahan filter bulan dan tahun
//     const handleUbahBulan = (e) => {
//         const bulanBaru = parseInt(e.target.value, 10);
//         setBulanDipilih(bulanBaru);
//         perbaruiURL(bulanBaru, tahunDipilih);
//     };

//     const handleUbahTahun = (e) => {
//         const tahunBaru = parseInt(e.target.value, 10);
//         setTahunDipilih(tahunBaru);
//         perbaruiURL(bulanDipilih, tahunBaru);
//     };
    
//     // Sinkronkan state dengan dataAwal ketika props berubah (saat navigasi)
//     useEffect(() => {
//         setDataBulanan(dataAwal);
//     }, [dataAwal]);

//     // Handler untuk memicu pembuatan laporan
//     const handleBuatLaporan = async () => {
//         if (!window.confirm("Apakah Anda yakin ingin memicu pembuatan laporan otomatis?")) return;
        
//         setSedangMemuat(true);
//         try {
//             await buatLaporanBulanan();
//             window.alert("Proses pembuatan laporan berhasil dipicu. Memuat data terbaru...");
//             // Refresh halaman untuk mengambil data terbaru dari server
//             router.refresh(); 
//         } catch (err) {
//             setPesanError(err.message);
//             window.alert(`Terjadi kesalahan: ${err.message}`);
//         } finally {
//             setSedangMemuat(false);
//         }
//     };
    
//     // Menghitung total kas bersih
//     const totalKasBersihBulanan = useMemo(() => {
//         return dataBulanan.reduce((sum, item) => sum + (item.netCash || 0), 0);
//     }, [dataBulanan]);

//     // Handler untuk navigasi kembali
//     const handleKembali = () => router.push("/dashboard/akuntansi/laporan-keuangan");

//     return (
//         <>
//             <KepalaHalaman judul="Laporan Bulanan" saatKembali={handleKembali} />
            
//             <AksiLaporan
//                 bulanDipilih={bulanDipilih}
//                 tahunDipilih={tahunDipilih}
//                 saatUbahBulan={handleUbahBulan}
//                 saatUbahTahun={handleUbahTahun}
//                 saatBuatLaporan={handleBuatLaporan}
//                 saatEksporExcel={() => eksporKeExcel(dataBulanan, bulanDipilih, tahunDipilih)}
//                 saatEksporPDF={() => eksporKePDF(dataBulanan, bulanDipilih, tahunDipilih)}
//                 eksporNonaktif={sedangMemuat || dataBulanan.length === 0}
//                 sedangMemuat={sedangMemuat}
//             />
            
//             {pesanError && <div className="text-center p-4 text-red-600 bg-red-100 rounded-lg mb-4 shadow-sm">Error: {pesanError}</div>}

//             <TabelLaporan
//                 data={dataBulanan}
//                 sedangMemuat={sedangMemuat}
//                 bulanDipilih={bulanDipilih}
//                 tahunDipilih={tahunDipilih}
//             />

//             <TampilanTotalKas total={totalKasBersihBulanan} />
//         </>
//     );
// };

// export default LaporanBulananClient;

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';

// Impor komponen dan utilitas
import Sidebar from "../../Sidebar.jsx"; // Path relatif ke Sidebar
import withAuth from "/src/app/lib/withAuth"; // Path relatif ke withAuth
import KepalaHalaman from "./KepalaHalaman.jsx";
import AksiLaporan from "./AksiLaporan.jsx";
import TabelLaporan from "./TabelLaporan.jsx";
import TampilanTotalKas from "./TampilanTotalKas.jsx";
import { buatLaporanBulanan, eksporKeExcel, eksporKePDF } from "./Utilitas.js";

const LaporanBulananClient = ({ dataAwal, bulanAwal, tahunAwal }) => {
    const router = useRouter();
    
    // State untuk Sidebar, dikelola di sini
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    // State untuk data laporan
    const [dataBulanan, setDataBulanan] = useState(dataAwal);
    const [sedangMemuat, setSedangMemuat] = useState(false);
    const [pesanError, setPesanError] = useState(null);
    const [bulanDipilih, setBulanDipilih] = useState(bulanAwal);
    const [tahunDipilih, setTahunDipilih] = useState(tahunAwal);

    useEffect(() => {
        setDataBulanan(dataAwal);
    }, [dataAwal]);

    const perbaruiURL = (bulan, tahun) => {
        router.push(`/dashboard/akuntansi/laporan-keuangan/bulanan?month=${bulan}&year=${tahun}`);
    };

    const handleUbahBulan = (e) => {
        const bulanBaru = parseInt(e.target.value, 10);
        setBulanDipilih(bulanBaru);
        perbaruiURL(bulanBaru, tahunDipilih);
    };

    const handleUbahTahun = (e) => {
        const tahunBaru = parseInt(e.target.value, 10);
        setTahunDipilih(tahunBaru);
        perbaruiURL(bulanDipilih, tahunBaru);
    };

    const handleBuatLaporan = async () => {
        if (!window.confirm("Apakah Anda yakin ingin memicu pembuatan laporan otomatis?")) return;
        
        setSedangMemuat(true);
        try {
            await buatLaporanBulanan();
            window.alert("Proses pembuatan laporan berhasil dipicu. Memuat data terbaru...");
            router.refresh(); 
        } catch (err) {
            setPesanError(err.message);
            window.alert(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setSedangMemuat(false);
        }
    };
    
    const totalKasBersihBulanan = useMemo(() => {
        return dataBulanan.reduce((sum, item) => sum + (item.netCash || 0), 0);
    }, [dataBulanan]);

    const handleKembali = () => router.push("/dashboard/akuntansi/laporan-keuangan");

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar dan state-nya sekarang dikelola di Client Component ini */}
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            
            <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out" style={{ marginLeft: isSidebarOpen ? '18rem' : '5rem' }}>
                <div className="flex-1 p-6 relative overflow-y-auto">
                    <KepalaHalaman judul="Laporan Bulanan" saatKembali={handleKembali} />
                    <AksiLaporan
                        bulanDipilih={bulanDipilih}
                        tahunDipilih={tahunDipilih}
                        saatUbahBulan={handleUbahBulan}
                        saatUbahTahun={handleUbahTahun}
                        saatBuatLaporan={handleBuatLaporan}
                        saatEksporExcel={() => eksporKeExcel(dataBulanan, bulanDipilih, tahunDipilih)}
                        saatEksporPDF={() => eksporKePDF(dataBulanan, bulanDipilih, tahunDipilih)}
                        eksporNonaktif={sedangMemuat || dataBulanan.length === 0}
                        sedangMemuat={sedangMemuat}
                    />
                    {pesanError && <div className="text-center p-4 text-red-600 bg-red-100 rounded-lg mb-4 shadow-sm">Error: {pesanError}</div>}
                    <TabelLaporan
                        data={dataBulanan}
                        sedangMemuat={sedangMemuat}
                        bulanDipilih={bulanDipilih}
                        tahunDipilih={tahunDipilih}
                    />
                    <TampilanTotalKas total={totalKasBersihBulanan} />
                </div>
            </main>
        </div>
    );
};

// MODIFIKASI: Komponen klien inilah yang dibungkus dengan withAuth
export default withAuth(LaporanBulananClient);