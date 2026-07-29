"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronRight,
  FiChevronDown,
  FiCalendar,
  FiMapPin, 
  FiFileText,
  FiBriefcase,
  FiImage,
  FiEye,
  FiCheck,
  FiX,
  FiLayers , 
  FiPlus, 

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
  { label: "Details", icon: FiBriefcase, status: "active" as const },
  { label: "Photos", icon: FiImage, status: "upcoming" as const },
  { label: "Preview", icon: FiEye, status: "upcoming" as const },
]
const whoIsThisForOptions = [
  "Women",
  "Men",
  "Kids",
  "Unisex",
];
const requiredGenderOptions = [
  "Female (Preferred)",
  "Male (Preferred)",
  "No Preference",
];

const genderPreferenceOptions = [
  "Female",
  "Male",
  "No Preference",
];

const experienceOptions = [
  "1+ Years",
  "3+ Years",
  "5+ Years",
  "10+ Years",
];

const preparationTimeOptions = [
  "15 Minutes",
  "30 Minutes",
  "45 Minutes",
  "60 Minutes",
  "90 Minutes",
];
const tags = [
  "Bridal",
  "Makeup",
  "HD Makeup",
  "Hair Styling",
  "Party Makeup",
];

// const [tagInput, setTagInput] = useState("");


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
      tabIndex={0}
      onKeyDown={handleKeyDown}
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
                className={`custom-select-option ${option === value ? "selected" : ""} ${index === highlightedIndex ? "highlighted" : ""
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




export default function NewBeautyListingPage() {

  const router = useRouter();
  // const [tagInput, setTagInput] = useState("");
  // ── Additional Details ──

  const [whoisthisfor, setWhoisthisfor] = useState("Women")
  const [genderPreference, setGenderPreference] = useState("Female");
  const [preparationTime, setPreparationTime] = useState("60 Minutes");
  const [requiredGenderofProffessional, setRequiredGenderofProffessional] = useState("Female(Preferred")
  const [experienceLevel, setserExperienceLevel] = useState("5+ Years")
  const [tags, setTags] = useState<string[]>([
    "Bridal",
    "Makeup",
    "HD Makeup",
    "Hair Styling",
    "Party Makeup",
  ]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !whoisthisfor ||
      !genderPreference ||
      !preparationTime ||
      !requiredGenderofProffessional ||
      !experienceLevel
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (tags.length === 0) {
      toast.error("Please add at least one tag.");
      return;
    }

    toast.success("Beauty service saved successfully!");
    router.push("/seller/listing/hair-beauty-wellness/beauty/photos");
  };

  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim();

    if (!trimmed) return;

    if (tags.includes(trimmed)) {
      toast.info("Tag already added");
      return;
    }

    setTags([...tags, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (

    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <style>{
        `
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
        }/* ── Divider ── */
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
.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
          
          /* Tags Container */
.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  min-height: 44px;
  padding: 8px;
  border: 1.5px solid #dbe3ef;
  border-radius: 12px;
  background: #fff;
  transition: all 0.2s ease;
}

.skills-wrap:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Tag Chip */
.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
}

/* Remove Icon */
.remove-skill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.2s;
}

.remove-skill:hover {
  background: #dbeafe;
  color: #dc2626;
}

/* Input */
.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #dbe3ef;
  border-radius: 12px;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

/*================ Availability =================*/

.availability-wrapper{
    display:flex;
    justify-content:space-between;
    gap:32px;
    width:100%;
    padding:28px;
    background:#fff;
    border:1px solid #e5e7eb;
    border-radius:20px;
    box-sizing:border-box;
}

/* LEFT */

.availability-left{
    flex:1;
}

.availability-left h2{
    font-size:42px;
    font-weight:700;
    color:#2952e3;
    margin-bottom:12px;
}

.availability-left p{
    color:#555;
    font-size:18px;
    line-height:1.5;
    margin-bottom:28px;
    max-width:320px;
}

.set-btn{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    padding:14px 28px;
    background:#2952e3;
    color:#fff;
    border:none;
    border-radius:14px;
    cursor:pointer;
    font-size:16px;
    font-weight:600;
}

/* RIGHT */

.availability-right{
    width:360px;
    display:flex;
    flex-direction:column;
    gap:18px;
}

.availability-card{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:20px;
    border:1px solid #e5e7eb;
    border-radius:16px;
    padding:20px;
}

.availability-info{
    display:flex;
    gap:14px;
}

.icon-box{
    color:#2952e3;
    margin-top:3px;
}

.availability-text h3{
    color:#2952e3;
    font-size:28px;
    margin-bottom:6px;
}

.availability-text p{
    color:#555;
    margin-bottom:4px;
    font-size:18px;
}

.availability-text span{
    color:#333;
    font-size:18px;
}

.edit-btn{
    display:flex;
    align-items:center;
    gap:4px;
    background:none;
    border:none;
    color:#2952e3;
    cursor:pointer;
    font-size:15px;
    font-weight:600;
    white-space:nowrap;
}

.cancel-btn{
    align-self:flex-end;
    width:120px;
    height:42px;
    background:#fff;
    border:1px solid #d1d5db;
    border-radius:10px;
    cursor:pointer;
}

/*================ Tablet =================*/

@media (max-width:768px){

    .availability-wrapper{
        flex-direction:column;
        padding:20px;
        gap:24px;
    }

    .availability-left h2{
        font-size:32px;
    }

    .availability-left p{
        max-width:100%; 
        font-size:15px;
    }

    .set-btn{
        width:100%;
    }

    .availability-right{
        width:100%;
    }

    .availability-card{
        width:100%;
    }

    .cancel-btn{
        width:100%;
        align-self:stretch;
    }
}

