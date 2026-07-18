"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronRight,
  FiMapPin,
  FiFileText,
  FiSun,
  FiCheck,
  FiImage,
  FiEye,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDraft } from "./layout";

const ACCENT = "#2563eb";
const DANGER = "#dc2626";
const SUCCESS = "#16a34a";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";
const SITE_PRIMARY = "#C0392B";

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Details", icon: FiSun, status: "active" as const },
  { label: "Photos", icon: FiImage, status: "upcoming" as const },
  { label: "Preview", icon: FiEye, status: "upcoming" as const },
];

const listingTypes = [
  { value: "produce", label: "Produce" },
  { value: "fertilizer", label: "Fertilizer" },
  { value: "livestock", label: "LiveStock" },
  { value: "vet_service", label: "Vet Service" },
  { value: "tool", label: "Tool" },
  { value: "farm_labour", label: "Farm Labour" },
  { value: "seed", label: "Seed" },
];

const districts = ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Chitwan", "Kaski", "Jhapa"];
const villages = ["Budhanilkanta", "Baneshwor", "Lazimpat", "Thamel", "Patan", "Bharatpur", "Lakeside"];
const locations = ["Budhanilkanta, Kathmandu", "Baneshwor, Kathmandu", "Lakeside, Pokhara", "Bharatpur, Chitwan"];
const units = ["KG", "Piece", "Litre", "Dozen", "Quintal", "Ton", "Bag", "Box"];
const seasonalOptions = ["January - March", "March - June", "June - September", "September - December", "Year Round"];
const breeds = ["Jersey", "Holstein Friesian", "Sahiwal", "Murrah", "Local", "Crossbreed", "Other"];
const healthStatuses = ["VACCINATED", "Not Vaccinated", "Partially Vaccinated", "Under Treatment"];
const ages = ["Less than 1 Year", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"];

export default function NewAgricultureListingPage() {
  const router = useRouter();
  const { agricultureData, setAgricultureData } = useDraft();

  const [listingType, setListingType] = useState(agricultureData.listingType);
  const [district, setDistrict] = useState(agricultureData.district);
  const [village, setVillage] = useState(agricultureData.village);
  const [location, setLocation] = useState(agricultureData.location);
  const [price, setPrice] = useState(agricultureData.price);
  const [unit, setUnit] = useState(agricultureData.unit);
  const [organicCertified, setOrganicCertified] = useState(agricultureData.organicCertified);
  const [organicVerified] = useState(agricultureData.organicVerified);
  const [seasonalAvailability, setSeasonalAvailability] = useState(agricultureData.seasonalAvailability);
  const [animalType, setAnimalType] = useState(agricultureData.animalType);
  const [age, setAge] = useState(agricultureData.age);
  const [breed, setBreed] = useState(agricultureData.breed);
  const [healthStatus, setHealthStatus] = useState(agricultureData.healthStatus);

  const formattedPrice = useMemo(() => {
    if (!price) return "";
    const num = Number(price.replace(/,/g, ""));
    if (isNaN(num)) return price;
    return num.toLocaleString("en-IN");
  }, [price]);

  const handlePriceChange = (val: string) => {
    setPrice(val.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAgricultureData({
      ...agricultureData,
      listingType, district, village, location, price, unit,
      organicCertified, organicVerified, seasonalAvailability,
      animalType, age, breed, healthStatus,
    });
    toast.success("Details saved! Now add photos.");
    router.push("/seller/listing/agriculture-livestock/photos");
  };
  function getStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .listing-page { min-height: 100vh; background: ${BG}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .listing-container { max-width: 100%; margin: 0 auto; padding: 32px 40px 64px; }

    /* Header */
    .listing-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .back-btn { width: 40px; height: 40px; border-radius: 12px; border: 1.5px solid ${BORDER}; background: ${CARD_BG}; display: flex; align-items: center; justify-content: center; cursor: pointer; color: ${TEXT_PRIMARY}; transition: all 0.25s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.04); flex-shrink: 0; }
    .back-btn:hover { border-color: #cbd5e1; background: #f1f5f9; transform: translateX(-2px); }
    .back-btn:active { transform: translateX(0) scale(0.96); }
    .listing-header-text { flex: 1; min-width: 0; }
    .listing-title { font-size: 26px; font-weight: 800; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px; line-height: 1.2; }
    .listing-subtitle { font-size: 13.5px; color: ${TEXT_SECONDARY}; margin-top: 3px; }
    .draft-badge { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${SUCCESS}; flex-shrink: 0; }

    /* Stepper */
    .stepper { display: flex; align-items: center; background: ${CARD_BG}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 18px 22px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); overflow-x: auto; }
    .step { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    .step-icon-wrap { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; transition: all 0.25s ease; }
    .step.done .step-icon-wrap { background: ${SUCCESS}; color: #fff; }
    .step.active .step-icon-wrap { background: linear-gradient(135deg, ${SITE_PRIMARY}, #e0574a); color: #fff; box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.15); }
    .step.upcoming .step-icon-wrap { background: #f1f5f9; color: ${TEXT_MUTED}; border: 1.5px solid ${BORDER}; }
    .step-label { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
    .step.done .step-label { color: ${SUCCESS}; }
    .step.active .step-label { color: ${SITE_PRIMARY}; }
    .step.upcoming .step-label { color: ${TEXT_MUTED}; }
    .step-connector { flex: 1; height: 2px; background: #e2e8f0; margin: 0 14px; min-width: 24px; position: relative; }
    .step-connector.filled { background: ${SUCCESS}; }

    /* Category */
    .category-wrap { margin-bottom: 20px; }
    .category-label { font-size: 13px; font-weight: 600; color: ${TEXT_PRIMARY}; margin-bottom: 8px; display: block; }
    .category-pill { display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px; background: ${CARD_BG}; border: 1.5px solid ${BORDER}; border-radius: 10px; font-size: 14px; font-weight: 500; color: ${TEXT_PRIMARY}; font-family: inherit; cursor: pointer; transition: all 0.2s ease; }
    .category-pill:hover { border-color: #cbd5e1; background: #f8fafc; }
    .change-badge { font-size: 12px; font-weight: 500; color: #7c3aed; background: #ede9fe; padding: 3px 10px; border-radius: 6px; margin-left: 4px; }

    /* Form Card */
    .form-card { background: ${CARD_BG}; border-radius: 16px; padding: 24px; border: 1px solid ${BORDER}; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }

    /* Two Column - THIS IS THE KEY FIX */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; position: relative; }
    .two-col::before { content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, transparent, ${BORDER}, transparent); transform: translateX(-50%); }
    .col-left, .col-right { display: flex; flex-direction: column; gap: 8px; min-width: 0; }

    /* Section Header */
    .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .section-header h2 { font-size: 16px; font-weight: 700; color: ${ACCENT}; letter-spacing: -0.2px; }
    .section-header p { font-size: 12px; color: ${TEXT_MUTED}; margin-top: 2px; margin-left: 42px; }
    .section-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .section-icon.green { background: linear-gradient(135deg, #10b981, #059669); }
    .section-icon.orange { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .section-icon.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

    /* Form Elements */
    .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 12px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-size: 14px; font-weight: 500; color: #334155; display: flex; align-items: center; gap: 3px; }
    .form-label .required { color: ${DANGER}; font-weight: 600; }
    .form-input, .form-select { padding: 12px 16px; border: 1.5px solid ${BORDER}; border-radius: 12px; font-size: 15px; color: ${TEXT_PRIMARY}; background: ${CARD_BG}; font-family: inherit; transition: all 0.2s ease; width: 100%; outline: none; }
    .form-input:hover, .form-select:hover { border-color: #cbd5e1; }
    .form-input:focus, .form-select:focus { border-color: ${ACCENT}; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08); }
    .form-input::placeholder { color: #a1a8b5; font-weight: 400; }
    .form-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }

    /* Radio */
    .radio-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .radio-label { display: flex; align-items: center; gap: 10px; font-size: 15px; color: #334155; cursor: pointer; font-weight: 500; padding: 4px 0; }
    .radio-input { width: 18px; height: 18px; accent-color: ${SITE_PRIMARY}; cursor: pointer; flex-shrink: 0; }
    .radio-text { line-height: 1.3; }

    /* Checkbox */
    .checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 15px; color: #334155; cursor: pointer; font-weight: 500; padding: 4px 0; }
    .checkbox-label.disabled { opacity: 0.5; cursor: not-allowed; }
    .checkbox-input { width: 18px; height: 18px; accent-color: ${SITE_PRIMARY}; cursor: pointer; flex-shrink: 0; }
    .checkbox-label.disabled .checkbox-input { cursor: not-allowed; }
    .checkbox-text { line-height: 1.3; }

    /* Submit */
    .submit-wrap { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; gap: 16px; }
    .back-link { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 15px; font-weight: 600; color: ${ACCENT}; background: ${CARD_BG}; border: 1.5px solid ${BORDER}; border-radius: 12px; padding: 14px 28px; cursor: pointer; transition: all 0.25s ease; font-family: inherit; max-width: 220px; }
    .back-link:hover { border-color: ${ACCENT}; background: #eff6ff; }
    .submit-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, ${SITE_PRIMARY}, #e0574a); color: #fff; font-size: 15px; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; transition: all 0.25s ease; font-family: inherit; max-width: 220px; box-shadow: 0 4px 14px rgba(192, 57, 43, 0.25); }
    .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(192, 57, 43, 0.35); }
    .submit-btn:active { transform: translateY(0); }

    @media (max-width: 768px) {
      .listing-container { padding: 20px 20px 48px; }
      .listing-title { font-size: 22px; }
      .stepper { padding: 14px 16px; }
      .step-label { display: none; }
      .step-connector { margin: 0 6px; min-width: 16px; }
      .two-col { grid-template-columns: 1fr; }
      .two-col::before { display: none; }
      .form-card { padding: 20px; }
      .form-row { grid-template-columns: 1fr; }
      .radio-group { grid-template-columns: 1fr 1fr; }
      .submit-wrap { flex-direction: column-reverse; }
      .back-link, .submit-btn { width: 100%; max-width: none; }
    }

    @media (max-width: 480px) {
      .listing-container { padding: 16px 16px 40px; }
      .form-card { padding: 16px; border-radius: 12px; }
      .radio-group { grid-template-columns: 1fr; }
    }
  `;
}

  return (
    
    <>
    
      <ToastContainer position="top-right" autoClose={3000} />
      <style dangerouslySetInnerHTML={{ __html: getStyles() }} />

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
                <div className={"step " + step.status}>
                  <div className="step-icon-wrap">
                    {step.status === "done" ? <FiCheck size={14} /> : <step.icon size={14} />}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={"step-connector " + (step.status === "done" ? "filled" : "")} />
                )}
              </div>
            ))}
          </div>

          {/* Category */}
          <div className="category-wrap">
            <label className="category-label">Category</label>
            <button type="button" className="category-pill" onClick={() => router.push("/seller/dashboard")}>
              <span>Agriculture And Livestock</span>
              <span className="change-badge">Change</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Card 1: Listing Type + Location + Pricing */}
            <div className="form-card">
              <div className="two-col">
                {/* Left: Listing Type */}
                <div className="col-left">
                  <div className="section-header">
                    <h2>Listing Type</h2>
                    <p>Select what you are listing</p>
                  </div>
                  <div className="radio-group">
                    {listingTypes.map((type) => (
                      <label key={type.value} className="radio-label">
                        <input
                          type="radio"
                          className="radio-input"
                          name="listingType"
                          value={type.value}
                          checked={listingType === type.value}
                          onChange={(e) => setListingType(e.target.value)}
                        />
                        <span className="radio-text">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Right: Location + Pricing */}
                <div className="col-right">
                  <div className="section-header">
                    <div className="section-icon green">
                      <FiMapPin size={16} color="#fff" />
                    </div>
                    <h2>Location Information</h2>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">District<span className="required">*</span></label>
                      <select className="form-select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                        {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Village<span className="required">*</span></label>
                      <select className="form-select" value={village} onChange={(e) => setVillage(e.target.value)}>
                        <option value="">eg. Budhanilkanta</option>
                        {villages.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: "16px" }}>
                    <label className="form-label">Location /Area<span className="required">*</span></label>
                    <select className="form-select" value={location} onChange={(e) => setLocation(e.target.value)}>
                      <option value="">Budhanilkanta, Kathmandu</option>
                      {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div className="section-header">
                    <div className="section-icon orange">
                      <FiFileText size={16} color="#fff" />
                    </div>
                    <h2>Pricing Information</h2>
                  </div>

                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <div className="form-group">
                      <label className="form-label">Price per Unit<span className="required">*</span></label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-input"
                        placeholder="120"
                        value={formattedPrice}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unit<span className="required">*</span></label>
                      <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                        {units.map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Product / Animal Details */}
            <div className="form-card" style={{ marginTop: "16px" }}>
              <div className="two-col">
                <div className="col-left">
                  <div className="section-header">
                    <div className="section-icon purple">
                      <FiSun size={16} color="#fff" />
                    </div>
                    <h2>Product /Animal Details</h2>
                  </div>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" checked={organicCertified} onChange={(e) => setOrganicCertified(e.target.checked)} />
                    <span className="checkbox-text">Organic Certified</span>
                  </label>
                  <label className="checkbox-label disabled">
                    <input type="checkbox" className="checkbox-input" checked={organicVerified} readOnly />
                    <span className="checkbox-text">Organic Verified</span>
                  </label>
                  <div className="form-group" style={{ marginTop: "8px" }}>
                    <label className="form-label">Seasonal Availability(Optional)<span className="required">*</span></label>
                    <select className="form-select" value={seasonalAvailability} onChange={(e) => setSeasonalAvailability(e.target.value)}>
                      {seasonalOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-right" style={{ paddingTop: "48px" }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Animal Type(Optional)<span className="required">*</span></label>
                      <select className="form-select" value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
                        <option value="">e.g. Cow, Goat, Chicken</option>
                        <option value="cow">Cow</option>
                        <option value="goat">Goat</option>
                        <option value="chicken">Chicken</option>
                        <option value="buffalo">Buffalo</option>
                        <option value="pig">Pig</option>
                        <option value="sheep">Sheep</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Age(Optional)<span className="required">*</span></label>
                      <select className="form-select" value={age} onChange={(e) => setAge(e.target.value)}>
                        {ages.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <div className="form-group">
                      <label className="form-label">Breed(Optional)<span className="required">*</span></label>
                      <select className="form-select" value={breed} onChange={(e) => setBreed(e.target.value)}>
                        {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Health / Vaccine Status(Optional)<span className="required">*</span></label>
                      <select className="form-select" value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)}>
                        {healthStatuses.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="submit-wrap">
              <button type="button" className="back-link" onClick={() => router.back()}>
                Back
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

