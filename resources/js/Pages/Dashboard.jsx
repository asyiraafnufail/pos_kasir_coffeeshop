import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
// Import Chart.js
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrasi elemen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Tambahkan props chartLabels dan chartValues
export default function Dashboard({ auth, totalIncome, totalExpense, netProfit, totalTransactions, chartLabels, chartValues }) {
    
    // Konfigurasi data untuk grafik
    const chartData = {
        labels: chartLabels.map(date => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })),
        datasets: [
            {
                label: 'Pendapatan Kotor (Rp)',
                data: chartValues,
                backgroundColor: 'rgba(79, 70, 229, 0.8)', // Warna Indigo Tailwind
                borderRadius: 6,
            },
        ],
    };

    // Opsi tampilan grafik
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return 'Rp ' + value.toLocaleString('id-ID');
                    }
                }
            }
        }
    };

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

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl p-6 border-b-4 border-indigo-500 relative overflow-hidden">
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

                    {/* ================= BAGIAN BARU: GRAFIK TREN PENJUALAN ================= */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Tren Pendapatan (7 Hari Terakhir)</h3>
                            <p className="text-sm text-gray-500">Statistik penjualan harian kasir</p>
                        </div>
                        <div className="p-6 h-80 w-full">
                            {/* Render grafik Bar dari Chart.js */}
                            {chartLabels.length > 0 ? (
                                <Bar data={chartData} options={chartOptions} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">
                                    Belum ada data transaksi yang cukup untuk menampilkan grafik.
                                </div>
                            )}
                        </div>
                    </div>
                    {/* ====================================================================== */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}