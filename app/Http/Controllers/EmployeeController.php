<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function index()
    {
        // Menampilkan semua akun, diurutkan dari yang terbaru
        $employees = User::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Employee/Index', [
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'role' => 'required|in:admin,kasir',
            'password' => 'required|string|min:4',
        ]);

        User::create([
            'username' => strtolower($request->username), // Format huruf kecil
            'role' => $request->role,
            'password' => Hash::make($request->password), // Enkripsi password
        ]);

        return redirect()->back()->with('success', 'Akun karyawan berhasil dibuat!');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username,'.$id,
            'role' => 'required|in:admin,kasir',
        ]);

        $user->username = strtolower($request->username);
        $user->role = $request->role;
        
        // Jika kolom password diisi saat edit, berarti ganti password
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        
        $user->save();

        return redirect()->back()->with('success', 'Akun karyawan diperbarui!');
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Akun karyawan dihapus!');
    }
}