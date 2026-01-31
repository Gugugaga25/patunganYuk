"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { CONTRACTS } from "@/src/constants/contracts";
import { createClient } from "@/src/lib/supabase/client";

const supabase = createClient();

export default function DetailPatunganPage() {
  const { address: contractAddress } = useParams();
  const { address: userAddress } = useAccount();
  
  const [patungan, setPatungan] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [targetCount, setTargetCount] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // --- 1. FETCH DATA MULTI-TABEL ---
  useEffect(() => {
    const fetchFullData = async () => {
      if (!contractAddress) return;

      const { data: pData } = await supabase
        .from("patungan")
        .select("*")
        .eq("contract_address", contractAddress)
        .single();

      if (pData) {
        setPatungan(pData);

        const { data: metaData } = await supabase
          .from("patungan") 
          .select("target_participants")
          .eq("id", pData.id)
          .single();
        
        if (metaData) setTargetCount(metaData.target_participants);

        // Ambil list peserta (Join dengan tabel users menggunakan kolom 'id')
        const { data: partData } = await supabase
          .from("patungan_participants")
          .select("*, users!inner(email)") 
          .eq("patungan_id", pData.id);
        
        if (partData) setParticipants(partData);
      }
      setLoading(false);
    };

    fetchFullData();
  }, [contractAddress, isSuccess]);

  // --- 2. LOGIKA HITUNG TAGIHAN (UPDATED) ---
  const calculateBill = () => {
    if (!patungan) return { base: 0, fee: 0, total: 0 };
    
    // 1. Hitung nominal pokok per orang
    const baseAmount = patungan.target_amount / (targetCount || 1);
    
    // 2. Hitung Admin Fee: 1% dari baseAmount
    const percentageFee = baseAmount * 0.01;
    
    // 3. Terapkan Batas Minimum (2.000 IDRX)
    // Math.max akan memilih angka yang paling besar antara hasil % atau 2000
    const adminFee = Math.max(percentageFee, 2000);
    
    return {
      base: Math.round(baseAmount),
      fee: Math.round(adminFee),
      total: Math.round(baseAmount + adminFee)
    };
  };

  const bill = calculateBill();

  // --- 3. EKSEKUSI PEMBAYARAN ON-CHAIN ---
  const handlePayment = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACTS.escrow.abi,
      functionName: "deposit",
      args: [
        parseUnits(bill.base.toString(), 6), // Dana Pokok (IDRX 6 desimal)
        parseUnits(bill.fee.toString(), 6)   // Dana Admin
      ],
    });
  };

  // --- 4. SINKRONISASI SETELAH TRANSAKSI SUKSES ---
  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (isSuccess && userAddress && patungan) {
        // Cari UUID user berdasarkan wallet untuk update status
        const { data: userData } = await supabase
          .from("wallets")
          .select("user_id")
          .eq("wallet_address", userAddress.toLowerCase())
          .single();

        if (userData) {
          // Update status partisipan
          await supabase
            .from("patungan_participant")
            .update({ status: "Paid", amount_paid: bill.base })
            .match({ patungan_id: patungan.id, user_id: userData.user_id });

          // Update progres total di tabel patungan
          await supabase
            .from("patungan")
            .update({ current_amount: patungan.current_amount + bill.base })
            .eq("id", patungan.id);
        }
      }
    };
    updatePaymentStatus();
  }, [isSuccess]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse">MEMBUKA BRANKAS...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 text-dark-green">
      {/* Visual Progres Card */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-dark-green/5 shadow-sm">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">{patungan?.title}</h1>
        <div className="flex justify-between items-end mb-4">
          <p className="text-lg font-black">{patungan?.current_amount.toLocaleString()} <span className="text-xs opacity-30">/ {patungan?.target_amount.toLocaleString()} IDRX</span></p>
          <span className="text-2xl font-black text-accent-green">
            {Math.round((patungan?.current_amount / patungan?.target_amount) * 100)}%
          </span>
        </div>
        <div className="w-full h-4 bg-milk rounded-full overflow-hidden p-1">
          <div 
            className="h-full bg-accent-green rounded-full shadow-lg shadow-accent-green/20 transition-all duration-1000" 
            style={{ width: `${(patungan?.current_amount / patungan?.target_amount) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Panel Tagihan */}
        <div className="bg-dark-green rounded-[2.5rem] p-10 text-milk space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Invoice Kamu</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold opacity-60 uppercase">
              <span>Dana Patungan</span>
              <span>{bill.base.toLocaleString()} IDRX</span>
            </div>
            <div className="flex justify-between text-xs font-bold opacity-60 uppercase">
              <span>Biaya Admin</span>
              <span>{bill.fee.toLocaleString()} IDRX</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-2xl font-black text-accent-green">
              <span>TOTAL</span>
              <span>{bill.total.toLocaleString()}</span>
            </div>
          </div>
          <button 
            onClick={handlePayment} 
            disabled={isConfirming}
            className="w-full py-5 bg-accent-green text-dark-green rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all"
          >
            {isConfirming ? "Proses..." : "Bayar Sekarang"}
          </button>
        </div>

        {/* Panel Partisipan */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-dark-green/5 shadow-sm space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Daftar Teman</h2>
          <div className="space-y-4">
            {participants.map((p, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-milk rounded-2xl">
                <span className="text-[10px] font-black uppercase">{p.users?.email.split('@')[0]}</span>
                <span className={`text-[8px] font-black px-2 py-1 rounded-full ${p.status === 'Paid' ? 'bg-accent-green text-milk' : 'bg-dark-green/10 opacity-30'}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}