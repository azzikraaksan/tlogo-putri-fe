import { useMemo } from 'react';
import { FileText, FileSpreadsheet, Zap } from "lucide-react";

const dapatkanBulan = () => Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(2000, i).toLocaleString('id-ID', { month: 'long' }) }));
const dapatkanTahun = () => {
    const tahunSekarang = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => tahunSekarang - 5 + i);
};

const AksiLaporan = ({
    bulanDipilih,
    tahunDipilih,
    saatUbahBulan,
    saatUbahTahun,
    saatBuatLaporan,
    saatEksporExcel,
    saatEksporPDF,
    eksporNonaktif,
    sedangMemuat
}) => {
    const daftarBulan = useMemo(() => dapatkanBulan(), []);
    const daftarTahun = useMemo(() => dapatkanTahun(), []);

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex gap-4 flex-wrap">
                <div className="flex gap-2 items-center">
                    <select value={bulanDipilih} onChange={saatUbahBulan} className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black cursor-pointer">
                        {daftarBulan.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                    </select>
                    <select value={tahunDipilih} onChange={saatUbahTahun} className="px-3 py-2 rounded-lg border border-gray-300 shadow bg-white text-black cursor-pointer">
                        {daftarTahun.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <button onClick={saatBuatLaporan} disabled={sedangMemuat} className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-[#3D6CB9] hover:bg-[#B8D4F9] text-white hover:text-black cursor-pointer disabled:bg-gray-400">
                    <Zap size={20} /> <span>{sedangMemuat ? 'Memproses...' : 'Buat Laporan'}</span>
                </button>
            </div>
            <div className="flex gap-4">
                <button onClick={saatEksporExcel} disabled={eksporNonaktif} className="flex items-center gap-2 px-4 py-2 rounded-lg shadow disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed bg-green-100 text-black hover:bg-[#B8D4F9]">
                    <FileSpreadsheet size={20} color={eksporNonaktif ? "gray" : "green"} /> <span>Ekspor Excel</span>
                </button>
                <button onClick={saatEksporPDF} disabled={eksporNonaktif} className="flex items-center gap-2 px-4 py-2 rounded-lg shadow disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed bg-red-100 text-black hover:bg-[#B8D4F9]">
                    <FileText size={20} color={eksporNonaktif ? "gray" : "red"} /> <span>Ekspor PDF</span>
                </button>
            </div>
        </div>
    );
};

export default AksiLaporan;