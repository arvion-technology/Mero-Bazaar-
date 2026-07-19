"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronRight,
  FiChevronDown,
  FiFileText,
  FiEye,
  FiCheck,
  FiMapPin,
  FiClock,
  FiTool,
  FiList,
  FiDollarSign,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";

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
const SITE_PRIMARY = "#C0392B";

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Detail", icon: FiList, status: "active" as const },
  { label: "Preview", icon: FiEye, status: "upcoming" as const },
];

const serviceAreas = ["5KM", "10KM", "15KM", "20KM", "25KM", "30KM", "50KM"];
const responseTimes = ["30 Minutes", "1 Hour", "2 Hours", "3 Hours", "4 Hours", "Same Day", "Next Day"];

// Kathmandu default coordinates
const DEFAULT_LAT = 27.7172;
const DEFAULT_LNG = 85.3240;

// Dynamic import for Leaflet map (no SSR)
const MapWithNoSSR = dynamic(
  () => import("./MapComponent"),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div style={{
      width: "100%",
      height: "200px",
      background: "#e5e7eb",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1.5px solid ${BORDER}`,
    }}>
      <span style={{ color: TEXT_MUTED, fontSize: "14px" }}>Loading map...</span>
    </div>
  );
}

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

export default function TradesHomeRepairDetailPage() {
  const router = useRouter();

  // ── Service Area & Charges ──
  const [serviceArea, setServiceArea] = useState("10KM");
  const [calloutCharge, setCalloutCharge] = useState("");
  const [warrantyGiven, setWarrantyGiven] = useState(true);
  const [emergencyService, setEmergencyService] = useState(true);
  const [avgResponseTime, setAvgResponseTime] = useState("1 Hour");

  // ── Location ──
  const [address, setAddress] = useState("Kalanki, kathmandu, Nepal");
  const [mapPosition, setMapPosition] = useState<[number, number]>([DEFAULT_LAT, DEFAULT_LNG]);

  const formattedCallout = useMemo(() => {
    if (!calloutCharge) return "";
    const num = Number(calloutCharge.replace(/,/g, ""));
    if (isNaN(num)) return calloutCharge;
    return num.toLocaleString("en-IN");
  }, [calloutCharge]);

  const handleCalloutChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setCalloutCharge(cleaned);
  };

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setMapPosition([lat, lng]);
    // Reverse geocoding could be added here to update address
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceArea || !calloutCharge || !avgResponseTime || !address) {
      toast.error("Please fill all required fields");
      return;
    }
    // Save to localStorage or context before navigating
    localStorage.setItem("tradesDetail", JSON.stringify({
      serviceArea, calloutCharge, warrantyGiven, emergencyService,
      avgResponseTime, address, mapPosition
    }));
    toast.success("Details saved! Preview your listing.");
    router.push("/seller/listing/trades-home-repair/preview");
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

        /* ── Two Column Layout ── */
        .two-col-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .left-col { padding-right: 20px; border-right: 1px solid ${BORDER}; }
        .right-col { padding-left: 20px; }

        /* ── Section Title ── */
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: ${ACCENT};
          letter-spacing: -0.3px;
          margin-bottom: 20px;
        }

        /* ── Form Group ── */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .form-label .required { color: ${DANGER}; font-weight: 700; }

        .form-input {
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

        .form-input:hover {
          border-color: #cbd5e1;
          background: #fafafa;
        }

        .form-input:focus {
          border-color: ${ACCENT};
          background: ${CARD_BG};
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
        }

        .form-input::placeholder {
          color: #a1a8b5;
          font-weight: 400;
        }

        .hint-text {
          font-size: 11.5px;
          color: ${TEXT_MUTED};
          margin-top: 4px;
        }

        /* ── Checkbox ── */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: ${TEXT_PRIMARY};
          cursor: pointer;
          font-weight: 500;
        }

        .checkbox-item input[type="checkbox"] {
          display: none;
        }

        .check-box {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid ${ACCENT};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .checkbox-item input[type="checkbox"]:checked + .check-box {
          background: ${ACCENT};
        }

        .checkbox-item input[type="checkbox"]:checked + .check-box::after {
          content: '';
          width: 5px;
          height: 9px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
          margin-top: -2px;
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

        /* ── Map Container ── */
        .map-wrapper {
          width: 100%;
          height: 200px;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid ${BORDER};
        }

        .map-wrapper .leaflet-container {
          width: 100%;
          height: 100%;
          border-radius: 12px;
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

        /* ── Divider ── */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, ${BORDER}, transparent);
          margin: 28px 0;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .listing-container { padding: 16px; }
          .form-card { padding: 20px; border-radius: 16px; }
          .two-col-layout { 
            grid-template-columns: 1fr; 
            gap: 32px; 
          }
          .left-col { padding-right: 0; border-right: none; border-bottom: 1px solid ${BORDER}; padding-bottom: 24px; }
          .right-col { padding-left: 0; }
          .listing-title { font-size: 20px; }
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
          .map-wrapper { height: 160px; }
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
            {/* Two Column Layout */}
            <div className="two-col-layout">
              {/* Left: Service Area & Charges + Availability */}
              <div className="left-col">
                <h2 className="section-title">Service Area & charges</h2>

                <div className="form-group">
                  <label className="form-label">
                    Service AreaKm <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={serviceAreas}
                    value={serviceArea}
                    onChange={setServiceArea}
                    placeholder="Select area"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    CalloutCharge <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input"
                    placeholder="Enter callout charge"
                    value={formattedCallout}
                    onChange={(e) => handleCalloutChange(e.target.value)}
                    required
                  />
                  <p className="hint-text">Charge applied per unit</p>
                </div>

                <h2 className="section-title" style={{ marginTop: 8 }}>Availability & Response</h2>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={warrantyGiven}
                      onChange={(e) => setWarrantyGiven(e.target.checked)}
                    />
                    <span className="check-box"></span>
                    <span>Warranty Given</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={emergencyService}
                      onChange={(e) => setEmergencyService(e.target.checked)}
                    />
                    <span className="check-box"></span>
                    <span>Emergency Service available</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Average Response Time <span className="required">*</span>
                  </label>
                  <CustomSelect
                    options={responseTimes}
                    value={avgResponseTime}
                    onChange={setAvgResponseTime}
                    placeholder="Select response time"
                  />
                  <p className="hint-text">Average time to respond after contact</p>
                </div>
              </div>

              {/* Right: Location */}
              <div className="right-col">
                <h2 className="section-title">Location</h2>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Map location</label>
                  <div className="map-wrapper">
                    <MapWithNoSSR
                      position={mapPosition}
                      onMapClick={handleMapClick}
                    />
                  </div>
                  <p className="hint-text">Click on map to set exact location</p>
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