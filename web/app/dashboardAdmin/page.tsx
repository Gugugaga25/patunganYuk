"use client";

import React from "react";
import Link from "next/link";

export default function AdminOverviewPage() {
  return (
    <>
      {/* Header Welcome Admin */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase italic leading-none">
            Admin <span className="text-accent-green">Overview</span>
          </h1>
          <p className="text-sm text-deep-gray font-bold uppercase tracking-widest">Pantau performa infrastruktur PatunganYuk secara real-time.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-black text-dark-green/40 uppercase tracking-[0.2em]">System Status</p>
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
            <p className="text-sm font-bold text-dark-green uppercase">Base Network Online</p>
          </div>
        </div>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Escrow (TVL)", val: "124.5M", sub: "Dana Aktif di Kontrak", icon: "fa-vault", color: "bg-dark-green text-milk" },
          { label: "Platform Fee", val: "15.7M", sub: "Siap di-Withdraw", icon: "fa-hand-holding-dollar", color: "bg-white text-dark-green" },
          { label: "Total Proyek", val: "842", sub: "Grup Patungan Dibuat", icon: "fa-layer-group", color: "bg-white text-dark-green" },
          { label: "Active Users", val: "+2.4K", sub: "Wallet Terkoneksi", icon: "fa-users", color: "bg-white text-dark-green" },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} rounded-[2rem] p-7 border border-dark-green/5 shadow-sm hover:shadow-xl transition-all duration-500 group`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${i === 0 ? "bg-accent-green/20 text-accent-green" : "bg-milk border border-dark-green/5 text-accent-green shadow-inner"}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Live Data</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black italic tracking-tighter leading-none mb-2">{stat.val}</h3>
            <p className="text-[9px] font-bold uppercase opacity-40">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Kolom Kiri: Proyek Terbaru & Status Withdrawal */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-dark-green uppercase tracking-tighter italic">Proyek Menunggu Payout</h2>
            <Link href="/dashboard/admin/withdraw" className="text-[10px] font-black text-accent-green uppercase tracking-widest hover:underline">
              Kelola Withdrawal
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-dark-green/5 shadow-sm overflow-hidden">
            <div className="divide-y divide-dark-green/5">
              {[
                { name: "Sewa Villa Bali", target: "10M", status: "Target Met", ready: true },
                { name: "Futsal Mingguan", target: "300K", status: "Collecting", ready: false },
                { name: "Meja Pingpong Kantor", target: "1.5M", status: "Target Met", ready: false },
              ].map((item, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-milk/30 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-milk rounded-2xl flex items-center justify-center text-xl text-dark-green shadow-inner border border-dark-green/5">
                      <i className="fas fa-folder-open"></i>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-black uppercase tracking-tight text-dark-green">{item.name}</h4>
                      <p className="text-[10px] font-bold text-deep-gray uppercase tracking-widest mt-0.5">Target: {item.target} IDRX</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${item.ready ? "bg-accent-green/10 border-accent-green/20 text-accent-green" : "bg-milk border-dark-green/10 text-dark-green/40"}`}>{item.status}</span>
                    <p className="text-[8px] font-bold text-deep-gray uppercase mt-2 opacity-50 italic">{item.ready ? "Fee Unlock Pending Payout" : "Withdrawal Locked"}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-milk/30 text-center border-t border-dark-green/5">
              <button className="text-[9px] font-black text-dark-green/30 uppercase tracking-[0.3em] hover:text-accent-green transition-all">Lihat Seluruh Kontrak</button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Log Aktivitas Global */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-dark-green uppercase tracking-tighter italic">Global Activity</h2>
          <div className="bg-dark-green rounded-[2.5rem] p-8 text-milk shadow-2xl relative overflow-hidden">
            <div className="space-y-8 relative z-10">
              {[
                { type: "New Project", desc: "Arisan Motor Base", time: "2m lalu" },
                { type: "Deposit", desc: "0x71c...3E4F +500K", time: "15m lalu" },
                { type: "Withdrawal", desc: "Platform Fee #042", time: "1j lalu" },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-1.5 h-1.5 bg-accent-green rounded-full mt-1.5 group-hover:scale-150 transition-transform"></div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest">{log.type}</p>
                    <p className="text-[10px] text-milk/50 font-bold uppercase mt-0.5">{log.desc}</p>
                    <p className="text-[8px] text-accent-green/60 font-black uppercase mt-1 italic">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Background Decor */}
            <div className="absolute -bottom-10 -right-10 text-[10rem] text-white/5 rotate-12 italic font-black pointer-events-none">LOG</div>
          </div>

          <button className="w-full py-5 rounded-[1.5rem] border-2 border-dashed border-dark-green/10 text-[10px] font-black text-dark-green/40 hover:border-accent-green hover:text-accent-green transition-all uppercase tracking-[0.2em] italic">Download Reports (.csv)</button>
        </div>
      </div>
    </>
  );
}
