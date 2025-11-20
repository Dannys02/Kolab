// agung.jsx
import React, { useState } from 'react';

export default function Dsbd() {
    const tahunIni = new Date().getFullYear();
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // State untuk data pemain
    const [players, setPlayers] = useState([
        { id: 1, name: 'Ahmad Rizki', age: 15, position: 'Striker', team: 'U-15', status: 'Aktif' },
        { id: 2, name: 'Budi Santoso', age: 14, position: 'Midfielder', team: 'U-14', status: 'Aktif' },
        { id: 3, name: 'Cahyo Pratama', age: 16, position: 'Goalkeeper', team: 'U-16', status: 'Cedera' },
        { id: 4, name: 'Dedi Setiawan', age: 15, position: 'Defender', team: 'U-15', status: 'Aktif' },
        { id: 5, name: 'Eko Wijaya', age: 13, position: 'Midfielder', team: 'U-13', status: 'Aktif' },
    ]);

    // State untuk jadwal latihan
    const [schedules, setSchedules] = useState([
        { id: 1, team: 'U-13', date: '2023-10-15', time: '16:00', location: 'Lapangan A' },
        { id: 2, team: 'U-14', date: '2023-10-16', time: '16:00', location: 'Lapangan B' },
        { id: 3, team: 'U-15', date: '2023-10-17', time: '16:00', location: 'Lapangan A' },
        { id: 4, team: 'U-16', date: '2023-10-18', time: '16:00', location: 'Lapangan B' },
    ]);

    // State untuk keuangan
    const [finances, setFinances] = useState([
        { id: 1, type: 'Pemasukan', description: 'Iuran Bulanan', amount: 2500000, date: '2023-10-01' },
        { id: 2, type: 'Pengeluaran', description: 'Sewa Lapangan', amount: 1500000, date: '2023-10-05' },
        { id: 3, type: 'Pengeluaran', description: 'Pembelian Bola', amount: 500000, date: '2023-10-10' },
        { id: 4, type: 'Pemasukan', description: 'Sponsor Lokal', amount: 3000000, date: '2023-10-12' },
    ]);

    // State untuk statistik
    const [stats, setStats] = useState({
        totalPlayers: 85,
        activePlayers: 78,
        injuredPlayers: 7,
        teams: 4,
        monthlyIncome: 12500000,
        monthlyExpense: 8500000,
    });

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

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
                    <div className="bg-white rounded-xl p-3 shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
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
                                <button className="w-full flex items-center px-3 py-2 text-blue-100 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all duration-200">
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
                                <button className="w-full flex items-center px-3 py-2 text-blue-100 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all duration-200">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                    Barang In
                                </button>
                                <button className="w-full flex items-center px-3 py-2 text-blue-100 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all duration-200">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                    </svg>
                                    Barang Out
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Additional Menu Items */}
                    <button className="w-full flex items-center px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Manajemen Pemain</span>
                    </button>

                    <button className="w-full flex items-center px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Jadwal</span>
                    </button>
                </nav>

                {/* User Profile */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="h-fit flex flex-col gap-5">
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
                                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                        Tambah Pemain
                                    </button>
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
                                        {players.map((player) => (
                                            <tr key={player.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mr-3 shadow-sm">
                                                            <span className="text-white font-semibold text-xs">
                                                                {player.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{player.name}</div>
                                                            <div className="text-xs text-gray-500">{player.team}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {player.age} tahun
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {player.position}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${player.status === 'Aktif'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'}`}>
                                                        {player.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Jadwal Latihan */}
                        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">Jadwal Latihan</h3>
                                    <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                        Tambah Jadwal
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Tim
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Waktu
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Lokasi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {schedules.map((schedule) => (
                                            <tr key={schedule.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{schedule.team}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(schedule.date).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {schedule.time}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {schedule.location}
                                                </td>
                                            </tr>
                                        ))}
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
                                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                        Tambah Transaksi
                                    </button>
                                    <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
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
                <div>Konten Pemasukan</div>
            )}
            <footer className="py-6">
                <p className="text-center">&copy;{tahunIni} SSB Akademi Sepak Bola. Semua hak
                    dilindungi.</p>
            </footer>
        </div>
    );
};