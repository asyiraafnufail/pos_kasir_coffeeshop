import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function EmployeeIndex({ auth, employees }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const currentUser = usePage().props.auth.user; // Info admin yang sedang login

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        username: '',
        role: 'kasir',
        password: '',
    });

    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setIsEditMode(true);
        setCurrentUserId(employee.id);
        setData({
            username: employee.username,
            role: employee.role,
            password: '', // Kosongkan, hanya diisi jika ingin diganti
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('employee.update', currentUserId), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('employee.store'), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteEmployee = (id, username) => {
        if (id === currentUser.id) {
            alert('Anda tidak bisa menghapus akun Anda sendiri saat sedang login!');
            return;
        }
        if (confirm(`Hapus akun login untuk "${username}"?`)) {
            router.delete(route('employee.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Akun Karyawan</h2>}
        >
            <Head title="Manajemen Karyawan" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600 font-medium">
                            Total Akun: <span className="font-bold text-indigo-600">{employees.length} Pengguna</span>
                        </p>
                        <button 
                            onClick={openAddModal}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                            BUAT AKUN BARU
                        </button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold text-sm uppercase tracking-wider">
                                        <th className="py-4 px-6">Username (ID Login)</th>
                                        <th className="py-4 px-6">Role Akses</th>
                                        <th className="py-4 px-6">Tgl Terdaftar</th>
                                        <th className="py-4 px-6 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {employees.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="py-4 px-6 font-bold text-gray-800">
                                                {employee.username}
                                                {employee.id === currentUser.id && (
                                                    <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">Anda</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`font-bold px-3 py-1 rounded-full text-xs border ${employee.role === 'admin' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'} uppercase tracking-wider`}>
                                                    {employee.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-500">
                                                {new Date(employee.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex justify-center items-center gap-3">
                                                    <button onClick={() => openEditModal(employee)} className="text-amber-600 hover:text-amber-800 font-bold text-xs bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-md border border-amber-200 transition-colors">
                                                        EDIT
                                                    </button>
                                                    <button onClick={() => deleteEmployee(employee.id, employee.username)} className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md border border-red-200 transition-colors">
                                                        HAPUS
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* MODAL TAMBAH/EDIT */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submitForm} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">
                        {isEditMode ? 'Edit Akun Karyawan' : 'Buat Akun Karyawan Baru'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="username" value="Username (tanpa spasi)" />
                            <TextInput
                                id="username"
                                type="text"
                                className="mt-1 block w-full lowercase"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value.replace(/\s+/g, ''))} // Cegah spasi
                                placeholder="contoh: kasir_budi"
                            />
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="Role Akses" />
                            <select
                                id="role"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm font-semibold"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                            >
                                <option value="kasir">Staff Kasir (POS)</option>
                                <option value="admin">Administrator</option>
                            </select>
                            <InputError message={errors.role} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value={isEditMode ? 'Password Baru (Kosongkan jika tidak diganti)' : 'Password'} />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimal 4 karakter"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {isEditMode ? 'Simpan Perubahan' : 'Buat Akun'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}