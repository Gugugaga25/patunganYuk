"use client";

import React, { useState } from "react";
import Link from "next/link";

interface TransactionLog {
  id: string;
  timestamp: string;
  projectName: string;
  type: "Deposit" | "Payout" | "Refund" | "Admin Withdraw";
  amount: string;
  sender: string;
  status: "Success" | "Processing" | "Failed";
  txHash: string;
}

export default function GlobalLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data Log Transaksi Global
  const logs: TransactionLog[] = [
    {
      id: "LOG-001",
      timestamp: "28 Jan 2026, 09:15",
      projectName: "Sewa Villa Bali 3D2N",
      type: "Deposit",
      amount: "500.000",
      sender: "0x71C...3E4F",
      status: "Success",
      txHash: "0xabc...123",
    },
    {
      id: "LOG-002",
      timestamp: "27 Jan 2026, 14:20",
      projectName: "Sewa Villa Bali 3D2N",
      type: "Payout",
      amount: "10.000.000",
      sender: "Smart Contract",
      status: "Success",
      txHash: "0xdef...456",
    },
    {
      id: "LOG-003",
      timestamp: "26 Jan 2026, 10:00",
      projectName: "Meja Pingpong Kantor",
      type: "Admin Withdraw",
      amount: "100.000",
      sender: "Admin Master",
      status: "Success",
      txHash: "0xghi...789",
    },
    {
      id: "LOG-004",
      timestamp: "25 Jan 2026, 08:45",
      projectName: "Arisan Motor Base",
      type: "Refund",
      amount: "1.200.000",
      sender: "Smart Contract",
      status: "Processing",
      txHash: "0xjkl...012",
    },
  ];

  return (
    <div className="space-y-10 text-dark-green">
      {/* Header Logs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
            Global <span className="text-accent-green">Activity Logs</span>
          </h1>
          <p className="text-sm text-deep-gray font-bold uppercase tracking-widest">Audit semua transaksi IDRX on-chain yang terjadi di jaringan Base.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input type="text" placeholder="Cari TX Hash atau Proyek..." className="w-full bg-white border border-dark-green/5 rounded-2xl p-4 pl-12 text-[11px] font-black uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-accent-green/20 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-dark-green/20 text-xs"></i>
        </div>
      </div>

      {/* Tabel Logs */}
      <div className="bg-white rounded-[2.5rem] border border-dark-green/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-milk/50 text-[10px] font-black uppercase tracking-[0.2em] border-b border-dark-green/5">
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-6 py-6">Project</th>
                <th className="px-6 py-6">Type</th>
                <th className="px-6 py-6">Amount (IDRX)</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-green/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-milk/30 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-[11px] font-black leading-none">{log.timestamp}</p>
                    <p className="text-[9px] font-bold text-deep-gray mt-1 uppercase tracking-widest">{log.id}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-[11px] font-black uppercase tracking-tight">{log.projectName}</p>
                    <p className="text-[9px] font-bold font-mono opacity-40">{log.sender}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${log.type === "Deposit" ? "bg-blue-50 border-blue-100 text-blue-600" : log.type === "Payout" ? "bg-green-50 border-green-100 text-green-600" : log.type === "Admin Withdraw" ? "bg-purple-50 border-purple-100 text-purple-600" : "bg-red-50 border-red-100 text-red-400"}`}>{log.type}</span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black italic tracking-tighter italic">
                      {log.type === "Deposit" || log.type === "Admin Withdraw" ? "" : ""}
                      {log.amount}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${log.status === "Success" ? "bg-accent-green animate-pulse" : log.status === "Processing" ? "bg-orange-400 animate-bounce" : "bg-red-500"}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{log.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link href="#" className="inline-flex items-center gap-2 text-[9px] font-black text-dark-green bg-milk px-4 py-2 rounded-full border border-dark-green/5 hover:border-accent-green hover:text-accent-green transition-all uppercase tracking-widest">
                      <i className="fas fa-external-link-alt text-[8px]"></i> {log.txHash}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-8 bg-milk/30 border-t border-dark-green/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-bold text-deep-gray uppercase tracking-widest">Showing 1 to 4 of 1,240 transactions</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-white border border-dark-green/5 flex items-center justify-center text-dark-green/30 hover:border-accent-green hover:text-accent-green transition-all">
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
            <button className="w-10 h-10 rounded-xl bg-dark-green text-milk flex items-center justify-center text-[10px] font-black italic">1</button>
            <button className="w-10 h-10 rounded-xl bg-white border border-dark-green/5 flex items-center justify-center text-dark-green/30 hover:border-accent-green hover:text-accent-green transition-all font-black text-[10px]">2</button>
            <button className="w-10 h-10 rounded-xl bg-white border border-dark-green/5 flex items-center justify-center text-dark-green/30 hover:border-accent-green hover:text-accent-green transition-all">
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
