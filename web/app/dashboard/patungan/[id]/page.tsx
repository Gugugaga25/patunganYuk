"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetailPatunganPage() {
  const params = useParams();
  const id = params.id;

  // --- DATA PESERTA (MOCK DATA) ---
  const allParticipants = [
    { addr: "0x882...91a", status: "Sudah Bayar", color: "text-green-500", img: "1" },
    { addr: "0x675...5E7e", status: "Belum Bayar", color: "text-red-500", img: "6" },
    { addr: "ywnzn.base.eth", status: "Sudah Bayar", color: "text-accent-green", img: "Felix" },
    { addr: "budisantoso.eth", status: "Sudah Bayar", color: "text-accent-green", img: "2" },
    { addr: "0x123...abc", status: "Belum Bayar", color: "text-red-500", img: "3" },
    { addr: "0x456...def", status: "Sudah Bayar", color: "text-green-500", img: "4" },
    { addr: "0x789...ghi", status: "Sudah Bayar", color: "text-green-500", img: "5" },
    { addr: "alice.base.eth", status: "Belum Bayar", color: "text-red-500", img: "7" },
    { addr: "bob.eth", status: "Sudah Bayar", color: "text-accent-green", img: "8" },
    { addr: "charlie.base.eth", status: "Sudah Bayar", color: "text-accent-green", img: "9" },
    { addr: "0x999...zzz", status: "Sudah Bayar", color: "text-green-500", img: "10" },
    { addr: "hacker.eth", status: "Belum Bayar", color: "text-red-500", img: "11" },
  ];

  // --- STATE UTAMA ---
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailKiri, setShowDetailKiri] = useState(false);
  const [showDetailKanan, setShowDetailKanan] = useState(false);
  const [showPopupTotal, setShowPopupTotal] = useState(false);

  const itemsPerPage = 10;
  const popupRef = useRef<HTMLDivElement>(null);
  const btnInfoRef = useRef<HTMLButtonElement>(null);

  // --- LOGIKA PENCARIAN & PAGINATION ---
  const filteredParticipants = allParticipants.filter((p) => p.addr.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredParticipants.slice(indexOfFirstItem, indexOfLastItem);

  // --- LOGIKA CLICK OUTSIDE POPUP ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) && btnInfoRef.current && !btnInfoRef.current.contains(event.target as Node)) {
        setShowPopupTotal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-6xl mx-auto text-dark-green">
      {/* Tombol Kembali */}
      <Link href="/dashboard/patungan" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-deep-gray hover:text-dark-green mb-6 transition-colors">
        <i className="fas fa-arrow-left"></i> Kembali ke Patungan Saya
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SEKSI KIRI: Informasi & Peserta */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-dark-green/5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-milk border border-dark-green/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  <i className="fas fa-umbrella-beach"></i>
                </div>
                <div>
                  <span className="text-[9px] font-black text-accent-green bg-accent-green/10 px-3 py-1 rounded-md uppercase tracking-widest">Kategori: Liburan</span>
                  <h1 className="text-3xl font-black uppercase italic tracking-tight mt-2">Sewa Villa Bali 3D2N</h1>
                  <p className="text-sm text-deep-gray font-bold mt-2">
                    Organizer: <span className="text-accent-green">@boss_kantor</span> · Berakhir: 30 Des 2025
                  </p>
                </div>
              </div>
              <span className="px-4 py-2 rounded-full bg-accent-green/10 text-accent-green text-[10px] font-black uppercase tracking-widest">Sedang Berjalan</span>
            </div>

            <div className="text-sm text-dark-green/70 leading-relaxed max-w-3xl mb-10">
              Halo teman-teman, ini patungan resmi untuk sewa Villa 5 Kamar di Seminyak. Total biaya sewa 10 Juta untuk 3 hari. Mohon partisipasinya ya!
              <br />
              <br />
              Dana akan otomatis dicairkan ke rekening pemilik villa jika target tercapai.
            </div>

            {/* Progress Bar & Detail Dana */}
            <div className="bg-milk p-6 rounded-2xl border border-dark-green/5 mb-8">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-[13px] font-black uppercase tracking-widest text-deep-gray">Dana Terkumpul</p>
                  <p className="text-xl font-black mt-2">
                    4.040.000 IDRX <span className="text-sm text-dark-green/60">/ 5.050.000 IDRX</span>
                  </p>
                </div>
                <span className="text-2xl font-black text-accent-green italic">80%</span>
              </div>
              <div className="w-full bg-white h-4 rounded-full border border-dark-green/5 p-1 overflow-hidden">
                <div className="bg-accent-green h-full rounded-full transition-all duration-1000" style={{ width: "80%" }}></div>
              </div>

              <button onClick={() => setShowDetailKiri(!showDetailKiri)} className="mt-4 font-black text-accent-green text-sm flex items-center gap-2 hover:opacity-70 transition-all">
                Detail Dana
                <i className={`fas fa-chevron-down text-[10px] transition-transform ${showDetailKiri ? "rotate-180" : ""}`}></i>
              </button>

              {showDetailKiri && (
                <div className="border-t border-dark-green/10 mt-4 pt-3 text-sm animate-fadeIn">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-deep-gray">Target Dana</span>
                      <span className="font-bold">5.000.000 IDRX</span>
                    </div>
                    <div className="flex justify-between text-accent-green">
                      <span>Platform Fee</span>
                      <span className="font-bold">+ 50.000 IDRX</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- BAGIAN DAFTAR PESERTA DENGAN SEARCH & PAGINATION --- */}
            <div className="bg-milk p-6 rounded-2xl border border-dark-green/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-sm font-black uppercase tracking-widest">Peserta ({filteredParticipants.length} Orang)</h3>
                <div className="relative w-full sm:w-64">
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-dark-green/30"></i>
                  <input
                    type="text"
                    placeholder="CARI ALAMAT / ENS..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-white border border-dark-green/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-accent-green/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4 min-h-[300px]">
                {currentItems.length > 0 ? (
                  currentItems.map((participant, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-dark-green/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <img className="w-9 h-9 rounded-full border-2 border-white shadow-sm" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.img}`} alt="avatar" />
                        <span className="text-xs font-bold font-mono">{participant.addr}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase ${participant.color}`}>{participant.status}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 opacity-30 italic text-xs uppercase font-black">Peserta tidak ditemukan...</div>
                )}
              </div>

              {/* Kontrol Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-dark-green/5 flex items-center justify-between">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="p-2 px-4 bg-white border border-dark-green/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-dark-green hover:text-milk transition-all">
                    Prev
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="p-2 px-4 bg-white border border-dark-green/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-dark-green hover:text-milk transition-all">
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ASIDE KANAN: Pembayaran */}
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-dark-green/5 shadow-sm sticky top-24">
            <h2 className="text-lg font-black uppercase tracking-widest mb-6 italic text-dark-green">Bayar Patungan</h2>
            <div className="bg-milk p-6 rounded-2xl border border-dark-green/5 mb-6 text-dark-green">
              <p className="text-[11px] font-black uppercase tracking-widest text-deep-gray">Nominal Patungan Anda</p>
              <p className="text-2xl font-black mt-2 italic">505.000 IDRX</p>

              <button onClick={() => setShowDetailKanan(!showDetailKanan)} className="mt-4 font-black text-accent-green text-[11px] flex items-center gap-2 uppercase transition-all hover:opacity-70">
                Detail Perincian
                <i className={`fas fa-chevron-down text-[10px] transition-transform ${showDetailKanan ? "rotate-180" : ""}`}></i>
              </button>

              {showDetailKanan && (
                <div className="border-t border-dark-green/10 mt-4 pt-3 text-xs space-y-3 animate-fadeIn">
                  <div className="flex justify-between text-deep-gray">
                    <span>Total Dana Grup</span>
                    <span>5.050.000 IDRX</span>
                  </div>
                  <div className="flex justify-between text-deep-gray">
                    <span>Jumlah Peserta</span>
                    <span>12 Orang</span>
                  </div>
                  <div className="border-t border-dark-green/5 pt-3 flex justify-between font-black items-center relative">
                    <div className="flex items-center gap-2">
                      <span>Per Orang</span>
                      <button ref={btnInfoRef} onClick={() => setShowPopupTotal(!showPopupTotal)} className="w-4 h-4 rounded-full border border-dark-green/40 text-[9px] font-black flex items-center justify-center text-dark-green hover:bg-dark-green hover:text-white transition">
                        ?
                      </button>
                    </div>
                    <span className="text-accent-green">505.000 IDRX</span>
                    {showPopupTotal && (
                      <div ref={popupRef} className="absolute right-0 top-full mt-3 w-56 bg-white border border-dark-green/10 rounded-xl p-4 text-[10px] shadow-2xl z-20">
                        <p className="font-black mb-2 uppercase text-dark-green/40">Logika Perhitungan:</p>
                        <p className="text-deep-gray font-medium leading-relaxed">Total Dana Patungan ÷ Jumlah Seluruh Peserta Grup</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button className="w-full bg-dark-green text-milk py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black active:scale-95 transition-all">Konfirmasi & Bayar</button>
            <p className="text-center text-[9px] font-bold text-deep-gray uppercase tracking-widest mt-6 opacity-70">
              <i className="fas fa-gas-pump mr-1 text-accent-green"></i> Gas fee ditanggung oleh Paymaster
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
