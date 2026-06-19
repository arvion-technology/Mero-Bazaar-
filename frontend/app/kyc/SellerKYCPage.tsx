"use client";

import { useState, useRef } from "react";
import { FiUser, FiCalendar, FiPhone, FiMapPin, FiUpload, FiCreditCard } from "react-icons/fi";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";

export default function SellerKYCPage() {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    contactNumber: "",
    address: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  });

  const [panCard, setPanCard] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [panCardPreview, setPanCardPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (field: "panCard" | "photo") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (field === "panCard") {
      setPanCard(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPanCardPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPanCardPreview(null);
      }
    } else {
      setPhoto(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .kyc-page {
          min-height: 100vh;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .kyc-card {
          width: 100%;
          max-width: 600px;
          background: #fff;
          border-radius: 16px;
          padding: 32px 36px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.2);
        }

        /* Header */
        .kyc-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eee;
        }

        .kyc-header-icon {
          color: ${PRIMARY};
          font-size: 28px;
        }

        .kyc-header-title {
          font-size: 24px;
          font-weight: 700;
          color: ${PRIMARY};
        }

        /* Brand & Status */
        .kyc-brand {
          font-size: 20px;
          font-weight: 700;
          color: ${PRIMARY};
          margin-bottom: 6px;
        }

        .kyc-status {
          font-size: 13px;
          color: #666;
          margin-bottom: 20px;
        }

        .kyc-status span {
          color: ${PRIMARY};
          font-weight: 600;
        }

        .kyc-divider {
          height: 1px;
          background: #eee;
          margin: 16px 0;
        }

        /* Section Title */
        .kyc-section-title {
          font-size: 18px;
          font-weight: 600;
          color: ${PRIMARY};
          margin-bottom: 16px;
        }

        /* Form Row */
        .kyc-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .kyc-row-label {
          flex: 0 0 140px;
          font-size: 13px;
          font-weight: 500;
          color: #333;
        }

        .kyc-row-input {
          flex: 1;
          padding: 6px 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 13px;
          color: #333;
          outline: none;
          font-family: inherit;
          background: #fff;
        }

        .kyc-row-input:focus {
          border-color: ${PRIMARY};
          box-shadow: 0 0 0 2px rgba(192,57,43,0.1);
        }

        .kyc-row-input::placeholder {
          color: #bbb;
        }

        .kyc-date-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .kyc-date-icon-btn {
          position: absolute;
          right: 4px;
          top:50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.2s;
        }

        .kyc-date-icon-btn:hover {
          color: ${PRIMARY};
        }

        .kyc-row-icon {
          color: #666;
          font-size: 14px;
        }

        /* Upload Section */
        .kyc-upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .kyc-upload-box {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .kyc-upload-preview {
          width: 80px;
          height: 60px;
          border: 1px dashed #ccc;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #bbb;
          font-size: 24px;
          background: #fafafa;
          overflow: hidden;
        }

        .kyc-upload-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }

        .kyc-upload-label {
          font-size: 12px;
          font-weight: 500;
          color: #333;
        }

        .kyc-upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 14px;
          background: ${PRIMARY};
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
        }

        .kyc-upload-btn:hover {
          background: ${PRIMARY_DARK};
        }

        .kyc-upload-input {
          display: none;
        }

        .kyc-upload-filename {
          font-size: 11px;
          color: ${PRIMARY};
          margin-top: 4px;
        }

        /* Submit Button */
        .kyc-submit {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .kyc-submit-btn {
          padding: 10px 24px;
          background: ${PRIMARY};
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
        }

        .kyc-submit-btn:hover:not(:disabled) {
          background: ${PRIMARY_DARK};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(192,57,43,0.3);
        }

        .kyc-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .kyc-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .kyc-card {
            padding: 24px 20px;
            border-radius: 12px;
          }
          .kyc-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .kyc-row-label {
            flex: none;
          }
          .kyc-row-input {
            width: 100%;
          }
          .kyc-upload-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .kyc-page {
            padding: 0;
            background: #fff;
          }
          .kyc-card {
            border-radius: 0;
            box-shadow: none;
            max-width: 100%;
          }
        }
      `}</style>

      <div className="kyc-page">
        <div className="kyc-card">
          {/* Header */}
          <div className="kyc-header">
            <FiUser className="kyc-header-icon" />
            <h1 className="kyc-header-title">Seller KYC Verification</h1>
          </div>

          {/* Brand & Status */}
          <div className="kyc-brand">Hamro Bazar</div>
          <div className="kyc-status">
            KYC Status: <span>Pending Verification</span>
          </div>

          <div className="kyc-divider" />

          {/* Personal Information */}
          <h2 className="kyc-section-title">Personal information</h2>

          <div className="kyc-row">
            <span className="kyc-row-label">Full Name</span>
            <input
              type="text"
              name="fullName"
              className="kyc-row-input"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Date of Birth</span>
            <div className="kyc-date-wrapper">
              <input
                type="text"
                name="dateOfBirth"
                className="kyc-row-input"
                value={form.dateOfBirth}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                style={{ flex: 1, paddingRight: "30px" }}
              />
              <input
                type="date"
                ref={dateInputRef}
                style={{
                  position: "absolute",
                  width: 0,
                  height: 0,
                  opacity: 0,
                  pointerEvents: "none"
                }}
                onChange={(e) => {
                  setForm({ ...form, dateOfBirth: e.target.value });
                }}
              />
              <button
                type="button"
                className="kyc-date-icon-btn"
                onClick={() => {
                  dateInputRef.current?.showPicker();
                }}
                aria-label="Open date picker"
              >
                <FiCalendar size={13} />
              </button>
            </div>
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Contact Number</span>
            <input
              type="text"
              name="contactNumber"
              className="kyc-row-input"
              value={form.contactNumber}
              onChange={handleChange}
            />
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Address</span>
            <input
              type="text"
              name="address"
              className="kyc-row-input"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="kyc-divider" />

          {/* Identity Documents */}
          <h2 className="kyc-section-title">Identity Documents</h2>

          <div className="kyc-upload-grid">
            <div className="kyc-upload-box">
              <div className="kyc-upload-preview">
                {panCardPreview ? (
                  <img src={panCardPreview} alt="PAN Card preview" />
                ) : (
                  <FiCreditCard size={28} />
                )}
              </div>
            
              <label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="kyc-upload-input"
                  onChange={handleFileChange("panCard")}
                />
                <span className="kyc-upload-btn">
                  <FiUpload size={12} />
                  Upload PAN Card
                </span>
              </label>
              {panCard && <span className="kyc-upload-filename">{panCard.name}</span>}
            </div>

            <div className="kyc-upload-box">
              <div className="kyc-upload-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Photo preview" />
                ) : (
                  <FiUser size={28} />
                )}
              </div>
    
              <label>
                <input
                  type="file"
                  accept="image/*"
                  className="kyc-upload-input"
                  onChange={handleFileChange("photo")}
                />
                <span className="kyc-upload-btn">
                  <FiUpload size={12} />
                  Passport size Photo
                </span>
              </label>
              {photo && <span className="kyc-upload-filename">{photo.name}</span>}
            </div>
          </div>

          <div className="kyc-divider" />

          {/* Bank Details */}
          <h2 className="kyc-section-title">Bank Details</h2>

          <div className="kyc-row">
            <span className="kyc-row-label">Bank Name</span>
            <input
              type="text"
              name="bankName"
              className="kyc-row-input"
              value={form.bankName}
              onChange={handleChange}
            />
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Account Number</span>
            <input
              type="text"
              name="accountNumber"
              className="kyc-row-input"
              value={form.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div className="kyc-row">
            <span className="kyc-row-label">Account Holder Name</span>
            <input
              type="text"
              name="accountHolderName"
              className="kyc-row-input"
              value={form.accountHolderName}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <div className="kyc-submit">
            <button
              type="button"
              className="kyc-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <><div className="kyc-spinner" /> Submitting...</>
              ) : (
                <>Submit For Verification</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}