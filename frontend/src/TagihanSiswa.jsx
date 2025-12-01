import React, { useEffect, useState, useCallback } from "react";

// ====================================================================
// A. UTILITIES & HELPERS
// ====================================================================

/**
 * Format angka ke Rupiah Indonesia
 */
const formatRupiah = (value) => {
    if (value === null || value === undefined || isNaN(Number(value))) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(Number(value));
};

/**
 * Mendapatkan Header Auth secara dinamis
 * Memastikan token selalu fresh dari localStorage saat request
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

/**
 * Mengubah string tanggal API (ISO) menjadi format input date (YYYY-MM-DD)
 * Menangani null/undefined agar tidak crash
 */
const safeDateValue = (dateString) => {
    if (!dateString) return "";
    // Ambil bagian YYYY-MM-DD saja (10 karakter pertama)
    return dateString.substring(0, 10);
};

// ====================================================================
// B. SUB-COMPONENTS (MODALS)
// ====================================================================

const ModalBuatTagihan = ({ isOpen, onClose, form, onChange, onSubmit, siswa, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform scale-100 transition-transform duration-300">
                <div className="px-6 py-4 bg-purple-600 text-white font-bold text-lg">
                    Buat Tagihan Baru
                </div>

                <form className="p-6 space-y-4" onSubmit={onSubmit}>
                    {/* Pilih Siswa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pilih Siswa
                        </label>
                        <select
                            name="biodata_id"
                            required
                            value={form.biodata_id}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                        >
                            <option value="">-- pilih siswa --</option>
                            {(siswa || []).map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.nama_lengkap} ({s.email || "No Email"})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Judul
                        </label>
                        <input
                            type="text"
                            name="judul"
                            required
                            value={form.judul}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                            placeholder="Contoh: Iuran Bulanan Juni"
                        />
                    </div>

                    {/* Jumlah */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah (Rp)
                        </label>
                        <input
                            type="number"
                            name="jumlah"
                            required
                            min="0"
                            value={form.jumlah}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                            placeholder="Contoh: 300000"
                        />
                    </div>

                    {/* Jatuh Tempo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jatuh Tempo
                        </label>
                        <input
                            type="date"
                            name="jatuh_tempo"
                            required
                            value={form.jatuh_tempo}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                        />
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
                            className={`px-5 py-2 text-white rounded-lg transition duration-150 shadow-md ${
                                isLoading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                            }`}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan Tagihan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ModalEditTagihan = ({ isOpen, onClose, form, onChange, onSubmit, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-0 flex items-center justify-center p-4 transition-opacity duration-300">
            {/* Overlay background untuk edit sengaja dibuat transparan (opacity-0) sesuai kode asli, 
                namun saya tambahkan bg-black/opacity-40 agar fokus user terjaga (opsional, ikuti style asli di bawah) */}
            <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
            
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform scale-100 transition-transform duration-300 relative z-10">
                <div className="px-6 py-4 bg-purple-600 text-white font-bold text-lg">
                    Edit Tagihan
                </div>

                <form className="p-6 space-y-4" onSubmit={onSubmit}>
                    {/* Nama Siswa (Readonly) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Siswa
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={form.nama_lengkap || ""}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Judul
                        </label>
                        <input
                            type="text"
                            name="judul"
                            required
                            value={form.judul}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                        />
                    </div>

                    {/* Jumlah */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah (Rp)
                        </label>
                        <input
                            type="number"
                            name="jumlah"
                            required
                            min="0"
                            value={form.jumlah}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                        />
                    </div>

                    {/* Jatuh Tempo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jatuh Tempo
                        </label>
                        <input
                            type="date"
                            name="jatuh_tempo"
                            required
                            value={form.jatuh_tempo}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                        >
                            <option value="Belum Lunas">Belum Lunas</option>
                            <option value="Lunas">Lunas</option>
                        </select>
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
                            className={`px-5 py-2 text-white rounded-lg transition duration-150 shadow-md ${
                                isLoading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                            }`}
                        >
                            {isLoading ? "Mengedit..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ====================================================================
// C. MAIN COMPONENT
// ====================================================================

const TagihanSiswa = () => {
    // State Data
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [siswa, setSiswa] = useState([]);
    const [tagihanFlat, setTagihanFlat] = useState([]);

    // State Modal
    const [modalTambah, setModalTambah] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);

    // State Forms
    const [formTambah, setFormTambah] = useState({
        biodata_id: "",
        judul: "",
        jumlah: "",
        jatuh_tempo: ""
    });

    const [formEdit, setFormEdit] = useState({
        id: null,
        biodata_id: "",
        nama_lengkap: "",
        judul: "",
        jumlah: "",
        jatuh_tempo: "",
        status: ""
    });

    /**
     * Fetch Data dari API
     * Mengambil daftar siswa beserta tagihannya, lalu meratakan (flatten) datanya
     */
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                // Jangan alert di dalam useEffect jika tidak perlu, cukup stop
                console.warn("Token tidak ditemukan");
                setIsLoading(false);
                return;
            }

            const res = await fetch("http://localhost:8000/api/keuangan", {
                headers: getAuthHeaders()
            });

            if (res.status === 401) {
                alert("Sesi Anda telah berakhir. Silakan login kembali.");
                // Redirect logic bisa ditambahkan di sini
                setIsLoading(false);
                return;
            }

            if (!res.ok) throw new Error("Gagal mengambil data");

            const data = await res.json();

            // 1. Simpan Data Mentah Siswa (untuk dropdown select)
            setSiswa(Array.isArray(data) ? data : []);

            // 2. Flatten Data Tagihan (Siswa -> Tagihan[] menjadi TagihanFlat[])
            // Menggunakan .flatMap untuk keamanan dan performa lebih baik
            const flattenedData = (Array.isArray(data) ? data : []).flatMap((student) => {
                const tagihans = Array.isArray(student.tagihans) ? student.tagihans : [];
                return tagihans.map((tag) => ({
                    ...tag,
                    nama_lengkap: student.nama_lengkap // Inject nama siswa ke object tagihan
                }));
            });

            setTagihanFlat(flattenedData);

        } catch (error) {
            console.error("Error fetching data:", error);
            // Tetap set array kosong agar UI tidak crash
            setSiswa([]);
            setTagihanFlat([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial Load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * HANDLER: Tambah Tagihan
     */
    const handleTambahChange = (e) => {
        const { name, value } = e.target;
        setFormTambah((prev) => ({ ...prev, [name]: value }));
    };

    const handleTambahSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await fetch("http://localhost:8000/api/tagihan", {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(formTambah)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Gagal membuat tagihan");
            }

            alert("Tagihan berhasil dibuat!");
            setModalTambah(false);
            setFormTambah({ biodata_id: "", judul: "", jumlah: "", jatuh_tempo: "" });
            fetchData(); // Refresh table
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * HANDLER: Edit Tagihan
     */
    const openEdit = (tag) => {
        setFormEdit({
            id: tag.id,
            biodata_id: tag.biodata_id,
            nama_lengkap: tag.nama_lengkap, // Hanya untuk display
            judul: tag.judul,
            jumlah: tag.jumlah,
            jatuh_tempo: safeDateValue(tag.jatuh_tempo), // Format YYYY-MM-DD
            status: tag.status
        });
        setModalEdit(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormEdit((prev) => ({ ...prev, [name]: value }));
    };

        /**
     * PERBAIKAN HANDLER: Edit Tagihan
     * Menangani kasus jika server mengembalikan HTML (Error 404/500)
     */
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Validasi ID sebelum kirim
        if (!formEdit.id) {
            alert("Error: ID Tagihan tidak ditemukan. Silakan refresh halaman.");
            return;
        }

        setIsSaving(true);

        try {
            const token = localStorage.getItem("token");
            
            // Payload bersih
            const payload = {
                judul: formEdit.judul,
                jumlah: formEdit.jumlah,
                jatuh_tempo: formEdit.jatuh_tempo,
                status: formEdit.status,
                biodata_id: formEdit.biodata_id
            };

            const url = `http://localhost:8000/api/tagihan/${formEdit.id}`;
            console.log("Mengirim PUT ke:", url); // Debugging URL

            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            // 2. Ambil response sebagai TEXT dulu, jangan langsung JSON
            const textResponse = await res.text();

            // 3. Coba parsing ke JSON
            let result;
            try {
                result = textResponse ? JSON.parse(textResponse) : {};
            } catch (err) {
                // Jika gagal parse JSON, berarti server kirim HTML (Error)
                console.error("Server Response (HTML):", textResponse);
                throw new Error("Terjadi kesalahan Server (URL mungkin salah atau Backend Error). Cek Console untuk detail.");
            }

            // 4. Cek status HTTP (harus 200-299)
            if (!res.ok) {
                throw new Error(result.message || `Gagal: ${res.status} ${res.statusText}`);
            }

            alert("Tagihan berhasil diperbarui!");
            setModalEdit(false);
            fetchData(); 

        } catch (error) {
            console.error("Error Edit:", error);
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };


    /**
     * HANDLER: Delete Tagihan
     */
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus tagihan ini?")) return;
        
        try {
            const res = await fetch(`http://localhost:8000/api/tagihan/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.message || "Gagal menghapus tagihan");
            }

            alert("Tagihan berhasil dihapus!");
            fetchData();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
                    <h2 className="font-extrabold text-2xl text-gray-800">
                        Daftar Tagihan Siswa
                    </h2>
                    <button
                        onClick={() => setModalTambah(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm mr-2 transition-colors"
                    >
                        + Buat Tagihan
                    </button>
                </div>

                <div className="scroll-stylling overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Nama
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Judul
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Total Tagihan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Jatuh Tempo
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : tagihanFlat.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 text-sm">
                                        Belum ada data tagihan yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                tagihanFlat.map((tag) => (
                                    <tr key={tag.id} className="hover:bg-purple-50 transition duration-150">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {tag.nama_lengkap}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {tag.judul}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold text-gray-800">
                                            {formatRupiah(tag.jumlah)}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    tag.status === "Lunas"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {tag.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {tag.jatuh_tempo}
                                        </td>
                                        <td className="px-6 py-3 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => openEdit(tag)}
                                                className="text-yellow-600 hover:text-yellow-800 font-medium transition duration-150 mr-4 p-1 rounded-md"
                                                title="Edit Tagihan"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-4.326 3.905L2.83 15.176V17h1.823l8.03-8.03-2.83-2.83z" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => handleDelete(tag.id)}
                                                className="text-red-600 hover:text-red-800 font-medium transition duration-150 p-1 rounded-md"
                                                title="Hapus Tagihan"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Components */}
            <ModalBuatTagihan
                isOpen={modalTambah}
                onClose={() => setModalTambah(false)}
                form={formTambah}
                onChange={handleTambahChange}
                onSubmit={handleTambahSubmit}
                siswa={siswa}
                isLoading={isSaving}
            />

            <ModalEditTagihan
                isOpen={modalEdit}
                onClose={() => setModalEdit(false)}
                form={formEdit}
                onChange={handleEditChange}
                onSubmit={handleEditSubmit}
                isLoading={isSaving}
            />
        </div>
    );
};

export default TagihanSiswa;
