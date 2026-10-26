"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiUser, FiCalendar, FiUpload, FiCreditCard, FiCamera,
  FiCheckCircle, FiShield, FiArrowRight, FiArrowLeft
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";
const PRIMARY_LIGHT = "#FAECE7";

type Phase = 1 | 2 | 3;

type FormKey =
  | "fullName" | "dateOfBirth" | "panNumber" | "contactNumber"
  | "address" | "bankName" | "account" | "accountHolderName";
type ErrorKey = FormKey | "otp" | "panCard" | "photo" | "selfieWithPan";
type Errors = Partial<Record<ErrorKey, string>>;

/* ── validation rules (PAN + phone mirror the backend DTO) ── */
const NAME_RE = new RegExp("^[\\p{L}\\p{M}][\\p{L}\\p{M}\\s.'-]{1,99}$", "u");
const PAN_RE = /^[A-Z]{2}-\d{5}$|^[A-Z]{2}\d{5}$|^\d{9}$/;
const PHONE_RE = /^(98|97)\d{8}$/;
const ACCOUNT_RE = /^[A-Za-z0-9]{8,25}$/;
const DOB_RE = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_EXT = [".jpg", ".jpeg", ".png"];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const maxDobIso = () => {
  const t = new Date();
  return toIso(new Date(t.getFullYear() - 18, t.getMonth(), t.getDate()));
};

function validateDob(v: string): string | null {
  if (!DOB_RE.test(v)) return "Use the format YYYY-MM-DD";
  const [y, m, d] = v.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (y < 1900 || dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d)
    return "Enter a valid date";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dt > today) return "Date of birth can't be in the future";
  const eighteen = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  if (dt > eighteen) return "You must be at least 18 years old";
  return null;
}

function checkImageFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) return "Only JPG or PNG images are allowed";
  if (file.size > MAX_FILE_BYTES) return "File is larger than 5 MB";
  return null;
}

//preprocession: grayscale, contrast boost before OCR
function preprocessImageForOCR(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const stretched = Math.min(255, Math.max(0, (avg - 128) * 1.4 + 128));
        data[i] = data[i + 1] = data[i + 2] = stretched;
      }
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas blob failed"))), "image/png");
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

//devanagari to english
function devanagariToEnglish(str: string): string {
  return str.replace(/[०-९]/g, (d) => String(d.charCodeAt(0) - 0x0966));
}

//fuzzy PAN match:handles 0/O and 1/I confusions
function fuzzyMatchPan(ocrText: string, pan: string): boolean {
  const normalize = (s: string) =>
    devanagariToEnglish(s)
    .toUpperCase().replace(/0/g, "O").replace(/1/g, "I").replace(/\s/g, "");
  return normalize(ocrText).includes(normalize(pan));
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <div className="field-error" role="alert">{msg}</div> : null;
}

const KYC_CSS = `
  /* scoped, zero specificity: must not touch the navbar or toasts */
  :where(.kyc-page, .kyc-page *) { box-sizing: border-box; margin: 0; padding: 0; }

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
  .kyc-input.error, .kyc-input.error:focus { border-color: #dc2626; }
  .kyc-input.error:focus { box-shadow: 0 0 0 2px rgba(220,38,38,0.12); }

  .field-error { margin-top: 5px; font-size: 11.5px; color: #dc2626; line-height: 1.4; }

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
  .link-btn {
    background: none; border: none; padding: 0; margin-top: 5px;
    color: ${PRIMARY}; font-size: 11px; font-family: inherit;
    text-decoration: underline; cursor: pointer;
  }

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
  .upload-box.error { border-color: #dc2626; background: #fef2f2; }
  .upload-err { font-size: 10px; color: #dc2626; line-height: 1.3; }
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
`;

