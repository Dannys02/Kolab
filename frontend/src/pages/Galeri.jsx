import React, { useState } from "react";

export default function Galeri() {
    const [active, setActive] = useState("Semua");

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

    const categories = ["Semua", "Prestasi", "Kompetisi", "Latihan", "Event"];

    // FILTER GALLERY
    const filteredGallery =
        active === "Semua"
            ? cardCategory
            : cardCategory.filter((item) => item.category === active);

    return (
        <div className="pt-16">

            <section className="py-20 bg-gradient-to-br from-green-400 to-blue-600 text-white text-center bg-green-600">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">Galeri Kami</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                    Dokumentasi perjalanan, prestasi, dan momen berharga bersama SSB Akademi
                </p>
            </section>

            <div className="py-10 flex justify-center items-center gap-3 border-b border-gray">
                {categories.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActive(item)}
                        className={`${active === item ? "bg-green-600 text-white" : ""} 
                            border border-gray py-2 px-6
                            transition-colors duration-300 
                            hover:bg-green-500 hover:text-white 
                            rounded-[35px]`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="container py-10 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item, index) => (
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
        </div>
    );
}
