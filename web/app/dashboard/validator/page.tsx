import React from "react";
import Link from "next/link";

export default function ValidatorPage() {
  return (
    <>
      {/* Judul Halaman */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase leading-none">Panel Validator</h1>
        <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-3">Gunakan hak suara Anda untuk memverifikasi pencairan dana.</p>
      </div>

      {/* Card Utama Panel Validator */}
      <div className="bg-white rounded-[2.5rem] border border-dark-green/5 shadow-2xl overflow-hidden text-dark-green">
        {/* Header Card: Status & Nominal */}
        <div className="p-8 bg-accent-green/5 border-b border-accent-green/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-accent-green/20 flex items-center justify-center text-3xl">
              <i className="fas fa-table-tennis-paddle-ball" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Beli Meja Pingpong</h3>
              <p className="text-[10px] font-black text-accent-green uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-green rounded-full animate-ping" />
                Menunggu Suara Anda
              </p>
            </div>
          </div>
          <div className="text-right bg-dark-green p-5 rounded-2xl text-milk border border-white/5 shadow-xl">
            <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">Jumlah Pencairan</p>
            <p className="text-2xl font-black tracking-tighter leading-none">1.500.000 IDRX</p>
          </div>
        </div>

        {/* Konten Detail Pengajuan */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Sisi Kiri: Deskripsi & Bukti */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-dark-green/80 uppercase tracking-[0.2em] ml-1">Detail Pengeluaran</label>
                <p className="text-sm font-bold text-dark-green/80 mt-4 leading-relaxed bg-milk p-6 rounded-2xl border-l-4 border-accent-green">"Pembelian meja pingpong merk Butterfly sesuai kesepakatan grup di grup WA. Unit akan diletakkan di ruang tengah kantor."</p>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-dark-green/80 uppercase tracking-[0.2em] ml-1">Bukti Kuitansi (On-Chain)</label>
                <div className="group relative aspect-video bg-milk mt-4 rounded-[2rem] flex flex-col items-center justify-center text-dark-green/20 border-2 border-dashed border-dark-green/10 hover:border-accent-green hover:text-accent-green transition-all cursor-pointer overflow-hidden">
                  <i className="fas fa-file-invoice-dollar text-4xl mb-3 transition group-hover:scale-110" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Lihat Dokumen Lengkap</span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Progress & Tombol Aksi */}
            <div className="flex flex-col mt-10 space-y-10">
              <div className="bg-milk p-8 rounded-[2rem] border border-dark-green/5">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-dark-green/80 uppercase tracking-[0.2em]">Status Konsensus</label>
                  <span className="text-xl font-black text-accent-green">2/3</span>
                </div>

                {/* Progress Bar Konsensus */}
                <div className="w-full bg-dark-green/5 h-5 rounded-full overflow-hidden p-1 mb-4 shadow-inner">
                  <div className="bg-accent-green h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(18,183,106,0.4)]" style={{ width: "66.6%" }} />
                </div>

                <p className="text-[11px] font-bold text-deep-gray uppercase tracking-tight leading-relaxed">Satu suara verifikasi lagi diperlukan agar dana dapat otomatis cair ke wallet tujuan.</p>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 py-5 bg-accent-green text-milk rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition active:scale-95 flex items-center justify-center gap-3">
                  <i className="fas fa-check-circle text-sm" />
                  Setujui Pencairan
                </button>
                <Link href="/dashboard/validator/laporkan" className="flex-1 py-5 bg-white border border-red-200 text-red-500 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-red-50 transition active:scale-95">
                  Tolak / Laporkan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Bar Blockchain */}
      <div className="mt-10 p-6 bg-dark-green rounded-2xl text-center">
        <p className="text-[10px] font-bold text-milk/70 uppercase tracking-[0.2em]">
          <i className="fas fa-info-circle mr-2 text-accent-green" />
          Suara Anda akan direkam secara permanen di Base Blockchain Explorer
        </p>
      </div>
    </>
  );
}
