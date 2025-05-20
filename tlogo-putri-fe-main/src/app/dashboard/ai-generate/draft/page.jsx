// pages/dashboard.js

import React from 'react';

const data = [
  { id: 1, tanggal: '02/01/2025', judul: 'Weekend Santai Ka Tigo Puti', partisipan: 'Alyash Cwi A', kategori: 'Ujian Segmen' },
  { id: 2, tanggal: '27/01/2025', judul: 'Weekend Santai di Tigo Puti', partisipan: 'Rekanita Tura', kategori: 'WIJUR Alam' },
  // Tambahkan data lainnya sesuai kebutuhan
];

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <aside style={{ width: '20%', backgroundColor: '#0070f3', color: 'white', padding: '20px' }}>
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li>Semua (1.024)</li>
            <li>Distribusi (354)</li>
            <li>Koreksi (364)</li>
            <li>Sampah (0)</li>
          </ul>
        </nav>
        <button style={{ marginTop: '20px' }}>Logout</button>
      </aside>
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Data Tabel</h1>
        <input type="text" placeholder="Cari..." style={{ marginBottom: '10px' }} />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f4f4f4' }}>
            <tr>
              <th>Pilih</th>
              <th>Tanggal</th>
              <th>Judul</th>
              <th>Partisipan</th>
              <th>Kategori</th>
              <th>Detail</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td><input type="checkbox" /></td>
                <td>{item.tanggal}</td>
                <td>{item.judul}</td>
                <td>{item.partisipan}</td>
                <td>{item.kategori}</td>
                <td><a href="#">Detail</a></td>
                <td><button>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Dashboard;