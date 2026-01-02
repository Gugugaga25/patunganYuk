"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus, 
  TransactionStatusAction, 
  TransactionStatusLabel 
} from "@coinbase/onchainkit/transaction";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/constants/contracts";
import { baseSepolia } from "viem/chains";

export default function BuatPatunganPage() {
  const { address } = useAccount();
  
  // 1. State untuk Form
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    targetAmount: "",
    deadline: "",
  });

  // 2. Logika Konversi Data ke format Blockchain
  // Hitung durasi dalam detik (Unix Timestamp)
  const calculateDuration = () => {
    if (!formData.deadline) return 0n;
    const selectedDate = new Date(formData.deadline).getTime() / 1000;
    const now = Math.floor(Date.now() / 1000);
    const duration = selectedDate - now;
    return duration > 0 ? BigInt(Math.floor(duration)) : 0n;
  };

  // IDRX memiliki 6 desimal
  const targetInBigInt = formData.targetAmount 
    ? parseUnits(formData.targetAmount, 6) 
    : 0n;

  // 3. Konfigurasi Call untuk Smart Contract
  const calls = [
    {
      address: FACTORY_ADDRESS as `0x${string}`,
      abi: FACTORY_ABI,
      functionName: "createRoom",
      args: [
        formData.title,
        process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS, // Alamat Token IDRX
        targetInBigInt,
        calculateDuration(),
      ],
    },
  ];

  return (
    <>
      <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(12%) sepia(21%) saturate(1000%) hue-rotate(110deg);
          cursor: pointer;
        }
      `}</style>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#0a261c] tracking-tighter uppercase italic">Buat Patungan Baru</h1>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Data ini akan diabadikan di Smart Contract Base Network.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-10 text-[#0a261c]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nama Kegiatan</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value.toUpperCase()})}
                placeholder="MISAL: SEWA LAPANGAN" 
                className="w-full bg-[#f8fafc] border-none rounded-2xl p-4 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#a7f3d0]/20 outline-none" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Kategori</label>
              <input 
                type="text" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value.toUpperCase()})}
                placeholder="MISAL: HOBI" 
                className="w-full bg-[#f8fafc] border-none rounded-2xl p-4 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#a7f3d0]/20 outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Target Dana (IDRX)</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-[11px] font-black text-gray-300">RP</span>
                <input 
                  type="number" 
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  placeholder="0" 
                  className="w-full bg-[#f8fafc] border-none rounded-2xl p-4 pl-12 text-[11px] font-black focus:ring-2 focus:ring-[#a7f3d0]/20 outline-none" 
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Batas Waktu (Deadline)</label>
              <input 
                type="date" 
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full bg-[#f8fafc] border-none rounded-2xl p-4 text-[11px] font-black focus:ring-2 focus:ring-[#a7f3d0]/20 text-[#0a261c] outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Seksi Rekening (Off-chain Data untuk Database) */}
        <div className="bg-[#a7f3d0]/5 rounded-[2rem] p-8 border border-[#a7f3d0]/10">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
            <i className="fas fa-university text-accent-green" /> Rekening Pencairan Akhir (Simulasi)
          </h3>
          <p className="text-[10px] text-gray-400 font-bold mb-6 italic">Data ini akan disimpan di Supabase untuk proses off-ramp nanti.</p>
          {/* ... UI Rekening tetap sama seperti kode kamu ... */}
        </div>

        {/* 4. Integrasi Tombol Deploy Gasless */}
        <div className="pt-4">
          <Transaction
            chainId={baseSepolia.id}
            calls={calls}
            onSuccess={() => alert("Kamar Patungan Berhasil Dibuat!")}
          >
            <TransactionButton 
              className="w-full py-6 bg-[#0a261c] text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all"
              text="Deploy ke Blockchain (Gasless)"
            />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
          
          <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-6 opacity-50">
            <i className="fas fa-gas-pump mr-1" />
            Gas fee ditanggung oleh Paymaster melalui OnchainKit
          </p>
        </div>
      </div>
    </>
  );
}