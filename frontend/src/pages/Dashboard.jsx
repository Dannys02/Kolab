import React, { useEffect, useState } from "react";

export default function Dsbd({ onLogout }) {
  const tahunIni = new Date().getFullYear();
  const [isPemasukan, setIsPemasukan] = useState(false);
  const [isPengeluaran, setIsPengeluaran] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- STATE DATA DARI API ---
  const [siswa, setSiswa] = useState([]);
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL TAMBAH PEMAIN ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    phone: "",
    tanggal_lahir: "",
    alamat: "",
    posisi: "",
    status: "Aktif",
  });

  // State Statistik
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    injuredPlayers: 0,
    teams: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    totalKas: 0, // [UBAH] Dari 'saldo' jadi 'totalKas'
  });

  // --- USE EFFECT ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDataSiswa(),
        fetchDataKeuangan(),
        fetchDataTotalKas(),
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // --- FUNGSI API ---
  const fetchDataSiswa = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/dashboard/index");
      const result = await response.json();
      const dataSiswa = result.data || [];
      setSiswa(dataSiswa);

      setStats((prev) => ({
        ...prev,
        totalPlayers: dataSiswa.length,
        activePlayers: dataSiswa.filter((s) => s.status === "Aktif").length,
      }));
    } catch (error) {
      console.error("Error fetching siswa:", error);
    }
  };

  const fetchDataKeuangan = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/transaksi");
      const result = await response.json();
      const data = result.data || [];
      setFinances(data);

      // Hitung Pemasukan & Pengeluaran Bulan Ini (Logic Frontend)
      let income = 0;
      let expense = 0;

      data.forEach((item) => {
        // Asumsi ada field 'amount' dan 'type'
        if (item.type?.toLowerCase() === "pemasukan")
          income += Number(item.amount);
        else expense += Number(item.amount);
      });

      setStats((prev) => ({
        ...prev,
        monthlyIncome: income,
        monthlyExpense: expense,
        // Note: totalKas kita ambil dari fungsi terpisah di bawah
      }));
    } catch (error) {
      console.error("Error fetching transaksi:", error);
    }
  };

  // [BARU] Ambil Total Kas dari Database Khusus
  const fetchDataTotalKas = async () => {
    try {
      // Nanti buat endpoint ini di Laravel
      const response = await fetch("http://localhost:8000/api/total");
      const result = await response.json();

      setStats((prev) => ({
        ...prev,
        totalKas: Number(result.total_kas) || 0,
      }));
    } catch (error) {
      console.error("Error fetching total kas:", error);
    }
  };

  // --- FUNGSI HANDLER MODAL & HELPER ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPemain = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);
    try {
      const response = await fetch("http://localhost:8000/api/biodata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Pemain berhasil ditambahkan!");
        setIsModalOpen(false);
        setFormData({
          nama_lengkap: "",
          email: "",
          phone: "",
          tanggal_lahir: "",
          alamat: "",
          posisi: "",
          status: "Aktif",
        });
        fetchDataSiswa();
      } else {
        alert(result.message || "Gagal menambahkan pemain");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const toggleDropdown = (dropdown) =>
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  const formatRupiah = (angka) => `Rp ${Number(angka).toLocaleString("id-ID")}`;
  const hitungUmur = (tgl) => {
    if (!tgl) return "-";
    const today = new Date();
    const birthDate = new Date(tgl);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };
  const getFilteredFinances = () => {
    if (activePage === "pemasukan")
      return finances.filter((f) => f.type?.toLowerCase() === "pemasukan");
    if (activePage === "pengeluaran")
      return finances.filter((f) => f.type?.toLowerCase() === "pengeluaran");
    return finances;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800 font-semibold">Sedang Memuat Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md text-gray-600 hover:text-green-600"
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

      {/* Sidebar */}
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-green-600 to-blue-600 shadow-2xl transform transition-transform duration-300 z-40 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* 1. Bagian Header / Logo (Fixed di atas) */}
        <div className="flex-shrink-0 flex items-center justify-center pt-8 pb-6">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚽</span>
            </div>
          </div>
          <h1 className="ml-3 text-white text-xl font-bold">
            Football Academy
          </h1>
        </div>

        {/* 2. Bagian Menu Navigasi (Scrollable) */}
        {/* 'flex-1' agar mengisi sisa ruang, 'overflow-y-auto' agar bisa discroll jika landscape sempit */}
        <nav className="flex-1 overflow-y-auto px-6 space-y-2 custom-scrollbar">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full flex items-center px-4 py-3 text-white rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm ${
              activePage === "dashboard"
                ? "bg-white bg-opacity-20"
                : "bg-white bg-opacity-10"
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </button>

          {/* Transaksi Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("transaksi")}
              className={`w-full flex items-center justify-between px-4 py-3 text-white rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm ${
                ["pemasukan", "pengeluaran"].includes(activePage)
                  ? "bg-white bg-opacity-20"
                  : "bg-white bg-opacity-10"
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="font-medium">Transaksi</span>
              </div>
              <svg className={`w-4 h-4 transform transition-transform ${activeDropdown === "transaksi" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "transaksi" && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-white border-opacity-20 pl-4">
                <button onClick={() => setActivePage("pemasukan")} className={`w-full flex items-center px-3 py-2 text-blue-100 rounded-lg hover:bg-opacity-10 transition-all duration-200 ${activePage === "pemasukan" ? "bg-white bg-opacity-20" : "bg-white bg-opacity-5"}`}>
                  Pemasukan
                </button>
                <button onClick={() => setActivePage("pengeluaran")} className={`w-full flex items-center px-3 py-2 text-blue-100 rounded-lg hover:bg-opacity-10 transition-all duration-200 ${activePage === "pengeluaran" ? "bg-white bg-opacity-20" : "bg-white bg-opacity-5"}`}>
                  Pengeluaran
                </button>
              </div>
            )}
          </div>

          {/* Inventaris Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("inventaris")}
              className={`w-full flex items-center justify-between px-4 py-3 text-white rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm ${
                ["barang-masuk", "barang-keluar"].includes(activePage)
                  ? "bg-white bg-opacity-20"
                  : "bg-white bg-opacity-10"
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="font-medium">Inventaris</span>
              </div>
              <svg className={`w-4 h-4 transform transition-transform ${activeDropdown === "inventaris" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === "inventaris" && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-white border-opacity-20 pl-4">
                <button onClick={() => setActivePage("barang-masuk")} className={`w-full flex items-center px-3 py-2 text-blue-100 rounded-lg hover:bg-opacity-10 transition-all duration-200 ${activePage === "barang-masuk" ? "bg-white bg-opacity-20" : "bg-white bg-opacity-5"}`}>
                  Barang Masuk
                </button>
                <button onClick={() => setActivePage("barang-keluar")} className={`w-full flex items-center px-3 py-2 text-blue-100 rounded-lg hover:bg-opacity-10 transition-all duration-200 ${activePage === "barang-keluar" ? "bg-white bg-opacity-20" : "bg-white bg-opacity-5"}`}>
                  Barang Keluar
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* 3. Bagian Bawah (Profil & Logout) */}
        {/* Menggunakan 'mt-auto' supaya otomatis turun ke bawah, tapi tidak absolute */}
        <div className="flex-shrink-0 p-6 mt-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-3 bg-white bg-opacity-10 rounded-xl p-3 backdrop-blur-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Admin User</p>
                <p className="text-blue-100 text-xs">Administrator</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-xl font-medium shadow-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {activePage === "dashboard"
                  ? "Dashboard Academy"
                  : `Data ${activePage.replace("-", " ")}`}
              </h1>
              <p className="text-gray-600">Sistem manajemen football academy</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-500">Hari ini</p>
              <p className="font-semibold text-gray-800">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* --- PAGE: DASHBOARD --- */}
        {activePage === "dashboard" && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {/* Total Pemain */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center">
                <div className="p-3 bg-blue-500 rounded-xl text-white mr-4">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Pemain</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.totalPlayers}
                  </p>
                </div>
              </div>
              {/* Pemain Aktif */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center">
                <div className="p-3 bg-green-500 rounded-xl text-white mr-4">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pemain Aktif</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.activePlayers}
                  </p>
                </div>
              </div>
              {/* Total Kas (Database) */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center">
                <div className="p-3 bg-yellow-500 rounded-xl text-white mr-4">
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Kas</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatRupiah(stats.totalKas)}
                  </p>
                </div>
              </div>
              {/* Tim */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center">
                <div className="p-3 bg-purple-500 rounded-xl text-white mr-4">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Tim</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.teams}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tabel Pemain */}
              <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    Daftar Pemain Terbaru
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
                  >
                    + Tambah Pemain
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                          Usia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                          Alamat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                          Phone
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {siswa.slice(0, 5).map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.nama_lengkap}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {hitungUmur(item.tanggal_lahir)} Thn
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {item.alamat || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                            >
                              {item.phone}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {siswa.length === 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-6 py-4 text-center text-gray-500 text-sm"
                          >
                            Belum ada data.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ringkasan Keuangan */}
              <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Ringkasan Keuangan
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600">Pemasukan</span>
                    <span className="font-bold text-green-600">
                      {formatRupiah(stats.monthlyIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-600">Pengeluaran</span>
                    <span className="font-bold text-red-600">
                      {formatRupiah(stats.monthlyExpense)}
                    </span>
                  </div>
                  <div className="border-t pt-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">
                        Total Kas (Database)
                      </span>
                      <span className="font-bold text-blue-600 text-xl">
                        {formatRupiah(stats.totalKas)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- PAGE: TRANSAKSI (PEMASUKAN / PENGELUARAN) --- */}
        {["pemasukan", "pengeluaran"].includes(activePage) && (
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 capitalize">
                Tabel {activePage}
              </h3>
              <button
                onClick={() =>
                  activePage === "pemasukan"
                    ? setIsPemasukan(true)
                    : setIsPengeluaran(true)
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
              >
                + Input {activePage}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                      Keterangan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                      Jumlah
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredFinances().map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {item.description}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-bold ${
                          activePage === "pemasukan"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatRupiah(item.amount)}
                      </td>
                    </tr>
                  ))}
                  {getFilteredFinances().length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500 text-sm"
                      >
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isPemasukan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-slideUp">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Tambah Pemasukan
                  </h2>
                  <button
                    onClick={() => setIsPemasukan(false)}
                    className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body - Form Input */}
              <div className="p-6">
                <form className="space-y-6">
                  {/* Input Tanggal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                    />
                  </div>

                  {/* Input Keterangan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keterangan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan keterangan pemasukan"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                    />
                  </div>

                  {/* Input Jumlah */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsPemasukan(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 border border-gray-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {isPengeluaran && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-slideUp">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Tambah Pengeluaran
                  </h2>
                  <button
                    onClick={() => setIsPengeluaran(false)}
                    className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body - Form Input */}
              <div className="p-6">
                <form className="space-y-6">
                  {/* Input Tanggal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                    />
                  </div>

                  {/* Input Keterangan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keterangan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan keterangan pemasukan"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                    />
                  </div>

                  {/* Input Jumlah */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsPengeluaran(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 border border-gray-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: INVENTARIS (BARANG MASUK / KELUAR) --- */}
        {/* Ini yang Anda minta untuk TIDAK DIHAPUS */}
        {["barang-masuk", "barang-keluar"].includes(activePage) && (
          <div className="flex items-center justify-center h-96 bg-white rounded-2xl shadow-sm border border-green-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Halaman {activePage.replace("-", " ").toUpperCase()}
              </h2>
              <p className="text-gray-500">
                Konten untuk halaman ini belum terhubung dengan API.
              </p>
              <button
                onClick={() => setActivePage("dashboard")}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      {/*=============== MODAL TAMBAH PEMAIN ================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                Tambah Data Pemain Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitPemain} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No HP
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posisi
                  </label>
                  <select
                    name="posisi"
                    value={formData.posisi}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Pilih</option>
                    <option value="Striker">Striker</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Defender">Defender</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoadingSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isLoadingSubmit ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
