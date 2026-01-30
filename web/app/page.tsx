"use client";

import { useEffect } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-milk selection:bg-accent-green selection:text-milk">
      <nav className="fixed w-full z-50 bg-milk/80 backdrop-blur-xl border-b border-dark-green/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-dark-green rounded-lg flex items-center justify-center text-milk font-black shadow-md">P</div>
              <span className="font-extrabold text-lg tracking-tight uppercase italic text-dark-green">
                Patungan <span className="text-accent-green">Web3</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-none space-x-8 items-center font-bold text-[10px] uppercase tracking-[0.15em] opacity-70 text-dark-green">
            <a href="#cara-kerja" className="hover:text-accent-green transition">
              Cara Kerja
            </a>
            <a href="#fitur" className="hover:text-accent-green transition">
              Keunggulan
            </a>
            <a href="#faq" className="hover:text-accent-green transition">
              FAQ
            </a>
          </div>

          <div className="flex-1 flex items-center justify-end gap-4">
            <a href="/login" className="hidden md:block px-4 py-2 text-xs font-black uppercase tracking-widest hover:opacity-60 transition text-dark-green">
              Masuk
            </a>
            <button className="bg-dark-green hover:bg-black text-milk px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition shadow-lg flex items-center gap-2 active:scale-95">
              <i className="fa-solid fa-wallet"></i>
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-dark-green/5 border border-dark-green/10 rounded-full px-4 py-1.5 mb-8">
              <span className="bg-accent-green text-milk text-[9px] font-black px-1.5 py-0.5 rounded-md">BARU</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-dark-green/60">Support Base Network & IDRX Stablecoin</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter text-dark-green mb-6 uppercase italic">
              Patungan Tanpa <span className="text-accent-green">Was-Was</span>,
              <br />
              Dijamin <span className="text-outline">Anti-Tilep</span>.
            </h1>

            <p className="text-base md:text-lg text-deep-gray max-w-xl mx-auto mb-10 font-medium leading-relaxed">Platform penggalangan dana terdesentralisasi. Dana dikunci Smart Contract, transparan di Blockchain, dan bebas biaya gas untuk semua peserta.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-dark-green text-milk rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Buat Patungan Sekarang</button>
              <button className="px-8 py-4 bg-white text-dark-green border border-dark-green/10 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <i className="fa-solid fa-magnifying-glass text-[10px]"></i>
                Cari Kegiatan
              </button>
            </div>

            <div className="mt-16 pt-8 border-dark-green/5 flex flex-row justify-center items-center gap-8">
              <div className="group flex items-center opacity-40 grayscale transition-all duration-500 hover:scale-105 hover:opacity-100 hover:grayscale-0 font-black uppercase italic text-sm tracking-tighter cursor-pointer">
                <span className="group-hover:text-accent-green transition-colors">Base Network</span>
              </div>
              <div className="group flex items-center opacity-40 grayscale transition-all duration-500 hover:scale-105 hover:opacity-100 hover:grayscale-0 font-black uppercase italic text-sm tracking-tighter cursor-pointer">
                <span className="group-hover:text-accent-green transition-colors">IDRX Stable</span>
              </div>
              <div className="group flex items-center opacity-40 grayscale transition-all duration-500 hover:scale-105 hover:opacity-100 hover:grayscale-0 font-black uppercase italic text-sm tracking-tighter cursor-pointer">
                <span className="group-hover:text-accent-green transition-colors">Coinbase Smart Wallet</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-dark-green/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }}></div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase italic tracking-tighter leading-none">
                Uang patungan sering <span className="text-red-500">dibawa lari</span> admin?
                <br />
                <span className="text-accent-green">Stop sekarang.</span>
              </h2>
              <p className="text-base text-deep-gray mb-8 font-medium leading-relaxed">Masalah utama patungan konvensional adalah kepercayaan. Uang masuk ke rekening pribadi admin, dan tidak ada yang menjamin uang itu aman.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <i className="fa-solid fa-xmark text-red-500 mt-1"></i>
                  <span className="text-dark-green font-bold uppercase text-[11px] tracking-wide">Admin bisa pakai uang sesuka hati.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <i className="fa-solid fa-xmark text-red-500 mt-1"></i>
                  <span className="text-dark-green font-bold uppercase text-[11px] tracking-wide">Tidak ada bukti transaksi yang transparan.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <i className="fa-solid fa-xmark text-red-500 mt-1"></i>
                  <span className="text-dark-green font-bold uppercase text-[11px] tracking-wide">Susah refund kalau acara batal.</span>
                </li>
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-accent-green rounded-[2.5rem] transform rotate-2 opacity-10"></div>
              <div className="bg-milk border border-dark-green/5 p-10 rounded-[2.5rem] shadow-xl relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-dark-green text-milk rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-xl uppercase italic tracking-tight text-dark-green">Solusi Smart Contract</h3>
                    <p className="text-[10px] font-bold text-accent-green uppercase tracking-widest">Teknologi Pengaman Dana Otomatis</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-dark-green/5 shadow-sm">
                    <i className="fa-solid fa-check text-accent-green"></i>
                    <span className="font-bold text-dark-green text-[11px] uppercase">Dana dikunci di Escrow (Brankas Digital)</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-dark-green/5 shadow-sm">
                    <i className="fa-solid fa-check text-accent-green"></i>
                    <span className="font-bold text-dark-green text-[11px] uppercase">Pencairan butuh persetujuan peserta</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-dark-green/5 shadow-sm">
                    <i className="fa-solid fa-check text-accent-green"></i>
                    <span className="font-bold text-dark-green text-[11px] uppercase">Transparansi 100% di Blockchain</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="py-24 bg-milk">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-dark-green">Cara Kerja Simple</h2>
            <p className="text-deep-gray text-base font-medium">Tidak perlu paham teknis crypto. Kami buat semuanya semudah transfer bank biasa.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-dark-green/5 transition hover:-translate-y-2">
              <div className="w-12 h-12 bg-dark-green text-milk rounded-2xl flex items-center justify-center text-xl font-black mb-6 shadow-md">1</div>
              <h3 className="font-black text-base uppercase italic mb-3 text-dark-green">Buat Patungan</h3>
              <p className="text-[12px] text-deep-gray font-medium leading-relaxed">Isi target dana, deadline, dan rekening tujuan pencairan (Off-ramp).</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-dark-green/5 transition hover:-translate-y-2">
              <div className="w-12 h-12 bg-dark-green text-milk rounded-2xl flex items-center justify-center text-xl font-black mb-6 shadow-md">2</div>
              <h3 className="font-black text-base uppercase italic mb-3 text-dark-green">Deposit (Gasless)</h3>
              <p className="text-[12px] text-deep-gray font-medium leading-relaxed">Peserta kirim IDRX secara instan tanpa biaya gas (sponsored by Paymaster).</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-dark-green/5 transition hover:-translate-y-2">
              <div className="w-12 h-12 bg-dark-green text-milk rounded-2xl flex items-center justify-center text-xl font-black mb-6 shadow-md">3</div>
              <h3 className="font-black text-base uppercase italic mb-3 text-dark-green">Validasi Acak</h3>
              <p className="text-[12px] text-deep-gray font-medium leading-relaxed">Sistem memilih peserta acak (Validator) untuk menyetujui setiap pencairan.</p>
            </div>

            <div className="bg-accent-green p-6 rounded-3xl shadow-xl transition hover:-translate-y-2 text-milk">
              <div className="w-12 h-12 bg-milk text-accent-green rounded-2xl flex items-center justify-center text-xl font-black mb-6 shadow-md">4</div>
              <h3 className="font-black text-base uppercase italic mb-3">Cair ke Rupiah</h3>
              <p className="text-[12px] text-milk/80 font-medium leading-relaxed">Setelah disetujui, dana IDRX otomatis ditukar ke Rupiah & masuk rekening tujuan.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-dark-green">Kenapa Pilih Kami?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-milk border border-dark-green/5 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-dark-green rounded-xl flex items-center justify-center text-milk text-lg mb-6 shadow-lg shadow-dark-green/10">
                <i className="fa-solid fa-gas-pump"></i>
              </div>
              <h3 className="font-black text-lg mb-3 uppercase italic text-dark-green">100% Gasless</h3>
              <p className="text-[12px] text-deep-gray font-medium leading-relaxed">Teknologi Paymaster kami menanggung biaya jaringan. Anda hanya perlu IDRX, tanpa pusing beli ETH.</p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-milk border border-dark-green/5 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-accent-green rounded-xl flex items-center justify-center text-milk text-lg mb-6 shadow-lg shadow-accent-green/10">
                <i className="fa-solid fa-money-bill-wave"></i>
              </div>
              <h3 className="font-black text-lg mb-3 uppercase italic text-dark-green">Stablecoin IDRX</h3>
              <p className="text-[12px] text-deep-gray font-medium leading-relaxed">Nilai dana Anda stabil 1:1 dengan Rupiah. Tidak perlu takut harga crypto naik turun saat patungan.</p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-milk border border-dark-green/5 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-milk text-lg mb-6 shadow-lg shadow-purple-600/10">
                <i className="fa-solid fa-users-viewfinder"></i>
              </div>
              <h3 className="font-black text-lg mb-3 uppercase italic text-dark-green">Validator Tiering</h3>
              <p className="text-[12px] text-deep-gray font-medium leading-relaxed">Keamanan berlapis. Semakin banyak peserta, semakin banyak validator yang dibutuhkan untuk pencairan.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-milk">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16 uppercase italic tracking-tighter text-dark-green">Pertanyaan Umum</h2>

          <div className="space-y-4">
            <details className="group bg-white p-6 rounded-2xl border border-dark-green/10 cursor-pointer transition-all duration-300 hover:border-dark-green/30 hover:shadow-sm">
              <summary className="flex justify-between items-center font-bold text-sm list-none uppercase tracking-wide text-dark-green select-none">
                Apakah saya harus punya ETH Base?
                <svg className="w-5 h-5 text-green-600 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-deep-gray mt-4 leading-relaxed font-medium border-t border-dark-green/5 pt-4">
                Tidak! Platform kami menggunakan fitur <strong className="text-dark-green">Paymaster</strong>. Anda hanya perlu memiliki IDRX untuk berpartisipasi. Biaya gas ditanggung oleh sistem.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-2xl border border-dark-green/10 cursor-pointer transition-all duration-300 hover:border-dark-green/30 hover:shadow-sm">
              <summary className="flex justify-between items-center font-bold text-sm list-none uppercase tracking-wide text-dark-green select-none">
                Bagaimana jika target patungan tidak tercapai?
                <svg className="w-5 h-5 text-green-600 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-deep-gray mt-4 leading-relaxed font-medium border-t border-dark-green/5 pt-4">
                Jika sampai deadline dana belum terkumpul, fitur <strong className="text-dark-green">Batch Refund</strong> akan aktif. Anda bisa menarik kembali dana IDRX Anda 100%.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-2xl border border-dark-green/10 cursor-pointer transition-all duration-300 hover:border-dark-green/30 hover:shadow-sm">
              <summary className="flex justify-between items-center font-bold text-sm list-none uppercase tracking-wide text-dark-green select-none">
                Siapa yang menjadi Validator?
                <svg className="w-5 h-5 text-green-600 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-deep-gray mt-4 leading-relaxed font-medium border-t border-dark-green/5 pt-4">
                Validator dipilih secara acak oleh <span className="text-dark-green font-bold italic">Smart Contract</span> dari daftar peserta untuk menjamin transparansi pencairan.
              </p>
            </details>
          </div>

          <div className="flex items-center justify-center gap-2 mt-12 text-deep-gray hover:text-green-600 cursor-pointer group transition-all duration-300">
            <p className="text-base font-bold uppercase tracking-tighter italic">Lihat Semua Pertanyaan</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 transform group-hover:translate-x-1 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </div>
        </div>
      </section>

      <section className="py-24 bg-dark-green text-milk text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase italic tracking-tighter leading-none">
            Mulai Patungan
            <br />
            Tanpa Rasa Curiga.
          </h2>
          <p className="text-sm text-milk/60 font-medium mb-12 max-w-lg mx-auto leading-relaxed">Bergabunglah dengan ribuan orang yang sudah beralih ke cara patungan modern, aman, dan transparan.</p>
          <button className="inline-block bg-milk text-dark-green font-black px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">Buat Akun & Mulai Sekarang</button>
        </div>
        <i className="fa-brands fa-ethereum absolute -bottom-10 -left-10 text-[15rem] opacity-5 -rotate-12 pointer-events-none"></i>
      </section>

      <footer className="bg-milk py-16 border-t border-dark-green/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-dark-green">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-dark-green rounded-lg flex items-center justify-center font-black text-milk shadow-sm">P</div>
              <span className="font-black text-xl tracking-tight uppercase italic">
                Patungan <span className="text-accent-green">Web3</span>
              </span>
            </div>
            <p className="max-w-xs text-[11px] text-deep-gray font-medium leading-relaxed uppercase tracking-wider">Platform group funding terpercaya di Indonesia berbasis Base Blockchain. Aman, Transparan, Gasless.</p>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-dark-green/50">Platform</h4>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-dark-green/80">
              <li>
                <a href="#" className="hover:text-accent-green transition">
                  Jelajah
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition">
                  Smart Contract
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-dark-green/50">Legal</h4>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-dark-green/80">
              <li>
                <a href="#" className="hover:text-accent-green transition">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition">
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-dark-green/20 text-[9px] font-black text-dark-green/50 uppercase tracking-[0.5em] text-center">&copy; 2025 PatunganWeb3. Built for Base Hackathon.</div>
      </footer>
    </div>
  );
}
