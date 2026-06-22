"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { ArrowLeft, LockKeyhole, MailCheck, ShieldCheck } from "lucide-react";
import { resendAdminOtp, startAdminLogin, verifyAdminLogin } from "../actions";
import PasswordField from "../components/PasswordField";

const initialCredState = { ok: false, message: "", step: "credentials" as const };
const initialOtpState = { ok: false, message: "", step: "otp" as const };

export default function AdminLoginPage() {
  const [credState, credAction, credPending] = useActionState(startAdminLogin, initialCredState);
  const [otpState, otpAction, otpPending] = useActionState(verifyAdminLogin, initialOtpState);
  const [resendState, resendAction, resendPending] = useActionState(resendAdminOtp, initialOtpState);

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (credState.ok && credState.step === "otp" && credState.challengeId) {
      setChallengeId(credState.challengeId);
      setStep("otp");
      setCooldown(30);
    }
  }, [credState]);

  useEffect(() => {
    if (resendState.ok) setCooldown(30);
  }, [resendState]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const otpMessage = otpState.message || resendState.message;
  const otpOk = resendState.ok && !otpState.message;

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-12 text-[#2D1F23]">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1080px] items-center justify-center">
        <div className="w-full max-w-[430px] rounded-[16px] border border-[#EBC8D2] bg-white p-8 shadow-sm">
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
              <p className="text-[14px] text-[#6B6063]">
                {step === "credentials" ? "Acceso administrativo" : "Verificación en dos pasos"}
              </p>
            </div>
          </div>

          {step === "credentials" ? (
            <form action={credAction}>
              <label className="block text-[14px] font-bold text-[#4B4E5A]">Email o usuario</label>
              <input
                name="identifier"
                type="text"
                autoComplete="username"
                required
                maxLength={120}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="mt-2 h-12 w-full rounded-[6px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]"
              />

              <div className="mt-5">
                <PasswordField
                  name="password"
                  label="Contraseña"
                  value={password}
                  onChange={setPassword}
                  required
                />
              </div>

              {credState.message ? (
                <p
                  className={`mt-4 rounded-[6px] px-4 py-3 text-[14px] ${
                    credState.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {credState.message}
                </p>
              ) : null}

              <button
                disabled={credPending}
                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[6px] bg-[#9E3659] text-[15px] font-bold text-white transition-colors hover:bg-[#84304C] disabled:opacity-60"
              >
                <LockKeyhole size={18} />
                {credPending ? "Validando..." : "Continuar"}
              </button>
            </form>
          ) : (
            <form action={otpAction}>
              <input type="hidden" name="challengeId" value={challengeId} />
              <input type="hidden" name="identifier" value={identifier} />
              <input type="hidden" name="password" value={password} />

              <div className="mb-5 flex items-center gap-3 rounded-[6px] bg-[#FCEDF0] px-4 py-3 text-[13px] text-[#7D123B]">
                <MailCheck size={18} strokeWidth={1.8} />
                {credState.maskedEmail
                  ? `Ingresa el código de 6 dígitos enviado a ${credState.maskedEmail}.`
                  : "Ingresa el código de 6 dígitos que enviamos a tu correo."}
              </div>

              <label className="block text-[14px] font-bold text-[#4B4E5A]">Código de verificación</label>
              <input
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={8}
                required
                autoFocus
                className="mt-2 h-12 w-full rounded-[6px] border border-[#C8CEDB] px-4 text-center text-[20px] font-bold tracking-[0.3em] outline-none focus:border-[#9E3659]"
              />

              {otpMessage ? (
                <p className={`mt-4 rounded-[6px] px-4 py-3 text-[14px] ${otpOk ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {otpMessage}
                </p>
              ) : null}

              <button
                disabled={otpPending}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[6px] bg-[#9E3659] text-[15px] font-bold text-white transition-colors hover:bg-[#84304C] disabled:opacity-60"
              >
                <ShieldCheck size={18} />
                {otpPending ? "Verificando..." : "Verificar código"}
              </button>

              <div className="mt-5 flex items-center justify-between text-[13px]">
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setChallengeId("");
                  }}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#5F5F61] transition-colors hover:text-[#9E3659]"
                >
                  <ArrowLeft size={14} /> Volver
                </button>

                <button
                  type="submit"
                  formAction={resendAction}
                  disabled={resendPending || cooldown > 0}
                  className="font-semibold text-[#9E3659] transition-colors hover:text-[#84304C] disabled:cursor-not-allowed disabled:text-[#C8AAB3]"
                >
                  {cooldown > 0 ? `Reenviar (${cooldown}s)` : resendPending ? "Reenviando..." : "Reenviar código"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}