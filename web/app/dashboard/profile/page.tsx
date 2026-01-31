import React from "react";

export default function ProfilePage() {
  return (
    <>
      {/* Judul Halaman */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase">Profil Saya</h1>
        <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-2">Kelola identitas dan preferensi Web3 Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Kartu Identitas & Wallet */}
        <div className="lg:col-span-1 space-y-6">
          {/* Kartu Profil */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-dark-green/5 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-dark-green"></div>
            <div className="relative z-10 pt-4">
              <img className="w-28 h-28 rounded-3xl border-4 border-white mx-auto shadow-xl group-hover:scale-105 transition duration-500" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
              <h3 className="text-xl font-black text-dark-green mt-4 uppercase tracking-tight">Budi Santoso</h3>
              <p className="text-[9px] font-black text-accent-green bg-accent-green/10 inline-block px-3 py-1 rounded-md mt-2 uppercase tracking-[0.2em]">Verified Member</p>
            </div>

            <div className="relative flex pt-6 mt-6 border-t border-dark-green/5 flex justify-around">
              {/* Divider */}
              <span className="absolute top-2 bottom-0 left-1/2 w-px bg-dark-green/10"></span>
              {/* Kontribusi */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-dark-green/60">
                  <i className="fas fa-users text-xs"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Kontribusi</span>
                </div>
                <p className="text-base font-black text-dark-green">12 GRUP</p>
              </div>

              {/* Reputasi */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-dark-green/60">
                  <i className="fas fa-crown text-xs text-emerald-600"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Reputasi</span>
                </div>
                <p className="text-base font-black text-emerald-600 uppercase">Top Tier</p>
              </div>
            </div>
          </div>

          {/* Kartu Dompet Digital */}
          <div className="bg-dark-green rounded-[2rem] p-6 text-milk relative overflow-hidden shadow-2xl">
            <h4 className="text-[9px] font-black opacity-80 uppercase tracking-[0.2em] mb-4">Dompet Terhubung</h4>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-accent-green shadow-inner">
                <i className="fa-brands fa-ethereum"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs font-mono font-bold opacity-80">0x71C2...3E4F</p>
                <p className="text-[9px] font-black text-accent-green uppercase tracking-widest">Base Network</p>
              </div>
              <button className="text-milk/80 hover:text-milk transition">
                <i className="fas fa-copy text-xs"></i>
              </button>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[9px] opacity-40 uppercase font-black tracking-widest">Saldo Tersedia</p>
              <p className="text-2xl font-black mt-1 tracking-tighter">Rp 1.250.000</p>
            </div>
            <i className="fas fa-shield-halved absolute -bottom-6 -right-4 text-7xl opacity-5"></i>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-dark-green/5 shadow-sm">
            <h3 className="text-xl font-black text-dark-green mb-10 flex items-center gap-3 uppercase tracking-tighter">
              <span className="w-10 h-10 bg-milk text-dark-green rounded-xl flex items-center justify-center shadow-sm">
                <i className="fas fa-cog"></i>
              </span>
              Pengaturan Umum
            </h3>

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-dark-green/70 uppercase tracking-[0.2em] ml-1">Nama Lengkap</label>
                  <input type="text" defaultValue="BUDI SANTOSO" className="w-full bg-milk border border-dark-green/10  rounded-2xl p-4 text-[11px] font-black text-dark-green focus:ring-2 focus:ring-accent-green/20 uppercase tracking-widest outline-none" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-dark-green/70 uppercase tracking-[0.2em] ml-1">Email Notifikasi</label>
                  <input type="email" defaultValue="BUDI@EXAMPLE.COM" className="w-full bg-milk border border-dark-green/10  rounded-2xl p-4 text-[11px] font-black text-dark-green focus:ring-2 focus:ring-accent-green/20 uppercase tracking-widest outline-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-dark-green/70 uppercase tracking-[0.2em] ml-1">Bio Singkat</label>
                <textarea rows={3} defaultValue="PENGGIAT PATUNGAN SOSIAL BERBASIS TEKNOLOGI BLOCKCHAIN." className="w-full bg-milk border border-dark-green/10  rounded-2xl p-4 text-[11px] font-black text-dark-green focus:ring-2 focus:ring-accent-green/20 uppercase tracking-widest resize-none outline-none" />
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button type="button" className="flex-1 py-4 bg-dark-green text-milk rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition active:scale-95">
                  Simpan Perubahan
                </button>
                <button type="button" className="px-10 py-4 bg-milk text-dark-green border border-dark-green/10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-dark-green/5 transition">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
