import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = "https://tpapi.siunjaya.id/api";

// --- FUNGSI FORMAT ---

export const formatRupiah = (number) => {
    if (number === null || typeof number === 'undefined' || isNaN(number)) {
        return 'Rp. 0';
    }
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return formatter.format(number).replace(/,/g, '.').replace('Rp', 'Rp.');
};

export const formatDateFull = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
        return dateString;
    }
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

// --- FUNGSI API ---

export const ambilLaporanBulanan = async (month, year) => {
    const response = await fetch(`${API_BASE_URL}/reports/bulan?month=${month}&year=${year}`);
    if (!response.ok) throw new Error('Gagal mengambil data dari server');
    
    const rawData = await response.json();
    if (rawData.success === false || !Array.isArray(rawData.data)) return [];

    return rawData.data.map(item => ({
        reportId: item.report_id,
        reportDate: item.report_date,
        cash: parseFloat(item.cash || 0),
        operational: parseFloat(item.operational || 0),
        expenditure: parseFloat(item.expenditure || 0),
        netCash: parseFloat(item.net_cash || 0),
        cleanOperations: parseFloat(item.clean_operations || 0),
        jeepAmount: parseInt(item.jeep_amount || 0),
    }));
};

export const buatLaporanBulanan = async () => {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Gagal memicu generate laporan: ${response.statusText}`);
    return await response.json();
};

// --- FUNGSI EKSPOR ---

const getExportFileName = (month, year, ext) => {
    const monthName = new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' });
    return `laporan_bulanan_${monthName}_${year}.${ext}`;
};

export const eksporKeExcel = (data, month, year) => {
    if (data.length === 0) {
        alert("Data kosong, tidak bisa export Excel!");
        return;
    }
    const dataToExport = data.map(item => ({
        "Tanggal Laporan": formatDateFull(item.reportDate),
        "Operasional": item.operational,
        "Kas": item.cash,
        "Pengeluaran": item.expenditure,
        "Operasional Bersih": item.cleanOperations,
        "Kas Bersih": item.netCash,
        "Jumlah Jeep": item.jeepAmount,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Bulanan");
    XLSX.writeFile(wb, getExportFileName(month, year, "xlsx"));
};

export const eksporKePDF = (data, month, year) => {
    if (data.length === 0) {
        alert("Data kosong, tidak bisa export PDF!");
        return;
    }
    const doc = new jsPDF('landscape');
    const kolomTabel = ["Tanggal Laporan", "Operasional", "Kas", "Pengeluaran", "Operasional Bersih", "Kas Bersih", "Jumlah Jeep"];
    const barisTabel = data.map(item => [
        formatDateFull(item.reportDate),
        formatRupiah(item.operational),
        formatRupiah(item.cash),
        formatRupiah(item.expenditure),
        formatRupiah(item.cleanOperations),
        formatRupiah(item.netCash),
        item.jeepAmount,
    ]);
    const monthName = new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' });
    doc.text(`Laporan Data Bulanan - ${monthName} ${year}`, 14, 15);
    autoTable(doc, {
        head: [kolomTabel], body: barisTabel, startY: 20,
        styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
        headStyles: { fillColor: [61, 108, 185], fontSize: 9, textColor: [255, 255, 255] },
        didDrawPage: data => {
            doc.setFontSize(7);
            doc.text("Halaman " + doc.internal.getNumberOfPages(), data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });
    doc.save(getExportFileName(month, year, "pdf"));
};