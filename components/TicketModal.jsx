import React from "react";
import Image from "next/image";
import { useState } from "react";
import jeepBg from "/public/images/tiket2.jpg"; 

const TicketModal = ({
  code_booking,
  pemesan,
  tour_date,
  package_id,
  no_lambung,
  nama_driver,
  plat_jeep,
  onClose,
  start_time,
}) => {
  const [hideButtons, setHideButtons] = useState(false);

  const handlePrint = () => {
    setHideButtons(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setHideButtons(false);
      }, 1000);
    }, 100);  
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        id="print-area"
        className="relative w-[700px] h-[300px] bg-white rounded-xl shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-3 flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
          <h2 className="font-bold text-lg">Tiket Jeep Tlogo Putri</h2>
        </div>

        <div className="relative w-full h-full">
          {/* <Image
            src={jeepBg}
            alt="Background Jeep"
            fill
            sizes="(max-width: 700px) 100vw, 700px"
            className="object-cover opacity-30"
          /> */}
          <Image
            src={jeepBg}
            alt="Background Jeep"
            fill
            sizes="(max-width: 700px) 100vw, 700px"
            className="object-cover brightness-55"
            style={{ objectPosition: "center 13%" }}
          />
          <div className="absolute inset-0 px-6 py-4 grid grid-cols-[2fr_2fr_1fr_1fr] grid-rows-2">
            <div>
              <p className="text-white">Kode Pemesanan</p>
              <p className="text-[18px] text-[#03A9F4]">{code_booking}</p>
            </div>
            <div>
              <p className="text-white">Nama Pemesan</p>
              <p
                className="text-[18px] text-[#03A9F4] truncate max-w-full"
                style={{ wordBreak: "break-word" }}
              >
                {pemesan}
              </p>
            </div>

            <div>
              <p className="text-white">Tanggal</p>
              <p className="text-[18px] text-[#03A9F4]">{tour_date}</p>
            </div>
            <div>
              <p className="text-white">Waktu</p>
              <p className="text-[18px] text-[#03A9F4]">{start_time}</p>
            </div>
            <div>
              <p className="text-white">Pilihan Paket</p>
              <p className="text-[18px] text-[#03A9F4]">Paket {package_id}</p>
            </div>
            <div>
              <p className="text-white">No. Lambung</p>
              <p className="text-[18px] text-[#03A9F4]">{no_lambung}</p>
            </div>
            <div>
              <p className="text-white">Plat Jeep</p>
              <p className="text-[18px] text-[#03A9F4]">{plat_jeep}</p>
            </div>
            <div>
              <p className="text-white">Nama Driver</p>
              <p className="text-[18px] text-[#03A9F4]">{nama_driver}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm print:hidden"
        >
          Print
        </button>

        <button
          onClick={onClose}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm print:hidden"
        >
          Tutup
        </button>
        <div className="absolute bottom-3 right-3 flex gap-2">
          {!hideButtons && (
            <>
              <button
                onClick={handlePrint}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-[5px] text-sm cursor-pointer"
              >
                Print
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded-[5px] text-sm cursor-pointer"
              >
                Tutup
              </button>
            </>
          )}
        </div>
        {/* <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Tutup
          </button>
        </div> */}
        {/* <button
          onClick={onClose}
          className="absolute bottom-3 right-3 px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Tutup
        </button> */}
      </div>
    </div>
  );
};

export default TicketModal;
