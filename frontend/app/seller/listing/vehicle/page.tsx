"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiChevronRight, FiChevronDown, FiMapPin, FiFileText, FiTruck } from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const ACCENT_LIGHT = "#eff6ff";
const DANGER = "#dc2626";
const BORDER = "#e2e8f0";
const BORDER_FOCUS = "#bfdbfe";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";

interface VehicleData {
  vehicleType: string;
  brand: string;
  modelYear: string;
  kmDriven: string;
  condition: string;
  bluebookStatus: string;
  fuelType: string;
  ownershipTransfer: boolean;
  address: string;
}

export default function NewListingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [vehicleData, setVehicleData] = useState<VehicleData>({
    vehicleType: "car",
    brand: "Toyota",
    modelYear: "2021",
    kmDriven: "",
    condition: "used",
    bluebookStatus: "verified",
    fuelType: "petrol",
    ownershipTransfer: true,
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!vehicleData.kmDriven || !vehicleData.address) {
      toast.error("Please fill all vehicle details");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Details saved! Now add photos.");
    setIsSubmitting(false);
    router.push("/seller/listing/vehicle/photos");
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
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 24px 64px;
        }

        /* ── Header ── */
        .listing-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 6px;
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
        }

        .back-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
          transform: translateX(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .back-btn:active {
          transform: translateX(0) scale(0.96);
        }

        .listing-title {
          font-size: 28px;
          font-weight: 800;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        /* ── Breadcrumb ── */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
          margin-left: 56px;
          font-size: 13px;
          color: ${TEXT_MUTED};
          font-weight: 500;
        }

        .breadcrumb span {
          color: ${TEXT_MUTED};
          transition: color 0.2s;
        }

        .breadcrumb .active {
          color: ${TEXT_PRIMARY};
          font-weight: 600;
        }

        .breadcrumb svg {
          color: #cbd5e1;
          flex-shrink: 0;
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

        /* ── Section Header ── */
        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
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

        .section-icon.blue {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .section-icon.green {
          background: linear-gradient(135deg, #10b981, #059669);
        }

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
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .form-label .required {
          color: ${DANGER};
          font-weight: 700;
        }

        /* ── Inputs ── */
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

        .form-input:hover,
        .form-select:hover,
        .form-textarea:hover {
          border-color: #cbd5e1;
          background: #fafafa;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: ${ACCENT};
          background: ${CARD_BG};
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #a1a8b5;
          font-weight: 400;
        }

        .form-textarea {
          min-height: 42px;
          resize: vertical;
          line-height: 1.5;
        }

        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 38px;
        }

        /* ── Category ── */
        .category-wrap {
          margin-bottom: 32px;
        }

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
          background: linear-gradient(135deg, ${ACCENT_LIGHT}, #dbeafe);
          border: 1.5px solid ${BORDER_FOCUS};
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #1d4ed8;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        .category-pill:hover {
          border-color: #93c5fd;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
          transform: translateY(-1px);
        }

        .category-pill:active {
          transform: translateY(0);
        }

        .category-pill svg {
          transition: transform 0.2s;
        }

        .category-pill:hover svg {
          transform: rotate(180deg);
        }

        /* ── Divider ── */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, ${BORDER}, transparent);
          margin: 32px 0;
        }

        /* ── Radio Group ── */
        .radio-group {
          display: flex;
          gap: 24px;
          align-items: center;
          padding-top: 6px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #334155;
          cursor: pointer;
          font-weight: 500;
          padding: 4px 0;
          transition: color 0.2s;
        }

        .radio-label:hover {
          color: ${ACCENT};
        }

        .radio-input {
          width: 18px;
          height: 18px;
          accent-color: ${ACCENT};
          cursor: pointer;
          flex-shrink: 0;
        }

        /* ── Address Input ── */
        .address-wrap {
          position: relative;
        }

        .address-wrap .form-input {
          padding-right: 42px;
        }

        .address-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          transition: color 0.2s;
        }

        .address-wrap:focus-within .address-icon {
          color: ${ACCENT};
        }

        /* ── Submit Button ── */
        .submit-wrap {
          display: flex;
          justify-content: center;
          margin-top: 36px;
          padding-top: 8px;
        }

        .submit-btn {
          padding: 14px 56px;
          background: linear-gradient(135deg, #3b82f6, ${ACCENT});
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
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #2563eb, ${ACCENT_HOVER});
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
          .listing-container { padding: 24px 20px 48px; }
          .form-card { padding: 28px; border-radius: 16px; }
          .form-row { grid-template-columns: 1fr; gap: 18px; }
          .listing-title { font-size: 24px; }
          .breadcrumb { margin-left: 0; margin-top: 8px; }
          .listing-header { flex-wrap: wrap; }
        }

        @media (max-width: 480px) {
          .listing-container { padding: 20px 16px 40px; }
          .form-card { padding: 24px; border-radius: 14px; }
          .submit-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="listing-page">
        <div className="listing-container">
          <div className="listing-header">
            <button type="button" className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={18} />
            </button>
            <h1 className="listing-title">New Listing</h1>
          </div>
          <div className="breadcrumb">
            <span>Select Category</span>
            <FiChevronRight size={14} />
            <span className="active">Create Listing</span>
          </div>

          <form onSubmit={handleSubmit} className="form-card">
            {/* Section: Basic Information */}
            <div className="section-header">
              <div className="section-icon blue">
                <FiFileText size={18} color="#fff" />
              </div>
              <div className="section-title-wrap">
                <h2>Basic Information</h2>
                <p>Start with the essentials</p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title<span className="required">*</span></label>
                <input type="text" className="form-input" placeholder="e.g. Toyota Corolla 2021" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Price (NPR)<span className="required">*</span></label>
                <input type="number" className="form-input" placeholder="2,500,000" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description<span className="required">*</span></label>
                <textarea className="form-textarea" placeholder="Describe your vehicle..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
            </div>

            <div className="category-wrap">
              <label className="category-label">Category</label>
              <div className="category-pill">
                <FiFileText size={16} />
                Vehicle
                <FiChevronDown size={14} />
              </div>
            </div>

            <div className="divider" />

            {/* Section: Vehicle Details */}
            <div className="section-header">
              <div className="section-icon green">
                <FiTruck size={18} color="#fff" />
              </div>
              <div className="section-title-wrap">
                <h2>Vehicle Details</h2>
                <p>Specify your vehicle's specifications</p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Vehicle Type<span className="required">*</span></label>
                <select className="form-select" value={vehicleData.vehicleType} onChange={(e) => setVehicleData({ ...vehicleData, vehicleType: e.target.value })}>
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="scooter">Scooter</option>
                  <option value="truck">Truck</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand<span className="required">*</span></label>
                <select className="form-select" value={vehicleData.brand} onChange={(e) => setVehicleData({ ...vehicleData, brand: e.target.value })}>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Ford">Ford</option>
                  <option value="BMW">BMW</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Model Year<span className="required">*</span></label>
                <select className="form-select" value={vehicleData.modelYear} onChange={(e) => setVehicleData({ ...vehicleData, modelYear: e.target.value })}>
                  {Array.from({ length: 25 }, (_, i) => 2025 - i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">KM Driven<span className="required">*</span></label>
                <input type="number" className="form-input" placeholder="35,000" value={vehicleData.kmDriven} onChange={(e) => setVehicleData({ ...vehicleData, kmDriven: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Condition<span className="required">*</span></label>
                <select className="form-select" value={vehicleData.condition} onChange={(e) => setVehicleData({ ...vehicleData, condition: e.target.value })}>
                  <option value="used">Used</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bluebook Status<span className="required">*</span></label>
                <select className="form-select" value={vehicleData.bluebookStatus} onChange={(e) => setVehicleData({ ...vehicleData, bluebookStatus: e.target.value })}>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="not-available">Not Available</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fuel Type<span className="required">*</span></label>
                <select className="form-select" value={vehicleData.fuelType} onChange={(e) => setVehicleData({ ...vehicleData, fuelType: e.target.value })}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Ownership Transfer Ready<span className="required">*</span></label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" className="radio-input" checked={vehicleData.ownershipTransfer} onChange={() => setVehicleData({ ...vehicleData, ownershipTransfer: true })} /> Yes
                  </label>
                  <label className="radio-label">
                    <input type="radio" className="radio-input" checked={!vehicleData.ownershipTransfer} onChange={() => setVehicleData({ ...vehicleData, ownershipTransfer: false })} /> No
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address / Location<span className="required">*</span></label>
                <div className="address-wrap">
                  <input type="text" className="form-input" placeholder="Kathmandu, Nepal" value={vehicleData.address} onChange={(e) => setVehicleData({ ...vehicleData, address: e.target.value })} />
                  <FiMapPin size={16} className="address-icon" />
                </div>
              </div>
            </div>

            <div className="submit-wrap">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}