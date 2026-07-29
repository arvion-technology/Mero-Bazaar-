"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronRight,
  FiFileText,
  FiBriefcase,
  FiCheck,
  FiChevronDown,
  FiInfo,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const ACCENT_LIGHT = "#eff6ff";
const DANGER = "#dc2626";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";
const SITE_PRIMARY = "#2563eb";

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Details", icon: FiBriefcase, status: "active" as const },
  { label: "Availability", icon: FiInfo, status: "upcoming" as const },
  { label: "Preview", icon: FiInfo, status: "upcoming" as const },
];

const serviceTitles = [
  "General Medicine",
  "Dental Care",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "Neurology",
  "ENT",
  "Other",
];

const cities = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Other"];
const languagesList = ["English", "Nepali", "Hindi", "Newari", "Maithili", "Bhojpuri"];
const experienceOptions = ["1-2 Years", "3-5 Years", "5-7 Years", "7+ Years", "10+ Years", "15+ Years"];

/* ── Portal-based Custom Select ── */
function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Select...",
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !open) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = Math.min(options.length * 44 + 12, 220);
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;
    const openUpward = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    setMenuStyle({
      position: "fixed",
      left: rect.left,
      top: openUpward ? rect.top - menuHeight - 6 : rect.bottom + 6,
      width: rect.width,
      maxHeight: 220,
      zIndex: 9999,
    });
  }, [open, options.length]);

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [open, updatePosition]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "12px 38px 12px 16px",
          border: `1.5px solid ${open ? ACCENT : BORDER}`,
          borderRadius: "12px",
          fontSize: "14px",
          color: TEXT_PRIMARY,
          background: CARD_BG,
          fontFamily: "inherit",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          outline: "none",
          boxShadow: open ? `0 0 0 4px rgba(37, 99, 235, 0.08)` : "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.borderColor = "#cbd5e1";
        }}
        onMouseLeave={(e) => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER;
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <FiChevronDown
          size={16}
          color={TEXT_MUTED}
          style={{
            position: "absolute",
            right: "14px",
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div
          style={{
            ...menuStyle,
            background: CARD_BG,
            border: `1.5px solid ${BORDER}`,
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
            overflowY: "auto",
            padding: "6px",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "none",
                background: value === opt ? "#eff6ff" : "transparent",
                color: value === opt ? ACCENT : TEXT_PRIMARY,
                fontSize: "14px",
                fontWeight: value === opt ? 600 : 400,
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
              onMouseEnter={(e) => {
                if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/* ── Multi-select Language Tags ── */
function LanguageSelector({
  selected,
  options,
  onChange,
}: {
  selected: string[];
  options: string[];
  onChange: (langs: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggleLang = (lang: string) => {
    if (selected.includes(lang)) {
      onChange(selected.filter((l) => l !== lang));
    } else {
      onChange([...selected, lang]);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={triggerRef} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          border: `1.5px solid ${open ? ACCENT : BORDER}`,
          borderRadius: "12px",
          background: CARD_BG,
          cursor: "pointer",
          minHeight: "46px",
          transition: "all 0.25s ease",
          boxShadow: open ? `0 0 0 4px rgba(37, 99, 235, 0.08)` : "none",
        }}
      >
        {selected.length === 0 && (
          <span style={{ color: "#a1a8b5", fontSize: "14px" }}>Select languages...</span>
        )}
        {selected.map((lang) => (
          <span
            key={lang}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 10px",
              background: "#e2e8f0",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: TEXT_PRIMARY,
            }}
          >
            {lang}
            <FiX
              size={12}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                toggleLang(lang);
              }}
            />
          </span>
        ))}
        <FiChevronDown
          size={16}
          color={TEXT_MUTED}
          style={{ marginLeft: "auto", flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        />
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: CARD_BG,
            border: `1.5px solid ${BORDER}`,
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            zIndex: 9999,
            padding: "6px",
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggleLang(opt)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "none",
                background: selected.includes(opt) ? "#eff6ff" : "transparent",
                color: selected.includes(opt) ? ACCENT : TEXT_PRIMARY,
                fontSize: "14px",
                fontWeight: selected.includes(opt) ? 600 : 400,
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                if (!selected.includes(opt)) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                if (!selected.includes(opt)) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {opt}
              {selected.includes(opt) && <FiCheck size={14} color={ACCENT} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MedicalListingDetailsPage() {
  const router = useRouter();

  // ── Service Information ──
  const [serviceTitle, setServiceTitle] = useState("General Medicine");
  const [doctorName, setDoctorName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [appointmentFee, setAppointmentFee] = useState("");
  const [homeVisit, setHomeVisit] = useState(true);
  const [onlineAppointments, setOnlineAppointments] = useState(false);

  // ── Clinic Information ──
  const [clinicAddress, setClinicAddress] = useState("");
  const [city, setCity] = useState("Kathmandu");

  // ── Additional Information ──
  const [shortBio, setShortBio] = useState("");
  const [languages, setLanguages] = useState<string[]>(["English", "Nepali", "Hindi"]);
  const [experience, setExperience] = useState("7+ Years");

  const bioLength = shortBio.length;
  const bioMax = 300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle || !doctorName || !licenseNumber || !appointmentFee) {
      toast.error("Please fill all required fields in Service Information");
      return;
    }
    if (!clinicAddress || !city) {
      toast.error("Please fill all required fields in Clinic Information");
      return;
    }
    if (languages.length === 0) {
      toast.error("Please select at least one language");
      return;
    }

    const listingData = {
      serviceTitle,
      doctorName,
      licenseNumber,
      appointmentFee,
      homeVisit,
      onlineAppointments,
      clinicAddress,
      city,
      shortBio,
      languages,
      experience,
    };
    localStorage.setItem("medicalListingDetails", JSON.stringify(listingData));

    toast.success("Details saved! Now set your availability.");
    router.push("/seller/listing/medical-dental/availability");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .listing-page {
          min-height: 100vh;
          background: ${BG};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .listing-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        .listing-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1.5px solid ${BORDER};
          background: ${CARD_BG};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${TEXT_PRIMARY};
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          flex-shrink: 0;
        }

        .back-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
          transform: translateX(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .back-btn:active { transform: translateX(0) scale(0.96); }

        .listing-header-text { flex: 1; min-width: 0; }

        .listing-title {
          font-size: 26px;
          font-weight: 800;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .listing-subtitle {
          font-size: 13.5px;
          color: ${TEXT_SECONDARY};
          margin-top: 3px;
        }

        .draft-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
          flex-shrink: 0;
        }

        .stepper {
          display: flex;
          align-items: center;
          background: ${CARD_BG};
          border: 1px solid ${BORDER};
          border-radius: 16px;
          padding: 18px 22px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          overflow-x: auto;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .step-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .step.done .step-icon-wrap {
          background: ${SUCCESS};
          color: #fff;
        }

        .step.active .step-icon-wrap {
          background: linear-gradient(135deg, ${SITE_PRIMARY}, #1d4ed8);
          color: #fff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
        }

        .step.upcoming .step-icon-wrap {
          background: #f1f5f9;
          color: ${TEXT_MUTED};
        }

        .step-label {
          font-size: 13.5px;
          font-weight: 600;
          white-space: nowrap;
        }

        .step.done .step-label { color: ${SUCCESS}; }
        .step.active .step-label { color: ${SITE_PRIMARY}; }
        .step.upcoming .step-label { color: ${TEXT_MUTED}; }

        .step-connector {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          margin: 0 14px;
          min-width: 24px;
          position: relative;
        }

        .step-connector.filled {
          background: ${SUCCESS};
        }

        .form-card {
          background: ${CARD_BG};
          border-radius: 20px;
          padding: 40px;
          border: 1px solid ${BORDER};
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 8px 24px rgba(0,0,0,0.03),
            0 0 0 1px rgba(0,0,0,0.02);
          transition: box-shadow 0.3s ease;
        }

        .form-card:hover {
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 12px 32px rgba(0,0,0,0.05),
            0 0 0 1px rgba(0,0,0,0.02);
        }

        .category-wrap { margin-bottom: 32px; }

        .category-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 10px;
          display: block;
        }

        .category-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1.5px solid #bfdbfe;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: ${SITE_PRIMARY};
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        .category-pill:hover {
          border-color: #93c5fd;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
          transform: translateY(-1px);
        }

        .category-pill:active { transform: translateY(0); }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, ${BORDER}, transparent);
          margin: 32px 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .section-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .section-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .section-icon.green { background: linear-gradient(135deg, #10b981, #059669); }
        .section-icon.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

        .section-title-wrap h2 {
          font-size: 18px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.3px;
        }

        .section-title-wrap p {
          font-size: 13px;
          color: ${TEXT_MUTED};
          margin-top: 2px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .form-label .required { color: ${DANGER}; font-weight: 700; }

        .form-input,
        .form-textarea {
          padding: 12px 16px;
          border: 1.5px solid ${BORDER};
          borderRadius: 12px;
          font-size: 14px;
          color: ${TEXT_PRIMARY};
          background: ${CARD_BG};
          font-family: inherit;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          max-width: 100%;
          outline: none;
        }

        .form-input:hover, .form-textarea:hover {
          border-color: #cbd5e1;
          background: #fafafa;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: ${ACCENT};
          background: ${CARD_BG};
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: #a1a8b5;
          font-weight: 400;
        }

        .form-textarea {
          min-height: 90px;
          resize: vertical;
          line-height: 1.5;
        }

        .char-counter {
          font-size: 11.5px;
          color: ${TEXT_MUTED};
          text-align: right;
          margin-top: -2px;
        }

        .char-counter.near-limit { color: ${DANGER}; font-weight: 600; }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: #334155;
          cursor: pointer;
          font-weight: 500;
          padding: 4px 0;
          line-height: 1.4;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: ${SITE_PRIMARY};
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .submit-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 36px;
          padding-top: 8px;
          gap: 16px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: ${ACCENT};
          background: none;
          border: 1.5px solid ${BORDER};
          border-radius: 12px;
          padding: 12px 28px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
        }

        .back-link:hover {
          border-color: ${ACCENT};
          background: ${ACCENT_LIGHT};
          transform: translateX(-2px);
        }

        .submit-btn {
          padding: 14px 40px;
          background: linear-gradient(135deg, ${SITE_PRIMARY}, #1d4ed8);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
          letter-spacing: 0.2px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn:hover {
          box-shadow: 0 6px 28px rgba(37, 99, 235, 0.4);
          transform: translateY(-2px);
        }

        .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(37, 99, 235, 0.2);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
        }

        .two-col-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        @media (max-width: 768px) {
          .listing-container { padding: 20px 20px 48px; }
          .form-card { padding: 28px; border-radius: 16px; }
          .form-row { grid-template-columns: 1fr; gap: 18px; }
          .listing-title { font-size: 22px; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
          .submit-wrap { flex-direction: column-reverse; }
          .back-link, .submit-btn { width: 100%; justify-content: center; }
          .two-col-section { grid-template-columns: 1fr; gap: 24px; }
        }

        @media (max-width: 480px) {
          .listing-container { padding: 16px 16px 40px; }
          .form-card { padding: 20px; border-radius: 14px; }
        }
      `}</style>

      <div className="listing-page">
        <div className="listing-container">
          {/* Header */}
          <div className="listing-header">
            <button type="button" className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={18} />
            </button>
            <div className="listing-header-text">
              <h1 className="listing-title">New Listing</h1>
              <p className="listing-subtitle">Select › Create Listing</p>
            </div>
            <div className="draft-badge">
              Draft Saved <FiCheck size={16} />
            </div>
          </div>

          {/* Stepper */}
          <div className="stepper">
            {steps.map((step, idx) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center", flex: idx < steps.length - 1 ? 1 : "0 0 auto" }}>
                <div className={`step ${step.status}`}>
                  <div className="step-icon-wrap">
                    {step.status === "done" ? <FiCheck size={16} /> : <step.icon size={14} />}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`step-connector ${step.status === "done" ? "filled" : ""}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="form-card">
            {/* Category */}
            <div className="category-wrap">
              <label className="category-label">Category</label>
              <button type="button" className="category-pill" onClick={() => router.push("/seller/dashboard")}>
                <FiBriefcase size={16} />
                Medical & Dental
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#2563eb", background: "#dbeafe", padding: "2px 8px", borderRadius: "6px" }}>Change</span>
              </button>
            </div>

            <div className="divider" />

            <div className="two-col-section">
              {/* Left Column: Service Information */}
              <div>
                <div className="section-header">
                  <div className="section-icon blue">
                    <FiFileText size={18} color="#fff" />
                  </div>
                  <div className="section-title-wrap">
                    <h2>Service Information</h2>
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="form-group">
                    <label className="form-label">Service Title <span className="required">*</span></label>
                    <CustomSelect
                      value={serviceTitle}
                      options={serviceTitles}
                      onChange={setServiceTitle}
                    />
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="form-group">
                    <label className="form-label">Doctor Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Dr. Sandhya Yadav"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="form-group">
                    <label className="form-label">NMN License Number <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="NMC-123456"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="form-group">
                    <label className="form-label">Appointment Fee <span className="required">*</span></label>
                    <div style={{ position: "relative" }}>
                      <span style={{
                        position: "absolute",
                        left: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: SITE_PRIMARY,
                        pointerEvents: "none",
                      }}>Rs.</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-input"
                        style={{ paddingLeft: "46px" }}
                        placeholder="800"
                        value={appointmentFee}
                        onChange={(e) => setAppointmentFee(e.target.value.replace(/[^0-9]/g, ""))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: "1fr", marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        className="checkbox-input"
                        checked={homeVisit}
                        onChange={(e) => setHomeVisit(e.target.checked)}
                      />
                      Home Visit Available
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        className="checkbox-input"
                        checked={onlineAppointments}
                        onChange={(e) => setOnlineAppointments(e.target.checked)}
                      />
                      Accept Online Appointments
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Clinic Information */}
              <div>
                <div className="section-header">
                  <div className="section-icon green">
                    <FiMapPin size={18} color="#fff" />
                  </div>
                  <div className="section-title-wrap">
                    <h2>Clinic Information</h2>
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="form-group">
                    <label className="form-label">Clinic address <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Shankhamul Marg, Opp, Civil Hospital"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="form-group">
                    <label className="form-label">City <span className="required">*</span></label>
                    <CustomSelect
                      value={city}
                      options={cities}
                      onChange={setCity}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Additional Information */}
            <div className="two-col-section">
              <div>
                <div className="section-header">
                  <div className="section-icon purple">
                    <FiInfo size={18} color="#fff" />
                  </div>
                  <div className="section-title-wrap">
                    <h2>Additional Information</h2>
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="form-group">
                    <label className="form-label">Short Bio / About <span style={{ color: TEXT_MUTED, fontWeight: 400 }}>(optional)</span></label>
                    <textarea
                      className="form-textarea"
                      placeholder="I am a General Physician with 7+ Years of experience in treating acute and chronic medical conditions. Patient care and satisfaction is my priority."
                      value={shortBio}
                      maxLength={bioMax}
                      onChange={(e) => setShortBio(e.target.value)}
                    />
                    <div className={`char-counter ${bioLength > bioMax * 0.9 ? "near-limit" : ""}`}>
                      {bioLength}/{bioMax}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="form-row" style={{ gridTemplateColumns: "1fr", marginTop: "52px" }}>
                  <div className="form-group">
                    <label className="form-label">Language Known</label>
                    <LanguageSelector
                      selected={languages}
                      options={languagesList}
                      onChange={setLanguages}
                    />
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="form-group">
                    <label className="form-label">Experience <span className="required">*</span></label>
                    <CustomSelect
                      value={experience}
                      options={experienceOptions}
                      onChange={setExperience}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="submit-wrap">
              <button type="button" className="back-link" onClick={() => router.back()}>
                <FiArrowLeft size={16} />
                Back
              </button>
              <button type="submit" className="submit-btn">
                Save & Continue
                <FiChevronRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}