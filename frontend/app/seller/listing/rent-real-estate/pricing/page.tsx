"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft, FiChevronRight, FiDollarSign, FiUser, FiCheck, FiX, FiPlus,
  FiCalendar,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ACCENT = "#2563eb"; const ACCENT_HOVER = "#1d4ed8"; const SUCCESS = "#10b981";
const BORDER = "#e2e8f0"; const TEXT_PRIMARY = "#0f172a"; const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8"; const BG = "#f8fafc"; const CARD_BG = "#ffffff";

const steps = [
  { label: "Category", icon: FiCheck, status: "done" as const },
  { label: "Details", icon: FiCheck, status: "done" as const },
  { label: "Pricing", icon: FiDollarSign, status: "active" as const },
  { label: "Photos", icon: FiCheck, status: "upcoming" as const },
  { label: "Preview", icon: FiCheck, status: "upcoming" as const },
];

const bedroomsOptions = ["1", "2", "3", "4", "5", "6+"];
const bathroomsOptions = ["1", "2", "3", "4", "5+"];

const amenitiesList = [
  { id: "furnished", label: "Furnished" },
  { id: "parking", label: "Parking Available" },
  { id: "wifi", label: "Wifi Available" },
  { id: "water", label: "Water Included" },
  { id: "electricity", label: "Electricity Included" },
  { id: "pet", label: "Pet friendly" },
];

