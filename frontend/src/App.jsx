import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import axios from 'axios'; // [PENTING] Import Axios

// Components & Pages
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Beranda from './pages/Beranda';
import Dashboard from "../src/pages/Dashboard"; // Pastikan path ini benar
import Program from './pages/Program';
import Login from './pages/Login';
import Galeri from './pages/Galeri';
import Artikel from './pages/Artikel';
import Kontak from './pages/Kontak';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const location = useLocation();

    // --- [FIX] FUNGSI LOGOUT YANG BENAR ---
    const handleLogout = async () => {
        try {
            // 1. Request ke Laravel untuk hapus token di database
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}` // Kirim token saat ini
                }
            });
        } catch (error) {
            console.error("Logout Gagal di Server:", error);
            // Tetap lanjut hapus di browser meski server error
        }

        // 2. Hapus di Browser
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        setToken(null); // Ini akan otomatis memicu Navigate ke /login
    };

    const noLayoutRoutes = ["/login"];
    const hideLayout = noLayoutRoutes.includes(location.pathname);

    const PrivateRoute = ({ children }) => {
        return token ? children : <Navigate to="/login" />;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {!hideLayout && <Navbar />}

            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<Beranda />} />
                <Route path="/program" element={<Program />} />
                <Route path="/galeri" element={<Galeri />} />
                <Route path="/artikel" element={<Artikel />} />
                <Route path="/kontak" element={<Kontak />} />

                <Route 
                    path="/login" 
                    element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} 
                />

                {/* [PENTING] Kirim fungsi handleLogout ke Dashboard */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard onLogout={handleLogout} /> 
                        </PrivateRoute>
                    } 
                />
            </Routes>

            {!hideLayout && <Footer />}
        </div>
    );
}

export default App;