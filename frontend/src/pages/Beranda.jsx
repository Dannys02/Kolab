import React, { useState } from "react";
import ProgramBola from "../assets/ProgramBola.jpg";

export default function Beranda() {
    const features = [
        {
            icon: "fa fa-graduation-cap",
            title: "Pelatihan Berkualitas",
            desc: "Program latihan tersertifikasi dengan pelatih berpengalaman profesional"
        },
        {
            icon: "fa fa-users",
            title: "Komunitas Solid",
            desc: "Bergabung dengan komunitas pemain muda yang bersemangat dan berbakat"
        },
        {
            icon: "fa fa-trophy",
            title: "Prestasi Membanggakan",
            desc: "Track record juara di berbagai kompetisi regional dan nasional"
        }
    ];

    const stats = [
        { number: "500+", label: "Siswa Aktif" },
        { number: "15+", label: "Pelatih Profesional" },
        { number: "50+", label: "Prestasi Juara" },
        { number: "10+", label: "Tahun Berdiri" }
    ];

    return (
        <section id="beranda">
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex justify-center items-center px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col text-center max-w-7xl mx-auto">
                    <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-5">
                        Wujudkan Mimpi Menjadi Pemain Sepak Bola Profesional
                    </h1>
                    <p className="text-white max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl">
                        Bergabunglah dengan akademi sepak bola terbaik dan raih
                        prestasi gemilang bersama kami
                    </p>
                    <div className="flex flex-col sm:flex-row items-center mx-auto gap-5 mt-10">
                        <a
                            href="/program"
                            className="bg-green-500 py-3 px-6 rounded-[35px] text-white hover:bg-green-600 transition-colors w-full sm:w-auto"
                        >
                            Lihat Program Kami
                        </a>
                        <a
                            href="/kontak"
                            className="bg-blue-500 py-3 px-6 rounded-[35px] text-white hover:bg-blue-600 transition-colors w-full sm:w-auto"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="max-w-6xl mx-auto text-center px-4 py-14">

                    <h2 className="text-3xl md:text-4xl font-bold text-black">
                        Mengapa Memilih Kami?
                    </h2>

                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                        Kami berkomitmen memberikan pendidikan sepak
                        bola terbaik dengan fasilitas dan metode modern
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-white"
                            >

                                <div className="w-12 h-12   rounded-full flex items-center justify-center mx-auto">

                                    <span className="text-green-600 text-xl">
                                        <i className={f.icon}></i>
                                    </span>

                                </div>

                                <h3 className="text-lg font-semibold mt-4">
                                    {f.title}
                                </h3>

                                <p className="text-gray-500 mt-2 text-sm">
                                    {f.desc}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

                <div className="bg-white py-16">

                    <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-8">

                        {stats.map((s, i) => (
                            <div key={i}>

                                <p className="text-3xl font-bold text-green-600">
                                    {s.number}
                                </p>

                                <p className="text-gray-500 text-sm mt-2">
                                    {s.label}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-16 px-4">

                    <h2 className="text-2xl md:text-3xl font-bold">
                        Siap Memulai Perjalanan Sepak Bola Anda?

                    </h2>

                    <p className="text-white/90 mt-3 max-w-lg mx-auto mb-6">
                        Daftar sekarang dan dapatkan trial gratis
                        untuk merasakan pengalaman latihan bersama kami
                    </p>

                    <a href="/register" className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold shadow">
                        Daftar Sekarang
                    </a>
                </div>
            </div>

            <div className="text-gray-800 font-sans p-4 sm:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto pt-8 pb-8">
                    <div className="flex flex-col md:flex-row items-start lg:space-x-12">
                        <div className="w-full md:w-[50%] lg:w-1/2 mb-8 lg:mb-0">
                            <h2 className="text-4xl font-bold mb-6">
                                Program Pelatihan Terstruktur & Profesional
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6 text-gray-600 max-w-lg">
                                Kami menawarkan program pelatihan yang dirancang khusus untuk mengembangkan kemampuan teknik, taktik, fisik, dan mental pemain.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Kurikulum berstandar internasional",
                                    "Pelatih berlisensi AFC & UEFA",
                                    "Fasilitas lapangan bertaraf internasional",
                                    "Program pengembangan karakter",
                                    "Kesempatan mengikuti kompetisi resmi"
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <i className="fas fa-check-circle flex-shrink-0 w-6 h-6 text-green-500 mr-3 mt-1 text-xl"></i>
                                        <p className="text-lg text-gray-700">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative hidden md:block h-[500px] rounded-2xl overflow-hidden shadow-xl shadow-black">
                            <img
                                src={ProgramBola}
                                alt="Program Bola"
                                className="h-full w-full object-cover object-center rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}