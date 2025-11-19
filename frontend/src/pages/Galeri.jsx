import React, { useState } from 'react';

export default function Galeri() {
    const [active, setActive] = useState("Semua");

    const category = [
        { name: "Semua" },
        { name: "Prestasi" },
        { name: "Kompetisi" },
        { name: "Latihan" },
        { name: "Event" }
    ];

    const cardCategory = [
        {
            title: "Juara Turnamen Regional 2024",
            date: "Januari 2024",
            img: "https://picsum.photos/id/1011/600/400",
            category: "Prestasi",
        },
        {
            title: "Pertandingan Final Championship",
            date: "Februari 2024",
            img: "https://picsum.photos/id/1015/600/400",
            category: "Kompetisi",
        },
        {
            title: "Latihan Passing Drill",
            date: "Maret 2024",
            img: "https://picsum.photos/id/1024/600/400",
            category: "Latihan",
        },
        {
            title: "Program Youth Development",
            date: "Maret 2024",
            img: "https://picsum.photos/id/1021/600/400",
            category: "Latihan",
        },
        {
            title: "Pelatihan Kiper Intensif",
            date: "April 2024",
            img: "https://picsum.photos/id/1002/600/400",
            category: "Latihan",
        },
        {
            title: "Training Camp Elite Program",
            date: "April 2024",
            img: "https://picsum.photos/id/1005/600/400",
            category: "Event",
        },
    ];

    const videos = [
        {
            title: "Highlight Pertandingan Final",
            desc: "Momen kemenangan tim U-14",
        },
        {
            title: "Behind The Scene Training",
            desc: "Proses latihan intensif tim elite",
        },
    ];

    return (
        <div className="pt-16">
            <section className="py-20 bg-gradient-to-br from-green-400 to-blue-600 text-white text-center bg-green-600">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">Galeri Kami</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                    Dokumentasi perjalanan, prestasi, dan momen berharga bersama SSB Akademi                </p>
            </section>

            <div className="py-10 flex justify-center items-center gap-3 border-b border-gray">
                {category.map((item) => (
                    <button
                        key={item.name}
                        onClick={(e) => setActive(e.target.name)}
                        name={item.name}
                        className={`${active === item.name ? "bg-green-600 text-white" : ""} 
                        border border-gray py-2 px-6
                        transition-colors duration-300 
                        hover:bg-green-500 hover:text-white 
                        rounded-[35px]`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            <div className="container py-10 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardCategory.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <span className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 text-xs font-medium rounded-full shadow">
                                {item.category}
                            </span>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.date}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="py-16">
                <h2 className="text-3xl font-bold text-center mb-2">Video Highlight</h2>
                <p className="text-center text-gray-500 mb-10">
                    Saksikan aksi terbaik dari kompetisi dan latihan kami
                </p>

                <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                    {videos.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300"
                        >
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8 text-green-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">Video Coming Soon</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}