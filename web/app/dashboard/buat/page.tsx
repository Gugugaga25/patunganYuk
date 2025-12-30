"use client";

import React from "react";

export default function BuatPatunganPage() {
  return (
    <>
      {/* Gaya Khusus untuk Date Picker Webkit */}
      <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(12%) sepia(21%) saturate(1000%) hue-rotate(110deg);
          cursor: pointer;
        }
      `}</style>

      {/* Header Halaman */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase">Buat Patungan Baru</h1>
        <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-2">Gunakan Smart Contract untuk keamanan dana grup.</p>
      </div>

      {/* Form Utama */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-dark-green/5 shadow-sm space-y-10 text-dark-green">
        <div className="space-y-6">
          {/* Baris 1: Nama & Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green/40 uppercase tracking-[0.2em] ml-1">Nama Kegiatan</label>
              <input type="text" placeholder="MISAL: SEWA LAPANGAN" className="w-full bg-milk border-none rounded-2xl p-4 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-accent-green/20 placeholder:text-dark-green/20 outline-none" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green/40 uppercase tracking-[0.2em] ml-1">Kategori</label>
              <input type="text" placeholder="MISAL: HOBI" className="w-full bg-milk border-none rounded-2xl p-4 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-accent-green/20 placeholder:text-dark-green/20 outline-none" />
            </div>
          </div>

          {/* Baris 2: Target Dana & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green/40 uppercase tracking-[0.2em] ml-1">Target Dana (IDRX)</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-[11px] font-black text-dark-green/30">RP</span>
                <input type="number" placeholder="0" className="w-full bg-milk border-none rounded-2xl p-4 pl-12 text-[11px] font-black focus:ring-2 focus:ring-accent-green/20 outline-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green/40 uppercase tracking-[0.2em] ml-1">Batas Waktu (Deadline)</label>
              <input type="date" className="w-full bg-milk border-none rounded-2xl p-4 text-[11px] font-black focus:ring-2 focus:ring-accent-green/20 text-dark-green/60 outline-none" />
            </div>
          </div>
        </div>

        {/* Seksi Rekening Pencairan */}
        <div className="bg-accent-green/5 rounded-[2rem] p-8 border border-accent-green/10 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-green/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />

          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-10">
            <span className="w-10 h-10 bg-white text-accent-green rounded-xl flex items-center justify-center shadow-sm">
              <i className="fas fa-university" />
            </span>
            Rekening Pencairan Akhir
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            <div className="md:col-span-4 space-y-2">
              <label className="text-[9px] font-black text-accent-green uppercase tracking-widest ml-1">Bank</label>
              <select className="w-full bg-white border-none rounded-xl p-4 text-[11px] font-black focus:ring-2 focus:ring-accent-green/20 shadow-sm appearance-none cursor-pointer outline-none">
                <option>BCA</option>
                <option>MANDIRI</option>
                <option>BRI</option>
                <option>GOPAY / E-WALLET</option>
              </select>
            </div>

            <div className="md:col-span-8 space-y-2">
              <label className="text-[9px] font-black text-accent-green uppercase tracking-widest ml-1">Nomor Rekening</label>
              <div className="flex gap-3">
                <input type="number" placeholder="NOMOR REKENING" className="flex-1 bg-white border-none rounded-xl p-4 text-[11px] font-black focus:ring-2 focus:ring-accent-green/20 shadow-sm outline-none" />
                <button type="button" className="bg-dark-green text-milk w-14 rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center active:scale-95 group/btn">
                  <i className="fas fa-search text-sm group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <div className="md:col-span-12 space-y-2 mt-2">
              <label className="text-[9px] font-black text-accent-green uppercase tracking-widest ml-1">Verifikasi Nama Pemilik</label>
              <div className="relative">
                <input type="text" readOnly placeholder="KLIK CARI UNTUK VALIDASI..." className="w-full bg-white/40 border-2 border-dashed border-accent-green/20 rounded-xl p-4 text-[10px] font-black text-dark-green/40 cursor-not-allowed uppercase tracking-widest outline-none" />
                <div className="absolute inset-y-0 right-4 flex items-center text-dark-green/10">
                  <i className="fas fa-user-check" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Deploy */}
        <div className="pt-4">
          <button className="group w-full py-6 bg-dark-green text-milk rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-4">
            <span>Deploy ke Blockchain</span>
            <i className="fa-solid fa-cube animate-pulse text-accent-green" />
          </button>
          <p className="text-center text-[9px] font-bold text-deep-gray uppercase tracking-widest mt-6 opacity-50">
            <i className="fas fa-gas-pump mr-1" />
            Gas fee ditanggung oleh Paymaster (Gratis)
          </p>
        </div>
      </div>
    </>
  );
}
