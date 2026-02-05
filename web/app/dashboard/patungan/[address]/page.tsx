"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
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
  const [currentAction, setCurrentAction] =
    useState<"none" | "approving" | "depositing">("none");

  const [showDetailBayar, setShowDetailBayar] = useState(false);
  const [showPopupTotal, setShowPopupTotal] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  /* =======================
     ON-CHAIN BALANCE
  ======================== */
  const { data: onChainBalance, refetch: refetchBalance } =
    useReadContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACTS.escrow.abi,
      functionName: "getCurrentBalance",
      query: { refetchInterval: 15000 },
    });

  const formattedOnChainBalance = onChainBalance
    ? Number(formatUnits(onChainBalance as bigint, 6))
    : 0;

  /* =======================
     FETCH DATA SUPABASE
  ======================== */
  const fetchFullData = useCallback(async () => {
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

      const { data: partData } = await supabase
        .from("patungan_participants")
        .select("*, users!inner(email)")
        .eq("patungan_id", pData.id);

      if (partData) setParticipants(partData);
    }

    setLoading(false);
  }, [contractAddress]);

  useEffect(() => {
    fetchFullData();
  }, [fetchFullData]);

  /* =======================
     BILL LOGIC
  ======================== */
  const bill = (() => {
    if (!patungan) return { base: 0, fee: 0, total: 0 };
    const baseAmount = patungan.target_amount / (targetCount || 1);
    const percentageFee = baseAmount * 0.01;
    const adminFee = Math.max(percentageFee, 2000);

    return {
      base: Math.round(baseAmount),
      fee: Math.round(adminFee),
      total: Math.round(baseAmount + adminFee),
    };
  })();

  /* =======================
     ALLOWANCE CHECK
  ======================== */
  const { data: allowance, refetch: reloadAllowance } =
    useReadContract({
      address: CONTRACTS.idrx.address as `0x${string}`,
      abi: CONTRACTS.idrx.abi,
      functionName: "allowance",
      args: [userAddress, contractAddress],
    });

  const totalRequired = parseUnits(bill.total.toString(), 6);
  const needsApprove =
    !allowance || (allowance as bigint) < totalRequired;

  /* =======================
     HANDLERS
  ======================== */
  const handleApprove = () => {
    setCurrentAction("approving");
    writeContract({
      address: CONTRACTS.idrx.address as `0x${string}`,
      abi: CONTRACTS.idrx.abi,
      functionName: "approve",
      args: [contractAddress as `0x${string}`, totalRequired],
    });
  };

  const handlePayment = () => {
    setCurrentAction("depositing");
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACTS.escrow.abi,
      functionName: "deposit",
      args: [
        parseUnits(bill.base.toString(), 6),
        parseUnits(bill.fee.toString(), 6),
      ],
    });
  };

  /* =======================
     SYNC AFTER SUCCESS
  ======================== */
  useEffect(() => {
    const syncData = async () => {
      if (!isSuccess || !userAddress || !patungan) return;

      if (currentAction === "approving") {
        await reloadAllowance();
        setCurrentAction("none");
      }

      if (currentAction === "depositing") {
        const { data: userData } = await supabase
          .from("wallets")
          .select("user_id")
          .eq("wallet_address", userAddress.toLowerCase())
          .single();

        if (userData) {
          await supabase
            .from("patungan_participants")
            .update({
              status: "Paid",
              amount_paid: bill.base,
            })
            .match({
              patungan_id: patungan.id,
              user_id: userData.user_id,
            });

          await supabase
            .from("patungan")
            .update({
              current_amount:
                patungan.current_amount + bill.base,
            })
            .eq("id", patungan.id);

          refetchBalance();
          fetchFullData();
        }

        setCurrentAction("none");
      }
    };

    syncData();
  }, [isSuccess]);

  if (loading)
    return (
      <div className="p-20 text-center font-black animate-pulse">
        MEMBUKA BRANKAS...
      </div>
    );

  /* =======================
     UI (MODERN LAYOUT)
  ======================== */
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-8">

          {/* INFO */}
          <div className="bg-white rounded-[2.5rem] p-10 border shadow-sm">
            <h1 className="text-3xl font-black uppercase mb-6">
              {patungan?.title}
            </h1>

            <p className="text-sm font-bold mb-4">
              Saldo Smart Contract:
              <span className="text-accent-green ml-2">
                {formattedOnChainBalance.toLocaleString()} IDRX
              </span>
            </p>

            {/* Progress */}
            <div className="w-full bg-milk h-4 rounded-full p-1">
              <div
                className="bg-accent-green h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    (formattedOnChainBalance /
                      patungan.target_amount) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* PAYMENT */}
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm sticky top-24">
            <h2 className="text-lg font-black uppercase mb-6">
              Bayar Patungan
            </h2>

            <p className="text-2xl font-black text-accent-green mb-6">
              {bill.total.toLocaleString()} IDRX
            </p>

            <button
              onClick={
                needsApprove ? handleApprove : handlePayment
              }
              disabled={isConfirming}
              className="w-full bg-dark-green text-milk py-4 rounded-full font-black uppercase"
            >
              {isConfirming
                ? "Proses..."
                : needsApprove
                ? "Setujui IDRX"
                : "Bayar Sekarang"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
