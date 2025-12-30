"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RiwayatTerintegrasiPage() {
  // State untuk berpindah antara tampilan Riwayat Kontribusi dan Laporan Grup
  const [activeTab, setActiveTab] = useState<"kontribusi" | "laporan">("kontribusi");

  return (
    <>
      {/* Header Halaman & Ringkasan Statistik Gabungan */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase leading-none">Aktivitas Keuangan</h1>
          <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-3">Transparansi penuh kontribusi dan penggunaan dana grup di Blockchain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Total Kontribusi (dari Riwayat) */}
          <div className="bg-dark-green px-6 py-5 rounded-[2rem] shadow-xl flex items-center gap-4 border border-white/5 relative overflow-hidden group">
            <div className="w-10 h-10 bg-accent-green text-milk rounded-xl flex items-center justify-center text-lg shadow-lg relative z-10">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <div className="relative z-10">
              <p className="text-[8px] font-black text-milk/40 uppercase tracking-[0.2em]">Total Kontribusi</p>
              <p className="text-xl font-black text-milk italic tracking-tighter leading-tight">Rp 4.250.000</p>
            </div>
          </div>

          {/* Card Total Escrow (dari Laporan) */}
          <div className="bg-white px-6 py-5 rounded-[2rem] shadow-md flex items-center gap-4 border border-dark-green/5 relative overflow-hidden group">
            <div className="w-10 h-10 bg-dark-green text-milk rounded-xl flex items-center justify-center text-lg shadow-lg relative z-10">
              <i className="fas fa-vault"></i>
            </div>
            <div className="relative z-10">
              <p className="text-[8px] font-black text-dark-green/40 uppercase tracking-[0.2em]">Dana di Escrow</p>
              <p className="text-xl font-black text-dark-green italic tracking-tighter leading-tight">Rp 12.450.000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasi Tab Intern */}
      <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-dark-green/5 mb-8 w-fit">
        <button onClick={() => setActiveTab("kontribusi")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "kontribusi" ? "bg-dark-green text-milk shadow-lg" : "text-dark-green/40 hover:text-dark-green"}`}>
          Riwayat Kontribusi
        </button>
        <button onClick={() => setActiveTab("laporan")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "laporan" ? "bg-dark-green text-milk shadow-lg" : "text-dark-green/40 hover:text-dark-green"}`}>
          Laporan Dana Grup
        </button>
      </div>

      {/* Konten Dinamis Berdasarkan Tab */}
      <div className="text-dark-green">
        {activeTab === "kontribusi" ? (
          /* TAMPILAN RIWAYAT (Daftar Transaksi) */
          <div className="bg-white rounded-[2.5rem] p-2 border border-dark-green/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-dark-green/5 flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Transaksi Terakhir</h3>
              <div className="flex gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-milk text-dark-green/70 hover:text-dark-green transition-all border border-dark-green/15">
                  <i className="fas fa-filter text-[10px]"></i>
                </button>
              </div>
            </div>
            <div className="divide-y divide-dark-green/5">
              {/* Item 1 */}
              <div className="p-6 hover:bg-milk/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-milk border border-dark-green/5 text-dark-green rounded-2xl flex items-center justify-center text-lg shadow-inner">
                    <i className="fas fa-arrow-up-right-from-square"></i>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black uppercase tracking-tight leading-tight">Deposit Patungan</h4>
                    <p className="text-[10px] text-deep-gray font-bold uppercase tracking-widest mt-1">
                      UNTUK: <span className="text-dark-green">SEWA VILLA BALI 3D2N</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1">
                  <p className="text-lg font-black tracking-tighter italic">- RP 500.000</p>
                  <span className="text-[9px] font-black text-dark-green/50 uppercase tracking-widest">27 DES 2025</span>
                </div>
                <Link href="#" className="text-[9px] font-black text-accent-green bg-accent-green/10 px-4 py-2 rounded-full hover:bg-accent-green hover:text-milk transition-all uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-link text-[8px]"></i> 0x92f...a12
                </Link>
              </div>
              {/* Item 2 */}
              <div className="p-6 hover:bg-milk/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-accent-green/10 text-accent-green rounded-2xl flex items-center justify-center text-lg shadow-inner">
                    <i className="fas fa-rotate-left"></i>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black uppercase tracking-tight leading-tight">Refund Otomatis</h4>
                    <p className="text-[10px] text-deep-gray font-bold uppercase tracking-widest mt-1">
                      DARI: <span className="text-dark-green">BELI TIKET KONSER (BATAL)</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1">
                  <p className="text-lg font-black text-accent-green tracking-tighter italic">+ RP 250.000</p>
                  <span className="text-[9px] font-black text-dark-green/50 uppercase tracking-widest">20 DES 2025</span>
                </div>
                <Link href="#" className="text-[9px] font-black text-accent-green bg-accent-green/10 px-4 py-2 rounded-full hover:bg-accent-green hover:text-milk transition-all uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-link text-[8px]"></i> 0x41b...c88
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* TAMPILAN LAPORAN (Penggunaan Dana Grup) */
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-dark-green/5 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Card Header Grup */}
              <div className="p-8 bg-milk/50 border-b border-dark-green/5 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-dark-green/10 flex items-center justify-center text-2xl transition group-hover:scale-110">
                    <i className="fas fa-umbrella-beach"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">Sewa Villa Bali 3D2N</h3>
                    <p className="text-[9px] font-black text-accent-green uppercase tracking-[0.2em] mt-2">Status: Dana Sedang Digunakan</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-[9px] font-black text-dark-green/30 uppercase tracking-widest">Dicairkan</p>
                    <p className="text-lg font-black text-red-500 italic tracking-tighter">Rp 3.500.000</p>
                  </div>
                  <div className="h-10 w-[1px] bg-dark-green/5 hidden md:block"></div>
                  <div>
                    <p className="text-[9px] font-black text-dark-green/30 uppercase tracking-widest">Sisa Escrow</p>
                    <p className="text-lg font-black text-accent-green italic tracking-tighter">Rp 1.500.000</p>
                  </div>
                </div>
              </div>

              {/* Bukti Pengeluaran Detil */}
              <div className="p-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-milk/30 rounded-3xl border border-dark-green/5 gap-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-dark-green/40">
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-tight">DP Villa Amore Seminyak</h4>
                      <p className="text-[9px] font-bold text-dark-green/30 uppercase tracking-widest mt-1">Verified on Base</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <p className="text-sm font-black italic">Rp 2.000.000</p>
                    <button className="bg-white border border-dark-green/10 text-[9px] font-black uppercase px-4 py-2 rounded-xl hover:bg-dark-green hover:text-milk transition-all shadow-sm">
                      <i className="fas fa-image mr-1"></i> Bukti
                    </button>
                    <span className="bg-accent-green/10 text-accent-green text-[9px] font-black px-3 py-1 rounded-full uppercase">Verified</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-dashed border-dark-green/5 flex items-center justify-between">
                  <Link href="#" className="text-[10px] font-black text-accent-green hover:underline uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-link text-[8px]"></i> Lihat Smart Contract
                  </Link>
                  <p className="text-[9px] font-black text-dark-green/20 uppercase tracking-[0.2em]">Verified on Base Blockchain</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Load More Button */}
      <div className="p-8 bg-milk/30 text-center border-t border-dark-green/5 mt-10 rounded-b-[2.5rem]">
        <button className="text-[10px] font-black text-dark-green/60 uppercase tracking-[0.3em] hover:text-accent-green transition-all active:scale-95">Muat Aktivitas Lainnya</button>
      </div>
    </>
  );
}
