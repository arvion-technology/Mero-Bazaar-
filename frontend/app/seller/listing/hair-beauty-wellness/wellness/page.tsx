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
  FiClock,
} from "react-icons/fi";
import {
  FaStethoscope,
  FaSpa,
  FaBriefcase,
  FaCar,
  FaBoxOpen,
  FaLeaf,
  FaStore,
  FaHammer,
  FaUtensils,
} from "react-icons/fa";
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
  { label: "Category", icon: FiFileText, status: "active" as const },
  { label: "Details", icon: FiBriefcase, status: "upcoming" as const },
  { label: "Photos", icon: FiImage, status: "upcoming" as const },
  { label: "Preview", icon: FiEye, status: "upcoming" as const },
];
const services = ["At studio", "At Salon", "At Home", "Online Consultation"];
const studio = ["Balkumari", "Sanepa", "Balkhu"];


const minutes = [
  "30 Minutes",
  "45 Minutes",
  "60 Minutes",
  "90 Minutes",
  "120 Minutes", 
];


const wellnessServices = ["Beauty", "Hair", "Wellness"];

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
        setHighlightedIndex(
          (prev) => (prev - 1 + options.length) % options.length,
        );
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
        <span
          className={
            value ? "custom-select-value" : "custom-select-placeholder"
          }
        >
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

