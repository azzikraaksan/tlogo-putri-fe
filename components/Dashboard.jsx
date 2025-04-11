import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div>
      {
        <aside className="w-64 h-screen bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">LOGO</h2>
          <br />
          <ul>
            <li>
              <a href="/">apa kek</a>
            </li>
            <br />
            <br />
            <li>
              <a href="/profile">Penjadwalan</a>
            </li>
            <br />
            <li>
              <a href="/settings">Daftar Jeep</a>
            </li>
          </ul>
        </aside>
      }
      {<main className="flex-1 p-6 bg-gray-100">{children}</main>}
      //{" "}
    </div>
  );
};

export default MainLayout;
