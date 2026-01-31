"use client";

import React from "react";
import { supabaseBrowser } from "@/src/lib/supabase/browser";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client"; // Menggunakan client yang sudah kamu punya
import { formatEther } from "viem"; // Jika ingin memformat angka jika disimpan dalam wei

const supabase = createClient();

export default function DashboardHome() {
  const [userName, setUserName] = useState<string>("User");
  const [serverTime, setServerTime] = useState<string>("");
  const [patunganList, setPatunganList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      // Cek session dulu
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      if (!session) {
        router.push("/login");
        return; // stop eksekusi kalau belum login
      }

      // AMBIL NAMA USER DARI TABLE USERS
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("nama")
        .eq("id", session.user.id)
        .single();

      if (!userError && userData?.nama) {
        setUserName(userData.nama);
      }

      const now = new Date();

      const formatted = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      });

      setServerTime(formatted);

      // Kalau session ada, ambil data
      const { data, error } = await supabase
        .from("patungan")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Gagal ambil data:", error.message);
      } else {
        setPatunganList(data || []);
      }

      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-20 font-black uppercase animate-pulse">
        Memuat Data Patungan...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header User */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase">Halo, {userName}! 👋</h1>
          <p className="text-sm text-deep-gray font-bold uppercase tracking-widest">Dompet Anda siap untuk aksi sosial.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-black text-dark-green/60 uppercase tracking-[0.2em]">Waktu Server</p>
          <p className="text-sm font-bold text-dark-green/90 uppercase">{serverTime}</p>
        </div>
      </div>

      {/* Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 bg-dark-green rounded-[2.5rem] p-8 text-milk shadow-2xl relative overflow-hidden group border border-white/10">
            <div className="relative z-10">
              <div className="flex items-center gap-2 opacity-60 mb-1">
                <i className="fas fa-wallet text-xs"></i>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Saldo IDRX</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">1.250.000 IDRX</h3>
              <div className="flex gap-2">
                <span className="bg-accent-green text-[9px] font-black px-2 py-1 rounded-md">NETWORK: BASE</span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-accent-green/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          </div>
          
          <div className="lg:col-span-7 bg-accent-green/10 border border-accent-green/20 p-8 rounded-[2.5rem] shadow-sm relative group overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex gap-4 text-dark-green mt-3">
              <div className="w-14 h-14 bg-accent-green text-milk rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-accent-green/20">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div>
                <p className="text-xs font-black text-accent-green uppercase tracking-widest mb-1">Validator Task</p>
                <p className="text-xl font-black uppercase tracking-tight leading-none mb-3">
                  1 Pencairan butuh persetujuan Anda
                </p>
                <Link
                  href="dashboard/validator"
                  className="inline-flex items-center gap-2 bg-dark-green text-milk text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:bg-black transition-all">
                  Periksa Sekarang <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
            <span className="bg-accent-green text-milk text-[9px] font-black px-2 py-1 rounded-md animate-bounce">PENTING</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-dark-green uppercase tracking-tighter">Patungan Berjalan</h2>
          <Link
            href="/dashboard/patungan"
            className="text-[12px] font-black text-accent-green uppercase tracking-[0.15em] hover:opacity-70 transition">
              Lihat Semua
          </Link>
        </div>
      </div>

      {/* Grid Daftar Patungan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {patunganList.length > 0 ? (
          patunganList.map((item) => {
            const percent = Math.min(
              Math.round((item.current_amount / item.target_amount) * 100),
              100
            );
          
            return (
              <div
                key={item.id}
                className="bg-white rounded-[2rem] border border-dark-green/5 shadow-sm hover:shadow-xl transition-all p-6 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-accent-green/10 text-accent-green text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {item.description || "UMUM"}
                  </span>
                  <span className="text-dark-green/20 text-[10px] font-black uppercase">
                    #{item.id}
                  </span>
                </div>
          
                <h3 className="text-xl font-black text-dark-green uppercase tracking-tighter mb-4">
                  {item.title}
                </h3>
          
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-dark-green/50">
                      Terkumpul
                    </span>
                  </div>
          
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-black text-dark-green">
                      {item.current_amount.toLocaleString()}
                      <span className="text-[12px] opacity-40 ml-1">
                        / {item.target_amount.toLocaleString()} IDRX
                      </span>
                    </p>

                    <span className="text-[14px] font-black text-accent-green">
                        {percent}%
                    </span>
                  </div>
          
                  <div className="w-full h-2 bg-milk rounded-full overflow-hidden border border-dark-green/5">
                    <div
                      className="h-full bg-accent-green transition-all duration-1000"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
          
                <div className="flex gap-3 mt-6">
                  <Link
                    href={`/dashboard/patungan/${item.contract_address}`}
                    className="flex-1 bg-accent-green hover:bg-dark-green hover:text-milk text-milk text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            );
          })          
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-dark-green/10">
            <p className="text-xs font-black text-dark-green/30 uppercase tracking-[0.3em]">Belum ada patungan yang dibuat.</p>
            <Link href="/dashboard/buat" className="mt-4 inline-block text-accent-green font-black uppercase text-[10px]">Buat Sekarang →</Link>
          </div>
        )}
      </div>
    </div>
  );
}