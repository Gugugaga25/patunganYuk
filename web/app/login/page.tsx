"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/src/lib/supabase/browser";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const router = useRouter();

  // State untuk Notifikasi & Loading
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // State Input Register (Mendukung Mixed-Case)
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);

  // State Input Login (Mendukung Mixed-Case)
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: { data: { nama: nama } },
    });

    setLoading(false);

    if (error) {
      setErrorTitle("Gagal Daftar");
      setErrorMsg(error.message);
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      return;
    }
    router.push("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email: emailLogin,
      password: passwordLogin,
    });

    if (error) {
      setLoading(false);
      const msg = error.message.toLowerCase();

      // LOGIKA PEMBEDA NOTIFIKASI
      if (msg.includes("invalid login credentials")) {
        setErrorTitle("Kredensial Salah");
        setErrorMsg("Email atau Password yang kamu masukkan tidak cocok.");
      } else if (msg.includes("email not found") || msg.includes("user not found")) {
        setErrorTitle("Email Tidak Ada");
        setErrorMsg("Email ini belum terdaftar di sistem PatunganYuk.");
      } else {
        setErrorTitle("Gagal Masuk");
        setErrorMsg(error.message);
      }

      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      return;
    }

    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 100);
  };

  return (
    <div className="bg-milk flex justify-center items-center flex-col h-screen overflow-hidden text-dark-green relative font-sans">
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
        @keyframes popIn {
          from {
            transform: translate(-50%, -20px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-pop {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* POPUP NOTIFIKASI ERROR */}
      {showError && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-pop px-4 w-full max-w-sm">
          <div className="bg-white border-2 border-red-500 rounded-3xl p-5 shadow-2xl flex items-center gap-4">
            <div className="bg-red-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
              <i className="fas fa-triangle-exclamation"></i>
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 leading-none">{errorTitle}</h4>
              <p className="text-[10px] font-bold text-dark-green/70 uppercase leading-tight mt-1">{errorMsg}</p>
            </div>
            <button onClick={() => setShowError(false)} className="text-dark-green/20 hover:text-red-500 transition-colors">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* Tombol Beranda */}
      <Link href="/" className="absolute top-6 left-6 z-[110] flex items-center gap-2 hover:opacity-70 text-dark-green transition-all group bg-white/50 backdrop-blur-md py-2 px-5 rounded-full border border-dark-green/10 shadow-sm">
        <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Beranda</span>
      </Link>

      <div className={`container bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden w-full max-w-4xl min-h-[600px] border border-dark-green/5 ${isRightPanelActive ? "right-panel-active" : ""}`}>
        {/* PANEL MASUK */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin} className="bg-white flex flex-col items-center justify-center h-full px-16 text-center space-y-6">
            <Image src="/images/logo1.png" alt="logo" width={60} height={60} />
            <div className="space-y-1">
              <h1 className="font-black text-4xl uppercase tracking-tighter text-dark-green">Masuk</h1>
              <p className="text-[9px] text-deep-gray font-bold uppercase tracking-[0.2em]">Gunakan Akun Anda</p>
            </div>
            <div className="w-full space-y-3">
              {/* input tanpa 'uppercase' untuk mendukung mixed-case */}
              <input type="email" placeholder="EMAIL" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} className="w-full bg-milk border border-dark-green/5 rounded-2xl p-4 text-[11px] font-black placeholder:uppercase tracking-widest outline-none focus:ring-2 focus:ring-accent-green/20 transition-all" required />

              <div className="relative w-full">
                <input type={showLoginPass ? "text" : "password"} placeholder="PASSWORD" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} className="w-full bg-milk border border-dark-green/5 rounded-2xl p-4 pr-12 text-[11px] font-black placeholder:uppercase tracking-widest outline-none focus:ring-2 focus:ring-accent-green/20 transition-all" required />
                <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-green/20 hover:text-accent-green transition-colors">
                  <i className={`fas ${showLoginPass ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-accent-green text-milk font-black py-5 rounded-2xl shadow-xl hover:bg-dark-green active:scale-95 text-[10px] uppercase tracking-[0.3em] transition-all disabled:opacity-50">
              {loading ? <i className="fas fa-circle-notch animate-spin"></i> : "Masuk Sekarang"}
            </button>
          </form>
        </div>

        {/* PANEL BUAT AKUN */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister} className="bg-white flex flex-col items-center justify-center h-full px-16 text-center space-y-4">
            <Image src="/images/logo1.png" alt="logo" width={50} height={50} />
            <div className="space-y-1">
              <h1 className="font-black text-3xl uppercase tracking-tighter text-dark-green">Buat Akun</h1>
              <p className="text-[9px] text-deep-gray font-bold uppercase tracking-[0.2em]">Mulai Perjalanan Web3 Anda</p>
            </div>
            <div className="w-full space-y-2">
              <input type="text" placeholder="NAMA LENGKAP" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full bg-milk border border-dark-green/5 rounded-2xl p-4 text-[10px] font-black placeholder:uppercase outline-none focus:ring-2 focus:ring-accent-green/20 transition-all" required />
              <input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-milk border border-dark-green/5 rounded-2xl p-4 text-[10px] font-black placeholder:uppercase outline-none focus:ring-2 focus:ring-accent-green/20 transition-all" required />

              <div className="relative w-full">
                <input type={showRegPass ? "text" : "password"} placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-milk border border-dark-green/5 rounded-2xl p-4 pr-12 text-[10px] font-black placeholder:uppercase tracking-widest outline-none focus:ring-2 focus:ring-accent-green/20 transition-all" required />
                <button type="button" onClick={() => setShowRegPass(!showRegPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-green/20">
                  <i className={`fas ${showRegPass ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                </button>
              </div>

              <div className="relative w-full">
                <input type={showRegConfirmPass ? "text" : "password"} placeholder="KONFIRMASI PASSWORD" className="w-full bg-milk border border-dark-green/5 rounded-2xl p-4 pr-12 text-[10px] font-black placeholder:uppercase tracking-widest outline-none focus:ring-2 focus:ring-accent-green/20 transition-all" required />
                <button type="button" onClick={() => setShowRegConfirmPass(!showRegConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-green/20">
                  <i className={`fas ${showRegConfirmPass ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-accent-green text-milk font-black py-5 rounded-2xl shadow-xl hover:bg-dark-green active:scale-95 text-[10px] uppercase tracking-[0.3em] transition-all disabled:opacity-50">
              {loading ? <i className="fas fa-circle-notch animate-spin"></i> : "Daftar Sekarang"}
            </button>
          </form>
        </div>

        {/* OVERLAY PANEL */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left px-12">
              <h1 className="font-black text-4xl mb-4 uppercase tracking-tighter leading-none text-white">Sudah Punya Akun?</h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] leading-loose mb-8 text-milk/80">Masuk kembali untuk memantau dana dan mengelola profil Anda.</p>
              <button onClick={() => setIsRightPanelActive(false)} className="border-2 border-milk text-milk font-black py-4 px-12 rounded-full uppercase text-[10px] tracking-[0.3em] hover:bg-milk hover:text-dark-green transition-all active:scale-95">
                Masuk
              </button>
            </div>
            <div className="overlay-panel overlay-right px-12">
              <h1 className="font-black text-4xl mb-4 uppercase tracking-tighter leading-none text-white">Halo, Teman!</h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] leading-loose mb-8 text-milk/80">Belum punya akun? Daftar sekarang dan mulai patungan transparan di Web3.</p>
              <button onClick={() => setIsRightPanelActive(true)} className="border-2 border-milk text-milk font-black py-4 px-12 rounded-full uppercase text-[10px] tracking-[0.3em] hover:bg-milk hover:text-dark-green transition-all active:scale-95">
                Daftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}