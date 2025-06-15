"use client";
import { useState, useEffect } from "react";
import React from "react";
import Sidebar from "/components/Sidebar.jsx";
import LoadingRow from "/components/LoadingRow.jsx";
import SearchInput from "/components/Search.jsx";
import TicketModal from "/components/TicketModal.jsx";
import withAuth from "/src/app/lib/withAuth";
import { Printer, History, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Hashids from "hashids";

const TicketingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [checked, setChecked] = useState([]);
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loadingRotation, setLoadingRotation] = useState(false);
  const [assignedDrivers, setAssignedDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isAlreadyRolled, setIsAlreadyRolled] = useState(false);
  const [rotations, setRotations] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [rotationData, setRotationData] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const [loadingDrivers, setLoadingDrivers] = React.useState({});
  const [processingId, setProcessingId] = useState(null);
  const [items, setItems] = useState(data);

  useEffect(() => {
    const fetchRotationData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const besok = new Date();
      besok.setDate(besok.getDate() + 1);
      const formattedBesok = besok.toISOString().split("T")[0];

      const res = await fetch(
        `https://tpapi.siunjaya.id/api/driver-rotations?date=${formattedBesok}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setRotationData(data);
      }
    };

    fetchRotationData();
    fetchTicketings();
    checkRollingStatus();
  }, []);

  const fetchTicketings = async () => {
    try {
      setLoading(true);

      const jeepRes = await fetch("https://tpapi.siunjaya.id/api/jeeps/all");
      const jeepJson = await jeepRes.json();
      const jeeps = jeepJson.data || [];

      const response = await fetch("https://tpapi.siunjaya.id/api/ticketings/all");
      const ticketingData = await response.json();
      console.log("✅ Data ticketing:", ticketingData);

      const token = localStorage.getItem("access_token");
      const besok = new Date();
      besok.setDate(besok.getDate() + 1);
      const tanggalBesok = besok.toISOString().split("T")[0];

      const rotationRes = await fetch(
        `https://tpapi.siunjaya.id/api/driver-rotations?date=${tanggalBesok}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rotationData = await rotationRes.json();
      setRotations(rotationData);

      for (const rotasi of rotationData) {
        if (rotasi.skip_reason) {
          const tiketTerkait = ticketingData.filter(
            (t) => t.driver_id === rotasi.driver_id
          );

          for (const tiket of tiketTerkait) {
            try {
              const res = await fetch(
                `https://tpapi.siunjaya.id/api/ticketings/delete/${tiket.id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              if (res.ok) {
                console.log(
                  `🗑️ Tiket ${tiket.id} dihapus karena skip_reason untuk driver_id ${rotasi.driver_id}`
                );
              }
            } catch (error) {
              console.error("❌ Error saat menghapus tiket:", error);
            }
          }
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(today.getDate() + 2);
      dayAfterTomorrow.setHours(0, 0, 0, 0);

      const filteredByDateTicketings = ticketingData.filter((item) => {
        if (!item.booking?.tour_date) return false;
        const tourDate = new Date(item.booking.tour_date);
        return tourDate >= today && tourDate < dayAfterTomorrow;
      });

      const validTicketings = filteredByDateTicketings.filter((item) => {
        const driverRotation = rotationData.find(
          (r) => r.driver_id === item.driver_id
        );
        return !(driverRotation && driverRotation.skip_reason);
      });

      const merged = validTicketings.map((item) => {
        const driverRotation = rotationData.find(
          (r) => r.driver_id === item.driver_id
        );
        const jeep = jeeps.find(
          (j) => j.jeep_id === (driverRotation?.jeep_id || item.jeep_id)
        );
        return {
          ...item,
          assigned: driverRotation ? driverRotation.assigned : 0,
          jeeps: jeep || null,
        };
      });

      setData(merged);
    } catch (error) {
      console.error("❌ Error fetch ticketing/rotasi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWA = (item, rotationData, pdfUrl) => {
    if (!pdfUrl) {
      alert("Jadwal belum tersedia, silakan unduh jadwal dulu");
      return;
    }

    const rotation = rotationData.find((r) => r.driver_id === item.driver_id);
    if (!rotation) {
      alert("Rotasi driver belum tersedia");
      return;
    }

    const rotationId = rotation.id;
    const encodedId = hashids.encode(rotationId);
    const confirmLink = `http://localhost:3000//confirm/${encodedId}`;
    // const confirmLink = `https://tlogoputri.siunjaya.id/confirm/${encodedId}`;
    const phone = item.driver?.telepon.replace(/^0/, "62");

    const message = encodeURIComponent(
      `Halo, kamu telah dijadwalkan, ini link konfirmasi keberangkatan kamu:\n${confirmLink}\n\n` +
        `📋 Silakan cek jadwal kamu disini:\n👉 ${pdfUrl}`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "Daftar Penjadwalan";

    doc.setFontSize(16);
    const textWidth = doc.getTextWidth(title);
    const xPos = (pageWidth - textWidth) / 2;

    doc.text(title, xPos, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Tanggal Keberangkatan", "Nama Pemesan", "No Lambung", "Driver"]],
      body: filteredData.map((item) => [
        `${item.booking?.tour_date} ${item.booking?.start_time}`,
        item.nama_pemesan,
        item.jeep?.no_lambung,
        item.driver?.name,
      ]),
      styles: { halign: "center" },
      headStyles: { halign: "center" },
    });

    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    setPdfUrl(blobUrl);
    window.open(blobUrl);
  };

  const handleOpenModal = (item) => {
    setSelectedBooking(item);
    setShowModal(true);
  };

  const handleDepartureClick = async (item) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      setLoadingDrivers((prev) => ({ ...prev, [item.driver_id]: true }));

      const besok = new Date();
      besok.setDate(besok.getDate() + 1);
      const formattedBesok = besok.toISOString().split("T")[0];

      const rotationRes = await fetch(
        `https://tpapi.siunjaya.id/api/driver-rotations?date=${formattedBesok}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!rotationRes.ok)
        throw new Error("Gagal mengambil data rotasi driver");

      const rotationData = await rotationRes.json();
      const rotation = rotationData.find((r) => r.driver_id === item.driver_id);
      if (!rotation) {
        alert("Rotasi untuk driver ini tidak ditemukan.");
        setLoadingDrivers((prev) => ({ ...prev, [item.driver_id]: false }));
        return;
      }

      const rotationId = rotation.id;

      const assignResponse = await fetch(
        `https://tpapi.siunjaya.id/api/driver-rotations/${rotationId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            driver_id: item.driver_id,
          }),
        }
      );

      if (!assignResponse.ok) throw new Error("Gagal assign driver");

      setIsScheduled(true);
      await checkRollingStatus();
      await fetchTicketings();
    } catch (error) {
      console.error("Error saat assign driver:", error);
      alert("Terjadi kesalahan saat penugasan driver.");
    } finally {
      setLoadingDrivers((prev) => ({ ...prev, [item.driver_id]: false }));
    }
  };

  const handleSkipClick = async (item) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      const besok = new Date();
      besok.setDate(besok.getDate() + 1);
      const formattedBesok = besok.toISOString().split("T")[0];

      const rotationRes = await fetch(
        `https://tpapi.siunjaya.id/api/driver-rotations?date=${formattedBesok}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!rotationRes.ok)
        throw new Error("Gagal mengambil data rotasi driver");

      const rotationData = await rotationRes.json();
      const rotation = rotationData.find((r) => r.driver_id === item.driver_id);
      if (!rotation) {
        alert("Rotasi untuk driver ini tidak ditemukan.");
        return;
      }

      const rotationId = rotation.id;

      const skipResponse = await fetch(
        `https://tpapi.siunjaya.id/api/driver-rotations/${rotationId}/skip`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            skip_reason: "tidak bisa",
          }),
        }
      );

      if (!skipResponse.ok) throw new Error("Gagal membatalkan penugasan");

      await checkRollingStatus();
      await fetchTicketings();
    } catch (error) {
      console.error("Error saat membatalkan driver:", error);
      alert("Terjadi kesalahan saat membatalkan penugasan driver.");
    }
  };

  const checkRollingStatus = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    const tanggalBesok = besok.toISOString().split("T")[0];

    try {
      const resRotations = await fetch(
        `https://tpapi.siunjaya.id/api/driver-rotations?date=${tanggalBesok}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!resRotations.ok) throw new Error("Gagal fetch driver-rotations");

      const rotationsData = await resRotations.json();
      const unassignedDrivers = rotationsData.filter((r) => r.assigned === 1);

      setIsAlreadyRolled(unassignedDrivers.length > 0);
      setRotations(unassignedDrivers);
    } catch (err) {
      console.error("❌ Error cek rolling:", err);
    }
  };

  const handleCheckbox = (bookingCode) => {
    const isChecked = checked.includes(bookingCode);
    const newChecked = isChecked
      ? checked.filter((code) => code !== bookingCode)
      : [...checked, bookingCode];

    setChecked(newChecked);
  };

  const filteredData = data.filter(
    (item) =>
      (item.booking?.start_time ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.booking?.tour_date ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.nama_pemesan ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.no_handphone ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.jeep?.no_lambung ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.driver?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAturJadwal = (bookingCode, selectedDriver) => {
    const newData = data.map((item) =>
      item.code_booking === bookingCode
        ? { ...item, driver_name: selectedDriver }
        : item
    );
    setData(newData);
  };

  const allScheduled = filteredData.every(
    (item) => item.assigned === 1 || loadingDrivers[item.driver_id]
  );

  const handleClickArsip = () => {
    router.push("/dashboard/operasional/ticketing/history");
  };

  return (
    <div className="flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        disabled={!isScheduled}
      />

      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? 290 : 70,
        }}
      ></div>
      <div className="flex-1 p-6">
        <h1 className="text-[32px] font-semibold mb-6 text-black">Ticketing</h1>

        <div className="flex justify-end mb-2">
          <button
            onClick={handleClickArsip}
            className="flex items-center gap-2 border border-gray-300 rounded-[13px] px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <History input="text" className="text-gray-500 size-[18px]" />
            <div className="text-gray-500">History</div>
          </button>
        </div>
        <div className="flex justify-end mb-3">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Cari"
          />
        </div>
        <div className="flex-col justify-start mb-4">
          <button
            onClick={exportToPDF}
            disabled={!allScheduled}
            className={`flex items-center gap-1 p-2 rounded-[10px] transition-colors ${
              !allScheduled
                ? "bg-gray-300 text-white cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
            }`}
          >
            <FileText size={16} /> Unduh Jadwal
          </button>
          {!allScheduled && (
            <span className="text-xs text-gray-500 italic font-semibold">
              *Klik "Jadwalkan” terlebih dahulu
            </span>
          )}
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow max-h-[800px] overflow-y-auto">
          <table className="w-full table-auto">
            <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
              <tr>
                <th className="p-2 text-center font-normal">No</th>
                <th className="p-2 text-center font-normal">
                  Tanggal Keberangkatan
                </th>
                <th className="p-2 text-center font-normal">Nama Pemesan</th>
                <th className="p-2 text-center font-normal">No. Lambung</th>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                <th className="p-2 text-center font-normal">Kontak Driver</th>
                <th className="p-2 text-center font-normal">
                  Jadwalkan Driver
                </th>
                <th className="p-2 text-center font-normal">Batalkan</th>
                <th className="p-2 text-center font-normal">Cetak Tiket</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <>
                  <LoadingRow colCount={8} />
                </>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2 text-center">
                      {item.booking?.tour_date && item.booking?.start_time
                        ? `${item.booking?.tour_date} - ${item.booking?.start_time}`
                        : "-"}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.nama_pemesan}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.jeep?.no_lambung}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.driver?.name}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() =>
                            handleSendWA(item, rotationData, pdfUrl)
                          }
                          disabled={!pdfUrl}
                          className={`px-3 rounded-[10px] text-white ${
                            pdfUrl
                              ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                              : "bg-gray-300 text-white cursor-not-allowed"
                          }`}
                        >
                          WhatsApp
                        </button>
                        {!pdfUrl && (
                          <span className="text-xs text-gray-500 italic font-semibold">
                            *Klik “Unduh Jadwal” terlebih dahulu
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDepartureClick(item)}
                        disabled={
                          item.assigned === 1 || loadingDrivers[item.driver_id]
                        }
                        className={`px-2 rounded-[10px] transition-colors ${
                          item.assigned === 1 || loadingDrivers[item.driver_id]
                            ? "bg-gray-300 text-white cursor-not-allowed"
                            : "font-semibold bg-[#B8D4F9] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer"
                        }`}
                      >
                        {item.assigned === 1
                          ? "Sudah"
                          : loadingDrivers[item.driver_id]
                            ? "Memproses..."
                            : "Jadwalkan"}
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleSkipClick(item)}
                        className={`px-2 rounded-[10px] transition-colors ${
                          item.assigned === 1
                            ? "bg-red-200 text-red-600 hover:bg-red-300 cursor-pointer"
                            : "bg-red-200 text-red-600 hover:bg-red-300 cursor-pointer"
                        }`}
                      >
                        Batalkan
                      </button>
                    </td>

                    <td className="p-2 text-center text-gray-750 space-x-2">
                      <button
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => handleOpenModal(item)}
                        title="Print"
                      >
                        <Printer size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    Tidak ada pemesanan untuk hari ini dan besok. Lihat history untuk detail lengkap.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && selectedBooking && (
        <TicketModal
          package_id={selectedBooking.booking?.package_id}
          tour_date={selectedBooking.booking?.tour_date}
          start_time={selectedBooking.booking?.start_time}
          code_booking={selectedBooking.code_booking}
          pemesan={selectedBooking.nama_pemesan}
          nama_driver={selectedBooking.driver?.name}
          no_lambung={selectedBooking.jeeps?.no_lambung}
          plat_jeep={selectedBooking.jeeps?.plat_jeep}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default withAuth(TicketingPage);
