import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from './components/Navbar';
import Beranda from './pages/Beranda';
import Dashboard from "./pages/dashboard";
import Program from './pages/Program';
import Login from './pages/Login';
import Galeri from './pages/Galeri';
import Artikel from './pages/Artikel';
import Kontak from './pages/Kontak';
import Footer from './components/Footer';

function App() {
    const location = useLocation();
    const noLayoutRoutes = ["/login"];

    const hideLayout = noLayoutRoutes.includes(location.pathname);
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
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>

            {!hideLayout && <Footer />}
        </div>
    );
}

export default App;
