"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HowToUse() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      id: "01",
      title: "Persiapan: Hubungkan Dompet",
      desc: "Sebelum memulai, pastikan kamu sudah menghubungkan dompet digitalmu (Coinbase Wallet atau MetaMask) ke jaringan Base. Tanpa dompet yang terhubung, kamu tidak bisa berinteraksi dengan brankas digital kami.",
      icon: "fa-wallet",
      color: "bg-blue-600",
    },
    {
      id: "02",
      title: "Membuat Kamar Patungan",
      desc: "Isi data kegiatan, target dana, dan batas waktu (deadline). Tentukan jumlah peserta dan alamat wallet penerima, lalu klik 'Deploy' untuk mengunci kesepakatan ke Blockchain.",
      icon: "fa-door-open",
      color: "bg-accent-green",
      details: ["Isi Data Kegiatan", "Tentukan Target & Penerima", "Undang Teman via Email", "Deploy ke On-Chain"],
    },
    {
      id: "03",
      title: "Membayar Tagihan",
      desc: "Dana kamu akan tersimpan aman di dalam Escrow Contract. Kamu bisa memantau progres pembayaran secara real-time tanpa perlu konfirmasi manual ke bendahara.",
      icon: "fa-file-invoice-dollar",
      color: "bg-dark-green",
      details: ["Dana Pokok + Admin Fee", "Escrow Security", "Real-time Progress Bar"],
    },
    {
      id: "04",
      title: "Verifikasi & Pencairan (The Validator)",
      desc: "Fitur Anti-Tilep! Sistem akan memilih peserta secara acak sebagai Validator. Dana hanya akan cair ke penerima jika para Validator memberikan suara setuju.",
      icon: "fa-check",
      color: "bg-purple-600",
      details: ["Pemilihan Juri Acak", "Voting via Validator Task", "Pencairan Otomatis"],
    },
  ];

  return (
    <div className="min-h-screen bg-milk text-dark-green selection:bg-accent-green selection:text-milk">
      <nav className="fixed w-full z-50 bg-milk/80 backdrop-blur-xl border-b border-dark-green/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all" onClick={() => router.push("/")}>
            <Image src="/images/logo1.png" alt="logo1" width={28} height={28} />
            <span className="font-black text-lg tracking-tight uppercase">
              Patungan<span className="text-accent-green">Yuk</span>
            </span>
          </div>
          <button onClick={() => router.push("/")} className="text-[10px] font-black uppercase tracking-[0.2em] border border-dark-green/10 px-4 py-2 rounded-full hover:bg-dark-green hover:text-milk transition-all duration-300">
            Kembali ke Beranda
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-24 text-center md:text-left">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              Panduan <br /> <span className="text-accent-green">Penggunaan.</span>
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-deep-gray font-medium leading-relaxed">Pelajari cara kerja ekosistem PatunganYuk untuk menjamin dana kamu aman dari penipuan melalui mekanisme verifikasi terdesentralisasi di jaringan Base.</p>
          </div>

          <div className="space-y-20 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-2 flex flex-col items-center">
                    <span className="text-5xl font-black opacity-10 block mb-4">{step.id}</span>
                    <div className={`w-14 h-14 ${step.color} rounded-[1.25rem] flex items-center justify-center text-2xl shadow-xl transition-transform duration-500 group-hover:scale-110`}>
                      <i className={`fa-solid ${step.icon} text-white`}></i>
                    </div>
                  </div>

                  <div className="md:col-span-10">
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-5 group-hover:text-accent-green transition-colors">{step.title}</h2>
                    <p className="text-deep-gray font-medium leading-relaxed mb-8 text-sm md:text-base">{step.desc}</p>

                    {step.details && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-dark-green/5">
                            <div className="w-1.5 h-1.5 bg-accent-green rounded-full shadow-sm shadow-accent-green"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {index !== steps.length - 1 && <div className="hidden md:block absolute left-[3.45rem] top-32 bottom-[-3rem] w-[2px] bg-gradient-to-b from-dark-green/10 to-transparent"></div>}
              </div>
            ))}
          </div>

          <div className="mt-32 p-12 bg-dark-green rounded-[4rem] text-milk relative overflow-hidden shadow-2xl shadow-dark-green/20">
            <div className="relative z-10">
              <div className="inline-block px-4 py-1 rounded-full bg-accent-green/20 text-accent-green text-[9px] font-black uppercase tracking-widest mb-6 border border-accent-green/20">Fitur Unggulan</div>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">Anti-Tilep dengan Validator</h3>
              <p className="max-w-xl text-milk/70 text-base font-medium leading-relaxed mb-10">Sistem Validator acak memastikan kejujuran kolektif yang dijaga langsung oleh Smart Contract. Dana hanya cair jika konsensus tercapai, menghilangkan risiko penyelewengan oleh admin tunggal.</p>
              <button onClick={() => router.push("/login")} className="bg-accent-green text-dark-green px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-milk hover:scale-105 transition-all shadow-xl">
                Coba Sekarang
              </button>
            </div>
            <i className="fa-solid fa-shield-halved absolute -right-16 -bottom-16 text-[22rem] opacity-5 -rotate-12 pointer-events-none"></i>
          </div>
        </div>
      </main>

      <footer className="py-16 border-t border-dark-green/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30">&copy; 2026 PatunganYuk. Built for Base Hackathon.</p>
      </footer>
    </div>
  );
}
