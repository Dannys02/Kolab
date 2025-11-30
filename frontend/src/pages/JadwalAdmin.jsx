import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function JadwalAdmin() {
  const [jadwals, setJadwals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ hari: '', jam_mulai: '', jam_selesai: '', materi: '', lokasi: '', aktif: true });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');

  const fetchJadwals = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/jadwal', { headers: { Authorization: `Bearer ${token}` } });
      setJadwals(res.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil jadwal', err);
      alert('Gagal mengambil jadwal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJadwals(); }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(`http://localhost:8000/api/jadwal/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setJadwals(jadwals.map(j => j.id === editingId ? res.data.data : j));
        setEditingId(null);
      } else {
        const res = await axios.post('http://localhost:8000/api/jadwal', form, { headers: { Authorization: `Bearer ${token}` } });
        setJadwals([res.data.data, ...jadwals]);
      }
      setForm({ hari: '', jam_mulai: '', jam_selesai: '', materi: '', lokasi: '', aktif: true });
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan jadwal');
    }
  };

  const handleEdit = jadwal => {
    setEditingId(jadwal.id);
    setForm({ hari: jadwal.hari, jam_mulai: jadwal.jam_mulai || '', jam_selesai: jadwal.jam_selesai || '', materi: jadwal.materi || '', lokasi: jadwal.lokasi || '', aktif: !!jadwal.aktif });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async id => {
    if (!confirm('Yakin hapus jadwal ini?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/jadwal/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setJadwals(jadwals.filter(j => j.id !== id));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus jadwal');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
      <h2 className="text-xl font-bold mb-4">Manajemen Jadwal Latihan</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-sm text-gray-600">Hari</label>
          <input name="hari" value={form.hari} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Lokasi</label>
          <input name="lokasi" value={form.lokasi} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Jam Mulai</label>
          <input type="time" name="jam_mulai" value={form.jam_mulai} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Jam Selesai</label>
          <input type="time" name="jam_selesai" value={form.jam_selesai} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600">Materi</label>
          <input name="materi" value={form.materi} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="flex items-center gap-3 md:col-span-2">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="aktif" checked={form.aktif} onChange={handleChange} />
            <span className="text-sm">Aktif</span>
          </label>
          <div className="flex-1 text-right">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{editingId ? 'Update Jadwal' : 'Tambah Jadwal'}</button>
          </div>
        </div>
      </form>

      <div>
        <h3 className="font-semibold mb-3">Daftar Jadwal</h3>
        {loading ? <p>Memuat...</p> : (
          <ul className="space-y-3">
            {jadwals.length === 0 && <li className="text-sm text-gray-500">Belum ada jadwal.</li>}
            {jadwals.map(j => (
              <li key={j.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-bold">{j.hari} • {j.jam_mulai ? `${j.jam_mulai} - ${j.jam_selesai || '-'}` : '-'}</div>
                  <div className="text-sm text-gray-600">{j.materi} • {j.lokasi}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(j)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(j.id)} className="px-3 py-1 bg-red-500 text-white rounded">Hapus</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
