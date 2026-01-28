"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Helper untuk mengecek link aktif
  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-milk min-h-screen text-dark-green">
      {/* Navbar Khusus Admin */}
      <nav className="fixed top-0 z-50 w-full bg-milk/80 backdrop-blur-md border-b border-dark-green/5">
        <div className="px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="inline-flex items-center p-2 text-dark-green rounded-lg sm:hidden hover:bg-dark-green/5">
                <i className="fas fa-bars text-xl"></i>
              </button>
              <Link href="/" className="flex ms-2 items-center gap-2">
                <div className="w-8 h-8 bg-dark-green rounded-lg flex items-center justify-center text-milk font-black shadow-md">P</div>
                <span className="font-extrabold text-lg tracking-tight uppercase text-dark-green">
                  Patungan<span className="text-accent-green italic">Yuk Admin</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-dark-green px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-accent-green rounded-full mr-3 animate-pulse"></div>
                <span className="text-[9px] font-black font-mono text-milk/80">ADMIN_MASTER_01</span>
              </div>
              <img className="w-10 h-10 rounded-2xl border-2 border-accent-green shadow-md" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="admin" />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Khusus Admin */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-24 bg-white border-r border-dark-green/5 transition-transform -translate-x-full sm:translate-x-0">
        <div className="h-full px-4 pb-4 overflow-y-auto flex flex-col">
          <div className="mb-8">
            <div className="px-4 py-3 bg-accent-green/10 rounded-2xl border border-accent-green/20">
              <p className="text-[9px] font-black text-accent-green uppercase tracking-widest">Master Control</p>
              <p className="text-[11px] font-bold text-dark-green uppercase">Platform Owner</p>
            </div>
          </div>
          <ul className="space-y-2 font-bold text-[11px] uppercase tracking-widest flex-1">
            {[
              { name: "Home", path: "/dashboardAdmin", icon: "fa-chart-pie" },
              { name: "Withdrawal System", path: "/dashboardAdmin/withdraw", icon: "fa-arrow-right-from-bracket" },
              { name: "Global Logs", path: "/dashboardAdmin/logs", icon: "fa-database" },
            ].map((item) => (
              <li key={item.path}>
                <Link href={item.path} className={`flex items-center p-3 rounded-2xl transition ${isActive(item.path) ? "text-accent-green bg-dark-green/5 shadow-inner" : "text-deep-gray hover:text-dark-green hover:bg-milk"}`}>
                  <i className={`fas ${item.icon} w-5 text-center`}></i>
                  <span className="ms-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-dark-green/5">
            <Link href="/" className="flex items-center p-3 text-dark-green hover:bg-milk rounded-2xl transition font-bold text-[11px] uppercase tracking-widest">
              <i className="fas fa-user-shield w-5 text-center"></i>
              <span className="ms-3">Logout</span>
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
