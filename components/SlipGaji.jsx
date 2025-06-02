//"use client";

//import React from "react";
//import { useRouter } from "next/navigation";
////import html2pdf from "html2pdf.js";
////import Image from "next/image";

//export default function SlipGaji({ show, onClose, nama, tanggal, role, totalGaji, data }) {
//  const slipRef = useRef();

//  if (!show) return null;

//  const formatRupiah = (num) =>
//    new Intl.NumberFormat("id-ID", {
//      style: "currency",
//      currency: "IDR",
//    }).format(num);

//  const formatTanggal = (tgl) =>
//    new Date(tgl).toLocaleDateString("id-ID", {
//      day: "numeric",
//      month: "long",
//      year: "numeric",
//    });

//  const handleDownload = () => {
//    const element = slipRef.current;
//    html2pdf().set({
//      margin: 10,
//      filename: `Slip-Gaji-${nama}-${role}.pdf`,
//      html2canvas: { scale: 2 },
//      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//    }).from(element).save();
//  };

//  const handlePrint = () => {
//    const printContent = slipRef.current.innerHTML;
//    const printWindow = window.open("", "", "width=800,height=600");
//    printWindow.document.write(`
//      <html>
//        <head>
//          <title>Slip Gaji</title>
//          <style>
//            body { font-family: sans-serif; padding: 20px; }
//            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//            td, th { padding: 8px; border: 1px solid #ccc; text-align: left; }
//            .header { text-align: center; }
//          </style>
//        </head>
//        <body>${printContent}</body>
//      </html>
//    `);
//    printWindow.document.close();
//    printWindow.focus();
//    printWindow.print();
//  };

//  const renderTable = () => {
//    if (role === "driver") {
//      return (
//        <>
//          <h3 className="font-semibold text-sm mt-4 mb-2">Penerimaan</h3>
//          {data.map((item, index) => (
//            <div key={index} className="flex justify-between text-sm">
//              <span>Paket {item.package?.slug.split("-")[1]}</span>
//              <span>{formatRupiah(item.package?.price)}</span>
//            </div>
//          ))}
//          <h3 className="font-semibold text-sm mt-4 mb-2">Potongan</h3>
//          {data.map((item, index) => (
//            <div key={index} className="flex justify-between text-sm">
//              <span>Kas Paket {item.package?.slug.split("-")[1]}</span>
//              <span>{formatRupiah(item.package?.kas)}</span>
//            </div>
//          ))}
//          <div className="mt-4 flex justify-between font-semibold text-base">
//            <span>Total Gaji</span>
//            <span>{formatRupiah(totalGaji)}</span>
//          </div>
//        </>
//      );
//    }

//    if (role === "owner") {
//      return (
//        <div className="mt-4 flex justify-between font-semibold text-base">
//          <span>Total Gaji Owner</span>
//          <span>{formatRupiah(totalGaji)}</span>
//        </div>
//      );
//    }

//    if (role === "front office") {
//      return (
//        <div className="mt-4 flex justify-between font-semibold text-base">
//          <span>Gaji Tetap Bulanan</span>
//          <span>{formatRupiah(totalGaji)}</span>
//        </div>
//      );
//    }

//    return null;
//  };

//  return (
//    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//      <div className="bg-white w-full max-w-xl rounded-md shadow-lg p-6 relative">
//        <button
//          className="absolute top-2 right-2 text-sm text-gray-500 hover:text-red-500"
//          onClick={onClose}
//        >
//          ×
//        </button>

//        <div className="flex items-center mb-2">
//          <img
//              src="/images/logo.png"
//              alt="Logo"
//             width={50} height={50} className="mr-4"
//            />
//          <div className="text-center flex-1">
//            <h2 className="text-lg font-bold">Jeep Tlogo Putri</h2>
//            <p className="text-sm">Jl. Kaliurang Km 20, Sleman, Yogyakarta</p>
//            <p className="text-sm">Telp: 0812-3456-7890</p>
//          </div>
//        </div>

//        <hr className="my-2 border-gray-400" />

//        <div className="text-center">
//          <h3 className="text-base font-semibold uppercase tracking-wider">Slip Gaji</h3>
//          <p className="text-sm text-gray-600">{formatTanggal(tanggal)}</p>
//        </div>

