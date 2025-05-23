// D:\laragon\www\tlogo-putri-fe\src\app\dashboard\akuntansi\laporan-keuangan\harian\edit-harian\[id]\page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { XCircle } from "lucide-react";

// Komponen halaman Edit Laporan Harian
const EditHarianPage = () => {
    const router = useRouter();
    const params = useParams();
    const { id: laporanHarianId } = params; // Mengambil ID laporan harian dari URL

    const [formData, setFormData] = useState({
        idLaporanHarian: "",
        idPemesanan: "",
        idGaji: "",
        noLB: "",
        paket: "",
        keterangan: "",
        kode: "",
        marketing: "",
        kas: "",
        opp: "",
        driverBayar: "",
        totalKas: "",
        jumlah: "",
        harga: "",
        driverTerima: "",
        tamuBayar: "",
        tunai: "",
        debit: "",
        waktuTiba: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efek samping untuk memuat data laporan harian berdasarkan ID dari localStorage
    useEffect(() => {
        if (laporanHarianId) {
            setIsLoading(true);
            const storedDataString = localStorage.getItem("dataHarian");
            if (storedDataString) {
                const allData = JSON.parse(storedDataString);
                const dataToEdit = allData.find(item => item.idLaporanHarian === laporanHarianId);
                if (dataToEdit) {
                    setFormData({
                        idLaporanHarian: dataToEdit.idLaporanHarian,
                        idPemesanan: dataToEdit.idPemesanan,
                        idGaji: dataToEdit.idGaji,
                        noLB: dataToEdit.noLB,
                        paket: dataToEdit.paket,
                        keterangan: dataToEdit.keterangan,
                        kode: dataToEdit.kode,
                        marketing: dataToEdit.marketing,
                        kas: dataToEdit.kas,
                        opp: dataToEdit.opp,
                        driverBayar: dataToEdit.driverBayar,
                        totalKas: dataToEdit.totalKas,
                        jumlah: dataToEdit.jumlah,
                        harga: dataToEdit.harga,
                        driverTerima: dataToEdit.driverTerima,
                        tamuBayar: dataToEdit.tamuBayar,
                        tunai: dataToEdit.tunai,
                        debit: dataToEdit.debit,
                        waktuTiba: dataToEdit.waktuTiba,
                    });
                } else {
                    alert("Data laporan harian tidak ditemukan.");
                    router.replace("/dashboard/akuntansi/laporan-keuangan/harian"); // Redirect jika data tidak ditemukan
                }
            } else {
                alert("Tidak ada data laporan harian di penyimpanan. Kembali ke halaman utama.");
                router.replace("/dashboard/akuntansi/laporan-keuangan/harian"); // Redirect jika penyimpanan kosong
            }
            setIsLoading(false);
        }
    }, [laporanHarianId, router]);

    // Handler perubahan input form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Fungsi validasi form
    const validateForm = () => {
        if (
            !formData.idPemesanan ||
            !formData.noLB ||
            !formData.paket ||
            !formData.keterangan ||
            !formData.kas ||
            !formData.totalKas ||
            !formData.jumlah ||
            !formData.harga ||
            !formData.tamuBayar
        ) {
            alert("Harap isi semua field yang wajib diisi!");
            return false;
        }
        return true;
    };

    // Handler submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const storedDataString = localStorage.getItem("dataHarian");
        if (storedDataString) {
            let allData = JSON.parse(storedDataString);
            const updatedAllData = allData.map(item =>
                item.idLaporanHarian === laporanHarianId ? {
                    ...formData,
                    // Konversi ke angka jika diperlukan untuk perhitungan, tetapi simpan sebagai string
                    // kas: parseFloat(formData.kas) || 0,
                    // opp: parseFloat(formData.opp) || 0,
                    // driverBayar: parseFloat(formData.driverBayar) || 0,
                    // totalKas: parseFloat(formData.totalKas) || 0,
                    // jumlah: parseInt(formData.jumlah, 10) || 0,
                    // harga: parseFloat(formData.harga) || 0,
                    // driverTerima: parseFloat(formData.driverTerima) || 0,
                    // tamuBayar: parseFloat(formData.tamuBayar) || 0,
                    // tunai: parseFloat(formData.tunai) || 0,
                    // debit: parseFloat(formData.debit) || 0,
                } : item
            );
            localStorage.setItem("dataHarian", JSON.stringify(updatedAllData));
            window.dispatchEvent(new CustomEvent('dataHarianUpdated')); // Memicu pembaruan
            alert("Data laporan harian berhasil diperbarui!");
            router.back(); // Kembali ke halaman sebelumnya (HarianPage)
        } else {
            alert("Gagal memperbarui, data sumber tidak ditemukan.");
        }
        setIsSubmitting(false);
    };

    // Handler tombol batal/tutup modal
    const handleCancel = () => {
        router.back(); // Kembali ke halaman sebelumnya (menutup modal)
    };

    // Tampilan saat loading data
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
                    Memuat data untuk diedit...
                </div>
            </div>
        );
    }

    // Tampilan saat data tidak ditemukan setelah loading
    if (!formData.idLaporanHarian && !isLoading) {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all flex items-center justify-center min-h-[200px]">
                    Data laporan harian tidak ditemukan.
                </div>
            </div>
        );
    }

    return (
        // Wrapper ini membuat halaman ini terlihat seperti modal overlay
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative">
                <h2 className="text-[24px] font-medium mb-4 text-black">
                    Edit Laporan Harian: {formData.idLaporanHarian}
                </h2>
                <button
                    onClick={handleCancel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Tutup"
                >
                    <XCircle size={24} />
                </button>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"> {/* Tambah overflow-y-auto */}
                    <div className="mb-4">
                        <label htmlFor="idLaporanHarian_display" className="block text-sm font-medium text-gray-700 mb-1">
                            ID Laporan Harian
                        </label>
                        <input
                            type="text"
                            id="idLaporanHarian_display"
                            value={formData.idLaporanHarian}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="idPemesanan" className="block text-sm font-medium text-gray-700 mb-1">
                            ID Pemesanan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="idPemesanan"
                            name="idPemesanan"
                            value={formData.idPemesanan}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="idGaji" className="block text-sm font-medium text-gray-700 mb-1">
                            ID Gaji
                        </label>
                        <input
                            type="text"
                            id="idGaji"
                            name="idGaji"
                            value={formData.idGaji}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="noLB" className="block text-sm font-medium text-gray-700 mb-1">
                            No. LB <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="noLB"
                            name="noLB"
                            value={formData.noLB}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="paket" className="block text-sm font-medium text-gray-700 mb-1">
                            Paket <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="paket"
                            name="paket"
                            value={formData.paket}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
                            Keterangan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="keterangan"
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleInputChange}
                            rows="2"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="kode" className="block text-sm font-medium text-gray-700 mb-1">
                            Kode
                        </label>
                        <input
                            type="text"
                            id="kode"
                            name="kode"
                            value={formData.kode}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="marketing" className="block text-sm font-medium text-gray-700 mb-1">
                            Marketing
                        </label>
                        <input
                            type="text"
                            id="marketing"
                            name="marketing"
                            value={formData.marketing}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="kas" className="block text-sm font-medium text-gray-700 mb-1">
                            Kas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="kas"
                            name="kas"
                            value={formData.kas}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="opp" className="block text-sm font-medium text-gray-700 mb-1">
                            OPP
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="opp"
                            name="opp"
                            value={formData.opp}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="driverBayar" className="block text-sm font-medium text-gray-700 mb-1">
                            Driver Bayar
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="driverBayar"
                            name="driverBayar"
                            value={formData.driverBayar}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="totalKas" className="block text-sm font-medium text-gray-700 mb-1">
                            Total Kas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="totalKas"
                            name="totalKas"
                            value={formData.totalKas}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="jumlah"
                            name="jumlah"
                            value={formData.jumlah}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-1">
                            Harga <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="harga"
                            name="harga"
                            value={formData.harga}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="driverTerima" className="block text-sm font-medium text-gray-700 mb-1">
                            Driver Terima
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="driverTerima"
                            name="driverTerima"
                            value={formData.driverTerima}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="tamuBayar" className="block text-sm font-medium text-gray-700 mb-1">
                            Tamu Bayar <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="tamuBayar"
                            name="tamuBayar"
                            value={formData.tamuBayar}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="tunai" className="block text-sm font-medium text-gray-700 mb-1">
                            Tunai
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="tunai"
                            name="tunai"
                            value={formData.tunai}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="debit" className="block text-sm font-medium text-gray-700 mb-1">
                            Debit
                        </label>
                        <input
                            type="text" // Ubah ke text untuk mempertahankan format string
                            id="debit"
                            name="debit"
                            value={formData.debit}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="waktuTiba" className="block text-sm font-medium text-gray-700 mb-1">
                            Waktu Tiba
                        </label>
                        <input
                            type="time"
                            id="waktuTiba"
                            name="waktuTiba"
                            value={formData.waktuTiba}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-[#3D6CB9] rounded-md hover:bg-[#315694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D6CB9]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditHarianPage;
