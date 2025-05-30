import React from "react";

const TicketModal = ({ pemesan, driver, onClose }) => {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">Detail Tiket</h2>
          <p>Pemesan: {pemesan}</p>
          <p>Driver: {driver}</p>
          <button
            onClick={onClose}
            className="mt-4 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  };

export default TicketModal;
