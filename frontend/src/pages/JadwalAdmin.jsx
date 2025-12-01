import React, { useEffect, useState } from "react";
import axios from "axios";

// ====================================================================
// A. KOMPONEN MODAL EDIT JADWAL
// ====================================================================

const ModalEditJadwal = ({
    isOpen,
    onClose,
    form,
    onChange,
    onSubmit,
    isLoading
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform scale-100 transition-transform duration-300">
                <div className="px-6 py-4 bg-green-600 text-white font-bold text-lg">
                    Edit Jadwal Latihan
                </div>

                <form className="p-6 space-y-4" onSubmit={onSubmit}>
                    {/* Hari */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                        <input
                            name="hari"
                            value={form.hari}
                            onChange={onChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>

                    {/* Lokasi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                        <input
                            name="lokasi"
                            value={form.lokasi}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>

                    {/* Jam Mulai */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                        <input
                            type="time"
                            name="jam_mulai"
                            value={form.jam_mulai}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>

                    {/* Jam Selesai */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                        <input
                            type="time"
                            name="jam_selesai"
                            value={form.jam_selesai}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>

                    {/* Materi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Materi</label>
                        <input
                            name="materi"
                            value={form.materi}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>

                    {/* Aktif Checkbox */}
                    <div className="flex items-center pt-2">
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="aktif"
                                checked={form.aktif}
                                onChange={onChange}
                                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Aktif</span>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 shadow-sm"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-5 py-2 text-white rounded-lg transition duration-150 shadow-md ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {isLoading ? "Mengupdate..." : "Update Jadwal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ====================================================================
// B. KOMPONEN UTAMA JADWAL ADMIN
// ====================================================================

export default function JadwalAdmin() {
    // ------------------
    // STATE
    // ------------------
    const [jadwals, setJadwals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading submit
    
    // State untuk Form Tambah/Edit
    const initialFormState = {
        hari: "",
        jam_mulai: "",
        jam_selesai: "",
        materi: "",
        lokasi: "",
        aktif: true
    };
    const [form, setForm] = useState(initialFormState);
    
    // State untuk Edit/Modal
    const [editingId, setEditingId] = useState(null);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false); // State untuk modal

    const token = localStorage.getItem("token");

    // ------------------
    // FETCH DATA
    // ------------------
    const fetchJadwals = async () => {
        setLoading(true);
        if (!token) {
            console.error("Token otentikasi tidak ditemukan. Harap login.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get("http://localhost:8000/api/jadwal", {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Pastikan data yang diterima adalah array
            setJadwals(res.data.data || []); 
        } catch (err) {
            console.error("Gagal mengambil jadwal", err);
            // alert("Gagal mengambil jadwal"); // Hindari alert yang mengganggu
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJadwals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ------------------
    // HANDLERS
    // ------------------

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!token) {
            alert("Sesi Anda berakhir. Silakan login ulang.");
            setIsSubmitting(false);
            return;
        }

        try {
            let res;
            if (editingId) {
                // UPDATE (Dikelola oleh ModalEditJadwal)
                res = await axios.put(
                    `http://localhost:8000/api/jadwal/${editingId}`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Update State di List
                setJadwals(
                    jadwals.map(j => (j.id === editingId ? res.data.data : j))
                );
                
                // Tutup modal dan reset form/ID
                setEditingId(null);
                setIsModalEditOpen(false);
                alert("Jadwal berhasil diupdate!");

            } else {
                // TAMBAH BARU
                res = await axios.post(
                    "http://localhost:8000/api/jadwal",
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // Tambahkan ke awal list
                setJadwals([res.data.data, ...jadwals]); 
                alert("Jadwal berhasil ditambahkan!");
            }
            
            // Reset Form Tambah setelah berhasil
            setForm(initialFormState); 
        } catch (err) {
            console.error("Gagal menyimpan jadwal", err);
            alert("Gagal menyimpan jadwal. Cek input atau koneksi server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenEdit = jadwal => {
        // 1. Set ID yang diedit
        setEditingId(jadwal.id);
        
        // 2. Isi form dengan data yang diedit
        setForm({
            hari: jadwal.hari || "",
            jam_mulai: jadwal.jam_mulai || "",
            jam_selesai: jadwal.jam_selesai || "",
            materi: jadwal.materi || "",
            lokasi: jadwal.lokasi || "",
            aktif: !!jadwal.aktif // Pastikan boolean
        });
        
        // 3. Buka Modal
        setIsModalEditOpen(true);
    };
    
    const handleCloseEdit = () => {
        // Tutup Modal
        setIsModalEditOpen(false);
        // Reset form dan ID yang diedit
        setForm(initialFormState); 
        setEditingId(null);
    };


    const handleDelete = async id => {
        // Ganti confirm() karena berjalan di iFrame
        const confirmed = window.confirm("Yakin hapus jadwal ini?");
        if (!confirmed) return;

        if (!token) {
             console.error("Token otentikasi hilang.");
             return;
        }
        
        try {
            await axios.delete(`http://localhost:8000/api/jadwal/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter jadwal yang sudah dihapus
            setJadwals(jadwals.filter(j => j.id !== id)); 
            alert("Jadwal berhasil dihapus!");
        } catch (err) {
            console.error("Gagal menghapus jadwal", err);
            alert("Gagal menghapus jadwal.");
        }
    };

    // ------------------
    // VIEW
    // ------------------
    
    // Logika agar form yang sama bisa digunakan untuk Tambah dan Edit
    const isEditMode = !!editingId && !isModalEditOpen; 
    
    return (
        <div className="rounded-2xl shadow-lg p-6 border border-gray-100 bg-white space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-800">Manajemen Jadwal Latihan</h2>

            {/* Form Tambah Baru (Hanya tampil saat tidak ada editing ID) */}
            {!isEditMode && (
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-green-200 rounded-xl bg-green-50"
                >
                    <h3 className="font-bold text-lg md:col-span-2 text-green-700">Tambah Jadwal Baru</h3>
                    
                    {/* Hari & Lokasi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                        <input
                            name="hari"
                            value={form.hari}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>
    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                        <input
                            name="lokasi"
                            value={form.lokasi}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>
    
                    {/* Jam Mulai & Selesai */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                        <input
                            type="time"
                            name="jam_mulai"
                            value={form.jam_mulai}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>
    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                        <input
                            type="time"
                            name="jam_selesai"
                            value={form.jam_selesai}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>
    
                    {/* Materi */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Materi</label>
                        <input
                            name="materi"
                            value={form.materi}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                        />
                    </div>
    
                    {/* Submit & Aktif */}
                    <div className="flex items-center gap-4 md:col-span-2 pt-2">
                        <label className="inline-flex items-center gap-2 text-gray-700">
                            <input
                                type="checkbox"
                                name="aktif"
                                checked={form.aktif}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm font-medium">Aktifkan Jadwal</span>
                        </label>
                        
                        <div className="flex-1 text-right">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 text-white rounded-lg font-semibold shadow-md transition duration-200 ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {isSubmitting ? "Menyimpan..." : "Tambah Jadwal"}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Daftar Jadwal */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="font-extrabold text-xl mb-4 text-gray-800">Daftar Jadwal Tersimpan</h3>
                {loading ? (
                    <p className="text-gray-500 italic">Memuat data jadwal...</p>
                ) : (
                    <ul className="space-y-3">
                        {jadwals.length === 0 && (
                            <li className="text-sm text-gray-500 p-3 bg-white rounded shadow-sm">
                                Belum ada jadwal yang terdaftar.
                            </li>
                        )}
                        {jadwals.map(j => (
                            <li
                                key={j.id}
                                className={`p-4 rounded-lg flex justify-between items-center transition duration-200 ${j.aktif ? 'bg-white shadow-sm hover:shadow-md border border-gray-100' : 'bg-gray-100 text-gray-500 opacity-80'}`}
                            >
                                <div>
                                    <div className="font-extrabold text-lg flex items-center gap-2">
                                        {j.aktif ? (
                                            <span className="h-2 w-2 bg-green-500 rounded-full inline-block"></span>
                                        ) : (
                                            <span className="h-2 w-2 bg-red-500 rounded-full inline-block"></span>
                                        )}
                                        {j.hari}
                                    </div>
                                    <div className="text-sm font-semibold mt-1">
                                        {j.jam_mulai
                                            ? `${j.jam_mulai} - ${
                                                  j.jam_selesai || "Selesai"
                                              }`
                                            : "Waktu tidak ditentukan"}
                                    </div>
                                    <div className="text-sm text-gray-600 italic">
                                        {j.materi || "Tanpa Materi"} ({j.lokasi || "Lokasi Rahasia"})
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-1 items-center">
                                    <button
                                        onClick={() => handleOpenEdit(j)}
                                        className="text-yellow-600 hover:text-yellow-800 p-2 rounded-full transition duration-150 hover:bg-yellow-50"
                                        title="Edit Jadwal"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-4.326 3.905L2.83 15.176V17h1.823l8.03-8.03-2.83-2.83z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(j.id)}
                                        className="text-red-600 hover:text-red-800 p-2 rounded-full transition duration-150 hover:bg-red-50"
                                        title="Hapus Jadwal"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {/* Modal Edit Jadwal */}
            <ModalEditJadwal
                isOpen={isModalEditOpen}
                onClose={handleCloseEdit}
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
            />
        </div>
    );
}

