// "use client";

// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { LayoutDashboardIcon, CalendarClock, Ticket, Users, CarIcon } from "lucide-react";
// import { FaCar } from "react-icons/fa";

// const Sidebar = () => {
//   const pathname = usePathname();

//   return (
//     <div>
//       <aside className="w-[270px] h-screen bg-[#3D6CB9] text-white p-4">
//         <div className="flex justify-center mt-10">
//           <img src="/images/logo.png" alt="Logo" className="w-[100px] h-auto" />
//         </div>
//         <br />
//         <ul>
//           <li>
//             <Link
//               href="/dashboard_fo"
//               className={
//                 pathname === "/dashboard_fo"
//                   ? "flex items-center bg-blue-300 rounded-[6px] text-white pl-4 py-2"
//                   : "flex items-center text-white pl-4 py-2"
//               }
//             >
//               <LayoutDashboardIcon size={20} className="mr-2" />
//               Dashboard
//             </Link>
//           </li>
//           <br />
//           <br />
//           <li>
//             <Link
//               href="/dashboard_fo/penjadwalan"
//               className={
//                 pathname.startsWith("/dashboard_fo/penjadwalan")
//                   ? "flex items-center bg-blue-300 rounded-[6px] text-white pl-4 py-2"
//                   : "flex items-center text-white pl-4 py-2"
//               }
//             >
//               <CalendarClock size={20} className="mr-2" />
//               Penjadwalan
//             </Link>
//           </li>
//           <br />
//           <li>
//             <Link
//               href="/dashboard_fo/ticketing"
//               className={
//                 pathname.startsWith("/dashboard_fo/ticketing")
//                   ? "flex items-center bg-blue-300 rounded-[6px] text-white pl-4 py-2"
//                   : "flex items-center text-white pl-4 py-2"
//               }
//             >
//               <Ticket size={20} className="mr-2" />
//               Ticketing
//             </Link>
//           </li>
//           <br />
//           <li>
//             <Link
//               href="/dashboard_fo/anggota"
//               className={
//                 pathname === "/dashboard_fo/anggota"
//                   ? "flex items-center bg-blue-300 rounded-[6px] text-white pl-4 py-2"
//                   : "flex items-center text-white pl-4 py-2"
//               }
//             >
//               <Users size={20} className="mr-2" />
//               Daftar Anggota
//             </Link>
//           </li>
//           <br />
//           <li>
//             <Link
//               href="/dashboard_fo/jeep"
//               className={
//                 pathname === "/dashboard_fo/jeep"
//                   ? "flex items-center bg-blue-300 rounded-[6px] text-white pl-4 py-2"
//                   : "flex items-center text-white pl-4 py-2"
//               }
//             >
//               <img src="/images/jeep.png" className="w-[20px] h-auto mr-2" />
//               Daftar Jeep
//             </Link>
//           </li>
//           <br />
//         </ul>
//       </aside>
//     </div>
//   );
// };

// export default Sidebar;

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  CalendarClock,
  Ticket,
  Users,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_exp");
    router.push("/");
  };

  return (
    <aside className="w-[270px] h-screen bg-[#3D6CB9] text-white p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-center mt-10 mb-6">
          <img src="/images/logo.png" alt="Logo" className="w-[100px] h-auto" />
        </div>

        <ul>
          <li>
            <Link
              href="/dashboard_fo"
              className={`flex items-center pl-4 py-2 rounded-[6px] hover:bg-blue-400 ${
                pathname === "/dashboard_fo"
                  ? "bg-blue-300 text-white"
                  : "text-white"
              }`}
            >
              <LayoutDashboardIcon size={20} className="mr-2" />
              Dashboard
            </Link>
          </li>
          <br />
          <li>
            <Link
              href="/dashboard_fo/penjadwalan"
              className={`flex items-center pl-4 py-2 rounded-[6px] hover:bg-blue-400 ${
                pathname.startsWith("/dashboard_fo/penjadwalan")
                  ? "bg-blue-300 text-white"
                  : "text-white"
              }`}
            >
              <CalendarClock size={20} className="mr-2" />
              Penjadwalan
            </Link>
          </li>
          <br />
          <li>
            <Link
              href="/dashboard_fo/ticketing"
              className={`flex items-center pl-4 py-2 rounded-[6px] hover:bg-blue-400 ${
                pathname.startsWith("/dashboard_fo/ticketing")
                  ? "bg-blue-300 text-white"
                  : "text-white"
              }`}
            >
              <Ticket size={20} className="mr-2" />
              Ticketing
            </Link>
          </li>
          <br />
          <li>
            <Link
              href="/dashboard_fo/anggota"
              className={`flex items-center pl-4 py-2 rounded-[6px] hover:bg-blue-400 ${
                pathname === "/dashboard_fo/anggota"
                  ? "bg-blue-300 text-white"
                  : "text-white"
              }`}
            >
              <Users size={20} className="mr-2" />
              Daftar Anggota
            </Link>
          </li>
          <br />
          <li>
            <Link
              href="/dashboard_fo/jeep"
              className={`flex items-center pl-4 py-2 rounded-[6px] hover:bg-blue-400 ${
                pathname === "/dashboard_fo/jeep"
                  ? "bg-blue-300 text-white" 
                  : "text-white"
              }`}
            >
              <img src="/images/jeep.png" className="w-[20px] h-auto mr-2" />
              Daftar Jeep
            </Link>
          </li>
        </ul>
      </div>

      <div className="mb-4 cursor-pointer">
        <button
          onClick={handleLogout}
          className="flex items-center pl-4 py-2 text-white hover:bg-blue-400 rounded-[6px] w-full cursor-pointer"
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
