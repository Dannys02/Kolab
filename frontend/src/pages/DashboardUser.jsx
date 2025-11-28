import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = ({ onLogout }) => {
    const tahunIni = new Date().getFullYear();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("dashboard");

    // State User & Loading
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // === STATE UNTUK EDIT PROFIL (MODAL) ===
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        email: ""
    });

    // === STATE BIODATA ===
    const [biodata, setBiodata] = useState({
        nama_lengkap: "",
        email: "",
        phone: "",
        alamat: "",
        tanggal_lahir: "",
        pilihan_program: ""
    });

    // === STATE LAINNYA ===
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [keuangan, setKeuangan] = useState({ total_tagihan: 0, riwayat: [] });

    // List Program (Statis)
    const LIST_PROGRAM = [
        {
            id: "reguler",
            judul: "Reguler / Youth",
            deskripsi: "Program pembinaan dasar untuk usia 10-15 tahun.",
            harga: "Rp 50.000/bln",
            warna: "bg-blue-50 border-blue-200",
            btnWarna: "bg-blue-600 hover:bg-blue-700"
        },
        {
            id: "elite",
            judul: "Elite Squad",
            deskripsi: "Tim inti sekolah untuk kompetisi LKS.",
            harga: "Rp 100.000/bln",
            warna: "bg-purple-50 border-purple-200",
            btnWarna: "bg-purple-600 hover:bg-purple-700"
        },
        {
            id: "kiper",
            judul: "Goalkeeper Class",
            deskripsi: "Pelatihan khusus penjaga gawang.",
            harga: "Rp 75.000/bln",
            warna: "bg-yellow-50 border-yellow-200",
            btnWarna: "bg-yellow-600 hover:bg-yellow-700"
        }
    ];

    const token = localStorage.getItem("token");

    // 1. Fetch User Data (Akun Utama)
    const fetchUser = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/user", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            // Set default value untuk form edit saat data user didapat
            setEditForm({
                name: response.data.name,
                email: response.data.email
            });
        } catch (error) {
            console.error("Gagal mengambil data user:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch Keuangan (Tagihan Siswa)
    const fetchDataKeuangan = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/tagihan-siswa", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setKeuangan(response.data);
            // Jika ada data biodata dari relasi keuangan, bisa diset juga (opsional)
            if (response.data.biodata) {
                setBiodata(prev => ({ ...prev, ...response.data.biodata }));
            }
        } catch (error) {
            console.error("Gagal mengambil data keuangan:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUser();
            fetchDataKeuangan();
        }
    }, [token]);

    // === FITUR 1: EDIT PROFIL (UPDATE AKUN) ===
    const handleEditClick = () => {
        // Isi form dengan data user saat ini sebelum membuka modal
        if (user) {
            setEditForm({ name: user.name, email: user.email });
        }
        setIsEditing(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // [FIX] Hapus ${id} karena endpoint tidak butuh ID (ambil dari token)
            await axios.put("http://localhost:8000/api/data/edit", editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Profil berhasil diperbarui!");
            setIsEditing(false);
            fetchUser(); // Refresh data user di tampilan
        } catch (error) {
            console.error("Gagal update profil:", error);
            if (error.response && error.response.data.message) {
                 alert("Gagal: " + error.response.data.message);
            } else {
                 alert("Gagal memperbarui profil. Email mungkin sudah digunakan.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // === FITUR 2: HAPUS AKUN ===
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "PERINGATAN: Apakah Anda yakin ingin menghapus akun ini secara permanen? Data yang dihapus tidak dapat dikembalikan."
        );

        if (!confirmDelete) return;

        setIsLoading(true);
        try {
            // [FIX] URL bersih tanpa query params, cukup header Authorization
            await axios.delete("http://localhost:8000/api/data/destroy", {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Akun berhasil dihapus.");
            onLogout(); // Logout otomatis setelah hapus akun
        } catch (error) {
            console.error("Gagal hapus akun:", error);
            alert("Gagal menghapus akun. Silakan coba lagi.");
            setIsLoading(false);
        }
    };

    // === FITUR PILIH PROGRAM ===
    const handlePilihProgram = async (programId) => {
        if (!confirm("Apakah Anda yakin ingin memilih program ini?")) return;
        setIsLoading(true);
        try {
            const payload = { ...biodata, pilihan_program: programId };
            await axios.post("http://localhost:8000/api/biodata", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBiodata(payload);
            alert("Berhasil memilih program!");
        } catch (error) {
            console.error(error);
            alert("Gagal memilih program.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Input Change Biodata
    const handleBiodataChange = e => {
        setBiodata({ ...biodata, [e.target.name]: e.target.value });
    };

    // Submit Biodata
    const handleSubmitBiodata = async e => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/biodata", biodata, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Biodata berhasil disimpan: " + response.data.message);
            // Jangan reset biodata agar user melihat apa yang baru diinput
            // setBiodata(...) 
            fetchDataKeuangan(); // Refresh data agar ID biodata sinkron jika baru dibuat
        } catch (error) {
            alert("Gagal menyimpan biodata.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative">
            
            {/* --- MODAL EDIT PROFIL --- */}
            {isEditing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Edit Informasi Akun</h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Akun</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Login</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* --- END MODAL --- */}

            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-white rounded-lg shadow-md text-gray-600 hover:text-green-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Sidebar User */}
            <aside
                className={`min-h-screen w-64 fixed overflow-y-auto left-0 p-6 bg-gradient-to-b from-green-600 to-blue-600 shadow-2xl transform transition-transform duration-300 z-40
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Logo */}
                <div className="flex items-center justify-center mb-8 pt-4">
                    <div className="bg-white rounded-xl p-3 shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">?</span>
                        </div>
                    </div>
                    <h1 className="ml-3 text-white text-lg font-bold text-center">
                        Sepak Bola<br />SMEMSA
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    <button
                        className={`w-full flex items-center px-4 py-3 text-white rounded-xl transition-all duration-200 shadow-sm ${activePage === 'dashboard' ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-10 hover:bg-opacity-20'}`}
                        onClick={() => setActivePage("dashboard")}
                    >
                        <i className="fas fa-home w-5 mr-3 text-center"></i>
                        <span className="font-medium">Dashboard</span>
                    </button>

                    <button
                        className={`w-full flex items-center px-4 py-3 text-white rounded-xl transition-all duration-200 shadow-sm ${activePage === 'profil' ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-10 hover:bg-opacity-20'}`}
                        onClick={() => setActivePage("profil")}
                    >
                        <i className="fas fa-user w-5 mr-3 text-center"></i>
                        <span className="font-medium">Profil Saya</span>
                    </button>

                    <button
                        className={`w-full flex items-center px-4 py-3 text-white rounded-xl transition-all duration-200 shadow-sm ${activePage === 'program' ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-10 hover:bg-opacity-20'}`}
                        onClick={() => setActivePage("program")}
                    >
                        <i className="fas fa-futbol w-5 mr-3 text-center"></i>
                        <span className="font-medium">Pilih Program</span>
                    </button>

                    <button
                        className={`w-full flex items-center px-4 py-3 text-white rounded-xl transition-all duration-200 shadow-sm ${activePage === 'kas saya' ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-10 hover:bg-opacity-20'}`}
                        onClick={() => setActivePage("kas saya")}
                    >
                        <i className="fas fa-wallet w-5 mr-3 text-center"></i>
                        <span className="font-medium">Kas Saya</span>
                    </button>
                </nav>

                {/* User Profile Footer Sidebar */}
                <div className="absolute bottom-10 left-6 right-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center space-x-3 bg-white bg-opacity-10 rounded-xl p-3 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-md text-white font-bold">
                                {user ? user.name.charAt(0).toUpperCase() : "..."}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-white font-medium text-sm truncate">{user ? user.name : "Memuat..."}</p>
                                <p className="text-blue-100 text-xs truncate">{user ? user.email : ""}</p>
                            </div>
                        </div>
                        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-medium shadow-sm transition-colors">
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content User */}
            <main onClick={() => setSidebarOpen(false)} className="lg:ml-64 p-6 transition-all duration-300">
                
                {/* PAGE: DASHBOARD */}
                {activePage === "dashboard" && (
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-green-100">
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard Pemain</h1>
                            <p className="text-gray-600">Selamat datang kembali, {user?.name}!</p>
                        </div>

                        {/* Form Input Biodata */}
                        <div className="p-6 bg-white rounded-2xl mb-6 shadow-sm border border-gray-100">
                            <form onSubmit={handleSubmitBiodata} className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lengkapi Biodata</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="text" name="nama_lengkap" value={biodata.nama_lengkap} onChange={handleBiodataChange} className="w-full px-4 py-3 border rounded-lg" placeholder="Nama Lengkap" required />
                                    <input type="email" name="email" value={biodata.email} onChange={handleBiodataChange} className="w-full px-4 py-3 border rounded-lg" placeholder="Email" required />
                                    <input type="number" name="phone" value={biodata.phone} onChange={handleBiodataChange} className="w-full px-4 py-3 border rounded-lg" placeholder="No HP" required />
                                    <input type="date" name="tanggal_lahir" value={biodata.tanggal_lahir} onChange={handleBiodataChange} className="w-full px-4 py-3 border rounded-lg" required />
                                    <textarea name="alamat" value={biodata.alamat} onChange={handleBiodataChange} rows="3" className="w-full px-4 py-3 border rounded-lg md:col-span-2" placeholder="Alamat Lengkap" required />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={isLoading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                                        {isLoading ? "Menyimpan..." : "Simpan Biodata"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* PAGE: PROGRAM */}
                {activePage === "program" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                            <h1 className="text-2xl font-bold text-gray-800">Pilih Program Latihan</h1>
                            <p className="text-gray-600">Sesuaikan dengan minat dan bakat posisimu.</p>
                        </div>

                        {biodata.pilihan_program && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                <strong className="font-bold">Program Aktif: </strong>
                                <span>{LIST_PROGRAM.find(p => p.id === biodata.pilihan_program)?.judul || biodata.pilihan_program}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {LIST_PROGRAM.map((program) => (
                                <div key={program.id} className={`rounded-2xl p-6 border-2 transition-all hover:shadow-xl bg-white ${biodata.pilihan_program === program.id ? 'ring-4 ring-green-400 transform scale-105 border-green-400' : 'border-gray-100'}`}>
                                    <div className={`h-2 rounded-full mb-4 ${program.warna.split(' ')[0].replace('-50', '-500')}`}></div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{program.judul}</h3>
                                    <p className="text-sm text-gray-600 mb-4 h-16">{program.deskripsi}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="font-bold text-gray-700">{program.harga}</span>
                                        {biodata.pilihan_program === program.id ? (
                                            <button disabled className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold cursor-default">
                                                <i className="fas fa-check mr-2"></i> Terdaftar
                                            </button>
                                        ) : (
                                            <button onClick={() => handlePilihProgram(program.id)} className={`px-4 py-2 text-white rounded-lg font-medium shadow-md transition-colors ${program.btnWarna}`}>
                                                Pilih Ini
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PAGE: PROFIL SAYA */}
                {activePage === "profil" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                            <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
                            <p className="text-gray-600">Kelola informasi akun dan biodata diri.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Card Informasi Utama */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <i className="fas fa-user-circle text-blue-500"></i> Informasi Pribadi
                                </h2>

                                <div className="space-y-4">
                                    {/* Data Akun (User) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Nama Akun</label>
                                            <div className="p-3 bg-gray-50 rounded-lg border text-gray-800 font-medium">
                                                {user?.name || "..."}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Login</label>
                                            <div className="p-3 bg-gray-50 rounded-lg border text-gray-800 font-medium">
                                                {user?.email || "..."}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Biodata (Pelengkap) */}
                                    <div className="pt-4 border-t mt-4">
                                        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Data Biodata</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Nama Lengkap (Siswa)</label>
                                                <div className="p-3 bg-gray-50 rounded-lg border text-gray-800">
                                                    {biodata.nama_lengkap || "-"}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">No HP</label>
                                                <div className="p-3 bg-gray-50 rounded-lg border text-gray-800">
                                                    {biodata.phone || "-"}
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Alamat</label>
                                                <div className="p-3 bg-gray-50 rounded-lg border text-gray-800">
                                                    {biodata.alamat || "-"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-6 border-t mt-6">
                                        <button 
                                            onClick={handleEditClick}
                                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md"
                                        >
                                            <i className="fas fa-edit"></i> Edit Akun
                                        </button>
                                        <button 
                                            onClick={handleDeleteAccount}
                                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md"
                                        >
                                            <i className="fas fa-trash-alt"></i> Hapus Akun
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Info Kanan (Statistik) */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik Keuangan</h3>
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <p className="text-sm text-gray-600">Total Tagihan Aktif</p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            Rp {parseInt(keuangan.total_tagihan || 0).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PAGE: KAS SAYA */}
                {activePage === "kas saya" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
                            <h1 className="text-2xl font-bold text-gray-800">Info Keuangan</h1>
                        </div>
                        {/* Konten Kas (Bisa diambil dari MemberDashboard jika ingin detail) */}
                        <div className="p-6 bg-white rounded-2xl border">
                             <h3 className="font-bold text-lg mb-4">Riwayat Pembayaran</h3>
                             {keuangan.riwayat && keuangan.riwayat.length > 0 ? (
                                 <ul className="space-y-3">
                                     {keuangan.riwayat.map((item, idx) => (
                                         <li key={idx} className="flex justify-between p-3 bg-gray-50 rounded border">
                                             <span>{item.tanggal_bayar}</span>
                                             <span className="font-bold text-green-600">+ Rp {parseInt(item.jumlah_bayar).toLocaleString()}</span>
                                         </li>
                                     ))}
                                 </ul>
                             ) : (
                                 <p className="text-gray-500">Belum ada data riwayat.</p>
                             )}
                        </div>
                    </div>
                )}

            </main>

            <footer className="w-full flex justify-center py-4 bg-transparent mt-8">
                <p className="text-center text-gray-500 text-sm">
                    &copy; {tahunIni} Sepak Bola SMEMSA ? Membangun Generasi Berprestasi.
                </p>
            </footer>
        </div>
    );
};

export default UserDashboard;