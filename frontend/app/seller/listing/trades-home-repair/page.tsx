"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronRight,
  FiChevronDown,
  FiMapPin,
  FiFileText,
  FiBriefcase,
  FiImage,
  FiEye,
  FiCheck,
  FiX,
  FiPlus,
  FiBox,
  FiTool,
  FiDollarSign,
  FiHash,
  FiList,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const ACCENT_LIGHT = "#eff6ff";
const DANGER = "#dc2626";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
const BORDER_FOCUS = "#bfdbfe";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";
const SITE_PRIMARY = "#C0392B";

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Detail", icon: FiList, status: "active" as const },
  { label: "Preview", icon: FiEye, status: "upcoming" as const },
];

const services = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Masonry",
  "HVAC",
  "Roofing",
  "Tiling",
];

const cities = ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Bharatpur"];
const wards = [
  "Ward 1",
  "Ward 2",
  "Ward 3",
  "Ward 4",
  "Ward 5",
  "Ward 6",
  "Ward 7",
  "Ward 8",
  "Ward 9",
  "Ward 10",
  "Ward 11",
  "Ward 12",
  "Ward 13",
  "Ward 14",
  "Ward 15",
];

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function CustomSelect({ options, value, onChange, placeholder }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((o) => o === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, options, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex]);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className="custom-select-container"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "custom-select-value" : "custom-select-placeholder"}>
          {value || placeholder || "Select..."}
        </span>
        <FiChevronDown
          size={16}
          className={`custom-select-chevron ${isOpen ? "rotated" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="custom-select-dropdown">
          <div className="custom-select-options">
            {options.map((option, index) => (
              <div
                key={option}
                className={`custom-select-option ${option === value ? "selected" : ""} ${
                  index === highlightedIndex ? "highlighted" : ""
                }`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewTradesHomeRepairListingPage() {
  const router = useRouter();

  // ── Basic Information ──
  const [serviceTitle, setServiceTitle] = useState("Professional Plumbing Service");
  const [startingPrice, setStartingPrice] = useState("800");
  const [description, setDescription] = useState("");

  // ── Service Details ──
  const [selectedService, setSelectedService] = useState("Plumbing");
  const [city, setCity] = useState("Kathmandu");
  const [ward, setWard] = useState("Ward 14");
  const [skills, setSkills] = useState<string[]>([
    "Plumbing",
    "Leak Repair",
    "Bathroom Fitting",
  ]);
  const [skillInput, setSkillInput] = useState("");

  const formattedPrice = useMemo(() => {
    if (!startingPrice) return "";
    const num = Number(startingPrice.replace(/,/g, ""));
    if (isNaN(num)) return startingPrice;
    return num.toLocaleString("en-IN");
  }, [startingPrice]);

  const handlePriceChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setStartingPrice(cleaned);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      toast.info("Skill already added");
      return;
    }
    setSkills([...skills, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle || !startingPrice || !description || !selectedService || !city || !ward) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Details saved! Now preview your listing.");
    router.push("/seller/listing/trades-home-repair/detail");
  };

  const descLength = description.length;
  const descMax = 500;

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
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        /* ── Header ── */
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

        /* ── Draft Saved ── */
        .draft-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
          flex-shrink: 0;
        }

        /* ── Stepper ── */
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
          background: linear-gradient(135deg, ${SITE_PRIMARY}, #e0574a);
          color: #fff;
          box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.15);
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

        /* ── Form Card ── */
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

        /* ── Category ── */
        .category-wrap { margin-bottom: 24px; }

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
          background: linear-gradient(135deg, #fff5f5, #fde2df);
          border: 1.5px solid #f5c6c1;
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
          border-color: #eb9c94;
          box-shadow: 0 2px 8px rgba(192, 57, 43, 0.12);
          transform: translateY(-1px);
        }

        .category-pill:active { transform: translateY(0); }
        .category-pill svg { transition: transform 0.2s; }
        .category-pill:hover svg { transform: rotate(180deg); }

        .change-badge {
          font-size: 12px;
          font-weight: 500;
          color: #7c3aed;
          background: #ede9fe;
          padding: 2px 8px;
          border-radius: 6px;
        }

        /* ── Divider ── */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, ${BORDER}, transparent);
          margin: 28px 0;
        }

        /* ── Two Column Layout ── */
        .two-col-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        /* ── Section Header ── */
        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
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
        .section-icon.red { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .section-icon.green { background: linear-gradient(135deg, #10b981, #059669); }

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

        /* ── Form Grid ── */
        .form-row {
          display: grid;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          margin-bottom: 20px;
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
          border-radius: 12px;
          font-size: 14px;
          color: ${TEXT_PRIMARY};
          background: ${CARD_BG};
          font-family: inherit;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
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
          min-height: 120px;
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

        /* ── Price Hint ── */
        .price-hint {
          font-size: 11.5px;
          color: ${TEXT_MUTED};
          margin-top: 4px;
        }

        /* ── Skills Tags ── */
        .skills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }

        .skill-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #ede9fe, #f3e8ff);
          border: 1.5px solid #c4b5fd;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #6d28d9;
          transition: all 0.2s ease;
        }

        .skill-tag:hover {
          border-color: #a78bfa;
          box-shadow: 0 2px 6px rgba(109, 40, 217, 0.1);
        }

        .skill-tag .remove-skill {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .skill-tag .remove-skill:hover {
          background: rgba(109, 40, 217, 0.1);
        }

        .skill-input-wrap {
          position: relative;
        }

        .skill-input-hint {
          font-size: 11.5px;
          color: ${TEXT_MUTED};
          margin-top: 4px;
        }

        /* ── Custom Select ── */
        .custom-select-container {
          position: relative;
          width: 100%;
          outline: none;
        }

        .custom-select-trigger {
          padding: 12px 16px;
          border: 1.5px solid ${BORDER};
          border-radius: 12px;
          font-size: 14px;
          color: ${TEXT_PRIMARY};
          background: ${CARD_BG};
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .custom-select-trigger:hover {
          border-color: #cbd5e1;
          background: #fafafa;
        }

        .custom-select-trigger.open,
        .custom-select-trigger:focus {
          border-color: ${ACCENT};
          background: ${CARD_BG};
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
        }

        .custom-select-value { color: ${TEXT_PRIMARY}; }
        .custom-select-placeholder { color: #a1a8b5; }

        .custom-select-chevron {
          color: ${TEXT_MUTED};
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .custom-select-chevron.rotated {
          transform: rotate(180deg);
        }

        .custom-select-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: ${CARD_BG};
          border: 1.5px solid ${BORDER};
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          z-index: 9999;
          max-height: 240px;
          overflow-y: auto;
          padding: 6px;
        }

        .custom-select-options {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .custom-select-option {
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 14px;
          color: ${TEXT_PRIMARY};
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .custom-select-option:hover,
        .custom-select-option.highlighted {
          background: ${ACCENT_LIGHT};
          color: ${ACCENT};
        }

        .custom-select-option.selected {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: ${ACCENT};
          font-weight: 600;
        }

        /* ── Submit Button ── */
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
          background: linear-gradient(135deg, ${ACCENT}, #1d4ed8);
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

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .listing-container { padding: 16px; }
          .form-card { 
            padding: 20px; 
            border-radius: 16px; 
          }
          .two-col-layout { 
            grid-template-columns: 1fr; 
            gap: 24px; 
          }
          .listing-title { font-size: 20px; }
          .listing-subtitle { font-size: 12px; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
          .submit-wrap { 
            flex-direction: column-reverse; 
            gap: 12px;
            margin-top: 24px;
          }
          .back-link, .submit-btn { 
            width: 100%; 
            justify-content: center; 
            padding: 14px 28px;
          }
          .section-header { margin-bottom: 16px; }
          .form-group.full-width { margin-bottom: 16px; }
          .divider { margin: 20px 0; }
          .category-wrap { margin-bottom: 16px; }
          .custom-select-dropdown {
            max-height: 200px;
          }
        }

        @media (max-width: 480px) {
          .listing-container { padding: 12px; }
          .form-card { padding: 16px; border-radius: 14px; }
          .listing-header { gap: 12px; margin-bottom: 16px; }
          .back-btn { width: 36px; height: 36px; }
          .listing-title { font-size: 18px; }
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
            {/* Category Pill */}
            <div className="category-wrap">
              <label className="category-label">Category</label>
              <button type="button" className="category-pill" onClick={() => router.push("/seller/dashboard")}>
                <FiTool size={16} />
                Trades & Home Repair
                <span className="change-badge">Change</span>
              </button>
            </div>

            <div className="divider" />

            {/* Two Column Layout */}
            <div className="two-col-layout">
              {/* Left: Basic Information */}
              <div className="left-col">
                <div className="section-header">
                  <div className="section-icon blue">
                    <FiFileText size={18} color="#fff" />
                  </div>
                  <div className="section-title-wrap">
                    <h2>Basic Information</h2>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Service Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter service title"
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Starting Price(NPR)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input"
                    placeholder="Enter starting price"
                    value={formattedPrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                  />
                  <p className="price-hint">Charge applied per unit</p>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="Enter Description"
                    value={description}
                    maxLength={descMax}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <div className={`char-counter ${descLength > descMax * 0.9 ? "near-limit" : ""}`}>
                    {descLength}/{descMax}
                  </div>
                </div>
              </div>

              {/* Right: Service Details */}
              <div className="right-col">
                <div className="section-header">
                  <div className="section-icon red">
                    <FiBriefcase size={18} color="#fff" />
                  </div>
                  <div className="section-title-wrap">
                    <h2>Service Details</h2>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Select Service <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={services}
                    value={selectedService}
                    onChange={setSelectedService}
                    placeholder="Select service"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    City <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={cities}
                    value={city}
                    onChange={setCity}
                    placeholder="Select city"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Ward <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={wards}
                    value={ward}
                    onChange={setWard}
                    placeholder="Select ward"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Skills</label>
                  <div className="skills-wrap">
                    {skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                        <span className="remove-skill" onClick={() => removeSkill(skill)}>
                          <FiX size={12} />
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className="skill-input-wrap">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Type and press Enter to add more"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                    />
                  </div>
                  <p className="skill-input-hint">Type and press Enter to add more</p>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Submit Row */}
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