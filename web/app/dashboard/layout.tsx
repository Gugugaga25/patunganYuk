"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
// 1. Import komponen dari OnchainKit dan Wagmi
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect 
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isConnected } = useAccount(); // Cek status koneksi wallet

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-milk min-h-screen text-dark-green">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-milk/80 backdrop-blur-md border-b border-dark-green/5">
        <div className="px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="inline-flex items-center p-2 text-dark-green rounded-lg sm:hidden hover:bg-dark-green/5">
                <i className="fas fa-bars text-xl"></i>
              </button>
              <Link href="/" className="flex ms-2 items-center gap-2">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Image src="/images/logo1.png" alt="logo1" width={30} height={30} />
                  <span className="font-extrabold text-lg tracking-tight uppercase text-dark-green">
                    Patungan<span className="text-accent-green">Yuk</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. AREA WALLET (Dinamis) */}
            <div className="flex items-center gap-4">
              <Wallet>
                <ConnectWallet className="bg-dark-green text-milk hover:bg-black rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">
                  <Avatar className="h-6 w-6" />
                  <Name className="text-milk" />
                </ConnectWallet>
                <WalletDropdown className="bg-white border border-dark-green/5 rounded-2xl shadow-2xl p-4">
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address className="text-deep-gray" />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect className="hover:bg-red-50 text-red-400 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all" />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar - Bagian Buat Patungan (Hanya muncul jika sudah connect) */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-24 bg-white border-r border-dark-green/5 transition-transform -translate-x-full sm:translate-x-0">
        <div className="h-full px-4 pb-4 overflow-y-auto flex flex-col">
          <div className="mb-8">
            <Link 
              href={isConnected ? "/dashboard/buat" : "#"} 
              onClick={() => !isConnected && alert("Hubungkan wallet kamu dulu, Capt!")}
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                isConnected ? "bg-dark-green text-milk shadow-dark-green/10 hover:-translate-y-1" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
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
              { name: "Riwayat", path: "/dashboard/riwayat", icon: "fa-receipt" },
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
          <div className="pt-4 border-t border-dark-green/5">
            <Link href="/login" className="flex items-center p-3 text-red-400 hover:bg-red-50 rounded-2xl transition font-bold text-[11px] uppercase tracking-widest">
              <i className="fas fa-right-from-bracket w-5 text-center"></i>
              <span className="ms-3">Keluar</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="sm:ml-64 pt-24 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}