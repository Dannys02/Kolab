import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExportSiswaProgram() {
    const [siswaData, setSiswaData] = useState([]);
    const [ringkasanData, setRingkasanData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const token = localStorage.getItem('token');

    // Fetch data siswa dan program
    const fetchData = async () => {
        setLoading(true);
        try {
            const [siswaRes, ringkasanRes] = await Promise.all([
                axios.get('http://localhost:8000/api/export/siswa-program', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:8000/api/export/ringkasan-program', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setSiswaData(siswaRes.data.data || []);
            setRingkasanData(ringkasanRes.data.data || []);
        } catch (error) {
            console.error('Gagal mengambil data:', error);
            alert('Gagal mengambil data. Pastikan Anda adalah admin.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Export ke CSV
    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) {
            alert('Tidak ada data untuk diekspor');
            return;
        }

        // Dapatkan header dari key object pertama
        const headers = Object.keys(data[0]);

        // Buat CSV content
        let csvContent = 'data:text/csv;charset=utf-8,';
        
        // Tambahkan header
        csvContent += headers.map(h => `"${h}"`).join(',') + '\n';

        // Tambahkan rows
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                // Escape quotes dalam data
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvContent += values.join(',') + '\n';
        });

        // Download
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `${filename}.csv`);
        link.click();
    };

    // Export semua siswa
    const handleExportSemuaSiswa = () => {
        exportToCSV(siswaData, `siswa_program_${new Date().toISOString().split('T')[0]}`);
    };

    // Export siswa berdasarkan program
    const handleExportByProgram = async (programId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8000/api/export/program/${programId}/siswa`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            exportToCSV(response.data.data, `siswa_${programId}_${new Date().toISOString().split('T')[0]}`);
        } catch (error) {
            console.error('Gagal export program:', error);
            alert('Gagal export data program');
        } finally {
            setLoading(false);
        }
    };

    if (loading && siswaData.length === 0) {
        return <div className="flex justify-center items-center min-h-screen">Memuat data...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Export Data Siswa & Program</h1>
                    <p className="text-gray-600">Kelola dan export data pendaftaran siswa beserta pilihan program mereka</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <p className="text-gray-500 text-sm">Total Siswa</p>
                        <p className="text-3xl font-bold text-blue-600">{siswaData.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Sudah Memilih Program</p>
                        <p className="text-3xl font-bold text-green-600">
                            {siswaData.filter(s => s.program_dipilih !== 'Belum Memilih').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                        <p className="text-gray-500 text-sm">Belum Memilih Program</p>
                        <p className="text-3xl font-bold text-yellow-600">
                            {siswaData.filter(s => s.program_dipilih === 'Belum Memilih').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                        <p className="text-gray-500 text-sm">Program Tersedia</p>
                        <p className="text-3xl font-bold text-purple-600">{ringkasanData.length}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Opsi Export</h2>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleExportSemuaSiswa}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
                            </svg>
                            Export Semua Siswa
                        </button>
                    </div>
                </div>

                {/* Program Distribution */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Distribusi Program</h2>
                    <div className="space-y-3">
                        {ringkasanData.map((program, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-800">{program.pilihan_program}</p>
                                    <p className="text-sm text-gray-500">{program.jumlah_siswa} siswa</p>
                                </div>
                                <button
                                    onClick={() => handleExportByProgram(program.pilihan_program)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    Export
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-bold text-gray-800">Daftar Siswa Terdaftar</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama Siswa</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">No HP</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Program Dipilih</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {siswaData.map((siswa, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-3 text-sm text-gray-700">{idx + 1}</td>
                                        <td className="px-6 py-3 text-sm text-gray-700 font-medium">{siswa.nama_siswa}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{siswa.email_siswa}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{siswa.no_hp}</td>
                                        <td className="px-6 py-3 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                siswa.program_dipilih === 'Belum Memilih'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {siswa.program_dipilih}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-sm">
                                            {siswa.program_dipilih === 'Belum Memilih' ? (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">Pending</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">Aktif</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
