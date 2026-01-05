"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConnect, useAccount } from "wagmi";

export default function ConnectWalletPage() {
  const router = useRouter();
  const { connect, connectors, isPending } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  return (
    <div className="bg-milk flex justify-center items-center flex-col h-screen overflow-hidden text-dark-green relative">
      {/* Background Blobs (Sesuai Desain Login) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent-green/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-dark-green/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Tombol Kembali */}
      <Link href="/login" className="absolute top-6 left-6 z-[110] flex items-center gap-2 hover:opacity-70 text-dark-green transition-all group bg-white/50 backdrop-blur-md py-2 px-5 rounded-full border border-dark-green/10 shadow-sm">
        <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kembali</span>
      </Link>

      {/* Container Utama */}
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-dark-green/5 p-8 md:p-12 text-center relative overflow-hidden">
          {/* Dekorasi Ikon */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-dark-green rounded-2xl flex items-center justify-center text-milk font-black text-2xl mx-auto shadow-xl relative z-10">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-green/5 rounded-full blur-2xl -z-0"></div>
          </div>

          <h1 className="font-black text-3xl uppercase italic tracking-tighter text-dark-green mb-8">Hubungkan Dompet</h1>

          {/* List Wallet Provider */}
          <div className="space-y-4">
            <button disabled={isPending} className="w-full group flex items-center justify-between p-4 bg-milk border border-dark-green/5 rounded-2xl transition-all hover:border-accent-green hover:shadow-lg active:scale-95 disabled:opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-dark-green/5 group-hover:scale-110 transition-transform text-dark-green">
                  <i className="fas fa-wallet group-hover:text-accent-green"></i>
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-black uppercase tracking-widest text-dark-green">MetaMask</p>
                  <p className="text-[9px] font-bold text-deep-gray uppercase">Tersedia via Wallet</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-dark-green/5 flex items-center justify-center text-[10px] text-dark-green/30 group-hover:bg-accent-green group-hover:text-milk transition-colors">
                <i className="fas fa-chevron-right"></i>
              </div>
            </button>
          </div>

          <p className="text-[9px] font-bold text-deep-gray uppercase tracking-widest mt-10 opacity-50 px-4 leading-relaxed">Dengan menghubungkan dompet, Anda menyetujui protokol keamanan Smart Contract kami di Base Network.</p>
        </div>
      </div>
    </div>
  );
}
