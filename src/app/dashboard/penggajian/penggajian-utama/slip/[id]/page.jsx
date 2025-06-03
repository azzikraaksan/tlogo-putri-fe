"use client";

import React from "react";

export default function SlipGaji({ id, nama, role, status, tanggal }) {
  // Format tanggal untuk tampil di slip
  const formatTanggal = (tgl) =>
    new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Data contoh perhitungan gaji (bisa kamu ganti jadi dinamis jika sudah ada API)
  const dataGaji = {
    Driver: {
      penerimaan: [
        { label: "Paket 1", amount: 400000 },
        { label: "Paket 3", amount: 405000 },
        { label: "Bonus Marketing Paket 3 (OP)", amount: 30000 },
      ],
      potongan: [
        { label: "Kas Paket 1", amount: 65000 },
        { label: "Kas Paket 3", amount: 50000 },
        { label: "Owner Paket 1 (30%)", amount: 120000 },
        { label: "Owner Paket 3 (30%)", amount: 121500 },
      ],
    },
    Owner: {
      pendapatan: [
        { label: "Paket 1 (30%)", amount: 120000 },
        { label: "Paket 3 (30%)", amount: 121500 },
      ],
    },
    "Front Office": {
      gajiTetap: [{ label: "Gaji", amount: 2125000 }],
    },
  };

  // Fungsi helper menghitung total
  const totalAmount = (items) =>
    items.reduce((total, item) => total + item.amount, 0);

  return (
    <div className="p-6 print:p-0 print:shadow-none print:bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Slip Gaji</h2>
      <div className="mb-4">
        <div>
          <strong>ID Karyawan:</strong> {id}
        </div>
        <div>
          <strong>Nama:</strong> {nama}
        </div>
        <div>
          <strong>Posisi:</strong> {role}
        </div>
        <div>
          <strong>Periode Penggajian:</strong>{" "}
          {tanggal ? formatTanggal(tanggal) : "-"}
        </div>
        <div>
          <strong>Status:</strong> {status}
        </div>
      </div>

      {/* Render berdasarkan role */}
      {role === "Driver" && (
        <>
          <div className="grid grid-cols-2 gap-4 border border-gray-300 rounded-md overflow-hidden mb-4">
            <div>
              <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                Penerimaan
              </div>
              <div className="p-4 text-sm space-y-2">
                {dataGaji.Driver.penerimaan.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between border-b border-gray-200"
                  >
                    <span>{item.label}</span>
                    <span>Rp {item.amount.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
              <div className="font-semibold p-4 border-t border-gray-300 flex justify-between">
                <span>Total Penerimaan</span>
                <span>
                  Rp {totalAmount(dataGaji.Driver.penerimaan).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div>
              <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                Potongan
              </div>
              <div className="p-4 text-sm space-y-2">
                {dataGaji.Driver.potongan.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between border-b border-gray-200"
                  >
                    <span>{item.label}</span>
                    <span>Rp {item.amount.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
              <div className="font-semibold p-4 border-t border-gray-300 flex justify-between">
                <span>Total Potongan</span>
                <span>
                  Rp {totalAmount(dataGaji.Driver.potongan).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
          <div className="text-center font-bold text-lg">
            Total Gaji: Rp{" "}
            {(totalAmount(dataGaji.Driver.penerimaan) -
              totalAmount(dataGaji.Driver.potongan)
            ).toLocaleString("id-ID")}
          </div>
        </>
      )}

      {role === "Owner" && (
        <div className="border border-gray-300 rounded-md overflow-hidden p-4 mb-4">
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold mb-2">
            Pendapatan Owner
          </div>
          {dataGaji.Owner.pendapatan.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between border-b border-gray-200 py-1"
            >
              <span>{item.label}</span>
              <span>Rp {item.amount.toLocaleString("id-ID")}</span>
            </div>
          ))}
          <div className="font-semibold pt-2 flex justify-between text-sm border-t border-gray-300">
            <span>Total Pendapatan</span>
            <span>
              Rp {totalAmount(dataGaji.Owner.pendapatan).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}

      {role === "Front Office" && (
        <div className="border border-gray-300 rounded-md overflow-hidden p-4 mb-4">
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold mb-2">
            Gaji Tetap
          </div>
          {dataGaji["Front Office"].gajiTetap.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between border-b border-gray-200 py-1"
            >
              <span>{item.label}</span>
              <span>Rp {item.amount.toLocaleString("id-ID")}</span>
            </div>
          ))}
          <div className="font-semibold pt-2 flex justify-between text-sm border-t border-gray-300">
            <span>Total Gaji</span>
            <span>
              Rp {totalAmount(dataGaji["Front Office"].gajiTetap).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}

      {/* Jika role tidak dikenali */}
      {!["Driver", "Owner", "Front Office"].includes(role) && (
        <div className="text-red-600 font-semibold text-center">
          Role tidak dikenali.
        </div>
      )}

      <div className="text-xs text-center text-gray-500 mt-8 print:hidden">
        Slip gaji ini dicetak pada: {new Date().toLocaleString("id-ID")}
      </div>
    </div>
  );
}
