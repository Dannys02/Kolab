import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = ({ onLogout }) => {
    const tahunIni = new Date().getFullYear();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("dashboard");
    const [user, setUser] = useState(null);

    // === STATE BIODATA ===
    const [biodata, setBiodata] = useState({
        nama_lengkap: "",
        email: "",
        phone: "",
        alamat: "",
        tanggal_lahir: ""
    });

    //  ====== Nama User di sidebar ========
    const fetchUser = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Gagal Mengambil data User:", error);
        }
    };

    useEffect(() => {
        fetchDataKeuangan();
        fetchUser(); // <-- Panggil disini
    }, []);

    // === STATE LAIN YANG TERKAIT BIODATA ===
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isLoading, setIsLoading] = useState(false);

    const token = localStorage.getItem("token");

    // === HANDLE INPUT CHANGE BIODATA ===
    const handleBiodataChange = e => {
        setBiodata({
            ...biodata,
            [e.target.name]: e.target.value
        });
    };

    // === SUBMIT BIODATA (API POST) ===
    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await axios.post(
                "http://localhost:8000/api/biodata",
                biodata,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage({
                type: "success",
                text: "Sukses: " + response.data.message
            });

            setBiodata({
                nama_lengkap: "",
                email: "",
                phone: "",
                alamat: "",
                tanggal_lahir: ""
            });
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setMessage({
                    type: "error",
                    text: "Gagal: Akses Ditolak! Token Rahasia Salah."
                });
            } else if (error.response && error.response.data.message) {
                setMessage({
                    type: "error",
                    text: "Gagal: " + error.response.data.message
                });
            } else {
                setMessage({
                    type: "error",
                    text: "Terjadi kesalahan koneksi."
                });
            }
        } finally {
            alert("Biodata berhasil dikirim.");
            setIsLoading(false);
        }
    };

    // Total tagihan User
    const [keuangan, setKeuangan] = useState({
        total_tagihan: 0,
        riwayat: []
    });

    // Ambil data keuangan
    const fetchDataKeuangan = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/tagihan-siswa",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setKeuangan(response.data);
        } catch (error) {
            console.error("Gagal mengambil data keuangan:", error);
        }
    };

    useEffect(() => {
        fetchDataKeuangan();
    }, []);

     const fetchDataSiswa = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/dashboard/index",
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Sertakan token jika route dashboard diprotect di masa depan
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            const result = await response.json();
            const dataSiswa = result.data || [];
            setSiswa(dataSiswa);

            setStats(prev => ({
                ...prev,
                totalPlayers: dataSiswa.length,
                activePlayers: dataSiswa.filter(s => s.status === "Aktif")
                    .length
            }));
        } catch (error) {
            console.error("Error fetching siswa:", error);
        }
     };
    
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([
                fetchDataSiswa(),
            ]);
            setLoading(false);
        };
        fetchAllData();
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-white rounded-lg shadow-md text-gray-600 hover:text-green-600 transition-colors"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>

            {/* Sidebar User */}
            <aside
                className={`min-h-screen w-64 fixed overflow-y-auto left-0 p-6 bg-gradient-to-b from-green-600 to-blue-600 shadow-2xl transform transition-transform duration-300 z-40
                ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-center mb-8 pt-4">
                    <div className="bg-white rounded-xl p-3 shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                ⚽
                            </span>
                        </div>
                    </div>
                    <h1 className="ml-3 text-white text-lg font-bold text-center">
                        Sepak Bola
                        <br />
                        SMEMSA
                    </h1>
                </div>

                {/* Navigation User */}
                <nav className="space-y-2">
                    <button
                        className="w-full flex items-center px-4 py-3 text-white bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all duration-200 shadow-sm"
                        onClick={() => setActivePage("dashboard")}
                    >
                        <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        <span className="font-medium">Dashboard</span>
                    </button>

                    <button
                        className="w-full flex items-center px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm"
                        onClick={() => setActivePage("profil")}
                    >
                        <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <span className="font-medium">Profil Saya</span>
                    </button>

                    <button
                        className="w-full flex items-center px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm"
                        onClick={() => setActivePage("kas saya")}
                    >
                        <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                        </svg>
                        <span className="font-medium">Kas Saya</span>
                    </button>
                </nav>

                {/* User Profile */}
                <div className="absolute bottom-20 md:bottom-[150px] left-6 right-6">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center space-x-3 bg-white bg-opacity-10 rounded-xl p-3 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-sm">
                                    P
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium text-sm">
                                    {user ? user.name : "Memuat..."}
                                </p>
                                <p className="text-blue-100 text-xs">
                                    Tim U-15
                                </p>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-xl font-medium shadow-sm" onClick={onLogout}>
                            {" "}
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content User */}
            <main
                onClick={() => setSidebarOpen(false)}
                className="lg:ml-64 p-6"
            >
                {/* Dashboard Pages User */}
                {activePage === "dashboard" && (
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-green-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Dashboard Pemain
                                    </h1>
                                    <p className="text-gray-600">
                                        Selamat datang di sistem SMEMSA Football
                                        Academy
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            Hari ini
                                        </p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date().toLocaleDateString(
                                                "id-ID",
                                                {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-2xl mb-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Input Biodata
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        name="nama_lengkap"
                                        value={biodata.nama_lengkap}
                                        onChange={handleBiodataChange}
                                        className="w-full px-4 py-3 border border-black text-black rounded-lg"
                                        placeholder="Nama Lengkap (Contoh: Budi)"
                                        required
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={biodata.email}
                                        onChange={handleBiodataChange}
                                        className="w-full px-4 py-3 border border-black text-black rounded-lg"
                                        placeholder="Email (Contoh: budi@mail.com)"
                                        required
                                    />

                                    <input
                                        type="number"
                                        name="phone"
                                        value={biodata.phone}
                                        onChange={handleBiodataChange}
                                        className="w-full px-4 py-3 border border-black text-black rounded-lg"
                                        placeholder="No HP (Contoh: 0812xxxxxx)"
                                        required
                                    />

                                    <input
                                        type="date"
                                        name="tanggal_lahir"
                                        value={biodata.tanggal_lahir}
                                        onChange={handleBiodataChange}
                                        className="w-full px-4 py-3 border border-black rounded-lg"
                                        required
                                    />

                                    <textarea
                                        name="alamat"
                                        value={biodata.alamat}
                                        onChange={handleBiodataChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-black text-black rounded-lg md:col-span-2"
                                        placeholder="Alamat (Contoh: Jl. Mawar No. 1)"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                    >
                                        {isLoading
                                            ? "Menyimpan..."
                                            : "Simpan Biodata"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/*Input pembayaran user*/}
                            <div className="shadow-lg rounded-2xl overflow-hidden bg-white border border-green-100">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        Input Pembayaran Kas
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <form className="space-y-6">
                                        {/* Input Nominal Pembayaran */}
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="cashAmount"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Nominal Pembayaran Kas (Rp)
                                            </label>
                                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
                                                <span className="px-4 py-3 bg-gray-50 text-gray-600 font-bold border-r border-gray-200">
                                                    Rp
                                                </span>
                                                <input
                                                    id="cashAmount"
                                                    type="number"
                                                    min="1000"
                                                    placeholder="Contoh: 50000"
                                                    className="w-full px-4 py-3 text-lg text-gray-800 focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Keterangan Pembayaran */}
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="month"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Keterangan
                                            </label>
                                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
                                                {" "}
                                                <input
                                                    type="text"
                                                    name="deskripsi"
                                                    required
                                                    placeholder="Contoh: Iuran Bulanan"
                                                    className="w-full px-4 py-3 text-lg text-gray-800 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Tombol Aksi */}
                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-md"
                                            >
                                                <i className="fas fa-paper-plane"></i>
                                                Kirim Pembayaran
                                            </button>
                                        </div>
                                    </form>

                                    {/* Info/Catatan Tambahan */}
                                    <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-sm text-yellow-800 flex items-center gap-3">
                                        <i className="fas fa-info-circle text-lg mt-0.5"></i>
                                        <p>
                                            Peringatan(contoh : Pastikan nominal
                                            yang diinput sudah benar sesuai
                                            dengan jumlah transfer.)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Riwayat Pembayaran*/}
                            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Riwayat Pembayaran
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    Contoh: Bayar Pajak Ginjal
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Jumat, 18 Okt 2024 • 16:00
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Jumlah uang : Rp 500.000
                                                </p>
                                            </div>
                                            <span
                                                className="px-3 py-1 
    bg-yellow-100 text-yellow-800 
    rounded-full text-sm font-medium"
                                            >
                                                Belum Lunas
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    Contoh : Bayar Masjid
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Senin, 21 Okt 2024 • 15:30
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Jumlah uang : Rp 5.000
                                                </p>
                                            </div>
                                            <span
                                                className="px-3 py-1 
    bg-green-100 text-green-800 
    rounded-full text-sm font-medium"
                                            >
                                                Lunas
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profil Pages User */}
                {activePage === "profil" && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Profil Saya
                                    </h1>
                                    <p className="text-gray-600">
                                        Kelola informasi profil dan akun Anda
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Informasi Profil */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <i className="fas fa-user-circle text-blue-500"></i>
                                    Informasi Pribadi
                                </h2>

                                <div className="space-y-6">
                                    {/* Foto Profil & Info Dasar */}
                                    <div className="flex items-start gap-6">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nama Lengkap
                                                </label>
                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                                                    {biodata.nama_lengkap || user?.name || "Belum Diisi"}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                                                    {biodata.email || user?.email || "Belum Diisi"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    {/* Tombol Aksi */}
                                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                                        <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                            <i className="fas fa-edit"></i>
                                            Edit Profil
                                        </button>
                                        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                            <i className="fas fa-trash-alt"></i>
                                            Hapus Akun
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                {/* Statistik Singkat */}
                                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                                        Statistik Saya
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-wallet text-blue-600"></i>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        Total Kas
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-800">
                                                        Rp 1.250.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-calendar-check text-green-600"></i>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        Kehadiran
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-800">
                                                        92%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-trophy text-purple-600"></i>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        Gol
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-800">
                                                        15
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                                        Aksi Cepat
                                    </h3>
                                    <div className="space-y-2">
                                        <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                                            <i className="fas fa-lock text-blue-600"></i>
                                            <span className="font-medium text-gray-800">
                                                Ubah Password
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Kas Pages User */}
                {activePage === "kas saya" && (
                    <div className="space-y-8">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Cek Total Tagihan
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                <h4 className="font-semibold mb-4">
                                    Total Tagihan
                                </h4>
                                <p className="text-3xl font-bold mb-2">
                                    Rp{" "}
                                    {parseInt(
                                        keuangan.total_tagihan
                                    ).toLocaleString("id-ID")}
                                </p>
                                <p className="text-blue-100 text-sm">
                                    Sisa Kewajiban Pembayaran
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="w-full flex justify-center py-2">
                <p className="text-center">
                    &copy; {tahunIni} Sepak Bola SMEMSA — Membangun Generasi
                    Berprestasi.
                </p>
            </footer>
        </div>
    );
};

export default UserDashboard;
