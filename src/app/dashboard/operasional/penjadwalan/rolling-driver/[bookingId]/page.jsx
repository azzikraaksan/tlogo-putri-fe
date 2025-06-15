"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "/components/Sidebar.jsx";
import LoadingFunny from "/components/LoadingFunny.jsx";
import SearchInput from "/components/Search.jsx";
import withAuth from "/src/app/lib/withAuth";
import { CircleArrowLeft } from "lucide-react";
import Hashids from "hashids";

const PenjadwalanPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [jeepData, setJeepData] = useState(null);
  const [rotationId, setRotationId] = useState(null);
  const [loadingRotation, setLoadingRotation] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isAlreadyRolled, setIsAlreadyRolled] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const params = useParams();
  const bookingId = params?.bookingId;
  const [rotations, setRotations] = useState([]);
  const [unassignedDrivers, setUnassignedDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);
  const bookingHash = params?.bookingId;
  const decoded = hashids.decode(bookingHash);
  const decodedBookingId = decoded?.[0];
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      const token = localStorage.getItem("access_token");
      if (!token || !decodedBookingId) return;

      try {
        const res = await fetch(
          `https://tpapi.siunjaya.id/api/bookings/${decodedBookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil detail booking");

        const json = await res.json();
        setBookingData(json);
        console.log("Booking detail:", json);
      } catch (error) {
        console.error("Gagal mengambil detail booking:", error);
      }
    };

    fetchBookingDetail();
    checkRollingStatus();

    if (selectedDriver) {
      fetchJeepByDriver(selectedDriver.driver_id);
    }
  }, [decodedBookingId, selectedDriver]);

  const fetchJeepByDriver = async (driverId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://tpapi.siunjaya.id/api/jeeps/driver/${driverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data jeep driver");

      const jeepData = await response.json();
      console.log("Jeep driver data:", jeepData);
      return jeepData;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const handleDepartureClick = async (item) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    }

    try {
      await fetchDataAndCreateTicket(item.driver_id);
      // alert("Tiket berhasil dicetak!");
    } catch (error) {
      console.error("Gagal mencetak tiket:", error);
      alert("Terjadi kesalahan saat mencetak tiket.");
    }
  };

  const fetchDataAndCreateTicket = async (driverId) => {
    const token = localStorage.getItem("access_token");
    if (!token || !bookingId || !driverId) return;

    const decoded = hashids.decode(bookingId);
    const decodedBookingId = decoded?.[0];

    if (!decodedBookingId) {
      console.error("Gagal decode bookingId");
      return;
    }

    try {
      const [jeepRes, bookingRes] = await Promise.all([
        fetch(`https://tpapi.siunjaya.id/api/jeeps/driver/${driverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`https://tpapi.siunjaya.id/api/bookings/${decodedBookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!jeepRes.ok || !bookingRes.ok) {
        throw new Error("Gagal mengambil data dari endpoint");
      }

      const jeepData = await jeepRes.json();
      const booking = await bookingRes.json();

      const jeep = jeepData.data[0];

      const payload = {
        code_booking: booking.order_id || "",
        nama_pemesan: booking.customer_name || "",
        no_handphone: booking.customer_phone || "",
        email: booking.customer_email || "",
        driver_id: String(jeep?.driver_id),
        jeep_id: String(jeep?.jeep_id),
        booking_id: booking.booking_id,
      };

      const ticketRes = await fetch(
        "https://tpapi.siunjaya.id/api/ticketings/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!ticketRes.ok) {
        const errorText = await ticketRes.text();
        console.error("Respon Gagal:", errorText);
        throw new Error("Gagal mencetak tiket");
      }

      const ticketResult = await ticketRes.json();
      console.log("Tiket berhasil dicetak:", ticketResult);
      // router.push("/dashboard/operasional/ticketing");
      setShowSuccessModal(true);
      setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/dashboard/operasional/ticketing");
        }, 1500);
        return;
    } catch (error) {
      console.error("Terjadi kesalahan:", error.message);
    }
  };

  const handleLanjutTicketing = () => {
    router.push("/dashboard/operasional/ticketing");
  };

  const fetchJeepByDriverId = async (driverId) => {
    const token = localStorage.getItem("access_token");
    if (!token || !driverId) return null;

    try {
      const response = await fetch(
        `https://tpapi.siunjaya.id/api/jeeps/driver/${driverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Gagal mengambil data jeep");

      const data = await response.json();
      return data.data[0]; 
    } catch (error) {
      console.error("Error fetch jeep:", error);
      return null;
    }
  };

  const handleRolling = async () => {
    setLoadingRotation(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      setLoadingRotation(false);
      return;
    }

    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    const tanggalBesok = besok.toISOString().split("T")[0];

    try {
      const res = await fetch(
        "https://tpapi.siunjaya.id/api/driver-rotations/generate",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 400) {
        alert("Rolling driver sudah dilakukan hari ini. Tidak bisa mengulang.");
        return;
      }

      if (!res.ok) {
        throw new Error("Gagal generate driver rotation");
      }

      const rotasiRes = await fetch(
        `https://tpapi.siunjaya.id/api/driver-rotations?date=${tanggalBesok}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!rotasiRes.ok) throw new Error("Gagal mengambil data rotasi");

      const rotasiJson = await rotasiRes.json();
      setData(rotasiJson.data || []);
    } catch (error) {
      console.error("Gagal generate rotation:", error);
      alert("Gagal generate rotation.");
    } finally {
      setLoadingRotation(false);
    }
  };

  const checkRollingStatus = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    const tanggalBesok = besok.toISOString().split("T")[0];

    try {
      setLoading(true);
      const resRotations = await fetch(
        `https://tpapi.siunjaya.id/api/driver-rotations?date=${tanggalBesok}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resRotations.ok) throw new Error("Gagal fetch driver-rotations");
      const rotationsData = await resRotations.json();

      const unassignedRotations = rotationsData.filter(
        (r) => r.assigned === 0 && (!r.skip_reason || r.skip_reason === "")
      );

      console.log("✅ Driver yang bisa dipilih:", unassignedRotations);

      setIsAlreadyRolled(rotationsData.length > 0); 
      setRotations(unassignedRotations);
    } catch (err) {
      console.error("Error cek rolling:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKembali = () => {
    router.back();
  };
  if (loading) {
    return <LoadingFunny />;
  }
  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? 290 : 70,
        }}
      ></div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <CircleArrowLeft
            onClick={handleKembali}
            className="cursor-pointer"
            size={28}
          />
          <h1 className="text-[32px] font-semibold text-black">Atur Driver</h1>
        </div>

        <div>
          <div className="flex justify-end mb-3">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              placeholder="Cari"
            />
          </div>
        </div>
          <div className="flex justify-between items-center mb-4 px-2">
            <p className="text-gray-700">
              <span className="font-semibold">| Tanggal Keberangkatan:</span>{" "}
              {bookingData?.tour_date || "-"}
              <span className="font-semibold ml-10">| Nama Pemesan:</span>{" "}
              {bookingData?.customer_name || "-"}
            </p>
          </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow">

          <table className="w-full table-auto">
            <thead className="bg-[#3D6CB9] text-white sticky top-0">
              <tr>
                <th className="p-2 text-center font-normal">Nama Driver</th>
                <th className="p-2 text-center font-normal">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rotations.length > 0 ? (
                rotations
                  .filter((item) => item.assigned !== 1)
                  .map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-2 text-center text-gray-750">
                        {item.driver?.name}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleDepartureClick(item)}
                          className="w-[120px] bg-[#3D6CB9] rounded-[10px] hover:bg-[#155d96] text-white cursor-pointer transition-colors"
                        >
                          Pilih Driver
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-600 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Berhasil!</h2>
            <p className="text-gray-600">
              Tunggu sebentar, kamu akan diarahkan...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(PenjadwalanPage);
