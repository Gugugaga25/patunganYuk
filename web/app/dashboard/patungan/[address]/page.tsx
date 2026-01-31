"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits, decodeEventLog } from "viem"; // Tambahkan decodeEventLog
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
  // Ambil receipt untuk memproses logs
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // --- 1. DATA READS (On-Chain) ---
  const { data: contractInfo } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACTS.escrow.abi,
    functionName: "info",
  });

  const { data: approvalCount } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACTS.escrow.abi,
    functionName: "approvalCount",
  });

  const { data: hasApproved } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACTS.escrow.abi,
    functionName: "hasApproved",
    args: [userAddress],
  });

  // --- 2. FETCH DATA SUPABASE ---
  useEffect(() => {
    const fetchFullData = async () => {
      if (!contractAddress) return;
      const { data: pData } = await supabase.from("patungan").select("*").eq("contract_address", contractAddress).single();
      if (pData) {
        setPatungan(pData);
        const { data: metaData } = await supabase.from("patungan").select("target_participants").eq("id", pData.id).single();
        if (metaData) setTargetCount(metaData.target_participants);
        const { data: partData } = await supabase.from("patungan_participant").select("*, users!inner(email)").eq("patungan_id", pData.id);
        if (partData) setParticipants(partData);
      }
      setLoading(false);
    };
    fetchFullData();
  }, [contractAddress, isSuccess]);

  // --- 3. LOGIKA HITUNG TAGIHAN ---
  const calculateBill = () => {
    if (!patungan) return { base: 0, fee: 0, total: 0 };
    const baseAmount = patungan.target_amount / (targetCount || 1);
    const adminFee = Math.max(baseAmount * 0.01, 2000);
    return {
      base: Math.round(baseAmount),
      fee: Math.round(adminFee),
      total: Math.round(baseAmount + adminFee)
    };
  };

  const bill = calculateBill();

  // --- 4. ACTION HANDLERS ---
  const handlePayment = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACTS.escrow.abi,
      functionName: "deposit",
      args: [parseUnits(bill.base.toString(), 6), parseUnits(bill.fee.toString(), 6)],
    });
  };

  const handleVoteApproval = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACTS.escrow.abi,
      functionName: "voteApproval",
    });
  };

  // --- 5. LOGIKA BARU: EVENT LISTENER & SYNC ---
  useEffect(() => {
    const syncEverything = async () => {
      if (isSuccess && userAddress && patungan && receipt) {
        // A. Update Status Pembayaran User (Existing)
        const { data: userData } = await supabase.from("wallets").select("user_id").eq("wallet_address", userAddress.toLowerCase()).single();
        if (userData) {
          await supabase.from("patungan_participant").update({ status: "Paid", amount_paid: bill.base }).match({ patungan_id: patungan.id, user_id: userData.user_id });
          await supabase.from("patungan").update({ current_amount: patungan.current_amount + bill.base }).eq("id", patungan.id);
        }

        // B. DETEKSI PEMILIHAN VALIDATOR
        const valEvent = receipt.logs
          .map((log) => {
            try {
              return decodeEventLog({
                abi: CONTRACTS.escrow.abi,
                data: log.data,
                topics: log.topics,
              });
            } catch { return null; }
          })
          .find((e) => e?.eventName === "ValidatorsSelected");

        if (valEvent) {
          const selectedAddresses = (valEvent.args as any).selectedValidators;

          // Ambil UUID dari wallets untuk pendaftaran juri
          const { data: dbWallets } = await supabase
            .from("wallets")
            .select("user_id, wallet_address")
            .in("wallet_address", selectedAddresses.map((a: string) => a.toLowerCase()));

          if (dbWallets && dbWallets.length > 0) {
            const validatorEntries = dbWallets.map(w => ({
              patungan_id: patungan.id, // Menggunakan int8
              user_id: w.user_id,
              wallet_address: w.wallet_address,
              status: 'Pending'
            }));

            // Insert massal ke tabel baru
            const { error: valError } = await supabase.from("patungan_validators").insert(validatorEntries);
            if (!valError) console.log("✅ Juri terpilih didaftarkan otomatis!");
          }
        }
      }
    };
    syncEverything();
  }, [isSuccess, receipt]);

  // Mapping Status Contract
  const contractStatus = (contractInfo as any)?.[8] ?? 0;
  const isFunded = contractStatus === 1;
  const isDisbursed = contractStatus === 2;

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-dark-green">SYNC BLOCKCHAIN...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 text-dark-green">
      {/* Header Card */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-dark-green/5 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">{patungan?.title}</h1>
          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isDisbursed ? 'bg-accent-green text-milk' : 'bg-milk text-dark-green/40'}`}>
            {isDisbursed ? "Status: Cair" : isFunded ? "Status: Voting" : "Status: Aktif"}
          </span>
        </div>
        {/* Progress bar visual tetap sama seperti sebelumnya... */}
        <div className="flex justify-between items-end mb-4">
          <p className="text-lg font-black">{patungan?.current_amount.toLocaleString()} <span className="text-xs opacity-30">/ {patungan?.target_amount.toLocaleString()} IDRX</span></p>
          <span className="text-2xl font-black text-accent-green">{Math.round((patungan?.current_amount / patungan?.target_amount) * 100)}%</span>
        </div>
        <div className="w-full h-4 bg-milk rounded-full overflow-hidden p-1">
          <div className="h-full bg-accent-green rounded-full shadow-lg transition-all duration-1000" style={{ width: `${Math.min((patungan?.current_amount / patungan?.target_amount) * 100, 100)}%` }}></div>
        </div>
      </div>

      {/* Panel Voting (Hanya muncul jika status Funded) */}
      {(isFunded || isDisbursed) && (
        <div className="bg-accent-green rounded-[2.5rem] p-10 text-dark-green shadow-xl space-y-6 animate-in zoom-in duration-500">
           <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Persetujuan Validator</h2>
              <div className="bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black">SUARA: {Number(approvalCount || 0)} TERKUMPUL</div>
           </div>
           {!isDisbursed && (
             <button 
                onClick={handleVoteApproval}
                disabled={isConfirming || (hasApproved as boolean)}
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${(hasApproved as boolean) ? "bg-dark-green/10 text-dark-green/30" : "bg-dark-green text-milk hover:bg-black"}`}
             >
               {(hasApproved as boolean) ? "Anda Sudah Memberi Suara" : isConfirming ? "Memproses Suara..." : "Berikan Suara Setuju"}
             </button>
           )}
        </div>
      )}

      {/* Grid: Invoice & Partisipan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`bg-dark-green rounded-[2.5rem] p-10 text-milk space-y-6 transition-opacity ${isFunded || isDisbursed ? 'opacity-30' : 'opacity-100'}`}>
          <h2 className="text-[10px] font-black uppercase opacity-40">Invoice Patungan</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold uppercase"><span>Pokok</span><span>{bill.base.toLocaleString()}</span></div>
            <div className="flex justify-between text-xs font-bold uppercase"><span>Admin Fee</span><span>{bill.fee.toLocaleString()}</span></div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-2xl font-black text-accent-green"><span>TOTAL</span><span>{bill.total.toLocaleString()}</span></div>
          </div>
          {!isFunded && !isDisbursed && (
            <button onClick={handlePayment} disabled={isConfirming} className="w-full py-5 bg-accent-green text-dark-green rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all">
              {isConfirming ? "Proses Blockchain..." : "Bayar Sekarang"}
            </button>
          )}
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-dark-green/5 shadow-sm space-y-6">
          <h2 className="text-[10px] font-black uppercase opacity-40">Daftar Teman</h2>
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