"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiArrowRight,
  FiArrowLeft,
  FiShoppingBag,
  FiBriefcase,
  FiPhone,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { api } from "../../lib/api";
import type { RegisterPayload } from "../types/auth";
import { signIn } from "next-auth/react";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  // const [accountType, setAccountType] = useState<"buyer" | "seller" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [accountType, setAccountType] = useState<"buyer" | "seller" | null>(
    searchParams.get("seller") === "true" ? "seller" : null
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountType) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.warn("Please accept the terms");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  try {
    setLoading(true);
    const payload: RegisterPayload = {
      email: form.email,
      password: form.password,
      name: form.fullName,
      phone: form.phone,
      role: accountType === "seller" ? "VENDOR" : "USER",
      address: form.address,
    };
    const data = await api.register(payload);
    localStorage.setItem("token",data.access_token);
    localStorage.setItem("user",JSON.stringify(data.user));
    toast.success("Account created successfully!");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : " Something went wrong");
  }finally {
    setLoading(false);
  }
};

//googleauth
const handleGoogle =async () => {
  if (!accountType) {
    toast.warn("Please select role first!");
    return;
  }
  setGoogleLoading(true);
  try {
    await signIn("google", { callbackUrl: "/" });
  } catch {
    toast.error("Google Sign-in failed. Please try again.");
    setGoogleLoading(false);
  }
};

