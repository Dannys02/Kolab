import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ProgramSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { program: fromState } = location.state || {};
    const [program, setProgram] = useState(fromState || null);
    const [loading, setLoading] = useState(false);

    // Jika tidak ada program di state, coba ambil dari API (biodata pengguna)
    useEffect(() => {
        if (program) return; // sudah ada
        const token = localStorage.getItem('token');
        if (!token) return;
        setLoading(true);
        axios.get('http://localhost:8000/api/tagihan-siswa', { headers: { Authorization: `Bearer ${token}` } })
            .then(resp => {
                const b = resp.data?.biodata;
                if (b?.pilihan_program) {
                    // Daftar program sederhana (harus cocok dengan yang ada di Program/ProgramDetail)
                    const LIST = [
                        { id: 'reguler', judul: 'Reguler / Youth', deskripsi: 'Program pembinaan dasar usia 10-15 tahun.', harga: 'Rp 50.000/bln' },
                        { id: 'elite', judul: 'Elite Squad', deskripsi: 'Tim inti sekolah untuk kompetisi LKS.', harga: 'Rp 100.000/bln' },
                        { id: 'kiper', judul: 'Goalkeeper Class', deskripsi: 'Pelatihan khusus penjaga gawang.', harga: 'Rp 75.000/bln' }
                    ];
                    const matched = LIST.find(p => p.id === b.pilihan_program) || { id: b.pilihan_program, judul: b.pilihan_program, deskripsi: '', harga: '' };
                    setProgram(matched);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (!program && loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">Memuat...</div>
        );
    }

    if (!program) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Terjadi Kesalahan</h2>
                <p className="text-gray-600 mb-6">Informasi program tidak ditemukan. Silakan kembali ke dashboard.</p>
                <Link to="/portal" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    Kembali ke Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all hover:scale-[1.01] duration-300">
                {/* Ikon Sukses */}
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-200 mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-3">Pendaftaran Berhasil!</h1>
                <p className="text-gray-600 mb-6">
                    Selamat, Anda telah terdaftar dalam program:
                </p>

                {/* Detail Program yang Dipilih */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-left">
                    <h2 className="text-2xl font-bold text-blue-700">{program.judul}</h2>
                    <p className="text-gray-700 mt-2">{program.deskripsi}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">Biaya Bulanan</p>
                        <p className="text-xl font-bold text-gray-800">{program.harga}</p>
                    </div>
                </div>

                {/* Langkah Selanjutnya */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Langkah Selanjutnya</h3>
                    <ul className="text-gray-600 space-y-3 list-disc list-inside text-left mx-auto max-w-md">
                        <li>Admin akan segera melakukan verifikasi pada pendaftaran Anda.</li>
                        <li>Tagihan pertama akan muncul di halaman **Kas Saya** setelah pendaftaran diverifikasi.</li>
                        <li>Silakan periksa jadwal latihan di **Dashboard** Anda.</li>
                    </ul>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/portal')} // Arahkan ke dashboard utama user
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Kembali ke Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/portal', { state: { defaultPage: 'kas saya' } })} // Arahkan ke dashboard dan buka tab kas
                        className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                        Cek Tagihan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgramSuccess;
