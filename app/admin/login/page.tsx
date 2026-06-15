"use client";

import Image from "next/image";
import { useActionState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { loginAdmin } from "../actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAdmin, { ok: false, message: "" });
  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-12 text-[#2D1F23]">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1080px] items-center justify-center">
        <form action={action} className="w-full max-w-[430px] rounded-[16px] border border-[#EBC8D2] bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[14px] border border-[#F0E4E8] bg-white shadow-sm">
              <Image src="/bc-logo.png" alt="Beauty Cosmetics" width={44} height={44} className="h-11 w-11 object-contain" priority />
            </span>
            <div>
              <div className="flex items-center gap-2 text-[#9E3659]">
                <ShieldCheck size={18} />
                <span className="text-[12px] font-bold uppercase tracking-[0.16em]">Panel seguro</span>
              </div>
              <h1 className="text-[28px] font-bold">Beauty Cosmetics</h1>
              <p className="text-[14px] text-[#6B6063]">Acceso administrativo</p>
            </div>
          </div>
          <label className="block text-[14px] font-bold text-[#4B4E5A]">Email o usuario</label>
          <input name="identifier" type="text" autoComplete="username" required maxLength={120} className="mt-2 h-12 w-full rounded-[6px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]" />
          <label className="mt-5 block text-[14px] font-bold text-[#4B4E5A]">Contraseña</label>
          <input name="password" type="password" autoComplete="current-password" required maxLength={256} className="mt-2 h-12 w-full rounded-[6px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]" />
          {state.message ? <p className={`mt-4 rounded-[6px] px-4 py-3 text-[14px] ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p> : null}
          <button disabled={pending} className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[6px] bg-[#9E3659] text-[15px] font-bold text-white transition-colors hover:bg-[#84304C] disabled:opacity-60"><LockKeyhole size={18} />{pending ? "Validando..." : "Ingresar"}</button>
        </form>
      </section>
    </main>
  );
}
