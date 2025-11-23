import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// [PENTING] Komponen menerima props 'setToken' dari App.js
export default function Login({ setToken, setUserRole }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // 2. Inisialisasi navigate
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email: email,
                password: password
            });

            const { access_token, user, role } = response.data;

            // Simpan LocalStorage
            localStorage.setItem('token', access_token);
            localStorage.setItem('user_name', user.name);
            localStorage.setItem('role', role);

            // Update State App
            setToken(access_token);
            setUserRole(role);

            // 3. [SOLUSI] Paksa Pindah Halaman Manual
            // Ini memastikan kita pindah hanya setelah data siap
            if (role === 'admin') {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/portal/dashboard', { replace: true });
            }

        } catch (err) {
            // ... error handling tetap sama
            console.error(err);
            setError('Login Gagal. Cek email/password.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- 3. TAMPILAN UI ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
                        <p className="text-green-100">Masuk untuk mengelola data</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-sm text-red-700">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-colors"
                                    placeholder="Masukkan Akun Anda"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-colors"
                                    placeholder="Masukkan Password Anda"
                                />
                            </div>
                            <button
                                type="submit" disabled={isLoading}
                                className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transition-all flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-700 hover:to-green-800'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Memproses...
                                    </>
                                ) : 'Masuk'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}