//facebookauth
  const handleFacebook = async () => {
    if (!accountType) {
      toast.warn("Please select role first!");
      return;
    }
    setFacebookLoading(true);
    try {
      await signIn("facebook", { callbackUrl: "/" });
    } catch {
      toast.error("Facebook Sign-in failed. Please try again.");
      setFacebookLoading(false);
    }
  };
  const districts = [
    "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Butwal",
    "Biratnagar", "Birgunj", "Dhangadhi", "Nepalgunj", "Hetauda", "Dharan",
    "Itahari", "Janakpur", "Lumbini", "Gorkha", "Mustang", "Solukhumbu",
  ];

  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      theme="colored"
    />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-page {
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .reg-card {
          width: 100%;
          max-width: 900px;
          min-height: 560px;
          background: #fff;
          border-radius: 32px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border: 1px solid #f0f0f0;
        }

        .reg-left {
          flex: 0 0 380px;
          background: ${PRIMARY};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          text-align: center;
          border-radius: 0 80px 80px 0;
        }

        .reg-left-title {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }

        .reg-left-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 28px;
          line-height: 1.5;
        }

        .reg-left-btn {
          padding: 12px 40px;
          background: rgba(255,255,255,0.2);
          color: #fff;
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .reg-left-btn:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.6);
        }

        .reg-right {
          flex: 1;
          padding: 48px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .reg-right-title {
          font-size: 28px;
          font-weight: 700;
          color: ${PRIMARY};
          text-align: center;
          margin-bottom: 6px;
        }

        .reg-right-sub {
          font-size: 13px;
          color: #999;
          text-align: center;
          margin-bottom: 24px;
        }

        .reg-divider-line {
          height: 1px;
          background: #ddd;
          margin-bottom: 24px;
        }

        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .reg-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .reg-label {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .reg-input-wrap {
          position: relative;
        }

        .reg-input {
          width: 100%;
          padding: 12px 14px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          background: #f0ecec;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .reg-input::placeholder {
          color: #aaa;
        }

        .reg-input:focus {
          background: #e8e4e4;
          box-shadow: 0 0 0 2px rgba(192,57,43,0.15);
        }

        .reg-input.with-icon {
          padding-left: 40px;
        }

        .reg-input.with-toggle {
          padding-right: 42px;
        }

        .reg-input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          pointer-events: none;
          display: flex;
          align-items: center;
          font-size: 15px;
        }

        .reg-toggle-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          padding: 4px;
          display: flex;
          align-items: center;
          font-size: 15px;
        }

        .reg-toggle-btn:hover {
          color: ${PRIMARY};
        }

        .reg-select {
          width: 100%;
          padding: 12px 14px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          background: #f0ecec;
          outline: none;
          cursor: pointer;
          font-family: inherit;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23aaa' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }

        .reg-select:focus {
          background: #e8e4e4;
          box-shadow: 0 0 0 2px rgba(192,57,43,0.15);
        }

        .reg-strength-bar {
          display: flex;
          gap: 3px;
          margin-top: 5px;
        }

        .reg-strength-seg {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: #ddd;
          transition: background 0.3s;
        }

        .reg-strength-label {
          font-size: 11px;
          margin-top: 3px;
          font-weight: 500;
        }

        .reg-checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 4px 0;
        }

        .reg-checkbox-row input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: ${PRIMARY};
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .reg-checkbox-label {
          font-size: 12px;
          color: #666;
          line-height: 1.5;
        }

        .reg-checkbox-label a {
          color: ${PRIMARY};
          font-weight: 600;
          text-decoration: none;
        }

        .reg-checkbox-label a:hover {
          text-decoration: underline;
        }

        .reg-btn-primary {
          width: fit-content;
          min-width: 140px;
          padding: 12px 32px;
          background: ${PRIMARY};
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: inherit;
          margin: 0 auto;
        }

        .reg-btn-primary:hover:not(:disabled) {
          background: ${PRIMARY_DARK};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(192,57,43,0.3);
        }

        .reg-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .reg-btn-back {
          width: fit-content;
          padding: 10px 24px;
          background: none;
          color: #666;
          border: 1.5px solid #ddd;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .reg-btn-back:hover {
          border-color: ${PRIMARY};
          color: ${PRIMARY};
        }

        .reg-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .reg-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .reg-type-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .reg-type-card {
          border: 2px solid #eee;
          border-radius: 12px;
          padding: 20px 16px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
          text-align: center;
        }

        .reg-type-card:hover {
          border-color: ${PRIMARY};
          box-shadow: 0 2px 12px rgba(192,57,43,0.1);
        }

        .reg-type-card.selected {
          border-color: ${PRIMARY};
          background: #fef2f2;
        }

        .reg-type-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          color: #666;
          font-size: 18px;
          transition: all 0.2s;
        }

        .reg-type-card.selected .reg-type-icon {
          background: ${PRIMARY};
          color: #fff;
        }

        .reg-type-label {
          font-size: 13px;
          font-weight: 700;
          color: #222;
          margin-bottom: 3px;
        }

        .reg-type-desc {
          font-size: 11px;
          color: #999;
        }

        .reg-social-row {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .reg-social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: 1.5px solid #e5e5e5;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #555;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .reg-social-btn:hover {
          border-color: #ccc;
          background: #fafafa;
        }

        .reg-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 12px 0;
        }

        .reg-divider-line-h {
          flex: 1;
          height: 1px;
          background: #eee;
        }

        .reg-divider-text {
          font-size: 11px;
          color: #bbb;
          font-weight: 500;
          white-space: nowrap;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reg-step {
          animation: fadeIn 0.3s ease;
        }

        .reg-error-msg {
          font-size: 11.5px;
          color: #ef4444;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .reg-card {
            flex-direction: column;
            max-width: 420px;
          }
          .reg-left {
            flex: none;
            padding: 32px 24px;
            border-radius: 0 0 40px 40px;
            min-height: 180px;
          }
          .reg-left-title {
            font-size: 28px;
          }
          .reg-right {
            padding: 32px 24px;
          }
        }

        @media (max-width: 480px) {
          .reg-page {
            padding: 0;
            background: #fff;
          }
          .reg-card {
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
          }
          .reg-left {
            border-radius: 0 0 32px 32px;
          }
          .reg-right {
            padding: 24px 20px;
          }
          .reg-type-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="reg-page">
        <div className="reg-card">
          <aside className="reg-left">
            <h1 className="reg-left-title">Welcome to HamroNepal Bazaar</h1>
            <p className="reg-left-sub">
              Enter your details to use all of site features
            </p>
            <Link href="/login" className="reg-left-btn">
              SIGN IN
            </Link>
          </aside>

          <div className="reg-right">
            <h2 className="reg-right-title">
              {step === 1 ? "Register" : "Complete Profile"}
            </h2>
            <p className="reg-right-sub">
              {step === 1 ? "Enter your Personal Information" : "Step 2 of 2"}
            </p>
            <div className="reg-divider-line" />

            {step === 1 && (
              <div className="reg-step">
                <form onSubmit={handleStep1}>
                  <div className="reg-type-grid" style={{ marginBottom: 20 }}>
                    {([
                      {
                        type: "buyer",
                        icon: FiShoppingBag,
                        label: "Buy & Discover",
                        desc: "Browse listings & find deals",
                      },
                      {
                        type: "seller",
                        icon: FiBriefcase,
                        label: "Sell & Grow",
                        desc: "List products & reach buyers",
                      },
                    ] as const).map((opt) => (
                      <div
                        key={opt.type}
                        className={`reg-type-card${accountType === opt.type ? " selected" : ""}`}
                        onClick={() => setAccountType(opt.type)}
                        role="radio"
                        aria-checked={accountType === opt.type}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setAccountType(opt.type)}
                      >
                        <div className="reg-type-icon">
                          <opt.icon size={20} />
                        </div>
                        <div className="reg-type-label">{opt.label}</div>
                        <div className="reg-type-desc">{opt.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="reg-social-row" style={{ marginBottom: 12 }}>
                    <button
                      type="button"
                      className="reg-social-btn reg-social-btn--google"
                      onClick={handleGoogle}
                      disabled={googleLoading || !accountType}
                    >
                      {googleLoading ? (
                        <div className="reg-spinner reg-spinner--sm" />
                      ) : (
                        <FcGoogle size={16} />
                      )}
                      {googleLoading ? "Signing in..." : "Google"}
                    </button>

                    <button
                      type="button"
                      className="reg-social-btn reg-social-btn--facebook"
                      onClick={handleFacebook}
                      disabled={facebookLoading || !accountType}
                    >
                      {facebookLoading ? (
                        <div className="reg-spinner reg-spinner--sm" />
                      ) : (
                        <FaFacebook size={16} color="#1877F2" />
                      )}
                      {facebookLoading ? "Signing in..." : "Facebook"}
                    </button>
                  </div>

                  <div className="reg-divider">
                    <div className="reg-divider-line-h" />
                    <span className="reg-divider-text">or</span>
                    <div className="reg-divider-line-h" />
                  </div>

                  <div className="reg-actions" style={{ marginTop: 16 }}>
                    <button
                      type="submit"
                      className="reg-btn-primary"
                      disabled={!accountType}
                    >
                      Continue <FiArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="reg-step">
                <form onSubmit={handleSubmit} className="reg-form">
                  <div className="reg-field">
                    <label className="reg-label" htmlFor="reg-fullname">Full Name</label>
                    <div className="reg-input-wrap">
                      <span className="reg-input-icon">
                        <FiUser size={15} />
                      </span>
                      <input
                        id="reg-fullname"
                        name="fullName"
                        type="text"
                        placeholder="Enter your name"
                        className="reg-input with-icon"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="reg-field">
                    <label className="reg-label" htmlFor="reg-email">Email</label>
                    <div className="reg-input-wrap">
                      <span className="reg-input-icon">
                        <FiMail size={15} />
                      </span>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="reg-input with-icon"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="reg-field">
                    <label className="reg-label" htmlFor="reg-phone">Phone Number</label>
                    <div className="reg-input-wrap">
                      <span className="reg-input-icon">
                        <FiPhone size={15} />
                      </span>
                      <input
                        id="reg-phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="reg-input with-icon"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="reg-field">
                    <label className="reg-label" htmlFor="reg-address">Address</label>
                    <div className="reg-input-wrap">
                      <span className="reg-input-icon">
                        <FiMapPin size={15} />
                      </span>
                      <input
                        id="reg-address"
                        name="address"
                        type="text"
                        placeholder="Enter your address"
                        className="reg-input with-icon"
                        value={form.address}
                        onChange={handleChange}
                        required
                        autoComplete="street-address"
                      />
                    </div>
                  </div>

                  <div className="reg-field">
                    <label className="reg-label" htmlFor="reg-password">Password</label>
                    <div className="reg-input-wrap">
                      <span className="reg-input-icon">
                        <FiLock size={15} />
                      </span>
                      <input
                        id="reg-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="reg-input with-icon with-toggle"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="reg-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    </div>
                    {form.password.length > 0 && (
                      <PasswordStrength password={form.password} />
                    )}
                  </div>

                  <div className="reg-field">
                    <label className="reg-label" htmlFor="reg-confirm">Confirm Password</label>
                    <div className="reg-input-wrap">
                      <span className="reg-input-icon">
                        <FiLock size={15} />
                      </span>
                      <input
                        id="reg-confirm"
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Enter confirm password"
                        className="reg-input with-icon with-toggle"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        style={{
                          borderColor:
                            form.confirmPassword.length > 0
                              ? form.confirmPassword === form.password
                                ? "#22c55e"
                                : "#ef4444"
                              : undefined,
                        }}
                      />
                      <button
                        type="button"
                        className="reg-toggle-btn"
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    </div>
                    {form.confirmPassword.length > 0 && form.confirmPassword !== form.password && (
                      <span className="reg-error-msg">Passwords do not match</span>
                    )}
                  </div>

                  <div className="reg-checkbox-row">
                    <input
                      type="checkbox"
                      id="reg-agree"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <label htmlFor="reg-agree" className="reg-checkbox-label">
                      I agree to the{" "}
                      <Link href="/terms">Terms</Link> and{" "}
                      <Link href="/privacy">Privacy Policy</Link>
                    </label>
                  </div>

                  <div className="reg-actions">
                    <button
                      type="submit"
                      className="reg-btn-primary"
                      disabled={loading || !agreed || form.confirmPassword !== form.password}
                    >
                      {loading ? (
                        <><div className="reg-spinner" /> Register</>
                      ) : (
                        <>Register</>
                      )}
                    </button>

                    <button
                      type="button"
                      className="reg-btn-back"
                      onClick={() => setStep(1)}
                    >
                      <FiArrowLeft size={13} />
                      Back
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

function PasswordStrength({ password }: { password: string }) {
  const score = getStrength(password);
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const color = colors[score - 1] || "#eee";

  return (
    <>
      <div className="reg-strength-bar">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="reg-strength-seg"
            style={{ background: i <= score ? color : "#ddd" }}
          />
        ))}
      </div>
      <div className="reg-strength-label" style={{ color }}>
        {labels[score - 1] || ""}
      </div>
    </>
  );
}

function getStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.max(1, score);
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}