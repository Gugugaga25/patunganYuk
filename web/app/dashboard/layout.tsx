"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@/src/lib/supabase/browser";
import { createClient } from "@/src/lib/supabase/client";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Address, Name, Identity, EthBalance } from "@coinbase/onchainkit/identity";
import { useAccount, useDisconnect } from "wagmi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isActive = (path: string) => pathname === path;

  const { address, chainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const lastAddress = useRef<string | null>(null);

  /* =======================
     SYNC WALLET KE SUPABASE
  ======================== */
  useEffect(() => {
    if (!isConnected || !address || !chainId) return;

    const syncWallet = async () => {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabaseBrowser
        .from("wallets")
        .select("id")
        .eq("wallet_address", address)
        .eq("user_id", user.id)
        .maybeSingle();

      await supabaseBrowser
        .from("wallets")
        .update({ is_primary: false })
        .eq("user_id", user.id);

      if (existing) {
        await supabaseBrowser
          .from("wallets")
          .update({ is_primary: true })
          .eq("id", existing.id);
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
    if (address) lastAddress.current = address;
  }, [address]);

  /* =======================
        DISCONNECT WALLET
  ======================== */
  const handleDisconnect = async () => {
    if (!address) return disconnect();

    const {
      data: { user },
    } = await supabaseBrowser.auth.getUser();

    if (user) {
      await supabaseBrowser
        .from("wallets")
        .update({ is_primary: false })
        .eq("wallet_address", address)
        .eq("user_id", user.id);
    }

    disconnect();
  };

  /* =======================
          SIGN OUT
  ======================== */
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();

      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Terjadi kesalahan saat keluar.");
    }
  };

  return (
    <div className="bg-milk min-h-screen text-dark-green font-sans">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 z-50 w-full bg-milk/80 backdrop-blur-md border-b border-dark-green/5">
        <div className="px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo1.png" alt="logo" width={30} height={30} />
              <span className="font-extrabold text-lg uppercase">
                Patungan<span className="text-accent-green">Yuk</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {!mounted ? (
                <div className="h-10 min-w-[140px] bg-dark-green/5 animate-pulse rounded-full" />
              ) : isConnected ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/profile"
                    className="h-10 min-w-[140px] bg-dark-green text-milk rounded-full px-5 flex items-center gap-3 shadow-md"
                  >
                    <i className="fa-solid fa-user-circle text-accent-green text-sm" />
                    <Name
                      address={address}
                      className="text-milk text-[9px] font-black uppercase tracking-[0.15em]"
                    />
                  </Link>

                  <button
                    onClick={handleDisconnect}
                    className="h-10 w-10 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center"
                  >
                    <i className="fa-solid fa-link-slash text-xs"></i>
                  </button>
                </div>
              ) : (
                <Wallet>
                  <ConnectWallet className="h-10 min-w-[140px] bg-dark-green text-milk rounded-full px-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                      Connect Wallet
                    </span>
                  </ConnectWallet>

                  <WalletDropdown className="bg-white border rounded-[2rem] shadow-2xl p-4 mt-2">
                    <Identity hasCopyAddressOnClick>
                      <Name className="font-black" />
                      <Address className="text-xs" />
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

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-24 bg-white border-r border-dark-green/5 sm:translate-x-0">
        <div className="h-full px-4 pb-4 flex flex-col">
          <div className="mb-8">
            <Link
              href={isConnected ? "/dashboard/buat" : "#"}
              onClick={(e) => {
                if (!isConnected) {
                  e.preventDefault();
                  alert("Hubungkan wallet kamu dulu, Capt!");
                }
              }}
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl ${
                isConnected
                  ? "bg-dark-green text-milk"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <i className="fas fa-plus-circle"></i>
              Buat Patungan
            </Link>
          </div>

          <ul className="space-y-2 text-[11px] uppercase tracking-widest flex-1">
            {[
              { name: "Home Dashboard", path: "/dashboard", icon: "fa-house-chimney" },
              { name: "Profile", path: "/dashboard/profile", icon: "fa-user-circle" },
              { name: "Patungan Saya", path: "/dashboard/patungan", icon: "fa-layer-group" },
              { name: "Riwayat", path: "/dashboard/riwayat", icon: "fa-receipt" },
              { name: "Validator", path: "/dashboard/validator", icon: "fa-shield-halved" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center p-3 rounded-2xl ${
                    isActive(item.path)
                      ? "text-accent-green bg-dark-green/5"
                      : "text-deep-gray hover:bg-milk"
                  }`}
                >
                  <i className={`fas ${item.icon} w-5 text-center`} />
                  <span className="ms-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center p-3 text-red-400 hover:bg-red-50 rounded-2xl text-[11px] uppercase tracking-widest"
            >
              <i className="fas fa-right-from-bracket w-5 text-center" />
              <span className="ms-3">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= CONTENT ================= */}
      <div className="sm:ml-64 pt-24 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
