"use client";
import withAuth from "/src/app/lib/withAuth.jsx";

function DashboardLayout({ children }) {
  return <>{children}</>;
}

export default withAuth(DashboardLayout);
