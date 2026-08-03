"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronRight,
  FiChevronDown,
  FiFileText,
  FiBox,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDraft } from "./layout";

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
  { label: "Photos", icon: FiBox, status: "active" as const },
  { label: "Preview", icon: FiBox, status: "upcoming" as const },
];

const listingTypes = [
  "Produce",
  "LiveStock",
  "Tool",
  "Seed",
  "Fertilizer",
  "Vet Service",
  "Farm Labour",
];

const units = ["KG", "HEAD", "Piece", "Litre", "Gram", "Bundle"];
const seasons = ["March - June", "July - October", "November - February", "All Year"];
const animalTypes = ["Cow", "Dog", "Goat", "Buffalo", "Chicken", "Sheep"];
const breeds = ["Jersey", "Holstein", "Local", "Hybrid", "Sahiwal"];
const ages = ["1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"];
const healthStatuses = ["VACCINATED", "NOT VACCINATED", "PARTIALLY VACCINATED"];
const serviceTypes = ["General Health Checkup", "Vaccination", "Surgery", "Deworming", "Consultation"];
const priceUnits = ["Per Visit", "Per Hour", "Per Day", "Per Service"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  required = false,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const idx = options.indexOf(value);
      setHighlighted(idx >= 0 ? idx : 0);
    }
  }, [open, options, value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((i) => Math.min(i + 1, options.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        onChange(options[highlighted]);
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, highlighted, options, onChange]);

  return (
    <div className="select-wrap" ref={containerRef}>
      <button
        type="button"
        className="form-select-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{value || placeholder}</span>
        <FiChevronDown
          size={14}
          className="select-chevron"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        />
      </button>
      {open && (
        <div className="custom-dropdown" role="listbox">
          {options.map((opt, i) => (
            <div
              key={opt}
              className={`custom-option ${opt === value ? "selected" : ""} ${i === highlighted ? "highlighted" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
              onMouseEnter={() => setHighlighted(i)}
              role="option"
              aria-selected={opt === value}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
      {required && (
        <select
          value={value}
          onChange={() => {}}
          required
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0, width: 0 }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </div>
  );
}

export default function AgricultureListingPage() {
  const router = useRouter();
  const { agricultureData, setAgricultureData } = useDraft();
  const d = agricultureData;

  const isProduce = d.listingType === "Produce";
  const isLiveStock = d.listingType === "LiveStock";
  const isVetService = d.listingType === "Vet Service";

  const formattedPrice = useMemo(() => {
    const val = isVetService ? d.servicePrice : d.price;
    if (!val) return "";
    const num = Number(val.replace(/,/g, ""));
    if (isNaN(num)) return val;
    return num.toLocaleString("en-IN");
  }, [d.price, d.servicePrice, isVetService]);

  const handlePriceChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    if (isVetService) setAgricultureData({ ...d, servicePrice: cleaned });
    else setAgricultureData({ ...d, price: cleaned });
  };

  const toggleDay = (day: string) => {
    const next = d.availabilityDays.includes(day)
      ? d.availabilityDays.filter((x) => x !== day)
      : [...d.availabilityDays, day];
    setAgricultureData({ ...d, availabilityDays: next });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalData = {
      ...d,
      itemName: d.itemName || (isVetService ? d.serviceType : "Fresh Organic Vegetable"),
      price: formattedPrice || (isProduce ? "120" : isLiveStock ? "55,000" : "1,500"),
      description: d.description || (isVetService
        ? "Professional veterinary services at your doorstep. We provide general health checkup, vaccination, consultation and basic treatment for your pets."
        : "Toyota Fortuner 2021 model in excellent condition. Well maintained, all documents are valid."),
    };

    setAgricultureData(finalData);
    toast.success("Details saved! Now add photos.");
    router.push("/seller/listing/agriculture-livestock/photos");
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
        }

        .listing-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        .listing-header {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 24px;
        }

        .back-btn {
          width: 40px; height: 40px; border-radius: 12px;
          border: 1.5px solid ${BORDER}; background: ${CARD_BG};
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: ${TEXT_PRIMARY};
          transition: all 0.25s ease; flex-shrink: 0;
        }

        .back-btn:hover { background: #f1f5f9; transform: translateX(-2px); }

        .listing-header-text { flex: 1; }

        .listing-title { font-size: 26px; font-weight: 800; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px; }

        .listing-subtitle { font-size: 13.5px; color: ${TEXT_SECONDARY}; margin-top: 3px; }

        .draft-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 600; color: ${SUCCESS}; flex-shrink: 0;
        }

        .stepper {
          display: flex; align-items: center; background: ${CARD_BG};
          border: 1px solid ${BORDER}; border-radius: 16px;
          padding: 18px 22px; margin-bottom: 24px; overflow-x: auto;
        }

        .step { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        .step-icon-wrap {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; flex-shrink: 0;
        }

        .step.done .step-icon-wrap { background: ${SUCCESS}; color: #fff; }
        .step.active .step-icon-wrap { background: ${SITE_PRIMARY}; color: #fff; }
        .step.upcoming .step-icon-wrap { background: #f1f5f9; color: ${TEXT_MUTED}; }

        .step-label { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
        .step.done .step-label { color: ${SUCCESS}; }
        .step.active .step-label { color: ${SITE_PRIMARY}; }
        .step.upcoming .step-label { color: ${TEXT_MUTED}; }

        .step-connector {
          flex: 1; height: 2px; background: #e2e8f0;
          margin: 0 14px; min-width: 24px;
        }

        .step-connector.filled { background: ${SUCCESS}; }

        .form-card {
          background: ${CARD_BG}; border-radius: 20px; padding: 32px;
          border: 1px solid ${BORDER};
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03);
        }

        .category-wrap { margin-bottom: 20px; }

        .category-label { font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px; display: block; }

        .category-pill {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 8px 16px; background: #f1f5f9;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 14px; font-weight: 600; color: ${TEXT_PRIMARY};
          font-family: inherit; cursor: pointer;
        }

        .change-badge {
          font-size: 12px; font-weight: 500; color: #7c3aed;
          background: #ede9fe; padding: 2px 8px; border-radius: 6px;
        }

        .form-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
        }

        .section-header {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-size: 16px; font-weight: 700; color: ${SITE_PRIMARY};
        }

        .radio-group {
          display: flex; flex-direction: column; gap: 4px;
        }

        .radio-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          cursor: pointer; transition: all 0.2s;
          border: 1.5px solid transparent;
        }

        .radio-item:hover { background: #f8fafc; }

        .radio-item.active {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border-color: #bfdbfe;
        }

        .radio-item input[type="radio"] { display: none; }

        .radio-circle {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid #cbd5e1; display: flex;
          align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s;
        }

        .radio-item.active .radio-circle {
          border-color: ${SITE_PRIMARY}; background: ${SITE_PRIMARY};
        }

        .radio-item.active .radio-circle::after {
          content: ''; width: 5px; height: 5px;
          border-radius: 50%; background: #fff;
        }

        .radio-label { font-size: 14px; font-weight: 500; color: ${TEXT_PRIMARY}; }
        .radio-item.active .radio-label { color: ${SITE_PRIMARY}; font-weight: 600; }

        .right-section {
          display: flex; flex-direction: column; gap: 24px;
        }

        .form-section {
          border: 1px solid ${BORDER}; border-radius: 12px; padding: 20px;
        }

        .section-title {
          font-size: 15px; font-weight: 700; color: ${SITE_PRIMARY};
          margin-bottom: 16px;
        }

        .form-row {
          display: grid; gap: 16px; margin-bottom: 16px;
        }

        .form-row.two-col { grid-template-columns: 1fr 1fr; }
        .form-row.three-col { grid-template-columns: 1fr 1fr 1fr; }

        .form-group {
          display: flex; flex-direction: column; gap: 6px;
        }

        .form-label {
          font-size: 13px; font-weight: 600; color: #334155;
          display: flex; align-items: center; gap: 3px;
        }

        .form-label .required { color: ${DANGER}; font-weight: 700; }
        .form-label .optional { color: ${TEXT_MUTED}; font-weight: 500; font-size: 11px; }

        .form-input, .form-select, .form-textarea {
          padding: 10px 14px; border: 1.5px solid ${BORDER};
          border-radius: 10px; font-size: 14px; color: ${TEXT_PRIMARY};
          background: ${CARD_BG}; font-family: inherit;
          transition: all 0.2s; width: 100%; outline: none;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: ${ACCENT};
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .select-wrap { position: relative; }

        .form-select-trigger {
          cursor: pointer; padding-right: 36px;
          padding: 10px 14px; border: 1.5px solid #e2e8f0;
          border-radius: 10px; font-size: 14px; color: #0f172a;
          background: #ffffff; font-family: inherit;
          transition: all 0.2s; width: 100%; outline: none;
          display: flex; align-items: center; justify-content: space-between;
          text-align: left;
        }

        .form-select-trigger:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .custom-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
          z-index: 100;
          max-height: 240px;
          overflow-y: auto;
        }

        .custom-option {
          padding: 10px 14px;
          font-size: 14px;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.15s;
        }

        .custom-option:hover, .custom-option.highlighted {
          background: #eff6ff;
          color: #2563eb;
        }

        .custom-option.selected {
          background: #2563eb;
          color: #fff;
        }

        .select-chevron {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%); color: ${TEXT_MUTED};
          pointer-events: none;
        }

        .checkbox-group {
          display: flex; flex-direction: column; gap: 10px;
        }

        .checkbox-inline {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; color: #334155; cursor: pointer;
          font-weight: 500;
        }

        .checkbox-inline input[type="checkbox"] { display: none; }

        .check-box {
          width: 16px; height: 16px; border-radius: 4px;
          border: 2px solid ${ACCENT}; display: flex;
          align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s;
        }

        .checkbox-inline input[type="checkbox"]:checked + .check-box {
          background: ${ACCENT};
        }

        .checkbox-inline input[type="checkbox"]:checked + .check-box::after {
          content: ''; width: 4px; height: 7px;
          border: solid #fff; border-width: 0 2px 2px 0;
          transform: rotate(45deg); margin-top: -1px;
        }

        .day-selector {
          display: flex; gap: 6px; flex-wrap: wrap;
        }

        .day-pill {
          padding: 6px 12px; border-radius: 6px;
          border: 1.5px solid ${BORDER}; background: ${CARD_BG};
          font-size: 12px; font-weight: 500; color: ${TEXT_SECONDARY};
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }

        .day-pill.active {
          background: ${ACCENT}; color: #fff; border-color: ${ACCENT};
        }

        .submit-wrap {
          display: flex; justify-content: space-between;
          align-items: center; margin-top: 24px; gap: 16px;
        }

        .back-link {
          display: flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 600; color: ${ACCENT};
          background: none; border: 1.5px solid ${BORDER};
          border-radius: 10px; padding: 10px 24px;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }

        .back-link:hover { border-color: ${ACCENT}; background: ${ACCENT_LIGHT}; }

        .submit-btn {
          padding: 12px 32px;
          background: linear-gradient(135deg, ${ACCENT}, #1d4ed8);
          color: #fff; font-size: 14px; font-weight: 600;
          border: none; border-radius: 10px; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
        }

        .submit-btn:hover { transform: translateY(-1px); }

        @media (max-width: 768px) {
          .listing-container { padding: 20px 16px 48px; }
          .form-layout { grid-template-columns: 1fr; }
          .form-row.two-col, .form-row.three-col { grid-template-columns: 1fr; }
          .submit-wrap { flex-direction: column-reverse; }
          .back-link, .submit-btn { width: 100%; justify-content: center; }
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

          <form onSubmit={handleSubmit} className="form-card">
            <div className="category-wrap">
              <label className="category-label">Category</label>
              <button type="button" className="category-pill" onClick={() => router.push("/seller/dashboard")}>
                <FiBox size={16} />
                Agriculture And Livestock
                <span className="change-badge">Change</span>
              </button>
            </div>

            <div className="form-layout">
              <div className="left-col">
                <div className="section-header">
                  <h2>Listing Type</h2>
                </div>

                <div className="radio-group">
                  {listingTypes.map((type) => (
                    <label
                      key={type}
                      className={`radio-item ${d.listingType === type ? "active" : ""}`}
                      onClick={() => setAgricultureData({ ...d, listingType: type })}
                    >
                      <input
                        type="radio"
                        name="listingType"
                        value={type}
                        checked={d.listingType === type}
                        onChange={() => setAgricultureData({ ...d, listingType: type })}
                      />
                      <span className="radio-circle"></span>
                      <span className="radio-label">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="right-section">
                <div className="form-section">
                  <div className="section-title">Location Information</div>
                  <div className="form-row two-col">
                    <div className="form-group">
                      <label className="form-label">District <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter district"
                        value={d.district}
                        onChange={(e) => setAgricultureData({ ...d, district: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Village <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter village"
                        value={d.village}
                        onChange={(e) => setAgricultureData({ ...d, village: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location /Area <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter location/area"
                      value={d.location}
                      onChange={(e) => setAgricultureData({ ...d, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-title">Pricing Information</div>
                  <div className="form-row two-col">
                    <div className="form-group">
                      <label className="form-label">
                        {isVetService ? "Service Price(NPR)" : "Price per Unit(NPR)"} <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-input"
                        placeholder={isVetService ? "1,500" : "120"}
                        value={isVetService ? (d.servicePrice ? Number(d.servicePrice).toLocaleString("en-IN") : "") : formattedPrice}
                        onChange={(e) => handlePriceChange(e.target.value.replace(/,/g, ""))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unit <span className="required">*</span></label>
                      <CustomSelect
                        options={isVetService ? priceUnits : units}
                        value={isVetService ? d.priceUnit : d.unit}
                        onChange={(val) => setAgricultureData(isVetService ? { ...d, priceUnit: val } : { ...d, unit: val })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {isProduce && (
                  <div className="form-section">
                    <div className="section-title">Product /Animal Details</div>
                    <div className="checkbox-group" style={{ marginBottom: "16px" }}>
                      <label className="checkbox-inline">
                        <input type="checkbox" checked={d.organicCertified} onChange={(e) => setAgricultureData({ ...d, organicCertified: e.target.checked })} />
                        <span className="check-box"></span>
                        <span>Organic Certified</span>
                      </label>
                      <label className="checkbox-inline">
                        <input type="checkbox" checked={d.organicVerified} onChange={(e) => setAgricultureData({ ...d, organicVerified: e.target.checked })} />
                        <span className="check-box"></span>
                        <span>Organic Verified</span>
                      </label>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Seasonal Availability <span className="optional">(Optional)</span></label>
                      <CustomSelect
                        options={seasons}
                        value={d.seasonalAvailability}
                        onChange={(val) => setAgricultureData({ ...d, seasonalAvailability: val })}
                      />
                    </div>
                  </div>
                )}

                {isLiveStock && (
                  <div className="form-section">
                    <div className="section-title">Product /Animal Details</div>
                    <div className="checkbox-group" style={{ marginBottom: "16px" }}>
                      <label className="checkbox-inline">
                        <input type="checkbox" checked={d.organicCertified} onChange={(e) => setAgricultureData({ ...d, organicCertified: e.target.checked })} />
                        <span className="check-box"></span>
                        <span>Organic Certified</span>
                      </label>
                      <label className="checkbox-inline">
                        <input type="checkbox" checked={d.organicVerified} onChange={(e) => setAgricultureData({ ...d, organicVerified: e.target.checked })} />
                        <span className="check-box"></span>
                        <span>Organic Verified</span>
                      </label>
                    </div>
                    <div className="form-row three-col">
                      <div className="form-group">
                        <label className="form-label">Animal Type <span className="required">*</span></label>
                        <CustomSelect
                          options={animalTypes}
                          value={d.animalType}
                          onChange={(val) => setAgricultureData({ ...d, animalType: val })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Age <span className="optional">(Optional)</span></label>
                        <CustomSelect
                          options={ages}
                          value={d.age}
                          onChange={(val) => setAgricultureData({ ...d, age: val })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Breed <span className="optional">(Optional)</span></label>
                        <CustomSelect
                          options={breeds}
                          value={d.breed}
                          onChange={(val) => setAgricultureData({ ...d, breed: val })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Health / Vaccine Status <span className="optional">(Optional)</span></label>
                      <CustomSelect
                        options={healthStatuses}
                        value={d.healthVaccineStatus}
                        onChange={(val) => setAgricultureData({ ...d, healthVaccineStatus: val })}
                      />
                    </div>
                  </div>
                )}

                {isVetService && (
                  <div className="form-section">
                    <div className="section-title">Details Information</div>
                    <div className="form-row two-col">
                      <div className="form-group">
                        <label className="form-label">Service Type <span className="required">*</span></label>
                        <CustomSelect
                          options={serviceTypes}
                          value={d.serviceType}
                          onChange={(val) => setAgricultureData({ ...d, serviceType: val })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Animal Type <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Cow, Dog, Goat"
                          value={d.animalType}
                          onChange={(e) => setAgricultureData({ ...d, animalType: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row two-col">
                      <div className="form-group">
                        <label className="form-label">Experience(years) <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 5+ Years"
                          value={d.experience}
                          onChange={(e) => setAgricultureData({ ...d, experience: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Service Type <span className="required">*</span></label>
                        <label className="checkbox-inline" style={{ padding: "8px 0" }}>
                          <input type="checkbox" checked={d.mobileService} onChange={(e) => setAgricultureData({ ...d, mobileService: e.target.checked })} />
                          <span className="check-box"></span>
                          <span>Yes, I provide mobile service</span>
                        </label>
                      </div>
                    </div>
                    <div className="form-row two-col">
                      <div className="form-group">
                        <label className="form-label">Service Area/Location <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter service area/location"
                          value={d.serviceArea}
                          onChange={(e) => setAgricultureData({ ...d, serviceArea: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Service Radius(KM) <span className="required">*</span></label>
                        <input type="text" className="form-input" placeholder="10" value={d.serviceRadius} onChange={(e) => setAgricultureData({ ...d, serviceRadius: e.target.value })} required />
                      </div>
                    </div>
                    <div className="form-row two-col">
                      <div className="form-group">
                        <label className="form-label">Health Certificate Available</label>
                        <label className="checkbox-inline" style={{ padding: "8px 0" }}>
                          <input type="checkbox" checked={d.healthCertificate} onChange={(e) => setAgricultureData({ ...d, healthCertificate: e.target.checked })} />
                          <span className="check-box"></span>
                          <span>Yes</span>
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Vaccination Available <span className="required">*</span></label>
                        <label className="checkbox-inline" style={{ padding: "8px 0" }}>
                          <input type="checkbox" checked={d.vaccinationAvailable} onChange={(e) => setAgricultureData({ ...d, vaccinationAvailable: e.target.checked })} />
                          <span className="check-box"></span>
                          <span>Yes</span>
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Availability Day <span className="required">*</span></label>
                      <div className="day-selector">
                        {days.map((day) => (
                          <button
                            key={day}
                            type="button"
                            className={`day-pill ${d.availabilityDays.includes(day) ? "active" : ""}`}
                            onClick={() => toggleDay(day)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-section">
                  <div className="section-title">Description</div>
                  <div className="form-group">
                    <textarea
                      className="form-textarea"
                      placeholder="Describe your item..."
                      value={d.description}
                      onChange={(e) => setAgricultureData({ ...d, description: e.target.value })}
                      rows={4}
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