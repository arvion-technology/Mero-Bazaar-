"use client";

import { useState, useRef } from "react";
import { FiUser, FiCalendar, FiUpload, FiCreditCard, FiCamera, FiCheckCircle, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";

export default function SellerKYCPage() {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    contactNumber: "",
    panNumber: "",
    address: "",
    bankName: "",
    account: "",
    accountHolderName: "",
  });

  const [panCard, setPanCard] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [selfieWithPan, setSelfieWithPan] = useState<File | null>(null);
  const [panCardPreview, setPanCardPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    field: "panCard" | "photo" | "selfieWithPan"
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const setFile = field === "panCard" ? setPanCard : field === "photo" ? setPhoto : setSelfieWithPan;
    const setPreview = field === "panCard" ? setPanCardPreview : field === "photo" ? setPhotoPreview : setSelfiePreview;
    setFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const sendOtp = async () => {
    const phone = form.contactNumber.trim();
    if (!/^(98|97)\d{8}$/.test(phone)) {
      toast.error("Enter a valid Nepal number (98/97XXXXXXXX)");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch(`/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, context: "KYC_CONTACT" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setOtpSent(true);
      toast.success(`OTP sent to ${phone}`);
    } catch (e) {
      const message =  e instanceof Error ? e.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setVerifyingOtp(true);
    try {
      const res = await fetch(`/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.contactNumber, otp, context: "KYC_CONTACT" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      setPhoneVerified(true);
      setOtpSent(false);
      toast.success("Phone number verified!");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong!";
      toast.error(message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async () => {
    if (!phoneVerified) {
      toast.error("Verify your contact number first");
      return;
    }
    const token = session?.accessToken;
    if (!token) {
      toast.error("Please log in first");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("dateOfBirth", form.dateOfBirth);
      fd.append("contactNumber", form.contactNumber);
      fd.append("panNumber", form.panNumber);
      fd.append("address", form.address);
      fd.append("bankName", form.bankName);
      fd.append("account", form.account);
      fd.append("accountHolderName", form.accountHolderName);
      if (panCard) fd.append("panCardUrl", panCard);
      if (photo) fd.append("photoUrl", photo);
      if (selfieWithPan) fd.append("selfieWithPanUrl", selfieWithPan);

      const res = await fetch(`/api/vendor-kyc/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      setSubmitted(true);
      toast.success("KYC submitted successfully!");
    } catch (e) {
      const message = e instanceof Error ? e.message : "something went wrong!";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .kyc-page {
          min-height: 100vh;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .kyc-card {
          width: 100%;
          max-width: 620px;
          background: #fff;
          border-radius: 16px;
          padding: 32px 36px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        }

        .kyc-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eee;
        }

        .kyc-header-icon { color: ${PRIMARY}; font-size: 26px; }
        .kyc-header-title { font-size: 22px; font-weight: 700; color: ${PRIMARY}; }

        .kyc-brand { font-size: 18px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 6px; }

        .kyc-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          background: #FFF3CD;
          color: #856404;
          margin-bottom: 20px;
        }

        .kyc-divider { height: 1px; background: #eee; margin: 20px 0; }
        .kyc-section-title { font-size: 16px; font-weight: 600; color: ${PRIMARY}; margin-bottom: 14px; }

        .kyc-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 10px;
          padding: 10px 14px;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          background: #fafafa;
        }

        .kyc-row-label {
          flex: 0 0 148px;
          font-size: 13px;
          font-weight: 500;
          color: #555;
          padding-top: 7px;
        }

        .kyc-row-content { flex: 1; }

        .kyc-input {
          width: 100%;
          padding: 7px 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 13px;
          color: #333;
          outline: none;
          font-family: inherit;
          background: #fff;
          transition: border-color 0.2s;
        }

        .kyc-input:focus { border-color: ${PRIMARY}; box-shadow: 0 0 0 2px rgba(192,57,43,0.1); }
        .kyc-input:disabled { background: #f5f5f5; color: #999; cursor: not-allowed; }
        .kyc-input::placeholder { color: #bbb; }

        .kyc-date-wrapper { position: relative; display: flex; align-items: center; }
        .kyc-date-icon-btn {
          position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: #888; cursor: pointer;
          display: flex; align-items: center; padding: 4px;
          transition: color 0.2s;
        }
        .kyc-date-icon-btn:hover { color: ${PRIMARY}; }

        .otp-row { display: flex; gap: 8px; }
        .otp-row .kyc-input { flex: 1; }

        .btn-send {
          white-space: nowrap;
          padding: 7px 14px;
          background: ${PRIMARY};
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .btn-send:hover:not(:disabled) { background: ${PRIMARY_DARK}; }
        .btn-send:disabled { opacity: 0.6; cursor: not-allowed; }

        .otp-entry {
          margin-top: 8px;
          padding: 10px 12px;
          background: #f5f5f5;
          border-radius: 8px;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .otp-code-input {
          flex: 1;
          letter-spacing: 6px;
          font-size: 18px;
          text-align: center;
          padding: 7px 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: monospace;
          outline: none;
          background: #fff;
          transition: border-color 0.2s;
        }
        .otp-code-input:focus { border-color: ${PRIMARY}; }

        .otp-hint { font-size: 11px; color: #888; margin-top: 6px; }

        .verified-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          color: #1a7a4a;
          background: #e6f7ee;
          padding: 5px 12px;
          border-radius: 20px;
          margin-top: 8px;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 4px;
        }

        .upload-box {
          border: 1.5px dashed #ddd;
          border-radius: 10px;
          padding: 16px 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
        }
        .upload-box:hover { border-color: ${PRIMARY}; background: #fff8f7; }
        .upload-box.has-file { border-color: ${PRIMARY}; border-style: solid; background: #fff8f7; }

        .upload-preview {
          width: 60px;
          height: 48px;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #bbb;
          font-size: 22px;
          background: #fff;
          overflow: hidden;
        }
        .upload-preview img { width: 100%; height: 100%; object-fit: cover; }

        .upload-label { font-size: 11px; color: #888; line-height: 1.4; font-weight: 500; }
        .upload-label.has-file { color: ${PRIMARY}; }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          background: ${PRIMARY};
          color: #fff;
          border: none;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .upload-btn:hover { background: ${PRIMARY_DARK}; }
        .upload-input { display: none; }

        .kyc-submit {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
          gap: 12px;
          align-items: center;
        }

        .kyc-submit-btn {
          padding: 11px 28px;
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
          gap: 8px;
          font-family: inherit;
        }
        .kyc-submit-btn:hover:not(:disabled) {
          background: ${PRIMARY_DARK};
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(192,57,43,0.3);
        }
        .kyc-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .kyc-submit-btn.submitted { background: #1a7a4a; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          z-index: 9999;
          animation: slideIn 0.3s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .toast.success { background: #1a7a4a; }
        .toast.error { background: #E24B4A; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 640px) {
          .kyc-card { padding: 24px 18px; }
          .kyc-row { flex-direction: column; gap: 6px; }
          .kyc-row-label { flex: none; padding-top: 0; }
          .upload-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .kyc-page { padding: 0; background: #fff; }
          .kyc-card { border-radius: 0; box-shadow: none; max-width: 100%; }
          .upload-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="kyc-page">
        <div className="kyc-card">

          {/* Header */}
          <div className="kyc-header">
            <FiUser className="kyc-header-icon" />
            <h1 className="kyc-header-title">Seller KYC Verification</h1>
          </div>

          <div className="kyc-brand">Mero Bazaar</div>
          <div className="kyc-status-badge">⏳ Pending Verification</div>

          <div className="kyc-divider" />

          {/* Personal Information */}
          <h2 className="kyc-section-title">Personal Information</h2>

          <div className="kyc-row">
            <span className="kyc-row-label">Full Name</span>
            <div className="kyc-row-content">
              <input className="kyc-input" type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="As on citizenship" />
            </div>
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Date of Birth</span>
            <div className="kyc-row-content">
              <div className="kyc-date-wrapper">
                <input
                  className="kyc-input"
                  type="text"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                  style={{ paddingRight: "32px" }}
                />
                <input
                  type="date"
                  ref={dateInputRef}
                  style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                />
                <button type="button" className="kyc-date-icon-btn" onClick={() => dateInputRef.current?.showPicker()} aria-label="Open date picker">
                  <FiCalendar size={13} />
                </button>
              </div>
            </div>
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">PAN Number</span>
            <div className="kyc-row-content">
              <input className="kyc-input" type="text" name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="e.g. AB12345 or 123456789" />
            </div>
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Contact Number</span>
            <div className="kyc-row-content">
              {!phoneVerified ? (
                <>
                  <div className="otp-row">
                    <input
                      className="kyc-input"
                      type="tel"
                      name="contactNumber"
                      value={form.contactNumber}
                      onChange={handleChange}
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                      disabled={otpSent}
                    />
                    <button className="btn-send" onClick={sendOtp} disabled={sendingOtp}>
                      {sendingOtp ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
                    </button>
                  </div>
                  {otpSent && (
                    <>
                      <div className="otp-entry">
                        <input
                          className="otp-code-input"
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          placeholder="000000"
                        />
                        <button className="btn-send" onClick={verifyOtp} disabled={verifyingOtp}>
                          {verifyingOtp ? "Checking..." : "Verify"}
                        </button>
                      </div>
                      <div className="otp-hint">Enter the 6-digit code sent to {form.contactNumber}</div>
                    </>
                  )}
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input className="kyc-input" type="text" value={form.contactNumber} disabled />
                  <span className="verified-chip"><FiCheckCircle size={13} /> Verified</span>
                </div>
              )}
            </div>
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Address</span>
            <div className="kyc-row-content">
              <input className="kyc-input" type="text" name="address" value={form.address} onChange={handleChange} placeholder="City, District" />
            </div>
          </div>

          <div className="kyc-divider" />

          {/* Identity Documents */}
          <h2 className="kyc-section-title">Identity Documents</h2>

          <div className="upload-grid">
            {/* PAN Card */}
            <div className={`upload-box${panCard ? " has-file" : ""}`} onClick={() => document.getElementById("filePan")?.click()}>
              <div className="upload-preview">
                {panCardPreview ? <img src={panCardPreview} alt="PAN preview" /> : <FiCreditCard />}
              </div>
              <div className={`upload-label${panCard ? " has-file" : ""}`}>
                {panCard ? panCard.name.slice(0, 14) + (panCard.name.length > 14 ? "…" : "") : "PAN Card"}
              </div>
              <label className="upload-btn" onClick={(e) => e.stopPropagation()}>
                <FiUpload size={10} />
                {panCard ? "Change" : "Upload"}
                <input type="file" id="filePan" className="upload-input" accept="image/*,.pdf" onChange={handleFileChange("panCard")} />
              </label>
            </div>

            {/* Passport Photo */}
            <div className={`upload-box${photo ? " has-file" : ""}`} onClick={() => document.getElementById("filePhoto")?.click()}>
              <div className="upload-preview">
                {photoPreview ? <img src={photoPreview} alt="Photo preview" /> : <FiUser />}
              </div>
              <div className={`upload-label${photo ? " has-file" : ""}`}>
                {photo ? photo.name.slice(0, 14) + (photo.name.length > 14 ? "…" : "") : "Passport Photo"}
              </div>
              <label className="upload-btn" onClick={(e) => e.stopPropagation()}>
                <FiUpload size={10} />
                {photo ? "Change" : "Upload"}
                <input type="file" id="filePhoto" className="upload-input" accept="image/*" onChange={handleFileChange("photo")} />
              </label>
            </div>

            {/* Selfie with PAN */}
            <div className={`upload-box${selfieWithPan ? " has-file" : ""}`} onClick={() => document.getElementById("fileSelfie")?.click()}>
              <div className="upload-preview">
                {selfiePreview ? <img src={selfiePreview} alt="Selfie preview" /> : <FiCamera />}
              </div>
              <div className={`upload-label${selfieWithPan ? " has-file" : ""}`}>
                {selfieWithPan ? selfieWithPan.name.slice(0, 14) + (selfieWithPan.name.length > 14 ? "…" : "") : "Selfie with PAN"}
              </div>
              <label className="upload-btn" onClick={(e) => e.stopPropagation()}>
                <FiUpload size={10} />
                {selfieWithPan ? "Change" : "Upload"}
                <input type="file" id="fileSelfie" className="upload-input" accept="image/*" onChange={handleFileChange("selfieWithPan")} />
              </label>
            </div>
          </div>

          <div className="kyc-divider" />

          {/* Bank Details */}
          <h2 className="kyc-section-title">Bank Details</h2>

          <div className="kyc-row">
            <span className="kyc-row-label">Bank Name</span>
            <div className="kyc-row-content">
              <input className="kyc-input" type="text" name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. Nepal Investment Bank" />
            </div>
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Account Number</span>
            <div className="kyc-row-content">
              <input className="kyc-input" type="text" name="account" value={form.account} onChange={handleChange} placeholder="Bank account number" />
            </div>
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Account Holder</span>
            <div className="kyc-row-content">
              <input className="kyc-input" type="text" name="accountHolderName" value={form.accountHolderName} onChange={handleChange} placeholder="As on bank account" />
            </div>
          </div>

          {/* Submit */}
          <div className="kyc-submit">
            <button
              className={`kyc-submit-btn${submitted ? " submitted" : ""}`}
              onClick={handleSubmit}
              disabled={submitting || submitted}
            >
              {submitting ? (
                <><div className="spinner" /> Submitting...</>
              ) : submitted ? (
                <><FiCheckCircle size={15} /> Submitted</>
              ) : (
                <>Submit for Verification</>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
