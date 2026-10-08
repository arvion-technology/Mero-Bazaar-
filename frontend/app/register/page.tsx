"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiMapPin,
  FiArrowRight, FiArrowLeft, FiShoppingBag, FiBriefcase,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { api } from "../../lib/api";
import type { RegisterPayload } from "../types/auth";
import { signIn } from "next-auth/react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FormState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
};
type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter your full name";
  const email = f.email.trim();
  if (!email) e.email = "Email is required";
  else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address";
  if (f.address.trim().length < 3) e.address = "Enter your address";
  if (!f.password) e.password = "Password is required";
  else if (f.password.length < 8) e.password = "Use at least 8 characters";
  else if (!/[A-Za-z]/.test(f.password) || !/[0-9]/.test(f.password))
    e.password = "Include at least one letter and one number";
  if (!f.confirmPassword) e.confirmPassword = "Confirm your password";
  else if (f.confirmPassword !== f.password) e.confirmPassword = "Passwords do not match";
  return e;
}

function getStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.max(1, score);
}

/* ── shared classes ── */
const inputBase =
  "w-full rounded-lg border-0 bg-[#f0ecec] py-3 pl-10 text-sm text-[#333] outline-none transition-all duration-200 placeholder:text-[#aaa] focus:bg-[#e8e4e4] focus:shadow-[0_0_0_2px_rgba(192,57,43,0.15)]";
