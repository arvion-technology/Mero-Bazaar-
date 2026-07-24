"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft, FiChevronRight, FiChevronDown, FiMapPin, FiFileText,
  FiBriefcase, FiImage, FiEye, FiCheck, FiX, FiPlus, FiBox, FiCalendar,
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
const BORDER_FOCUS = "#bfdbfe";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";
const SITE_PRIMARY = "#C0392B";

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Photos", icon: FiImage, status: "active" as const },
  { label: "Preview", icon: FiEye, status: "upcoming" as const },
];

const listingTypes = ["Furniture", "Appliance", "Clothing", "Books", "Baby", "Sports", "Instruments"];
const conditions = ["Like New", "Good", "Fair", "Poor"];

export default function NewSecondHandListingPage() {
  const router = useRouter();
  const [status] = useState("Active");
  const { data, setData } = useDraft();
  const isBaby = data.listingType === "Baby";

  const {
    listingType, itemName, condition, price, negotiable, description,
    brand, quantity, gender, availability, location, color, material,
    weight, deliveryOption, deliveryCharge, city, expiresAt,
  } = data;

  const descMax = 500;
  const descLength = description.length;

  const setListingType = (v: string) => setData({ ...data, listingType: v });
  const setItemName = (v: string) => setData({ ...data, itemName: v });
  const setCondition = (v: string) => setData({ ...data, condition: v });
  const setNegotiable = (v: boolean) => setData({ ...data, negotiable: v });
  const setDescription = (v: string) => setData({ ...data, description: v });
  const setBrand = (v: string) => setData({ ...data, brand: v });
  const setQuantity = (v: string) => setData({ ...data, quantity: v });
  const setGender = (v: string) => setData({ ...data, gender: v });
  const setAvailability = (v: string) => setData({ ...data, availability: v });
  const setLocation = (v: string) => setData({ ...data, location: v });
  const setColor = (v: string) => setData({ ...data, color: v });
  const setMaterial = (v: string) => setData({ ...data, material: v });
  const setWeight = (v: string) => setData({ ...data, weight: v });
  const setDeliveryOption = (v: string) => setData({ ...data, deliveryOption: v });
  const setDeliveryCharge = (v: string) => setData({ ...data, deliveryCharge: v });
  const setCity = (v: string) => setData({ ...data, city: v });
  const setExpiresAt = (v: string) => setData({ ...data, expiresAt: v });

  const formattedPrice = useMemo(() => {
    if (!data.price) return "";
    const num = Number(data.price.replace(/,/g, ""));
    return isNaN(num) ? data.price : num.toLocaleString("en-IN");
  }, [data.price]);

  const handlePriceChange = (val: string) => {
    setData({ ...data, price: val.replace(/[^0-9]/g, "") });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.itemName || !data.condition || !data.price || !data.description) {
      toast.error("Please fill all required fields");
      return;
    }
    if (isBaby ? !data.location : !data.city || !data.expiresAt) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Details saved! Now add photos.");
    router.push("/seller/listing/secondhand-goods/photos");
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

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, ${BORDER}, transparent);
          margin: 28px 0;
        }

        .two-col-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 40px;
        }

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

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .radio-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1.5px solid transparent;
        }

        .radio-item:hover {
          background: #f8fafc;
        }

        .radio-item.active {
          background: linear-gradient(135deg, #fff5f5, #fde2df);
          border-color: #f5c6c1;
        }

        .radio-item input[type="radio"] {
          display: none;
        }

        .radio-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .radio-item.active .radio-circle {
          border-color: ${SITE_PRIMARY};
          background: ${SITE_PRIMARY};
        }

        .radio-item.active .radio-circle::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
        }

        .radio-label {
          font-size: 14px;
          font-weight: 500;
          color: ${TEXT_PRIMARY};
        }

        .radio-item.active .radio-label {
          color: ${SITE_PRIMARY};
          font-weight: 600;
        }

        .form-row {
          display: grid;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-row.two-col {
          grid-template-columns: 1fr 1fr;
        }

        .form-row.three-col {
          grid-template-columns: 1fr 1fr 1fr;
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
        .form-label .optional { color: ${TEXT_MUTED}; font-weight: 500; font-size: 12px; }

        .form-input,
        .form-select,
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

        .form-input:hover, .form-select:hover, .form-textarea:hover {
          border-color: #cbd5e1;
          background: #fafafa;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: ${ACCENT};
          background: ${CARD_BG};
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: #a1a8b5;
          font-weight: 400;
        }

        .select-wrap {
          position: relative;
        }

        .form-select {
          cursor: pointer;
          appearance: none;
          padding-right: 38px;
        }

        .select-chevron {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: ${TEXT_MUTED};
          pointer-events: none;
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

        .checkbox-inline {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #334155;
          cursor: pointer;
          font-weight: 500;
          padding: 10px 0;
        }

        .checkbox-inline input[type="checkbox"] {
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

        .checkbox-inline input[type="checkbox"]:checked + .check-box {
          background: ${ACCENT};
        }

        .checkbox-inline input[type="checkbox"]:checked + .check-box::after {
          content: '';
          width: 5px;
          height: 9px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
          margin-top: -2px;
        }

        .date-input-wrap {
          position: relative;
        }

        .date-input-wrap .form-input {
          padding-right: 42px;
        }

        .date-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: ${TEXT_MUTED};
          pointer-events: none;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
          padding: 10px 0;
        }

        .delivery-group {
          display: flex;
          gap: 24px;
          padding: 10px 0;
        }

        .delivery-option {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          color: ${TEXT_PRIMARY};
          font-weight: 500;
        }

        .delivery-option input[type="radio"] {
          display: none;
        }

        .delivery-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .delivery-option input[type="radio"]:checked + .delivery-circle {
          border-color: ${SITE_PRIMARY};
          background: ${SITE_PRIMARY};
        }

        .delivery-option input[type="radio"]:checked + .delivery-circle::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
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

        @media (max-width: 768px) {
          .listing-container { padding: 20px 20px 48px; }
          .form-card { padding: 28px; border-radius: 16px; }
          .two-col-layout { grid-template-columns: 1fr; gap: 32px; }
          .listing-title { font-size: 22px; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
          .form-row.two-col, .form-row.three-col { grid-template-columns: 1fr; }
          .submit-wrap { flex-direction: column-reverse; }
          .back-link, .submit-btn { width: 100%; justify-content: center; }
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
            {/* Category Pill */}
            <div className="category-wrap">
              <label className="category-label">Category</label>
              <button type="button" className="category-pill" onClick={() => router.push("/seller/dashboard")}>
                <FiBox size={16} />
                SecondHandGoods
                <span className="change-badge">Change</span>
              </button>
            </div>

            <div className="divider" />

            {/* Two Column Layout */}
            <div className="two-col-layout">
              {/* Left: Listing Type */}
              <div className="left-col">
                <div className="section-header">
                  <div className="section-icon red">
                    <FiBox size={18} color="#fff" />
                  </div>
                  <div className="section-title-wrap">
                    <h2>Listing Type</h2>
                    <p>Select what you are listing</p>
                  </div>
                </div>

                <div className="radio-group">
                  {listingTypes.map((type) => (
                    <label
                      key={type}
                      className={`radio-item ${listingType === type ? "active" : ""}`}
                      onClick={() => setListingType(type)}
                    >
                      <input
                        type="radio"
                        name="listingType"
                        value={type}
                        checked={listingType === type}
                        onChange={() => setListingType(type)}
                      />
                      <span className="radio-circle"></span>
                      <span className="radio-label">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Right: Dynamic Details */}
              <div className="right-col">
                <div className="section-header">
                  <div className="section-icon blue">
                    <FiFileText size={18} color="#fff" />
                  </div>
                  <div className="section-title-wrap">
                    <h2>{listingType} Details</h2>
                  </div>
                </div>

                {/* Row 1: Item Name | Condition | Brand (Baby only) */}
                <div className={`form-row ${isBaby ? "three-col" : "two-col"}`}>
                  <div className="form-group">
                    <label className="form-label">Item Name <span className="required">*</span></label>
                    <input type="text" className="form-input" placeholder="Enter item name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Condition <span className="required">*</span></label>
                    <div className="select-wrap">
                      <select className="form-select" value={condition} onChange={(e) => setCondition(e.target.value)} required>
                        <option value="">Select condition</option>
                        {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <FiChevronDown size={16} className="select-chevron" />
                    </div>
                  </div>
                  {isBaby && (
                    <div className="form-group">
                      <label className="form-label">Brand <span className="optional">(Optional)</span></label>
                      <input type="text" className="form-input" placeholder="e.g. BabyHug" value={brand} onChange={(e) => setBrand(e.target.value)} />
                    </div>
                  )}
                </div>

                {/* Row 2: Baby-specific (Quantity | Gender | Availability) */}
                {isBaby && (
                  <div className="form-row three-col">
                    <div className="form-group">
                      <label className="form-label">Quantity <span className="required">*</span></label>
                      <input type="number" className="form-input" placeholder="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender <span className="required">*</span></label>
                      <div className="select-wrap">
                        <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
                          <option value="Unisex">Unisex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        <FiChevronDown size={16} className="select-chevron" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Availability <span className="optional">(Optional)</span></label>
                      <div className="select-wrap">
                        <select className="form-select" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                          <option value="In Stock">In Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                          <option value="Pre-Order">Pre-Order</option>
                        </select>
                        <FiChevronDown size={16} className="select-chevron" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Row 3: Price | Negotiable | Location */}
                <div className={`form-row ${isBaby ? "three-col" : "two-col"}`}>
                  <div className="form-group">
                    <label className="form-label">Price(NPR) <span className="required">*</span></label>
                    <input type="text" inputMode="numeric" className="form-input" placeholder="Enter price" value={formattedPrice} onChange={(e) => handlePriceChange(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ minWidth: "140px" }}>
                    <label className="form-label" style={{ opacity: 0 }}>Negotiable</label>
                    <label className="checkbox-inline">
                      <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} />
                      <span className="check-box"></span>
                      <span>Yes, negotiable</span>
                    </label>
                  </div>
                  {isBaby ? (
                    <div className="form-group">
                      <label className="form-label">Address<span className="required">*</span></label>
                      <input
                        type="text"
                        list="area-suggestions"
                        className="form-input"
                        placeholder="Kathmandu"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">City <span className="required">*</span></label>
                      <input
                        type="text"
                        list="city-suggestions"
                        className="form-input"
                        placeholder="e.g. Kathmandu"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="form-group full-width">
                  <label className="form-label">Description <span className="optional">(Optional)</span> <span className="required">*</span></label>
                  <textarea className="form-textarea" placeholder="Describe your item..." value={description} maxLength={descMax} onChange={(e) => setDescription(e.target.value)} required />
                  <div className={`char-counter ${descLength > descMax * 0.9 ? "near-limit" : ""}`}>{descLength}/{descMax}</div>
                </div>

                {/* Row 4: Baby Color | Material | Weight */}
                {isBaby && (
                  <div className="form-row three-col">
                    <div className="form-group">
                      <label className="form-label">Color <span className="optional">(Optional)</span></label>
                      <input type="text" className="form-input" placeholder="e.g. Grey" value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Material <span className="optional">(Optional)</span></label>
                      <input type="text" className="form-input" placeholder="e.g. Aluminum, Fabric" value={material} onChange={(e) => setMaterial(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Weight(kg) <span className="optional">(Optional)</span></label>
                      <input type="text" className="form-input" placeholder="e.g. 5.2" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                  </div>
                )}

                {/* Row 5: Baby Delivery Option & Charge */}
                {isBaby && (
                  <div className="form-row two-col">
                    <div className="form-group">
                      <label className="form-label">Delivery Option</label>
                      <div className="delivery-group">
                        {["Buyer Pickup", "Home Delivery"].map((opt) => (
                          <label key={opt} className="delivery-option">
                            <input type="radio" name="deliveryOption" value={opt} checked={deliveryOption === opt} onChange={() => setDeliveryOption(opt)} />
                            <span className="delivery-circle"></span>
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Delivery Charge(NPR) <span className="required">*</span></label>
                      <div className="select-wrap">
                        <select className="form-select" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} required>
                          <option value="0">Free</option>
                          <option value="100">100</option>
                          <option value="200">200</option>
                          <option value="300">300</option>
                          <option value="500">500</option>
                        </select>
                        <FiChevronDown size={16} className="select-chevron" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Expires At & Status (non-Baby only) */}
                {!isBaby && (
                  <div className="form-row two-col">
                    <div className="form-group">
                      <label className="form-label">Expires At <span className="required">*</span></label>
                      <div className="date-input-wrap">
                        <input type="text" className="form-input" placeholder="DD/MM/YYYY" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} required />
                        <FiCalendar size={18} className="date-icon" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <span className="status-badge">{status}</span>
                    </div>
                  </div>
                )}
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