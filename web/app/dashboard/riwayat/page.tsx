"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  target_amount: number;
  current_amount: number;
  status: string;
  recipient: string;
}

export default function RiwayatTerintegrasiPage() {
  const [activeTab, setActiveTab] = useState<"kontribusi" | "laporan">("kontribusi");

  // State terpisah agar tidak campur aduk
  const [history, setHistory] = useState<IRiwayat[]>([]);
  const [reports, setReports] = useState<ILaporan[]>([]);

  const fetchAktivitas = async () => {
    const supabase = getSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: dataRiwayat, error: err1 } = await supabase.from("patungan_participant").select(`amount_paid, status, joined_at, patungan ( title, status )`).eq("user_id", user.id).order("joined_at", { ascending: false });

    const { data: dataLaporan, error: err2 } = await supabase.from("patungan").select(`id, title, description, target_amount, current_amount, status, recipient`).eq("status", "DONE").or(`creator_id.eq.${user.id}`);
    if (!err1 && dataRiwayat) setHistory(dataRiwayat as any);
    if (!err2 && dataLaporan) setReports(dataLaporan as any);
  };

  useEffect(() => {
    fetchAktivitas();
  }, []);

  const totalKontribusi = history.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0);

  return (
    <>
      {/* Header Halaman & Ringkasan Statistik Gabungan */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-dark-green tracking-tighter uppercase leading-none">Aktivitas Keuangan</h1>
          <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-3">Transparansi penuh kontribusi dan penggunaan dana grup di Blockchain.</p>
        </div>

        <div className="gap-4">
          {/* Card Total Kontribusi (dari Riwayat) */}
          <div className="bg-dark-green px-6 py-5 rounded-[2rem] shadow-xl flex items-center gap-4 border border-white/5 relative overflow-hidden group">
            <div className="w-10 h-10 bg-accent-green text-milk rounded-xl flex items-center justify-center text-lg shadow-lg relative z-10">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <div className="relative z-10">
              <p className="text-[8px] font-black text-milk/40 uppercase tracking-[0.2em]">Total Kontribusi</p>
              <p className="text-xl font-black text-milk tracking-tighter leading-tight">{totalKontribusi} IDRX</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasi Tab Intern */}
      <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-dark-green/5 mb-8 w-fit">
        <button onClick={() => setActiveTab("kontribusi")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "kontribusi" ? "bg-dark-green text-milk shadow-lg" : "text-dark-green/40 hover:text-dark-green"}`}>
          Riwayat Kontribusi
        </button>
        <button onClick={() => setActiveTab("laporan")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "laporan" ? "bg-dark-green text-milk shadow-lg" : "text-dark-green/40 hover:text-dark-green"}`}>
          Laporan Dana Grup
        </button>
      </div>

      {/* Konten Dinamis Berdasarkan Tab */}
      <div className="text-dark-green">
        {activeTab === "kontribusi" ? (
          /* TAMPILAN RIWAYAT (Daftar Transaksi) */
          <div className="bg-white rounded-[2.5rem] p-2 border border-dark-green/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-dark-green/5 flex items-center justify-between">
              <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">Transaksi Terakhir</h3>
              <div className="flex gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-milk text-dark-green/70 hover:text-dark-green transition-all border border-dark-green/15">
                  <i className="fas fa-filter text-[10px]"></i>
                </button>
              </div>
            </div>
            <div className="divide-y divide-dark-green/5">
              {history.length > 0 ? (
                history.map((item: any, index) => (
                  <div key={index} className="p-6 hover:bg-milk/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-milk border border-dark-green/5 text-dark-green rounded-2xl flex items-center justify-center text-lg shadow-inner">
                        <i className="fas fa-arrow-up-right-from-square"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight leading-tight">Kontribusi Patungan</h4>
                        <p className="text-[10px] text-deep-gray font-bold uppercase tracking-widest mt-1">
                          UNTUK: <span className="text-dark-green">{item.patungan?.title || "GRUP TANPA NAMA"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1">
                      <p className="text-base font-black tracking-tighter">- {new Intl.NumberFormat("id-ID").format(item.amount_paid)} IDRX</p>
                      <span className="text-[9px] font-black text-dark-green/50 uppercase tracking-widest">{new Date(item.joined_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${item.status === "success" ? "bg-accent-green/10 text-accent-green" : "bg-yellow-500/10 text-yellow-600"}`}>{item.status}</div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center opacity-30 font-black uppercase tracking-widest text-xs">Belum ada riwayat kontribusi</div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-2 border border-dark-green/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-dark-green/5 flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Laporan Dana</h3>
              <div className="flex gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-milk text-dark-green/70 hover:text-dark-green transition-all border border-dark-green/15">
                  <i className="fas fa-filter text-[10px]"></i>
                </button>
              </div>
            </div>
            <div className="divide-y divide-dark-green/5">
              {/* Item 1 */}
              {reports.length > 0 ? (
                reports.map((item: any, index) => (
                  <div key={index} className="bg-white rounded-[2.5rem] p-2 border border-dark-green/5 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-dark-green/5 flex items-center justify-between">
                      <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Laporan Dana</h3>
                      <div className="flex gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-milk text-dark-green/70 hover:text-dark-green transition-all border border-dark-green/15">
                          <i className="fas fa-filter text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-dark-green/5">
                      {/* Item 1 */}
                      <div className="p-6 hover:bg-milk/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-milk border border-dark-green/5 text-dark-green rounded-2xl flex items-center justify-center text-lg shadow-inner">
                            <i className="fas fa-umbrella-beach"></i>
                          </div>
                          <div>
                            <h4 className="text-base font-black uppercase tracking-tight leading-tight">{item.title || "tes 123"}</h4>
                            <p className="text-[10px] text-deep-gray font-bold uppercase tracking-widest mt-1">
                              UNTUK: <span className="text-dark-green">{item.description || "No description"}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <p className="text-sm font-black">{item.current_amount || 120000000} IDRX</p>
                          <button className="bg-white border border-dark-green/10 text-[9px] font-black uppercase px-4 py-2 rounded-xl hover:bg-dark-green hover:text-milk transition-all shadow-sm">
                            <i className="fas fa-image mr-1"></i> Bukti
                          </button>
                          <span className="bg-accent-green/10 text-accent-green text-[9px] font-black px-3 py-1 rounded-full uppercase">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center opacity-30 font-black uppercase tracking-widest text-xs">Belum ada riwayat laporan</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Load More Button */}
      <div className="p-8 bg-milk/30 text-center border-t border-dark-green/5 mt-10 rounded-b-[2.5rem]">
        <button className="text-[10px] font-black text-dark-green/60 uppercase tracking-[0.3em] hover:text-accent-green transition-all active:scale-95">Muat Aktivitas Lainnya</button>
      </div>
    </>
  );
}
