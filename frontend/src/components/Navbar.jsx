import React, { useState, useEffect } from "react";

export default function Navbar() {
    const [active, setActive] = useState("Beranda");
    const [click, setClick] = useState(false);

    const handleClick = e => {
        setActive(e.target.name);
    };

    const navItems = [
        { name: "Beranda", href: "#" },
        { name: "Program", href: "#" },
        { name: "Galeri", href: "#" },
        { name: "Artikel", href: "#" },
        { name: "Kontak", href: "#" }
    ];

    const clicked = e => {
        e.stopPropagation();
        setClick(!click);
    };

    const outClick = () => {
        setClick(false);
    };

    useEffect(() => {
        document.addEventListener("click", outClick);
        return () => {
            document.removeEventListener("click", outClick);
        };
    }, []);

    return (
        <nav className="bg-[rgba(255,255,255,0.5)] backdrop-blur-sm fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-black font-bold text-xl">
                                SSB Akademi Sepak Bola
                            </span>
                        </div>
                    </div>

                    <div onClick={ clicked } className="flex flex-col justify-between md:hidden h-5 w-6">
                        <span className="w-full h-[3px] bg-black"></span>
                        <span className="w-full h-[3px] bg-black"></span>
                        <span className="w-full h-[3px] bg-black"></span>
                    </div>

                    <div className={`${ click ? "top-[100%]" : "top-[-450%]" } absolute md:top-0 left-0 md:left-0 translate-[-50%, -50%] md:relative p-5 w-full md:w-fit bg-green-200 md:bg-transparent transition-top duration-300`}>
                        <div className="flex flex-col md:flex-row flex items-baseline md:space-x-4 space-y-4 md:space-y-0">
                            {navItems.map(item => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    name={item.name}
                                    onClick={handleClick}
                                    className={`${ click ? "" : "" } px-3 py-2 rounded-md text-black text-sm font-medium transition-colors duration-300 hover:bg-green-600 hover:text-white ${
                                        active === item.name
                                            ? "bg-green-600 text-white"
                                            : ""
                                    }`}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
