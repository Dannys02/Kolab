import React from "react";
import Logo from '../assets/logosmks.png';

export default function Footer() {
    const tahunIni = new Date().getFullYear();

    const menu = [
        { name: "Beranda", to: "/" },
        { name: "Program", to: "/program" },
        { name: "Galeri", to: "/galeri" },
        { name: "Artikel", to: "/artikel" },
        { name: "Kontak", to: "/kontak" }
    ];

    return (
        <footer className="border-t border-gray-200 w-full py-8 px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 mx-auto w-fit">
                <div className="md:col-span-1">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2">
                            <img src={Logo} alt="Logo SMKS MUHAMMADIYAH 1 GENTENG" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 max-w-xs">
                        Membangun karakter dan keterampilan sepak bola
                        terbaik untuk masa depan gemilang.
                    </p>
                </div>

                <div className="flex justify-center items-center md:w-[70%] w-fit">
                    <div className="w-fit">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Menu Cepat
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {menu.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.to}
                                        className="text-gray-600 hover:text-blue-700 transition duration-150"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="w-fit">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Kontak
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                            <i className="fas fa-map-marker-alt text-green-600 mr-2 text-base"></i>
                            <p className="text-gray-600">
                                Jl. KH. Mansyur No. 45, Genteng, Banyuwangi, Jawa Timur
                            </p>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-phone text-green-600 mr-2 text-base"></i>
                            <a
                                href="tel:+6281234567890"
                                className="text-gray-600 hover:text-blue-700 transition duration-150"
                            >
                                +62 812-3456-7890
                            </a>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-envelope text-green-600 mr-2 text-base"></i>
                            <a
                                href="mailto:info@ssbakademi.id"
                                className="text-gray-600 hover:text-blue-700 transition duration-150"
                            >
                                info@ssbakademi.id
                            </a>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 w-fit">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Ikuti Kami
                    </h3>
                    <div className="flex space-x-3">
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

            <div className="text-center py-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    © {tahunIni} SSB Akademi Sepak Bola. Semua hak
                    dilindungi.
                </p>
            </div>
        </footer>
    );
}