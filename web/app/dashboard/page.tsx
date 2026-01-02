'use client';

import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { useRouter } from 'next/navigation';

// Konfigurasi Kontrak IDRX
const IDRX_ABI = ["function balanceOf(address) view returns (uint256)"] as const;
const IDRX_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS as `0x${string}`;

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 1. Ambil Saldo IDRX asli dari Blockchain Base Sepolia
  const { data: balance } = useReadContract({
    address: IDRX_TOKEN_ADDRESS,
    abi: IDRX_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      refetchInterval: 10000, // Update saldo otomatis setiap 10 detik
    }
  });

  // 2. Prevent Hydration Error & Route Guard
  useEffect(() => {
    setMounted(true);
    if (!isConnected) {
      router.push('/'); // Tendang ke Landing Page jika belum login
    }
  }, [isConnected, router]);

  if (!mounted || !isConnected) return null;

  // Format Tampilan
  const displayBalance = balance && typeof balance === 'bigint'
    ? Number(formatUnits(balance, 6)).toLocaleString('id-ID') 
    : "0";
  
  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : "User";

  const serverTime = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header User */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#0a261c] tracking-tighter uppercase italic">
            Halo, {truncatedAddress}! 👋
          </h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
            Dompet Anda siap untuk aksi sosial di Base Network.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-black text-[#0a261c]/60 uppercase tracking-[0.2em]">Waktu Lokal</p>
          <p className="text-sm font-bold text-[#0a261c]/90 uppercase">{serverTime}</p>
        </div>
      </div>

      {/* Cards Top */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        {/* Card Saldo Real-Time */}
        <div className="lg:col-span-5 bg-[#0a261c] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-white/10">
          <div className="relative z-10">
            <div className="flex items-center gap-2 opacity-60 mb-6">
              <i className="fas fa-wallet text-xs"></i>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Saldo IDRX</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter italic">
              Rp {displayBalance}
            </h3>
            <div className="flex gap-2">
              <span className="bg-[#a7f3d0] text-[#0a261c] text-[9px] font-black px-2 py-1 rounded-md tracking-widest">
                NETWORK: BASE SEPOLIA
              </span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#a7f3d0]/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        {/* Validator Task Section */}
        <div className="lg:col-span-7 bg-[#a7f3d0]/10 border border-[#a7f3d0]/20 p-8 rounded-[2.5rem] shadow-sm relative group overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex gap-4 text-[#0a261c]">
              <div className="w-14 h-14 bg-[#a7f3d0] text-[#0a261c] rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-[#a7f3d0]/20">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div>
                <p className="text-xs font-black text-[#0a261c]/60 uppercase tracking-widest mb-1">Status Validator</p>
                <p className="text-xl font-black uppercase italic tracking-tight leading-none mb-3">
                  Menunggu integrasi <br /> Smart Contract...
                </p>
                <button className="inline-flex items-center gap-2 bg-[#0a261c] text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:bg-black transition-all">
                  Cek Tugas <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
            <span className="bg-[#a7f3d0] text-[#0a261c] text-[9px] font-black px-2 py-1 rounded-md">INFO</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* List Patungan (Akan di-map dari Supabase nanti) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#0a261c] uppercase italic tracking-tighter">Patungan Saya</h2>
            <button className="text-[12px] font-black text-[#0a261c]/40 uppercase tracking-[0.15em] hover:text-[#0a261c] transition">Lihat Semua</button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
             {/* Konten patungan statis - Segera hubungkan ke Supabase */}
             <p className="text-sm font-bold text-gray-400 italic">Data patungan akan muncul setelah integrasi Supabase selesai.</p>
          </div>
        </div>

        {/* Aktivitas Samping */}
        <div className="space-y-8 text-[#0a261c]">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Aktivitas Terbaru</h2>
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest">Belum ada aktivitas blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
}