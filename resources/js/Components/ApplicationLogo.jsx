export default function ApplicationLogo() {
    return (
        // Kita menggunakan w-auto agar lebarnya dinamis menyesuaikan teks
        <div className="flex items-center justify-center gap-2 font-black text-3xl tracking-tighter w-auto h-auto">
            {/* Ikon Gelas Kopi Modern */}
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M5 8v9a4 4 0 004 4h6a4 4 0 004-4V8M8 4h8M10 4v4m4-4v4"></path>
            </svg>
            <span className="text-indigo-600">CANKZ</span>
            <span className="text-gray-800">COFFEE</span>
        </div>
    );
}