function CustomDropdown({
  label,
  value,
  options,
  onChange,
  required,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="form-group" ref={ref} style={{ position: "relative" }}>
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div
        className="custom-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
      >
        <span>{value}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={TEXT_MUTED}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt}
              className={`custom-dropdown-item ${opt === value ? "selected" : ""}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DatePicker({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const d = new Date(value);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date();
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const selectedDate = value ? new Date(value) : null;

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSelect = (day: number) => {
    const d = new Date(year, month, day);
    const iso = d.toISOString().split("T")[0];
    onChange(iso);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const handleToday = () => {
    const d = new Date();
    const iso = d.toISOString().split("T")[0];
    onChange(iso);
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
    setIsOpen(false);
  };

  const formatDisplay = (val: string) => {
    if (!val) return "Select date";
    const d = new Date(val);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="dp-day empty" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    const iso = thisDate.toISOString().split("T")[0];
    const isSelected = selectedDate && iso === value;
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    days.push(
      <div
        key={d}
        className={`dp-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
        onClick={() => handleSelect(d)}
      >
        {d}
      </div>
    );
  }

  return (
    <div className="form-group" ref={ref} style={{ position: "relative" }}>
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div
        className="custom-dropdown-trigger date-trigger"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
      >
        <span style={{ color: value ? TEXT_PRIMARY : TEXT_MUTED }}>{formatDisplay(value)}</span>
        <FiCalendar size={16} color={TEXT_MUTED} />
      </div>
      {isOpen && (
        <div className="date-picker-popup">
          <div className="dp-header">
            <span className="dp-month-year">{monthNames[month]} {year}</span>
            <div className="dp-nav">
              <button type="button" onClick={prevMonth}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT_PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
              <button type="button" onClick={nextMonth}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT_PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
            </div>
          </div>
          <div className="dp-weekdays">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="dp-weekday">{d}</div>
            ))}
          </div>
          <div className="dp-days">{days}</div>
          <div className="dp-footer">
            <button type="button" className="dp-btn-clear" onClick={handleClear}>Clear</button>
            <button type="button" className="dp-btn-today" onClick={handleToday}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RealEstatePricingPage() {
  const router = useRouter();
  const [monthlyRentMin, setMonthlyRentMin] = useState("");
  const [monthlyRentMax, setMonthlyRentMax] = useState("");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [sqft, setSqft] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    furnished: true, parking: true, wifi: true, water: true, electricity: true, pet: true,
  });
  const [ownerType, setOwnerType] = useState<"owner" | "agent">("owner");
  const [noBroker, setNoBroker] = useState(true);
  const [landmarkInput, setLandmarkInput] = useState("");
  const [landmarks, setLandmarks] = useState<string[]>(["Bus Park", "Hospital", "School", "Kalanki Chowk", "Ring Road"]);
  const [ruleInput, setRuleInput] = useState("");
  const [houseRules, setHouseRules] = useState<string[]>(["No Smoking", "No Pets", "Family Only", "Students Allowed", "Keep Clean"]);

  const toggleAmenity = (id: string) => { setAmenities((prev) => ({ ...prev, [id]: !prev[id] })); };
  const addLandmark = () => { const t = landmarkInput.trim(); if (!t) return; if (landmarks.includes(t)) { toast.error("Landmark already added"); return; } setLandmarks([...landmarks, t]); setLandmarkInput(""); };
  const removeLandmark = (item: string) => { setLandmarks(landmarks.filter((l) => l !== item)); };
  const addRule = () => { const t = ruleInput.trim(); if (!t) return; if (houseRules.includes(t)) { toast.error("Rule already added"); return; } setHouseRules([...houseRules, t]); setRuleInput(""); };
  const removeRule = (item: string) => { setHouseRules(houseRules.filter((r) => r !== item)); };
  const handleKeyDown = (e: React.KeyboardEvent, type: "landmark" | "rule") => { if (e.key === "Enter") { e.preventDefault(); if (type === "landmark") addLandmark(); else addRule(); } };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthlyRentMin || !monthlyRentMax) { toast.error("Please fill rent range"); return; }
    toast.success("Pricing saved! Now add photos.");
    router.push("/seller/listing/rent-real-estate/photos");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .listing-page { min-height: 100vh; background: ${BG}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .listing-container { max-width: 1100px; margin: 0 auto; padding: 32px 24px 64px; }
        .listing-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .back-btn { width: 40px; height: 40px; border-radius: 12px; border: 1.5px solid ${BORDER}; background: ${CARD_BG}; display: flex; align-items: center; justify-content: center; cursor: pointer; color: ${TEXT_PRIMARY}; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 1px 2px rgba(0,0,0,0.04); flex-shrink: 0; }
        .back-btn:hover { border-color: #cbd5e1; background: #f1f5f9; transform: translateX(-2px); }
        .listing-header-text { flex: 1; min-width: 0; }
        .listing-title { font-size: 26px; font-weight: 800; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px; line-height: 1.2; }
        .listing-subtitle { font-size: 13.5px; color: ${TEXT_SECONDARY}; margin-top: 3px; }
        .draft-badge { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${SUCCESS}; flex-shrink: 0; }
        .stepper { display: flex; align-items: center; background: ${CARD_BG}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 18px 22px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); overflow-x: auto; }
        .step { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .step-icon-wrap { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; transition: all 0.25s ease; }
        .step.done .step-icon-wrap { background: ${SUCCESS}; color: #fff; }
        .step.active .step-icon-wrap { background: ${ACCENT}; color: #fff; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15); }
        .step.upcoming .step-icon-wrap { background: #f1f5f9; color: ${TEXT_MUTED}; }
        .step-label { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
        .step.done .step-label { color: ${SUCCESS}; } .step.active .step-label { color: ${ACCENT}; } .step.upcoming .step-label { color: ${TEXT_MUTED}; }
        .step-connector { flex: 1; height: 2px; background: #e2e8f0; margin: 0 14px; min-width: 24px; }
        .step-connector.filled { background: ${SUCCESS}; }
        .form-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-card { background: ${CARD_BG}; border-radius: 20px; padding: 32px; border: 1px solid ${BORDER}; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03); }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .section-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .section-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .section-icon.orange { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .section-title-wrap h2 { font-size: 18px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.3px; }
        .section-title-wrap p { font-size: 13px; color: ${TEXT_MUTED}; margin-top: 2px; }
        .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; position: relative; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-label { font-size: 13px; font-weight: 600; color: #334155; display: flex; align-items: center; gap: 3px; }
        .form-label .required { color: #dc2626; font-weight: 700; }
        .form-input { padding: 12px 16px; border: 1.5px solid ${BORDER}; border-radius: 12px; font-size: 14px; color: ${TEXT_PRIMARY}; background: ${CARD_BG}; font-family: inherit; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); width: 100%; outline: none; }
        .form-input:hover { border-color: #cbd5e1; background: #fafafa; }
        .form-input:focus { border-color: ${ACCENT}; background: ${CARD_BG}; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08); }
        .form-input::placeholder { color: #a1a8b5; font-weight: 400; }
        .amenities-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: #334155; cursor: pointer; font-weight: 500; padding: 4px 0; line-height: 1.4; }
        .checkbox-input { width: 18px; height: 18px; accent-color: ${ACCENT}; cursor: pointer; flex-shrink: 0; margin-top: 1px; }
        .tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .tag-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; background: linear-gradient(135deg, #f3e8ff, #ede9fe); border: 1.5px solid #d8b4fe; border-radius: 20px; font-size: 12.5px; font-weight: 500; color: #7c3aed; transition: all 0.2s ease; }
        .tag-pill:hover { border-color: #a855f7; box-shadow: 0 2px 6px rgba(124, 58, 237, 0.12); }
        .tag-remove { display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: rgba(124, 58, 237, 0.1); color: #7c3aed; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .tag-remove:hover { background: rgba(124, 58, 237, 0.2); transform: scale(1.1); }
        .tag-input-wrap { position: relative; }
        .tag-input-wrap .form-input { padding-right: 42px; }
        .tag-add-btn { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER}); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .tag-add-btn:hover { transform: translateY(-50%) scale(1.05); box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3); }
        .radio-group { display: flex; gap: 24px; margin-bottom: 16px; }
        .radio-label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: ${TEXT_PRIMARY}; cursor: pointer; }
        .radio-input { width: 18px; height: 18px; accent-color: ${ACCENT}; cursor: pointer; }
        .submit-wrap { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 8px; gap: 16px; }
        .back-link { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${ACCENT}; background: none; border: 1.5px solid ${BORDER}; border-radius: 12px; padding: 12px 28px; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; }
        .back-link:hover { border-color: ${ACCENT}; background: #eff6ff; }
        .submit-btn { padding: 14px 40px; background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER}); color: #fff; font-size: 15px; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3); letter-spacing: 0.2px; display: flex; align-items: center; gap: 8px; }
        .submit-btn:hover { box-shadow: 0 6px 28px rgba(37, 99, 235, 0.4); transform: translateY(-2px); }

        /* ── Custom Dropdown ── */
        .custom-dropdown-trigger {
          padding: 12px 16px;
          border: 1.5px solid ${BORDER};
          border-radius: 12px;
          font-size: 14px;
          color: ${TEXT_PRIMARY};
          background: ${CARD_BG};
          font-family: inherit;
          width: 100%;
          outline: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-dropdown-trigger:hover { border-color: #cbd5e1; background: #fafafa; }
        .custom-dropdown-trigger:focus { border-color: ${ACCENT}; background: ${CARD_BG}; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08); }
        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: ${CARD_BG};
          border: 1.5px solid ${BORDER};
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
          z-index: 9999;
          max-height: 240px;
          overflow-y: auto;
          animation: dropdownSlide 0.18s ease-out;
        }
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-dropdown-item {
          padding: 10px 16px;
          font-size: 14px;
          color: ${TEXT_PRIMARY};
          cursor: pointer;
          transition: background 0.15s ease;
          border-bottom: 1px solid #f1f5f9;
        }
        .custom-dropdown-item:last-child { border-bottom: none; }
        .custom-dropdown-item:hover { background: #f0f7ff; color: ${ACCENT}; }
        .custom-dropdown-item.selected { background: #eff6ff; color: ${ACCENT}; font-weight: 600; }

        /* ── Date Picker ── */
        .date-trigger { padding-right: 14px; }
        .date-picker-popup {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          background: ${CARD_BG};
          border: 1.5px solid ${BORDER};
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.14);
          z-index: 9999;
          width: 280px;
          padding: 16px;
          animation: dropdownSlide 0.18s ease-out;
        }
        .dp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .dp-month-year {
          font-size: 15px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
        }
        .dp-nav {
          display: flex;
          gap: 4px;
        }
        .dp-nav button {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .dp-nav button:hover { background: #f1f5f9; }
        .dp-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          margin-bottom: 6px;
        }
        .dp-weekday {
          text-align: center;
          font-size: 11px;
          font-weight: 600;
          color: ${TEXT_MUTED};
          padding: 4px 0;
        }
        .dp-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .dp-day {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: ${TEXT_PRIMARY};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          margin: 0 auto;
        }
        .dp-day:hover:not(.empty) { background: #f0f7ff; color: ${ACCENT}; }
        .dp-day.empty { cursor: default; }
        .dp-day.today { border: 1.5px solid ${ACCENT}; color: ${ACCENT}; font-weight: 600; }
        .dp-day.selected {
          background: ${ACCENT};
          color: #fff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }
        .dp-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid ${BORDER};
        }
        .dp-btn-clear, .dp-btn-today {
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .dp-btn-clear { color: ${TEXT_MUTED}; background: transparent; }
        .dp-btn-clear:hover { color: #dc2626; background: #fef2f2; }
        .dp-btn-today { color: ${ACCENT}; background: #eff6ff; }
        .dp-btn-today:hover { background: #dbeafe; }

        @media (max-width: 900px) {
          .form-layout { grid-template-columns: 1fr; }
          .listing-container { padding: 20px 20px 48px; }
          .form-card { padding: 24px; border-radius: 16px; }
          .listing-title { font-size: 22px; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
          .amenities-grid { grid-template-columns: 1fr; }
          .submit-wrap { flex-direction: column-reverse; }
          .back-link, .submit-btn { width: 100%; justify-content: center; }
          .date-picker-popup { left: auto; right: 0; }
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
              <p className="listing-subtitle">Select &rsaquo; Create Listing</p>
            </div>
            <div className="draft-badge">
              Draft Saved <FiCheck size={16} />
            </div>
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
                {idx < steps.length - 1 && (
                  <div className={`step-connector ${step.status === "done" ? "filled" : ""}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="form-layout">
            <div>
              <div className="form-card" style={{ marginBottom: "24px" }}>
                <div className="section-header">
                  <div className="section-icon blue"><FiDollarSign size={18} color="#fff" /></div>
                  <div className="section-title-wrap"><h2>Pricing &amp; Details</h2></div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Monthly Rent Min (NPR)<span className="required">*</span></label>
                    <input type="text" inputMode="numeric" className="form-input" placeholder="25000" value={monthlyRentMin} onChange={(e) => setMonthlyRentMin(e.target.value.replace(/[^0-9]/g, ""))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Rent Max (NPR)<span className="required">*</span></label>
                    <input type="text" inputMode="numeric" className="form-input" placeholder="50000" value={monthlyRentMax} onChange={(e) => setMonthlyRentMax(e.target.value.replace(/[^0-9]/g, ""))} required />
                  </div>
                </div>
                <div className="form-row">
                  <CustomDropdown
                    label="Bedrooms"
                    value={bedrooms}
                    options={bedroomsOptions}
                    onChange={setBedrooms}
                  />
                  <CustomDropdown
                    label="Bathrooms"
                    value={bathrooms}
                    options={bathroomsOptions}
                    onChange={setBathrooms}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Square Feet</label>
                    <input type="text" inputMode="numeric" className="form-input" placeholder="900" value={sqft} onChange={(e) => setSqft(e.target.value.replace(/[^0-9]/g, ""))} />
                  </div>
                  <DatePicker
                    label="Available From (Optional)"
                    value={availableFrom}
                    onChange={setAvailableFrom}
                  />
                </div>
              </div>

              <div className="form-card">
                <div className="section-header">
                  <div className="section-icon orange"><FiCheck size={18} color="#fff" /></div>
                  <div className="section-title-wrap"><h2>Amenities</h2></div>
                </div>
                <div className="amenities-grid">
                  {amenitiesList.map((item) => (
                    <label key={item.id} className="checkbox-label">
                      <input type="checkbox" className="checkbox-input" checked={amenities[item.id]} onChange={() => toggleAmenity(item.id)} />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="form-card" style={{ marginBottom: "24px" }}>
                <div className="section-header">
                  <div className="section-icon blue"><FiUser size={18} color="#fff" /></div>
                  <div className="section-title-wrap"><h2>Owner &amp; Rules</h2></div>
                </div>
                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label">Is Owner or Agent?<span className="required">*</span></label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" className="radio-input" name="ownerType" value="owner" checked={ownerType === "owner"} onChange={() => setOwnerType("owner")} />
                      OWNER
                    </label>
                    <label className="radio-label">
                      <input type="radio" className="radio-input" name="ownerType" value="agent" checked={ownerType === "agent"} onChange={() => setOwnerType("agent")} />
                      AGENT
                    </label>
                  </div>
                </div>
                <label className="checkbox-label" style={{ marginBottom: "24px" }}>
                  <input type="checkbox" className="checkbox-input" checked={noBroker} onChange={(e) => setNoBroker(e.target.checked)} />
                  No Broker
                </label>
                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label">Nearby Landmarks</label>
                  <div className="tags-wrap">
                    {landmarks.map((item) => (
                      <span key={item} className="tag-pill">
                        {item}
                        <span className="tag-remove" onClick={() => removeLandmark(item)}><FiX size={10} /></span>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-wrap">
                    <input type="text" className="form-input" placeholder="Type and press Enter to add more" value={landmarkInput} onChange={(e) => setLandmarkInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, "landmark")} />
                    <button type="button" className="tag-add-btn" onClick={addLandmark}><FiPlus size={14} /></button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">House Rules</label>
                  <div className="tags-wrap">
                    {houseRules.map((item) => (
                      <span key={item} className="tag-pill">
                        {item}
                        <span className="tag-remove" onClick={() => removeRule(item)}><FiX size={10} /></span>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-wrap">
                    <input type="text" className="form-input" placeholder="Type and press Enter to add more" value={ruleInput} onChange={(e) => setRuleInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, "rule")} />
                    <button type="button" className="tag-add-btn" onClick={addRule}><FiPlus size={14} /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="submit-wrap" style={{ gridColumn: "1 / -1" }}>
              <button type="button" className="back-link" onClick={() => router.back()}>
                <FiArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="submit-btn">
                Save &amp; Continue <FiChevronRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}