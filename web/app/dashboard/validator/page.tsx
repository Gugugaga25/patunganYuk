"use client";

import React, { useEffect, useState, useRef } from "react";
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
  
  // --- GUARD: Mencegah Duplikasi & Rate Limit ---
  const isUpdatingDB = useRef(false);
  const [lastVotedContract, setLastVotedContract] = useState<string | null>(null);

  const { data: hash, writeContract, error: voteError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 1. Ambil Tugas & Verifikasi Paralel (Optimasi Kecepatan)
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userAddress || !publicClient) return;

      try {
        console.log("🔍 Memindai tugas validator untuk:", userAddress);
        const { data: valData } = await supabase
          .from("patungan_validators")
          .select("*, patungan(*)")
          .eq("wallet_address", userAddress.toLowerCase())
          .eq("status", "Pending");

        if (valData && valData.length > 0) {
          // GUNAKAN Promise.all: Menjalankan semua RPC secara paralel agar tidak Rate Limit
          const verifiedTasks = await Promise.all(valData.map(async (item) => {
            try {
              const [info, approvalCount] = await Promise.all([
                publicClient.readContract({
                  address: item.patungan.contract_address as `0x${string}`,
                  abi: CONTRACTS.escrow.abi,
                  functionName: "info",
                }),
                publicClient.readContract({
                  address: item.patungan.contract_address as `0x${string}`,
                  abi: CONTRACTS.escrow.abi,
                  functionName: "approvalCount",
                })
              ]);

              return {
                ...item,
                onChainStatus: (info as any)[8],
                approvalCount: Number(approvalCount),
                totalValidators: 3 // Bisa disesuaikan dengan logika kontrak
              };
            } catch (rpcErr) {
              console.error("RPC Error untuk kontrak:", item.patungan.contract_address, rpcErr);
              return { ...item, onChainStatus: 0, approvalCount: 0, totalValidators: 3, error: true };
            }
          }));

          setTasks(verifiedTasks.filter(t => !t.error));
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Gagal memuat tugas validator:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [userAddress, publicClient, isSuccess]);

  // 2. Logika Vote: Simpan contract mana yang sedang divote
  const handleApprove = (contractAddr: string) => {
    setLastVotedContract(contractAddr); // Simpan target agar update DB tidak "nyasar"
    writeContract({
      address: contractAddr as `0x${string}`,
      abi: CONTRACTS.escrow.abi,
      functionName: "voteApproval",
    });
  };

  // 3. Update Status Spesifik (Bukan Global)
  useEffect(() => {
    const updateValStatus = async () => {
      // Pastikan hanya jalan SEKALI per sukses dan target kontrak jelas
      if (isSuccess && userAddress && lastVotedContract && !isUpdatingDB.current) {
        console.log("💾 Menandai tugas sebagai 'Approved' di Database...");
        isUpdatingDB.current = true;

        const { error } = await supabase
          .from("patungan_validators")
          .update({ status: "Approved" })
          .match({ 
            wallet_address: userAddress.toLowerCase(),
            patungan_id: tasks.find(t => t.patungan.contract_address === lastVotedContract)?.patungan.id // Gunakan ID spesifik (int8)
          });

        if (!error) {
          console.log("✅ Database Sinkron!");
          setLastVotedContract(null);
        }
        isUpdatingDB.current = false;
      }
    };
    updateValStatus();
  }, [isSuccess, lastVotedContract]);

  useEffect(() => {
    if (voteError) console.error("❌ Gagal memberikan suara:", voteError.message);
  }, [voteError]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-dark-green uppercase tracking-widest">Memindai Tugas Blockchain...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-dark-green tracking-tighter uppercase leading-none">
          Panel <span className="text-accent-green">Validator</span>
        </h1>
        <p className="text-[10px] text-deep-gray font-bold uppercase tracking-[0.3em] mt-4 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-accent-green"></span>
          Gunakan hak suara Anda untuk transparansi komunitas
        </p>
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-8">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-[3rem] border border-dark-green/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group">
              {/* Header Task */}
              <div className="p-10 bg-milk/50 border-b border-dark-green/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-accent-green/10 flex items-center justify-center text-4xl text-accent-green group-hover:rotate-6 transition-transform">
                    <i className="fas fa-shield-halved" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{task.patungan.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex h-2 w-2 rounded-full bg-accent-green animate-ping"></span>
                      <p className="text-[10px] font-black text-accent-green uppercase tracking-widest">Aksi Diperlukan</p>
                    </div>
                  </div>
                </div>
                <div className="bg-dark-green px-8 py-6 rounded-[2rem] text-milk shadow-2xl border border-white/5 relative overflow-hidden min-w-[200px]">
                  <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em] mb-1">Target Cair</p>
                  <p className="text-2xl font-black tracking-tighter">{task.patungan.target_amount.toLocaleString()} <span className="text-[10px] opacity-50">IDRX</span></p>
                  <i className="fas fa-coins absolute -right-4 -bottom-4 text-6xl opacity-10 -rotate-12"></i>
                </div>
              </div>

              {/* Body Task */}
              <div className="p-10 md:p-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div>
                      <label className="text-[9px] font-black text-dark-green/30 uppercase tracking-[0.3em] block mb-4">Informasi Kegiatan</label>
                      <div className="bg-milk p-8 rounded-[2rem] border-l-8 border-accent-green shadow-inner">
                        <p className="text-sm font-bold text-dark-green/70 leading-relaxed uppercase">
                          {task.patungan.description || "Tidak ada deskripsi tambahan."}
                        </p>
                      </div>
                    </div>
                    
                    <Link href={`/dashboard/patungan/${task.patungan.contract_address}`} 
                      className="flex items-center justify-between p-6 bg-white border border-dark-green/10 rounded-2xl hover:border-accent-green group/link transition-all">
                      <div className="flex items-center gap-4">
                        <i className="fas fa-file-contract text-2xl text-dark-green/20 group-hover/link:text-accent-green" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Buka Detail Kontrak Utama</span>
                      </div>
                      <i className="fas fa-arrow-right text-xs opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-2 transition-all" />
                    </Link>
                  </div>

                  <div className="flex flex-col justify-between space-y-12">
                    <div className="bg-milk p-10 rounded-[2.5rem] border border-dark-green/5 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <label className="text-[10px] font-black text-dark-green/60 uppercase tracking-[0.2em]">Konsensus Validator</label>
                        <span className="text-2xl font-black text-accent-green">{task.approvalCount} / {task.totalValidators}</span>
                      </div>
                      <div className="w-full bg-dark-green/5 h-6 rounded-full overflow-hidden p-1.5 mb-6 shadow-inner">
                        <div className="bg-accent-green h-full rounded-full transition-all duration-1000 shadow-lg" 
                          style={{ width: `${(task.approvalCount / task.totalValidators) * 100}%` }} />
                      </div>
                      <p className="text-[11px] font-bold text-deep-gray uppercase tracking-wide leading-relaxed italic">
                        "Pencairan dana hanya bisa dilakukan jika suara mayoritas tercapai di blockchain."
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => handleApprove(task.patungan.contract_address)}
                        disabled={isConfirming}
                        className="flex-[2] py-6 bg-accent-green text-milk rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-dark-green transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        <i className={`fas ${isConfirming ? 'fa-circle-notch animate-spin' : 'fa-check-circle'}`} />
                        {isConfirming ? "Memperbarui Blockchain..." : "Berikan Persetujuan"}
                      </button>
                      <button className="flex-1 py-6 bg-white border border-red-100 text-red-400 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-50 transition-all active:scale-95">
                        Laporkan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-dark-green/5 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-milk rounded-full flex items-center justify-center text-dark-green/10 text-4xl">
            <i className="fas fa-clipboard-check" />
          </div>
          <p className="text-[11px] font-black text-dark-green/30 uppercase tracking-[0.4em]">Belum ada tugas verifikasi untuk Anda.</p>
        </div>
      )}
    </div>
  );
}
