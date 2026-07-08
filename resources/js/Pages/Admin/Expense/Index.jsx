import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ExpenseIndex({ auth, expenses }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fungsi pembantu untuk mendapatkan tanggal hari ini berformat YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        date: getTodayDate(),
        description: '',
        amount: '',
    });

    const openModal = () => {
        reset();
        setData('date', getTodayDate());
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
        post(route('expense.store'), {
            preserveScroll: true, // Anti-lompat
            onSuccess: () => closeModal(),
        });
    };

    const deleteExpense = (id, description) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data pengeluaran "${description}"?`)) {
            router.delete(route('expense.destroy', id), {
                preserveScroll: true // Anti-lompat
            });
        }
    };

    // Hitung total pengeluaran dari data yang ada di layar
    const totalExpenses = expenses.reduce((total, item) => total + parseInt(item.amount), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pencatatan Pengeluaran</h2>}
        >
            <Head title="Pengeluaran" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header: Tombol Tambah & Total */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200">
                            <p className="text-sm text-gray-500 font-medium mb-1">Total Pengeluaran Tercatat</p>
                            <p className="text-xl font-black text-red-600">Rp {totalExpenses.toLocaleString('id-ID')}</p>
                        </div>

                        <button 
                            onClick={openModal}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                            </svg>
                            CATAT PENGELUARAN
                        </button>
                    </div>

                    {/* Tabel Data */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold text-sm uppercase tracking-wider">
                                        <th className="py-4 px-6 w-32">Tanggal</th>
                                        <th className="py-4 px-6">Keterangan</th>
                                        <th className="py-4 px-6 text-right">Nominal</th>
                                        <th className="py-4 px-6 text-center w-32">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {expenses.length > 0 ? expenses.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-gray-700">
                                                {/* Format tampilan tanggal yang ramah dibaca */}
                                                {new Date(expense.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-gray-800">
                                                {expense.description}
                                            </td>
                                            <td className="py-4 px-6 text-right font-extrabold text-red-600">
                                                Rp {Number(expense.amount).toLocaleString('id-ID')}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <button 
                                                    onClick={() => deleteExpense(expense.id, expense.description)}
                                                    className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md border border-red-200 transition-colors"
                                                >
                                                    HAPUS
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-gray-400 font-medium bg-gray-50/30">
                                                Belum ada data pengeluaran yang dicatat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* ================= MODAL TAMBAH PENGELUARAN ================= */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submitForm} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">
                        Catat Pengeluaran Baru
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="date" value="Tanggal" />
                            <TextInput
                                id="date"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                            />
                            <InputError message={errors.date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Keterangan Pengeluaran" />
                            <TextInput
                                id="description"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Contoh: Beli Susu 5 Liter"
                                isFocused
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="amount" value="Nominal (Rp)" />
                            <TextInput
                                id="amount"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="Contoh: 150000"
                            />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-red-600 hover:bg-red-700">
                            Simpan Pengeluaran
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}