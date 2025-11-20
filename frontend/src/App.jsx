import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import axios from 'axios';
import "./App.css";

// Import Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Beranda from './pages/Beranda';
import Dsbd from "./pages/Dsbd"; 
import Program from './pages/Program';
import Login from './pages/Login'; // Pastikan path ini benar (sesuai struktur folder kamu)
import Galeri from './pages/Galeri';
import Artikel from './pages/Artikel';
import Kontak from './pages/Kontak';
import Dashboard from "./pages/Dashboard";

function App() {
    // Ambil token awal dari Local Storage
    const [token, setToken] = useState(localStorage.getItem('token'));
    const location = useLocation();

    // --- FUNGSI LOGOUT ---
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Logout Gagal di Server:", error);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        setToken(null); 
    };

    // Logic menyembunyikan Navbar/Footer di halaman Login
    const noLayoutRoutes = ["/login", "/dashboard"];
    const hideLayout = noLayoutRoutes.includes(location.pathname);

    // Komponen Pembungkus Halaman Private (Dashboard)
    const PrivateRoute = ({ children }) => {
        return token ? children : <Navigate to="/login" />;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Tampilkan Navbar jika bukan di halaman Login */}
            {!hideLayout && <Navbar />}

            <Routes>
                {/* --- ROUTE PUBLIK --- */}
                <Route path="/" element={<Beranda />} />
                <Route path="/program" element={<Program />} />
                <Route path="/galeri" element={<Galeri />} />
                <Route path="/artikel" element={<Artikel />} />
                <Route path="/kontak" element={<Kontak />} />
                <Route path="/dsbd" element={<Dsbd />} />

                {/* --- ROUTE LOGIN (FIXED) --- */}
                {/* Logika: Jika sudah ada token -> lempar ke Dashboard. Jika belum -> Buka Login */}
                <Route 
                    path="/login" 
                    element={
                        token ? (
                            <Navigate to="/dashboard" replace /> 
                        ) : (
                            // DISINI KUNCINYA: Kita kirim props setToken ke Login
                            <Login setToken={setToken} /> 
                        )
                    } 
                />

                {/* --- ROUTE PRIVATE (DASHBOARD) --- */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard onLogout={handleLogout} /> 
                        </PrivateRoute>
                    } 
                />
            </Routes>

            {/* Tampilkan Footer jika bukan di halaman Login */}
            {!hideLayout && <Footer />}
        </div>
    );
}

export default App;