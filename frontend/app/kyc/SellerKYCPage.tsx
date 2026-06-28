"use client";

import { useState, useRef } from "react";
import {
  FiUser, FiCalendar, FiUpload, FiCreditCard, FiCamera,
  FiCheckCircle, FiShield, FiLock, FiArrowRight, FiArrowLeft
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";
const PRIMARY_LIGHT = "#FAECE7";

type Phase = 1 | 2 | 3;

export default function SellerKYCPage() {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const [phase, setPhase] = useState<Phase>(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    panNumber: "",
    contactNumber: "",
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
  const [panOcrStatus, setPanOcrStatus] = useState<"idle" | "scanning" | "ok" | "warn">("idle");
  const [faceStatus, setFaceStatus] = useState<"idle" | "scanning" | "ok" | "error">("idle");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange =
    (field: "panCard" | "photo" | "selfieWithPan") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      const setFile =
        field === "panCard" ? setPanCard : field === "photo" ? setPhoto : setSelfieWithPan;
      const setPreview =
        field === "panCard" ? setPanCardPreview : field === "photo" ? setPhotoPreview : setSelfiePreview;
      setFile(file);
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      // ocr on pan card
      if (field === "panCard" && file && file.type.startsWith("image/")) {
        setPanOcrStatus("scanning");
        try {
          const { createWorker } =  await import("tesseract.js");
          const worker = await createWorker("eng");
          const { data: { text } } = await worker.recognize(file);
          await worker.terminate();
          const pan = form.panNumber.trim().toUpperCase();
          if (pan && text.toUpperCase().includes(pan)) {
            setPanOcrStatus("ok");
            toast.success("PAN number verified in document");
          } else {
            setPanOcrStatus("warn");
            toast.warn("PAN number not found in uploaded image");
          }
        } catch {
          setPanOcrStatus("idle");
        }
      }

    //face detection
    if (field === "selfieWithPan" && file && file.type.startsWith("image/")) {
      setFaceStatus("scanning");
      try {
        const faceapi = await import("face-api.js");
        await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/models"),]);
        const image = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(image, 0, 0);
        const detection = await faceapi.detectSingleFace(
          canvas as unknown as HTMLCanvasElement,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (detection) {
          setFaceStatus("ok");
          toast.success("Face detected in selfie");
        } else {
          setFaceStatus("error");
          toast.error("No face detected");
        }
      } catch {
        setFaceStatus("idle");
      }
    }  
    };

  // ── OTP handler
  const sendOtp = async () => {
    const token = session?.accessToken;

    if (!token) {
      toast.error("Please log in first!");
      return;
    }
    const phone = form.contactNumber.trim();
    if (!/^(98|97)\d{8}$/.test(phone)) {
      toast.error("Enter a valid Nepal number (98/97XXXXXXXX)");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch("/api/vendor-kyc/otp/send", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setOtpSent(true);
      toast.success(`OTP sent to ${phone}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    const token = session?.accessToken;

    if (!token) {
      toast.error("Please log in first");
      return;
    }
    if (otp.length !== 6) { toast.error("Enter the 6-digit OTP"); return; }
    setVerifyingOtp(true);
    try {
      const res = await fetch("/api/vendor-kyc/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json",
                   Authorization: `Bearer ${token}`    
                 },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      setPhoneVerified(true);
      setOtpSent(false);
      toast.success("Phone number verified!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong!");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const goToPhase2 = () => {
    if (!form.fullName.trim()) { toast.error("Full name is required"); return; }
    if (!form.dateOfBirth) { toast.error("Date of birth is required"); return; }
    if (!form.panNumber.trim()) { toast.error("PAN number is required"); return; }
    if (!phoneVerified) { toast.error("Verify your contact number before continuing"); return; }
    setPhase(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPhase3 = () => {
    if (!panCard || !photo || !selfieWithPan) {
      toast.error("Upload all 3 documents to continue");
      return;
    }
    if (faceStatus == "error") {
      toast.error("Please re-upload self");
      return;
    }
    if (panOcrStatus === "warn") {
      toast.warn("PAN number mismatch");
    }
    setPhase(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!form.bankName.trim() || !form.account.trim() || !form.accountHolderName.trim()) {
      toast.error("Fill in all bank details");
      return;
    }
    const token = session?.accessToken;
    if (!token) { toast.error("Please log in first"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (panCard) fd.append("panCardUrl", panCard);
      if (photo) fd.append("photoUrl", photo);
      if (selfieWithPan) fd.append("selfieWithPanUrl", selfieWithPan);
      const res = await fetch("/api/vendor-kyc/submit", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      setSubmitted(true);
      toast.success("KYC submitted successfully!");
      setTimeout(() => router.push("/seller/dashboard"), 2000);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  // Progress stepper helpers
  const progressFill = submitted ? "100%" : phase === 1 ? "0%" : phase === 2 ? "50%" : "100%";

  type StepState = "done" | "active" | "idle";
  const stepState = (n: number): StepState => {
    if (submitted || phase > n) return "done";
    if (phase === n) return "active";
    return "idle";
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .kyc-page {
          min-height: 100vh;
          background: #f5f5f5;
          display: flex; align-items: flex-start; justify-content: center;
          padding: 40px 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .kyc-wrap {
          width: 100%; max-width: 640px;
          display: flex; flex-direction: column; gap: 16px;
        }

        /* ── Progress bar ── */
        .kyc-progress {
          background: #fff;
          border-radius: 14px;
          padding: 20px 24px 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .kyc-brand { font-size: 17px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 2px; display: flex; align-items: center; gap: 7px; }
        .kyc-sub { font-size: 12px; color: #888; margin-bottom: 18px; }

        .stepper { display: flex; align-items: flex-start; justify-content: space-between; position: relative; margin-bottom: 12px; }
        .stepper-line {
          position: absolute; top: 17px; left: 8%; width: 84%;
          height: 2px; background: #e8e8e8; z-index: 0;
        }
        .stepper-line-fill {
          height: 100%; background: ${PRIMARY}; transition: width 0.4s ease;
        }
        .step { display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 1; flex: 1; }
        .step-circle {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600;
          border: 2px solid #e0e0e0;
          background: #fff; color: #aaa;
          transition: all 0.3s;
        }
        .step-circle.active { border-color: ${PRIMARY}; background: ${PRIMARY}; color: #fff; }
        .step-circle.done { border-color: #1a7a4a; background: #1a7a4a; color: #fff; }
        .step-lbl { font-size: 11px; color: #aaa; text-align: center; line-height: 1.3; }
        .step-lbl.active { color: ${PRIMARY}; font-weight: 600; }
        .step-lbl.done { color: #1a7a4a; }
        .stepper-hint { font-size: 11px; color: #999; text-align: center; }

        /* ── Card ── */
        .kyc-card {
          background: #fff;
          border-radius: 14px;
          padding: 28px 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .phase-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; }
        .phase-badge {
          width: 36px; height: 36px; border-radius: 50%;
          background: ${PRIMARY}; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700; flex-shrink: 0;
        }
        .phase-title { font-size: 17px; font-weight: 700; color: #1a1a1a; }
        .phase-desc { font-size: 12px; color: #888; margin-top: 2px; }

        /* ── Field rows ── */
        .field-row {
          display: grid; grid-template-columns: 148px 1fr;
          align-items: start; gap: 10px;
          margin-bottom: 10px; padding-bottom: 10px;
          border-bottom: 1px solid #f5f5f5;
        }
        .field-row:last-of-type { border-bottom: none; margin-bottom: 0; }
        .field-label { font-size: 13px; font-weight: 500; color: #555; padding-top: 8px; line-height: 1.4; }
        .field-label .req { color: ${PRIMARY}; }

        .kyc-input {
          width: 100%; padding: 8px 10px;
          border: 1px solid #e0e0e0; border-radius: 7px;
          font-size: 13px; color: #333;
          background: #fff; font-family: inherit; outline: none;
          transition: border-color 0.2s;
        }
        .kyc-input:focus { border-color: ${PRIMARY}; box-shadow: 0 0 0 2px rgba(192,57,43,0.1); }
        .kyc-input:disabled { background: #f8f8f8; color: #999; cursor: not-allowed; }
        .kyc-input::placeholder { color: #c0c0c0; }

        .date-wrap { position: relative; }
        .date-icon-btn {
          position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: #999; cursor: pointer;
          display: flex; align-items: center; padding: 3px;
          transition: color 0.2s;
        }
        .date-icon-btn:hover { color: ${PRIMARY}; }

        /* ── OTP ── */
        .otp-row { display: flex; gap: 8px; }
        .otp-row .kyc-input { flex: 1; }
        .btn-otp {
          white-space: nowrap; padding: 8px 14px;
          background: ${PRIMARY}; color: #fff;
          border: none; border-radius: 7px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: inherit; transition: background 0.2s;
        }
        .btn-otp:hover:not(:disabled) { background: ${PRIMARY_DARK}; }
        .btn-otp:disabled { opacity: 0.55; cursor: not-allowed; }

        .otp-entry {
          margin-top: 8px; padding: 10px 12px;
          background: #f9f9f9; border-radius: 8px;
          border: 1px solid #eee;
          display: flex; gap: 8px; align-items: center;
        }
        .otp-code {
          flex: 1; letter-spacing: 7px; font-size: 18px;
          text-align: center; padding: 7px 10px;
          border: 1px solid #e0e0e0; border-radius: 7px;
          font-family: monospace; background: #fff; color: #333; outline: none;
        }
        .otp-code:focus { border-color: ${PRIMARY}; }
        .otp-hint { font-size: 11px; color: #aaa; margin-top: 5px; }

        .verified-chip {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600;
          color: #1a7a4a; background: #e6f7ee;
          padding: 5px 12px; border-radius: 20px;
        }

        /* ── Upload grid ── */
        .upload-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .upload-box {
          border: 1.5px dashed #e0e0e0; border-radius: 10px;
          padding: 16px 10px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          cursor: pointer; transition: all 0.2s; background: #fafafa;
        }
        .upload-box:hover { border-color: ${PRIMARY}; background: ${PRIMARY_LIGHT}; }
        .upload-box.done { border-style: solid; border-color: #1a7a4a; background: #f0faf4; }
        .upload-icon {
          width: 52px; height: 42px; border-radius: 7px;
          border: 1px solid #eee; background: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: #ccc; overflow: hidden;
        }
        .upload-icon img { width: 100%; height: 100%; object-fit: cover; }
        .upload-lbl { font-size: 11px; color: #999; line-height: 1.4; font-weight: 500; }
        .upload-lbl.done { color: #1a7a4a; }
        .upload-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 10px; background: ${PRIMARY}; color: #fff;
          border: none; border-radius: 5px;
          font-size: 10px; font-weight: 600; cursor: pointer;
          font-family: inherit; transition: background 0.2s;
        }
        .upload-btn:hover { background: ${PRIMARY_DARK}; }
        .upload-input { display: none; }
        .upload-info {
          margin-top: 12px; padding: 10px 13px;
          background: #f9f9f9; border-radius: 8px;
          border: 1px solid #eee;
          font-size: 11px; color: #888; line-height: 1.6;
        }

        /* ── Actions ── */
        .action-row {
          display: flex; justify-content: flex-end;
          align-items: center; gap: 12px; margin-top: 22px;
        }
        .btn-back {
          padding: 10px 16px;
          background: transparent; border: 1px solid #e0e0e0;
          border-radius: 8px; font-size: 13px; color: #777;
          cursor: pointer; font-family: inherit;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.2s;
        }
        .btn-back:hover { background: #f5f5f5; border-color: #ccc; }
        .btn-next {
          padding: 11px 22px;
          background: ${PRIMARY}; color: #fff;
          border: none; border-radius: 8px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: inherit;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.2s;
        }
        .btn-next:hover:not(:disabled) {
          background: ${PRIMARY_DARK};
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(192,57,43,0.28);
        }
        .btn-next:disabled { opacity: 0.55; cursor: not-allowed; }
        .btn-next.success { background: #1a7a4a; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* ── Success state ── */
        .success-screen {
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: 32px 20px; gap: 14px;
        }
        .success-icon {
          width: 68px; height: 68px; border-radius: 50%;
          background: #e6f7ee;
          display: flex; align-items: center; justify-content: center;
          color: #1a7a4a; font-size: 32px;
        }
        .success-title { font-size: 20px; font-weight: 700; color: #1a1a1a; }
        .success-sub { font-size: 13px; color: #777; max-width: 320px; line-height: 1.7; }
        .pending-badge {
          padding: 6px 16px; border-radius: 20px;
          background: #FFF3CD; color: #856404;
          font-size: 12px; font-weight: 600;
        }

        @media (max-width: 600px) {
          .kyc-card { padding: 22px 16px; }
          .field-row { grid-template-columns: 1fr; }
          .field-label { padding-top: 0; }
          .upload-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 440px) {
          .kyc-page { padding: 0; background: #fff; }
          .kyc-card, .kyc-progress { border-radius: 0; box-shadow: none; max-width: 100%; }
          .upload-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="kyc-page">
        <div className="kyc-wrap">

          {/* ── Progress header ── */}
          <div className="kyc-progress">
            <div className="kyc-brand">
              <FiShield size={18} /> Mero Bazaar
            </div>
            <div className="kyc-sub">Complete all 3 steps to activate your seller account</div>

            <div className="stepper">
              <div className="stepper-line">
                <div className="stepper-line-fill" style={{ width: progressFill }} />
              </div>
              {[
                { n: 1, label: "Personal\ninfo" },
                { n: 2, label: "Documents" },
                { n: 3, label: "Bank\ndetails" },
              ].map(({ n, label }) => {
                const s = stepState(n);
                return (
                  <div className="step" key={n}>
                    <div className={`step-circle ${s}`}>
                      {s === "done" ? <FiCheckCircle size={14} /> : n}
                    </div>
                    <div className={`step-lbl ${s}`}>
                      {label.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="stepper-hint">
              {!submitted && (
                phase === 1 ? "Fill in your personal details and verify your phone number" :
                phase === 2 ? "Upload your PAN card, passport photo, and selfie with PAN" :
                "Enter your bank account details to receive payments"
              )}
            </div>
          </div>

          {/* ── Phase content ── */}
          {submitted ? (
            <div className="kyc-card">
              <div className="success-screen">
                <div className="success-icon"><FiCheckCircle /></div>
                <div className="success-title">KYC submitted!</div>
                <div className="success-sub">
                  Your application is under review. We will notify you within 1–2 business
                  days once your seller account is activated.
                </div>
                <div className="pending-badge">⏳ Awaiting review</div>
              </div>
            </div>
          ) : phase === 1 ? (
          //phase 1
            <div className="kyc-card">
              <div className="phase-header">
                <div className="phase-badge">1</div>
                <div>
                  <div className="phase-title">Personal information</div>
                  <div className="phase-desc">Basic details as on your citizenship or PAN card</div>
                </div>
              </div>

              <div className="field-row">
                <div className="field-label">Full name <span className="req">*</span></div>
                <input className="kyc-input" type="text" name="fullName" value={form.fullName}
                  onChange={handleChange} placeholder="As on citizenship" />
              </div>

              <div className="field-row">
                <div className="field-label">Date of birth <span className="req">*</span></div>
                <div className="date-wrap">
                  <input className="kyc-input" type="text" name="dateOfBirth" value={form.dateOfBirth}
                    onChange={handleChange} placeholder="YYYY-MM-DD" style={{ paddingRight: 32 }} />
                  <input type="date" ref={dateInputRef}
                    style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                  <button type="button" className="date-icon-btn"
                    onClick={() => dateInputRef.current?.showPicker()} aria-label="Open date picker">
                    <FiCalendar size={14} />
                  </button>
                </div>
              </div>

              <div className="field-row">
                <div className="field-label">PAN number <span className="req">*</span></div>
                <input className="kyc-input" type="text" name="panNumber" value={form.panNumber}
                  onChange={handleChange} placeholder="e.g. AB12345 or 123456789" />
              </div>

              <div className="field-row">
                <div className="field-label">Contact number <span className="req">*</span></div>
                <div>
                  {phoneVerified ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input className="kyc-input" value={form.contactNumber} disabled style={{ flex: 1 }} />
                      <span className="verified-chip"><FiCheckCircle size={13} /> Verified</span>
                    </div>
                  ) : (
                    <>
                      <div className="otp-row">
                        <input className="kyc-input" type="tel" name="contactNumber"
                          value={form.contactNumber} onChange={handleChange}
                          placeholder="98XXXXXXXX" maxLength={10} disabled={otpSent} />
                        <button className="btn-otp" onClick={sendOtp} disabled={sendingOtp}>
                          {sendingOtp ? "Sending…" : otpSent ? "Resend" : "Send OTP"}
                        </button>
                      </div>
                      {otpSent && (
                        <>
                          <div className="otp-entry">
                            <input className="otp-code" type="text" maxLength={6} value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                              placeholder="000000" autoComplete="one-time-code" />
                            <button className="btn-otp" onClick={verifyOtp} disabled={verifyingOtp}>
                              {verifyingOtp ? "Checking…" : "Verify"}
                            </button>
                          </div>
                          <div className="otp-hint">
                            Enter the 6-digit code sent to {form.contactNumber}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="field-row">
                <div className="field-label">Address</div>
                <input className="kyc-input" type="text" name="address" value={form.address}
                  onChange={handleChange} placeholder="City, District" />
              </div>

              <div className="action-row">
                <button className="btn-next" onClick={goToPhase2}>
                  Continue to documents <FiArrowRight size={15} />
                </button>
              </div>
            </div>

          ) : phase === 2 ? (

            //phase 2
            <div className="kyc-card">
              <div className="phase-header">
                <div className="phase-badge">2</div>
                <div>
                  <div className="phase-title">Identity documents</div>
                  <div className="phase-desc">Clear images — JPEG, PNG, or PDF accepted, max 5 MB each</div>
                </div>
              </div>

              <div className="upload-grid">
                {/* PAN card */}
                <div className={`upload-box${panCard ? " done" : ""}`}
                  onClick={() => document.getElementById("filePan")?.click()}>
                  <div className="upload-icon">
                    {panCardPreview ? <img src={panCardPreview} alt="PAN" /> : <FiCreditCard />}
                  </div>
                  <div className={`upload-lbl${panCard ? " done" : ""}`}>
                    {panCard ? (panCard.name.length > 14 ? panCard.name.slice(0, 14) + "…" : panCard.name) : "PAN card"}
                  </div>

                  {panOcrStatus === "scanning" && <span style={{ fontSize: 10, color: "#888" }}>Scanning...</span>}
                  {panOcrStatus === "ok" && <span style={{ fontSize: 10, color: "#1a7a4a" }}>PAN verified</span>}
                  {panOcrStatus === "warn" && <span style={{ fontSize: 10, color: "#f59e0b" }}>⚠ PAN mismatch</span>}
                  <label className="upload-btn" onClick={(e) => e.stopPropagation()}>
                    <FiUpload size={10} /> {panCard ? "Change" : "Upload"}
                    <input type="file" id="filePan" className="upload-input"
                      accept="image/*,.pdf" onChange={handleFileChange("panCard")} />
                  </label>
                </div>

                {/* Passport photo */}
                <div className={`upload-box${photo ? " done" : ""}`}
                  onClick={() => document.getElementById("filePhoto")?.click()}>
                  <div className="upload-icon">
                    {photoPreview ? <img src={photoPreview} alt="Photo" /> : <FiUser />}
                  </div>
                  <div className={`upload-lbl${photo ? " done" : ""}`}>
                    {photo ? (photo.name.length > 14 ? photo.name.slice(0, 14) + "…" : photo.name) : "Passport photo"}
                  </div>
                  <label className="upload-btn" onClick={(e) => e.stopPropagation()}>
                    <FiUpload size={10} /> {photo ? "Change" : "Upload"}
                    <input type="file" id="filePhoto" className="upload-input"
                      accept="image/*" onChange={handleFileChange("photo")} />
                  </label>
                </div>

                {/* Selfie with PAN */}
                <div className={`upload-box${selfieWithPan ? " done" : ""}`}
                  onClick={() => document.getElementById("fileSelfie")?.click()}>
                  <div className="upload-icon">
                    {selfiePreview ? <img src={selfiePreview} alt="Selfie" /> : <FiCamera />}
                  </div>
                  <div className={`upload-lbl${selfieWithPan ? " done" : ""}`}>
                    {selfieWithPan ? (selfieWithPan.name.length > 14 ? selfieWithPan.name.slice(0, 14) + "…" : selfieWithPan.name) : "Selfie with PAN"}
                  </div>
                  {faceStatus === "scanning" && <span style={{ fontSize: 10, color: "#888" }}>Detecting face…</span>}
                  {faceStatus === "ok" && <span style={{ fontSize: 10, color: "#1a7a4a" }}>✓ Face detected</span>}
                  {faceStatus === "error" && <span style={{ fontSize: 10, color: "#ef4444" }}>✗ No face found</span>}
                  <label className="upload-btn" onClick={(e) => e.stopPropagation()}>
                    <FiUpload size={10} /> {selfieWithPan ? "Change" : "Upload"}
                    <input type="file" id="fileSelfie" className="upload-input"
                      accept="image/*" capture="user" onChange={handleFileChange("selfieWithPan")} />
                  </label>
                </div>
              </div>

              <div className="upload-info">
                All 3 documents are required. Images must be clear, well-lit, and unobstructed.
              </div>

              <div className="action-row">
                <button className="btn-back" onClick={() => setPhase(1)}>
                  <FiArrowLeft size={14} /> Back
                </button>
                <button className="btn-next" onClick={goToPhase3}>
                  Continue to bank details <FiArrowRight size={15} />
                </button>
              </div>
            </div>

          ) : (
          //phase 3
            <div className="kyc-card">
              <div className="phase-header">
                <div className="phase-badge">3</div>
                <div>
                  <div className="phase-title">Bank details</div>
                  <div className="phase-desc">Where your seller payments will be sent</div>
                </div>
              </div>

              <div className="field-row">
                <div className="field-label">Bank name <span className="req">*</span></div>
                <input className="kyc-input" type="text" name="bankName" value={form.bankName}
                  onChange={handleChange} placeholder="e.g. Nepal Investment Bank" />
              </div>

              <div className="field-row">
                <div className="field-label">Account number <span className="req">*</span></div>
                <input className="kyc-input" type="text" name="account" value={form.account}
                  onChange={handleChange} placeholder="Bank account number" />
              </div>

              <div className="field-row">
                <div className="field-label">Account holder <span className="req">*</span></div>
                <input className="kyc-input" type="text" name="accountHolderName"
                  value={form.accountHolderName} onChange={handleChange}
                  placeholder="As on bank account" />
              </div>

              <div className="action-row">
                <button className="btn-back" onClick={() => setPhase(2)}>
                  <FiArrowLeft size={14} /> Back
                </button>
                <button className={`btn-next${submitted ? " success" : ""}`}
                  onClick={handleSubmit} disabled={submitting || submitted}>
                  {submitting ? (
                    <><div className="spinner" /> Submitting…</>
                  ) : submitted ? (
                    <><FiCheckCircle size={15} /> Submitted</>
                  ) : (
                    <><FiShield size={15} /> Submit for verification</>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
