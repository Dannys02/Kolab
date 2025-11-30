import React, { useState, useEffect } from "react";
import axios from "axios";
// [DIAMBIL DARI FILE 2] Menggunakan logo yang diimpor
import Logo from "../assets/logosmks.png"; 

const UserDashboard = ({ onLogout }) => {
    const tahunIni = new Date().getFullYear();
    
    // --- STATE UTAMA ---
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("dashboard");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Untuk loading data awal

    // --- STATE BIODATA & KEUANGAN ---
    const [hasBiodata, setHasBiodata] = useState(false); // [DIAMBIL DARI FILE 2] Cek apakah biodata sudah diisi
    const [biodata, setBiodata] = useState({
        nama_lengkap: "",
        email: "",
        phone: "",
        alamat: "",
        tanggal_lahir: "",
        pilihan_program: "" // Tambahan dari File 2
    });
    const [keuangan, setKeuangan] = useState({ 
        total_tagihan: 0, 
        riwayat: [], 
        biodata_id: null 
    });
    
    // --- STATE FITUR LAIN ---
    const [pengumumans, setPengumumans] = useState([]); // Pengumuman
    const [paymentAmount, setPaymentAmount] = useState(""); // Input Pembayaran
    const [isLoading, setIsLoading] = useState(false); // Loading untuk Aksi (Submit/Update/Delete)

    // --- STATE PROFIL EDIT ---
    const [isEditing, setIsEditing] = useState(false); // Modal Edit
    const [editForm, setEditForm] = useState({ name: "", email: "" });
    const [showAllPrograms, setShowAllPrograms] = useState(false); // Untuk tombol ganti program

    const token = localStorage.getItem("token");

    // === DATA JADWAL (DUMMY) ===
    const JADWAL_LATIHAN = [
        { hari: "Senin", jam: "15:30 - 17:30", materi: "Fisik & Stamina", lokasi: "Lapangan Utama" },
        { hari: "Rabu", jam: "15:30 - 17:30", materi: "Teknik Dasar & Passing", lokasi: "Lapangan B" },
        { hari: "Jumat", jam: "15:00 - 17:00", materi: "Game & Taktik", lokasi: "Lapangan Utama" },
    ];

    // Data Program
    const LIST_PROGRAM = [
        { id: "reguler", judul: "Reguler / Youth", deskripsi: "Program pembinaan dasar usia 10-15 tahun.", harga: "Rp 50.000/bln", warna: "bg-blue-50 border-blue-200", btnWarna: "bg-blue-600 hover:bg-blue-700" },
        { id: "elite", judul: "Elite Squad", deskripsi: "Tim inti sekolah untuk kompetisi LKS.", harga: "Rp 100.000/bln", warna: "bg-purple-50 border-purple-200", btnWarna: "bg-purple-600 hover:bg-purple-700" },
        { id: "kiper", judul: "Goalkeeper Class", deskripsi: "Pelatihan khusus penjaga gawang.", harga: "Rp 75.000/bln", warna: "bg-yellow-50 border-yellow-200", btnWarna: "bg-yellow-600 hover:bg-yellow-700" }
    ];

    // --- FETCH DATA UTAMA (USER, KEUANGAN, BIODATA, PENGUMUMAN) ---

    // 1. Fetch User Data (Akun Utama)
    const fetchUser = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/user", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setEditForm({ name: response.data.name, email: response.data.email });
        } catch (error) {
            console.error("Gagal data user:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch Keuangan & Cek Biodata (Diambil dari File 2, lebih lengkap)
    const fetchDataKeuangan = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/tagihan-siswa", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setKeuangan(response.data);

            // Cek dan set data biodata yang sudah ada
            if (response.data.biodata) {
                setBiodata(prev => ({ 
                    ...prev, 
                    ...response.data.biodata,
                    // Pastikan email di biodata tidak menimpa email login jika biodata hanya menyimpan email siswa
                    email: response.data.biodata.email || user?.email 
                }));
                setHasBiodata(true); 
            } else {
                setHasBiodata(false); 
            }
        } catch (error) {
            console.error("Gagal data keuangan:", error);
        }
    };

    // 3. Fetch Pengumuman
    const fetchDataPengumuman = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/pengumuman", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPengumumans(response.data.data || []);
        } catch (error) {
            console.error("Gagal data pengumuman:", error);
        }
    };

    // 4. useEffect untuk memanggil semua data saat komponen dimuat
    useEffect(() => {
        if (!token) return; // Pastikan token ada sebelum fetch
        fetchDataKeuangan();
        fetchUser();
        fetchDataPengumuman();
    }, [token]);


    // --- ACTION HANDLERS (Diambil dari File 2, lebih lengkap) ---
    
    const handleBiodataChange = e => {
        setBiodata({ ...biodata, [e.target.name]: e.target.value });
    };

    const handleSubmitBiodata = async e => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Menggunakan endpoint POST yang fleksibel (CREATE/UPDATE)
            const response = await axios.post("http://localhost:8000/api/biodata", biodata, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Biodata berhasil disimpan! Selamat bergabung.");
            // Refresh data setelah sukses
            fetchDataKeuangan(); 
        } catch (error) {
            alert("Gagal menyimpan biodata: " + (error.response?.data?.message || "Koneksi Error"));
        } finally {
            alert("Biodata berhasil dikirim.");
            setIsLoading(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        const amount = parseInt(paymentAmount);
        
        // 1. Validasi Input Dasar
        if (!amount || amount < 1000) {
            return alert("Minimal pembayaran Rp 1.000");
        }
        
        // 2. Validasi Biodata
        if (!keuangan.biodata_id) {
            return alert("Lengkapi biodata terlebih dahulu di menu Dashboard.");
        }

        // 3. VALIDASI TAGIHAN AKTIF
        if (keuangan.total_tagihan <= 0) {
            return alert("Anda tidak memiliki tagihan aktif yang perlu dibayar saat ini. Tunggu tagihan dari Admin.");
        }

        // 4. Validasi Overpayment
        if (amount > keuangan.total_tagihan) {
            return alert(`Jumlah pembayaran melebihi sisa tagihan! Sisa tagihan Anda: Rp ${parseInt(keuangan.total_tagihan).toLocaleString('id-ID')}`);
        }
        
        if (!window.confirm(`Konfirmasi pembayaran Rp ${amount.toLocaleString('id-ID')}?`)) return;

        setIsLoading(true);
        try {
            await axios.post("http://localhost:8000/api/pembayaran", {
                biodata_id: keuangan.biodata_id,
                jumlah_bayar: amount
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            alert("Pembayaran berhasil dicatat! Terima kasih.");
            setPaymentAmount("");
            fetchDataKeuangan(); // Refresh data
        } catch (error) {
            alert("Gagal memproses pembayaran: " + (error.response?.data?.message || "Error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put("http://localhost:8000/api/data/edit", editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profil diperbarui!");
            setIsEditing(false);
            fetchUser(); // Refresh data user login
        } catch (error) {
            alert("Gagal update profil: " + (error.response?.data?.message || "Error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Yakin hapus akun? Ini akan menghapus permanen data login Anda.")) return;
        setIsLoading(true);
        try {
            await axios.delete("http://localhost:8000/api/data/destroy", {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Akun dihapus.");
            onLogout();
        } catch (error) {
            alert("Gagal hapus akun: " + (error.response?.data?.message || "Error"));
            setIsLoading(false);
        }
    };

    const handlePilihProgram = async (programId) => {
        if (!confirm(`Yakin memilih program ${LIST_PROGRAM.find(p => p.id === programId)?.judul || programId}? Pilihan Anda akan disimpan.`)) return;
        setIsLoading(true);
        try {
            // Menggunakan endpoint POST yang sama untuk update biodata
            const payload = { ...biodata, pilihan_program: programId };
            const response = await axios.post("http://localhost:8000/api/biodata", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update state lokal
            if (response.data.data) {
                setBiodata(response.data.data);
            } else {
                setBiodata(payload);
            }
            setShowAllPrograms(false);
            fetchDataKeuangan();
            alert("Berhasil memilih program!");
        } catch (error) {
            alert("Gagal memilih program: " + (error.response?.data?.message || "Error"));
        } finally {
            setIsLoading(false);
        }
     };

    // --- RENDER KOMPONEN ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative">
            
            {/* Modal Edit Profil (Diambil dari File 2) */}
            {isEditing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">Edit Akun Login</h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Akun</label>
                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Login</label>
                                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{isLoading ? "Menyimpan..." : "Simpan"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Menu Button (Dipertahankan) */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white rounded-lg shadow-md text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>

            {/* Sidebar User (Menggunakan versi File 2 yang lebih lengkap) */}
            <aside
                className={`min-h-screen w-64 fixed overflow-y-auto left-0 p-6 bg-gradient-to-b from-green-600 to-blue-600 shadow-2xl transform transition-transform duration-300 z-40
                ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                
                {/* --- LOGO SEKOLAH (UPDATED) --- */}
                <div className="flex items-center justify-center mb-8 pt-4">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <h1 className="ml-3 text-white text-lg font-bold text-center leading-tight">
                        Sepak Bola<br />SMEMSA
                    </h1>
                </div>

                {/* --- NAVIGATION (UPDATED DENGAN PROGRAM) --- */}
                <nav className="space-y-2">
                    <button
                        onClick={() => setActivePage("dashboard")}
                        className={`w-full flex items-center px-4 py-3 text-white rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm ${activePage === "dashboard" ? "bg-white bg-opacity-20" : "bg-white bg-opacity-10"}`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium">Dashboard</span>
                    </button>

                    <button
                        onClick={() => setActivePage("profil")}
                        className={`w-full flex items-center px-4 py-3 text-white rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm ${activePage === "profil" ? "bg-white bg-opacity-20" : "bg-white bg-opacity-10"}`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Profil Saya</span>
                    </button>
                    
                    {/* HANYA MUNCUL JIKA SUDAH ISI BIODATA */}
                    {hasBiodata && (
                        <button
                            onClick={() => setActivePage("program")}
                            className={`w-full flex items-center px-4 py-3 text-white rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm ${activePage === "program" ? "bg-white bg-opacity-20" : "bg-white bg-opacity-10"}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="font-medium">Pilih Program</span>
                        </button>
                    )}

                    <button
                        onClick={() => setActivePage("kas saya")}
                        className={`w-full flex items-center px-4 py-3 text-white rounded-xl hover:bg-opacity-20 transition-all duration-200 shadow-sm ${activePage === "kas saya" ? "bg-white bg-opacity-20" : "bg-white bg-opacity-10"}`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="font-medium">Kas Saya</span>
                    </button>
                </nav>

                {/* User Profile Footer (Menggunakan versi File 2 yang lebih lengkap) */}
                <div className="absolute bottom-10 left-6 right-6">
                    <div className="bg-white bg-opacity-10 rounded-xl p-3 mb-3 flex items-center gap-3 backdrop-blur-sm">
                        <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-medium truncate">{user?.name || "Memuat..."}</p>
                            <p className="text-blue-100 text-xs truncate">Siswa</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-medium shadow-sm transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content User */}
            <main
                onClick={() => setSidebarOpen(false)}
                className="lg:ml-64 p-6 transition-all duration-300"
            >
                {/* PAGE: DASHBOARD (Menggunakan logika File 2: Form vs Jadwal) */}
                {activePage === "dashboard" && (
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-green-100 flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Dashboard Pemain</h1>
                                <p className="text-gray-600 mt-1">
                                    {hasBiodata ? `Halo ${user?.name}, siap berlatih hari ini?` : "Lengkapi biodata untuk memulai!"}
                                </p>
                            </div>
                            {hasBiodata && (
                                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
                                    SISWA AKTIF
                                </span>
                            )}
                        </div>

                        {/* --- LOGIKA TAMPILAN: Form Input vs Jadwal --- */}
                        {hasBiodata ? (
                            // TAMPILAN 1: JIKA SUDAH ISI BIODATA (Jadwal & Pengumuman)
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Jadwal Latihan */}
                                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                                    <div className="bg-blue-600 p-4 flex justify-between items-center">
                                        <h3 className="text-white font-bold flex items-center gap-2">
                                            <i className="fas fa-calendar-alt"></i> Jadwal Latihan
                                        </h3>
                                        <span className="text-blue-100 text-xs bg-blue-700 px-2 py-1 rounded">Minggu Ini</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {JADWAL_LATIHAN.map((item, idx) => (
                                            <div key={idx} className="p-4 hover:bg-blue-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                                                <div className="sm:w-20 font-bold text-gray-800 bg-gray-100 rounded-lg p-2 text-center">
                                                    {item.hari}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-blue-700 text-sm">{item.materi}</p>
                                                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                                        <span>? {item.jam}</span>
                                                        <span>? {item.lokasi}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pengumuman & Quick Stat */}
                                <div className="space-y-6">
                                    {/* Pengumuman Card */}
                                    {pengumumans.length > 0 ? (
                                        pengumumans.slice(0, 3).map((pengumuman) => (
                                            <div key={pengumuman.id} className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6 shadow-sm">
                                                <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                                    </svg>
                                                    {pengumuman.judul}
                                                </h3>
                                                <p className="text-sm text-yellow-800 leading-relaxed whitespace-pre-wrap">
                                                    {pengumuman.isi}
                                                </p>
                                                <div className="mt-4 pt-4 border-t border-yellow-200 text-xs text-yellow-600">
                                                    {pengumuman.user?.name || "Admin"} • {new Date(pengumuman.created_at).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6 shadow-sm">
                                            <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                                </svg>
                                                Pengumuman
                                            </h3>
                                            <p className="text-sm text-yellow-600">
                                                Belum ada pengumuman saat ini.
                                            </p>
                                        </div>
                                    )}

                                    {/* Quick Stat Keuangan */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-gray-500 text-sm mb-1">Status Pembayaran</p>
                                        <div className="flex items-end gap-2">
                                            <span className={`text-2xl font-bold ${keuangan.total_tagihan > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                {keuangan.total_tagihan > 0 ? "Belum Lunas" : "Lunas"}
                                            </span>
                                        </div>
                                        {keuangan.total_tagihan > 0 && (
                                            <button onClick={() => setActivePage('kas saya')} className="mt-3 w-full py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200">
                                                Bayar Sekarang (Rp {parseInt(keuangan.total_tagihan).toLocaleString('id-ID')})
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // TAMPILAN 2: JIKA BELUM ISI BIODATA (Form Input)
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                                <div className="mb-6 text-center">
                                    <h2 className="text-xl font-bold text-gray-800">⚠️ Lengkapi Data Diri</h2>
                                    <p className="text-gray-500 text-sm">Data ini diperlukan untuk administrasi dan pembuatan kartu anggota.</p>
                                </div>
                                <form onSubmit={handleSubmitBiodata} className="max-w-2xl mx-auto space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                            <input type="text" name="nama_lengkap" value={biodata.nama_lengkap} onChange={handleBiodataChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">No HP (WhatsApp)</label>
                                            <input type="number" name="phone" value={biodata.phone} onChange={handleBiodataChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="08..." required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Siswa</label>
                                            <input type="email" name="email" value={biodata.email} onChange={handleBiodataChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                                            <input type="date" name="tanggal_lahir" value={biodata.tanggal_lahir} onChange={handleBiodataChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                                            <textarea name="alamat" value={biodata.alamat} onChange={handleBiodataChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jalan, RT/RW, Kelurahan..." required />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all">
                                        {isLoading ? "Menyimpan..." : "Simpan Data & Lanjutkan"}
                                    </button>
                                </form>
                                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-sm text-yellow-800 flex items-start gap-3">
                                    <i className="fas fa-info-circle text-lg mt-0.5 flex-shrink-0"></i>
                                    <p>
                                        Peringatan: Data biodata hanya dapat diisi sekali. Setelah tersimpan, Anda dapat memilih program di menu **"Pilih Program"**
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* PAGE: PROGRAM (Diambil dari File 2) */}
                {activePage === "program" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                            <h1 className="text-2xl font-bold text-gray-800">Pilih Program</h1>
                            <p className="text-gray-600">Sesuaikan dengan minat dan posisi bermainmu.</p>
                        </div>

                        {/* TAMPILAN SETELAH MEMILIH PROGRAM */}
                        {biodata.pilihan_program && !showAllPrograms ? (
                            <div className="space-y-6">
                                {/* Card Konfirmasi Program Terpilih */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border-2 border-green-300 p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full -ml-12 -mb-12 opacity-20"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Program Berhasil Dipilih!</h2>
                                                <p className="text-gray-600">Selamat, Anda telah terdaftar dalam program berikut:</p>
                                            </div>
                                        </div>

                                        {(() => {
                                            const programTerpilih = LIST_PROGRAM.find(p => p.id === biodata.pilihan_program);
                                            if (!programTerpilih) return null;
                                            
                                            return (
                                                <div className="bg-white rounded-xl p-6 shadow-md border border-green-200">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className={`h-3 w-3 rounded-full ${programTerpilih.warna.replace('bg-', 'bg-').replace('-50', '-500').split(' ')[0]}`}></div>
                                                                <h3 className="text-xl font-bold text-gray-800">{programTerpilih.judul}</h3>
                                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">AKTIF</span>
                                                            </div>
                                                            <p className="text-gray-600 mb-4">{programTerpilih.deskripsi}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Biaya Bulanan</p>
                                                            <p className="text-lg font-bold text-gray-800">{programTerpilih.harga}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Status Pendaftaran</p>
                                                            <p className="text-lg font-bold text-green-600">Terdaftar</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-800 mb-1">Langkah Selanjutnya:</p>
                                                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                                                        <li>Tunggu konfirmasi dari admin untuk aktivasi program</li>
                                                        <li>Lakukan pembayaran sesuai tagihan yang akan diterbitkan</li>
                                                        <li>Ikuti jadwal latihan yang telah ditentukan</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                        <div className="flex gap-3 mt-6">
                                            <button 
                                                onClick={() => setActivePage('dashboard')} 
                                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md transition-all"
                                            >
                                                Lihat Dashboard
                                            </button>
                                            <button 
                                                onClick={() => setActivePage('kas saya')} 
                                                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all"
                                            >
                                                Cek Pembayaran
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">Ingin Mengubah Program?</h3>
                                        <button 
                                            onClick={() => {
                                                if (confirm("Yakin ingin melihat semua program lagi? Anda bisa memilih program lain.")) {
                                                    setShowAllPrograms(true);
                                                }
                                            }}
                                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                                        >
                                            Lihat Semua Program
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600">Anda dapat mengubah pilihan program kapan saja. Pilih program yang sesuai dengan kebutuhan Anda.</p>
                                </div>
                            </div>
                        ) : (
                            /* TAMPILAN SEBELUM MEMILIH PROGRAM ATAU SAAT INGIN MENGUBAH */
                            <div className="space-y-6">
                                {biodata.pilihan_program && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-yellow-800">
                                            <strong>Program saat ini:</strong> {LIST_PROGRAM.find(p => p.id === biodata.pilihan_program)?.judul || biodata.pilihan_program}. 
                                            Pilih program lain untuk mengubah pilihan Anda.
                                        </p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {LIST_PROGRAM.map((program) => (
                                        <div key={program.id} className={`bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-lg ${
                                            biodata.pilihan_program === program.id 
                                                ? 'border-green-500 ring-2 ring-green-200' 
                                                : 'border-gray-100 hover:border-gray-200'
                                        }`}>
                                            <div className={`h-2 w-12 rounded-full mb-4 ${program.warna.replace('bg-', 'bg-').replace('-50', '-500').split(' ')[0]}`}></div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{program.judul}</h3>
                                            <p className="text-sm text-gray-600 mb-4 h-16">{program.deskripsi}</p>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                <span className="font-bold text-gray-700">{program.harga}</span>
                                                {biodata.pilihan_program === program.id ? (
                                                    <span className="text-green-600 font-bold flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Terdaftar
                                                    </span>
                                                ) : (
                                                    <button 
                                                        onClick={() => {
                                                            setShowAllPrograms(false);
                                                            handlePilihProgram(program.id);
                                                        }} 
                                                        className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${program.btnWarna} hover:shadow-md transition-all`}
                                                    >
                                                        {biodata.pilihan_program ? 'Ganti Program' : 'Pilih Program'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* PAGE: PROFIL (Menggunakan versi File 2 yang lebih lengkap) */}
                {activePage === "profil" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                            <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
                            <p className="text-gray-600">Informasi akun dan biodata siswa.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-800 mb-6 border-b pb-2">Informasi Pribadi</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className="text-xs text-gray-500">Nama Akun</label><div className="font-medium">{user?.name || "-"}</div></div>
                                        <div><label className="text-xs text-gray-500">Email Login</label><div className="font-medium">{user?.email || "-"}</div></div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className="text-xs text-gray-500">Nama Siswa</label><div className="font-medium">{biodata.nama_lengkap || "-"}</div></div>
                                            <div><label className="text-xs text-gray-500">No HP</label><div className="font-medium">{biodata.phone || "-"}</div></div>
                                            <div><label className="text-xs text-gray-500">Tgl Lahir</label><div className="font-medium">{biodata.tanggal_lahir || "-"}</div></div>
                                            <div><label className="text-xs text-gray-500">Program</label><div className="font-medium">{LIST_PROGRAM.find(p => p.id === biodata.pilihan_program)?.judul || biodata.pilihan_program || "-"}</div></div>
                                            <div className="md:col-span-2"><label className="text-xs text-gray-500">Alamat</label><div className="font-medium">{biodata.alamat || "-"}</div></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600">Edit Akun</button>
                                        <button onClick={handleDeleteAccount} disabled={isLoading} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200">Hapus Akun</button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Widget Keuangan Kecil */}
                            <div className="bg-blue-600 rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="font-bold text-lg mb-1">Total Tagihan</h3>
                                <p className="text-blue-100 text-sm mb-4">Wajib dibayar segera</p>
                                <p className="text-3xl font-bold mb-6">Rp {parseInt(keuangan.total_tagihan || 0).toLocaleString('id-ID')}</p>
                                <button onClick={() => setActivePage('kas saya')} className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold shadow-sm hover:bg-blue-50 transition-colors">
                                    Bayar Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PAGE: KAS SAYA (Menggunakan versi File 2 yang lebih lengkap) */}
                {activePage === "kas saya" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                            <h1 className="text-2xl font-bold text-gray-800">Kas & Pembayaran</h1>
                            <p className="text-gray-600">Bayar tagihan via Transfer/QRIS.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="p-6 bg-gray-50 border-b">
                                    <h3 className="font-bold text-gray-800">Input Pembayaran</h3>
                                </div>
                                <div className="p-6">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-center">
                                        <p className="text-sm font-medium text-blue-800 mb-2">Scan QRIS Sekolah</p>
                                        <div className="bg-white p-2 inline-block rounded-lg shadow-sm border mb-2">
                                            {/* Ganti URL ini dengan URL QRIS asli Anda */}
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS" className="w-32 h-32" />
                                        </div>
                                        <p className="text-xs text-blue-600">BCA: 123-456-7890 (SMEMSA)</p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 mb-4">
                                        <p className="text-sm font-bold mb-1">Total Tagihan Anda:</p>
                                        <p className="text-2xl font-extrabold">
                                            Rp {parseInt(keuangan.total_tagihan || 0).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <form onSubmit={handlePayment} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominal yang Dibayar (Rp)</label>
                                            <input 
                                                type="number" 
                                                min="1000" 
                                                value={paymentAmount} 
                                                onChange={(e) => setPaymentAmount(e.target.value)} 
                                                placeholder="Masukkan jumlah yang ditransfer" 
                                                className="w-full px-4 py-3 border rounded-xl text-lg" 
                                                required 
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={isLoading || keuangan.total_tagihan <= 0} 
                                            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg transition-all disabled:bg-gray-400"
                                        >
                                            {isLoading ? "Memproses..." : "Konfirmasi Pembayaran"}
                                        </button>
                                        {keuangan.total_tagihan <= 0 && (
                                            <p className="text-red-500 text-sm text-center font-medium">Anda tidak memiliki tagihan aktif saat ini.</p>
                                        )}
                                    </form>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-800 mb-4">Riwayat Pembayaran</h3>
                                {keuangan.riwayat.length > 0 ? (
                                    <ul className="space-y-3">
                                        {keuangan.riwayat.map((item, idx) => (
                                            <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(item.tanggal_bayar).toLocaleDateString("id-ID", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        })}
                                                    </p>
                                                    <p className="text-sm font-medium">Pembayaran Kas</p>
                                                </div>
                                                <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">+ Rp {parseInt(item.jumlah_bayar).toLocaleString('id-ID')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-400 py-8">Belum ada riwayat pembayaran.</p>
                                )}
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-800 mb-4">Riwayat Pembayaran</h3>
                                {keuangan.riwayat.length > 0 ? (
                                    <ul className="space-y-3">
                                        {keuangan.riwayat.map((item, idx) => (
                                            <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <div>
                                                    <p className="text-xs text-gray-500">{item.tanggal_bayar}</p>
                                                    <p className="text-sm font-medium">Pembayaran Kas</p>
                                                </div>
                                                <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">+ Rp {parseInt(item.jumlah_bayar).toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-400 py-8">Belum ada riwayat.</p>
                                )}
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
