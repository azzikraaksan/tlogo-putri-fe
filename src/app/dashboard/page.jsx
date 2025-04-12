"use client";
import Sidebar from "/components/Sidebar.jsx";
import withAuth from "/src/app/lib/withAuth.jsx";

const DashboardPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 flex-1">
        <h1 className="text-6xl text-center font-semibold mt-4 mb-2 text-teal-600">
          Jeep Tlogo Putri
        </h1>
        <p className="text-center max-w-xl mx-auto">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eius
          repudiandae iure a asperiores! Amet magnam incidunt non consequatur,
          voluptates veniam iusto sunt, velit omnis alias autem. Aliquid,
          recusandae? Et, laudantium.
        </p>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
