"use client";

import React, { useState } from "react";

interface Participant {
  addr: string;
  amount: string;
  img: string;
}

interface Project {
  id: string;
  name: string;
  organizer: string;
  participants: Participant[];
  target: number;
  collected: number;
  payoutSent: boolean;
  feeReady: number;
  targetMet: boolean;
}

export default function AdminWithdrawPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Mock Data Proyek Detail
  const [projects] = useState<Project[]>([
    {
      id: "01",
      name: "Sewa Villa Bali 3D2N",
      organizer: "@boss_kantor",
      participants: [
        { addr: "0x882...91a", amount: "500K", img: "1" },
        { addr: "ywnzn.base.eth", amount: "500K", img: "Felix" },
        { addr: "0x499...98a1", amount: "500K", img: "17" },
      ],
      target: 10000000,
      collected: 10000000,
      targetMet: true,
      payoutSent: true,
      feeReady: 100000,
    },
    {
      id: "02",
      name: "Meja Pingpong Kantor",
      organizer: "@staff_admin",
      participants: [
        { addr: "0x124...3a67", amount: "150K", img: "26" },
        { addr: "kea.eth", amount: "150K", img: "14" },
      ],
      target: 1500000,
      collected: 1500000,
      targetMet: true,
      payoutSent: false, // Belum terkirim ke penerima
      feeReady: 15000,
    },
  ]);

  const closeModal = () => setSelectedProject(null);

  return (
    <>
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-dark-green">
          Withdrawal <span className="text-accent-green">Authority</span>
        </h1>
        <p className="text-[11px] text-deep-gray font-bold uppercase tracking-[0.2em] mt-3 max-w-xl leading-relaxed">Verifikasi detail proyek sebelum mengeksekusi penarikan dana operasional platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-[2rem] p-6 border border-dark-green/5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-md transition-all">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-milk rounded-2xl flex items-center justify-center text-dark-green border border-dark-green/5 italic font-black shadow-inner">#{project.id}</div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-dark-green">{project.name}</h3>
                <p className="text-[9px] font-black text-accent-green uppercase tracking-widest mb-2">Fee Ready: IDRX {project.feeReady.toLocaleString()}</p>

                {/* Container Status Indikator Luar */}
                <div className="flex flex-wrap gap-2">
                  {/* Status 1: Target Dana */}
                  <span className={`inline-flex items-center border text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${project.targetMet ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-400"}`}>
                    <svg className="w-2.5 h-2.5 me-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Target {project.targetMet ? "Tercapai" : "Belum"}
                  </span>

                  {/* Status 2: Pengiriman Dana Utama */}
                  <span className={`inline-flex items-center border text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${project.payoutSent ? "bg-green-50 border-green-200 text-green-600" : "bg-orange-50 border-orange-200 text-orange-400"}`}>
                    <i className={`fas ${project.payoutSent ? "fa-paper-plane" : "fa-clock"} text-[8px] me-1.5`}></i>
                    {project.payoutSent ? "Dana Terkirim" : "Menunggu Payout"}
                  </span>

                  {/* Label Final: Siap Withdraw atau Terkunci */}
                  {project.targetMet && project.payoutSent ? (
                    <span className="inline-flex items-center bg-dark-green text-accent-green text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md animate-pulse">
                      <i className="fas fa-unlock text-[7px] me-1.5"></i>
                      Siap Withdraw
                    </span>
                  ) : (
                    <span className="inline-flex items-center bg-milk text-dark-green/20 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                      <i className="fas fa-lock text-[7px] me-1.5"></i>
                      Terkunci
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedProject(project)} className="w-full md:w-auto px-8 py-3 bg-dark-green text-milk rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 italic shadow-lg shadow-dark-green/10">
              Detail Project
            </button>
          </div>
        ))}
      </div>

      {/* --- MODAL DETAIL PROJECT --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-green/20 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-dark-green/5 overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="p-8 bg-milk/50 border-b border-dark-green/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-dark-green leading-none">Detail Kontrak</h2>
                <p className="text-[9px] font-bold text-deep-gray uppercase tracking-widest mt-2">
                  ID: {selectedProject.id} • {selectedProject.name}
                </p>
              </div>
              <button onClick={closeModal} className="w-10 h-10 rounded-full bg-white border border-dark-green/10 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Info Utama */}
              <div className="grid grid-cols-2 gap-4 text-dark-green">
                <div className="p-5 bg-milk rounded-3xl border border-dark-green/5">
                  <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-1">Dibuat Oleh</p>
                  <p className="text-sm font-black text-accent-green">{selectedProject.organizer}</p>
                </div>
                <div className="p-5 bg-milk rounded-3xl border border-dark-green/5">
                  <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-1">Target Dana</p>
                  <p className="text-sm font-black uppercase tracking-tighter italic">IDRX {selectedProject.target.toLocaleString()}</p>
                </div>
                <div className="p-5 bg-milk rounded-3xl border border-dark-green/5">
                  <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-1">Uang Terkumpul</p>
                  <p className="text-sm font-black text-dark-green uppercase tracking-tighter italic">IDRX {selectedProject.collected.toLocaleString()}</p>
                </div>
                <div className="p-5 bg-milk rounded-3xl border border-dark-green/5">
                  <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-1">Komisi Platform</p>
                  <p className="text-sm font-black text-accent-green uppercase tracking-tighter italic">IDRX {selectedProject.feeReady.toLocaleString()}</p>
                </div>
              </div>

              {/* Status Checklist */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Verifikasi Syarat</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-4 rounded-2xl border flex items-center gap-3 ${selectedProject.targetMet ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-500"}`}>
                    <i className={`fas ${selectedProject.targetMet ? "fa-check-circle" : "fa-times-circle"}`}></i>
                    <span className="text-[10px] font-black uppercase">Target Tercapai</span>
                  </div>
                  <div className={`p-4 rounded-2xl border flex items-center gap-3 ${selectedProject.payoutSent ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-500"}`}>
                    <i className={`fas ${selectedProject.payoutSent ? "fa-check-circle" : "fa-times-circle"}`}></i>
                    <span className="text-[10px] font-black uppercase">Dana Terkirim ke Penerima</span>
                  </div>
                </div>
              </div>

              {/* Daftar Partisipan */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Daftar Partisipan ({selectedProject.participants.length})</h4>
                <div className="bg-milk/30 rounded-3xl border border-dark-green/5 divide-y divide-dark-green/5">
                  {selectedProject.participants.map((p, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img className="w-8 h-8 rounded-full border border-white shadow-sm" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.img}`} alt="avatar" />
                        <span className="text-[10px] font-bold font-mono text-dark-green/60">{p.addr}</span>
                      </div>
                      <span className="text-[10px] font-black text-dark-green italic">IDRX {p.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer / Withdraw Action */}
            <div className="p-8 bg-milk/50 border-t border-dark-green/5">
              {selectedProject.targetMet && selectedProject.payoutSent ? (
                <button className="w-full py-5 bg-dark-green text-milk rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 italic">
                  <i className="fas fa-download text-accent-green"></i>
                  Withdraw Platform Fee
                </button>
              ) : (
                <div className="w-full py-5 bg-white border border-dashed border-dark-green/10 rounded-full text-dark-green/20 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 cursor-not-allowed">
                  <i className="fas fa-lock"></i>
                  Withdraw Locked
                </div>
              )}
              <p className="text-center text-[8px] font-bold text-deep-gray uppercase tracking-widest mt-4 opacity-40 italic">Platform Fee hanya bisa dicairkan setelah status kontrak "Completed" on-chain.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
