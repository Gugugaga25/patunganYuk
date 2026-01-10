'use client'

import React from "react";
import { supabaseBrowser } from '@/src/lib/supabase/browser';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      if (!session) {
        router.push('/login') // redirect kalau belum login
      } else {
        setLoading(false) // session ada, tampilkan dashboard
      }
    }

    checkSession()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <>
      {/* Header User */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase">Halo, Budi! 👋</h1>
          <p className="text-sm text-deep-gray font-bold uppercase tracking-widest">Dompet Anda siap untuk aksi sosial.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-black text-dark-green/60 uppercase tracking-[0.2em]">Waktu Server</p>
          <p className="text-sm font-bold text-dark-green/90 uppercase">Sabtu, 27 Des 2025</p>
        </div>
      </div>

      {/* Cards Top */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 bg-dark-green rounded-[2.5rem] p-8 text-milk shadow-2xl relative overflow-hidden group border border-white/10">
          <div className="relative z-10">
            <div className="flex items-center gap-2 opacity-60 mb-1">
              <i className="fas fa-wallet text-xs"></i>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Saldo IDRX</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter italic">1.250.000 IDRX</h3>
            <div className="flex gap-2">
              <span className="bg-accent-green text-[9px] font-black px-2 py-1 rounded-md">NETWORK: BASE</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-accent-green/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        <div className="lg:col-span-7 bg-accent-green/10 border border-accent-green/20 p-8 rounded-[2.5rem] shadow-sm relative group overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex gap-4 text-dark-green mt-3">
              <div className="w-14 h-14 bg-accent-green text-milk rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-accent-green/20">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div>
                <p className="text-xs font-black text-accent-green uppercase tracking-widest mb-1">Validator Task</p>
                <p className="text-xl font-black uppercase italic tracking-tight leading-none mb-3">
                  1 Pencairan butuh persetujuan Anda
                </p>
                <Link
                  href="dashboard/validator"
                  className="inline-flex items-center gap-2 bg-dark-green text-milk text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:bg-black transition-all">
                  Periksa Sekarang <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
            <span className="bg-accent-green text-milk text-[9px] font-black px-2 py-1 rounded-md animate-bounce">PENTING</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-dark-green uppercase italic tracking-tighter">Patungan Berjalan</h2>
            <Link
              href="/dashboard/patungan"
              className="text-[12px] font-black text-accent-green uppercase tracking-[0.15em] hover:opacity-70 transition">
              Lihat Semua
            </Link>
          </div>

          {/* Card Patungan */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-dark-green/5 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 text-dark-green">
              <div className="flex gap-5">
                <div className="w-16 h-16 bg-milk border border-dark-green/5 rounded-3xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition">
                  <i className="fas fa-umbrella-beach"></i>
                </div>
                <div>
                  <span className="text-[9px] font-black text-accent-green bg-accent-green/10 px-3 py-1 rounded-md uppercase tracking-widest">Kategori: Liburan</span>
                  <h3 className="text-xl font-black mt-2 uppercase italic tracking-tight">Sewa Villa Bali 3D2N</h3>
                </div>
              </div>
              <div className="bg-red-50 px-6 py-3 rounded-2xl border border-red-100 self-start md:self-center text-center">
                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Sisa Waktu</p>
                <p className="text-lg font-black text-red-600 leading-tight">5 HARI</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-deep-gray uppercase tracking-widest">Progres Dana</p>
                  <p className="text-xl font-black text-dark-green">
                    4.040.000 IDRX <span className="text-sm font-bold text-deep-gray/60">/ 6.060.000 IDRX</span>
                  </p>
                </div>
                <span className="text-2xl font-black text-accent-green italic">67%</span>
              </div>
              <div className="w-full bg-milk h-4 rounded-full border border-dark-green/5 overflow-hidden p-1">
                <div className="bg-accent-green h-full rounded-full transition-all duration-1000" style={{ width: "67%" }}></div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-green/5 flex items-end justify-end">
              <Link
                href={`/dashboard/patungan/sewa-villa-bali`}
                className="bg-dark-green hover:bg-black text-milk px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg">
                Setor Dana
              </Link>
            </div>
          </div>
        </div>

        {/* Aktivitas Samping */}
        <div className="space-y-8 text-dark-green">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Aktivitas</h2>
          <div className="bg-white/50 backdrop-blur-xl border border-dark-green/5 rounded-[2.5rem] p-8 shadow-sm">
            <div className="space-y-8">
              <div className="flex gap-4 group">
                <div className="w-10 h-10 bg-accent-green/10 text-accent-green rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition">
                  <i className="fas fa-arrow-down text-sm"></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-[12px] font-black uppercase tracking-tight">Deposit Masuk</p>
                    <span className="text-[12px] font-black text-accent-green">+500K</span>
                  </div>
                  <p className="text-[10px] text-deep-gray font-bold uppercase mt-1 tracking-widest">Sewa Villa Bali • 2j lalu</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-10 h-10 bg-dark-green/5 text-dark-green rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition">
                  <i className="fas fa-check text-sm"></i>
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-black uppercase tracking-tight">Validasi Selesai</p>
                  <p className="text-[10px] text-deep-gray font-bold uppercase mt-1 tracking-widest">Meja Pingpong • Kemarin</p>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/riwayat"
              className="w-full mt-10 py-4 rounded-2xl border-2 border-dashed border-dark-green/10 text-[9px] font-black text-dark-green/40 hover:border-accent-green hover:text-accent-green transition-all uppercase tracking-[0.2em] block text-center">
              Riwayat Transaksi
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