export default function NewWellnessListingPage() {
  const router = useRouter();
    const [selectedService, setSelectedService] = useState("Wellness");

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const handleCategoryChange = (path: string) => {
    setShowCategoryMenu(false); // close menu first
    router.push(path);
  };


  // ── Basic Information ──

  const [serviceTitle, setServiceTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");

  // ── Service Details ──

  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState("");
    const [studioLocation, setStudioLocation] = useState("");

  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !serviceTitle ||
      !shortDescription ||
      !detailedDescription ||
      !price ||
      !serviceType ||
      !duration
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    toast.success("Wellness service saved successfully!");
    router.push("/seller/listing/hair-beauty-wellness/wellness/details");
  };
  const descLength = detailedDescription.length;
  const descMax = 1000;
  const descMim = 500;

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
        .category-pill{
        display:flex;
        justify-content:space-between;
        align-items:center;
        width:100%;
        // padding:12px ;
        border:1px solid #e2e8f0;
        border-radius: 10px;
        background:#fff;
       }

       .category-info{
        display:flex;
        align-items:center;
        gap:10px;
        }

       .change-btn{
       border:none;
      background:#2563eb;
      color:#fff;
      padding:4px ;
      border-radius:8px;
      cursor:pointer;
     font-weight:600;
     }

    .change-btn:hover{
    background:#1d4ed8;
   }

.category-menu{
  margin-top:10px;
  border:1px solid #e2e8f0;
  border-radius:12px;
  background:#fff;
  overflow:hidden;
  box-shadow:0 8px 24px rgba(0,0,0,.08);
}

.category-item{
  width:100%;
  display:flex;
  align-items:center;
  gap:12px;
  padding:14px 16px;
  background:#fff;
  border:none;
  cursor:pointer;
  text-align:left;
}

.category-item:hover{
  background:#eff6ff;
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
        // .form-row {
        //   display: grid;
        //   gap: 20px;
        //   margin-bottom: 20px;
        // }

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
          /* Mobile Service */

.mobile-service{
    margin-top:24px;
}

.mobile-title{
    display:block;
    font-size:20px;
    font-weight:600;
    color:#111827;
    margin-bottom:14px;
}

.mobile-option{
    display:flex;
    align-items:center;
    gap:10px;
}

.mobile-text{
    font-size:17px;
    color:#666;
    line-height:1.4;
}

/* Switch */

.switch{
    position:relative;
    display:inline-block;
   width:36px;
    height:20px;
    flex-shrink:0;
}

.switch input{
    opacity:0;
    width:0;
    height:0;
}

.slider{
    position:absolute;
    inset:0;
    background:#d1d5db;
    border-radius:999px;
    cursor:pointer;
    transition:.3s;
}

.slider::before{
    content:"";
    position:absolute;
    width:14px;
    height:14px;
    left:3px;
    top:3px;
    background:#fff;
    border-radius:50%;
    transition:.3s;
    box-shadow:0 2px 5px rgba(0,0,0,.2);
}

.switch input:checked + .slider{
    background:#2563eb;
}

.switch input:checked + .slider::before{
    transform:translateX(16px);
}

/* Tablet */

@media (max-width:768px){

    .mobile-title{
        font-size:18px;
    }

    .mobile-text{
        font-size:15px;
    }
}

/* Mobile */

@media (max-width:480px){

    .mobile-option{
        align-items:flex-start;
    }

    .mobile-text{
        font-size:14px;
    }

    .switch{
        width:40px;
        height:22px;
    }

    .slider::before{
        width:16px;
        height:16px;
    }

    .switch input:checked + .slider::before{
        transform:translateX(18px);
    }
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
          transform: translateX(-2px);}

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
            <button
              type="button"
              className="back-btn"
              onClick={() => router.back()}
            >
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
              <div
                key={step.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: idx < steps.length - 1 ? 1 : "0 0 auto",
                }}
              >
                <div className={`step ${step.status}`}>
                  <div className="step-icon-wrap">
                    {step.status === "active" ? (
                      <FiCheck size={16} />
                    ) : (
                      <step.icon size={14} />
                    )}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`step-connector ${step.status === "active" ? "filled" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="form-card">
            {/* Category Pill */}
            <div className="two-col-layout">
              <div className="left-col">
                <div className="category-wrap">
                  <label className="category-label">Category</label>

                  <div className="category-pill">
                    <div className="category-info">
                      <FaSpa size={18} />
                      <span>Hair, Beauty & Wellness Service</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="right-col">
                <label className="category-label">Select Service</label>

                <CustomSelect
                  options={wellnessServices}
                  value={selectedService}
                  placeholder="Select Service"
                  onChange={(value) => {
                    setSelectedService(value);

                    switch (value) {
                      case "Beauty":
                        router.push("/seller/listing/hair-beauty-wellness/beauty");
                        break;

                      case "Hair":
                        router.push("/seller/listing/hair-beauty-wellness/hair");
                        break;

                      case "Wellness":
                        router.push("/seller/listing/hair-beauty-wellness/wellness");
                        break;
                    }
                  }}
                />
              </div>
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
                  <label className="form-label">
                    Short Description <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter short description"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                  <div
                    className={`char-counter ${descLength > descMim * 0.5 ? "near-limit" : ""}`}
                  >
                    {descLength}/{descMim}
                  </div>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    Detailed Description <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe your Wellness service"
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                  />
                  <div
                    className={`char-counter ${descLength > descMax * 0.9 ? "near-limit" : ""}`}
                  >
                    {descLength}/{descMax}
                  </div>
                </div>
              </div>

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
                    Price (NPR) <span className="required">*</span>
                  </label>

                  <input
                    type="number"
                    className="form-input"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Service Location Type <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={services}
                    value={serviceType}
                    onChange={setServiceType}
                    placeholder="Select Service Type"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Studio Location <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={studio}
                    value={studioLocation}
                    onChange={setStudioLocation}
                    placeholder="Select Studio Location"
                  />
                </div>


                <div className="form-group full-width">
                  <label className="form-label">
                    Duration <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter duration (e.g. 60 Minutes)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                <div className="mobile-service">
                  <label className="mobile-title">Mobile Service</label>

                  <div className="mobile-option">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>

                    <span className="mobile-text">
                      I provide this service at customer's location
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="divider" />

          {/* Submit Row */}
          <div className="submit-wrap">
            <button
              type="button"
              className="back-link"
              onClick={() => router.back()}
            >
              <FiArrowLeft size={16} />
              Back
            </button>
            <button type="submit" className="submit-btn">
              Save & Continue
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
