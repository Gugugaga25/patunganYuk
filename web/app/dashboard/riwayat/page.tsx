"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowser } from "@/src/lib/supabase-browser";

interface IRiwayat {
  amount_paid: number;
  status: string;
  joined_at: string;
  patungan: {
    title: string;
    status: string;
  };
}

interface ILaporan {
  id: string;
  title: string;
  description: string;
  deadline: string;
  target_amount: number;
  current_amount: number;
  status: string;
  recipient: string;
}

export default function RiwayatTerintegrasiPage() {
  const [activeTab, setActiveTab] = useState<"kontribusi" | "laporan">("kontribusi");
  const [history, setHistory] = useState<IRiwayat[]>([]);
  const [reports, setReports] = useState<ILaporan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAktivitas = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // 1. Ambil Riwayat Kontribusi
    const { data: dataRiwayat, error: err1 } = await supabase
      .from("patungan_participants") //
      .select(`amount_paid, status, joined_at, patungan ( title, status )`)
      .eq("user_id", user.id)
      .order("joined_at", { ascending: false });

    const { data: dataLaporan, error: err2 } = await supabase.from("patungan").select(`id, title, description, target_amount, current_amount, status, recipient, deadline`).eq("creator_id", user.id); // Tembak langsung creator_id

    // --- DEBUGGING: Cek di Console (F12) ---
    if (err1) console.error("Error Riwayat:", err1.message);
    if (err2) console.error("Error Laporan:", err2.message);
    console.log("ID User Kamu:", user.id);
    console.log("Data Laporan Ditemukan:", dataLaporan);

    if (dataRiwayat) setHistory(dataRiwayat as any);
    if (dataLaporan) setReports(dataLaporan as any);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAktivitas();
  }, [fetchAktivitas]);

  const totalKontribusi = history.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0);

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-dark-green">MEMUAT AKTIVITAS...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-0">
      {/* Header & Statistik */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase leading-none">Aktivitas Keuangan</h1>
          <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-3">Transparansi kontribusi di Blockchain.</p>
        </div>

        <div className="bg-dark-green px-8 py-6 rounded-[2.5rem] shadow-xl flex items-center gap-4 text-milk border border-white/5">
          <div className="w-12 h-12 bg-accent-green rounded-2xl flex items-center justify-center text-xl shadow-lg">
            <i className="fas fa-hand-holding-heart"></i>
          </div>
          <div>
            <p className="text-[8px] font-black opacity-40 uppercase tracking-[0.2em]">Total Kontribusi</p>
            <p className="text-2xl font-black tracking-tighter leading-tight">{totalKontribusi.toLocaleString()} IDRX</p>
          </div>
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-dark-green/5 mb-8 w-fit">
        <button onClick={() => setActiveTab("kontribusi")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "kontribusi" ? "bg-dark-green text-milk shadow-lg" : "text-dark-green/40 hover:text-dark-green"}`}>
          Riwayat Kontribusi
        </button>
        <button onClick={() => setActiveTab("laporan")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "laporan" ? "bg-dark-green text-milk shadow-lg" : "text-dark-green/40 hover:text-dark-green"}`}>
          Laporan Dana Grup
        </button>
      </div>

      {/* Konten Utama */}
      <div className="bg-white rounded-[2.5rem] border border-dark-green/5 shadow-sm overflow-hidden text-dark-green">
        <div className="p-6 border-b border-dark-green/5 flex items-center justify-between">
          <h3 className="text-xl font-black uppercase tracking-tighter leading-none">{activeTab === "kontribusi" ? "Transaksi Terakhir" : "Laporan Penggunaan Dana"}</h3>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-milk text-dark-green/70 border border-dark-green/15">
            <i className="fas fa-filter text-[10px]"></i>
          </button>
        </div>

        <div className="divide-y divide-dark-green/5">
          {activeTab === "kontribusi" ? (
            history.length > 0 ? (
              history.map((item, index) => (
                <div key={index} className="p-6 hover:bg-milk/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-milk border border-dark-green/5 text-dark-green rounded-2xl flex items-center justify-center shadow-inner">
                      <i className="fas fa-receipt"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight">Kontribusi Patungan</h4>
                      <p className="text-[10px] text-deep-gray font-bold uppercase tracking-widest mt-1">
                        UNTUK: <span className="text-dark-green">{item.patungan?.title || "TANPA NAMA"}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black tracking-tighter">- {new Intl.NumberFormat("id-ID").format(item.amount_paid)} IDRX</p>
                    <span className="text-[9px] font-black text-dark-green/50 uppercase tracking-widest">{new Date(item.joined_at).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center opacity-30 font-black uppercase text-xs">Belum ada riwayat kontribusi</div>
            )
          ) : reports.length > 0 ? (
            reports.map((item) => (
              <div key={item.id} className="p-6 hover:bg-milk/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-milk border border-dark-green/5 text-dark-green rounded-2xl flex items-center justify-center">
                    <i className="fas fa-umbrella-beach"></i>
                  </div>
                  <div>
                    <h4 className="text-base font-black uppercase tracking-tight leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-deep-gray font-bold uppercase tracking-widest mt-1">
                      PENERIMA: <span className="text-dark-green">{item.recipient || "Tujuan Dana"}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-black">{new Intl.NumberFormat("id-ID").format(item.current_amount)} IDRX</p>
                    <p className="text-[9px] font-bold text-red-500 uppercase flex items-center justify-end gap-1">
                      <i className="fas fa-clock text-[8px]"></i>
                      Batas: {item.deadline ? new Date(item.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) : "-"}
                    </p>
                  </div>
                  <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${item.status === "cair" ? "bg-accent-green text-milk" : "bg-blue-500/10 text-blue-600"}`}>{item.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center opacity-30 font-black uppercase text-xs">Belum ada riwayat laporan grup</div>
          )}
        </div>
      </div>

      {/* Load More Button */}
      <div className="p-8 text-center mt-10">
        <button className="text-[10px] font-black text-dark-green/40 uppercase tracking-[0.3em] hover:text-accent-green transition-all">Muat Aktivitas Lainnya</button>
      </div>
    </div>
  );
}
