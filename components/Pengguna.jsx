// "use client";
// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { FaUserCircle } from "react-icons/fa";

// const UserMenu = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useRouter();
//   const menuRef = useRef(null);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("token_exp");
//     router.push("/");
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="absolute top-4 right-4 z-50" ref={menuRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="text-3xl text-teal-600 hover:text-teal-800 cursor-pointer"
//       >
//         <FaUserCircle />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-10">
//           <button
//             onClick={handleLogout}
//             className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserMenu;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6"; // ⬇️ panah bawah dari react-icons

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/api/fo/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success && data.data?.name) {
          setUserName(data.data.name);
        }
      } catch (error) {
        console.error("Gagal ambil profil user:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_exp");
    router.push("/");
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2" ref={menuRef}>
      <span className="font-medium text-gray-700">{userName}</span>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-teal-600 hover:text-teal-800 cursor-pointer"
      >
        <FaUserCircle className="text-3xl" />
        <FaChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 w-32 bg-teal-600 rounded-lg shadow-lg">
          <button
            onClick={handleLogout}
            className="block w-full text-white text-left px-4 py-2 text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
