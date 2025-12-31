import React from "react";
import Link from "next/link";

export default function LaporkanValidatorPage() {
  return (
    <>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard/validator"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-deep-gray hover:text-dark-greenkGreen mb-6">
            <i className="fas fa-arrow-left"></i>
            Kembali ke Validator
          </Link>

          <div className="bg-white rounded-[2.5rem] p-10 border border-dark-green/5 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-black uppercase italic tracking-tight mb-2">
                Tolak / Laporkan Pencairan
              </h1>
              <p className="text-sm text-dark-green/60">
                Silakan isi alasan penolakan atau laporan jika terdapat ketidaksesuaian data pencairan.
              </p>
            </div>

            <div className="border-t border-dark-green/10 mt-4 pt-4 flex justify-between font-black"></div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest font-black mb-1 mt-2">
                Laporan untuk Patungan
              </p>
              <p className="text-lg font-black text-accent-green uppercase italic">
                BELI MEJA PINGPONG
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2">
                  Kategori Laporan
                </label>
                <select className="w-full p-4 rounded-2xl border border-dark-green/10 focus:outline-none text-sm">
                  <option>Rekening Tujuan Tidak Valid</option>
                  <option>Bukti Tidak Lengkap</option>
                  <option>Nominal Tidak Sesuai</option>
                  <option>Indikasi Penyalahgunaan Dana</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan alasan penolakan atau laporan secara singkat dan jelas..."
                  className="w-full p-4 rounded-2xl border border-dark-green/10 focus:outline-none resize-none text-sm">
                </textarea>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2">
                  Bukti Pendukung (Opsional)
                </label>
                <div className="border-2 border-dashed border-dark-green/20 rounded-2xl p-6 text-center text-sm text-dark-green/50">
                  <i className="fas fa-cloud-upload-alt mb-2 text-xl"></i>
                  <p>Upload screenshot / dokumen pendukung</p>
                  <input type="file" className="hidden" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Link
                  href="/dashboard/validator"
                  className="px-6 py-3 rounded-full border border-dark-green/20 text-xs font-black uppercase tracking-widest hover:bg-milk">
                  Batal
                </Link>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600">
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
    </>
  );
}
