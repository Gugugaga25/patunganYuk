"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PatunganSayaPage() {
  const [filter, setFilter] = useState("Aktif");

  const tabs = ["Aktif", "Selesai", "Batal"];

  return (
    <>
      {/* CSS Lokal untuk Animasi Jam Pasir */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>

      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase leading-none">Patungan Saya</h1>
          <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-3">Pantau status dana grup Anda secara real-time.</p>
        </div>

        {/* Tab Filter */}
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-dark-green/5">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab ? "bg-dark-green text-milk shadow-[0_10px_20px_-5px_rgba(10,46,32,0.3)]" : "text-dark-green/30 hover:text-dark-green"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Card Patungan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-dark-green">
        {/* Card 1: Sewa Villa Bali */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-dark-green/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-milk border border-dark-green/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition">
                <i className="fas fa-umbrella-beach"></i>
              </div>
              <div>
                <span className="text-[9px] font-black text-accent-green bg-accent-green/10 px-3 py-1 rounded-md uppercase tracking-widest">Kategori: Liburan</span>
                <h3 className="text-xl font-black mt-2 uppercase italic tracking-tight leading-none">Sewa Villa Bali 3D2N</h3>
              </div>
            </div>
            <span className="text-[9px] font-black text-dark-green/60 bg-milk px-3 py-1 rounded-md uppercase tracking-widest border border-dark-green/10">Member</span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-deep-gray uppercase tracking-widest">Progres Dana</p>
                <p className="text-lg font-black">
                  Rp 4.200.000 <span className="text-sm font-bold text-dark-green/60">/ 5JT</span>
                </p>
              </div>
              <span className="text-2xl font-black text-accent-green italic">84%</span>
            </div>
            <div className="w-full bg-milk h-4 rounded-full border border-dark-green/5 overflow-hidden p-1">
              <div className="bg-accent-green h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(18,183,106,0.2)]" style={{ width: "84%" }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-dark-green/5">
            <div className="flex items-center gap-2 text-red-500">
              <i className="far fa-clock text-xs"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">5 Hari Lagi</span>
            </div>
            <Link href={`/dashboard/patungan/sewa-villa-bali`} className="bg-dark-green text-milk px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg text-center">
              Detail
            </Link>
          </div>
        </div>

        {/* Card 2: Futsal Mingguan */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-dark-green/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-milk border border-dark-green/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition">
                <i className="fas fa-futbol"></i>
              </div>
              <div>
                <span className="text-[9px] font-black text-accent-green bg-accent-green/10 px-3 py-1 rounded-md uppercase tracking-widest">Kategori: Olahraga</span>
                <h3 className="text-xl font-black mt-2 uppercase italic tracking-tight leading-none">Futsal Mingguan</h3>
              </div>
            </div>
            <span className="text-[9px] font-black text-accent-green bg-accent-green/10 px-3 py-1 rounded-md uppercase tracking-widest border border-accent-green/20">Admin</span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-deep-gray uppercase tracking-widest">Progres Dana</p>
                <p className="text-lg font-black">
                  Rp 150.000 <span className="text-sm font-bold text-dark-green/60">/ 300K</span>
                </p>
              </div>
              <span className="text-2xl font-black text-accent-green italic">50%</span>
            </div>
            <div className="w-full bg-milk h-4 rounded-full border border-dark-green/5 overflow-hidden p-1">
              <div className="bg-accent-green h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(18,183,106,0.2)]" style={{ width: "50%" }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-dark-green/5">
            <div className="flex items-center gap-2 text-dark-green/60">
              <i className="far fa-calendar text-xs"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">Besok, 19:00 WIB</span>
            </div>
            <Link href="/dashboard/patungan/detail-futsal" className="bg-dark-green text-milk px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg text-center">
              Detail
            </Link>
          </div>
        </div>

        {/* Card 3: Meja Pingpong */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-dark-green/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-milk border border-dark-green/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition">
                <i className="fas fa-table-tennis-paddle-ball"></i>
              </div>
              <div>
                <span className="text-[9px] font-black text-accent-green bg-accent-green/10 px-3 py-1 rounded-md uppercase tracking-widest">Kategori: Fasilitas</span>
                <h3 className="text-xl font-black mt-2 uppercase italic tracking-tight leading-none">Meja Pingpong</h3>
              </div>
            </div>
            <span className="text-[9px] font-black text-dark-green/60 bg-milk px-3 py-1 rounded-md uppercase tracking-widest border border-dark-green/10">Member</span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-deep-gray uppercase tracking-widest">Progres Dana</p>
                <p className="text-lg font-black">
                  Rp 1.500.000 <span className="text-sm font-bold text-dark-green/60">/ 1.5JT</span>
                </p>
              </div>
              <span className="text-2xl font-black text-accent-green italic">100%</span>
            </div>
            <div className="w-full bg-accent-green/10 h-4 rounded-full border border-accent-green/10 overflow-hidden p-1">
              <div className="bg-accent-green h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(18,183,106,0.4)]" style={{ width: "100%" }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-dark-green/5">
            <div className="flex items-center gap-2 text-accent-green">
              <i className="fas fa-hourglass-half text-xs animate-spin-slow"></i>
              <span className="text-[10px] font-black uppercase tracking-widest italic">Pencairan: Validasi (2/3)</span>
            </div>
            <Link href="/dashboard/patungan/pantau-pingpong" className="bg-dark-green text-milk px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg text-center">
              Pantau Dana
            </Link>
          </div>
        </div>

        {/* Tombol Buat Patungan Baru */}
        <Link href="/dashboard/buat" className="border-4 border-dashed border-dark-green/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group hover:border-accent-green hover:bg-accent-green/5 transition-all cursor-pointer">
          <div className="w-16 h-16 bg-milk text-dark-green/10 rounded-full flex items-center justify-center text-2xl group-hover:bg-accent-green group-hover:text-milk transition-all duration-500 mb-4 shadow-inner">
            <i className="fas fa-plus"></i>
          </div>
          <h4 className="text-lg font-black text-dark-green/30 group-hover:text-dark-green transition-all uppercase italic tracking-tighter">Buat Patungan Baru</h4>
          <p className="text-[10px] font-bold text-dark-green/20 uppercase tracking-[0.2em] max-w-[220px] mt-2 group-hover:text-dark-green/60 transition-all">Mulai penggalangan dana grup Anda sekarang.</p>
        </Link>
      </div>
    </>
  );
}
