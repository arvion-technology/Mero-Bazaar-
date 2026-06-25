"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiLogIn,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ emailOrPhone: "", password: "", remember: false });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const res = await signIn("credentials", {
      email: form.emailOrPhone,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      toast.success("Logged in successfully!");
      // Hard redirect so the browser re-reads the session cookie from scratch.
      // router.push() alone races against the cookie being set.
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } else {
      toast.error("Invalid email or password");
    }
  };

//googleauth
const handleGoogle = async () => {
  setGoogleLoading(true);
  try {
    await signIn("google", { callbackUrl: "/" });
  }catch {
    toast.error("Google sign-in failed. Please try again.");
    setGoogleLoading(false);
  }
};

//facebookauth
  const handleFacebook = async () => {
    setFacebookLoading(true);
    try {
      await signIn("facebook", { callbackUrl: "/" });
    } catch {
      toast.error("Facebook Sign-in failed. Please try again.");
      setFacebookLoading(false);
    }
  };

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

        .login-page {
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 900px;
          min-height: 520px;
          background: #fff;
          border-radius: 32px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border: 1px solid #f0f0f0;
        }

        /* ── Left Panel ── */
        .login-left {
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

        .login-left-title {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }

        .login-left-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 28px;
          line-height: 1.5;
        }

        .login-left-btn {
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

        .login-left-btn:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.6);
        }

        /* ── Right Panel ── */
        .login-right {
          flex: 1;
          padding: 48px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-right-title {
          font-size: 28px;
          font-weight: 700;
          color: ${PRIMARY};
          text-align: center;
          margin-bottom: 6px;
        }

        .login-right-sub {
          font-size: 13px;
          color: #999;
          text-align: center;
          margin-bottom: 24px;
        }

        .login-divider-line {
          height: 1px;
          background: #ddd;
          margin-bottom: 24px;
        }

        /* Social */
        .login-social-row {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .login-social-btn {
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

        .login-social-btn:hover {
          border-color: #ccc;
          background: #fafafa;
        }

        .login-divider {
          display: flex;
          align-items: center;
        }

        .login-divider-line-h {
          flex: 1;
          height: 1px;
          background: #eee;
        }

        .login-divider-text {
          font-size: 11px;
          color: #bbb;
          font-weight: 500;
          white-space: nowrap;
        }

        /* Fields */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .login-label {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input {
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

        .login-input::placeholder {
          color: #aaa;
        }

        .login-input:focus {
          background: #e8e4e4;
          box-shadow: 0 0 0 2px rgba(192,57,43,0.15);
        }

        .login-input.with-icon {
          padding-left: 40px;
        }

        .login-input.with-toggle {
          padding-right: 42px;
        }

        .login-input-icon {
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

        .login-toggle-btn {
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

        .login-toggle-btn:hover {
          color: ${PRIMARY};
        }

        .login-row-inline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .login-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #666;
          cursor: pointer;
        }

        .login-remember input[type="checkbox"] {
          width: 14px;
          height: 14px;
          accent-color: ${PRIMARY};
          cursor: pointer;
        }

        .login-forgot {
          font-size: 12px;
          color: ${PRIMARY};
          font-weight: 600;
          text-decoration: none;
        }

        .login-forgot:hover {
          text-decoration: underline;
        }

        /* Button */
        .login-btn-primary {
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

        .login-btn-primary:hover:not(:disabled) {
          background: ${PRIMARY_DARK};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(192,57,43,0.3);
        }

        .login-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
            max-width: 420px;
          }
          .login-left {
            flex: none;
            padding: 32px 24px;
            border-radius: 0 0 40px 40px;
            min-height: 180px;
          }
          .login-left-title {
            font-size: 28px;
          }
          .login-right {
            padding: 32px 24px;
          }
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 0;
            background: #fff;
          }
          .login-card {
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
          }
          .login-left {
            border-radius: 0 0 32px 32px;
          }
          .login-right {
            padding: 24px 20px;
          }
          .login-social-row {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          {/* ── Left Panel ─── */}
          <aside className="login-left">
            <h1 className="login-left-title">Welcome Back!</h1>
            <p className="login-left-sub">
              Don't have an account? Sign up here.
            </p>
            <Link href="/register" className="login-left-btn">
              SIGN UP
            </Link>
          </aside>

          {/* ── Right Panel ─── */}
          <div className="login-right">
            <h2 className="login-right-title">Sign In</h2>
            <p className="login-right-sub">
              Enter your email and password to access your account.
            </p>
            <div className="login-divider-line" />

            <div className="login-divider">
              <div className="login-divider-line-h" />
              <span className="login-divider-text">or</span>
              <div className="login-divider-line-h" />
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label className="login-label" htmlFor="login-identifier">Email</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">
                    <FiMail size={15} />
                  </span>
                  <input
                    id="login-identifier"
                    name="emailOrPhone"
                    type="text"
                    placeholder="Enter your email"
                    className="login-input with-icon"
                    value={form.emailOrPhone}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="login-password">Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">
                    <FiLock size={15} />
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="login-input with-icon with-toggle"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              <div className="login-row-inline">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    id="login-remember"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="login-forgot">
                  Forgot password?
                </Link>
              </div>

            <div className="login-social-row">

              <button type="button" className="login-social-btn"
              onClick={handleGoogle} disabled={googleLoading}
              >
                {googleLoading ? (
                      <div style={{
                        width: 14, height: 14,
                        border: "2px solid rgba(0,0,0,0.15)",
                        borderTopColor: "#555",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite"
                      }} />
                    ) : (<FcGoogle size={16} />
                )}  
                { googleLoading ? "Logging in..." : "Google" }
              </button>

              <button
                type="button"
                className="login-social-btn"
                onClick={handleFacebook}
                disabled={facebookLoading}
              >
                {facebookLoading ? (
                  <div style={{
                    width: 14, height: 14,
                    border: "2px solid rgba(0,0,0,0.15)",
                    borderTopColor: "#1877F2",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite"
                  }} />
                ) : (
                  <FaFacebook size={16} color="#1877F2" />
                )}
                {facebookLoading ? "Logging in..." : "Facebook"}
              </button>
            </div>

              <div className="login-divider">
                <div className="login-divider-line-h" />
                <span className="login-divider-text">or</span>
                <div className="login-divider-line-h" />
              </div>

              <button
                type="submit"
                className="login-btn-primary"
                disabled={loading}
              >

                {loading ? (
                  <><div className="login-spinner" /> Signing In...</>
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