export default function SellerKYCPage() {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";

  const [phase, setPhase] = useState<Phase>(1);
  const [submitted, setSubmitted] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [existingStatus, setExistingStatus] = useState<"VERIFIED" | "PENDING" | "REJECTED" | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [existingDocs, setExistingDocs] = useState<{ panCardUrl?: string | null; photoUrl?: string | null; selfieWithPanUrl?: string | null }>({});
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState<Record<FormKey, string>>({
    fullName: "",
    dateOfBirth: "",
    panNumber: "",
    contactNumber: "",
    address: "",
    bankName: "",
    account: "",
    accountHolderName: "",
  });
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [panCard, setPanCard] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [selfieWithPan, setSelfieWithPan] = useState<File | null>(null);
  const [panCardPreview, setPanCardPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const clearError = (key: ErrorKey) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const inputCls = (key: ErrorKey) => `kyc-input${errors[key] ? " error" : ""}`;

  useEffect(() => {
    const checkExisting = async () => {
      const token = session?.accessToken;
      if (!token) {
        setCheckingStatus(false);
        return;
      }
      try {
        const res = await fetch("/api/vendor-kyc/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setCheckingStatus(false);
          return;
        }

        if (res.ok) {
          const kyc = await res.json();

          if (!kyc.fullName) {
            setCheckingStatus(false);
            return;
          }

          // Pending review: editing isn't available either way — bounce to dashboard.
          if (kyc.status === "PENDING") {
            if (isEditMode) {
              toast.info("Your KYC is under review — editing isn't available until it's decided.");
            }
            router.replace("/seller/dashboard");
            return;
          }

          // Verified: only allow the wizard here if the user came via Edit.
          if (kyc.status === "VERIFIED" && !isEditMode) {
            router.replace("/seller/dashboard");
            return;
          }

          // Reached only for: REJECTED (always), or VERIFIED + edit mode.
          if (kyc.status === "REJECTED" || (kyc.status === "VERIFIED" && isEditMode)) {
            setExistingStatus(kyc.status);
            setRejectionReason(kyc.rejectionReason ?? null);
            setForm({
              fullName: kyc.fullName ?? "",
              dateOfBirth: kyc.dateOfBirth ? kyc.dateOfBirth.slice(0, 10) : "",
              panNumber: kyc.panNumber ?? "",
              contactNumber: kyc.contactNumber ?? "",
              address: kyc.address ?? "",
              bankName: kyc.bankName ?? "",
              account: kyc.account ?? "",
              accountHolderName: kyc.accountHolderName ?? "",
            });

            setExistingDocs({
              panCardUrl: kyc.panCardUrl ?? null,
              photoUrl: kyc.photoUrl ?? null,
              selfieWithPanUrl: kyc.selfieWithPanUrl ?? null,
            });

            const loadPreview = async (filename: string | null, setPreview: (url: string) => void) => {
              if (!filename) return;
              try {
                const res = await fetch(`/api/vendor-kyc/document/${filename}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                  console.error("doc fetch failed", filename, res.status, await res.text());
                  return;
                }
                const blob = await res.blob();
                setPreview(URL.createObjectURL(blob));
              } catch (e) {
                console.error("doc fetch threw", filename, e);
              }
            };
            await Promise.all([
              loadPreview(kyc.panCardUrl, setPanCardPreview),
              loadPreview(kyc.photoUrl, setPhotoPreview),
              loadPreview(kyc.selfieWithPanUrl, setSelfiePreview),
            ]);

            if (kyc.phoneVerified) setPhoneVerified(true);
            setCheckingStatus(false);
            return;
          }
        }

        setCheckingStatus(false);
      } catch {
        setCheckingStatus(false);
      }
    };

    checkExisting();
     
  }, [session, router, isEditMode]);


  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [panOcrStatus, setPanOcrStatus] = useState<"idle" | "scanning" | "ok" | "warn">("idle");
  const [faceStatus, setFaceStatus] = useState<"idle" | "scanning" | "ok" | "error">("idle");
  const ocrKeyRef = useRef("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FormKey;
    let value = e.target.value;
    if (name === "contactNumber") value = value.replace(/\D/g, "");
    if (name === "account") value = value.replace(/[^A-Za-z0-9]/g, "");
    if (name === "panNumber") {
      value = value.toUpperCase().replace(/\s/g, "");
      // PAN changed: any earlier OCR result no longer applies
      setPanOcrStatus("idle");
      ocrKeyRef.current = "";
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  // ── PAN OCR (runs from event handlers only, skipped if file + PAN unchanged)
  const runPanOcr = async (file: File, panRaw: string) => {
    const pan = panRaw.trim().toUpperCase();
    if (!pan) return;
    const key = `${file.name}|${file.size}|${file.lastModified}|${pan}`;
    if (ocrKeyRef.current === key) return;
    ocrKeyRef.current = key;

    setPanOcrStatus("scanning");
    try {
      const processed = await preprocessImageForOCR(file);
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng+nep", 1, {
        langPath: "/models",
      });
      const result = await worker.recognize(processed);
      const words = (result.data as unknown as { words: { confidence: number; text: string }[] }).words ?? [];
      await worker.terminate();

      const confidentText = words
        .filter((w) => w.confidence > 65)
        .map((w) => w.text)
        .join(" ");

      if (fuzzyMatchPan(confidentText, pan)) {
        setPanOcrStatus("ok");
        toast.success("PAN number verified in document");
      } else {
        setPanOcrStatus("warn");
        toast.error("PAN number not found in uploaded image");
      }
    } catch {
      ocrKeyRef.current = "";
      setPanOcrStatus("warn");
      toast.error("OCR failed - try again!");
    }
  };

  // ── shared face detection logic (used by camera capture)
  const runFaceDetection = async (file: File) => {
    setFaceStatus("scanning");
    try {
      const faceapi = await import("face-api.js");
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      ]);
      const image = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d")!.drawImage(image, 0, 0);

      const detections = await faceapi
        .detectAllFaces(
          canvas as unknown as HTMLCanvasElement,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.7 })
        )
        .withFaceLandmarks();

      if (detections.length === 0) {
        setFaceStatus("error");
        toast.error("Ensure your face is clearly visible!");
      } else if (detections.length > 1) {
        setFaceStatus("error");
        toast.error("Multiple face detected");
      } else {
        setFaceStatus("ok");
        clearError("selfieWithPan");
        toast.success("Face detected successfully!");
      }
    } catch {
      setFaceStatus("idle");
      toast.warn("Face detection unavailable!");
    }
  };

  const handleFileChange =
    (field: "panCard" | "photo") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const file = input.files?.[0];
      if (!file) return; // dialog cancelled: keep the current selection

      const problem = checkImageFile(file);
      if (problem) {
        setErrors((prev) => ({ ...prev, [field]: problem }));
        toast.error(problem);
        input.value = "";
        return;
      }
      clearError(field);

      const setFile = field === "panCard" ? setPanCard : setPhoto;
      const setPreview = field === "panCard" ? setPanCardPreview : setPhotoPreview;
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      if (field === "panCard") void runPanOcr(file, form.panNumber);
    };

  // ── Desktop/webcam camera capture
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      setShowCamera(true);
    } catch {
      toast.error("Could not access camera");
    }
  };

  // attach stream to video element once it's actually mounted
  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [showCamera]);

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  };

  const captureSelfie = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.videoWidth || !video.videoHeight) {
      toast.error("Camera still loading, try again in a moment");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    // JPEG keeps the capture well under the 5 MB server limit
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        const problem = checkImageFile(file);
        if (problem) {
          toast.error(problem);
          return;
        }
        setSelfieWithPan(file);
        setSelfiePreview(canvas.toDataURL("image/jpeg", 0.9));
        clearError("selfieWithPan");
        closeCamera();
        await runFaceDetection(file);
      },
      "image/jpeg",
      0.9,
    );
  };

  // stop camera if the component unmounts mid-capture
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ── OTP handler
  const sendOtp = async () => {
    const token = session?.accessToken;

    if (!token) {
      toast.error("Please log in first!");
      return;
    }
    const phone = form.contactNumber.trim();
    if (!PHONE_RE.test(phone)) {
      setErrors((prev) => ({ ...prev, contactNumber: "Enter a valid Nepal number (98/97XXXXXXXX)" }));
      return;
    }
    clearError("contactNumber");
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
    if (!/^\d{6}$/.test(otp)) {
      setErrors((prev) => ({ ...prev, otp: "Enter the 6-digit code" }));
      return;
    }
    clearError("otp");
    setVerifyingOtp(true);
    try {
      const res = await fetch("/api/vendor-kyc/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json",
                   Authorization: `Bearer ${token}`
                 },
        body: JSON.stringify({ otp, phone: form.contactNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      setPhoneVerified(true);
      setOtpSent(false);
      clearError("contactNumber");
      toast.success("Phone number verified!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong!");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ── per-phase validation
  const validatePersonal = (): boolean => {
    const next: Errors = {};
    const name = form.fullName.trim();
    if (!name) next.fullName = "Full name is required";
    else if (!NAME_RE.test(name)) next.fullName = "Use letters only (at least 2 characters)";

    if (!form.dateOfBirth) next.dateOfBirth = "Date of birth is required";
    else {
      const msg = validateDob(form.dateOfBirth);
      if (msg) next.dateOfBirth = msg;
    }

    const pan = form.panNumber.trim();
    if (!pan) next.panNumber = "PAN number is required";
    else if (!PAN_RE.test(pan)) next.panNumber = "Invalid PAN. Use AB12345, AB-12345 or 9 digits";

    if (!PHONE_RE.test(form.contactNumber.trim()))
      next.contactNumber = "Enter a valid Nepal number (98/97XXXXXXXX)";
    else if (!phoneVerified) next.contactNumber = "Verify this number with the OTP";

    const address = form.address.trim();
    if (!address) next.address = "Address is required";
    else if (address.length < 3) next.address = "Enter your city and district";

    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please fix the highlighted fields");
      return false;
    }
    return true;
  };

  const validateBank = (): boolean => {
    const next: Errors = {};
    if (form.bankName.trim().length < 2) next.bankName = "Bank name is required";
    if (!form.account) next.account = "Account number is required";
    else if (!ACCOUNT_RE.test(form.account)) next.account = "Enter 8–25 letters or digits (no spaces)";
    const holder = form.accountHolderName.trim();
    if (!holder) next.accountHolderName = "Account holder name is required";
    else if (!NAME_RE.test(holder)) next.accountHolderName = "Use letters only (at least 2 characters)";

    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please fix the highlighted fields");
      return false;
    }
    return true;
  };

  const goToPhase2 = () => {
    if (!validatePersonal()) return;
    // PAN may have changed since the card was uploaded: re-check it
    if (panCard) void runPanOcr(panCard, form.panNumber);
    setPhase(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPhase3 = () => {
    const next: Errors = {};
    if (!panCard && !existingDocs.panCardUrl) next.panCard = "Required";
    if (!photo && !existingDocs.photoUrl) next.photo = "Required";
    if (!selfieWithPan && !existingDocs.selfieWithPanUrl) next.selfieWithPan = "Required";
    if (Object.keys(next).length) {
      setErrors(next);
      toast.error("Upload all 3 documents to continue");
      return;
    }
    if (panOcrStatus === "scanning" || faceStatus === "scanning") {
      toast.warn("Still checking your documents, please wait a moment");
      return;
    }
    if (faceStatus === "error") {
      setErrors({ selfieWithPan: "No clear face found. Retake your selfie" });
      toast.error("Please retake your selfie");
      return;
    }
    if (panOcrStatus === "warn") {
      toast.warn("Could not auto-verify PAN number — admin will verify manually");
    }
    setErrors({});
    setPhase(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Send the user back to the step that owns a field the server rejected
  const applyServerError = (msg: string) => {
    if (/must be verified/i.test(msg)) {
      setPhoneVerified(false);
      setOtpSent(false);
      setErrors({ contactNumber: msg });
      setPhase(1);
    } else if (/\bPAN\b/.test(msg)) {
      setErrors({ panNumber: msg });
      setPhase(1);
    } else if (/contact number|phone/i.test(msg)) {
      setErrors({ contactNumber: msg });
      setPhase(1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateBank()) return;
    const token = session?.accessToken;
    if (!token) { toast.error("Please log in first"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v.trim()));
      if (panCard) fd.append("panCardUrl", panCard);
      if (photo) fd.append("photoUrl", photo);
      if (selfieWithPan) fd.append("selfieWithPanUrl", selfieWithPan);
      const res = await fetch("/api/vendor-kyc/submit", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Nest returns string[] for DTO validation errors
        const raw = (data as { message?: string | string[] }).message;
        const msg = Array.isArray(raw) ? raw.join(", ") : raw || "Submission failed";
        applyServerError(msg);
        toast.error(msg);
        return;
      }
      setSubmitted(true);
      toast.success(
        existingStatus === "VERIFIED"
          ? "Changes submitted for re-review!"
          : "KYC submitted successfully!"
      );
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

  if (checkingStatus) {
    return (
      <>
        <style>{KYC_CSS}</style>
        <div className="kyc-page">
          <div className="kyc-wrap">
            <div className="kyc-card" style={{ textAlign: "center", padding: 60 }}>
              <div
                className="spinner"
                style={{ margin: "0 auto", width: 28, height: 28, borderColor: "#eee", borderTopColor: PRIMARY }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{KYC_CSS}</style>

      <div className="kyc-page">
        <div className="kyc-wrap">

          {/* ── Progress header ── */}
          <div className="kyc-progress">
            <div className="kyc-brand">
              <FiShield size={18} /> Mero Bazaar
            </div>
            <div className="kyc-sub">
              {existingStatus === "VERIFIED"
                ? "Update your seller information below"
                : "Complete all 3 steps to activate your seller account"}
            </div>

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

          {existingStatus === "REJECTED" && (
            <div className="kyc-card" style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
              <strong style={{ color: "#B91C1C" }}>Your previous submission was rejected.</strong>
              <p style={{ fontSize: 13, color: "#7F1D1D", marginTop: 8 }}>
                Please review and correct the details below, then resubmit.
              </p>
              {rejectionReason && (
                <p style={{ fontSize: 13, color: "#7F1D1D", marginTop: 8, background: "#FEE2E2", padding: "8px 10px", borderRadius: 6 }}>
                  <strong>Reason:</strong> {rejectionReason}
                </p>
              )}
            </div>
          )}

          {existingStatus === "VERIFIED" && isEditMode && (
            <div className="kyc-card" style={{ background: "#FFF7ED", border: "1px solid #FDBA74" }}>
              <strong style={{ color: "#9A3412" }}>Editing a verified profile.</strong>
              <p style={{ fontSize: 13, color: "#9A3412", marginTop: 8 }}>
                Submitting changes will send your account back for admin re-review. Your seller
                badge stays active while the review is pending.
              </p>
            </div>
          )}

          {/* ── Phase content ── */}
          {submitted ? (
            <div className="kyc-card">
              <div className="success-screen">
                <div className="success-icon"><FiCheckCircle /></div>
                <div className="success-title">
                  {existingStatus === "VERIFIED" ? "Changes submitted!" : "KYC submitted!"}
                </div>
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
                <div>
                  <input className={inputCls("fullName")} type="text" name="fullName" value={form.fullName}
                    onChange={handleChange} placeholder="As on citizenship" maxLength={100} />
                  <FieldError msg={errors.fullName} />
                </div>
              </div>

              <div className="field-row">
                <div className="field-label">Date of birth <span className="req">*</span></div>
                <div>
                  <div className="date-wrap">
                    <input className={inputCls("dateOfBirth")} type="text" name="dateOfBirth" value={form.dateOfBirth}
                      onChange={handleChange} placeholder="YYYY-MM-DD" maxLength={10} style={{ paddingRight: 32 }} />
                    <input type="date" ref={dateInputRef} max={maxDobIso()}
                      style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }));
                        clearError("dateOfBirth");
                      }} />
                    <button type="button" className="date-icon-btn"
                      onClick={() => dateInputRef.current?.showPicker()} aria-label="Open date picker">
                      <FiCalendar size={14} />
                    </button>
                  </div>
                  <FieldError msg={errors.dateOfBirth} />
                </div>
              </div>

              <div className="field-row">
                <div className="field-label">PAN number <span className="req">*</span></div>
                <div>
                  <input className={inputCls("panNumber")} type="text" name="panNumber" value={form.panNumber}
                    onChange={handleChange} placeholder="e.g. AB12345 or 123456789" maxLength={12} />
                  <FieldError msg={errors.panNumber} />
                </div>
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
                        <input className={inputCls("contactNumber")} type="tel" inputMode="numeric" name="contactNumber"
                          value={form.contactNumber} onChange={handleChange}
                          placeholder="98XXXXXXXX" maxLength={10} disabled={otpSent} />
                        <button className="btn-otp" onClick={sendOtp} disabled={sendingOtp}>
                          {sendingOtp ? "Sending…" : otpSent ? "Resend" : "Send OTP"}
                        </button>
                      </div>
                      {otpSent && (
                        <>
                          <div className="otp-entry">
                            <input className="otp-code" type="text" inputMode="numeric" maxLength={6} value={otp}
                              onChange={(e) => {
                                setOtp(e.target.value.replace(/\D/g, ""));
                                clearError("otp");
                              }}
                              placeholder="000000" autoComplete="one-time-code" />
                            <button className="btn-otp" onClick={verifyOtp} disabled={verifyingOtp}>
                              {verifyingOtp ? "Checking…" : "Verify"}
                            </button>
                          </div>
                          <FieldError msg={errors.otp} />
                          <div className="otp-hint">
                            Enter the 6-digit code sent to {form.contactNumber}
                          </div>
                          <button type="button" className="link-btn"
                            onClick={() => { setOtpSent(false); setOtp(""); clearError("otp"); }}>
                            Change number
                          </button>
                        </>
                      )}
                    </>
                  )}
                  <FieldError msg={errors.contactNumber} />
                </div>
              </div>

              <div className="field-row">
                <div className="field-label">Address <span className="req">*</span></div>
                <div>
                  <input className={inputCls("address")} type="text" name="address" value={form.address}
                    onChange={handleChange} placeholder="City, District" maxLength={150} />
                  <FieldError msg={errors.address} />
                </div>
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
                  <div className="phase-desc">Clear images — JPG or PNG, max 5 MB each</div>
                </div>
              </div>

              <div className="upload-grid">
                {/* PAN card */}
                <div className={`upload-box${(panCard || existingDocs.panCardUrl) ? " done" : ""}${errors.panCard ? " error" : ""}`}
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
                  {errors.panCard && <span className="upload-err">{errors.panCard}</span>}
                  <label className="upload-btn" onClick={(e) => e.stopPropagation()}>
                    <FiUpload size={10} /> {panCard ? "Change" : "Upload"}
                    <input type="file" id="filePan" className="upload-input"
                      accept=".jpg,.jpeg,.png" onChange={handleFileChange("panCard")} />
                  </label>
                </div>

                {/* Passport photo */}
                <div className={`upload-box${(photo || existingDocs.photoUrl) ? " done" : ""}${errors.photo ? " error" : ""}`}
                  onClick={() => document.getElementById("filePhoto")?.click()}>
                  <div className="upload-icon">
                    {photoPreview ? <img src={photoPreview} alt="Photo" /> : <FiUser />}
                  </div>
                  <div className={`upload-lbl${photo ? " done" : ""}`}>
                    {photo ? (photo.name.length > 14 ? photo.name.slice(0, 14) + "…" : photo.name) : "Passport photo"}
                  </div>
                  {errors.photo && <span className="upload-err">{errors.photo}</span>}
                  <label className="upload-btn" onClick={(e) => e.stopPropagation()}>
                    <FiUpload size={10} /> {photo ? "Change" : "Upload"}
                    <input type="file" id="filePhoto" className="upload-input"
                      accept=".jpg,.jpeg,.png" onChange={handleFileChange("photo")} />
                  </label>
                </div>

                {/* Selfie with PAN (camera only) */}
                <div className={`upload-box${(selfieWithPan || existingDocs.selfieWithPanUrl) ? " done" : ""}${errors.selfieWithPan ? " error" : ""}`}>
                  <div
                    className="upload-icon"
                    onClick={openCamera}
                    style={{ cursor: "pointer" }}
                  >
                    {selfiePreview ? <img src={selfiePreview} alt="Selfie" /> : <FiCamera />}
                  </div>
                  <div className={`upload-lbl${selfieWithPan ? " done" : ""}`}>
                    {selfieWithPan ? (selfieWithPan.name.length > 14 ? selfieWithPan.name.slice(0, 14) + "…" : selfieWithPan.name) : "Selfie with PAN"}
                  </div>
                  {faceStatus === "scanning" && <span style={{ fontSize: 10, color: "#888" }}>Detecting face…</span>}
                  {faceStatus === "ok" && <span style={{ fontSize: 10, color: "#1a7a4a" }}>✓ Face detected</span>}
                  {faceStatus === "error" && <span style={{ fontSize: 10, color: "#ef4444" }}>✗ No face found</span>}
                  {errors.selfieWithPan && <span className="upload-err">{errors.selfieWithPan}</span>}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button type="button" className="upload-btn" onClick={openCamera}>
                      <FiCamera size={10} /> Camera
                    </button>
                  </div>
                </div>
              </div>

              {showCamera && (
                <div style={{
                  position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
                  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
                }}>
                  <div style={{ background: "#fff", borderRadius: 12, padding: 16, maxWidth: 420, width: "90%" }}>
                    <video ref={videoRef} autoPlay playsInline muted
                      style={{ width: "100%", borderRadius: 8, transform: "scaleX(-1)" }} />
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button type="button" className="btn-next" style={{ flex: 1, justifyContent: "center" }} onClick={captureSelfie}>
                        Capture
                      </button>
                      <button type="button" className="btn-back" style={{ flex: 1, justifyContent: "center" }} onClick={closeCamera}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="upload-info">
                All 3 documents are required. Images must be clear, well-lit, and unobstructed.
              </div>

              <div className="action-row">
                <button className="btn-back" onClick={() => { setErrors({}); setPhase(1); }}>
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
                <div>
                  <input className={inputCls("bankName")} type="text" name="bankName" value={form.bankName}
                    onChange={handleChange} placeholder="e.g. Nepal Investment Bank" maxLength={80} />
                  <FieldError msg={errors.bankName} />
                </div>
              </div>

              <div className="field-row">
                <div className="field-label">Account number <span className="req">*</span></div>
                <div>
                  <input className={inputCls("account")} type="text" name="account" value={form.account}
                    onChange={handleChange} placeholder="Bank account number" maxLength={25} />
                  <FieldError msg={errors.account} />
                </div>
              </div>

              <div className="field-row">
                <div className="field-label">Account holder <span className="req">*</span></div>
                <div>
                  <input className={inputCls("accountHolderName")} type="text" name="accountHolderName"
                    value={form.accountHolderName} onChange={handleChange}
                    placeholder="As on bank account" maxLength={100} />
                  <FieldError msg={errors.accountHolderName} />
                </div>
              </div>

              <div className="action-row">
                <button className="btn-back" onClick={() => { setErrors({}); setPhase(2); }}>
                  <FiArrowLeft size={14} /> Back
                </button>
                <button className={`btn-next${submitted ? " success" : ""}`}
                  onClick={handleSubmit} disabled={submitting || submitted}>
                  {submitting ? (
                    <><div className="spinner" /> Submitting…</>
                  ) : submitted ? (
                    <><FiCheckCircle size={15} /> Submitted</>
                  ) : (
                    <><FiShield size={15} /> {existingStatus === "VERIFIED" ? "Save & submit for review" : "Submit for verification"}</>
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