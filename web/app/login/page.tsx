"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/src/lib/supabase/browser";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const router = useRouter();

  /* ======================
     STATE NOTIFIKASI
  ====================== */
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     REGISTER STATE
  ====================== */
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);

  /* ======================
     LOGIN STATE
  ====================== */
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  /* ======================
     REGISTER
  ====================== */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: { data: { nama } },
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

  /* ======================
     LOGIN
  ====================== */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } =
      await supabaseBrowser.auth.signInWithPassword({
        email: emailLogin,
        password: passwordLogin,
      });

    if (error) {
      setLoading(false);
      const msg = error.message.toLowerCase();

      if (msg.includes("invalid login credentials")) {
        setErrorTitle("Kredensial Salah");
        setErrorMsg(
          "Email atau Password yang kamu masukkan tidak cocok."
        );
      } else if (
        msg.includes("email not found") ||
        msg.includes("user not found")
      ) {
        setErrorTitle("Email Tidak Ada");
        setErrorMsg(
          "Email ini belum terdaftar di sistem PatunganYuk."
        );
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

      {/* ======================
         STYLE
      ====================== */}
      <style jsx>{`
        @keyframes popIn {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-pop {
          animation: popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
        }
      `}</style>

      {/* ======================
         POPUP ERROR
      ====================== */}
      {showError && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-pop px-4 w-full max-w-sm">
          <div className="bg-white border-2 border-red-500 rounded-3xl p-5 shadow-2xl flex items-center gap-4">
            <div className="bg-red-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center">
              <i className="fas fa-triangle-exclamation"></i>
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-[10px] font-black uppercase text-red-600">
                {errorTitle}
              </h4>
              <p className="text-[10px] font-bold text-dark-green/70 uppercase mt-1">
                {errorMsg}
              </p>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="text-dark-green/20 hover:text-red-500"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* ======================
         BACK BUTTON
      ====================== */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-[110] flex items-center gap-2 hover:opacity-70 text-dark-green transition-all group bg-white/50 backdrop-blur-md py-2 px-5 rounded-full border border-dark-green/10 shadow-sm"
      >
        <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          Beranda
        </span>
      </Link>

      {/* ======================
         MAIN CONTAINER
      ====================== */}
      <div className={`container bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden w-full max-w-4xl min-h-[600px] border border-dark-green/5 ${isRightPanelActive ? "right-panel-active" : ""}`}>
        
        {/* LOGIN PANEL */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin} className="bg-white flex flex-col items-center justify-center h-full px-16 space-y-6">
            <Image src="/images/logo1.png" alt="logo" width={60} height={60} />

            <input
              type="email"
              placeholder="EMAIL"
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value)}
              className="w-full bg-milk border rounded-2xl p-4 text-[11px] font-black"
              required
            />

            <div className="relative w-full">
              <input
                type={showLoginPass ? "text" : "password"}
                placeholder="PASSWORD"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                className="w-full bg-milk border rounded-2xl p-4 pr-12 text-[11px] font-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowLoginPass(!showLoginPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <i className={`fas ${showLoginPass ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-green text-milk font-black py-5 rounded-2xl uppercase disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-circle-notch animate-spin"></i>
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
