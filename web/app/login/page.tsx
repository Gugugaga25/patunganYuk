"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const router = useRouter();

  // Fungsi Bypass: Langsung ke Dashboard
  const handleBypassLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="bg-milk flex justify-center items-center flex-col h-screen overflow-hidden text-dark-green relative">
      {/* CSS Lokal untuk Animasi Sliding */}
      <style jsx>{`
        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }
        .sign-in-container {
          left: 0;
          width: 50%;
          z-index: 2;
        }
        .sign-up-container {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }
        .container.right-panel-active .sign-in-container {
          transform: translateX(100%);
        }
        .container.right-panel-active .sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: show 0.6s;
        }
        @keyframes show {
          0%,
          49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%,
          100% {
            opacity: 1;
            z-index: 5;
          }
        }
        .overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.6s ease-in-out;
          z-index: 100;
        }
        .container.right-panel-active .overlay-container {
          transform: translateX(-100%);
        }
        .overlay {
          background: linear-gradient(135deg, #0a2e20 0%, #12b76a 100%);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: 0 0;
          color: #fdfdf1;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }
        .container.right-panel-active .overlay {
          transform: translateX(50%);
        }
        .overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }
        .overlay-left {
          transform: translateX(-20%);
        }
        .container.right-panel-active .overlay-left {
          transform: translateX(0);
        }
        .overlay-right {
          right: 0;
          transform: translateX(0);
        }
        .container.right-panel-active .overlay-right {
          transform: translateX(20%);
        }
      `}</style>

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent-green/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-dark-green/5 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Tombol Kembali */}
      <Link href="/" className="absolute top-6 left-6 z-[110] flex items-center gap-2 hover:opacity-70 text-dark-green transition-all group bg-white/50 backdrop-blur-md py-2 px-5 rounded-full border border-dark-green/10 shadow-sm">
        <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Beranda</span>
      </Link>

      {/* Main Container */}
      <div className={`container bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden w-full max-w-4xl min-h-[600px] border border-dark-green/5 ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleBypassLogin} className="bg-white flex flex-col items-center justify-center h-full px-12 text-center">
            <div className="mb-4">
              <div className="w-12 h-12 bg-dark-green rounded-xl flex items-center justify-center text-milk font-black text-xl mx-auto mb-2 shadow-lg rotate-3">P</div>
            </div>
            <h1 className="font-black text-3xl uppercase italic tracking-tighter mb-2 text-dark-green">Masuk</h1>
            <p className="text-[11px] text-deep-gray font-bold uppercase tracking-widest mb-6">Akses Dashboard Patungan</p>

            {/* Tombol Masuk Instan (Bypass) */}
            <button type="submit" className="w-full bg-dark-green text-milk font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition transform hover:scale-[1.02] shadow-xl active:scale-95 mb-6 text-xs uppercase tracking-widest">
              <i className="fas fa-sign-in-alt"></i>
              Masuk Sekarang
            </button>

            <div className="relative w-full mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-dark-green/10"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black">
                <span className="px-2 bg-white text-deep-gray tracking-tighter">Atau via Wallet</span>
              </div>
            </div>

            <button type="button" onClick={() => handleBypassLogin()} className="text-dark-green text-[10px] font-bold uppercase tracking-widest hover:text-accent-green transition">
              Connect Wallet (Bypass)
            </button>
          </form>
        </div>

        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleBypassLogin} className="bg-white flex flex-col items-center justify-center h-full px-12 text-center">
            <h1 className="font-black text-3xl uppercase italic tracking-tighter mb-2 text-dark-green">Buat Akun</h1>
            <p className="text-[11px] text-deep-gray font-bold uppercase tracking-widest mb-8">Mulai patungan aman sekarang</p>
            <button type="submit" className="w-full bg-accent-green text-milk font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition transform hover:scale-[1.02] shadow-xl active:scale-95 text-xs uppercase tracking-widest">
              Daftar Instan
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left px-12">
              <h1 className="font-black text-3xl mb-4 uppercase italic tracking-tighter">Sudah Punya Akun?</h1>
              <p className="text-[11px] font-bold uppercase tracking-widest leading-loose mb-8 text-milk/80">Masuk kembali untuk memantau dana.</p>
              <button onClick={() => setIsRightPanelActive(false)} className="bg-transparent border-2 border-milk text-milk font-black py-3 px-12 rounded-full uppercase text-[10px] tracking-[0.2em] transform transition hover:bg-milk hover:text-dark-green active:scale-95">
                Masuk
              </button>
            </div>

            <div className="overlay-panel overlay-right px-12">
              <h1 className="font-black text-3xl mb-4 uppercase italic tracking-tighter">Halo, Teman!</h1>
              <p className="text-[11px] font-bold uppercase tracking-widest leading-loose mb-8 text-milk/80">Belum punya akun? Daftar sekarang gratis.</p>
              <button onClick={() => setIsRightPanelActive(true)} className="bg-transparent border-2 border-milk text-milk font-black py-3 px-12 rounded-full uppercase text-[10px] tracking-[0.2em] transform transition hover:bg-milk hover:text-dark-green active:scale-95">
                Daftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
