"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
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
  const [currentAction, setCurrentAction] = useState<"none" | "approving" | "depositing">("none");

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // --- 1. FUNGSI FETCH DATA (DIPINDAH KELUAR AGAR BISA DIPANGGIL ULANG) ---
  const fetchFullData = useCallback(async () => {
    if (!contractAddress) return;

    const { data: pData } = await supabase.from("patungan").select("*").eq("contract_address", contractAddress).single();

    if (pData) {
      setPatungan(pData);

      const { data: metaData } = await supabase.from("patungan").select("target_participants").eq("id", pData.id).single();
      if (metaData) setTargetCount(metaData.target_participants);

      const { data: partData } = await supabase.from("patungan_participants").select("*, users!inner(email)").eq("patungan_id", pData.id);
      if (partData) setParticipants(partData);
    }
    setLoading(false);
  }, [contractAddress]);

  // Initial Fetch
  useEffect(() => {
    fetchFullData();
  }, [fetchFullData]);

  // --- 2. LOGIKA HITUNG TAGIHAN (TETAP SAMA) ---
  const calculateBill = () => {
    if (!patungan) return { base: 0, fee: 0, total: 0 };
    const baseAmount = patungan.target_amount / (targetCount || 1);
    const percentageFee = baseAmount * 0.01;
    const adminFee = Math.max(percentageFee, 2000);

    return {
      base: Math.round(baseAmount),
      fee: Math.round(adminFee),
      total: Math.round(baseAmount + adminFee),
    };
  };

  const bill = calculateBill();

  // --- 3. LOGIKA BLOCKCHAIN READ (ALLOWANCE) ---
  const { data: allowance, refetch: reloadAllowance } = useReadContract({
    address: CONTRACTS.idrx.address as `0x${string}`,
    abi: CONTRACTS.idrx.abi,
    functionName: "allowance",
    args: [userAddress, contractAddress],
  });

  const totalRequired = parseUnits((bill.base + bill.fee).toString(), 6);
  const needsApprove = !allowance || (allowance as bigint) < totalRequired;

  // --- 4. HANDLERS ---
  const handleApprove = () => {
    setCurrentAction("approving");
    const totalAmount = bill.base + bill.fee;
    writeContract({
      address: CONTRACTS.idrx.address as `0x${string}`,
      abi: CONTRACTS.idrx.abi,
      functionName: "approve",
      args: [contractAddress as `0x${string}`, parseUnits(totalAmount.toString(), 6)],
    });
  };

  const handlePayment = () => {
    setCurrentAction("depositing");
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACTS.escrow.abi,
      functionName: "deposit",
      args: [parseUnits(bill.base.toString(), 6), parseUnits(bill.fee.toString(), 6)],
    });
  };

  // --- 5. SINGLE SYNC LOGIC (ANTI TUMPANG TINDIH) ---
  useEffect(() => {
    const syncData = async () => {
      if (!isSuccess || !userAddress || !patungan) return;

      // KASUS 1: Sukses Approve
      if (currentAction === "approving") {
        await reloadAllowance();
        setCurrentAction("none");
        return;
      }

      // KASUS 2: Sukses Deposit
      if (currentAction === "depositing") {
        try {
          const { data: userData } = await supabase.from("wallets").select("user_id").eq("wallet_address", userAddress.toLowerCase()).single();

          if (userData) {
            // Update Status Peserta
            await supabase.from("patungan_participant").update({ status: "Paid", amount_paid: bill.base }).match({ patungan_id: patungan.id, user_id: userData.user_id });

            // Update Progres Total
            await supabase
              .from("patungan")
              .update({ current_amount: patungan.current_amount + bill.base })
              .eq("id", patungan.id);

            alert("Pembayaran Berhasil!");
            setCurrentAction("none");
            fetchFullData(); // Refresh UI otomatis
          }
        } catch (err) {
          console.error("Gagal Sinkronasi:", err);
        }
      }
    };

    syncData();
  }, [isSuccess, currentAction, userAddress, patungan, bill.base, fetchFullData, reloadAllowance]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse">MEMBUKA BRANKAS...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 text-dark-green">
      <div className="bg-white rounded-[2.5rem] p-10 border border-dark-green/5 shadow-sm">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">{patungan?.title}</h1>
        <div className="flex justify-between items-end mb-4">
          <p className="text-lg font-black">
            {patungan?.current_amount.toLocaleString()} <span className="text-xs opacity-30">/ {patungan?.target_amount.toLocaleString()} IDRX</span>
          </p>
          <span className="text-2xl font-black text-accent-green">{Math.round((patungan?.current_amount / patungan?.target_amount) * 100)}%</span>
        </div>
        <div className="w-full h-4 bg-milk rounded-full overflow-hidden p-1">
          <div className="h-full bg-accent-green rounded-full shadow-lg shadow-accent-green/20 transition-all duration-1000" style={{ width: `${(patungan?.current_amount / patungan?.target_amount) * 100}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <button onClick={needsApprove ? handleApprove : handlePayment} disabled={isConfirming} className="w-full py-5 bg-accent-green text-dark-green rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50">
            {isConfirming ? "Proses Transaksi..." : needsApprove ? "Langkah 1: Setujui IDRX" : "Langkah 2: Bayar Sekarang"}
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-dark-green/5 shadow-sm space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Daftar Teman</h2>
          <div className="space-y-4">
            {participants.map((p, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-milk rounded-2xl">
                <span className="text-[10px] font-black uppercase">{p.users?.email.split("@")[0]}</span>
                <span className={`text-[8px] font-black px-2 py-1 rounded-full ${p.status === "Paid" ? "bg-accent-green text-milk" : "bg-dark-green/10 opacity-30"}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
