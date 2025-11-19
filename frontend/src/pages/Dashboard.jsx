import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({onLogout}) {
    // --- 1. STATE (PENAMPUNG DATA) ---
    const [activeTab, setActiveTab] = useState('biodata');
    
    // State Biodata
    const [biodata, setBiodata] = useState({
        nama_lengkap: '', email: '', phone: '', alamat: '', tanggal_lahir: ''
    });

    // State Umum
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState('');
    
    // State Keuangan (Data dari API)
    const [keuangan, setKeuangan] = useState({
        total_tagihan: 0,
        riwayat: []
    });

    // [BARU] State untuk Form Tambah Tagihan
    const [newTagihan, setNewTagihan] = useState({
        judul: '',
        jumlah: '',
        jatuh_tempo: ''
    });

    // --- 2. EFFECT (JALAN OTOMATIS) ---
    useEffect(() => {
        if (activeTab === 'tagihan') {
            fetchDataKeuangan();
        }
    }, [activeTab]);

    // --- 3. FUNGSI-FUNGSI (LOGIC) ---
    
    // Ambil Data Keuangan
    const fetchDataKeuangan = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/keuangan?biodata_id=1');
            setKeuangan(response.data);
        } catch (error) {
            console.error("Gagal mengambil data keuangan:", error);
        }
    };

    // [BARU] Fungsi Tambah Tagihan
    const handleAddTagihan = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Kirim data ke Laravel
            await axios.post('http://localhost:8000/api/tagihan', {
                biodata_id: 1, // Sementara hardcode ID 1
                judul: newTagihan.judul,
                jumlah: newTagihan.jumlah,
                jatuh_tempo: newTagihan.jatuh_tempo
            });

            alert("Tagihan Berhasil Ditambahkan!");
            setNewTagihan({ judul: '', jumlah: '', jatuh_tempo: '' }); // Reset form
            fetchDataKeuangan(); // Refresh data agar angka berubah

        } catch (error) {
            console.error("Gagal nambah tagihan", error);
            alert("Gagal menambah tagihan. Cek koneksi server.");
        } finally {
            setIsLoading(false);
        }
    };

    const token = localStorage.getItem('token');
    // Fungsi Submit Biodata
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // [PERBAIKAN DI SINI] Tambahkan parameter ke-3 untuk headers
            const response = await axios.post('http://localhost:8000/api/biodata', biodata, {
                headers: {
                    // Token ini HARUS SAMA PERSIS dengan yang ada di file .env Laravel Anda
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessage({ type: 'success', text: 'Sukses: ' + response.data.message });
            setBiodata({ nama_lengkap: '', email: '', phone: '', alamat: '', tanggal_lahir: '' });
        } catch (error) {
            // ... kode error handling (tetap sama) ...
            if (error.response && error.response.status === 403) {
                // Tangkap error spesifik 403 Forbidden
                 setMessage({ type: 'error', text: 'Gagal: Akses Ditolak! Token Rahasia Salah.' });
            } else if (error.response && error.response.data.message) {
                setMessage({ type: 'error', text: 'Gagal: ' + error.response.data.message });
            } else {
                setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi Helper lain
    const handleBiodataChange = (e) => setBiodata({ ...biodata, [e.target.name]: e.target.value });
    const handleFileUpload = (e) => setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));
    
    const handlePayment = () => {
        if (paymentAmount > 0) {
            alert(`Pembayaran Rp ${parseInt(paymentAmount).toLocaleString()} berhasil!`);
            setPaymentAmount('');
        }
    };

    // --- 4. TAMPILAN (JSX) ---
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            
            {/* Tabs Header */}
            <div className="bg-white rounded-xl shadow-sm border mb-8">
                <div className="border-b">
                    <nav className="flex space-x-8 px-6 overflow-x-auto">
                        {[
                            { id: 'biodata', name: 'Input Biodata', icon: '👤' },
                            { id: 'berkas', name: 'Upload Berkas', icon: '📁' },
                            { id: 'pembayaran', name: 'Pembayaran Cash', icon: '💰' },
                            { id: 'tagihan', name: 'Cek Tagihan', icon: '🧾' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                <span>{tab.icon}</span><span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                        
                <div className="p-6">
                    {/* Notifikasi */}
                    {message.text && (
                        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* TAB 1: Biodata */}
                    {activeTab === 'biodata' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Input Biodata</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" name="nama_lengkap" value={biodata.nama_lengkap} onChange={handleBiodataChange} className="w-full px-4 py-3 border rounded-lg" placeholder="Nama Lengkap" required />
                                <input type="email" name="email" value={biodata.email} onChange={handleBiodataChange} className="w-full px-4 py-3 border rounded-lg" placeholder="Email" required />
                                <input type="number" name="phone" value={biodata.phone} onChange={handleBiodataChange} className="w-full px-4 py-3 border rounded-lg" placeholder="No HP" required />
                                <input type="date" name="tanggal_lahir" value={biodata.tanggal_lahir} onChange={handleBiodataChange} className="w-full px-4 py-3 border rounded-lg" required />
                                <textarea name="alamat" value={biodata.alamat} onChange={handleBiodataChange} rows="3" className="w-full px-4 py-3 border rounded-lg md:col-span-2" placeholder="Alamat" required />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="submit" disabled={isLoading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                                    {isLoading ? 'Menyimpan...' : 'Simpan Biodata'}
                                </button>
                                <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center">
                                    Logout
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB 2: Berkas */}
                    {activeTab === 'berkas' && (
                        <div className="text-center p-8 border-2 border-dashed rounded-xl">
                            <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="cursor-pointer text-blue-600 font-semibold">Klik untuk upload berkas</label>
                            <div className="mt-4 space-y-2">
                                {files.map((f, i) => (
                                    <div key={i} className="flex justify-between p-2 bg-gray-50 rounded border">
                                        <span>{f.name}</span>
                                        <button onClick={() => removeFile(i)} className="text-red-600">Hapus</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: Pembayaran */}
                    {activeTab === 'pembayaran' && (
                        <div className="max-w-md space-y-4">
                            <h3 className="text-lg font-semibold">Pembayaran Cash</h3>
                            <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="Jumlah Bayar (Rp)" />
                            <div className="p-4 bg-blue-50 rounded-lg flex justify-between">
                                <span>Sisa Tagihan:</span>
                                <span className="font-bold">Rp {(keuangan.total_tagihan - (paymentAmount || 0)).toLocaleString('id-ID')}</span>
                            </div>
                            <button onClick={handlePayment} className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Konfirmasi</button>
                        </div>
                    )}

                    {/* TAB 4: Cek Tagihan (YANG KAMU TANYAKAN) */}
                    {activeTab === 'tagihan' && (
                        <div className="space-y-8">
                            
                            {/* 1. FORM TAMBAH TAGIHAN (BARU) */}
                            <div className="bg-white border border-orange-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    Buat Tagihan Baru
                                </h3>
                                <form onSubmit={handleAddTagihan} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Tagihan</label>
                                        <input 
                                            type="text" 
                                            placeholder="Cth: Uang Seragam"
                                            className="w-full p-2 border rounded-lg text-sm"
                                            value={newTagihan.judul}
                                            onChange={(e) => setNewTagihan({...newTagihan, judul: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Jumlah (Rp)</label>
                                        <input 
                                            type="number" 
                                            placeholder="Cth: 150000"
                                            className="w-full p-2 border rounded-lg text-sm"
                                            value={newTagihan.jumlah}
                                            onChange={(e) => setNewTagihan({...newTagihan, jumlah: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Jatuh Tempo</label>
                                        <input 
                                            type="date" 
                                            className="w-full p-2 border rounded-lg text-sm"
                                            value={newTagihan.jatuh_tempo}
                                            onChange={(e) => setNewTagihan({...newTagihan, jatuh_tempo: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        + Tambah
                                    </button>
                                </form>
                            </div>

                            <hr className="border-gray-200" />

                            {/* 2. INFO TAGIHAN & RIWAYAT (LAMA) */}
                            <h3 className="text-lg font-semibold text-gray-900">Cek Total Tagihan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* Kartu Biru */}
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                    <h4 className="font-semibold mb-4">Total Tagihan</h4>
                                    <p className="text-3xl font-bold mb-2">
                                        Rp {parseInt(keuangan.total_tagihan).toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-blue-100 text-sm">Sisa Kewajiban Pembayaran</p>
                                </div>

                                {/* Riwayat List */}
                                <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Riwayat Pembayaran</h4>
                                    <div className="space-y-4">
                                        {keuangan.riwayat.length === 0 ? (
                                            <p className="text-gray-500 italic">Belum ada data pembayaran.</p>
                                        ) : (
                                            keuangan.riwayat.map((payment, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(payment.tanggal_bayar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-sm text-gray-500">Metode: {payment.metode}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            Rp {parseInt(payment.jumlah_bayar).toLocaleString('id-ID')}
                                                        </p>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {payment.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}