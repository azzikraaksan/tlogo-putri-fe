import React from 'react';
import { X } from 'lucide-react'; // Tetap menggunakan Lucide React untuk ikon X

const ConfirmationPopup = ({ message, onConfirm, onCancel, isOpen, title = "Konfirmasi" }) => {
  if (!isOpen) return null;

  // Inline styles untuk mengganti Tailwind CSS
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };

  const backdropStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(4px)', // Efek blur
    WebkitBackdropFilter: 'blur(4px)', // Untuk kompatibilitas Safari
  };

  const popupContainerStyle = {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '0.5rem', // rounded-lg
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-xl
    padding: '1.5rem', // p-6
    maxWidth: '24rem', // max-w-sm
    width: '100%',
    margin: 'auto', // mx-auto
    animation: 'fadeInScale 0.3s ease-out forwards', // Animasi (perlu definisikan keyframes di CSS global)
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.75rem', // pb-3
    borderBottom: '1px solid #e5e7eb', // border-b border-gray-200
    marginBottom: '1rem', // mb-4
  };

  const titleStyle = {
    fontSize: '1.25rem', // text-xl
    fontWeight: 'bold',
    color: '#1a202c', // text-gray-900
  };

  const closeButtonStyle = {
    color: '#9ca3af', // text-gray-400
    padding: '0.25rem', // p-1
    borderRadius: '9999px', // rounded-full
    transition: 'color 0.2s, background-color 0.2s', // transition-colors
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  };

  const closeButtonHoverStyle = { // Untuk hover state, perlu JavaScript atau CSS eksternal
    color: '#4b5563', // hover:text-gray-600
    backgroundColor: '#f3f4f6', // hover:bg-gray-100
  };

  const messageStyle = {
    textAlign: 'center',
    fontSize: '1.125rem', // text-lg
    fontWeight: 'semibold',
    color: '#374151', // text-gray-800
    marginBottom: '1.5rem', // mb-6
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem', // gap-4
  };

  const cancelButtonBaseStyle = {
    padding: '0.5rem 1.25rem', // px-5 py-2
    borderRadius: '0.375rem', // rounded-md
    border: '1px solid #d1d5db', // border border-gray-300
    color: '#4b5563', // text-gray-700
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const confirmButtonBaseStyle = {
    padding: '0.5rem 1.25rem', // px-5 py-2
    borderRadius: '0.375rem', // rounded-md
    backgroundColor: '#3D6CB9', // bg-[#3D6CB9]
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: 'none',
  };

  return (
    <div style={overlayStyle}>
      <div style={backdropStyle}></div>

      <div style={popupContainerStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <button
            onClick={onCancel}
            style={closeButtonStyle}
            aria-label="Tutup"
            // Untuk hover state, perlu CSS eksternal atau event listener JS
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = closeButtonHoverStyle.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        <p style={messageStyle}>
          {message}
        </p>

        <div style={buttonContainerStyle}>
          <button
            onClick={onCancel}
            style={cancelButtonBaseStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} // hover:bg-gray-100
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={confirmButtonBaseStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#325a9e'} // hover:bg-[#325a9e]
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3D6CB9'}
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;