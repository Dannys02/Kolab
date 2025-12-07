import React, { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        nama: "",
        subjek: "", // Kita pakai subjek agar chat WA lebih jelas
        pesan: ""
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();

        // 1. Siapkan Pesan WhatsApp
        const message = `Halo Admin SSB, Saya *${formData.nama}* ingin mengajukan pertanyaan terkait *${formData.subjek}*. Berikut adalah isi pesan saya : 
"${formData.pesan}". Terima kasih atas perhatian dan responnya. Salam hormat, *${formData.nama}*`;

        // 2. Encode pesan agar URL friendly (spasi jadi %20, dll)
        const encodedMessage = encodeURIComponent(message);

        // 3. Nomor Admin (Ganti dengan nomor asli, format 628...)
        const phoneNumber = "6285645837298";

        // 4. Buka Link WhatsApp di tab baru
        window.open(
            `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
            "_blank"
        );

        // 5. Reset Form (Opsional)
        setFormData({ nama: "", subjek: "", pesan: "" });
    };

    return (
        <div className="min-h-screen py-16 bg-gradient-to-br from-green-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Chat WhatsApp
                            </h2>
                            <p className="text-gray-600">
                                Isi form di bawah ini untuk langsung terhubung
                                dengan Admin kami via WhatsApp.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="nama"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
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

                            <div>
                                <label
                                    htmlFor="subjek"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Subjek / Keperluan *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                                    <input
                                        type="text"
                                        id="subjek"
                                        name="subjek"
                                        required
                                        value={formData.subjek}
                                        onChange={handleChange}
                                        className="block w-full pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                        placeholder="Subjek"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="alamat"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Alamat *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="alamat"
                                        name="alamat"
                                        required
                                        value={formData.alamat}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                        placeholder="Masukkan alamat lengkap"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="pesan"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
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

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 font-semibold text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                            >
                                {/* Icon WA */}
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Kirim ke WhatsApp
                            </button>
                        </form>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="h-80 bg-gradient-to-br from-green-100 to-green-200 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <svg
                                                className="w-8 h-8 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            SMKS Muhammadiyah 1 Genteng
                                        </h3>
                                        <p className="text-gray-600">
                                            Lokasi Sekolah
                                        </p>
                                        <a
                                            href="https://maps.google.com/?q=SMKS+Muhammadiyah+1+Genteng"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition"
                                        >
                                            Buka di Google Maps
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Info Alamat Sekolah */}
                            <div className="p-6 border-t">
                                <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Alamat Sekolah
                                        </h4>
                                        <p className="text-gray-600 mt-1">
                                            Jl. KH. Mansyur No. 45, Genteng,
                                            Banyuwangi
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Informasi Kontak
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Telepon
                                        </h4>
                                        <p className="text-gray-600">
                                            (0333) 845672
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Email
                                        </h4>
                                        <p className="text-gray-600">
                                            info@smkmuh1genteng.sch.id
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Jam Operasional
                                        </h4>
                                        <p className="text-gray-600">
                                            Senin - Jumat: 07:00 - 16:00 WIB
                                        </p>
                                        <p className="text-gray-600">
                                            Sabtu: 07:00 - 12:00 WIB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-4">
                                    Follow Kami
                                </h4>
                                <div className="flex space-x-4">
                                    <a
                                        href="#"
                                        className="group w-8 h-8 rounded-full bg-gray-100 hover:bg-green-500 flex items-center justify-center transition-colors duration-150"
                                        aria-label="Facebook"
                                    >
                                        <i className="fab fa-facebook-f text-gray-600 group-hover:text-white text-lg"></i>
                                    </a>

                                    <a
                                        href="#"
                                        className="group w-8 h-8 rounded-full bg-gray-100 hover:bg-green-500 flex items-center justify-center transition-colors duration-150"
                                        aria-label="Instagram"
                                    >
                                        <i className="fab fa-instagram text-gray-600 group-hover:text-white text-lg"></i>
                                    </a>

                                    <a
                                        href="#"
                                        className="group w-8 h-8 rounded-full bg-gray-100 hover:bg-green-500 flex items-center justify-center transition-colors duration-150"
                                        aria-label="Twitter"
                                    >
                                        <i class="fab fa-tiktok text-gray-600 group-hover:text-white text-lg"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Contact;
