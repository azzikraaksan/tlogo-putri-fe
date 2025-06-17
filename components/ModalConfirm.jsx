// import React from 'react';
// import { FiX } from 'react-icons/fi';
// export default function Modal({
//   isOpen,
//   title,
//   message,
//   onConfirm,
//   onCancel,
//   confirmText = 'OK',
//   cancelText = 'Batal',
//   isConfirm = false
// }) {
//   if (!isOpen) return null;

//   if (!isConfirm) {
//     // MODE PESAN BIASA (toast-style di atas layar)
//     return (
//       <div className="fixed top-4 right-4 z-50">
//         <div className="relative bg-white border border-[#3D6CB9] text-[#3D6CB9] px-4 py-3 rounded-md shadow-md w-[280px] text-sm">
//           <button
//             onClick={onConfirm}
//             className="absolute top-2 right-2 text-[#3D6CB9] hover:text-blue-700 cursor-pointer"
//             aria-label="Close"
//           >
//             <FiX size={14} />
//           </button>
//           <p className="text-xs">{message}</p>
//         </div>
//       </div>
//     );
//   }

//   // MODE KONFIRMASI (modal tengah)
//   return (
//     <div className="absolute  top-1/2 left-1/2 z-100 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center ">
//       <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center border border-[#3D6CB9]">
//         {title && <h2 className="text-lg font-semibold mb-2 text-[#3D6CB9]">{title}</h2>}
//         <p className="mb-4">{message}</p>
//         <div className="flex justify-center gap-4">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm text-gray-700 cursor-pointer"
//           >
//             {cancelText}
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-[#3D6CB9] text-white rounded hover:bg-[#335da3] text-sm cursor-pointer"
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Batal',
  isConfirm = false,
  duration = 3000, // durasi toast hilang otomatis (ms)
}) {
  const [progress, setProgress] = useState(100);

  // Progress bar & auto-close hanya untuk toast (isConfirm: false)
  useEffect(() => {
    if (!isOpen || isConfirm) return;

    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = 100 - (elapsed / duration) * 100;
      setProgress(Math.max(0, percentage));
    }, 30);

    const timeout = setTimeout(() => {
      onConfirm(); // otomatis close
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isOpen, duration, isConfirm, onConfirm]);

  if (!isOpen) return null;

  // 🔵 MODE TOAST NOTIFIKASI (tengah atas)
  if (!isConfirm) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="relative bg-white border border-[#3D6CB9] text-[#3D6CB9] px-4 py-4 rounded-md shadow-md w-[280px] text-sm overflow-hidden">
          <button
            onClick={onConfirm}
            className="absolute top-2 right-2 text-[#3D6CB9] hover:text-blue-700 cursor-pointer"
            aria-label="Close"
          >
            <FiX size={14} />
          </button>
          <p className="text-base pr-4">{message}</p>
          <div
            className="absolute bottom-0 left-0 h-1 bg-[#3D6CB9] transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  // 🔷 MODE KONFIRMASI TENGAH
  return (
    <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center border border-[#3D6CB9]">
        {title && <h2 className="text-lg font-semibold mb-2 text-[#3D6CB9]">{title}</h2>}
        <p className="mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm text-gray-700 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#3D6CB9] text-white rounded hover:bg-[#335da3] text-sm cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
