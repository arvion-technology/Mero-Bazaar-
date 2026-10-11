"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

type PageState = { mode: "loading" } | { mode: "otp"; provider: string };

export default function AuthErrorContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>({ mode: "loading" });
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/pending-2fa", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (data.pending) {
          setPageState({ mode: "otp", provider: data.provider });
          return;
        }
      } catch {
        /* fall through to redirect */
      }
      if (cancelled) return;

      const error = params.get("error");
      if (error) {
        const messages: Record<string, string> = {
          OAuthAccountNotLinked:
            "That email is already registered with a different sign-in method.",
          AccessDenied: "Access denied. Please try again.",
          CredentialsSignin: "Invalid email or password.",
        };
        toast.error(
          messages[error] ?? "Something went wrong signing in. Please try again."
        );
      }
      router.replace("/register");
    })();

    return () => {
      cancelled = true;
    };
  }, [params, router]);

  async function handleSubmit() {
    if (submittingRef.current) return;
    if (pageState.mode !== "otp") return;

    if (otp.length < 6) {
      setOtpError("Enter the 6-digit code we sent you.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setOtpError("");

    try {
      await signIn("otp", { otp, redirect: false });

      // Trust the session, not the signIn result.
      const session = await getSession();
      if (!session?.user) {
        setOtpError("Invalid or expired code. Please try again.");
        toast.error("Invalid or expired code");
        return;
      }

      toast.success("Login successful!");
      router.push("/user/dashboard");
    } catch {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  if (pageState.mode !== "otp") {
    return <p className="p-6 text-sm text-[#666]">Redirecting…</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10 max-[480px]:p-0">
      <div className="w-full max-w-[420px] rounded-[32px] border border-[#f0f0f0] bg-white px-8 py-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-[480px]:min-h-screen max-[480px]:rounded-none max-[480px]:px-5 max-[480px]:shadow-none">
        <h2 className="mb-1.5 text-[26px] font-bold text-[#C0392B]">
          Verify your identity
        </h2>
        <p className="mb-6 text-[13px] leading-relaxed text-[#999]">
          Enter the 6-digit code sent to your phone to finish signing in.
        </p>

        <input
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
            setOtpError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          maxLength={6}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          placeholder="••••••"
          aria-invalid={!!otpError}
          aria-describedby={otpError ? "otp-error" : undefined}
          className={`w-full rounded-lg border-0 bg-[#f0ecec] px-3 py-3 text-center text-xl tracking-[0.5em] text-[#333] outline-none transition-all duration-200 placeholder:text-[#bbb] focus:bg-[#e8e4e4] focus:shadow-[0_0_0_2px_rgba(192,57,43,0.15)] ${
            otpError ? "ring-1 ring-red-500" : ""
          }`}
        />

        {otpError && (
          <p id="otp-error" role="alert" className="mt-2 text-[12px] text-red-500">
            {otpError}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-[#C0392B] px-8 py-3 text-sm font-semibold text-white transition-all duration-200 enabled:hover:-translate-y-px enabled:hover:bg-[#A93226] enabled:hover:shadow-[0_4px_12px_rgba(192,57,43,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="mt-4 cursor-pointer border-0 bg-transparent text-xs font-semibold text-[#C0392B] hover:underline"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}