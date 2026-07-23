"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronRight,
  FiMapPin,
  FiFileText,
  FiHome,
  FiEye,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";

const MapSection = dynamic(() => import("./MapSection"), { ssr: false });

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Details", icon: FiHome, status: "active" as const },
  { label: "Pricing", icon: FiFileText, status: "upcoming" as const },
  { label: "Photos", icon: FiFileText, status: "upcoming" as const },
  { label: "Preview", icon: FiEye, status: "upcoming" as const },
];

const propertyTypes = ["Apartment", "House", "Room", "Flat", "Villa", "Office Space", "Shop"];
const listingTypes = ["Rent", "Sale"];
const cities = ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Chitwan"];
const areas: Record<string, string[]> = {
  Kathmandu: ["Kalanki", "Thamel", "Baneshwor", "Koteshwor", "Boudha", "Patan"],
  Pokhara: ["Lakeside", "Mahendrapool", "Chipledhunga", "Bagar"],
  Lalitpur: ["Patan", "Kupondole", "Jhamsikhel", "Pulchowk"],
  Bhaktapur: ["Suryabinayak", "Madhyapur Thimi", "Nagadesh"],
  Chitwan: ["Bharatpur", "Ratnanagar", "Khairahani"],
};
const wards = Array.from({ length: 35 }, (_, i) => `Ward ${i + 1}`);

const cityCoords: Record<string, [number, number]> = {
  Kathmandu: [27.7172, 85.3240],
  Pokhara: [28.2096, 83.9856],
  Lalitpur: [27.6644, 85.3188],
  Bhaktapur: [27.6710, 85.4298],
  Chitwan: [27.5291, 84.3542],
};

const areaCoords: Record<string, [number, number]> = {
  Kalanki: [27.6947, 85.2816],
  Thamel: [27.7154, 85.3123],
  Baneshwor: [27.6856, 85.3289],
  Koteshwor: [27.6758, 85.3492],
  Boudha: [27.7215, 85.3620],
  Patan: [27.6644, 85.3188],
  Lakeside: [28.2096, 83.9856],
  Mahendrapool: [28.2200, 83.9900],
  Chipledhunga: [28.2150, 83.9800],
  Bagar: [28.2050, 83.9750],
  Kupondole: [27.6740, 85.3120],
  Jhamsikhel: [27.6700, 85.3100],
  Pulchowk: [27.6820, 85.3150],
  Suryabinayak: [27.6800, 85.4200],
  "Madhyapur Thimi": [27.6750, 85.3850],
  Nagadesh: [27.6650, 85.3950],
  Bharatpur: [27.5291, 84.3542],
  Ratnanagar: [27.5200, 84.3600],
  Khairahani: [27.5150, 84.3400],
};

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

// Helper to safely parse coordinates
function safeCoord(input: string, fallback: number): number {
  if (!input || input.trim() === "") return fallback;
  const parsed = parseFloat(input);
  return isNaN(parsed) ? fallback : parsed;
}

