import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Sidebar from '/components/Sidebar';
import DashboardPage from '/app/dashboard/page.jsx';
import '/src/app/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Tambahkan Route lainnya sesuai kebutuhan */}
      </Routes>
    </BrowserRouter>
  );
}

export default MyApp;
