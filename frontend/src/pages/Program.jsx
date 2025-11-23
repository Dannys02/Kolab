import { Link } from "react-router-dom";
import { Clock, Users, Calendar, CheckCircle } from "lucide-react";

import programYouth from "../assets/program-youth.jpg";
import programGoalkeeper from "../assets/program-goalkeeper.jpg";
import programElite from "../assets/program-elite.jpg";

export default function Program() {
    const programs = [
        {
            title: "Program Usia Dini (U-8 & U-10)",
            description: "Pengenalan dasar sepak bola dengan metode fun learning untuk membangun fondasi keterampilan",
            image: programYouth,
            age: "6-10 Tahun",
            duration: "2x seminggu",
            participants: "15-20 siswa",
            price: "Rp 500.000/bulan",
            features: [
                "Teknik dasar menendang dan mengontrol bola",
                "Koordinasi dan keseimbangan tubuh",
                "Pengenalan posisi dan aturan permainan",
                "Pembentukan karakter sportif",
            ],
            badge: "Populer",
        },
        {
            title: "Program Remaja (U-12 & U-14)",
            description: "Pengembangan teknik lanjutan dan pemahaman taktik permainan modern",
            image: programElite,
            age: "10-14 Tahun",
            duration: "3x seminggu",
            participants: "18-22 siswa",
            price: "Rp 750.000/bulan",
            features: [
                "Teknik lanjutan dribbling dan passing",
                "Strategi dan formasi permainan",
                "Latihan fisik dan stamina",
                "Mental dan kepemimpinan tim",
            ],
            badge: "Recommended",
        },
        {
            title: "Program Elite (U-16 & U-18)",
            description: "Persiapan intensif untuk kompetisi tingkat tinggi dan karir profesional",
            image: programElite,
            age: "14-18 Tahun",
            duration: "4x seminggu",
            participants: "20-25 siswa",
            price: "Rp 1.000.000/bulan",
            features: [
                "Program latihan intensif bertaraf profesional",
                "Analisis video dan taktik modern",
                "Latihan mental dengan psikolog olahraga",
                "Kesempatan trial club profesional",
            ],
            badge: "Advanced",
        },
        {
            title: "Program Penjaga Gawang",
            description: "Spesialisasi khusus untuk calon kiper dengan teknik dan mental terbaik",
            image: programGoalkeeper,
            age: "10-18 Tahun",
            duration: "2x seminggu",
            participants: "8-12 siswa",
            price: "Rp 800.000/bulan",
            features: [
                "Teknik diving dan positioning",
                "Refleks dan koordinasi khusus",
                "Komunikasi dan organisasi pertahanan",
                "Distribution dan memulai serangan",
            ],
            badge: "Spesialis",
        },
    ];

    return (
        <div className="min-h-screen pt-16">
            <section className="py-20 bg-gradient-to-br from-green-400 to-blue-600 text-white text-center bg-green-600">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">Program Pelatihan Kami</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                    Pilih program yang sesuai dengan usia dan kemampuan Anda
                </p>
            </section>

            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {programs.map((program, index) => (
                        <div
                            key={index}
                            className="border rounded-xl overflow-hidden bg-white shadow-md duration-300 hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={program.image}
                                    alt={program.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                                <span className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                                    {program.badge}
                                </span>
                            </div>

                            <div className="p-6 space-y-4">
                                <h2 className="text-2xl font-bold">{program.title}</h2>
                                <p className="text-muted-foreground">{program.description}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-primary" />
                                        {program.age}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        {program.duration}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-primary" />
                                        {program.participants}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        90 menit/sesi
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Materi Pelatihan:</h4>
                                    <ul className="space-y-1">
                                        {program.features.map((f, i) => (
                                            <li key={i} className="flex gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border-t pt-4 flex md:flex-row flex-col h-[120px] md:h-fit justify-between items-start md:justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Biaya</p>
                                        <p className="text-2xl font-bold text-green-500">{program.price}</p>
                                    </div>

                                    <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600/80 transition">
                                        Daftar Program
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Fasilitas & Benefit Tambahan</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                        {[
                            { title: "Jersey & Perlengkapan", desc: "Seragam latihan resmi" },
                            { title: "Asuransi Kecelakaan", desc: "Perlindungan selama latihan" },
                            { title: "Rapor Perkembangan", desc: "Evaluasi per 3 bulan" },
                            { title: "Trial Gratis", desc: "1x sesi untuk member baru" },
                        ].map((b, i) => (
                            <div key={i} className="border rounded-xl bg-white shadow p-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-1">{b.title}</h3>
                                <p className="text-sm text-muted-foreground">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 text-center">
                <h2 className="text-4xl font-bold mb-4">Masih Bingung Memilih Program?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                    Hubungi kami untuk konsultasi gratis
                </p>
                <Link to="/kontak" className="mx-auto bg-blue-600 w-fit flex justify-center items-center text-white text-center px-8 py-3 rounded-lg text-lg hover:bg-blue-600/80 transition">
                    <span>Konsultasi Gratis</span>
                </Link>
            </section>
        </div>
    );
}