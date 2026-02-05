"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/src/lib/supabase/browser";
import { createClient } from "@/src/lib/supabase/client";

const supabase = createClient();

export default function PatunganSayaPage() {
  const [filter, setFilter] = useState("Aktif");
  const [patunganList, setPatunganList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const tabs = ["Aktif", "Selesai", "Batal"];

  const formatIDR = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);

  const calcProgress = (current: number, target: number) =>
    Math.min(Math.round((current / target) * 100), 100);

  /* =====================
     AUTH + FETCH DATA
  ====================== */
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
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
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal ambil data:", error.message);
      } else {
        setPatunganList(data || []);
      }

      setLoading(false);
    };

    init();
  }, [router]);

  if (loading) {
    return (
      <div className="text-center p-20 font-black uppercase animate-pulse">
        Memuat Data Patungan...
      </div>
    );
  }

  return (
    <>
      {/* Animasi Jam Pasir */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-dark-green uppercase">
            Patungan Saya
          </h1>
          <p className="text-xs text-deep-gray font-bold uppercase tracking-[0.2em] mt-3">
            Pantau status dana grup Anda secara real-time.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-dark-green/5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === tab
                  ? "bg-dark-green text-milk shadow-[0_10px_20px_-5px_rgba(10,46,32,0.3)]"
                  : "text-dark-green/30 hover:text-dark-green"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-dark-green">
        {patunganList.length > 0 ? (
          patunganList.map((item) => {
            const progress = calcProgress(
              item.current_amount,
              item.target_amount
            );

            return (
              <div
                key={item.id}
                className="bg-white rounded-[2.5rem] p-8 border border-dark-green/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-milk border border-dark-green/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      <i className="fas fa-layer-group"></i>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-accent-green bg-accent-green/10 px-3 py-1 rounded-md uppercase tracking-widest">
                        {item.category || "Umum"}
                      </span>
                      <h3 className="text-xl font-black mt-2 uppercase">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[9px] font-black text-dark-green/60 bg-milk px-3 py-1 rounded-md uppercase tracking-widest border border-dark-green/10">
                    Member
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-deep-gray uppercase tracking-widest">
                        Progres Dana
                      </p>
                      <p className="text-lg font-black">
                        {formatIDR(item.current_amount)} IDRX{" "}
                        <span className="text-sm text-dark-green/60">
                          / {formatIDR(item.target_amount)} IDRX
                        </span>
                      </p>
                    </div>
                    <span className="text-2xl font-black text-accent-green">
                      {progress}%
                    </span>
                  </div>

                  <div className="w-full bg-milk h-4 rounded-full border border-dark-green/5 overflow-hidden p-1">
                    <div
                      className="bg-accent-green h-full rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-dark-green/5">
                  <div className="flex items-center gap-2 text-dark-green/60">
                    <i className="far fa-clock text-xs"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {item.deadline || "Aktif"}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/patungan/${item.contract_address}`}
                    className="bg-dark-green text-milk px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 text-dark-green/40 font-black uppercase">
            Belum ada patungan.
          </div>
        )}

        {/* Tombol Buat Baru */}
        <Link
          href="/dashboard/buat"
          className="border-4 border-dashed border-dark-green/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group hover:border-accent-green hover:bg-accent-green/5 transition-all"
        >
          <div className="w-16 h-16 bg-milk text-dark-green/10 rounded-full flex items-center justify-center text-2xl group-hover:bg-accent-green group-hover:text-milk transition-all duration-500 mb-4 shadow-inner">
            <i className="fas fa-plus"></i>
          </div>
          <h4 className="text-lg font-black text-dark-green/30 group-hover:text-dark-green uppercase">
            Buat Patungan Baru
          </h4>
          <p className="text-[10px] font-bold text-dark-green/20 uppercase mt-2 group-hover:text-dark-green/60">
            Mulai penggalangan dana grup Anda sekarang.
          </p>
        </Link>
      </div>
    </>
  );
}
