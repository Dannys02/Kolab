import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MemberDashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('biodata');
    const tahunIni = new Date().getFullYear();

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
        riwayat: [],
        list_tagihan: [] // [BARU] Menyimpan daftar item tagihan
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (activeTab === 'tagihan') {
            fetchDataKeuangan();
        }
    }, [activeTab]);

    // [PERUBAHAN] Ambil Data Keuangan (Tagihan Siswa Login)
    const fetchDataKeuangan = async () => {
        try {
            // Gunakan endpoint baru '/api/tagihan-siswa'
            const response = await axios.get('http://localhost:8000/api/tagihan-siswa', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setKeuangan(response.data);
        } catch (error) {
            console.error("Gagal mengambil data keuangan:", error);
        }
    };

    // Fungsi Submit Biodata (Tetap sama)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await axios.post('http://localhost:8000/api/biodata', biodata, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Sukses: ' + response.data.message });
            setBiodata({ nama_lengkap: '', email: '', phone: '', alamat: '', tanggal_lahir: '' });
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setMessage({ type: 'error', text: 'Gagal: Akses Ditolak!' });
            } else {
                setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBiodataChange = (e) => setBiodata({ ...biodata, [e.target.name]: e.target.value });
    const handleFileUpload = (e) => setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));

    const handlePayment = async () => {
        if (!paymentAmount || paymentAmount <= 0) {
            alert("Masukkan jumlah pembayaran yang valid.");
            return;
        }
        if (!window.confirm(`Yakin input pembayaran sebesar Rp ${parseInt(paymentAmount).toLocaleString()}?`)) return;

        setIsLoading(true);
        try {
            // Kirim ke API Laravel
            // Butuh biodata_id yang didapat dari fetchKeuangan
            if (!keuangan.biodata_id) {
                alert("Gagal identifikasi siswa. Refresh halaman.");
                return;
            }

            await axios.post('http://localhost:8000/api/pembayaran', {
                biodata_id: keuangan.biodata_id,
                jumlah_bayar: paymentAmount
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert(`Pembayaran Berhasil!`);
            setPaymentAmount('');
            fetchDataKeuangan(); // Refresh data
        } catch (error) {
            console.error("Gagal bayar", error);
            alert("Gagal memproses pembayaran.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            {/* Tabs Header */}
            <div className="bg-white rounded-xl shadow-sm border mb-8">
                <div className="border-b">
                    <nav className="flex space-x-8 px-6 overflow-x-auto">
                        {[
                            { id: 'biodata', name: 'Input Biodata', icon: '?' },
                            { id: 'berkas', name: 'Upload Berkas', icon: '?' },
                            { id: 'tagihan', name: 'Cek Tagihan', icon: '?' }
                        ].map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                <span>{tab.icon}</span><span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {message.text && ( <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{message.text}</div> )}

                    {/* Biodata */}
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
                                <button type="submit" disabled={isLoading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">{isLoading ? 'Menyimpan...' : 'Simpan Biodata'}</button>
                                <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center">Logout</button>
                            </div>
                        </form>
                    )}

                    {/* Berkas */}
                    {activeTab === 'berkas' && (
                        <div className="text-center p-8 border-2 border-dashed rounded-xl">
                            <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="cursor-pointer text-blue-600 font-semibold">Klik untuk upload berkas</label>
                            <div className="mt-4 space-y-2">
                                {files.map((f, i) => ( <div key={i} className="flex justify-between p-2 bg-gray-50 rounded border"><span>{f.name}</span><button onClick={() => removeFile(i)} className="text-red-600">Hapus</button></div> ))}
                            </div>
                        </div>
                    )}

                    {/* Cek Tagihan (FITUR BARU) */}
                    {activeTab === 'tagihan' && (
                        <div className="space-y-8">
                            <h3 className="text-lg font-semibold text-gray-900">Info Tagihan Anda</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Kartu Total Tagihan (Hutang) */}
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                    <h4 className="font-semibold mb-4">Sisa Tagihan</h4>
                                    <p className="text-3xl font-bold mb-2">Rp {parseInt(keuangan.total_tagihan).toLocaleString('id-ID')}</p>
                                    <p className="text-blue-100 text-sm">Segera selesaikan pembayaran.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* LIST TAGIHAN */}
                                <div className="border rounded-xl p-6 bg-gray-50">
                                    <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Rincian Tagihan</h4>
                                    {keuangan.list_tagihan && keuangan.list_tagihan.length > 0 ? (
                                        <ul className="space-y-3">
                                            {keuangan.list_tagihan.map((item) => (
                                                <li key={item.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.judul}</p>
                                                        <p className="text-xs text-gray-500">Tempo: {item.jatuh_tempo}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-800">Rp {parseInt(item.jumlah).toLocaleString('id-ID')}</p>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Lunas' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.status}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-gray-500">Tidak ada tagihan aktif.</p>}
                                </div>

                                {/* FORM BAYAR & RIWAYAT */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                                        <h4 className="font-bold text-gray-800 mb-3">Bayar Sekarang</h4>
                                        <div className="flex gap-2">
                                            <input type="number" placeholder="Jumlah (Rp)" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="flex-1 border rounded-lg px-4 py-2" />
                                            <button onClick={handlePayment} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400">{isLoading ? '...' : 'Bayar'}</button>
                                        </div>
                                    </div>

                                    <div className="border rounded-xl p-6">
                                        <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Riwayat Pembayaran</h4>
                                        <ul className="divide-y">
                                            {keuangan.riwayat && keuangan.riwayat.map((item, idx) => (
                                                <li key={idx} className="py-3 flex justify-between">
                                                    <div><p className="text-sm font-medium">Pembayaran Masuk</p><p className="text-xs text-gray-500">{item.tanggal_bayar}</p></div>
                                                    <p className="font-bold text-green-600">+ Rp {parseInt(item.jumlah_bayar).toLocaleString('id-ID')}</p>
                                                </li>
                                            ))}
                                            {(!keuangan.riwayat || keuangan.riwayat.length === 0) && <p className="text-gray-500 text-sm">Belum ada riwayat.</p>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <footer className="text-center py-4 text-gray-500"><p>&copy; {tahunIni} Kolab. Hak cipta dilindungi.</p></footer>
        </main>
    );
}