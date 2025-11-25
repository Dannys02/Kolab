import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709M12 4a8 8 0 100 16 8 8 0 000-16z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-emerald-600 mb-4">404</h1>
        
        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. 
          Mungkin halaman telah dipindahkan atau alamat URL yang Anda masukkan salah.
        </p>

        {/* Action Buttons */}
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

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Jika Anda merasa ini adalah kesalahan, silakan hubungi{' '}
            <a 
              href="mailto:support@example.com" 
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