//        <div className="mt-4">
//          <p className="text-sm mb-1">
//            <strong>Nama:</strong> {nama}
//          </p>
//          <p className="text-sm mb-4">
//            <strong>Role:</strong> {role}
//          </p>

//          {renderTable()}
//        </div>
//      </div>
//    </div>
//  );
//}

//"use client";

////import React from "react";
//import React from "react";
//import {useEffect,useRef } from "react";
//import { jsPDF } from "jspdf";
//import autoTable from "jspdf-autotable";

//const formatRupiah = (num) =>
//  new Intl.NumberFormat("id-ID", {
//    style: "currency",
//    currency: "IDR",
//  }).format(num);

//const formatTanggal = (tgl) =>
//  new Date(tgl).toLocaleDateString("id-ID", {
//    day: "numeric",
//    month: "long",
//    year: "numeric",
//  });

//function SlipGaji({ nama, tanggal, role, totalGaji, data, onClose }) {
//     const printedRef = useRef(false);

//    useEffect(() => {
//    console.log("Data SlipGaji:", { nama, tanggal, role, totalGaji, data });
//     if (printedRef.current) return; // kalau sudah cetak, skip

//    printedRef.current = true;

//    const doc = new jsPDF();
//    // Header
//    doc.setFontSize(16);
//    doc.text("Jeep Tlogo Putri", 105, 15, null, null, "center");
//    doc.setFontSize(10);
//    doc.text("Jl. Kaliurang Km 20, Sleman, Yogyakarta", 105, 22, null, null, "center");
//    doc.text("Telp: 0812-3456-7890", 105, 28, null, null, "center");
//    doc.line(20, 32, 190, 32);
//    doc.setFontSize(12);
//    doc.text("Slip Gaji", 105, 40, null, null, "center");
//    doc.setFontSize(10);
//    doc.text(`Tanggal: ${formatTanggal(tanggal)}`, 105, 46, null, null, "center");

//    // Info user
//    doc.text(`Nama: ${nama}`, 20, 60);
//    doc.text(`Role: ${role}`, 20, 68);

//    let y = 80;

//    if (role.toLowerCase() === "driver") {
//      // Penerimaan
//      doc.setFontSize(11);
//      doc.text("Penerimaan:", 20, y);
//      y += 8;

//      const penerimaanColumns = ["No", "Deskripsi", "Jumlah"];
//      const penerimaanRows = data.map((item, i) => [
//        i + 1,
//        `Paket ${item.package?.slug?.split("-")[1]}`,
//        formatRupiah(item.package?.price || 0),
//      ]);

//      autoTable(doc,{
//        head: [penerimaanColumns],
//        body: penerimaanRows,
//        startY: y,
//        theme: "grid",
//        margin: { left: 20, right: 20 },
//        styles: { fontSize: 10 },
//      });

//      y = doc.lastAutoTable.finalY + 10;

//      // Bonus Driver
//      if (data.some((item) => item.bonus_driver > 0)) {
//        doc.text("Bonus Driver:", 20, y);
//        y += 8;

//        const bonusRows = data
//          .filter((item) => item.bonus_driver > 0)
//          .map((item, i) => [
//            i + 1,
//            `Paket ${item.package?.slug?.split("-")[1]}`,
//            formatRupiah(item.bonus_driver),
//          ]);

//        autoTable(doc,{
//          head: [["No", "Deskripsi", "Jumlah"]],
//          body: bonusRows,
//          startY: y,
//          theme: "grid",
//          margin: { left: 20, right: 20 },
//          styles: { fontSize: 10 },
//        });

//        y = doc.lastAutoTable.finalY + 10;
//      }

//      // Potongan
//      doc.text("Potongan:", 20, y);
//      y += 8;

//      const potonganColumns = ["No", "Deskripsi", "Jumlah"];
//      const potonganRows = [];

//      const potonganList = [
//        { title: "Marketing", key: "referral_cut" },
//        { title: "Kas", key: "package.kas" },
//        { title: "Operasional", key: "package.operasional" },
//        { title: "Owner (30%)", key: "owner_share" },
//      ];