const socialBtn =
  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-[1.5px] border-[#e5e5e5] bg-white p-2.5 font-[inherit] text-xs font-semibold text-[#555] transition-all duration-200 hover:border-[#ccc] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60";
const primaryBtn =
  "mx-auto flex w-fit min-w-[140px] cursor-pointer items-center justify-center gap-1.5 rounded-lg border-0 bg-[#C0392B] px-8 py-3 font-[inherit] text-sm font-semibold text-white transition-all duration-200 enabled:hover:-translate-y-px enabled:hover:bg-[#A93226] enabled:hover:shadow-[0_4px_12px_rgba(192,57,43,0.3)] disabled:cursor-not-allowed disabled:opacity-60";
const toggleBtn =
  "absolute right-2.5 top-1/2 flex -translate-y-1/2 cursor-pointer items-center border-0 bg-transparent p-1 text-[15px] text-[#aaa] hover:text-[#C0392B]";
const stepAnim = "animate-[fadeIn_0.3s_ease]";

const districts = [
  "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Butwal",
  "Biratnagar", "Birgunj", "Dhangadhi", "Nepalgunj", "Hetauda", "Dharan",
  "Itahari", "Janakpur", "Lumbini", "Gorkha", "Mustang", "Solukhumbu",
];
void districts; // currently unused — remove if you no longer need it

function Field({
  id, label, icon, error, children,
}: {
  id: string; label: string; icon: React.ReactNode; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#333]">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-[15px] text-[#aaa]">
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" className="text-[11.5px] text-red-500">{error}</span>
      )}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = getStrength(password);
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const color = colors[score - 1] || "#eee";

  return (
    <>
      <div className="mt-[5px] flex gap-[3px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-sm transition-[background] duration-300"
            style={{ background: i <= score ? color : "#ddd" }}
          />
        ))}
      </div>
      <div className="mt-[3px] text-[11px] font-medium" style={{ color }}>
        {labels[score - 1] || ""}
      </div>
    </>
  );
}

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [accountType, setAccountType] = useState<"buyer" | "seller" | null>(
    searchParams.get("seller") === "true" ? "seller" : null
  );
  const [authError, setAuthError] = useState<{ tempToken: string; provider: string } | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const [form, setForm] = useState<FormState>({
    fullName: "", email: "", password: "", confirmPassword: "", address: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(form);
  const err = (k: keyof Errors) => (touched[k] || submitted ? errors[k] : undefined);
  const ring = (k: keyof Errors) => (err(k) ? "ring-1 ring-red-500" : "");
  const termsError = submitted && !agreed ? "Please accept the Terms and Privacy Policy" : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // pending 2FA state
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/pending-2fa");
      const pending = await res.json().catch(() => null);
      if (pending?.tempToken) {
        setAuthError({ tempToken: pending.tempToken, provider: pending.provider });
      }
    })();
  }, []);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountType) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0 || !agreed) return;

    try {
      setLoading(true);
      const payload: RegisterPayload = {
        email: form.email.trim(),
        password: form.password,
        name: form.fullName.trim(),
        role: accountType === "seller" ? "VENDOR" : "USER",
        address: form.address.trim(),
      };
      await api.register(payload);
      // Registration returns an access token we don't need (user goes to login) — never persist it.
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "facebook") => {
    if (!accountType) {
      toast.warn("Please select role first!");
      return;
    }
    const setBusy = provider === "google" ? setGoogleLoading : setFacebookLoading;
    const label = provider === "google" ? "Google" : "Facebook";
    setBusy(true);
    try {
      await fetch("/api/register/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: accountType === "seller" ? "VENDOR" : "USER" }),
      });
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      toast.error(`${label} sign-in failed. Please try again.`);
      setBusy(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setOtpSubmitting(true);
    setOtpError("");

    try {
      if (!otp || otp.length < 6) {
        setOtpError("Enter the 6-digit code we sent you.");
        return;
      }
      if (!authError) return;

      const res = await signIn("otp", {
        tempToken: authError.tempToken,
        otp,
        provider: authError.provider,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid or expired OTP");
        setOtpError("Invalid or expired code. Please try again.");
        return;
      }
      toast.success("Login successful!");
      setTimeout(() => router.push("/user/dashboard"), 800);
    } finally {
      submittingRef.current = false;
      setOtpSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />

      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10 font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif] max-[480px]:p-0">
        <div className="flex min-h-[560px] w-full max-w-[900px] overflow-hidden rounded-[32px] border border-[#f0f0f0] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-md:max-w-[420px] max-md:flex-col max-[480px]:min-h-screen max-[480px]:rounded-none max-[480px]:shadow-none">
          {/* ── Left panel ── */}
          <aside className="flex flex-[0_0_380px] flex-col items-center justify-center rounded-r-[80px] bg-[#C0392B] px-10 py-12 text-center max-md:min-h-[180px] max-md:flex-none max-md:rounded-b-[40px] max-md:rounded-r-none max-md:px-6 max-md:py-8 max-[480px]:rounded-b-[32px]">
            <h1 className="mb-3 text-4xl font-bold text-white max-md:text-[28px]">Welcome to HamroNepal Bazaar</h1>
            <p className="mb-7 text-sm leading-normal text-white/80">Already have an account? Sign in here</p>
            <Link
              href="/login"
              className="inline-block cursor-pointer rounded-3xl border-2 border-white/40 bg-white/20 px-10 py-3 text-sm font-semibold text-white! no-underline transition-all duration-200 hover:border-white/60 hover:bg-white/30"
            >
              SIGN IN
            </Link>
          </aside>

          {/* ── Right panel ── */}
          <div className="flex flex-1 flex-col justify-center px-14 py-12 max-md:px-6 max-md:py-8 max-[480px]:px-5 max-[480px]:py-6">
            <h2 className="mb-1.5 text-center text-[28px] font-bold text-[#C0392B]">
              {authError ? "Verify Code" : step === 1 ? "Sign Up" : "Complete Profile"}
            </h2>
            <p className="mb-6 text-center text-[13px] text-[#999]">
              {authError ? "Two-factor authentication" : step === 1 ? "Enter your Personal Information" : "Step 2 of 2"}
            </p>
            <div className="mb-6 h-px bg-[#ddd]" />

            {/* ── 2FA OTP ── */}
            {authError ? (
              <div className={stepAnim}>
                <p className="mb-4 text-[13px] text-[#666]">
                  Enter the 6-digit code sent to your phone to finish signing in.
                </p>
                {otpError && <p role="alert" className="mb-3 text-[11.5px] text-red-500">{otpError}</p>}
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  aria-label="6-digit verification code"
                  className={`${inputBase} mb-4 pr-3.5 text-center text-xl tracking-[6px]`}
                />
                <div className="mt-2 flex flex-col items-center gap-2.5">
                  <button type="button" className={primaryBtn} onClick={handleVerifyOtp} disabled={otpSubmitting}>
                    {otpSubmitting ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </div>
            ) : step === 1 ? (
              /* ── Step 1 ── */
              <div className={stepAnim}>
                <form onSubmit={handleStep1}>
                  <div role="radiogroup" aria-label="Account type" className="mb-5 grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
                    {([
                      { type: "buyer", icon: FiShoppingBag, label: "Buy & Discover", desc: "Browse listings & find deals" },
                      { type: "seller", icon: FiBriefcase, label: "Sell & Grow", desc: "List products & reach buyers" },
                    ] as const).map((opt) => {
                      const selected = accountType === opt.type;
                      return (
                        <div
                          key={opt.type}
                          role="radio"
                          aria-checked={selected}
                          tabIndex={0}
                          onClick={() => setAccountType(opt.type)}
                          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setAccountType(opt.type)}
                          className={`cursor-pointer rounded-xl border-2 px-4 py-5 text-center transition-all duration-200 hover:border-[#C0392B] hover:shadow-[0_2px_12px_rgba(192,57,43,0.1)] ${
                            selected ? "border-[#C0392B] bg-[#fef2f2]" : "border-[#eee] bg-[#fafafa]"
                          }`}
                        >
                          <div
                            className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-[10px] transition-all duration-200 ${
                              selected ? "bg-[#C0392B] text-white" : "bg-[#eee] text-[#666]"
                            }`}
                          >
                            <opt.icon size={20} />
                          </div>
                          <div className="mb-[3px] text-[13px] font-bold text-[#222]">{opt.label}</div>
                          <div className="text-[11px] text-[#999]">{opt.desc}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mb-3 flex gap-2.5 max-[480px]:flex-col">
                    <button type="button" className={socialBtn} onClick={() => handleSocial("google")} disabled={googleLoading || facebookLoading || !accountType}>
                      {googleLoading ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/15 border-t-[#555]" />
                      ) : (
                        <FcGoogle size={16} />
                      )}
                      {googleLoading ? "Signing in..." : "Google"}
                    </button>
                    <button type="button" className={socialBtn} onClick={() => handleSocial("facebook")} disabled={googleLoading || facebookLoading || !accountType}>
                      {facebookLoading ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/15 border-t-[#1877F2]" />
                      ) : (
                        <FaFacebook size={16} color="#1877F2" />
                      )}
                      {facebookLoading ? "Signing in..." : "Facebook"}
                    </button>
                  </div>

                  <div className="my-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#eee]" />
                    <span className="whitespace-nowrap text-[11px] font-medium text-[#bbb]">or</span>
                    <div className="h-px flex-1 bg-[#eee]" />
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-2.5">
                    <button type="submit" className={primaryBtn} disabled={!accountType}>
                      Continue <FiArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ── Step 2 ── */
              <div className={stepAnim}>
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  <Field id="reg-fullname" label="Full Name" icon={<FiUser size={15} />} error={err("fullName")}>
                    <input
                      id="reg-fullname"
                      name="fullName"
                      type="text"
                      placeholder="Enter your name"
                      className={`${inputBase} pr-3.5 ${ring("fullName")}`}
                      value={form.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                      aria-invalid={!!err("fullName")}
                      aria-describedby={err("fullName") ? "reg-fullname-error" : undefined}
                    />
                  </Field>

                  <Field id="reg-email" label="Email" icon={<FiMail size={15} />} error={err("email")}>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`${inputBase} pr-3.5 ${ring("email")}`}
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      aria-invalid={!!err("email")}
                      aria-describedby={err("email") ? "reg-email-error" : undefined}
                    />
                  </Field>

                  <Field id="reg-address" label="Address" icon={<FiMapPin size={15} />} error={err("address")}>
                    <input
                      id="reg-address"
                      name="address"
                      type="text"
                      placeholder="Enter your address"
                      className={`${inputBase} pr-3.5 ${ring("address")}`}
                      value={form.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="street-address"
                      aria-invalid={!!err("address")}
                      aria-describedby={err("address") ? "reg-address-error" : undefined}
                    />
                  </Field>

                  <div>
                    <Field id="reg-password" label="Password" icon={<FiLock size={15} />} error={err("password")}>
                      <input
                        id="reg-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className={`${inputBase} pr-[42px] ${ring("password")}`}
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="new-password"
                        aria-invalid={!!err("password")}
                        aria-describedby={err("password") ? "reg-password-error" : undefined}
                      />
                      <button
                        type="button"
                        className={toggleBtn}
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    </Field>
                    {form.password.length > 0 && <PasswordStrength password={form.password} />}
                  </div>

                  <Field id="reg-confirm" label="Confirm Password" icon={<FiLock size={15} />} error={err("confirmPassword")}>
                    <input
                      id="reg-confirm"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Enter confirm password"
                      className={`${inputBase} pr-[42px] ${
                        err("confirmPassword")
                          ? "ring-1 ring-red-500"
                          : form.confirmPassword && form.confirmPassword === form.password
                            ? "ring-1 ring-green-500"
                            : ""
                      }`}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                      aria-invalid={!!err("confirmPassword")}
                      aria-describedby={err("confirmPassword") ? "reg-confirm-error" : undefined}
                    />
                    <button
                      type="button"
                      className={toggleBtn}
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </Field>

                  <div>
                    <div className="my-1 flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="reg-agree"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 h-[15px] w-[15px] shrink-0 cursor-pointer accent-[#C0392B]"
                      />
                      <label htmlFor="reg-agree" className="text-xs leading-normal text-[#666]">
                        I agree to the{" "}
                        <Link href="/terms" className="font-semibold text-[#C0392B]! no-underline hover:underline">Terms</Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="font-semibold text-[#C0392B]! no-underline hover:underline">Privacy Policy</Link>
                      </label>
                    </div>
                    {termsError && <span role="alert" className="text-[11.5px] text-red-500">{termsError}</span>}
                  </div>

                  <div className="mt-2 flex flex-col items-center gap-2.5">
                    <button type="submit" className={primaryBtn} disabled={loading}>
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Registering...
                        </>
                      ) : (
                        <>Register</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-[#ddd] bg-transparent px-6 py-2.5 font-[inherit] text-[13px] font-semibold text-[#666] transition-all duration-200 hover:border-[#C0392B] hover:text-[#C0392B]"
                    >
                      <FiArrowLeft size={13} /> Back
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}
    >
      <RegisterPageContent />
    </Suspense>
  );
}