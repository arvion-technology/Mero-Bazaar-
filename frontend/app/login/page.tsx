"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FormState = { emailOrPhone: string; password: string; remember: boolean };
type Errors = Partial<Record<"emailOrPhone" | "password", string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  const email = f.emailOrPhone.trim();
  if (!email) e.emailOrPhone = "Email is required";
  else if (!EMAIL_RE.test(email)) e.emailOrPhone = "Enter a valid email address";
  if (!f.password) e.password = "Password is required";
  return e;
}

/* ── shared classes ── */
const inputBase =
  "w-full rounded-lg border-0 bg-[#f0ecec] py-3 pl-10 text-sm text-[#333] outline-none transition-all duration-200 placeholder:text-[#aaa] focus:bg-[#e8e4e4] focus:shadow-[0_0_0_2px_rgba(192,57,43,0.15)]";
const socialBtn =
  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-[1.5px] border-[#e5e5e5] bg-white p-2.5 font-[inherit] text-xs font-semibold text-[#555] transition-all duration-200 hover:border-[#ccc] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60";

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[#eee]" />
      <span className="whitespace-nowrap text-[11px] font-medium text-[#bbb]">or</span>
      <div className="h-px flex-1 bg-[#eee]" />
    </div>
  );
}

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({ emailOrPhone: "", password: "", remember: false });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  const errors = validate(form);
  const err = (k: keyof Errors) => (touched[k] || submitted ? errors[k] : undefined);
  const ring = (k: keyof Errors) => (err(k) ? "ring-1 ring-red-500" : "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const res = await signIn("credentials", {
      email: form.emailOrPhone.trim(),
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.ok && !res?.error) {
      toast.success("Logged in successfully!");
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } else {
      toast.error("Invalid email or password");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleFacebook = async () => {
    setFacebookLoading(true);
    try {
      await signIn("facebook", { callbackUrl: "/" });
    } catch {
      toast.error("Facebook sign-in failed. Please try again.");
      setFacebookLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />

      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10 font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif] max-[480px]:p-0">
        <div className="flex min-h-[520px] w-full max-w-[900px] overflow-hidden rounded-[32px] border border-[#f0f0f0] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-md:max-w-[420px] max-md:flex-col max-[480px]:min-h-screen max-[480px]:rounded-none max-[480px]:shadow-none">
          {/* ── Left panel ── */}
          <aside className="flex flex-[0_0_380px] flex-col items-center justify-center rounded-r-[80px] bg-[#C0392B] px-10 py-12 text-center max-md:min-h-[180px] max-md:flex-none max-md:rounded-b-[40px] max-md:rounded-r-none max-md:px-6 max-md:py-8 max-[480px]:rounded-b-[32px]">
            <h1 className="mb-3 text-4xl font-bold text-white max-md:text-[28px]">Welcome Back!</h1>
            <p className="mb-7 text-sm leading-normal text-white/80">Don&apos;t have an account? Sign up here.</p>
            <Link
              href="/register"
              className="inline-block cursor-pointer rounded-3xl border-2 border-white/40 bg-white/20 px-10 py-3 text-sm font-semibold text-white! no-underline transition-all duration-200 hover:border-white/60 hover:bg-white/30"
            >
              SIGN UP
            </Link>
          </aside>

          {/* ── Right panel ── */}
          <div className="flex flex-1 flex-col justify-center px-14 py-12 max-md:px-6 max-md:py-8 max-[480px]:px-5 max-[480px]:py-6">
            <h2 className="mb-1.5 text-center text-[28px] font-bold text-[#C0392B]">Sign In</h2>
            <p className="mb-6 text-center text-[13px] text-[#999]">Enter your email and password to access your account.</p>
            <div className="mb-6 h-px bg-[#ddd]" />

            <div className="mb-4 flex gap-2.5 max-[480px]:flex-col">
              <button type="button" className={socialBtn} onClick={handleGoogle} disabled={googleLoading || facebookLoading}>
                {googleLoading ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/15 border-t-[#555]" />
                ) : (
                  <FcGoogle size={16} />
                )}
                {googleLoading ? "Logging in..." : "Google"}
              </button>
              <button type="button" className={socialBtn} onClick={handleFacebook} disabled={googleLoading || facebookLoading}>
                {facebookLoading ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/15 border-t-[#1877F2]" />
                ) : (
                  <FaFacebook size={16} color="#1877F2" />
                )}
                {facebookLoading ? "Logging in..." : "Facebook"}
              </button>
            </div>

            <div className="mb-4"><Divider /></div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <Field id="login-identifier" label="Email" icon={<FiMail size={15} />} error={err("emailOrPhone")}>
                <input
                  id="login-identifier"
                  name="emailOrPhone"
                  type="email"
                  inputMode="email"
                  placeholder="Enter your email"
                  className={`${inputBase} pr-3.5 ${ring("emailOrPhone")}`}
                  value={form.emailOrPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="username"
                  aria-invalid={!!err("emailOrPhone")}
                  aria-describedby={err("emailOrPhone") ? "login-identifier-error" : undefined}
                />
              </Field>

              <Field id="login-password" label="Password" icon={<FiLock size={15} />} error={err("password")}>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className={`${inputBase} pr-[42px] ${ring("password")}`}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                  aria-invalid={!!err("password")}
                  aria-describedby={err("password") ? "login-password-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 flex -translate-y-1/2 cursor-pointer items-center border-0 bg-transparent p-1 text-[15px] text-[#aaa] hover:text-[#C0392B]"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </Field>

              <div className="flex items-center justify-between gap-2.5">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#666]">
                  <input
                    type="checkbox"
                    id="login-remember"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="h-3.5 w-3.5 cursor-pointer accent-[#C0392B]"
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#C0392B]! no-underline hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mx-auto flex w-fit min-w-[140px] cursor-pointer items-center justify-center gap-1.5 rounded-lg border-0 bg-[#C0392B] px-8 py-3 font-[inherit] text-sm font-semibold text-white transition-all duration-200 enabled:hover:-translate-y-px enabled:hover:bg-[#A93226] enabled:hover:shadow-[0_4px_12px_rgba(192,57,43,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Signing In...
                  </>
                ) : (
                  <>Sign In <FiArrowRight size={14} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}