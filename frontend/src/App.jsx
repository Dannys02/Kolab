import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

// --- Import Components & Pages ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Beranda from "./pages/Beranda";
import Program from "./pages/Program";
import Galeri from "./pages/Galeri";
import Artikel from "./pages/Artikel";
import Kontak from "./pages/Kontak";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from './pages/NotFound';

// Dashboard
import Dashboard from "./pages/Dashboard";
import MemberDashboard from "./pages/DashboardUser";
import DashboardUser from './pages/MemberDashboard';

function App() {
  // 1. AMBIL TOKEN & ROLE DARI LOCAL STORAGE
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  const location = useLocation();

  // --- FUNGSI LOGOUT ---
  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post(
          "http://localhost:8000/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error("Logout Gagal/Token Expired:", error);
    }

    // Hapus data sesi
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_name");

    // Reset State
    setToken(null);
    setUserRole(null);
  };

  // Logic menyembunyikan Navbar/Footer - DIPERBAIKI
  const noLayoutRoutes = [
    "/admin",
    "/dashboard",
    "/portal", 
    "/login",
    "/register",
    "/dashboard-user",
  ];
  
  const hideLayout = noLayoutRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // ✅ TAMBAHKAN: Logic khusus untuk halaman 404
  const isNotFoundPage = ![
    "/", "/program", "/galeri", "/artikel", "/kontak", 
    "/login", "/register", "/admin", "/dashboard", "/portal", "/dashboard-user",
  ].some(route => location.pathname === route) && 
  !location.pathname.startsWith("/dashboard") && 
  !location.pathname.startsWith("/portal");

  // --- COMPONENT GUARD (PELINDUNG ROUTE) ---

  // 1. Guard Khusus Admin
  const AdminRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (!userRole) return null;
    if (userRole === "admin") return children;
    if (userRole === "user") return <Navigate to="/portal/dashboard" replace />;
    return <Navigate to="/login" replace />;
  };

  // 2. Guard Khusus Member/User
  const MemberRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (!userRole) return null;
    if (userRole === "user") return children;
    if (userRole === "admin") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ PERBAIKAN: Navbar disembunyikan untuk halaman 404 */}
      {!hideLayout && !isNotFoundPage && <Navbar />}

      <Routes>
        {/* --- ROUTE PUBLIK --- */}
        <Route path="/" element={<Beranda />} />
        <Route path="/program" element={<Program />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/dashboard/user" element={<DashboardUser />} />

        <Route
          path="/register"
          element={
            <Register setToken={setToken} setUserRole={setUserRole} />
          }
        />

        {/* --- ROUTE LOGIN --- */}
        <Route
          path="/login"
          element={
            !token ? (
              <Login setToken={setToken} setUserRole={setUserRole} />
            ) : (
              <Navigate
                to={userRole === "admin" ? "/dashboard" : "/portal/dashboard"}
                replace
              />
            )
          }
        />

        {/* Route /admin diarahkan ke Login yang sama */}
        <Route path="/admin" element={<Navigate to="/login" replace />} />

        {/* --- ROUTE PRIVATE ADMIN --- */}
        <Route
          path="/dashboard/*"
          element={
            <AdminRoute>
              <Dashboard onLogout={handleLogout} />
            </AdminRoute>
          }
        />

        {/* --- ROUTE PRIVATE MEMBER --- */}
        <Route
          path="/portal/*"
          element={
            <MemberRoute>
              <MemberDashboard onLogout={handleLogout} />
            </MemberRoute>
          }
        />

        {/* ✅ Route 404 - TIDAK AKAN MENAMPILKAN NAVBAR/FOOTER */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ✅ PERBAIKAN: Footer disembunyikan untuk halaman 404 */}
      {!hideLayout && !isNotFoundPage && <Footer />}
    </div>
  );
}

export default App;