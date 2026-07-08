import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react'; 

export default function KasirIndex({ auth, menus, categories }) {
    const [cart, setCart] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [cashAmount, setCashAmount] = useState(''); 
    const [paymentMethod, setPaymentMethod] = useState('cash'); 
    const [notification, setNotification] = useState(null);
    
    // STATE BARU: Menyimpan data transaksi yang baru saja sukses untuk dicetak
    const [receiptData, setReceiptData] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const filteredMenus = menus.filter((menu) => {
        const matchCategory = selectedCategory === null || menu.category_id === selectedCategory;
        const matchSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const addToCart = (menu) => {
        if (!menu.is_available) return; 
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === menu.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...menu, quantity: 1, notes: '' }];
        });
    };

    const updateQuantity = (id, amount) => {
        setCart((prevCart) => {
            return prevCart.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + amount;
                    return newQty > 0 ? { ...item, quantity: newQty } : item; 
                }
                return item;
            });
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== id));
    };

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const parsedCash = cashAmount === '' ? 0 : parseInt(cashAmount);
    const changeAmount = paymentMethod === 'cash' ? parsedCash - totalPrice : 0;
    const isCartEmpty = cart.length === 0;
    const isCashInsufficient = paymentMethod === 'cash' && parsedCash < totalPrice;
    const isButtonDisabled = isCartEmpty || isCashInsufficient;

    const submitOrder = () => {
        if (paymentMethod === 'cash' && parsedCash < totalPrice) {
            showNotification('Uang yang diterima kurang dari total tagihan!', 'error');
            return;
        }

        router.post('/orders', {
            cart: cart,
            total_price: totalPrice,
            payment_method: paymentMethod
        }, {
            preserveScroll: true,
            onSuccess: () => {
                showNotification('Transaksi Berhasil Disimpan!', 'success');
                
                // 1. Simpan data ke receiptData SEBELUM keranjang dibersihkan
                setReceiptData({
                    cart: [...cart],
                    totalPrice: totalPrice,
                    paymentMethod: paymentMethod,
                    cashAmount: parsedCash,
                    changeAmount: changeAmount,
                    date: new Date().toLocaleString('id-ID')
                });
            },
            onError: (errors) => {
                showNotification(errors.error || 'Gagal menyimpan transaksi', 'error');
            }
        });
    };

    // EFEK BARU: Terpicu otomatis setiap kali receiptData terisi (Transaksi sukses)
    useEffect(() => {
        if (receiptData) {
            // Beri jeda 100ms agar React selesai membuat DOM struk sebelum window.print() dipanggil[cite: 1]
            setTimeout(() => {
                window.print();
                
                // 2. Bersihkan keranjang setelah jendela cetak muncul
                setCart([]);
                setCashAmount('');
                setPaymentMethod('cash');
                // Hapus data struk agar siap untuk transaksi berikutnya
                setReceiptData(null); 
            }, 100);
        }
    }, [receiptData]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mesin Kasir</h2>}
        >
            <Head title="Kasir" />

            {/* CSS KHUSUS PRINT: Menyembunyikan seluruh body KECUALI #print-area */}
            <style>
                {`
                    @media print {
                        @page { margin: 0; }
                        body * { visibility: hidden; }
                        #print-area, #print-area * { visibility: visible; }
                        #print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 58mm; /* Ukuran standar kertas thermal kasir */
                            padding: 0;
                            margin: 0;
                        }
                    }
                `}
            </style>

            {notification && (
                <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl text-white font-bold z-50 flex items-center gap-3 transition-all duration-300 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {notification.type === 'success' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    )}
                    {notification.message}
                </div>
            )}

            {/* ================= AREA CETAK STRUK ================= */}
            {/* Hanya terlihat saat window.print() dipanggil berkat CSS di atas */}
            {receiptData && (
                <div id="print-area" className="hidden print:block text-black bg-white font-mono text-xs">
                    <div className="text-center font-extrabold text-lg mb-1 tracking-widest">CANKZ COFFEE</div>
                    <div className="text-center mb-3 text-[10px]">
                        Jl. Kopi Nusantara No. 123<br/>
                        {receiptData.date}
                    </div>
                    
                    <div className="border-b border-dashed border-black mb-2"></div>
                    
                    {receiptData.cart.map(item => (
                        <div key={item.id} className="mb-2">
                            <div className="font-bold">{item.name}</div>
                            <div className="flex justify-between">
                                <span>{item.quantity} x {item.price.toLocaleString('id-ID')}</span>
                                <span>{(item.quantity * item.price).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    ))}

                    <div className="border-b border-dashed border-black mb-2"></div>

                    <div className="flex justify-between font-bold text-sm">
                        <span>TOTAL</span>
                        <span>Rp {receiptData.totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>METODE</span>
                        <span className="uppercase">{receiptData.paymentMethod}</span>
                    </div>
                    
                    {receiptData.paymentMethod === 'cash' && (
                        <>
                            <div className="flex justify-between">
                                <span>TUNAI</span>
                                <span>Rp {receiptData.cashAmount.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>KEMBALI</span>
                                <span>Rp {receiptData.changeAmount.toLocaleString('id-ID')}</span>
                            </div>
                        </>
                    )}

                    <div className="text-center mt-6 text-[10px] italic">Terima Kasih Atas Kunjungan Anda!</div>
                </div>
            )}
            {/* ==================================================== */}

            <div className="p-4 h-[calc(100vh-145px)] bg-gray-100 overflow-hidden relative">
                <div className="max-w-7xl mx-auto h-full">
                    
                    <div className="flex flex-col md:flex-row gap-4 h-full">
                        
                        {/* ================= SISI KIRI (60%) ================= */}
                        <div className="w-full md:w-3/5 bg-white p-5 shadow sm:rounded-lg flex flex-col h-full">
                            <div className="shrink-0">
                                <div className="mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Cari nama menu..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-lg py-3"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto mb-4 pb-2 scrollbar-hide">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`px-5 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${selectedCategory === null ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        Semua
                                    </button>
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`px-5 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${selectedCategory === category.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 pb-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {filteredMenus.length > 0 ? filteredMenus.map(menu => (
                                        <div
                                            key={menu.id}
                                            onClick={() => addToCart(menu)}
                                            className={`relative p-4 rounded-xl border-2 shadow-sm flex flex-col justify-between h-36 transition-all ${
                                                menu.is_available 
                                                ? 'bg-white border-gray-100 hover:border-indigo-500 hover:shadow-md cursor-pointer active:scale-95' 
                                                : 'bg-red-50 border-red-100 opacity-60 cursor-not-allowed'
                                            }`}
                                        >
                                            {!menu.is_available && (
                                                <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
                                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform -rotate-12">HABIS</span>
                                                </div>
                                            )}
                                            <div className="font-bold text-gray-800 leading-tight">{menu.name}</div>
                                            <div className="text-indigo-600 font-extrabold mt-2">Rp {Number(menu.price).toLocaleString('id-ID')}</div>
                                        </div>
                                    )) : (
                                        <div className="col-span-3 text-center py-10 text-gray-500 font-medium">Menu tidak ditemukan.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ================= SISI KANAN (40%) ================= */}
                        <div className="w-full md:w-2/5 bg-white p-5 shadow sm:rounded-lg flex flex-col h-full">
                            <h3 className="text-xl font-extrabold text-gray-800 mb-4 border-b pb-2 shrink-0">Keranjang Belanja</h3>
                            
                            <div className="flex-1 overflow-y-auto mb-4 pr-2">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        <p>Keranjang masih kosong</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {cart.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-bold text-gray-800">{item.name}</div>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Hapus</button>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                    <div className="text-indigo-600 font-semibold text-sm">
                                                        Rp {Number(item.price).toLocaleString('id-ID')}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 bg-white border rounded-lg p-1">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 rounded font-bold text-lg">-</button>
                                                        <span className="font-bold w-6 text-center text-gray-800">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded font-bold text-lg">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="pt-4 border-t-2 border-dashed border-gray-200 space-y-4 shrink-0">
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Metode</label>
                                        <select 
                                            value={paymentMethod}
                                            onChange={(e) => {
                                                setPaymentMethod(e.target.value);
                                                if (e.target.value !== 'cash') setCashAmount('');
                                            }}
                                            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm font-semibold"
                                        >
                                            <option value="cash">Tunai (Cash)</option>
                                            <option value="qris">QRIS</option>
                                            <option value="debit">Kartu Debit</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Uang Diterima (Rp)</label>
                                        <input 
                                            type="text"
                                            inputMode="numeric" 
                                            value={cashAmount}
                                            onChange={(e) => setCashAmount(e.target.value.replace(/\D/g, ''))}
                                            placeholder="0"
                                            disabled={paymentMethod !== 'cash'} 
                                            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-right font-bold disabled:bg-gray-100 disabled:text-gray-400"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm font-semibold text-gray-600">
                                    <span>Kembalian:</span>
                                    <span className={changeAmount < 0 && paymentMethod === 'cash' ? 'text-red-500' : 'text-green-600'}>
                                        Rp {changeAmount > 0 && paymentMethod === 'cash' ? changeAmount.toLocaleString('id-ID') : 0}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                                    <span className="text-gray-700 font-bold">Total Tagihan:</span>
                                    <span className="text-2xl font-black text-indigo-700">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                
                                <button 
                                    onClick={submitOrder} 
                                    disabled={isButtonDisabled}
                                    className={`w-full font-bold py-4 px-4 rounded-xl shadow-lg transition-colors text-lg flex justify-center items-center gap-2 ${isButtonDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'}`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    PROSES & CETAK STRUK
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}