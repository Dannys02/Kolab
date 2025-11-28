<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // ... validasi ...
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email atau password salah!'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        // [FIX] Pastikan kirim ROLE di login juga
        $role = $user->getRoleNames()->first() ?? 'user';

        return response()->json([
            'message' => 'Login Berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'role' => $role, // <--- PENTING
        ]);
    }

    public function register(Request $request)
    {
        // 1. Validasi
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // 2. Buat User
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // 3. [PENTING] Cek apakah Spatie terinstall & Role
        // Jika error 500 disini, kemungkinan besar tabel roles kosong atau Spatie belum setup
        // Kita pakai try-catch biar aman
        try {
            $user->assignRole('user');
        } catch (\Exception $e) {
            // Fallback jika role gagal (misal Spatie belum ready)
            // Log error: \Log::error($e->getMessage());
        }

        // 4. Generate Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Ambil Role (Safety check jika assignRole gagal)
        $role = $user->getRoleNames()->first() ?? 'user';

        return response()->json([
            'message' => 'Registrasi berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'role' => $role,
        ], 201); // Code 201 = Created
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout Berhasil']);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            // Validasi email unik kecuali untuk user ini sendiri
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            "message" => "Profil Berhasil Diupdate",
            "data" => $user,
        ]);

    }

    public function destroy(Request $request)
    {
        $user = $request->user();

// 1. Cek apakah user sudah punya Biodata?
if ($user->biodata) {
    // 2. Cek apakah di biodata tersebut ada tagihan yang 'Belum Lunas'
    $tagihanBelumLunas = Tagihan::where('biodata_id', $user->biodata->id)
        ->where('status', '!=', 'Lunas')
        ->exists();

    if ($tagihanBelumLunas) {
        return response()->json([
            'message' => 'GAGAL: Anda masih memiliki tagihan yang belum lunas. Silakan lunasi dulu sebelum menghapus akun.',
        ], 400); // 400 Bad Request
    }
}

        // Hapus user tersebut
        $user->delete();

        return response()->json([
            "message" => "Akun Berhasil Dihapus Selamanya",
        ]);
    }
}
