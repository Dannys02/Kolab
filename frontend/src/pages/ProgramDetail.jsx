import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SAMPLE_PROGRAMS = [
  { id: "reguler", judul: "Reguler / Youth", deskripsi: "Program pembinaan dasar usia 10-15 tahun.", harga: "Rp 50.000/bln" },
  { id: "elite", judul: "Elite Squad", deskripsi: "Tim inti sekolah untuk kompetisi LKS.", harga: "Rp 100.000/bln" },
  { id: "kiper", judul: "Goalkeeper Class", deskripsi: "Pelatihan khusus penjaga gawang.", harga: "Rp 75.000/bln" },
];

export default function ProgramDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const program = location.state?.program || SAMPLE_PROGRAMS.find(p => p.id === id) || null;
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!program) return;
    if (!confirm(`Konfirmasi memilih program ${program.judul}?`)) return;
    setIsLoading(true);
    try {
      // 1) Update/Create biodata dengan pilihan program
      const biodataResp = await axios.post("http://localhost:8000/api/biodata", { pilihan_program: program.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2) Dapatkan biodata_id dari endpoint tagihan-siswa (menggunakan token)
      let biodataId = biodataResp.data?.data?.id || null;
      if (!biodataId) {
        try {
          const tagihanSiswa = await axios.get('http://localhost:8000/api/tagihan-siswa', { headers: { Authorization: `Bearer ${token}` } });
          biodataId = tagihanSiswa.data?.biodata_id || null;
        } catch (err) {
          console.warn('Gagal ambil biodata_id via tagihan-siswa:', err);
        }
      }

      // 3) Jika biodataId tersedia, buat tagihan sesuai program
      const PRICE_MAP = { reguler: 50000, elite: 100000, kiper: 75000 };
      const amount = PRICE_MAP[program.id] || 0;
      if (biodataId && amount > 0) {
        const jatuhTempo = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const judul = `Biaya Program: ${program.judul}`;
        try {
          await axios.post('http://localhost:8000/api/tagihan', {
            biodata_id: biodataId,
            judul,
            jumlah: amount,
            jatuh_tempo: jatuhTempo
          }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) {
          console.error('Gagal membuat tagihan otomatis:', err);
          // proceed but notify user
          alert('Pilihan program tersimpan, namun pembuatan tagihan otomatis gagal. Hubungi admin.');
        }
      }

      // Arahkan ke halaman sukses dengan membawa data program
      navigate('/program-success', { state: { program } });
    } catch (err) {
      console.error(err);
      alert("Gagal memilih program. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!program) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow">Program tidak ditemukan.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">{program.judul}</h1>
        <p className="text-sm text-gray-600 mb-4">{program.deskripsi}</p>
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-xs text-gray-500">Biaya Bulanan</p>
            <p className="text-lg font-bold">{program.harga}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-100 rounded-lg">Kembali</button>
            <button onClick={handleConfirm} disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg">{isLoading ? 'Memproses...' : 'Konfirmasi Pilih Program'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
