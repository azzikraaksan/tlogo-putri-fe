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