export default function RealEstateDetailsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [listingType, setListingType] = useState("Rent");
  const [city, setCity] = useState("Kathmandu");
  const [area, setArea] = useState("Kalanki");
  const [ward, setWard] = useState("Ward 14");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const descMax = 500;
  const descLength = description.length;

  const fallbackLat = areaCoords[area]?.[0] ?? cityCoords[city][0];
  const fallbackLng = areaCoords[area]?.[1] ?? cityCoords[city][1];

  const currentLat = safeCoord(latitude, fallbackLat);
  const currentLng = safeCoord(longitude, fallbackLng);

  const handleCityChange = (val: string) => {
    setCity(val);
    const newArea = areas[val]?.[0] || "";
    setArea(newArea);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Details saved! Now add pricing.");
    router.push("/seller/listing/rent-real-estate/pricing");
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
        .step.done .step-label { color: ${SUCCESS}; }
        .step.active .step-label { color: ${ACCENT}; }
        .step.upcoming .step-label { color: ${TEXT_MUTED}; }
        .step-connector { flex: 1; height: 2px; background: #e2e8f0; margin: 0 14px; min-width: 24px; position: relative; }
        .step-connector.filled { background: ${SUCCESS}; }
        .form-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-card { background: ${CARD_BG}; border-radius: 20px; padding: 32px; border: 1px solid ${BORDER}; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03); }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .section-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .section-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .section-icon.green { background: linear-gradient(135deg, #10b981, #059669); }
        .section-icon.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .section-title-wrap h2 { font-size: 18px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.3px; }
        .section-title-wrap p { font-size: 13px; color: ${TEXT_MUTED}; margin-top: 2px; }
        .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; position: relative; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-label { font-size: 13px; font-weight: 600; color: #334155; display: flex; align-items: center; gap: 3px; }
        .form-label .required { color: #dc2626; font-weight: 700; }
        .form-input, .form-textarea { padding: 12px 16px; border: 1.5px solid ${BORDER}; border-radius: 12px; font-size: 14px; color: ${TEXT_PRIMARY}; background: ${CARD_BG}; font-family: inherit; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); width: 100%; outline: none; }
        .form-input:hover, .form-textarea:hover { border-color: #cbd5e1; background: #fafafa; }
        .form-input:focus, .form-textarea:focus { border-color: ${ACCENT}; background: ${CARD_BG}; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08); }
        .form-input::placeholder, .form-textarea::placeholder { color: #a1a8b5; font-weight: 400; }
        .form-textarea { min-height: 100px; resize: vertical; line-height: 1.5; }
        .char-counter { font-size: 11.5px; color: ${TEXT_MUTED}; text-align: right; margin-top: -2px; }
        .char-counter.near-limit { color: #dc2626; font-weight: 600; }
        .category-wrap { margin-bottom: 24px; }
        .category-label { font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 10px; display: block; }
        .category-pill { display: inline-flex; align-items: center; gap: 10px; padding: 10px 18px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1.5px solid #bfdbfe; border-radius: 12px; font-size: 14px; font-weight: 600; color: ${ACCENT}; font-family: inherit; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .category-pill:hover { border-color: #93c5fd; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12); transform: translateY(-1px); }
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

        /* ── Leaflet Map ── */
        .leaflet-container { border-radius: 12px; border: 1.5px solid ${BORDER}; width: 100%; height: 200px; z-index: 1; }

        @media (max-width: 900px) {
          .form-layout { grid-template-columns: 1fr; }
          .listing-container { padding: 20px 20px 48px; }
          .form-card { padding: 24px; border-radius: 16px; }
          .listing-title { font-size: 22px; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
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

          <div className="category-wrap">
            <label className="category-label">Category</label>
            <button type="button" className="category-pill" onClick={() => router.push("/seller/dashboard")}>
              <FiHome size={16} />
              Real Estate
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: "6px" }}>Change</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-layout">
            <div className="form-card">
              <div className="section-header">
                <div className="section-icon blue">
                  <FiFileText size={18} color="#fff" />
                </div>
                <div className="section-title-wrap">
                  <h2>Basic Information</h2>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Property Title<span className="required">*</span></label>
                  <input type="text" className="form-input" placeholder="e.g. 2 BHK Apartment for Rent in Kalanki" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Description<span className="required">*</span></label>
                  <textarea className="form-textarea" placeholder="Describe your property..." value={description} maxLength={descMax} onChange={(e) => setDescription(e.target.value)} required />
                  <div className={`char-counter ${descLength > descMax * 0.9 ? "near-limit" : ""}`}>{descLength}/{descMax}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="form-card" style={{ marginBottom: "24px" }}>
                <div className="section-header">
                  <div className="section-icon green">
                    <FiHome size={18} color="#fff" />
                  </div>
                  <div className="section-title-wrap">
                    <h2>Property Details</h2>
                  </div>
                </div>
                <div className="form-row">
                  <CustomDropdown
                    label="Property Type"
                    value={propertyType}
                    options={propertyTypes}
                    onChange={setPropertyType}
                    required
                  />
                  <CustomDropdown
                    label="Listing Type"
                    value={listingType}
                    options={listingTypes}
                    onChange={setListingType}
                    required
                  />
                </div>
              </div>

              <div className="form-card">
                <div className="section-header">
                  <div className="section-icon purple">
                    <FiMapPin size={18} color="#fff" />
                  </div>
                  <div className="section-title-wrap">
                    <h2>Location</h2>
                  </div>
                </div>
                <div className="form-row">
                  <CustomDropdown
                    label="City"
                    value={city}
                    options={cities}
                    onChange={handleCityChange}
                    required
                  />
                  <CustomDropdown
                    label="Area"
                    value={area}
                    options={areas[city] || []}
                    onChange={setArea}
                    required
                  />
                </div>
                <div className="form-row">
                  <CustomDropdown
                    label="Ward"
                    value={ward}
                    options={wards}
                    onChange={setWard}
                    required
                  />
                  <div className="form-group">
                    <label className="form-label">Address (Optional)</label>
                    <input type="text" className="form-input" placeholder="Kalanki, Kathmandu, Nepal" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Latitude (Optional)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="form-input"
                      placeholder="27.7172"
                      value={latitude}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Only allow digits, decimal point, and minus sign
                        if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                          setLatitude(val);
                        }
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Longitude (Optional)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="form-input"
                      placeholder="85.3240"
                      value={longitude}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                          setLongitude(val);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label className="form-label">Map Location</label>
                    <MapSection center={[currentLat, currentLng]} area={area} city={city} />
                  </div>
                </div>
              </div>
            </div>

            <div className="submit-wrap" style={{ gridColumn: "1 / -1" }}>
              <button type="button" className="back-link" onClick={() => router.back()}>
                <FiArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="submit-btn">
                Save & Continue <FiChevronRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}