//      potonganList.forEach(({ title, key }) => {
//        data.forEach((item, i) => {
//          let value = 0;
//          if (key.includes("package.")) {
//            const subKey = key.split(".")[1];
//            value = item.package?.[subKey] || 0;
//          } else {
//            value = item[key] || 0;
//          }
//          potonganRows.push([
//            i + 1,
//            `${title} - Paket ${item.package?.slug?.split("-")[1]}`,
//            formatRupiah(value),
//          ]);
//        });
//      });

//      autoTable(doc,{
//        head: [potonganColumns],
//        body: potonganRows,
//        startY: y,
//        theme: "grid",
//        margin: { left: 20, right: 20 },
//        styles: { fontSize: 10 },
//      });

//      y = doc.lastAutoTable.finalY + 10;
//    } else if (role.toLowerCase() === "owner") {
//      doc.setFontSize(11);
//      doc.text("Pendapatan Owner:", 20, y);
//      y += 8;

//      const ownerColumns = ["No", "Deskripsi", "Jumlah"];
//      const ownerRows = data.map((item, i) => [
//        i + 1,
//        `Paket ${item.package?.slug?.split("-")[1]}`,
//        formatRupiah(item.owner_share),
//      ]);

//      autoTable(doc,{
//        head: [ownerColumns],
//        body: ownerRows,
//        startY: y,
//        theme: "grid",
//        margin: { left: 20, right: 20 },
//        styles: { fontSize: 10 },
//      });

//      y = doc.lastAutoTable.finalY + 10;
//    } else if (role.toLowerCase() === "front office") {
//      doc.setFontSize(11);
//      doc.text("Gaji Tetap Bulanan:", 20, y);
//      doc.text(formatRupiah(totalGaji), 180, y, null, null, "right");
//      y += 10;

//    } else if (role.toLowerCase() === "owner") {
//      doc.setFontSize(11);
//      doc.text("Pendapatan Owner:", 20, y);
//      y += 8;

//      const ownerColumns = ["No", "Deskripsi", "Jumlah"];
//      const ownerRows = data.map((item, i) => [
//        i + 1,
//        `Paket ${item.package?.slug?.split("-")[1] || "unknown"}`,
//        formatRupiah(item.owner_share || 0),
//      ]);

//      autoTable(doc,{
//        head: [ownerColumns],
//        body: ownerRows,
//        startY: y,
//        theme: "grid",
//        margin: { left: 20, right: 20 },
//        styles: { fontSize: 10 },
//      });

//      y = doc.lastAutoTable.finalY + 10;
//    } else if (role.toLowerCase() === "front office") {
//      doc.setFontSize(11);
//      doc.text("Gaji Tetap Bulanan:", 20, y);
//      doc.text(formatRupiah(totalGaji || 0), 180, y, null, null, "right");
//      y += 10;
//    }

//    // Total Gaji
//    doc.setFont(undefined, "bold");
//    doc.setFontSize(12);
//    doc.text("Total Gaji:", 20, y + 10);
//    doc.text(formatRupiah(totalGaji || 0), 180, y + 10, null, null, "right");

//    doc.save(`Slip-Gaji-${nama}-${role}.pdf`);

//    // Tutup modal setelah selesai cetak
//     if (onClose) {
//      onClose();
//    }
//  }, [nama, tanggal, role, totalGaji, data, onClose]);

//  return null;
//}
//export default SlipGaji;

"use client";

import { useEffect, useRef } from "react";
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

function SlipGaji({ nama, tanggal, role, totalGaji, data, onClose }) {
  const printedRef = useRef(false);

  useEffect(() => {
    if (printedRef.current) return;
    printedRef.current = true;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoImg = new Image();
    logoImg.src = "/images/logo.png";

    // Header
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

    // Info user
    doc.text(`Nama: ${nama}`, 20, 60);
    doc.text(`Role: ${role}`, 20, 68);
    doc.line(10, 40, pageWidth - 10, 40);

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

    doc.save(`Slip-Gaji-${nama}-${role}.pdf`);

    if (onClose) onClose();
  }, [nama, tanggal, role, totalGaji, data, onClose]);

  return null;
}

export default SlipGaji;
