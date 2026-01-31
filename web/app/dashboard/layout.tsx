"use client";

import "../globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import RootProvider from "../rootProvider";

import React, { useEffect, useState } from "react"; // Tambahkan useState & useEffect
import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@/src/lib/supabase/browser";
import { createClient } from "@/src/lib/supabase/client";
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { Address, Name, Identity, EthBalance } from "@coinbase/onchainkit/identity";
import { useAccount, useDisconnect } from "wagmi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // --- FIX HYDRATION ERROR ---
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  const { address, chainId, isConnected } = useAccount();

  const { disconnect } = useDisconnect();

  const hasSaved = useRef(false);

  const lastAddress = useRef<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address || !chainId) return;

    const syncWallet = async () => {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabaseBrowser.from("wallets").select("id").eq("wallet_address", address).eq("user_id", user.id).maybeSingle();

      await supabaseBrowser.from("wallets").update({ is_primary: false }).eq("user_id", user.id);

      if (existing) {
        await supabaseBrowser.from("wallets").update({ is_primary: true }).eq("id", existing.id);
      } else {
        await supabaseBrowser.from("wallets").insert({
          user_id: user.id,
          wallet_address: address,
          chain: chainId,
          is_primary: true,
        });
      }
    };

    syncWallet();
  }, [isConnected, address, chainId]);

  useEffect(() => {
    if (address) {
      lastAddress.current = address;
    }
  }, [address]);

  const handleDisconnect = async () => {
    if (!address) return disconnect();

    const {
      data: { user },
    } = await supabaseBrowser.auth.getUser();
    if (user) {
      await supabaseBrowser.from("wallets").update({ is_primary: false }).eq("wallet_address", address).eq("user_id", user.id);
    }

    disconnect();
  };

  // --- LOGIKA KELUAR (FORCE KILL SESSION) ---
  const handleSignOut = async () => {
    try {
      // 1. Hapus session di Supabase Auth
      await supabase.auth.signOut();

      // 2. Clear Local Storage (Opsional tapi aman untuk membersihkan sisa data)
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      // 3. JALUR KERAS: Full Page Reload ke Home
      // Ini jauh lebih aman daripada router.push karena memastikan cookies bersih total
      window.location.href = "/";
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Terjadi kesalahan saat keluar.");
    }
  };

  return (
    <div className="bg-milk min-h-screen text-dark-green font-sans">
      <nav className="fixed top-0 z-50 w-full bg-milk/80 backdrop-blur-md border-b border-dark-green/5">
        <div className="px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex ms-2 items-center gap-2">
                <Image src="/images/logo1.png" alt="logo" width={30} height={30} />
                <span className="font-extrabold text-lg tracking-tight uppercase text-dark-green">
                  Patungan<span className="text-accent-green">Yuk</span>
                </span>
              </Link>
            </div>

            {/* AREA WALLET DENGAN PENGECEKAN MOUNTED */}
            <div className="flex items-center gap-4">
              {!mounted ? (
                /* Placeholder saat proses loading/hydration agar layout tidak melompat */
                <div className="h-10 min-w-[140px] bg-dark-green/5 animate-pulse rounded-full" />
              ) : isConnected ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard/profile" className="h-10 min-w-[140px] bg-dark-green text-milk hover:bg-black rounded-full px-5 flex items-center gap-3 transition-all shadow-md border border-milk/10 group">
                    <i className="fa-solid fa-user-circle text-accent-green text-sm" />
                    <Name address={address} className="text-milk text-[9px] font-black uppercase tracking-[0.15em]" />
                  </Link>
                  <button onClick={() => disconnect()} className="h-10 w-10 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-all">
                    <i className="fa-solid fa-link-slash text-xs"></i>
                  </button>
                </div>
              ) : (
                <Wallet>
                  <ConnectWallet className="h-10 min-w-[140px] bg-dark-green text-milk rounded-full px-6 flex items-center justify-center transition-all shadow-md border border-milk/10">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Connect Wallet</span>
                  </ConnectWallet>
                  <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                      <Name className="text-dark-green font-black" />
                      <Address className="text-deep-gray text-xs" />
                      <EthBalance />
                    </Identity>
                    <WalletDropdownDisconnect />
                  </WalletDropdown>
                </Wallet>
              )}
            </div>
          </div>
        </div>
      </nav>

      <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-24 bg-white border-r border-dark-green/5 transition-transform -translate-x-full sm:translate-x-0">
        <div className="h-full px-4 pb-4 overflow-y-auto flex flex-col">
          <div className="mb-8">
            <Link
              href={mounted && isConnected ? "/dashboard/buat" : "#"}
              onClick={(e) => {
                if (!mounted || !isConnected) {
                  e.preventDefault();
                  alert("Hubungkan wallet dulu!");
                }
              }}
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${mounted && isConnected ? "bg-dark-green text-milk" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              <i className="fas fa-plus-circle"></i>
              Buat Patungan
            </Link>
          </div>

          <ul className="space-y-2 font-bold text-[11px] uppercase tracking-widest flex-1">
            {[
              { name: "Home Dashboard", path: "/dashboard", icon: "fa-house-chimney" },
              { name: "Profile", path: "/dashboard/profile", icon: "fa-user-circle" },
              { name: "Patungan Saya", path: "/dashboard/patungan", icon: "fa-layer-group" },
              { name: "Riwayat Patungan", path: "/dashboard/riwayat", icon: "fa-receipt" },
              { name: "Validator", path: "/dashboard/validator", icon: "fa-shield-halved", badge: "1" },
            ].map((item) => (
              <li key={item.path}>
                <Link href={item.path} className={`flex items-center p-3 rounded-2xl transition ${isActive(item.path) ? "text-accent-green bg-dark-green/5" : "text-deep-gray hover:text-dark-green hover:bg-milk"}`}>
                  <i className={`fas ${item.icon} w-5 text-center`}></i>
                  <span className="ms-3">{item.name}</span>
                  {item.badge && <span className="ms-auto bg-accent-green text-milk text-[9px] px-2 py-0.5 rounded-md">{item.badge}</span>}
                </Link>
              </li>
            ))}
          </ul>

          {/* TOMBOL KELUAR (SINKRON DENGAN SUPABASE) */}
          <div className="pt-4 border-t border-dark-green/5">
            <button
              onClick={handleSignOut} // Gunakan fungsi handleSignOut yang baru
              className="w-full flex items-center p-3 text-red-400 hover:bg-red-50 rounded-2xl transition font-bold text-[11px] uppercase tracking-widest outline-none"
            >
              <i className="fas fa-right-from-bracket w-5 text-center"></i>
              <span className="ms-3">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="sm:ml-64 pt-4 min-h-screen bg-milk">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
