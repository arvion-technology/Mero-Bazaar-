"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .forgot-page {
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .forgot-card {
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
        .forgot-left {
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

        .forgot-left-title {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }

        .forgot-left-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 28px;
          line-height: 1.5;
        }

        .forgot-left-btn {
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

        .forgot-left-btn:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.6);
        }

        /* ── Right Panel ── */
        .forgot-right {
          flex: 1;
          padding: 48px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .forgot-right-title {
          font-size: 28px;
          font-weight: 700;
          color: ${PRIMARY};
          text-align: center;
          margin-bottom: 6px;
        }

        .forgot-right-sub {
          font-size: 13px;
          color: #999;
          text-align: center;
          margin-bottom: 24px;
        }

        .forgot-divider-line {
          height: 1px;
          background: #ddd;
          margin-bottom: 24px;
        }

        /* Fields */
        .forgot-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .forgot-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .forgot-label {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .forgot-input-wrap {
          position: relative;
        }

        .forgot-input {
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

        .forgot-input::placeholder {
          color: #aaa;
        }

        .forgot-input:focus {
          background: #e8e4e4;
          box-shadow: 0 0 0 2px rgba(192,57,43,0.15);
        }

        .forgot-input.with-icon {
          padding-left: 40px;
        }

        .forgot-input-icon {
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

        /* Button */
        .forgot-btn-primary {
          width: fit-content;
          min-width: 160px;
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

        .forgot-btn-primary:hover:not(:disabled) {
          background: ${PRIMARY_DARK};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(192,57,43,0.3);
        }

        .forgot-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .forgot-btn-back {
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
          margin: 16px auto 0;
          text-decoration: none;
        }

        .forgot-btn-back:hover {
          border-color: ${PRIMARY};
          color: ${PRIMARY};
        }

        .forgot-success {
          text-align: center;
          animation: fadeIn 0.3s ease;
        }

        .forgot-success-icon {
          color: #22c55e;
          margin-bottom: 16px;
          margin-left:175px;
        }

        .forgot-success-title {
          font-size: 20px;
          font-weight: 700;
          color: #222;
          margin-bottom: 8px;
        }

        .forgot-success-text {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .forgot-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .forgot-card {
            flex-direction: column;
            max-width: 420px;
          }
          .forgot-left {
            flex: none;
            padding: 32px 24px;
            border-radius: 0 0 40px 40px;
            min-height: 180px;
          }
          .forgot-left-title {
            font-size: 28px;
          }
          .forgot-right {
            padding: 32px 24px;
          }
        }

        @media (max-width: 480px) {
          .forgot-page {
            padding: 0;
            background: #fff;
          }
          .forgot-card {
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
          }
          .forgot-left {
            border-radius: 0 0 32px 32px;
          }
          .forgot-right {
            padding: 24px 20px;
          }
        }
      `}</style>

      <div className="forgot-page">
        <div className="forgot-card">
          {/* ── Left Panel ─── */}
          <aside className="forgot-left">
            <h1 className="forgot-left-title">Welcome Back!</h1>
            <p className="forgot-left-sub">
              Remembered your password? Sign in to access your account.
            </p>
            <Link href="/login" className="forgot-left-btn">
              SIGN IN
            </Link>
          </aside>

          {/* ── Right Panel ─── */}
          <div className="forgot-right">
            {!submitted ? (
              <>
                <h2 className="forgot-right-title">Forgot Password?</h2>
                <p className="forgot-right-sub">
                  Enter your email address and we'll send you a recovery link
                </p>
                <div className="forgot-divider-line" />

                <form onSubmit={handleSubmit} className="forgot-form">
                  <div className="forgot-field">
                    <label className="forgot-label" htmlFor="forgot-email">Email Address</label>
                    <div className="forgot-input-wrap">
                      <span className="forgot-input-icon">
                        <FiMail size={15} />
                      </span>
                      <input
                        id="forgot-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="forgot-input with-icon"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="forgot-btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <><div className="forgot-spinner" /> Sending Link...</>
                    ) : (
                      <>Send Reset Link <FiArrowRight size={14} /></>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="forgot-success">
                <FiCheckCircle size={64} className="forgot-success-icon" />
                <h2 className="forgot-success-title">Link Sent!</h2>
                <p className="forgot-success-text">
                  We have sent a password reset link to <strong style={{ color: PRIMARY }}>{email}</strong>. Please check your inbox and spam folder.
                </p>
                <Link href="/login" className="forgot-btn-back">
                  <FiArrowLeft size={13} /> Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
