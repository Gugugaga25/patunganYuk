"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { CONTRACTS } from "@/src/constants/contracts";
import { parseUnits, decodeEventLog } from "viem";
import { createClient } from "@/src/lib/supabase/client";

const supabase = createClient();

export default function BuatPatunganPage() {
  const { address: userAddress } = useAccount();
  
  // --- LOGIKA ANTI DOUBLE CLICK (REF LOCK) ---
  const isSyncingRef = useRef(false);

  const [formData, setFormData] = useState({
    title: "",
    target_participants: "", 
    target: "",
    deadline: "",
    recipient: "",
    description: "",
  });

  const [participantInput, setParticipantInput] = useState("");
  const [invitedParticipants, setInvitedParticipants] = useState<{user_id: string, email: string}[]>([]);

  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // --- LOGIKA: CARI USER VIA EMAIL ---
  const addParticipant = async () => {
    if (!participantInput.includes("@")) {
      return alert("Masukkan format email yang valid, Capt!");
    }

    const searchEmail = participantInput.toLowerCase().trim();

    const { data: userData, error: userError } = await supabase
      .from("users") 
      .select("id, email")
      .ilike("email", searchEmail) // Case-insensitive lookup
      .single();

    if (userError || !userData) {
      return alert("User tidak ditemukan di sistem!");
    }

    if (invitedParticipants.some(p => p.user_id === userData.id)) {
      return alert("Sudah ada di daftar!");
    }

    setInvitedParticipants(prev => [...prev, { user_id: userData.id, email: userData.email }]);
    setParticipantInput("");
  };

  // --- LOGIKA: SINKRONISASI TUNGGAL (VERSI CLEAN SCHEMA) ---
  useEffect(() => {
    const syncToSupabase = async () => {
      // Validasi: Berhasil, Ada Receipt, dan Belum Terkunci
      if (isSuccess && receipt && userAddress && !isSyncingRef.current) {
        isSyncingRef.current = true; 

        try {
          const event = receipt.logs
            .map((log) => {
              try {
                return decodeEventLog({
                  abi: CONTRACTS.factory.abi,
                  data: log.data,
                  topics: log.topics,
                });
              } catch { return null; }
            })
            .find((e) => e?.eventName === "RoomCreated");

          const roomAddress = (event?.args as any)?.roomAddress;

          if (roomAddress) {
            // 1. Insert ke Tabel Patungan (Hanya kolom yang ada di tabel kamu)
            const { data: newPatungan, error: sbError } = await supabase
              .from("patungan")
              .insert([{
                title: formData.title,
                description: formData.description,
                target_amount: parseFloat(formData.target),
                current_amount: 0,
                currency: "IDRX",
                status: "ACTIVE",
                deadline: new Date(formData.deadline).toISOString(),
                contract_address: roomAddress, // Ini adalah kunci utama pelacakan
                recipient: formData.recipient,
                creator_address: userAddress.toLowerCase(),
                target_participants: formData.target_participants ? parseInt(formData.target_participants) : null,
              }])
              .select().single();

            if (sbError) throw sbError;

            // 2. Insert Massal ke Peserta (Termasuk UUID dari email)
            if (invitedParticipants.length > 0) {
              const participantData = invitedParticipants.map(p => ({
                patungan_id: newPatungan.id,
                user_id: p.user_id,
                status: "Invited",
                amount_paid: 0
              }));

              const { error: pError } = await supabase
                .from("patungan_participant")
                .insert(participantData);
              
              if (pError) throw pError;
            }

            alert("🚀 Misi Sukses! Patungan Terdaftar.");
          }
        } catch (err: any) {
          // Tampilkan pesan error spesifik jika masih gagal
          console.error("Gagal sync:", err.message || err);
          isSyncingRef.current = false; 
        }
      }
    };
    syncToSupabase();
  }, [isSuccess, receipt, userAddress]);

  const handleDeploy = () => {
    if (!formData.deadline || !formData.target || !formData.recipient) {
      return alert("Lengkapi data form dulu!");
    }
    const duration = Math.floor((new Date(formData.deadline).getTime() - Date.now()) / 1000);
    if (duration <= 0) return alert("Deadline harus di masa depan!");

    writeContract({
      address: CONTRACTS.factory.address,
      abi: CONTRACTS.factory.abi,
      functionName: "createRoom",
      args: [formData.title, formData.recipient as `0x${string}`, CONTRACTS.idrx.address, parseUnits(formData.target, 6), BigInt(duration)],
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(12%) sepia(21%) saturate(1000%) hue-rotate(110deg);
          cursor: pointer;
        }
      `}</style>

      {/* Header Halaman Sesuai Style Kamu */}
      <div className="mb-12">
        <h1 className="text-5xl font-black text-dark-green tracking-tighter uppercase leading-none">
          Buat Patungan <span className="text-accent-green">Baru</span>
        </h1>
        <p className="text-[10px] text-deep-gray font-bold uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
          <span className="w-8 h-[1px] bg-accent-green"></span>
          Dana aman terkelola otomatis oleh Smart Contract
        </p>
      </div>

      <div className="space-y-8">
        {/* SEKSI 01: Informasi Dasar */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-dark-green/5 shadow-sm space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-dark-green text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">01</span>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-dark-green/50">Informasi Dasar</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green uppercase tracking-widest ml-1">Nama Kegiatan</label>
              <input type="text" placeholder="MISAL: SEWA LAPANGAN" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-milk border border-dark-green/10 rounded-2xl p-4 text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-accent-green/20" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green uppercase tracking-widest ml-1">Target Partisipan</label>
              <input type="number" placeholder="MISAL: 10" value={formData.target_participants} onChange={(e) => setFormData({ ...formData, target_participants: e.target.value })} className="w-full bg-milk border border-dark-green/10 rounded-2xl p-4 text-[11px] font-black outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green uppercase tracking-widest ml-1">Target Dana (IDRX)</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-[11px] font-black text-dark-green/30">IDRX</span>
                <input type="number" placeholder="0" value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} className="w-full bg-milk border border-dark-green/10 rounded-2xl p-4 pl-12 text-[11px] font-black outline-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-dark-green uppercase tracking-widest ml-1">Deadline</label>
              <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="w-full bg-milk border border-dark-green/10 rounded-2xl p-4 text-[11px] font-black outline-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-dark-green uppercase tracking-widest ml-1">Detail Kegiatan</label>
            <textarea rows={3} placeholder="JELASKAN DETAIL..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-milk border border-dark-green/10 rounded-3xl p-5 text-[11px] font-black uppercase outline-none resize-none" />
          </div>
        </section>

        {/* SEKSI 02: Manajemen Peserta */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-dark-green/5 shadow-sm space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-dark-green text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">02</span>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-dark-green/50">Manajemen Peserta</h2>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-dark-green uppercase tracking-tighter">Undang Teman Kamu</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="email" value={participantInput} onChange={(e) => setParticipantInput(e.target.value)} className="flex-1 p-4 bg-milk border border-dark-green/10 text-[11px] font-black uppercase rounded-2xl outline-none" placeholder="CARI BERDASARKAN EMAIL..." />
              <button onClick={addParticipant} className="h-[52px] px-8 text-white bg-dark-green hover:bg-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">
                Cari User
              </button>
            </div>

            {/* List Visual Peserta Terpilih */}
            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-black text-dark-green uppercase ml-1 flex justify-between items-center">
                <span>Daftar Peserta Terpilih</span>
                <span className="text-accent-green">{invitedParticipants.length} / {formData.target_participants || "∞"}</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {invitedParticipants.length > 0 ? (
                  invitedParticipants.map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-milk rounded-xl border border-dark-green/5">
                      <span className="text-[10px] font-black text-dark-green/60 uppercase">{p.email}</span>
                      <button onClick={() => setInvitedParticipants(invitedParticipants.filter((_, idx) => idx !== i))} className="text-red-400">
                        <i className="fas fa-times-circle"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full min-h-[160px] bg-milk/50 border-2 border-dashed border-dark-green/10 rounded-[2rem] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-dark-green/5 rounded-full flex items-center justify-center mb-3">
                      <i className="fa-solid fa-users text-dark-green/20"></i>
                    </div>
                    <p className="text-[9px] font-bold text-dark-green/30 uppercase tracking-[0.2em]">Tambahkan teman kamu menggunakan email.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SEKSI 03: Wallet Penerima */}
        <section className="bg-accent-green/5 rounded-[2.5rem] p-8 md:p-10 border border-accent-green/10 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-accent-green text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">03</span>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-accent-green">Seksi Pembayaran</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white text-accent-green rounded-xl flex items-center justify-center shadow-sm border border-accent-green/10">
                <i className="fas fa-wallet" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-dark-green uppercase tracking-widest">Wallet Penerima Dana</h4>
                <p className="text-[9px] text-dark-green/50 font-bold uppercase">Dana patungan akan dicairkan ke alamat ini.</p>
              </div>
            </div>
            <input type="text" placeholder="0X..." value={formData.recipient} onChange={(e) => setFormData({ ...formData, recipient: e.target.value })} className="w-full bg-white border border-accent-green/20 rounded-2xl p-5 text-[11px] font-black outline-none focus:ring-4 focus:ring-accent-green/10 transition-all" />
          </div>
        </section>

        {/* TOMBOL AKSI AKHIR */}
        <button onClick={handleDeploy} disabled={isPending || isConfirming} className="group w-full py-7 bg-dark-green text-milk rounded-[2rem] font-black text-[13px] uppercase tracking-[0.4em] shadow-2xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative z-10">{isPending || isConfirming ? "Sinkronisasi..." : "Deploy Ke Blockchain"}</span>
          <i className={`fa-solid fa-cube ${isPending || isConfirming ? "animate-spin" : "animate-pulse"} text-accent-green relative z-10`} />
        </button>
      </div>
    </div>
  );
}