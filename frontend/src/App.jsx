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

// Dashboard
import Dashboard from "./pages/Dashboard";
import MemberDashboard from "./pages/MemberDashboard";

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

  // Logic menyembunyikan Navbar/Footer
  const noLayoutRoutes = [
    "/admin",
    "/dashboard",
    "/portal",
    "/login",
    "/register",
  ];
  const hideLayout = noLayoutRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // --- COMPONENT GUARD (PELINDUNG ROUTE) ---

  // 1. Guard Khusus Admin
  const AdminRoute = ({ children }) => {
    // Jika tidak ada token, jelas harus login
    if (!token) return <Navigate to="/login" replace />;

    // [FIX PENTING] Jika userRole masih null (belum ke-load dari state/localStorage), 
    // jangan lakukan apa-apa dulu (return null) atau tampilkan Loading, 
    // supaya tidak mental ke Redirect di bawah.
    if (!userRole) return null; 

    // Jika Admin, silakan masuk
    if (userRole === "admin") return children;

    // Jika User biasa coba masuk Admin, lempar ke portal mereka
    if (userRole === "user") return <Navigate to="/portal/dashboard" replace />;

    // Default: Lempar ke login
    return <Navigate to="/login" replace />;
  };

  // 2. Guard Khusus Member/User
  const MemberRoute = ({ children }) => {
    // Jika tidak ada token, tendang ke login
    if (!token) return <Navigate to="/login" replace />;

    // [FIX PENTING] Tunggu role ada isinya agar tidak mental
    if (!userRole) return null;

    // Jika User, silakan masuk
    if (userRole === "user") return children;

    // Jika Admin coba masuk Portal User, lempar ke Dashboard Admin
    if (userRole === "admin") return <Navigate to="/dashboard" replace />;

    // Default
    return <Navigate to="/login" replace />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar muncul hanya di halaman publik */}
      {!hideLayout && <Navbar />}

      <Routes>
        {/* --- ROUTE PUBLIK --- */}
        <Route path="/" element={<Beranda />} />
        <Route path="/program" element={<Program />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/kontak" element={<Kontak />} />

        <Route
          path="/register"
          element={
            // Kirim props setToken & setUserRole
            <Register setToken={setToken} setUserRole={setUserRole} />
          }
        />
        
        {/* --- ROUTE LOGIN --- */}
        <Route
          path="/login"
          element={
            !token ? (
              // Belum login? Tampilkan Form Login
              <Login setToken={setToken} setUserRole={setUserRole} />
            ) : (
              // Sudah login? Cek Role
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
      </Routes>

      {/* Footer muncul hanya di halaman publik */}
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;