import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function MenuIndex({ auth, menus, categories }) {
    // State untuk mengontrol buka-tutup Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form handler dari Inertia.js
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        price: '',
        is_available: true,
    });

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset(); // Kosongkan form saat ditutup
        clearErrors();
    };

    const submitForm = (e) => {
        e.preventDefault();
        post(route('menu.store'), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Menu - Cankz Coffee</h2>}
        >
            <Head title="Manajemen Menu" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600 font-medium">
                            Total Produk: <span className="font-bold text-indigo-600">{menus.length} Menu</span>
                        </p>
                        <button 
                            onClick={openModal} // Trigger buka modal
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                            </svg>
                            TAMBAH MENU BARU
                        </button>
                    </div>

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
                                            <td className="py-4 px-6 font-bold text-gray-800">{menu.name}</td>
                                            <td className="py-4 px-6">
                                                <span className="bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-full text-xs border border-gray-200">
                                                    {menu.category_name}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right font-extrabold text-indigo-600">
                                                Rp {Number(menu.price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {menu.is_available ? (
                                                    <span className="bg-green-50 text-green-700 font-bold px-3 py-1 rounded-md text-xs border border-green-200 inline-flex items-center gap-1.5">
                                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>Tersedia
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-50 text-red-700 font-bold px-3 py-1 rounded-md text-xs border border-red-200 inline-flex items-center gap-1.5">
                                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>Habis
                                                    </span>
                                                )}
                                            </td>
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

            {/* ================= MODAL TAMBAH MENU ================= */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submitForm} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">
                        Tambah Menu Baru
                    </h2>

                    <div className="space-y-4">
                        {/* Input Nama Menu */}
                        <div>
                            <InputLabel htmlFor="name" value="Nama Menu" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Cappuccino"
                                isFocused
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Input Kategori */}
                        <div>
                            <InputLabel htmlFor="category_id" value="Kategori" />
                            <select
                                id="category_id"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.category_id} className="mt-2" />
                        </div>

                        {/* Input Harga */}
                        <div>
                            <InputLabel htmlFor="price" value="Harga (Rp)" />
                            <TextInput
                                id="price"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="Contoh: 25000"
                            />
                            <InputError message={errors.price} className="mt-2" />
                        </div>

                        {/* Input Status */}
                        <div>
                            <InputLabel htmlFor="is_available" value="Status Stok" />
                            <select
                                id="is_available"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.is_available ? '1' : '0'}
                                onChange={(e) => setData('is_available', e.target.value === '1')}
                            >
                                <option value="1">Tersedia</option>
                                <option value="0">Habis</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            Simpan Menu
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}