"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";

const supabase = createClient();

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIKA: CEK SESSION SAAT MOUNT ---
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listener jika user login/logout di tab lain
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- LOGIKA: NAVIGASI CERDAS ---
  const handleProtectedAction = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-milk selection:bg-accent-green selection:text-milk">
      {/* 1. NAVBAR DENGAN LOGIN LOGIC */}
      <nav className="fixed w-full z-50 bg-milk/80 backdrop-blur-xl border-b border-dark-green/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <Image src="/images/logo1.png" alt="logo1" width={30} height={30} />
              <span className="font-extrabold text-lg tracking-tight uppercase text-dark-green">
                Patungan<span className="text-accent-green">Yuk</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-none space-x-8 items-center font-bold text-[10px] uppercase tracking-[0.15em] opacity-70 text-dark-green">
            <a href="info/howto" className="hover:text-accent-green transition">Cara Kerja</a>
            <a href="#fitur" className="hover:text-accent-green transition">Keunggulan</a>
            <a href="#faq" className="hover:text-accent-green transition">FAQ</a>
          </div>

          <div className="flex-1 flex items-center justify-end gap-4">
            {!loading && (
              <Link href={user ? "/dashboard" : "/login"} className="hidden md:block px-4 py-2 text-xs font-black uppercase tracking-widest hover:opacity-60 transition text-dark-green">
                {user ? "Dashboard" : "Masuk"}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-38 lg:pb-32 overflow-hidden bg-milk">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left order-2 lg:order-1">
              <h1 className="text-5xl md:text-6xl lg:text-6xl font-black leading-[0.95] tracking-tighter text-dark-green mb-8 uppercase">
                Patungan Tanpa <br />
                <span className="relative inline-block">Was-Was,</span>
                <br />
                Dijamin <span className="text-accent-green">Anti-Tilep.</span>
              </h1>

              <p className="text-base md:text-sm text-deep-gray max-w-xl mb-8 font-medium leading-relaxed">Platform penggalangan dana grup 100% terdesentralisasi. Dana dikunci Smart Contract dan disalurkan langsung dalam bentuk IDRX ke dompet tujuan.</p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button 
                  onClick={handleProtectedAction}
                  className="px-7 py-3.5 bg-dark-green text-milk rounded-full font-black text-[10px] uppercase tracking-wider hover:scale-105 transition-all shadow-xl active:scale-95"
                >
                  Buat Patungan Sekarang
                </button>
              </div>

              <div className="pt-7 border-t border-dark-green/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-green/30 mb-5">Integration on:</p>
                <div className="flex flex-wrap items-center gap-7">
                  <div className="flex items-center gap-2.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0">
                    <div className="w-5 h-5 bg-blue-600 rounded-full shadow-sm"></div>
                    <span className="font-black uppercase text-[10px] tracking-tighter text-dark-green">Base Network</span>
                  </div>
                  <div className="flex items-center gap-2.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0">
                    <div className="w-5 h-5 bg-accent-green rounded-full shadow-sm"></div>
                    <span className="font-black uppercase text-[10px] tracking-tighter text-dark-green">IDRX Native</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md w-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-accent-green/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="relative grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-7 relative w-full aspect-[4/5]">
                    <Image src="/images/landing/hero (1).jpeg" alt="Team collaboration" fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover rounded-l-[2.5rem] rounded-r-xl shadow-xl border-4 border-white grayscale hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="col-span-5 space-y-2">
                    <div className="relative w-full aspect-square">
                      <Image src="/images/landing/hero (2).jpeg" alt="Business meeting" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover rounded-tr-[4rem] rounded-bl-xl rounded-tl-xl rounded-br-xl shadow-lg border-2 border-white" />
                    </div>
                    <div className="relative w-full aspect-[4/3]">
                      <Image src="/images/landing/hero (5).jpeg" alt="Success project" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover rounded-xl shadow-lg border-2 border-white" />
                    </div>
                    <div className="relative w-full aspect-square">
                      <Image src="/images/landing/hero (4).jpeg" alt="Community" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover rounded-br-[4rem] rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-lg border-2 border-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tighter leading-none">
                Uang patungan sering <span className="text-red-500">dibawa lari</span> admin?
                <br />
                <span className="text-accent-green">Stop sekarang.</span>
              </h2>
              <p className="text-base text-deep-gray mb-8 font-medium leading-relaxed">Trust issue adalah penghambat utama kolaborasi. PatunganYuk menghilangkan peran "bendahara manusia" dan menggantinya dengan kode yang tidak bisa berbohong.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <i className="fa-solid fa-xmark text-red-500 mt-1"></i>
                  <span className="text-dark-green font-bold uppercase text-[11px] tracking-wide">Pencairan tanpa persetujuan (Tilep) mustahil terjadi.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <i className="fa-solid fa-xmark text-red-500 mt-1"></i>
                  <span className="text-dark-green font-bold uppercase text-[11px] tracking-wide">Aliran dana IDRX tercatat permanen di blockchain explorer.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <i className="fa-solid fa-xmark text-red-500 mt-1"></i>
                  <span className="text-dark-green font-bold uppercase text-[11px] tracking-wide">Dana mengendap di bank pribadi dilarang keras.</span>
                </li>
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-accent-green rounded-[2.5rem] transform rotate-2 opacity-10"></div>
              <div className="bg-milk border border-dark-green/5 p-10 rounded-[2.5rem] shadow-xl relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-dark-green text-milk rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-tight text-dark-green">On-Chain Escrow</h3>
                    <p className="text-[10px] font-bold text-accent-green uppercase tracking-widest">Keamanan Digital Tanpa Perantara</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-dark-green/5 shadow-sm">
                    <i className="fa-solid fa-check text-accent-green"></i>
                    <span className="font-bold text-dark-green text-[11px] uppercase">Dana dikunci otomatis oleh Smart Contract</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-dark-green/5 shadow-sm">
                    <i className="fa-solid fa-check text-accent-green"></i>
                    <span className="font-bold text-dark-green text-[11px] uppercase">Rilis dana IDRX butuh konsensus Validator</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-dark-green/5 shadow-sm">
                    <i className="fa-solid fa-check text-accent-green"></i>
                    <span className="font-bold text-dark-green text-[11px] uppercase">Pencairan Instan IDRX ke dompet tujuan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARA KERJA */}
      <section id="cara-kerja" className="py-24 bg-milk">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-dark-green">Cara Kerja Simple</h2>
            <p className="text-deep-gray text-base font-medium">Native Web3 experience dengan kenyamanan aplikasi Fintech konvensional.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-dark-green">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-dark-green/5 transition hover:-translate-y-2">
              <div className="w-12 h-12 bg-dark-green text-milk rounded-2xl flex items-center justify-center text-xl font-black mb-6 shadow-md">1</div>
              <h3 className="font-black text-base uppercase mb-3 leading-tight">Setup Dompet Tujuan</h3>
              <p className="text-[12px] text-deep-gray font-medium leading-relaxed">Tentukan target dana, deadline, dan alamat wallet penerima IDRX.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-dark-green/5 transition hover:-translate-y-2">
              <div className="w-12 h-12 bg-dark-green text-milk rounded-2xl flex items-center justify-center text-xl font-black mb-6 shadow-md">2</div>
              <h3 className="font-black text-base uppercase mb-3 leading-tight">Setor IDRX (Gasless)</h3>
              <p className="text-[12px] text-deep-gray font-medium leading-relaxed">Peserta kirim IDRX tanpa biaya gas (Sponsored). Dana aman di contract.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-dark-green/5 transition hover:-translate-y-2">
              <div className="w-12 h-12 bg-dark-green text-milk rounded-2xl flex items-center justify-center text-xl font-black mb-6 shadow-md">3</div>
              <h3 className="font-black text-base uppercase mb-3 leading-tight">Validasi Kolektif</h3>
              <p className="text-[12px] text-deep-gray font-medium leading-relaxed">Peserta yang dipilih acak memverifikasi bukti pengeluaran on-chain.</p>
            </div>
            <div className="bg-accent-green p-8 rounded-3xl shadow-xl transition hover:-translate-y-2 text-milk">
              <div className="w-12 h-12 bg-milk text-accent-green rounded-2xl flex items-center justify-center text-xl font-black mb-6 shadow-md">4</div>
              <h3 className="font-black text-base uppercase mb-3 leading-tight">Instant Payout</h3>
              <p className="text-[12px] text-milk/80 font-medium leading-relaxed">Dana IDRX otomatis terkirim ke dompet tujuan secara instan setelah disetujui.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-dark-green">
          <h2 className="text-4xl font-black text-center mb-16 uppercase tracking-tighter">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {[
              { q: "Apakah dana dicairkan ke rekening bank?", a: "Tidak. Kami menjaga ekosistem tetap aman di blockchain. Dana dicairkan dalam bentuk IDRX langsung ke wallet tujuan (misal: wallet vendor atau pemilik properti)." },
              { q: "Kenapa harus menggunakan dompet digital?", a: "Dompet digital menjamin kepemilikan dana secara mandiri. Dengan Smart Wallet, Anda bahkan tidak perlu menyimpan private key rumit." },
              { q: "Seberapa aman transaksi di platform ini?", a: "Sangat aman. Setiap transaksi dikelola oleh Smart Contract yang telah diaudit, memastikan transparansi mutlak di blockchain Base." },
            ].map((faq, i) => (
              <details key={i} className="group bg-milk p-6 rounded-2xl border border-dark-green/10 cursor-pointer transition-all duration-300 hover:border-dark-green/30 hover:shadow-sm">
                <summary className="flex justify-between items-center font-bold text-sm list-none uppercase tracking-wide select-none">
                  {faq.q}
                  <svg className="w-5 h-5 text-green-600 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-sm text-deep-gray mt-4 leading-relaxed font-medium border-t border-dark-green/5 pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-24 bg-dark-green text-milk text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-none">
            Mulai Patungan <br /> Tanpa Rasa Curiga.
          </h2>
          <p className="text-sm text-milk/60 font-medium mb-12 max-w-lg mx-auto leading-relaxed uppercase tracking-widest">Satukan tujuan, amankan dana. Selamat datang di masa depan kolaborasi finansial di Jaringan Base.</p>
          <button 
            onClick={handleProtectedAction}
            className="inline-block bg-milk text-dark-green font-black px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95"
          >
            {user ? "Buka Dashboard Sekarang" : "Buat Akun & Mulai Sekarang"}
          </button>
        </div>
        <i className="fa-brands fa-ethereum absolute -bottom-10 -left-10 text-[15rem] opacity-5 -rotate-12 pointer-events-none"></i>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-milk py-16 border-t border-dark-green/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-dark-green">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Image src="/images/logo1.png" alt="logo1" width={30} height={30} />
              <span className="font-black text-xl tracking-tight uppercase">
                Patungan<span className="text-accent-green">Yuk</span>
              </span>
            </div>
            <p className="max-w-xs text-[11px] text-deep-gray font-medium leading-relaxed uppercase tracking-wider">Platform Native IDRX Group Funding pertama di Base Blockchain. Aman, Transparan, Gasless.</p>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-dark-green/50">Developer</h4>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-dark-green/80">
              <li><a href="https://basescan.org" target="_blank" rel="noopener noreferrer" className="hover:text-accent-green transition">Smart Contract</a></li>
              <li><a href="https://basescan.org" target="_blank" rel="noopener noreferrer" className="hover:text-accent-green transition">Base Explorer</a></li>
              <li><a href="https://idrx.gitbook.io/idrx-docs/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-green transition">IDRX Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-dark-green/50">Panduan</h4>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-dark-green/80">
              <li><a href="/info/howto" className="hover:text-accent-green transition">Cara Penggunaan</a></li>
              <li><a href="#faq" className="hover:text-accent-green transition">FAQ</a></li>
              <li><a href="#" className="hover:text-accent-green transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-dark-green/20 text-[9px] font-black text-dark-green/50 uppercase tracking-[0.5em] text-center">&copy; 2026 PatunganYuk. Built on Base for Hackathon.</div>
      </footer>
    </div>
  );
}