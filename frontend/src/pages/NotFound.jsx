import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-question-circle text-white text-center text-6xl"></i>
          </div>
        </div>

        <h1 className="text-8xl font-bold text-emerald-600 mb-4">404</h1>

        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. 
          Mungkin halaman telah dipindahkan atau alamat URL yang Anda masukkan salah.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Kembali ke Beranda
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="border border-emerald-500 text-emerald-500 hover:bg-emerald-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Kembali Sebelumnya
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Jika Anda merasa ini adalah kesalahan, silakan hubungi{' '}
            <a 
              href="mailto:webdannys@gmail.com"
              className="text-emerald-500 hover:text-emerald-600 underline"
            >
              tim support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;