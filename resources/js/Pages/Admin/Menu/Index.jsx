import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MenuIndex({ auth, menus, categories }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Menu - Cankz Coffee</h2>}
        >
            <Head title="Manajemen Menu" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Bagian Atas: Tombol Tambah Menu */}
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600 font-medium">
                            Total Produk: <span className="font-bold text-indigo-600">{menus.length} Menu</span>
                        </p>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                            </svg>
                            TAMBAH MENU BARU
                        </button>
                    </div>

                    {/* Tabel Daftar Menu */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold text-sm uppercase tracking-wider">
                                        <th className="py-4 px-6">Nama Menu</th>
                                        <th className="py-4 px-6">Kategori</th>
                                        <th className="py-4 px-6 text-right">Harga</th>
                                        <th className="py-4 px-6 text-center">Status Stok</th>
                                        <th className="py-4 px-6 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {menus.length > 0 ? menus.map((menu) => (
                                        <tr key={menu.id} className="hover:bg-gray-50/70 transition-colors">
                                            {/* Nama Menu */}
                                            <td className="py-4 px-6 font-bold text-gray-800">
                                                {menu.name}
                                            </td>
                                            
                                            {/* Kategori */}
                                            <td className="py-4 px-6">
                                                <span className="bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-full text-xs border border-gray-200">
                                                    {menu.category_name}
                                                </span>
                                            </td>
                                            
                                            {/* Harga */}
                                            <td className="py-4 px-6 text-right font-extrabold text-indigo-600">
                                                Rp {Number(menu.price).toLocaleString('id-ID')}
                                            </td>
                                            
                                            {/* Status Stok */}
                                            <td className="py-4 px-6 text-center">
                                                {menu.is_available ? (
                                                    <span className="bg-green-50 text-green-700 font-bold px-3 py-1 rounded-md text-xs border border-green-200 inline-flex items-center gap-1.5">
                                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                        Tersedia
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-50 text-red-700 font-bold px-3 py-1 rounded-md text-xs border border-red-200 inline-flex items-center gap-1.5">
                                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                        Habis
                                                    </span>
                                                )}
                                            </td>
                                            
                                            {/* Tombol Aksi */}
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex justify-center items-center gap-3">
                                                    <button className="text-amber-600 hover:text-amber-800 font-bold text-xs bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-md border border-amber-200 transition-colors">
                                                        EDIT
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md border border-red-200 transition-colors">
                                                        HAPUS
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-12 text-gray-400 font-medium bg-gray-50/30">
                                                Belum ada data menu di dalam sistem.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}