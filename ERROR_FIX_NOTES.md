# Perbaikan Error ExportSiswaProgram dan AuthController

## Error 1: ExportSiswaProgram is not defined

**Sumber Error:** File `ExportSiswaProgram.jsx` tidak ter-load dengan benar di bundler Vite

**Solusi:**
1. Import statement sudah ada di `Dashboard.jsx` (line 3)
2. File `ExportSiswaProgram.jsx` sudah ada dan syntax valid
3. Masalah adalah cache dev server

**Cara Fix:**
```bash
# Stop dev server (Ctrl+C)
# Bersihkan cache Vite
rm -rf frontend/node_modules/.vite

# Jalankan dev server lagi
cd frontend
npm run dev
```

Atau bisa langsung refresh browser (Ctrl+Shift+R) untuk hard refresh.

---

## Error 2: PUT /api/data/edit 500 Internal Server Error

**Sumber Error:** `AuthController::update()` method memiliki masalah:
- Parameter `$id` tidak sesuai dengan route yang mengirim authenticated user
- Validasi field `user` seharusnya `name`
- Validasi `password` tidak valid (tidak ada rule `password`)

**Perbaikan yang dilakukan:**
```php
// SEBELUM (Error)
public function update(Request $request, $id)
{
    $request->validate([
        'user' => 'required|string',        // ❌ Field salah
        'email' => 'required|email',
        'password' => 'required|password',  // ❌ Rule invalid
    ]);
    $account = User::findOrFail($id);       // ❌ $id tidak ada
    $account->update($request->all());
    // ...
}

// SESUDAH (Fixed)
public function update(Request $request)
{
    $user = $request->user();               // ✅ Ambil dari authenticated user
    $request->validate([
        'name' => 'required|string|max:255',    // ✅ Field benar
        'email' => 'required|email|max:255|unique:users,email,' . $user->id,
    ]);
    $user->update([
        'name' => $request->name,
        'email' => $request->email,
    ]);
    return response()->json([
        "message" => "Data Berhasil Diupdate",
        "data" => $user->fresh(),
    ]);
}
```

---

## Langkah untuk Test

1. **Backend Fix:**
   - AuthController sudah diperbaiki ✅
   - Syntax sudah diverifikasi ✅

2. **Frontend Fix:**
   - Clear cache Vite atau hard refresh browser
   - Dev server akan re-bundle semua modules

3. **Test:**
   ```bash
   # Terminal 1: Backend
   php backend/artisan serve --host=127.0.0.1 --port=8000

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

4. **Test API:**
   - Login sebagai user
   - Ke halaman profil, try "Edit Akun"
   - Ubah nama atau email
   - Click "Simpan" → should work now (200 OK)

5. **Test Frontend:**
   - Login sebagai admin
   - Sidebar → "Export Siswa & Program"
   - Should load without "ExportSiswaProgram is not defined" error

---

## Summary File yang Diperbaiki

| File | Masalah | Solusi |
|------|---------|--------|
| `backend/app/Http/Controllers/AuthController.php` | Method update punya validasi invalid | Perbaiki validasi dan parameter |
| `frontend/src/pages/ExportSiswaProgram.jsx` | Tidak ter-import | Import statement OK, clear cache Vite |
| `frontend/src/pages/Dashboard.jsx` | Menggunakan component belum ter-load | Sudah di-import, butuh refresh |
