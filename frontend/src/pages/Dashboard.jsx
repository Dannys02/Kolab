// dashboard.jsx
import React, { useState } from 'react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('biodata');
    const [searchTerm, setSearchTerm] = useState('');
    const [biodata, setBiodata] = useState({
        nama: '',
        email: '',
        telepon: '',
        alamat: '',
        tanggalLahir: ''
    });
    const [files, setFiles] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [totalTagihan, setTotalTagihan] = useState(2500000);

    const handleBiodataChange = (e) => {
        const { name, value } = e.target;
        setBiodata(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...uploadedFiles]);
    };

    const handlePayment = () => {
        if (paymentAmount && paymentAmount > 0) {
            alert(`Pembayaran sebesar Rp ${parseInt(paymentAmount).toLocaleString()} berhasil!`);
            setPaymentAmount('');
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border mb-8">
                    <div className="border-b">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'biodata', name: 'Input Biodata', icon: '👤' },
                                { id: 'berkas', name: 'Upload Berkas', icon: '📁' },
                                { id: 'pembayaran', name: 'Pembayaran Cash', icon: '💰' },
                                { id: 'tagihan', name: 'Cek Tagihan', icon: '🧾' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Input Biodata */}
                        {activeTab === 'biodata' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Input Biodata</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            name="nama"
                                            value={biodata.nama}
                                            onChange={handleBiodataChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={biodata.email}
                                            onChange={handleBiodataChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            placeholder="Masukkan email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nomor Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            name="telepon"
                                            value={biodata.telepon}
                                            onChange={handleBiodataChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            placeholder="Masukkan nomor telepon"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tanggal Lahir
                                        </label>
                                        <input
                                            type="date"
                                            name="tanggalLahir"
                                            value={biodata.tanggalLahir}
                                            onChange={handleBiodataChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Alamat
                                        </label>
                                        <textarea
                                            name="alamat"
                                            value={biodata.alamat}
                                            onChange={handleBiodataChange}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            placeholder="Masukkan alamat lengkap"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm">
                                        Simpan Biodata
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Upload Berkas */}
                        {activeTab === 'berkas' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Upload Berkas</h3>

                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 mb-2">
                                            <span className="text-blue-600 font-semibold">Klik untuk upload</span> atau drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max. 10MB)</p>
                                    </label>
                                </div>

                                {/* Uploaded Files */}
                                {files.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">Berkas Terupload</h4>
                                        <div className="space-y-3">
                                            {files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{file.name}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile(index)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pembayaran Cash */}
                        {activeTab === 'pembayaran' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Pembayaran Cash</h3>
                                <div className="max-w-md space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jumlah Pembayaran
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">Rp</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={paymentAmount}
                                                onChange={(e) => setPaymentAmount(e.target.value)}
                                                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Total Tagihan:</span>
                                            <span className="font-semibold text-gray-900">
                                                Rp {totalTagihan.toLocaleString()}
                                            </span>
                                        </div>
                                        {paymentAmount && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Sisa setelah bayar:</span>
                                                <span className="font-medium text-green-600">
                                                    Rp {(totalTagihan - parseInt(paymentAmount || 0)).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={!paymentAmount || paymentAmount <= 0}
                                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-sm"
                                    >
                                        Konfirmasi Pembayaran
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Cek Tagihan */}
                        {activeTab === 'tagihan' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Cek Total Tagihan</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Total Tagihan Card */}
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold">Total Tagihan</h4>
                                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold mb-2">
                                            Rp {totalTagihan.toLocaleString()}
                                        </p>
                                        <p className="text-blue-100 text-sm">Jatuh tempo: 30 Hari lagi</p>
                                    </div>

                                    {/* Riwayat Pembayaran */}
                                    <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Riwayat Pembayaran</h4>
                                        <div className="space-y-4">
                                            {[
                                                { date: '15 Jan 2024', amount: 500000, status: 'Lunas' },
                                                { date: '10 Des 2023', amount: 1000000, status: 'Lunas' },
                                                { date: '5 Nov 2023', amount: 1000000, status: 'Lunas' }
                                            ].map((payment, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{payment.date}</p>
                                                        <p className="text-sm text-gray-500">Pembayaran cicilan</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            Rp {payment.amount.toLocaleString()}
                                                        </p>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {payment.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
    );
};