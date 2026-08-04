"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronRight,
  FiChevronDown,
  FiCalendar,
  FiFileText,
  FiBriefcase,
  FiImage,
  FiEye,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDraft } from "../layout";

const ACCENT = "#2563eb";
const ACCENT_LIGHT = "#eff6ff";
const DANGER = "#dc2626";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
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
];

const whoIsThisForOptions = ["Women", "Men", "Kids", "Unisex"];
const genderPreferenceOptions = ["Female", "Male", "No Preference"];

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
    <div ref={containerRef} className="custom-select-container" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className={`custom-select-trigger ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <span className={value ? "custom-select-value" : "custom-select-placeholder"}>
          {value || placeholder || "Select..."}
        </span>
        <FiChevronDown size={16} className={`custom-select-chevron ${isOpen ? "rotated" : ""}`} />
      </div>
      {isOpen && (
        <div className="custom-select-dropdown">
          <div className="custom-select-options">
            {options.map((option, index) => (
              <div
                key={option}
                className={`custom-select-option ${option === value ? "selected" : ""} ${index === highlightedIndex ? "highlighted" : ""}`}
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

export default function ServiceDetailsPage() {
  const router = useRouter();
  const { category, data, setField } = useDraft();
  const [showAvailability, setShowAvailability] = useState(false);
  const [workingDays, setWorkingDays] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.whoIsThisFor || !data.genderPreference || !data.preparationTime || !data.experienceLevel) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (data.tags.length === 0) {
      toast.error("Please add at least one tag.");
      return;
    }

    toast.success(`${category} service saved successfully!`);
    router.push(`/seller/listing/hair-beauty-wellness/photos?category=${category.toLowerCase()}`);
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (data.tags.includes(trimmed)) {
      toast.info("Tag already added");
      return;
    }
    setField("tags", [...data.tags, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setField("tags", data.tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .listing-page { min-height: 100vh; background: ${BG}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .listing-container { max-width: 900px; margin: 0 auto; padding: 32px 24px 64px; }
        .listing-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .back-btn { width: 40px; height: 40px; border-radius: 12px; border: 1.5px solid ${BORDER}; background: ${CARD_BG}; display: flex; align-items: center; justify-content: center; cursor: pointer; color: ${TEXT_PRIMARY}; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 1px 2px rgba(0,0,0,0.04); flex-shrink: 0; }
        .back-btn:hover { border-color: #cbd5e1; background: #f1f5f9; transform: translateX(-2px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .listing-header-text { flex: 1; min-width: 0; }
        .listing-title { font-size: 26px; font-weight: 800; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px; line-height: 1.2; }
        .listing-subtitle { font-size: 13.5px; color: ${TEXT_SECONDARY}; margin-top: 3px; }
        .draft-badge { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${SUCCESS}; flex-shrink: 0; }
        .stepper { display: flex; align-items: center; background: ${CARD_BG}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 18px 22px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); overflow-x: auto; }
        .step { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .step-icon-wrap { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; transition: all 0.25s ease; }
        .step.done .step-icon-wrap { background: ${SUCCESS}; color: #fff; }
        .step.active .step-icon-wrap { background: linear-gradient(135deg, ${SITE_PRIMARY}, #e0574a); color: #fff; box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.15); }
        .step.upcoming .step-icon-wrap { background: #f1f5f9; color: ${TEXT_MUTED}; }
        .step-label { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
        .step.done .step-label { color: ${SUCCESS}; }
        .step.active .step-label { color: ${SITE_PRIMARY}; }
        .step.upcoming .step-label { color: ${TEXT_MUTED}; }
        .step-connector { flex: 1; height: 2px; background: #e2e8f0; margin: 0 14px; min-width: 24px; }
        .step-connector.filled { background: ${SUCCESS}; }
        .form-card { background: ${CARD_BG}; border-radius: 20px; padding: 40px; border: 1px solid ${BORDER}; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.02); }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, ${BORDER}, transparent); margin: 28px 0; }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .section-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .section-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .section-title-wrap h2 { font-size: 18px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.3px; }
        .two-column { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; align-items: start; }
        .left-col, .right-col { display: flex; flex-direction: column; gap: 20px; width: 100%; min-width: 0; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group.full-width { margin-bottom: 20px; }
        .form-label { font-size: 13px; font-weight: 600; color: #334155; display: flex; align-items: center; gap: 3px; }
        .form-label .required { color: ${DANGER}; font-weight: 700; }
        .form-input { padding: 12px 16px; border: 1.5px solid ${BORDER}; border-radius: 12px; font-size: 14px; color: ${TEXT_PRIMARY}; background: ${CARD_BG}; font-family: inherit; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); width: 100%; outline: none; }
        .form-input:hover { border-color: #cbd5e1; background: #fafafa; }
        .form-input:focus { border-color: ${ACCENT}; background: ${CARD_BG}; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08); }
        .form-input::placeholder { color: #a1a8b5; font-weight: 400; }
        .custom-select-container { position: relative; width: 100%; outline: none; }
        .custom-select-trigger { padding: 12px 16px; border: 1.5px solid ${BORDER}; border-radius: 12px; font-size: 14px; color: ${TEXT_PRIMARY}; background: ${CARD_BG}; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); user-select: none; }
        .custom-select-trigger:hover { border-color: #cbd5e1; background: #fafafa; }
        .custom-select-trigger.open, .custom-select-trigger:focus { border-color: ${ACCENT}; background: ${CARD_BG}; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08); }
        .custom-select-value { color: ${TEXT_PRIMARY}; }
        .custom-select-placeholder { color: #a1a8b5; }
        .custom-select-chevron { color: ${TEXT_MUTED}; transition: transform 0.2s ease; flex-shrink: 0; }
        .custom-select-chevron.rotated { transform: rotate(180deg); }
        .custom-select-dropdown { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: ${CARD_BG}; border: 1.5px solid ${BORDER}; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06); z-index: 9999; max-height: 240px; overflow-y: auto; padding: 6px; }
        .custom-select-options { display: flex; flex-direction: column; gap: 2px; }
        .custom-select-option { padding: 10px 14px; border-radius: 8px; font-size: 14px; color: ${TEXT_PRIMARY}; cursor: pointer; transition: all 0.15s ease; }
        .custom-select-option:hover, .custom-select-option.highlighted { background: ${ACCENT_LIGHT}; color: ${ACCENT}; }
        .custom-select-option.selected { background: linear-gradient(135deg, #eff6ff, #dbeafe); color: ${ACCENT}; font-weight: 600; }
        .skills-wrap { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; min-height: 44px; padding: 8px; border: 1.5px solid #dbe3ef; border-radius: 12px; background: #fff; transition: all 0.2s ease; }
        .skills-wrap:focus-within { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .skill-tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 999px; font-size: 13px; font-weight: 500; line-height: 1; }
        .remove-skill { display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; cursor: pointer; transition: 0.2s; }
        .remove-skill:hover { background: #dbeafe; color: #dc2626; }
        .availability-left h2 { font-size: 18px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.3px; }
        .availability-left p { color: #555; font-size: 15px; line-height: 1.4; margin-bottom: 16px; max-width: 320px; }
        .set-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 16px; background: #2952e3; color: #fff; border: none; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; }
        .availability-right { width: 300px; animation: slideInRight 0.35s ease; }
        .availability-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; }
        .availability-info { display: flex; gap: 14px; }
        .icon-box { color: #2952e3; }
        .availability-text { width: 100%; }
        .availability-text h3 { margin-bottom: 16px; color: #2952e3; }
        .availability-text input { width: 100%; height: 36px; border: 1px solid #d1d5db; border-radius: 10px; padding: 0 14px; margin-bottom: 12px; font-size: 14px; outline: none; transition: .25s; box-sizing: border-box; }
        .availability-text input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }
        .cancel-btn { width: 100%; margin-top: 8px; height: 36px; border: 1px solid #d1d5db; border-radius: 10px; background: #fff; cursor: pointer; }
        .cancel-btn:hover { background: #f8fafc; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .submit-wrap { display: flex; justify-content: space-between; align-items: center; margin-top: 36px; padding-top: 8px; gap: 16px; }
        .back-link { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${ACCENT}; background: none; border: 1.5px solid ${BORDER}; border-radius: 12px; padding: 12px 28px; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; }
        .back-link:hover { border-color: ${ACCENT}; background: ${ACCENT_LIGHT}; transform: translateX(-2px); }
        .submit-btn { padding: 14px 40px; background: linear-gradient(135deg, ${ACCENT}, #1d4ed8); color: #fff; font-size: 15px; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3); display: flex; align-items: center; gap: 8px; }
        .submit-btn:hover { box-shadow: 0 6px 28px rgba(37, 99, 235, 0.4); transform: translateY(-2px); }
        @media (max-width: 768px) {
          .listing-container { padding: 16px; }
          .form-card { padding: 20px; border-radius: 16px; }
          .two-column { grid-template-columns: 1fr; gap: 20px; }
          .listing-title { font-size: 20px; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .submit-wrap { flex-direction: column-reverse; gap: 12px; margin-top: 24px; }
          .back-link, .submit-btn { width: 100%; justify-content: center; padding: 14px 28px; }
          .availability-right { width: 100%; }
        }
        @media (max-width: 480px) {
          .listing-container { padding: 12px; }
          .form-card { padding: 16px; border-radius: 14px; }
          .listing-title { font-size: 18px; }
        }
      `}</style>

      <div className="listing-page">
        <div className="listing-container">
          <div className="listing-header">
            <button type="button" className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={18} />
            </button>
            <div className="listing-header-text">
              <h1 className="listing-title">New Listing</h1>
              <p className="listing-subtitle">Select › Create Listing</p>
            </div>
            <div className="draft-badge">Draft Saved <FiCheck size={16} /></div>
          </div>

          <div className="stepper">
            {steps.map((step, idx) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center", flex: idx < steps.length - 1 ? 1 : "0 0 auto" }}>
                <div className={`step ${step.status}`}>
                  <div className="step-icon-wrap">
                    {step.status === "done" ? <FiCheck size={16} /> : <step.icon size={14} />}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
                {idx < steps.length - 1 && <div className={`step-connector ${step.status === "active" ? "filled" : ""}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="form-card">
            <div className="section-header">
              <div className="section-icon blue"><FiFileText size={18} color="#fff" /></div>
              <div className="section-title-wrap"><h2>Additional Information</h2></div>
            </div>

            <div className="two-column">
              <div className="left-col">
                <div className="form-group full-width">
                  <label className="form-label">Who is this for <span className="required">*</span></label>
                  <CustomSelect
                    options={whoIsThisForOptions}
                    value={data.whoIsThisFor}
                    onChange={(v) => setField("whoIsThisFor", v)}
                    placeholder="Who is this for"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Gender Preference <span className="required">*</span></label>
                  <CustomSelect
                    options={genderPreferenceOptions}
                    value={data.genderPreference}
                    onChange={(v) => setField("genderPreference", v)}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Experience Level <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 5+ Years"
                    value={data.experienceLevel}
                    onChange={(e) => setField("experienceLevel", e.target.value)}
                  />
                </div>
              </div>

              <div className="right-col">
                <div className="form-group full-width">
                  <label className="form-label">Preparation Time <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 30 minutes"
                    value={data.preparationTime}
                    onChange={(e) => setField("preparationTime", e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Tags <span style={{ color: "#94a3b8" }}>(Optional)</span></label>
                  <div className="skills-wrap">
                    {data.tags.map((tag) => (
                      <span key={tag} className="skill-tag">
                        {tag}
                        <span className="remove-skill" onClick={() => removeTag(tag)}>
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

              <div className="availability-left">
                <h2>Availability</h2>
                <p>Select days and times when you are available.</p>
                <button type="button" className="set-btn" onClick={() => setShowAvailability(true)}>
                  <FiCalendar size={16} />
                  Set Availability
                </button>
              </div>

              {showAvailability && (
                <div className="availability-right">
                  <div className="availability-card">
                    <div className="availability-info">
                      <div className="icon-box"><FiCalendar size={22} /></div>
                      <div className="availability-text">
                        <h3>Availability</h3>
                        <input
                          type="text"
                          value={workingDays}
                          placeholder="Mon - Sat"
                          onChange={(e) => setWorkingDays(e.target.value)}
                        />
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <button type="button" className="cancel-btn" onClick={() => setShowAvailability(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="divider" />

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
