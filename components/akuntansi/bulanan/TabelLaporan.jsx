import { formatRupiah, formatDateFull } from "./Utilitas.js";

const kepalaTabel = ["Tanggal Laporan", "Operasional", "Kas", "Pengeluaran", "Operasional Bersih", "Kas Bersih", "Jumlah Jeep"];

const TabelLaporan = ({ data, sedangMemuat, bulanDipilih, tahunDipilih }) => {
    if (sedangMemuat) {
        return <div className="text-center p-10 text-lg font-medium text-gray-700">Memuat data laporan bulanan, mohon tunggu...</div>;
    }

    const namaBulan = new Date(tahunDipilih, bulanDipilih - 1).toLocaleString('id-ID', { month: 'long' });

    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <div className="max-h-[600px] overflow-y-auto">
                <table className="min-w-full table-auto bg-white text-sm">
                    <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
                        <tr>
                            {kepalaTabel.map((header, index) => (
                                <th key={header} className="p-2 text-center whitespace-nowrap" style={{ borderTopLeftRadius: index === 0 ? "0.5rem" : undefined, borderTopRightRadius: index === kepalaTabel.length - 1 ? "0.5rem" : undefined }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={kepalaTabel.length} className="text-center p-4 text-gray-500 font-medium">
                                    Data Tidak Ditemukan untuk Bulan {namaBulan} {tahunDipilih}
                                </td>
                            </tr>
                        ) : (
                            data.map(item => (
                                <tr key={item.reportId} className="border-b text-center border-blue-200 hover:bg-blue-100 transition duration-200">
                                    <td className="p-3 whitespace-nowrap">{formatDateFull(item.reportDate)}</td>
                                    <td className="p-3 whitespace-nowrap">{formatRupiah(item.operational)}</td>
                                    <td className="p-3 whitespace-nowrap">{formatRupiah(item.cash)}</td>
                                    <td className="p-3 whitespace-nowrap">{formatRupiah(item.expenditure)}</td>
                                    <td className="p-3 whitespace-nowrap">{formatRupiah(item.cleanOperations)}</td>
                                    <td className="p-3 whitespace-nowrap">{formatRupiah(item.netCash)}</td>
                                    <td className="p-3 whitespace-nowrap">{item.jeepAmount ?? '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TabelLaporan;