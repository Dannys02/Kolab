import React, { useState } from 'react';
import axios from 'axios';

// [PENTING] Komponen menerima props 'setToken' dari App.js
// Ini kuncinya: saat login sukses, kita panggil setToken agar App.js tahu user sudah login
export default function Login({ setToken }) {
    
    // --- 1. STATE MANAGEMENT ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Untuk animasi loading tombol
    const [error, setError] = useState(''); // Untuk menampilkan pesan error

    // --- 2. FUNGSI LOGIN ---
    const handleLogin = async (e) => {
        e.preventDefault(); // Mencegah halaman refresh otomatis saat submit
        setIsLoading(true); // Aktifkan loading
        setError('');       // Reset pesan error sebelumnya

        try {
            // Request ke Backend Laravel
            const response = await axios.post('http://localhost:8000/api/login', {
                email: email,
                password: password
            });

            // Ambil data dari respon sukses
            const token = response.data.access_token;
            const userName = response.data.user.name;

            // Simpan ke Local Storage browser (agar saat direfresh tetap login)
            localStorage.setItem('token', token);
            localStorage.setItem('user_name', userName);

            // [SANGAT PENTING]
            // Update state di App.js. React akan mendeteksi perubahan ini
            // dan otomatis memindahkan halaman ke Dashboard (sesuai logika di App.js)
            setToken(token);

        } catch (err) {
            console.error('Login Error:', err);
            
            // Menangani Error dari Backend
            if (err.response && err.response.status === 401) {
                // 401 artinya Unauthorized (Email/Pass salah)
                setError('Email atau password salah. Silakan cek kembali.');
            } else if (err.code === 'ERR_NETWORK') {
                // Backend mati atau tidak bisa dihubungi
                setError('Gagal terhubung ke server. Cek koneksi internet atau nyalakan Laravel.');
            } else {
                // Error lainnya
                setError('Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            // Apapun yang terjadi (sukses/gagal), matikan loading
            setIsLoading(false);
        }
    };

    // --- 3. TAMPILAN UI (JSX) ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    
                    {/* Header Hijau */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-green-100">Silakan masuk ke akun Admin SSB</p>
                    </div>

                    <div className="p-8">
                        {/* Notifikasi Error (Muncul hanya jika ada error) */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center animate-pulse">
                                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-700 text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {/* Form Input */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                        placeholder="email khusus admin"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                        placeholder="Masukkan password"
                                    />
                                </div>
                            </div>

                            {/* Tombol Login dengan Loading State */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-semibold shadow-lg flex justify-center items-center
                                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    'Masuk Dashboard'
                                )}
                            </button>
                        </form>

                        {/* Footer UI tambahan (Opsional) */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-sm text-gray-500">
                                Lupa password? Hubungi tim IT Support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}