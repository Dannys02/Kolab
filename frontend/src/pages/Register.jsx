import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register({ setToken, setUserRole }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

   const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null); // Reset error sebelumnya
        
        try {
            const response = await axios.post('http://localhost:8000/api/register', formData);

            const { access_token, role, user } = response.data;

            // 1. Simpan LocalStorage
            localStorage.setItem('token', access_token);
            localStorage.setItem('role', role);
            localStorage.setItem('user_name', user.name);

            // 2. Update State App.jsx (Agar redirect otomatis)
            // [FIX 2] Cek apakah function ini ada sebelum dipanggil
            if (setToken && setUserRole) {
                setToken(access_token);
                setUserRole(role);
            }

            alert("Registrasi Berhasil!");
            // Navigate manual sebagai fallback jika state update telat
            // navigate('/portal/dashboard'); 

        } catch (err) {
            console.error("Register Error Full:", err); // Cek Console browser!

            if (err.response && err.response.status === 422) {
                // [FIX 3] Ambil pesan error spesifik dari Laravel
                const errors = err.response.data.errors;
                // Ambil error pertama yang ketemu (misal: "email has already been taken")
                const firstErrorKey = Object.keys(errors)[0];
                const errorMessage = errors[firstErrorKey][0];
                setError(errorMessage);
            } else if (err.response) {
                setError(err.response.data.message || "Terjadi kesalahan server.");
            } else {
                setError("Gagal terhubung ke server.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📝</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Daftar Akun Baru</h2>
                    <p className="text-gray-500 text-sm">Bergabunglah dengan Akademi Sepak Bola kami</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            name="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Contoh: Budi Santoso"
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="nama@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Minimal 8 karakter"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                        <input 
                            type="password" 
                            name="password_confirmation"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Ulangi password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md mt-6"
                    >
                        {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Login di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}