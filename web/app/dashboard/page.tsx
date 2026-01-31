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

      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("patungan")
        .select(`
          *,
          patungan_participants!inner (
            user_id
          )
        `)
        .eq("patungan_participants.user_id", user.id)
        .order("created_at", { ascending: false })

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
      {/* Welcome Banner */}
      <div className="bg-dark-green rounded-[2.5rem] p-10 text-milk relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Dashboard Utama</h2>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Kelola dan pantau semua kegiatan patungan aktif kamu.</p>
        </div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-green/20 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Daftar Patungan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {patunganList.length > 0 ? (
          patunganList.map((item) => (
            <div key={item.id} className="bg-white rounded-[2rem] border border-dark-green/5 shadow-sm hover:shadow-xl transition-all p-6 group">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-accent-green/10 text-accent-green text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {item.description || "UMUM"} {/* Mengambil kategori dari deskripsi */}
                </span>
                <span className="text-dark-green/20 text-[10px] font-black uppercase">
                  #{item.id}
                </span>
              </div>

              <h3 className="text-xl font-black text-dark-green uppercase tracking-tighter mb-4 group-hover:text-accent-green transition-colors">
                {item.title}
              </h3>

              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span className="text-dark-green/50">Terkumpul</span>
                    <span className="text-dark-green">
                        {item.current_amount.toLocaleString()} / {item.target_amount.toLocaleString()} IDRX
                    </span>
                  </div>
                  <div className="w-full h-2 bg-milk rounded-full overflow-hidden border border-dark-green/5">
                    <div 
                      className="h-full bg-accent-green transition-all duration-1000" 
                      style={{ width: `${Math.min((item.current_amount / item.target_amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  href={`/dashboard/patungan/${item.contract_address}`} // Link ke halaman detail menggunakan alamat kontrak
                  className="flex-1 bg-milk hover:bg-dark-green hover:text-milk text-dark-green text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Detail
                </Link>
                <button className="bg-dark-green text-milk px-5 rounded-2xl hover:bg-black transition-all">
                  <i className="fas fa-share-nodes text-xs"></i>
                </button>
              </div>
            </div>
          ))
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