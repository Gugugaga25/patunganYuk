"use client";

import React, { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { CONTRACTS } from "@/src/constants/contracts"; // Pastikan file constants sudah as const
import { parseUnits, decodeEventLog } from "viem";
import { createClient } from "@/src/lib/supabase/client"; // Menggunakan client.ts milikmu

const supabase = createClient();

export default function BuatPatunganPage() {
  const { address: userAddress } = useAccount();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    target: "",
    deadline: "",
    recipient: "",
  });

  // Hook untuk berinteraksi dengan Blockchain
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // Menunggu konfirmasi transaksi (Receipt) untuk mendapatkan alamat kontrak baru
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // SINKRONISASI KE SUPABASE SAAT TRANSAKSI BERHASIL
  useEffect(() => {
    const syncToSupabase = async () => {
      if (isSuccess && receipt) {
        try {
          // Decode logs untuk mendapatkan 'roomAddress' dari event RoomCreated
          const event = receipt.logs
            .map((log) => {
              try {
                return decodeEventLog({
                  abi: CONTRACTS.factory.abi,
                  data: log.data,
                  topics: log.topics,
                });
              } catch {
                return null;
              }
            })
            .find((e) => e?.eventName === "RoomCreated");

          const roomAddress = (event?.args as any)?.roomAddress;

          if (roomAddress) {
            // Simpan ke tabel 'patungan' sesuai skema databasemu
            const { error: sbError } = await supabase.from("patungan").insert([
              {
                title: formData.title,
                description: formData.category, // Kategori disimpan di kolom description
                target_amount: parseFloat(formData.target),
                current_amount: 0,
                currency: "IDRX",
                status: "ACTIVE",
                deadline: new Date(formData.deadline).toISOString(),
                contract_address: roomAddress, // Alamat kontrak unik dari blockchain
                recipient: formData.recipient, // Kolom baru dari SQL Query
                creator_address: userAddress, // Alamat wallet pembuat
              },
            ]);

            if (sbError) throw sbError;
            console.log("Kamar Patungan berhasil didaftarkan ke Database!");
          }
        } catch (err) {
          console.error("Gagal sinkronisasi ke Supabase:", err);
        }
      }
    };

    syncToSupabase();
  }, [isSuccess, receipt, userAddress]);

  const handleDeploy = () => {
    if (!formData.deadline || !formData.target || !formData.recipient) {
      return alert("Lengkapi data form terlebih dahulu, Capt!");
    }

    // Hitung durasi dalam detik untuk Smart Contract
    const deadlineDate = new Date(formData.deadline).getTime();
    const durationInSeconds = Math.floor((deadlineDate - Date.now()) / 1000);

    if (durationInSeconds <= 0) return alert("Batas waktu harus di masa depan!");

    writeContract({
      address: CONTRACTS.factory.address,
      abi: CONTRACTS.factory.abi,
      functionName: "createRoom",
      args: [
        formData.title,
        formData.recipient as `0x${string}`,
        CONTRACTS.idrx.address,
        parseUnits(formData.target, 6), // Konversi ke unit IDRX (6 desimal)
        BigInt(durationInSeconds),
      ],
    });
  };

  return (
    <>
      <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(12%) sepia(21%) saturate(1000%) hue-rotate(110deg);
          cursor: pointer;
        }
      `}</style>

      {/* Header Halaman */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase">Buat Patungan Baru</h1>
        <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-2">Dana aman terkelola otomatis oleh Smart Contract.</p>
      </div>

      {/* Form Utama */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-dark-green/5 shadow-sm space-y-10 text-dark-green">
        <div className="space-y-6">
          {/* Baris 1: Nama & Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green/70 uppercase tracking-[0.2em] ml-1">Nama Kegiatan</label>
              <input type="text" placeholder="MISAL: SEWA LAPANGAN" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-milk border border-dark-green/10 rounded-2xl p-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-accent-green/20" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green/70 uppercase tracking-[0.2em] ml-1">Kategori</label>
              <input type="text" placeholder="MISAL: HOBI" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-milk border border-dark-green/10 rounded-2xl p-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-accent-green/20" />
            </div>
          </div>

          {/* Baris 2: Target Dana & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green/70 uppercase tracking-[0.2em] ml-1">Target Dana (IDRX)</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-[11px] font-black text-dark-green/30">IDRX</span>
                <input type="number" placeholder="0" value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} className="w-full bg-milk border border-dark-green/10 rounded-2xl p-4 pl-12 text-[11px] font-black outline-none focus:ring-2 focus:ring-accent-green/20" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green/70 uppercase tracking-[0.2em] ml-1">Batas Waktu (Deadline)</label>
              <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="w-full bg-milk border border-dark-green/10 rounded-2xl p-4 text-[11px] font-black outline-none focus:ring-2 focus:ring-accent-green/20" />
            </div>
          </div>
        </div>

        {/* Seksi Rekening Pencairan */}
        <div className="bg-accent-green/5 rounded-[2rem] p-8 border border-accent-green/10 relative overflow-hidden group">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-10">
            <span className="w-10 h-10 bg-white text-accent-green rounded-xl flex items-center justify-center shadow-sm">
              <i className="fas fa-university" />
            </span>
            Wallet Pencairan Dana
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            <div className="md:col-span-12 space-y-2">
              <label className="text-[9px] font-black text-accent-green uppercase tracking-widest ml-1">Alamat Wallet Penerima</label>
              <input type="text" placeholder="0x..." value={formData.recipient} onChange={(e) => setFormData({ ...formData, recipient: e.target.value })} className="w-full bg-white border-none rounded-xl p-4 text-[11px] font-black shadow-sm outline-none focus:ring-2 focus:ring-accent-green/20" />
            </div>
          </div>
        </div>

        {/* Tombol Deploy */}
        <div className="pt-4">
          <button onClick={handleDeploy} disabled={isPending || isConfirming} className="group w-full py-6 bg-dark-green text-milk rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-60">
            <span>{isPending || isConfirming ? "Memproses Blockchain..." : "Deploy ke Blockchain"}</span>
            <i className={`fa-solid fa-cube ${isPending || isConfirming ? "animate-spin" : "animate-pulse"} text-accent-green`} />
          </button>

          {isSuccess && (
            <div className="mt-6 p-4 bg-accent-green/10 rounded-2xl text-center border border-accent-green/20">
              <p className="text-[10px] font-black text-accent-green uppercase tracking-widest">🎉 Sukses! Patungan diaktifkan & disimpan ke database.</p>
            </div>
          )}

          {error && <p className="text-center text-[9px] font-bold text-red-500 uppercase tracking-widest mt-4">❌ Gagal: {error.message.split(".")[0]}</p>}
        </div>
      </div>
    </>
  );
}
