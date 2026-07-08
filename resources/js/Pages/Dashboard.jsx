import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, totalIncome, totalExpense, netProfit, totalTransactions }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Ringkasan Bisnis</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Baris Atas: Kartu Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Kartu 1: Pendapatan Kotor */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl p-6 border-b-4 border-green-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Pendapatan Kotor</h3>
                                <div className="p-2 bg-green-100 rounded-full text-green-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                            </div>
                            <p className="text-3xl font-black text-gray-800">
                                Rp {Number(totalIncome).toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Dari {totalTransactions} total transaksi kasir</p>
                        </div>

                        {/* Kartu 2: Pengeluaran */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl p-6 border-b-4 border-red-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Total Pengeluaran</h3>
                                <div className="p-2 bg-red-100 rounded-full text-red-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                                </div>
                            </div>
                            <p className="text-3xl font-black text-gray-800">
                                Rp {Number(totalExpense).toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Berdasarkan pencatatan manual</p>
                        </div>

                        {/* Kartu 3: Keuntungan Bersih */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl p-6 border-b-4 border-indigo-500 relative overflow-hidden">
                            {/* Efek hiasan background */}
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full opacity-50"></div>
                            
                            <div className="flex justify-between items-center mb-4 relative z-10">
                                <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Keuntungan Bersih</h3>
                                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                </div>
                            </div>
                            <p className={`text-3xl font-black relative z-10 ${netProfit < 0 ? 'text-red-600' : 'text-indigo-600'}`}>
                                Rp {Number(netProfit).toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 font-medium relative z-10">
                                {netProfit < 0 ? 'Bisnis sedang merugi' : 'Bisnis mencetak profit positif'}
                            </p>
                        </div>

                    </div>

                    {/* Banner Sambutan */}
                    <div className="bg-indigo-600 rounded-xl shadow-lg p-8 text-white mt-8 flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black mb-2">Selamat Datang di Cankz Coffee!</h2>
                            <p className="text-indigo-100 font-medium">Sistem Point of Sales (POS) V1.0 Anda telah beroperasi sepenuhnya. Pantau terus angka di atas untuk memastikan bisnis Anda bertumbuh.</p>
                        </div>
                        <div className="hidden md:block">
                            <svg className="w-24 h-24 text-indigo-300 opacity-50" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M5 8v9a4 4 0 004 4h6a4 4 0 004-4V8M8 4h8M10 4v4m4-4v4"></path></svg>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}