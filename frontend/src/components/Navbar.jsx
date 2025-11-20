import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from '../assets/logosmks.png';

export default function Navbar() {
    const [active, setActive] = useState("");
    const [click, setClick] = useState(false);
    const location = useLocation();

    const handleClick = (e) => {
        setActive(e.target.name);
    };

    const navItems = [
        { name: "Beranda", to: "/" },
        { name: "Program", to: "/program" },
        { name: "Galeri", to: "/galeri" },
        { name: "Artikel", to: "/artikel" },
        { name: "Kontak", to: "/kontak" }
    ];

    const clicked = (e) => {
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

    // SET ACTIVE SESUAI URL SEKARANG
    useEffect(() => {
        const currentPath = location.pathname;

        // cari item nav paling cocok berdasarkan "to"
        const found = navItems.find(item => item.to === currentPath);

        if (found) {
            setActive(found.name);
        } else {
            setActive("");
        }
    }, [location.pathname]);


    return (
        <nav className="bg-[rgba(255,255,255,0.5)] backdrop-blur-sm fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex items-center gap-3">
                            <img src={Logo} alt="" className="h-10 w-15" />
                            <span className="text-black font-bold text-xl">
                                SSB Sekolah Sepak Bola
                            </span>
                        </div>
                    </div>

                    <div onClick={clicked} className="flex flex-col justify-between md:hidden h-5 w-6">
                        <span className="w-full h-[3px] bg-black"></span>
                        <span className="w-full h-[3px] bg-black"></span>
                        <span className="w-full h-[3px] bg-black"></span>
                    </div>

                    <div className={`${click ? "top-[100%]" : "top-[-450%]"} z-[100] bg-green-100 md:bg-transparent md:bg-transparent absolute md:top-0 left-0 md:left-0 translate-[-50%, -50%] md:relative p-5 md:p-0 w-full md:w-fit transition-top duration-300`}>
                        <div className="flex flex-col md:flex-row flex items-baseline space-x-4 md:space-x-1 space-y-4 md:space-y-0">
                            {navItems.map(item => (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    name={item.name}
                                    onClick={handleClick}
                                    className={`${click ? "" : ""} px-3 py-2 rounded-md text-black text-sm font-medium transition-colors duration-300 hover:bg-green-600 hover:text-white ${active === item.name
                                        ? "bg-green-600 text-white"
                                        : ""
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
