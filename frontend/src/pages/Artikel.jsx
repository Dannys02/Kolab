import { useState } from "react";
import { Search, Calendar, User, ArrowRight } from "lucide-react";

export default function Artikel() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("Semua");

    const featuredArticle = {
        title: "5 Tips Meningkatkan Teknik Dribbling untuk Pemain Muda",
        excerpt:
            "Dribbling adalah salah satu keterampilan fundamental dalam sepak bola. Pelajari teknik-teknik dasar yang akan membantu meningkatkan kontrol bola dan kepercayaan diri di lapangan.",
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfZSB2NfLNl1KjexAuVNA4pxFgOuXp9QF6oriCJVCV_sXPuNaeWQbO1T77I7cFP7XI2yydAtLg-U8nJL73l3JHggkqUvOWaeQDFBZxwQc5nE6c_avgPTcpEdxR3tRxzxtGH0GMmCK00oiQ9h9PHXVZHk9lPRN4MofXHK3jNxGur4zWEIp-7G_5S5VC/s800/dribbling.jpg",
        category: "Tutorial",
        author: "Coach Ahmad",
        date: "15 Mei 2024",
        readTime: "5 menit"
    };

    const articles = [
        {
            title: "5 Tips Meningkatkan Teknik Dribbling untuk Pemain Muda",
            excerpt:
                "Dribbling adalah salah satu keterampilan fundamental dalam sepak bola. Pelajari teknik-teknik dasar yang akan membantu meningkatkan kontrol bola dan kepercayaan diri di lapangan.",
            image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfZSB2NfLNl1KjexAuVNA4pxFgOuXp9QF6oriCJVCV_sXPuNaeWQbO1T77I7cFP7XI2yydAtLg-U8nJL73l3JHggkqUvOWaeQDFBZxwQc5nE6c_avgPTcpEdxR3tRxzxtGH0GMmCK00oiQ9h9PHXVZHk9lPRN4MofXHK3jNxGur4zWEIp-7G_5S5VC/s800/dribbling.jpg",
            category: "Tutorial",
            author: "Coach Ahmad",
            date: "15 Mei 2024",
            readTime: "5 menit"
        },
        {
            title: "Pentingnya Nutrisi dalam Performa Pemain Sepak Bola",
            excerpt:
                "Nutrisi yang tepat adalah kunci untuk performa optimal. Ketahui makanan dan pola makan yang disarankan untuk atlet muda.",
            image: "https://doktersehat.com/wp-content/uploads/2019/02/menu-makanan-pemain-sepak-bola-doktersehat-700x459.png",
            category: "Kesehatan",
            author: "Dr. Budi Santoso",
            date: "12 Mei 2024",
            readTime: "4 menit"
        },
        {
            title: "Mental Juara: Membangun Kepercayaan Diri di Lapangan",
            excerpt:
                "Aspek mental sama pentingnya dengan teknik fisik. Pelajari cara membangun mental yang kuat untuk menghadapi tekanan kompetisi.",
            image: "https://i.ytimg.com/vi/JoSPpHRcUeg/maxresdefault.jpg",
            category: "Psikologi",
            author: "Coach Rina",
            date: "10 Mei 2024",
            readTime: "6 menit"
        },
        {
            title: "Strategi Passing Modern dalam Sepak Bola Kontemporer",
            excerpt:
                "Passing bukan hanya tentang mengoper bola. Pelajari strategi passing modern yang digunakan club-club top Eropa.",
            image: "https://1.bp.blogspot.com/-y-xxkNBCHAs/WjaGkSrLV3I/AAAAAAAAFlg/Ih2TzEdUwvsJPCUP-2w-Sw8x7uPi1xedACLcBGAs/s1600/Strategi%2BPressing.jpg",
            category: "Taktik",
            author: "Coach Dedi",
            date: "8 Mei 2024",
            readTime: "7 menit"
        }
    ];

    const categories = [
        "Semua",
        "Tutorial",
        "Kesehatan",
        "Psikologi",
        "Taktik",
        "Inspirasi",
        "Training",
        "Teknologi"
    ];

    // FILTER UTAMA (Search + Kategori)
    const filteredArticles = articles.filter(a => {
        const cocokKategori =
            activeCategory === "Semua" ? true : a.category === activeCategory;

        const cocokSearch = a.title
            .toLowerCase()
            .includes(search.toLowerCase());

        return cocokKategori && cocokSearch;
    });

    return (
        <div className="min-h-screen pt-16">

            <section className="py-20 bg-gradient-to-br from-green-400 to-blue-600 text-white text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Artikel & Tips
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                    Pelajari tips, trik, dan wawasan dari para ahli untuk
                    meningkatkan permainan Anda
                </p>
            </section>

            <section className="py-8 border-b sticky top-16 z-[5] backdrop-blur supports-[backdrop-filter]:bg-/95">
                <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* SEARCH INPUT */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Cari artikel..."
                            className="w-full border rounded-md py-2 pl-10 pr-4 bg-white shadow"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* CATEGORY BUTTONS */}
                    <div className="flex gap-3 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`border border-gray px-4 py-2 rounded-full text-sm cursor-pointer transition-colors duration-300 hover:bg-green-500 hover:text-white transition text-black 
                                    ${
                                        activeCategory === cat
                                            ? "bg-green-500 text-white"
                                            : ""
                                    }
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">
                        Artikel Unggulan
                    </h2>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative h-96 lg:h-auto">
                            <img
                                src={featuredArticle.image}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow text-sm font-semibold">
                                {featuredArticle.category}
                            </div>
                        </div>

                        <div className="p-8 flex flex-col justify-center">
                            <h3 className="text-3xl font-bold mb-4">
                                {featuredArticle.title}
                            </h3>
                            <p className="text-base text-muted-foreground mb-6">
                                {featuredArticle.excerpt}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />{" "}
                                    {featuredArticle.author}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />{" "}
                                    {featuredArticle.date}
                                </div>
                                <span>• {featuredArticle.readTime} baca</span>
                            </div>

                            <button className="bg-green-500 text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-green-600">
                                Baca Selengkapnya
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Artikel Terbaru</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.length === 0 ? (
                            <p className="text-center col-span-full text-muted-foreground">
                                Artikel tidak ditemukan.
                            </p>
                        ) : (
                            filteredArticles.map((a, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition hover:-translate-y-2 overflow-hidden"
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={a.image}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow text-sm font-semibold">
                                            {a.category}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold mb-2 hover:text-green-500 transition">
                                            {a.title}
                                        </h3>

                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                            {a.excerpt}
                                        </p>

                                        <div className="flex gap-3 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />{" "}
                                                {a.author}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />{" "}
                                                {a.date}
                                            </div>
                                        </div>

                                        <button className="text-green-500 font-semibold flex items-center gap-2">
                                            Baca Artikel
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
