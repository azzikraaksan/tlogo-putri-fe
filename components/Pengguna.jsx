// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { FaUserCircle } from "react-icons/fa";
// import { FaChevronDown } from "react-icons/fa6";

// const UserMenu = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [userName, setUserName] = useState("");
//   const menuRef = useRef(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       const token = localStorage.getItem("access_token");

//       if (!token) return;

//       try {
//         const res = await fetch("http://localhost:8000/api/fo/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         if (data.success && data.data?.name) {
//           setUserName(data.data.name);
//         }
//       } catch (error) {
//         console.error("Gagal ambil profil user:", error);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("token_exp");
//     router.push("/");
//   };

//   return (
//     <div className="absolute top-4 right-4 z-50 flex items-center gap-2" ref={menuRef}>
//       <span className="text-[18px] font-medium text-gray-700">{userName}</span>

//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-1 text-[#3D6CB9] cursor-pointer"
//       >
//         <FaUserCircle className="text-4xl" />
//         <FaChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 top-9 w-32 bg-[#3D6CB9] rounded-lg shadow-lg">
//           <button
//             onClick={handleLogout}
//             className="block w-full text-white text-left px-4 py-2 text-sm cursor-pointer"
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
import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const UserMenu = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

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
          setUserRole(data.data.role || "Front Office");
        }
      } catch (error) {
        console.error("Gagal ambil profil user:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-4 text-[#3D6CB9]">
      <FaUserCircle className="text-4xl cursor-default" />

      <div className="h-10 border-l border-[#858585]"></div>

      <div className="flex flex-col">
        <span className="text-[16px] font-semibold text-gray-800">{userName}</span>
        <span className="text-sm text-gray-500">{userRole}</span>
      </div>
    </div>
  );
};

export default UserMenu;
