// 'use client';

// import React from 'react';
// import UserNavbar from '/components/UserNavbar.jsx';

// const LayoutClient = ({ children }) => {
//   return (
//     <>
//       <UserNavbar />
//       {children}
//     </>
//   );
// };

// export default LayoutClient;

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import UserNavbar from '/components/UserNavbar.jsx';

const LayoutClient = ({ children }) => {
  const pathname = usePathname();

  const hideNavbar =
    pathname === '/' || pathname.startsWith('/confirm');

  return (
    <>
      {!hideNavbar && <UserNavbar />}
      {children}
    </>
  );
};

export default LayoutClient;


// 'use client';

// import React from 'react';
// import { usePathname } from 'next/navigation';
// import UserNavbar from '/components/UserNavbar.jsx';

// const LayoutClient = ({ children }) => {
//   const pathname = usePathname();

//   // Tentukan path mana yang tidak menampilkan navbar
//   const hideNavbarRoutes = ['/']; // tambahkan '/login' atau lainnya jika perlu

//   const showNavbar = !hideNavbarRoutes.includes(pathname);

//   return (
//     <>
//       {showNavbar && <UserNavbar />}
//       {children}
//     </>
//   );
// };

// export default LayoutClient;


// "use client";

// import React, { useState } from "react";
// import UserNavbar from "/components/UserNavbar";
// import Sidebar from "/components/Sidebar"; // pastikan path-nya benar

// const LayoutClient = ({ children }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="flex h-screen flex-col">
//       <UserNavbar />
//       <div className="flex flex-1">
//         <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div
//         className="transition-all duration-300 ease-in-out"
//         style={{
//           marginLeft: isSidebarOpen ? 275 : 80,
//         }}
//       ></div>
//         <main>{children}</main>
//       </div>
//     </div>
//   );
// };

// export default LayoutClient;


