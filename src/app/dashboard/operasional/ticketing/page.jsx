"use client";
import { useState, useEffect } from "react";
import Sidebar from "/components/Sidebar.jsx";
import LoadingFunny from "/components/LoadingFunny.jsx";
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
  const [loading, setLoading] = useState(false);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);

  useEffect(() => {
    // const fetchTicketings = async () => {
    //   try {
    //     const response = await fetch(
    //       "http://localhost:8000/api/ticketings/all"
    //     );
    //     const ticketingData = await response.json();
    //     console.log("✅ Data ticketing:", ticketingData);

    //     const token = localStorage.getItem("access_token");
    //     const besok = new Date();
    //     besok.setDate(besok.getDate() + 1);
    //     const tanggalBesok = besok.toISOString().split("T")[0];

    //     const rotationRes = await fetch(
    //       `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     const rotationData = await rotationRes.json();
    //     setRotations(rotationData); // simpan rotasi mentah juga

    //     // mapping: gabungkan info assigned ke data ticketing
    //     const merged = ticketingData.map((item) => {
    //       const driverRotation = rotationData.find(
    //         (r) => r.driver_id === item.driver_id
    //       );
    //       return {
    //         ...item,
    //         assigned: driverRotation ? driverRotation.assigned : 0,
    //       };
    //     });

    //     setData(merged);
    //   } catch (error) {
    //     console.error("❌ Error fetch ticketing/rotasi:", error);
    //   }
    // };

    const fetchRotationData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const besok = new Date();
      besok.setDate(besok.getDate() + 1);
      const formattedBesok = besok.toISOString().split("T")[0];

      const res = await fetch(
        `http://localhost:8000/api/driver-rotations?date=${formattedBesok}`,
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
      const response = await fetch("http://localhost:8000/api/ticketings/all");
      const ticketingData = await response.json();
      console.log("✅ Data ticketing:", ticketingData);

      const token = localStorage.getItem("access_token");
      const besok = new Date();
      besok.setDate(besok.getDate() + 1);
      const tanggalBesok = besok.toISOString().split("T")[0];

      const rotationRes = await fetch(
        `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rotationData = await rotationRes.json();
      setRotations(rotationData); // simpan rotasi mentah juga

      // hapus semua tiket yang terkait driver dengan skip_reason
      for (const rotasi of rotationData) {
        if (rotasi.skip_reason) {
          const tiketTerkait = ticketingData.filter(
            (t) => t.driver_id === rotasi.driver_id
          );

          for (const tiket of tiketTerkait) {
            try {
              const res = await fetch(
                `http://localhost:8000/api/ticketings/delete/${tiket.id}`,
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
              } else {
                console.error("❌ Gagal menghapus tiket:", tiket.id);
              }
            } catch (error) {
              console.error("❌ Error saat menghapus tiket:", error);
            }
          }
        }
      }

      // mapping: gabungkan info assigned ke data ticketing
      // const merged = ticketingData.map((item) => {
      //   const driverRotation = rotationData.find(
      //     (r) => r.driver_id === item.driver_id
      //   );
      //   return {
      //     ...item,
      //     assigned: driverRotation ? driverRotation.assigned : 0,
      //   };
      // });

      // setData(merged);
      // filter ulang tiket yang masih valid setelah penghapusan
      // const validTicketings = ticketingData.filter((item) => {
      //   const driverRotation = rotationData.find(
      //     (r) => r.driver_id === item.driver_id
      //   );
      //   return !(driverRotation && driverRotation.skip_reason); // hanya ambil yang TIDAK skip
      // });
      // filter tiket berdasarkan tanggal keberangkatan dulu
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

      // lalu filter valid ticketings berdasarkan skip_reason juga
      const validTicketings = filteredByDateTicketings.filter((item) => {
        const driverRotation = rotationData.find(
          (r) => r.driver_id === item.driver_id
        );
        return !(driverRotation && driverRotation.skip_reason);
      });

      // mapping: gabungkan info assigned ke data yang valid
      const merged = validTicketings.map((item) => {
        const driverRotation = rotationData.find(
          (r) => r.driver_id === item.driver_id
        );
        return {
          ...item,
          assigned: driverRotation ? driverRotation.assigned : 0,
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
    const confirmLink = `http://localhost:3000/confirm/${encodedId}`;
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

  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   autoTable(doc, {
  //     head: [["Tanggal Keberangkatan", "Nama Pemesan", "No Lambung", "Driver"]],
  //     body: filteredData.map((item) => [
  //       `${item.booking?.tour_date} ${item.booking?.start_time}`,
  //       item.nama_pemesan,
  //       item.jeep?.no_lambung,
  //       item.driver?.name,
  //     ]),
  //   });
  //   doc.save("Jadwal Jeep Tlogo Putri.pdf");
  // };

  const handleOpenModal = (item) => {
    setSelectedBooking(item); // simpan data baris yang dipilih
    setShowModal(true); // tampilkan modal
  };

  const handleDepartureClick = async (item) => {
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
        `http://localhost:8000/api/driver-rotations?date=${formattedBesok}`,
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

      const assignResponse = await fetch(
        `http://localhost:8000/api/driver-rotations/${rotationId}/assign`,
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

      alert("Driver berhasil ditugaskan!");
      setIsScheduled(true); // <-- Ubah state menjadi true
      await checkRollingStatus();
      await fetchTicketings();
    } catch (error) {
      console.error("Error saat assign driver:", error);
      alert("Terjadi kesalahan saat penugasan driver.");
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
        `http://localhost:8000/api/driver-rotations?date=${formattedBesok}`,
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
        `http://localhost:8000/api/driver-rotations/${rotationId}/skip`,
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

      alert("Driver berhasil dibatalkan!");
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
        `http://localhost:8000/api/driver-rotations?date=${tanggalBesok}`,
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
      setRotations(unassignedDrivers); // ← tampilkan yang belum ditugaskan
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
      (item.code_booking ?? "")
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

  const handleClickArsip = () => {
    router.push("/dashboard/operasional/ticketing/history");
  };

  if (loading) {
    return <LoadingFunny />;
  }

  // INI KIRIM TAPI TIDAK ENKRIPSI
  // const handleSendWA = (item, rotationData, pdfUrl) => {
  //   if (!pdfUrl) {
  //     alert("Jadwal belum tersedia, silakan unduh jadwal dulu");
  //     return;
  //   }

  //   const rotation = rotationData.find((r) => r.driver_id === item.driver_id);
  //   if (!rotation) {
  //     alert("Rotasi driver belum tersedia");
  //     return;
  //   }

  //   const rotationId = rotation.id;
  //   const confirmLink = `http://localhost:3000/confirm/${rotationId}`;
  //   const phone = item.driver?.telepon.replace(/^0/, "62");

  //   const message = encodeURIComponent(
  //     `Halo, ini link konfirmasi keberangkatan kamu besok:\n${confirmLink}\n\n` +
  //       `📋 Berikut daftar penjadwalan besok:\n👉 ${pdfUrl}`
  //   );

  //   window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  // };
  // const handleDepartureClick = async (item) => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     alert("Token tidak ditemukan. Silakan login ulang.");
  //     return;
  //   }

  //   try {
  //     const besok = new Date();
  //     besok.setDate(besok.getDate() + 1);
  //     const formattedBesok = besok.toISOString().split("T")[0];

  //     const rotationRes = await fetch(
  //       `http://localhost:8000/api/driver-rotations?date=${formattedBesok}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!rotationRes.ok)
  //       throw new Error("Gagal mengambil data rotasi driver");

  //     const rotationData = await rotationRes.json();

  //     const rotation = rotationData.find((r) => r.driver_id === item.driver_id);
  //     if (!rotation) {
  //       alert("Rotasi untuk driver ini tidak ditemukan.");
  //       return;
  //     }

  //     const rotationId = rotation.id;

  //     const assignResponse = await fetch(
  //       `http://localhost:8000/api/driver-rotations/${rotationId}/assign`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           driver_id: item.driver_id,
  //         }),
  //       }
  //     );

  //     if (!assignResponse.ok) throw new Error("Gagal assign driver");

  //     alert("Driver berhasil ditugaskan!");
  //     await checkRollingStatus(); // Refresh data setelah assign
  //     await fetchTicketings();
  //   } catch (error) {
  //     console.error("Error saat assign driver:", error);
  //     alert("Terjadi kesalahan saat penugasan driver.");
  //   }
  // };

  // const handleDepartureClick = async (item) => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     alert("Token tidak ditemukan. Silakan login ulang.");
  //     return;
  //   }

  //   try {
  //     // 1. Ambil tanggal besok dalam format yyyy-mm-dd
  //     const besok = new Date();
  //     besok.setDate(besok.getDate() + 1);
  //     const formattedBesok = besok.toISOString().split("T")[0];

  //     // 2. Ambil data rotasi driver untuk tanggal besok
  //     const rotationRes = await fetch(
  //       `http://localhost:8000/api/driver-rotations?date=${formattedBesok}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!rotationRes.ok)
  //       throw new Error("Gagal mengambil data rotasi driver");

  //     const rotationData = await rotationRes.json();

  //     // 3. Cari rotation berdasarkan driver_id
  //     const rotation = rotationData.find((r) => r.driver_id === item.driver_id);
  //     if (!rotation) {
  //       alert("Rotasi untuk driver ini tidak ditemukan.");
  //       return;
  //     }

  //     const rotationId = rotation.id;

  //     // 4. Assign driver melalui endpoint assign (backend yang handle update status jeep)
  //     const assignResponse = await fetch(
  //       `http://localhost:8000/api/driver-rotations/${rotationId}/assign`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           driver_id: item.driver_id,
  //         }),
  //       }
  //     );

  //     if (!assignResponse.ok) throw new Error("Gagal assign driver");

  //     alert("Driver berhasil ditugaskan!");

  //     setLoadingRotation(true);
  //     setLoadingRotation(false);
  //   } catch (error) {
  //     console.error("Error saat assign driver:", error);
  //     alert("Terjadi kesalahan saat penugasan driver.");
  //   }
  // };

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
        <div className="flex justify-start mb-4">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-1 bg-red-500 text-white p-2 rounded-[10px] hover:bg-red-600 cursor-pointer"
          >
            <FileText size={16} /> Unduh Jadwal
          </button>
        </div>

        {/* <div className="flex flex-col items-end gap-2">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Cari"
          />
          <div className="flex mb-2">
            <button
              onClick={exportToPDF}
              className="flex items-center gap-1 bg-red-500 text-white p-2 rounded-[10px] hover:bg-red-600 cursor-pointer"
            >
              <FileText size={16} /> Unduh Jadwal
            </button>
          </div>
        </div> */}

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full table-auto">
            <thead className="bg-[#3D6CB9] text-white">
              <tr>
                {/* <th className="p-2 text-center font-normal">Pilih</th> */}
                <th className="p-2 text-center font-normal">
                  Tanggal Keberangkatan
                </th>
                <th className="p-2 text-center font-normal">Nama Pemesan</th>
                <th className="p-2 text-center font-normal">No. Lambung</th>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                {/* <th className="p-2 text-center font-normal">
                  Generate Konfirmasi
                </th> */}
                <th className="p-2 text-center font-normal">Kontak Driver</th>
                <th className="p-2 text-center font-normal">Cetak Tiket</th>
                <th className="p-2 text-center font-normal">
                  Jadwalkan Driver
                </th>
                <th className="p-2 text-center font-normal">Batalkan</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
                  >
                    {/* <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={checked.includes(item.code_booking)}
                        onChange={() => handleCheckbox(item.code_booking)}
                        className="cursor-pointer"
                      />
                    </td> */}
                    <td className="p-2 text-center">
                      {item.booking?.tour_date && item.booking?.start_time
                        ? `${item.booking?.tour_date} ${item.booking?.start_time}`
                        : "-"}
                    </td>
                    {/* <td className="p-2 text-center text-gray-750">
                      {item.code_booking}
                    </td> */}
                    <td className="p-2 text-center text-gray-750">
                      {item.nama_pemesan}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.jeep?.no_lambung}
                    </td>
                    <td className="p-2 text-center text-gray-750">
                      {item.driver?.name}
                    </td>
                    {/* <td className="p-2 text-center text-gray-750">
                      <button
                        onClick={() => {
                          const phone = item.driver?.telepon.replace(
                            /^0/,
                            "62"
                          );
                          const message = encodeURIComponent(
                            `📋 Berikut daftar penjadwalan besok:\n\n👉 ${pdfUrl}`
                          );
                          window.open(
                            `https://wa.me/${phone}?text=${message}`,
                            "_blank"
                          );
                        }}
                        className="px-3 bg-green-500 rounded-[10px] text-white hover:bg-green-600 cursor-pointer inline-block"
                        disabled={!pdfUrl}
                      >
                        WhatsApp
                      </button>
                    </td> */}
                    {/* <td className="p-2 text-center text-gray-750">
                      <button>Generate Link</button>
                    </td> */}

                    {/* <td className="p-2 text-center text-gray-750">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => {
                            const phone = item.driver?.telepon.replace(
                              /^0/,
                              "62"
                            );
                            const message = encodeURIComponent(
                              `📋 Berikut daftar penjadwalan besok:\n\n👉 ${pdfUrl}`
                            );
                            window.open(
                              `https://wa.me/${phone}?text=${message}`,
                              "_blank"
                            );
                          }}
                          className={`px-3 rounded-[10px] text-white cursor-pointer inline-block ${
                            pdfUrl
                              ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!pdfUrl}
                        >
                          WhatsApp
                        </button>
                        {!pdfUrl && (
                          <span className="text-xs text-gray-500 italic">
                            *Klik “Unduh Jadwal” terlebih dulu
                          </span>
                        )}
                      </div>
                    </td> */}

                    {/* <td className="p-2 text-center text-gray-750">
                      <button
                        onClick={() => {
                          const phone = item.driver?.telepon.replace(
                            /^0/,
                            "62"
                          );
                          const message = encodeURIComponent(
                            `Berikut daftar penjadwalan besok: ${pdfUrl}`
                          );
                          window.open(
                            `https://wa.me/${phone}?text=${message}`,
                            "_blank"
                          );
                        }}
                        className="px-3 bg-green-500 rounded-[10px] text-white hover:bg-green-600 cursor-pointer inline-block"
                        disabled={!pdfUrl}
                      >
                        WhatsApp
                      </button>
                    </td> */}
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
                          <span className="text-xs text-gray-500 italic">
                            *Klik “Unduh Jadwal” terlebih dahulu
                          </span>
                        )}
                      </div>
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
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDepartureClick(item)}
                        disabled={item.assigned === 1}
                        className={`px-2 rounded-[10px] transition-colors ${
                          item.assigned === 1
                            ? "bg-gray-300 text-white cursor-not-allowed"
                            : "font-semibold bg-[#B8D4F9] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer"
                        }`}
                      >
                        Jadwalkan
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleSkipClick(item)}
                        disabled={item.assigned === 1}
                        className={`px-2 rounded-[10px] transition-colors ${
                          item.assigned === 1
                            ? "bg-gray-300 text-white cursor-not-allowed"
                            : "bg-red-200 text-red-600 hover:bg-red-300 cursor-pointer"
                        }`}
                      >
                        Batalkan
                      </button>
                    </td>

                    {/* <td className="p-2 text-center">
                      <button
                        onClick={() => handleDepartureClick(item)}
                        disabled={assignedDrivers.includes(item.driver_id)} // disable jika sudah pernah ditugaskan
                        className={`font-semibold px-2 rounded-[10px] transition-colors ${
                          assignedDrivers.includes(item.driver_id)
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-[#B8D4F9] text-[#1C7AC8] hover:bg-[#7ba2d0] cursor-pointer"
                        }`}
                      >
                        Tugaskan
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && selectedBooking && (
        <TicketModal
          pemesan={selectedBooking.nama_pemesan}
          driver={selectedBooking.driver?.name}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default withAuth(TicketingPage);

// "use client";
// import { useState, useEffect } from "react";
// import Sidebar from "/components/Sidebar.jsx";
// import UserMenu from "/components/Pengguna.jsx";
// import SearchInput from "/components/Search.jsx";
// import withAuth from "/src/app/lib/withAuth";
// import { Printer, History } from "lucide-react";
// import { useRouter } from 'next/navigation';

// const TicketingPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [data, setData] = useState([]);
//   const [checked, setChecked] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const savedDrivers =
//       JSON.parse(localStorage.getItem("selectedDrivers")) || [];
//     const mappedData = savedDrivers.map((driver, index) => ({
//       bookingCode: `JTP${(index + 1).toString().padStart(3, "0")}`,
//       name: driver.name,
//       no_handphone: "081234567890",
//       email: `${driver.name.toLowerCase()}@gmail.com`,
//       lambung: `00${index + 1}`,
//       driver: driver.name,
//     }));
//     setData(mappedData);
//   }, []);

//   const handleCheckbox = (bookingCode) => {
//     const isChecked = checked.includes(bookingCode);
//     let newChecked;
//     if (isChecked) {
//       newChecked = checked.filter((code) => code !== bookingCode);
//     } else {
//       newChecked = [...checked, bookingCode];
//     }

//     const newData = [...data];
//     const index = newData.findIndex((d) => d.bookingCode === bookingCode);
//     const [selectedItem] = newData.splice(index, 1);
//     if (!isChecked) {
//       newData.push(selectedItem);
//     } else {
//       newData.unshift(selectedItem);
//     }

//     setChecked(newChecked);
//     setData(newData);
//   };

//   const filteredData = data.filter(
//     (item) =>
//       item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.no_handphone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.lambung.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAturJadwal = (bookingCode, selectedDriver) => {
//     const newData = data.map((item) =>
//       item.bookingCode === bookingCode
//         ? { ...item, driver: selectedDriver }
//         : item
//     );
//     setData(newData);
//   };

//   const handleClickArsip = () => {
//     router.push('/dashboard/operasional/ticketing/arsip');
//   };

//   return (
//     <div className="flex">
//       <UserMenu />
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-[32px] font-semibold mb-6 text-black">Ticketing</h1>

//         <div className="flex justify-end mb-2">
//           <button
//             onClick={handleClickArsip}
//             className="flex items-center gap-2 border border-gray-300 rounded-[13px] px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
//           >
//             <History input="text" className="text-gray-500 size-[18px]" />
//             <div className="text-gray-500">Arsip</div>
//           </button>
//         </div>

//         <div className="flex justify-end mb-7">
//           <SearchInput
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onClear={() => setSearchTerm("")}
//             placeholder="Cari"
//           />
//         </div>

//         <div className="overflow-x-auto bg-white rounded-xl shadow">
//           <table className="w-full table-auto">
//             <thead className="bg-[#3D6CB9] text-white ">
//               <tr>
//                 <th className="p-2 text-center font-normal">Pilih</th>
//                 <th className="p-2 text-center font-normal">Kode Pemesanan</th>
//                 <th className="p-2 text-center font-normal">Nama Pemesan</th>
//                 <th className="p-2 text-center font-normal">No. HP</th>
//                 <th className="p-2 text-center font-normal">Email</th>
//                 <th className="p-2 text-center font-normal">No. Lambung</th>
//                 <th className="p-2 text-center font-normal">Nama Driver</th>
//                 <th className="p-2 text-center font-normal">Ubah Driver</th>
//                 <th className="p-2 text-center font-normal">Cetak Tiket</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((item) => (
//                   <tr
//                     key={item.bookingCode}
//                     className="border-t border-[#808080] hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="p-2 text-center">
//                       <input
//                         type="checkbox"
//                         checked={checked.includes(item.bookingCode)}
//                         onChange={() => handleCheckbox(item.bookingCode)}
//                         className="cursor-pointer"
//                       />
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.bookingCode}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.name}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.no_handphone}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.email}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.lambung}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       {item.driver}
//                     </td>
//                     <td className="p-2 text-center text-gray-750">
//                       <div className="relative inline-block w-[140px]">
//                         <select
//                           value={item.driver}
//                           onChange={(e) =>
//                             handleAturJadwal(item.bookingCode, e.target.value)
//                           }
//                           className="w-full bg-[#1C7AC8] text-white rounded-[10px] cursor-pointer appearance-none py-1 pl-3 pr-8"
//                         >
//                           <option value="">Pilih Driver</option>
//                           <option value="Zimut">Zimut</option>
//                           <option value="Bunde">Bunde</option>
//                           <option value="Lis">Lis</option>
//                         </select>
//                         <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white">
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M19 9l-7 7-7-7"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-2 text-center text-gray-750 space-x-2">
//                       <button
//                         className="text-gray-500 hover:text-gray-700 cursor-pointer"
//                         onClick={() => console.log("Print", item.bookingCode)}
//                         title="Print"
//                       >
//                         <Printer size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="9" className="p-4 text-center text-gray-500">
//                     Data tidak ditemukan.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default withAuth(TicketingPage);
