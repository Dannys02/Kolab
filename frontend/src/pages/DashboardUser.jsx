import React, { useState } from "react";

const UserDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                ${
                    sidebarOpen
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
                    <button className="w-full flex items-center px-4 py-3 text-white bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all duration-200 shadow-sm">
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

                    <button className="w-full flex items-center px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm">
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

                    <button className="w-full flex items-center px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm">
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
                                    Player Name
                                </p>
                                <p className="text-blue-100 text-xs">
                                    Tim U-15
                                </p>
                            </div>
                        </div>
                        <button
                            className="w-full flex items-center justify-center gap-2 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-xl font-medium shadow-sm"
                        >
                            {" "}
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content User */}
            <main className="lg:ml-64 p-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-green-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Dashboard Pemain
                            </h1>
                            <p className="text-gray-600">
                                Selamat datang di sistem SMEMSA Football Academy
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    Hari ini
                                </p>
                                <p className="font-semibold text-gray-800">
                                    {new Date().toLocaleDateString("id-ID", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistik Pemain */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100">
                        <div className="px-6 py-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-wallet text-white text-lg"></i>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Kas Saya
                                        </dt>
                                        <dd className="text-xl font-bold text-gray-900">
                                            Rp 500.000
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100">
                        <div className="px-6 py-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-check-circle text-white text-lg"></i>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Kehadiran
                                        </dt>
                                        <dd className="text-xl font-bold text-gray-900">
                                            85%
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100">
                        <div className="px-6 py-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-trophy text-white text-lg"></i>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Prestasi
                                        </dt>
                                        <dd className="text-xl font-bold text-gray-900">
                                            3
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100">
                        <div className="px-6 py-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-clock text-white text-lg"></i>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Latihan Minggu Ini
                                        </dt>
                                        <dd className="text-xl font-bold text-gray-900">
                                            2x
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Jadwal Latihan Mendatang */}
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">
                                Jadwal Latihan Mendatang
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Latihan Reguler
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Jumat, 18 Okt 2024 • 16:00
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Lapangan Utama
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        Besok
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Latihan Khusus
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Senin, 21 Okt 2024 • 15:30
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Lapangan Tembak
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        3 hari
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pengumuman Terbaru */}
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">
                                Pengumuman Terbaru
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                    <div className="flex items-start gap-3">
                                        <i className="fas fa-exclamation-circle text-yellow-600 text-lg mt-1"></i>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                Pembayaran Kas Bulanan
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Batas akhir pembayaran: 25 Okt
                                                2024
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                2 jam yang lalu
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-start gap-3">
                                        <i className="fas fa-info-circle text-blue-600 text-lg mt-1"></i>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                Pertandingan Persahabatan
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Lawan: SMAN 1 Kota • Minggu
                                                depan
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                1 hari yang lalu
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aktivitas Terbaru */}
                <div className="mt-8 bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800">
                            Aktivitas Terbaru Saya
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-check text-green-600"></i>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            Pembayaran Kas Oktober
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Rp 500.000 • 15 Okt 2024
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    Lunas
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-dumbbell text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            Latihan Reguler
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Hadir • 12 Okt 2024
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    Selesai
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <i className="fas fa-tshirt text-purple-600"></i>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            Penerimaan Seragam
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Seragam baru • 10 Okt 2024
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                    Diterima
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
