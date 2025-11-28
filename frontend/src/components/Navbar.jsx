import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../assets/logosmks.png";

export default function Navbar() {
    const [active, setActive] = useState("");
    const [click, setClick] = useState(false);
    const location = useLocation();

    const handleClick = e => {
        setActive(e.target.name);
    };

    const navItems = [
        { name: "Beranda", to: "/" },
        { name: "Program", to: "/program" },
        { name: "Galeri", to: "/galeri" },
        { name: "Artikel", to: "/artikel" },
        { name: "Kontak", to: "/kontak" }
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
                    <div className="flex items-center whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <img src={Logo} alt="" className="h-10 w-15" />
                            <span className="text-black font-bold text-xl">
                                Sekolah Sepak Bola
                            </span>
                        </div>
                    </div>

                    <div
                        onClick={clicked}
                        className="flex flex-col justify-between md:hidden h-5 w-6"
                    >
                        <span className="w-full h-[3px] bg-black"></span>
                        <span className="w-full h-[3px] bg-black"></span>
                        <span className="w-full h-[3px] bg-black"></span>
                    </div>

                    <div
                        className={`${
                            click
                                ? "top-full opacity-100"
                                : "top-[-800%] opacity-0 md:opacity-100"
                        } z-50 absolute md:relative left-0 w-full transition-all duration-500 ease-in-out md:top-0 p-5 md:p-0 bg-white shadow-lg md:shadow-none md:bg-transparent`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-end md:w-full space-y-2 md:space-y-0 md:space-x-1">
                            {navItems.map(item => (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    name={item.name}
                                    onClick={handleClick}
                                    className={`${
                                        active === item.name
                                            ? "bg-green-600 text-white shadow-md"
                                            : "text-gray-700 hover:text-white hover:bg-green-500"
                                    }
                      px-4 py-2 rounded-lg  text-base transition  -all duration-300     text-center`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="flex flex-col space-y-2 pt-2 md:flex-row md:space-y-0 md:space-x-2 md:pt-0">
                                <Link
                                    to="/login"
                                    onClick={handleClick}
                                    className="flex items-center justify-center space-x-2 
                px-4 py-2 rounded-lg text-base transition-all duration-300 text-center
                text-green-600 border border-green-600 hover:bg-green-100 hover:text-green-700"
                                >
                                    <i className="fa-solid fa-arrow-right-to-bracket"></i>{" "}
                                    <span>Login</span>
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={handleClick}
                                    className="flex items-center justify-center space-x-2 
                px-4 py-2 rounded-lg text-base transition-all duration-300 text-center
                bg-green-600 text-white shadow-md hover:bg-green-700"
                                >
                                    <i className="fa-solid fa-user-plus"></i>{" "}
                                    <span>Register</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
