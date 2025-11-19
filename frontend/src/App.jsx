import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from './components/Navbar';
import Beranda from './pages/Beranda';
import Dashboard from "./pages/dashboard";
{/*import Program from './pages/Program';
import Galeri from './pages/Galeri';
import Artikel from './pages/Artikel';
import Kontak from './pages/Kontak';*/}
import Footer from './components/Footer';

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<Beranda />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <Footer />

            {/*<Program />
            <Galeri />
            <Artikel />
            <Kontak />*/}
        </div>
    );
}

export default App;
