"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { CONTRACTS } from "@/src/constants/contracts";
import { createClient } from "@/src/lib/supabase/client";

const supabase = createClient();

export default function ValidatorPage() {
  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 1. Ambil Tugas dari Supabase & Verifikasi ke Blockchain
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userAddress || !publicClient) return;

      try {
        // Query ke tabel patungan_validators menggunakan wallet address
        const { data: valData } = await supabase
          .from("patungan_validators")
          .select("*, patungan(*)") // Join dengan tabel patungan (int8)
          .eq("wallet_address", userAddress.toLowerCase())
          .eq("status", "Pending");

        if (valData) {
          const verifiedTasks = [];
          for (const item of valData) {
            // Cek status on-chain: Harus Funded (1) untuk bisa vote
            const info = await publicClient.readContract({
              address: item.patungan.contract_address as `0x${string}`,
              abi: CONTRACTS.escrow.abi,
              functionName: "info",
            }) as any;

            const approvalCount = await publicClient.readContract({
              address: item.patungan.contract_address as `0x${string}`,
              abi: CONTRACTS.escrow.abi,
              functionName: "approvalCount",
            });

            const totalValidators = 3; // Default atau bisa ambil dari array length on-chain

            verifiedTasks.push({
              ...item,
              onChainStatus: info[8],
              approvalCount: Number(approvalCount),
              totalValidators: totalValidators
            });
          }
          setTasks(verifiedTasks);
        }
      } catch (err) {
        console.error("Gagal memuat tugas validator:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [userAddress, publicClient, isSuccess]);

  // 2. Logika Vote Approval
  const handleApprove = (contractAddr: string) => {
    writeContract({
      address: contractAddr as `0x${string}`,
      abi: CONTRACTS.escrow.abi,
      functionName: "voteApproval",
    });
  };

  // 3. Update Status di Supabase setelah Sukses Vote
  useEffect(() => {
    const updateValStatus = async () => {
      if (isSuccess && userAddress) {
        await supabase
          .from("patungan_validators")
          .update({ status: "Approved" })
          .match({ wallet_address: userAddress.toLowerCase() });
      }
    };
    updateValStatus();
  }, [isSuccess]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-dark-green uppercase">Memindai Tugas...</div>;

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase leading-none">Panel Validator</h1>
        <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-3">Gunakan hak suara Anda untuk memverifikasi pencairan dana.</p>
      </div>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id} className="mb-10 bg-white rounded-[2.5rem] border border-dark-green/5 shadow-2xl overflow-hidden text-dark-green">
            <div className="p-8 bg-accent-green/5 border-b border-accent-green/10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-accent-green/20 flex items-center justify-center text-3xl">
                  <i className="fas fa-shield-halved text-accent-green" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{task.patungan.title}</h3>
                  <p className="text-[10px] font-black text-accent-green uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent-green rounded-full animate-ping" />
                    Menunggu Suara Anda
                  </p>
                </div>
              </div>
              <div className="text-right bg-dark-green p-5 rounded-2xl text-milk border border-white/5 shadow-xl">
                <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">Jumlah Pencairan</p>
                <p className="text-2xl font-black tracking-tighter leading-none">{task.patungan.target_amount.toLocaleString()} IDRX</p>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-dark-green/80 uppercase tracking-[0.2em] ml-1">Detail Pengeluaran</label>
                    <p className="text-sm font-bold text-dark-green/80 mt-4 leading-relaxed bg-milk p-6 rounded-2xl border-l-4 border-accent-green">
                      {task.patungan.description}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-dark-green/80 uppercase tracking-[0.2em] ml-1">Bukti Kuitansi (On-Chain)</label>
                    <Link href={`/dashboard/patungan/${task.patungan.contract_address}`} className="group relative aspect-video bg-milk mt-4 rounded-[2rem] flex flex-col items-center justify-center text-dark-green/20 border-2 border-dashed border-dark-green/10 hover:border-accent-green hover:text-accent-green transition-all cursor-pointer overflow-hidden">
                      <i className="fas fa-file-invoice-dollar text-4xl mb-3 transition group-hover:scale-110" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">Lihat Detail Kontrak & Bukti</span>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col mt-10 space-y-10">
                  <div className="bg-milk p-8 rounded-[2rem] border border-dark-green/5">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-black text-dark-green/80 uppercase tracking-[0.2em]">Status Konsensus</label>
                      <span className="text-xl font-black text-accent-green">{task.approvalCount}/{task.totalValidators}</span>
                    </div>
                    <div className="w-full bg-dark-green/5 h-5 rounded-full overflow-hidden p-1 mb-4 shadow-inner">
                      <div className="bg-accent-green h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(18,183,106,0.4)]" style={{ width: `${(task.approvalCount / task.totalValidators) * 100}%` }} />
                    </div>
                    <p className="text-[11px] font-bold text-deep-gray uppercase tracking-tight leading-relaxed">Verifikasi Anda diperlukan agar dana dapat otomatis cair ke wallet tujuan.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => handleApprove(task.patungan.contract_address)}
                      disabled={isConfirming}
                      className="flex-1 py-5 bg-accent-green text-milk rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition active:scale-95 flex items-center justify-center gap-3"
                    >
                      <i className="fas fa-check-circle text-sm" />
                      {isConfirming ? "Memproses Suara..." : "Setujui Pencairan"}
                    </button>
                    <Link href={`/dashboard/validator/laporkan/${task.patungan.id}`} className="flex-1 py-5 bg-white border border-red-200 text-red-500 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-red-50 transition active:scale-95">
                      Tolak / Laporkan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-dark-green/10">
          <p className="text-[10px] font-black text-dark-green/30 uppercase tracking-[0.3em]">Tidak ada tugas verifikasi untuk saat ini.</p>
        </div>
      )}

      <div className="mt-10 p-6 bg-dark-green rounded-2xl text-center">
        <p className="text-[10px] font-bold text-milk/70 uppercase tracking-[0.2em]">
          <i className="fas fa-info-circle mr-2 text-accent-green" />
          Suara Anda direkam secara permanen di blockchain untuk menjamin transparansi.
        </p>
      </div>
    </>
  );
}