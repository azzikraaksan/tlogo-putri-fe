"use client";

import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(num);

const formatTanggal = (tgl) =>
  new Date(tgl).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const generateSlipPDFBlob = async (
  nama,
  tanggal,
  role,
  totalGaji,
  data
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoImg = new Image();
  logoImg.src = "/images/logo.png";

  await new Promise((resolve) => {
    logoImg.onload = resolve;
  });

  doc.addImage(logoImg, "PNG", 10, 10, 30, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Jeep Tlogo Putri", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Alamat: Jl. Kaliurang Km 20, Sleman, Yogyakarta",
    pageWidth / 2,
    20,
    { align: "center" }
  );
  doc.text("Telp: 0812-3456-7890", pageWidth / 2, 25, { align: "center" });
  doc.line(10, 40, pageWidth - 10, 40);
  doc.setFont("helvetica", "bold");
  doc.text("SLIP GAJI", pageWidth / 2, 45, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Tanggal: ${formatTanggal(tanggal)}`, pageWidth / 2, 50, {
    align: "center",
  });
  doc.text(`Nama: ${nama}`, 20, 60);
  doc.text(`Role: ${role}`, 20, 68);

  let y = 80;

  if (role.toLowerCase() === "driver") {
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Penerimaan", 20, y);
    doc.text("Potongan", 115, y);
    doc.setFont(undefined, "normal");
    y += 8;

    const penerimaanRows = data.map((item) => [
      `Paket ${item.package?.slug?.split("-")[1]}`,
      formatRupiah(item.package?.price || 0),
    ]);

    autoTable(doc, {
      head: [["Deskripsi", "Jumlah"]],
      body: penerimaanRows,
      startY: y,
      margin: { left: 20 },
      styles: {
        fontSize: 10,
        halign: "left",
      },
      headStyles: {
        fillColor: [30, 100, 255],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: 20,
      },
      tableWidth: 80,
    });

    const potonganRows = [];
    const potonganList = [
      { title: "Marketing", key: "referral_cut" },
      { title: "Kas", key: "package.kas" },
      { title: "Operasional", key: "package.operasional" },
      { title: "Owner", key: "owner_share" },
    ];

    potonganList.forEach(({ title, key }) => {
      data.forEach((item) => {
        let value = 0;
        if (key.includes("package.")) {
          const subKey = key.split(".")[1];
          value = item.package?.[subKey] || 0;
        } else {
          value = item[key] || 0;
        }
        potonganRows.push([
          `${title} - Paket ${item.package?.slug?.split("-")[1]}`,
          formatRupiah(value),
        ]);
      });
    });

    autoTable(doc, {
      head: [["Deskripsi", "Jumlah"]],
      body: potonganRows,
      startY: y,
      margin: { left: 115 },
      styles: {
        fontSize: 10,
        halign: "left",
      },
      headStyles: {
        fillColor: [30, 100, 255],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: 20,
      },
      tableWidth: 75,
    });

    y = Math.max(doc.lastAutoTable.finalY, doc.lastAutoTable.finalY) + 10;
    const totalPenerimaan = data.reduce(
      (acc, item) => acc + (item.package?.price || 0),
      0
    );
    const totalPotongan = potonganList.reduce((acc, potongan) => {
      return (
        acc +
        data.reduce((subAcc, item) => {
          let value = 0;
          if (potongan.key.includes("package.")) {
            const subKey = potongan.key.split(".")[1];
            value = item.package?.[subKey] || 0;
          } else {
            value = item[potongan.key] || 0;
          }
          return subAcc + value;
        }, 0)
      );
    }, 0);

    doc.setFont(undefined, "bold");
    doc.text("Total Penerimaan", 20, y);
    doc.text(formatRupiah(totalPenerimaan), 100, y, null, null, "right");
    doc.text("Total Potongan", 115, y);
    doc.text(formatRupiah(totalPotongan), 195, y, null, null, "right");
    doc.line(10, 40, pageWidth - 10, 40);

    y += 10;
  } else if (role.toLowerCase() === "owner") {
    doc.setFontSize(11);
    doc.text("Pendapatan Owner:", 20, y);
    y += 8;

    const ownerRows = data.map((item, i) => [
      `Paket ${item.package?.slug?.split("-")[1] || "unknown"}`,
      formatRupiah(item.owner_share || 0),
    ]);

    autoTable(doc, {
      head: [["Deskripsi", "Jumlah"]],
      body: ownerRows,
      startY: y,
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 10,
        halign: "left",
      },
      headStyles: {
        fillColor: [30, 100, 255],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: 20,
      },
    });

    y = doc.lastAutoTable.finalY + 10;
  } else if (role.toLowerCase() === "front office") {
    doc.setFontSize(11);
    doc.text("Gaji Tetap Bulanan:", 20, y);

    autoTable(doc, {
      head: [["Deskripsi", "Jumlah"]],
      body: [["Gaji Bulanan", formatRupiah(totalGaji || 0)]],
      startY: y + 5,
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 10,
        halign: "left",
      },
      headStyles: {
        fillColor: [30, 100, 255],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: 20,
      },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("Total Jumlah Gaji:", 70, y + 10);
  doc.text(formatRupiah(totalGaji || 0), 140, y + 10, null, null, "right");

// Titik awal tanda tangan di kanan bawah
const footerStartY = y + 40;
const rightX = 150;

doc.setFontSize(10);
doc.setFont("helvetica", "normal");

// 1. Lokasi dan tanggal
doc.text(`Yogyakarta, ${formatTanggal(tanggal)}`, rightX, footerStartY, { align: "center" });

// 2. Spasi kosong untuk tanda tangan (3 baris)
doc.text(" ", rightX, footerStartY + 8);  // spasi kosong
doc.text(" ", rightX, footerStartY + 14); // spasi kosong

// 3. Nama
doc.setFont("helvetica", "bold");
doc.text("Inuk", rightX, footerStartY + 24, { align: "center" });

// 4. Jabatan
doc.setFont("helvetica", "normal");
doc.text("Ketua Pengurus Jeep Tlogo Putri", rightX, footerStartY + 30, { align: "center" });


  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};

export default function SlipGajiModal({
  nama,
  tanggal,
  role,
  totalGaji,
  data,
  onClose,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    (async () => {
      const url = await generateSlipPDFBlob(
        nama,
        tanggal,
        role,
        totalGaji,
        data
      );
      setPreviewUrl(url);
    })();
  }, [nama, tanggal, role, totalGaji, data]);

  const handleDownload = async () => {
    const url = await generateSlipPDFBlob(nama, tanggal, role, totalGaji, data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Slip-Gaji-${nama}-${role}.pdf`;
    a.click();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-transparent flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-md w-full max-w-3xl h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-2">Preview Slip Gaji</h2>
        <div className="flex-1 overflow-auto border">
          {previewUrl ? (
            <iframe src={previewUrl} className="w-full h-full" />
          ) : (
            <p className="text-center mt-4">Memuat preview...</p>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cetak Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
