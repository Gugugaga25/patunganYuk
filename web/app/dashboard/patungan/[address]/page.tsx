"use client";

import React, { useEffect, useState, useRef } from "react";
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

  const [showDetailBayar, setShowDetailBayar] = useState(false);
  const [showPopupTotal, setShowPopupTotal] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

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
          .from("patungan_participant")
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
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-8">

          {/* INFO & PROGRESS */}
          <div key={patungan.id} className="bg-white rounded-[2.5rem] p-10 border border-dark-green/5 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-accent-green/10 text-accent-green text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {patungan.description || "UMUM"}
              </span>
              <span className="text-dark-green/20 text-[10px] font-black uppercase">
                #{patungan.id}
              </span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
              {patungan?.title}
            </h1>
            <p className="text-sm text-deep-gray mb-8">
              Deskripsi
            </p>

            {/* PROGRESS */}
            <div className="bg-milk p-6 rounded-2xl border border-dark-green/5 mb-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[14px] font-black uppercase tracking-widest text-deep-gray">
                    Dana Terkumpul
                  </p>
                  <p className="text-xl font-black mt-2">
                    {patungan?.current_amount.toLocaleString()}
                    <span className="text-sm opacity-50">
                      {" "}
                      / {patungan?.target_amount.toLocaleString()} IDRX
                    </span>
                  </p>
                </div>
                <span className="text-2xl font-black text-accent-green">
                  {Math.round(
                    (patungan?.current_amount / patungan?.target_amount) * 100
                  )}%
                </span>
              </div>
              <div className="w-full bg-white h-4 rounded-full border border-dark-green/5 p-1 overflow-hidden">
                <div
                  className="bg-accent-green h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(patungan?.current_amount / patungan?.target_amount) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* PESERTA */}
            <div className="bg-milk p-6 rounded-2xl border border-dark-green/5">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">
                Peserta ({participants.length})
              </h3>
              <div className="space-y-4">
                {participants.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b border-dark-green/5 last:border-0">
                    <span className="text-xs font-bold font-mono">
                      {p.users?.email}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        p.status === "Paid"
                          ? "bg-accent-green text-milk"
                          : "bg-dark-green/10 text-dark-green/40"
                      }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-dark-green/5 shadow-sm sticky top-24">

            <h2 className="text-lg font-black uppercase tracking-widest mb-6">
              Bayar Patungan
            </h2>

            <div className="bg-milk p-6 rounded-2xl border border-dark-green/5 mb-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-deep-gray">
                Total Tagihan
              </p>
              <p className="text-2xl font-black mt-2 text-dark-green">
                {bill.total.toLocaleString()} IDRX
              </p>

              <button
                onClick={() => setShowDetailBayar(!showDetailBayar)}
                className="mt-4 font-black text-accent-green text-[11px] flex items-center gap-2 uppercase transition-all hover:opacity-70">
                Detail Perincian
                <i
                  className={`fas fa-chevron-down text-[10px] transition-transform ${
                    showDetailBayar ? "rotate-180" : ""
                  }`}/>
              </button>

              {showDetailBayar && (
                <div className="border-t border-dark-green/10 mt-4 pt-3 text-xs space-y-3 animate-fadeIn">
                  <div className="flex justify-between text-deep-gray">
                    <span>Total Dana Grup</span>
                    <span>{patungan?.target_amount.toLocaleString()} IDRX</span>
                  </div>
                  <div className="flex justify-between text-deep-gray">
                    <span>Jumlah Peserta</span>
                    <span>{participants.length} Orang</span>
                  </div>
                  <div className="border-t border-dark-green/5 pt-3 flex justify-between font-black items-center relative">
                    <div className="flex items-center gap-2">
                      <span>Per Orang</span>
                      <button
                        onClick={() => setShowPopupTotal(!showPopupTotal)} className="w-4 h-4 rounded-full border border-dark-green/40 text-[9px] font-black flex items-center justify-center text-dark-green hover:bg-dark-green hover:text-white transition">
                        ?
                      </button>
                    </div>
                    <span className="text-accent-green">505.000 IDRX</span>
                    {showPopupTotal && (
                      <div ref={popupRef} className="absolute right-0 top-full mt-3 w-56 bg-white border border-dark-green/10 rounded-xl p-4 text-[10px] shadow-2xl z-20">
                        <p className="font-black mb-1 uppercase text-dark-green/60">Logika Perhitungan:</p>
                        <p className="text-deep-gray font-medium leading-relaxed">Total Dana Patungan ÷ Jumlah Seluruh Peserta Grup</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={isConfirming}
              className="w-full bg-dark-green text-milk py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black active:scale-95 transition-all"
            >
              {isConfirming ? "Proses..." : "Konfirmasi & Bayar"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}