/*================ Mobile =================*/

@media (max-width:480px){

    .availability-wrapper{
        padding:16px;
    }

    .availability-left h2{
        font-size:28px;
    }

    .availability-left p{
        font-size:14px;
    }

    .availability-card{
        flex-direction:column;
        gap:16px;
    }

    .availability-info{
        width:100%;
    }

    .availability-text h3{
        font-size:22px;
    }

    .availability-text p,
    .availability-text span{
        font-size:14px;
    }

    .edit-btn{
        width:100%;
        justify-content:center;
        border:1px solid #e5e7eb;
        padding:10px;
        border-radius:10px;
    }

    .cancel-btn{
        width:100%;
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
           
.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.left-col,
.right-col {
  width: 100%;
  min-width: 0;
}

/* Mobile */
@media (max-width: 768px) {
  .two-column {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .left-col,
  .right-col {
    width: 100%;
  }
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
            .left-col,
  .right-col {
    gap: 16px;
  }

  .form-group.full-width {
    margin-bottom: 0;
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
            <div className="availability-wrapper">
      <div className="availability-container">
        {/* Left */}
        <div className="availability-left">
          <h2>Availability</h2>
          <p>Select days and times when you are available.</p>

          <button className="set-btn">
            <FiCalendar size={16} />
            Set Availability
          </button>
        </div>

        {/* Right */}
        <div className="availability-right">
          <div className="availability-card">
            <div className="availability-info">
              <div className="icon-box">
                <FiCalendar size={22} />
              </div>

              <div>
                <h3>Availability</h3>
                <p>Mon – Sun</p>
                <span>10:00 AM - 8:00 PM</span>
              </div>
            </div>

            <button className="edit-btn">
              Edit <FiChevronRight size={16} />
            </button>
          </div>

          <button className="cancel-btn">Cancel</button>
        </div>
      </div>

      <div className="bottom-buttons">
        <button className="back-btn">Back</button>
        }

        @media (max-width: 480px) {
          .listing-container { padding: 12px; }
          .form-card { padding: 16px; border-radius: 14px; }
          .listing-header { gap: 12px; margin-bottom: 16px; }
          .back-btn { width: 36px; height: 36px; }
          .listing-title { font-size: 18px; }
          .availability-container {
    padding: 16px;
    border-radius: 14px;
    gap: 18px;
  }

  .availability-left h2 {
    font-size: 22px;
  }

  .availability-left p {
    font-size: 13px;
  }

  .set-btn {
    height: 44px;
    font-size: 14px;
    padding: 0 16px;
  }

  .availability-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
  }

  .availability-info {
    width: 100%;
    gap: 12px;
  }

  .availability-info h3 {
    font-size: 18px;
  }

  .availability-info p,
  .availability-info span {
    font-size: 13px;
  }

  .edit-btn {
    width: 100%;
    justify-content: center;
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f8fafc;
  }

  .cancel-btn,
  .back-btn,
  .continue-btn {
    width: 100%;
    height: 44px;
    font-size: 14px;
  }

  .icon-box svg {
    width: 20px;
    height: 20px;
  }
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
                    {step.status === "active" ? <FiCheck size={16} /> : <step.icon size={14} />}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`step-connector ${step.status === "active" ? "filled" : ""}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="form-card">
            {/* Left: Additional Information */}
            <div className="section-header">
              <div className="section-icon blue">
                <FiFileText size={18} color="#fff" />
              </div>
              <div className="section-title-wrap">
                <h2>Additional Information</h2>
              </div>
            </div>

            <div className="two-column">
              <div className="left-col">

                <div className="form-group full-width">
                  <label className="form-label">
                    Who is this for <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={whoIsThisForOptions}
                    value={whoisthisfor}
                    onChange={setWhoisthisfor}
                    placeholder="Who is this for"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    Required Gender of Professional <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={requiredGenderOptions}
                    value={requiredGenderofProffessional}
                    onChange={setRequiredGenderofProffessional}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    Gender Preference <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={genderPreferenceOptions}
                    value={genderPreference}
                    onChange={setGenderPreference}
                  />

                </div>
              </div>

              <div className="right-col">

                <div className="form-group full-width">
                  <label className="form-label">
                    Experience Level <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={experienceOptions}
                    value={experienceLevel}
                    onChange={setserExperienceLevel}
                  />

                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    Preparation Time <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={preparationTimeOptions}
                    value={preparationTime}
                    onChange={setPreparationTime}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    Tags <span style={{ color: "#94a3b8" }}>(Optional)</span>
                  </label>
                  <div className="skills-wrap">
                    {tags.map((tag) => (
                      <span key={tag} className="skill-tag">
                        {tag}
                        <span
                          className="remove-skill"
                          onClick={() => removeTag(tag)}
                        >
                          <FiX size={12} />
                        </span>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type and press Enter to add more"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>
              </div>

                {/* Left */}
                <div className="availability-left">
                  <h2>Availability</h2>
                  <p>Select days and times when you are available.</p>

                  <button className="set-btn">
                    <FiCalendar size={16} />
                    Set Availability
                  </button>
                </div>

                {/* Right */}
                <div className="availability-right">
                  <div className="availability-card">

                    <div className="availability-info">

                      <div className="icon-box">
                        <FiCalendar size={22} />
                      </div>

                      <div className="availability-text">
                        
                        <h3>Availability</h3>
                        <p>Mon – Sun</p>
                        <span>10:00 AM - 8:00 PM</span>
                      </div>

                    </div>

                    <button className="edit-btn">
                      Edit <FiChevronRight size={16} />
                    </button>

                  </div>

                  <button className="cancel-btn">
                    Cancel
                  </button>
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


          </form >

        </div >
      </div >

    </>


  );
}
