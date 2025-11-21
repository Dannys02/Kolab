import React, { useEffect, useState } from 'react';


export default function Dsbd() {
    const tahunIni = new Date().getFullYear();
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // State Data Pemain
    const [siswa, setSiswa] = useState([]);
    const [loading, setLoading] = useState(true);

    // State Jadwal Latihan
    const [schedules, setSchedules] = useState([
        { id: 1, team: 'U-13', date: '2023-10-15', time: '16:00', location: 'Lapangan A' },
        { id: 2, team: 'U-14', date: '2023-10-16', time: '16:00', location: 'Lapangan B' },
        { id: 3, team: 'U-15', date: '2023-10-17', time: '16:00', location: 'Lapangan A' },
        { id: 4, team: 'U-16', date: '2023-10-18', time: '16:00', location: 'Lapangan B' },
    ]);

    // State Keuangan
    const [finances, setFinances] = useState([
        { id: 1, type: 'Pemasukan', description: 'Iuran Bulanan', amount: 2500000, date: '2023-10-01' },
        { id: 2, type: 'Pengeluaran', description: 'Sewa Lapangan', amount: 1500000, date: '2023-10-05' },
        { id: 3, type: 'Pengeluaran', description: 'Pembelian Bola', amount: 500000, date: '2023-10-10' },
        { id: 4, type: 'Pemasukan', description: 'Sponsor Lokal', amount: 3000000, date: '2023-10-12' },
    ]);

    // State Statistik
    const [stats, setStats] = useState({
        totalPlayers: 85,
        activePlayers: 78,
        injuredPlayers: 7,
        teams: 4,
        monthlyIncome: 12500000,
        monthlyExpense: 8500000,
    });

    // --- 2. USE EFFECT ---
    useEffect(() => {
        fetchDataSiswa();
    }, []);

    // --- 3. FUNGSI LOGIKA ---
    const fetchDataSiswa = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/dashboard/index');
            const dataJson = await response.json();

            // Safety check: pastikan dataJson.data ada, jika tidak pakai array kosong
            setSiswa(dataJson.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil Data:", error);
            setLoading(false);
        }
    };

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    // --- 4. LOADING SCREEN ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-green-800 font-semibold">Sedang Memuat Data Siswa...</p>
                </div>
            </div>
        );
    }
    // --- FUNGSI BANTUAN ---
    const hitungUmur = (tanggalLahir) => {
        if (!tanggalLahir) return "-";
        const today = new Date();
        const birthDate = new Date(tanggalLahir);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // --- 5. RENDER TAMPILAN UTAMA ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-white rounded-lg shadow-md text-gray-600 hover:text-green-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`min-h-screen w-64 fixed left-0 p-6 bg-gradient-to-b from-green-600 to-blue-600 shadow-2xl transform transition-transform duration-300 z-40
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

                {/* Logo */}
                <div className="flex items-center justify-center mb-8 pt-4">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">⚽</span>
                        </div>
                    </div>
                    <h1 className="ml-3 text-white text-xl font-bold">Football Academy</h1>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    {/* Dashboard */}
                    <button onClick={() => setActivePage('dashboard')} className="w-full flex items-center px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium">Dashboard</span>
                    </button>

                    {/* Transaksi Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('transaksi')}
                            className="w-full flex items-center justify-between px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <span className="font-medium">Transaksi</span>
                            </div>
                            <svg className={`w-4 h-4 transform transition-transform ${activeDropdown === 'transaksi' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Transaksi Submenu */}
                        {activeDropdown === 'transaksi' && (
                            <div className="ml-6 mt-2 space-y-1 border-l-2 border-white border-opacity-20 pl-4">
                                <button onClick={() => setActivePage('pemasukan')} className="w-full flex items-center px-3 py-2 text-blue-100 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all duration-200">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Pemasukan
                                </button>
                                <button onClick={() => setActivePage('pengeluaran')} className="w-full flex items-center px-3 py-2 text-blue-100 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all duration-200">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM8 12h8m-4-4v8" />
                                    </svg>
                                    Pengeluaran
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Inventaris Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('inventaris')}
                            className="w-full flex items-center justify-between px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span className="font-medium">Inventaris</span>
                            </div>
                            <svg className={`w-4 h-4 transform transition-transform ${activeDropdown === 'inventaris' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Inventaris Submenu */}
                        {activeDropdown === 'inventaris' && (
                            <div className="ml-6 mt-2 space-y-1 border-l-2 border-white border-opacity-20 pl-4">
                                <button onClick={() => setActivePage('barang-masuk')} className="w-full flex items-center px-3 py-2 text-blue-100 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all duration-200">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                    Barang Masuk
                                </button>
                                <button onClick={() => setActivePage('barang-keluar')} className="w-full flex items-center px-3 py-2 text-blue-100 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all duration-200">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                    </svg>
                                    Barang Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* User Profile */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="h-fit flex flex-col gap-3">
                        <div className="flex items-center space-x-3 bg-white bg-opacity-10 rounded-xl p-3 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium text-sm">Admin User</p>
                                <p className="text-blue-100 text-xs">Administrator</p>
                            </div>
                        </div>
                        <a href="#" className="grup flex items-center justify-center gap-2 bg-red-300 hover:text-white text-red-800 hover:bg-red-500 py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-red-600 hover:border-none">
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            {activePage === 'dashboard' && (
                <main className="lg:ml-64 p-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-green-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Dashboard Academy</h1>
                                <p className="text-gray-600">Selamat datang di sistem manajemen football academy</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="bg-green-50 rounded-full p-2 text-green-600 hover:bg-green-100 transition-colors duration-200 cursor-pointer">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM8 12h8m-4-4v8" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Hari ini</p>
                                    <p className="font-semibold text-gray-800">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistik Utama */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="px-6 py-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 shadow-md">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Pemain</dt>
                                            <dd className="text-xl font-bold text-gray-900">{stats.totalPlayers}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="px-6 py-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 shadow-md">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Pemain Aktif</dt>
                                            <dd className="text-xl font-bold text-gray-900">{stats.activePlayers}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="px-6 py-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 shadow-md">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Pemain Cedera</dt>
                                            <dd className="text-xl font-bold text-gray-900">{stats.injuredPlayers}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="px-6 py-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 shadow-md">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Tim</dt>
                                            <dd className="text-xl font-bold text-gray-900">{stats.teams}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Daftar Pemain */}
                        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">Daftar Pemain</h3>
                                    <a href='/dsbd' className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                        Tambah Pemain
                                    </a>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Usia
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Posisi
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {siswa.length > 0 ? (
                                            siswa.map((player, index) => {
                                                // --- PERBAIKAN DISINI SESUAI DATABASE ---

                                                // 1. Ambil Nama Lengkap (sesuai kolom database 'nama_lengkap')
                                                const displayName = player.nama_lengkap || "Tanpa Nama";

                                                // 2. Hitung Umur dari 'tanggal_lahir'
                                                const displayAge = hitungUmur(player.tanggal_lahir);

                                                // 3. Data Dummy (Karena tidak ada di tabel biodatas screenshot)
                                                // Jika nanti sudah ada relasi tabel, ganti string ini dengan player.team.nama_tim, dll.
                                                const displayTeam = player.team || "U-13";
                                                const displayPos = player.position || "Striker";
                                                const displayStatus = player.status || "Aktif";

                                                // Ambil inisial nama
                                                const initial = displayName.charAt(0).toUpperCase();

                                                return (
                                                    <tr key={player.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mr-3 shadow-sm">
                                                                    <span className="text-white font-semibold text-xs">
                                                                        {initial}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{displayName}</div>
                                                                    {/* Tampilkan Email atau Phone dari database sebagai info tambahan */}
                                                                    <div className="text-xs text-gray-500">{player.email || displayTeam}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {displayAge} tahun
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {displayPos}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${displayStatus === 'Aktif'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'}`}>
                                                                {displayStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
                                                    Belum ada data pemain.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Keuangan */}
                    <div className="mt-8 bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Keuangan</h3>
                                <div className="flex space-x-3">
                                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 text-[8px] md:text-sm rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                        Tambah Transaksi
                                    </button>
                                    <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 text-[8px] md:text-sm rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                        Laporan
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Tipe
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Deskripsi
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Jumlah
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {finances.map((finance) => (
                                        <tr key={finance.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${finance.type === 'Pemasukan'
                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                        : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                                    {finance.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {finance.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <span className={finance.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}>
                                                    Rp {finance.amount.toLocaleString('id-ID')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(finance.date).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Ringkasan Keuangan */}
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100">
                            <div className="px-6 py-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Keuangan Bulan Ini</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Total Pemasukan:</span>
                                        <span className="text-lg font-bold text-green-600">Rp {stats.monthlyIncome.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Total Pengeluaran:</span>
                                        <span className="text-lg font-bold text-red-600">Rp {stats.monthlyExpense.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t pt-4">
                                        <span className="text-base font-bold text-gray-900">Saldo:</span>
                                        <span className="text-lg font-bold text-blue-600">Rp {(stats.monthlyIncome - stats.monthlyExpense).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100">
                            <div className="px-6 py-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Terbaru</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Pemain baru bergabung</p>
                                            <p className="text-sm text-gray-500">2 pemain baru bergabung dengan tim U-13</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                                                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Pembayaran iuran</p>
                                            <p className="text-sm text-gray-500">15 pemain telah membayar iuran bulan ini</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {activePage === 'pemasukan' && (
                <div className="lg:ml-64 p-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pemasukan</h1>
                                <p className="text-gray-600">Kelola kas pemain dan transaksi umum</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                                    <i className="fas fa-download"></i>
                                    Export Excel
                                </button>
                                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                                    <i className="fas fa-plus"></i>
                                    Tambah Transaksi
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Kas Pemain Bola */}
                        <div className="bg-white rounded-2xl shadow-sm border border-green-100">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <i className="fas fa-users text-blue-500"></i>
                                    Kas Pemain Bola
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {/* Total Kas */}
                                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-100">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">Total Kas Terkumpul</p>
                                                <p className="text-2xl font-bold text-gray-800">Rp 15.750.000</p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <i className="fas fa-wallet text-blue-600 text-xl"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Daftar Pemain */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold">A</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Ahmad Rizki</p>
                                                    <p className="text-sm text-gray-600">U-15 - Striker</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 500.000</p>
                                                <p className="text-xs text-gray-500">Lunas</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold">B</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Budi Santoso</p>
                                                    <p className="text-sm text-gray-600">U-14 - Midfielder</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 500.000</p>
                                                <p className="text-xs text-gray-500">Lunas</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold">C</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Cahyo Pratama</p>
                                                    <p className="text-sm text-gray-600">U-16 - Goalie</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-red-600">Rp 250.000</p>
                                                <p className="text-xs text-gray-500">Belum Lunas</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-xl font-medium transition-colors duration-200 border border-blue-200 flex items-center justify-center gap-2">
                                        <i className="fas fa-eye"></i>
                                        Lihat Semua Pemain
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Transaksi Umum */}
                        <div className="bg-white rounded-2xl shadow-sm border border-green-100">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <i className="fas fa-exchange-alt text-green-500"></i>
                                    Transaksi Umum
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {/* Statistik Cepat */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                            <p className="text-sm text-gray-600">Transaksi Bulan Ini</p>
                                            <p className="text-xl font-bold text-gray-800">24</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <p className="text-sm text-gray-600">Total Pemasukan</p>
                                            <p className="text-xl font-bold text-gray-800">Rp 8.5JT</p>
                                        </div>
                                    </div>

                                    {/* Daftar Transaksi Terbaru */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Sponsor Local Brand</p>
                                                <p className="text-sm text-gray-600">12 Okt 2024</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 3.000.000</p>
                                                <p className="text-xs text-gray-500">Sponsorship</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Donasi Orang Tua</p>
                                                <p className="text-sm text-gray-600">10 Okt 2024</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 1.500.000</p>
                                                <p className="text-xs text-gray-500">Donasi</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Penjualan Merchandise</p>
                                                <p className="text-sm text-gray-600">08 Okt 2024</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 750.000</p>
                                                <p className="text-xs text-gray-500">Penjualan</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-green-50 text-green-600 hover:bg-green-100 py-3 rounded-xl font-medium transition-colors duration-200 border border-green-200 flex items-center justify-center gap-2">
                                        <i className="fas fa-history"></i>
                                        Riwayat Transaksi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart/Graph Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Grafik Pemasukan Bulan Ini</h3>
                        <div className="h-64 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <i className="fas fa-chart-bar text-4xl mb-2"></i>
                                <p>Grafik pemasukan akan ditampilkan di sini</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activePage === 'pengeluaran' && (
                <div className="lg:ml-64 p-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengeluaran</h1>
                                <p className="text-gray-600">Kelola kas pemain dan transaksi umum</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                                    <i className="fas fa-download"></i>
                                    Export Excel
                                </button>
                                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                                    <i className="fas fa-plus"></i>
                                    Tambah Transaksi
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Kas Pemain Bola */}
                        <div className="bg-white rounded-2xl shadow-sm border border-green-100">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <i className="fas fa-users text-blue-500"></i>
                                    Kas Pemain Bola
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {/* Total Kas */}
                                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-100">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">Total Kas Terkumpul</p>
                                                <p className="text-2xl font-bold text-gray-800">Rp 15.750.000</p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <i className="fas fa-wallet text-blue-600 text-xl"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Daftar Pemain */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold">A</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Ahmad Rizki</p>
                                                    <p className="text-sm text-gray-600">U-15 - Striker</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 500.000</p>
                                                <p className="text-xs text-gray-500">Lunas</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold">B</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Budi Santoso</p>
                                                    <p className="text-sm text-gray-600">U-14 - Midfielder</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 500.000</p>
                                                <p className="text-xs text-gray-500">Lunas</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold">C</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Cahyo Pratama</p>
                                                    <p className="text-sm text-gray-600">U-16 - Goalie</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-red-600">Rp 250.000</p>
                                                <p className="text-xs text-gray-500">Belum Lunas</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-xl font-medium transition-colors duration-200 border border-blue-200 flex items-center justify-center gap-2">
                                        <i className="fas fa-eye"></i>
                                        Lihat Semua Pemain
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Transaksi Umum */}
                        <div className="bg-white rounded-2xl shadow-sm border border-green-100">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <i className="fas fa-exchange-alt text-green-500"></i>
                                    Transaksi Umum
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {/* Statistik Cepat */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                            <p className="text-sm text-gray-600">Transaksi Bulan Ini</p>
                                            <p className="text-xl font-bold text-gray-800">24</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <p className="text-sm text-gray-600">Total Pemasukan</p>
                                            <p className="text-xl font-bold text-gray-800">Rp 8.5JT</p>
                                        </div>
                                    </div>

                                    {/* Daftar Transaksi Terbaru */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Sponsor Local Brand</p>
                                                <p className="text-sm text-gray-600">12 Okt 2024</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 3.000.000</p>
                                                <p className="text-xs text-gray-500">Sponsorship</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Donasi Orang Tua</p>
                                                <p className="text-sm text-gray-600">10 Okt 2024</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 1.500.000</p>
                                                <p className="text-xs text-gray-500">Donasi</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">Penjualan Merchandise</p>
                                                <p className="text-sm text-gray-600">08 Okt 2024</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">Rp 750.000</p>
                                                <p className="text-xs text-gray-500">Penjualan</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-green-50 text-green-600 hover:bg-green-100 py-3 rounded-xl font-medium transition-colors duration-200 border border-green-200 flex items-center justify-center gap-2">
                                        <i className="fas fa-history"></i>
                                        Riwayat Transaksi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activePage === 'barang-masuk' && (
                <div className="lg:ml-64 p-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Manajemen Barang Masuk</h1>
                                <p className="text-gray-600">Kelola stok barang dan perlengkapan sepak bola</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                                    <i className="fas fa-download"></i>
                                    Export Excel
                                </button>
                                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                                    <i className="fas fa-plus"></i>
                                    Tambah Barang
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistik Cepat */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-boxes text-white text-lg"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Barang</p>
                                    <p className="text-2xl font-bold text-gray-800">156</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-shopping-cart text-white text-lg"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Barang Masuk Bulan Ini</p>
                                    <p className="text-2xl font-bold text-gray-800">24</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-futbol text-white text-lg"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Bola</p>
                                    <p className="text-2xl font-bold text-gray-800">45</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-tshirt text-white text-lg"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Seragam</p>
                                    <p className="text-2xl font-bold text-gray-800">85</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Barang Masuk */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-green-100">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Daftar Barang Masuk</h3>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari barang..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                                </div>
                                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <option>Semua Kategori</option>
                                    <option>Bola</option>
                                    <option>Seragam</option>
                                    <option>Alat Latihan</option>
                                    <option>Perlengkapan</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Nama Barang
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Supplier
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Tanggal Masuk
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {/* Sample Data */}
                                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                    <i className="fas fa-futbol text-blue-600"></i>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Bola Sepak Size 5</div>
                                                    <div className="text-xs text-gray-500">Kode: BL-001</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Bola</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-semibold">12 pcs</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Sport Supplier
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            15 Okt 2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Tersedia</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors p-1">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 transition-colors p-1">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 transition-colors p-1">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                    <i className="fas fa-tshirt text-green-600"></i>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Seragam Tim U-15</div>
                                                    <div className="text-xs text-gray-500">Kode: SG-015</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Seragam</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-semibold">25 set</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Jersey Maker
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            12 Okt 2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Tersedia</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors p-1">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 transition-colors p-1">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 transition-colors p-1">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                                    <i className="fas fa-dumbbell text-purple-600"></i>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Cone Markers</div>
                                                    <div className="text-xs text-gray-500">Kode: CM-050</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Alat Latihan</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-semibold">50 pcs</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Sport Equipment
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            10 Okt 2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Terbatas</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors p-1">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 transition-colors p-1">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 transition-colors p-1">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Menampilkan 1-3 dari 156 barang
                            </div>
                            <div className="flex gap-1">
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button className="px-3 py-1 bg-blue-500 text-white rounded-lg">1</button>
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activePage === 'barang-keluar' && (
                <div className="lg:ml-64 p-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Manajemen Barang Keluar</h1>
                                <p className="text-gray-600">Kelola barang rusak dan tidak layak pakai</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                                    <i className="fas fa-download"></i>
                                    Export Excel
                                </button>
                                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                                    <i className="fas fa-plus"></i>
                                    Tambah Barang Keluar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistik Cepat */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-times-circle text-white text-lg"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Barang Rusak</p>
                                    <p className="text-2xl font-bold text-gray-800">28</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-exclamation-triangle text-white text-lg"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Bulan Ini</p>
                                    <p className="text-2xl font-bold text-gray-800">7</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-futbol text-white text-lg"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Bola Rusak</p>
                                    <p className="text-2xl font-bold text-gray-800">12</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-green-100 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-3 shadow-md">
                                    <i className="fas fa-tshirt text-white text-lg"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Seragam Rusak</p>
                                    <p className="text-2xl font-bold text-gray-800">9</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Barang Keluar */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-green-100">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Daftar Barang Keluar (Rusak/Tidak Layak Pakai)</h3>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari barang..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                                </div>
                                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    <option>Semua Kategori</option>
                                    <option>Bola</option>
                                    <option>Seragam</option>
                                    <option>Alat Latihan</option>
                                    <option>Perlengkapan</option>
                                </select>
                                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    <option>Semua Status</option>
                                    <option>Rusak Berat</option>
                                    <option>Rusak Ringan</option>
                                    <option>Hilang</option>
                                    <option>Kadaluarsa</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-red-50 to-orange-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Nama Barang
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Alasan Keluar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Kondisi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Tanggal Keluar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Penanggung Jawab
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {/* Sample Data Barang Rusak */}
                                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                                    <i className="fas fa-futbol text-red-600"></i>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Bola Sepak Size 5</div>
                                                    <div className="text-xs text-gray-500">Kode: BL-001</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Bola</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-semibold">3 pcs</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Bolong/pecah
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Rusak Berat</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            18 Okt 2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Coach Ahmad
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors p-1">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 transition-colors p-1">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 transition-colors p-1">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                                    <i className="fas fa-tshirt text-orange-600"></i>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Seragam Tim U-15</div>
                                                    <div className="text-xs text-gray-500">Kode: SG-015</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Seragam</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-semibold">5 set</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Sobek & luntur
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Rusak Ringan</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            15 Okt 2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Manager Budi
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors p-1">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 transition-colors p-1">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 transition-colors p-1">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                                                    <i className="fas fa-dumbbell text-yellow-600"></i>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Cone Markers</div>
                                                    <div className="text-xs text-gray-500">Kode: CM-050</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Alat Latihan</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-semibold">8 pcs</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Patah & hilang
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Rusak Berat</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            12 Okt 2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Coach Rudi
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors p-1">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 transition-colors p-1">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 transition-colors p-1">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                    <i className="fas fa-first-aid text-gray-600"></i>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">P3K Kit</div>
                                                    <div className="text-xs text-gray-500">Kode: PK-001</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Perlengkapan</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-semibold">1 set</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Kadaluarsa
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Kadaluarsa</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            10 Okt 2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Admin Sari
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors p-1">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 transition-colors p-1">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 transition-colors p-1">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Menampilkan 1-4 dari 28 barang rusak
                            </div>
                            <div className="flex gap-1">
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button className="px-3 py-1 bg-red-500 text-white rounded-lg">1</button>
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
                                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="py-6">
                <p className="text-center">&copy;{tahunIni} SSB Akademi Sepak Bola. Semua hak
                    dilindungi.</p>
            </footer>
        </div>
    );
};