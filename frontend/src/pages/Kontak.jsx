import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        nama: '',
        subjek: '', // Kita pakai subjek agar chat WA lebih jelas
        pesan: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Siapkan Pesan WhatsApp
        const message = `Halo Admin SSB, saya *${formData.nama}*.\n\nIngin bertanya tentang: *${formData.subjek}*.\n\nIsi Pesan:\n${formData.pesan}`;
        
        // 2. Encode pesan agar URL friendly (spasi jadi %20, dll)
        const encodedMessage = encodeURIComponent(message);
        
        // 3. Nomor Admin (Ganti dengan nomor asli, format 628...)
        const phoneNumber = '62895368757054'; 
        
        // 4. Buka Link WhatsApp di tab baru
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        
        // 5. Reset Form (Opsional)
        setFormData({ nama: '', subjek: '', pesan: '' });
    };

    return (
        <div className="min-h-screen py-16 bg-gradient-to-br from-green-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Contact Form Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Chat WhatsApp</h2>
                            <p className="text-gray-600">
                                Isi form di bawah ini untuk langsung terhubung dengan Admin kami via WhatsApp.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama Input */}
                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap *
                                </label>
                                <input
                                    type="text"
                                    id="nama"
                                    name="nama"
                                    required
                                    value={formData.nama}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>

                            {/* Subjek Input */}
                            <div>
                                <label htmlFor="subjek" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subjek / Keperluan *
                                </label>
                                <input
                                    type="text"
                                    id="subjek"
                                    name="subjek"
                                    required
                                    value={formData.subjek}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Contoh: Pendaftaran Siswa Baru"
                                />
                            </div>

                            {/* Pesan Textarea */}
                            <div>
                                <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 mb-2">
                                    Pesan Tambahan *
                                </label>
                                <textarea
                                    id="pesan"
                                    name="pesan"
                                    required
                                    rows="4"
                                    value={formData.pesan}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                                    placeholder="Tulis detail pesan Anda..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 font-semibold text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                            >
                                {/* Icon WA */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                Kirim ke WhatsApp
                            </button>
                        </form>
                    </div>

                    {/* Map & Info Section */}
                    <div className="space-y-8">
                        {/* Map Container */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="h-80 bg-gradient-to-br from-green-100 to-green-200 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">SMKS Muhammadiyah 1 Genteng</h3>
                                        <p className="text-gray-600">Lokasi Sekolah</p>
                                        <a href="https://maps.google.com/?q=SMKS+Muhammadiyah+1+Genteng" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition">
                                            Buka di Google Maps
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Info Alamat Sekolah */}
                            <div className="p-6 border-t">
                                <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Alamat Sekolah</h4>
                                        <p className="text-gray-600 mt-1">Jl. KH. Mansyur No. 45, Genteng, Banyuwangi</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;