"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  FiCamera, FiCheckCircle, FiEdit3, FiArrowLeft, FiBell, FiChevronDown
} from "react-icons/fi";

const PRIMARY = "#0f172a";
const CARD_BG = "#ffffff";

export default function SellerSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData] = useState({
    fullName: "Ramesh Adhikari",
    birthdate: "May 15,1995",
    panCard: "AAEPC1235",
    phone: "9834568799",
    address: "Kathmandu",
    bankName: "Nabil Bank Limited",
    bankAccount: "12356867898764",
    accountHolder: "Ramesh Adhikari",
  });

  const infoRows = [
    { label: "Full Name", value: profileData.fullName },
    { label: "Birthdate", value: profileData.birthdate },
    { label: "Pan Card Number", value: profileData.panCard },
    { label: "Phone Number", value: profileData.phone, verified: true },
    { label: "Address", value: profileData.address },
  ];

  const bankRows = [
    { label: "Bank Name", value: profileData.bankName },
    { label: "Bank Account Number", value: profileData.bankAccount },
    { label: "Account Holder Name", value: profileData.accountHolder },
  ];

  return (
    <>
      <style>{`
        .settings-content { padding: 24px; max-width: 900px; margin: 0 auto; }
        .settings-profile-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .settings-avatar-lg { width: 52px; height: 52px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
        .settings-avatar-lg img { width: 100%; height: 100%; object-fit: cover; }
        .settings-verified-badge { display: inline-flex; align-items: center; gap: 3px; background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
        .settings-section-title { font-size: 15px; font-weight: 600; color: ${PRIMARY}; margin-bottom: 10px; }
        .settings-info-card { background: ${CARD_BG}; border-radius: 10px; border: 1px solid #e8e4e4; margin-bottom: 16px; overflow: hidden; }
        .settings-info-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-bottom: 1px solid #f1f5f9; }
        .settings-info-row:last-child { border-bottom: none; }
        .settings-info-label { font-size: 13px; color: #64748b; font-weight: 500; flex: 1; }
        .settings-info-value { font-size: 13px; color: ${PRIMARY}; font-weight: 500; flex: 1; text-align: right; }
        .settings-info-value-wrap { display: flex; align-items: center; gap: 8px; justify-content: flex-end; flex: 1; }
        .settings-verified-tag { display: inline-flex; align-items: center; gap: 3px; background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
        .settings-doc-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 14px 18px 18px; }
        .settings-doc-item { display: flex; flex-direction: column; gap: 6px; }
        .settings-doc-label { font-size: 12px; color: #64748b; font-weight: 500; }
        .settings-doc-box { width: 100%; aspect-ratio: 16/10; border: 1.5px dashed #e2e8f0; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #fafafa; cursor: pointer; transition: all 0.2s; overflow: hidden; }
        .settings-doc-box:hover { border-color: #cbd5e1; background: #f8fafc; }
        .settings-doc-view { font-size: 12px; color: #6366f1; font-weight: 500; text-decoration: none; cursor: pointer; text-align: center; }
        .settings-doc-view:hover { text-decoration: underline; }
        .settings-edit-btn { display: flex; align-items: center; gap: 6px; margin: 0 auto 24px; padding: 8px 24px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .settings-edit-btn:hover { background: #1d4ed8; }

        @media (max-width: 640px) {
          .settings-content { padding: 16px; }
          .settings-doc-row { grid-template-columns: 1fr; }
          .settings-info-row { flex-direction: column; align-items: flex-start; gap: 4px; }
          .settings-info-value, .settings-info-value-wrap { text-align: left; justify-content: flex-start; }
        }
      `}</style>

      <div className="settings-content">
        {/* Profile Header with Avatar */}
        <div className="settings-profile-header">
          <div className="settings-avatar-lg">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Ramesh Adhikari" />
          </div>
          <div>
            <div className="settings-verified-badge">
              <FiCheckCircle size={10} /> Verified
            </div>
          </div>
        </div>

        {/* Personal & Identity Information */}
        <h2 className="settings-section-title">Personal &amp; Identity Information</h2>
        <div className="settings-info-card">
          {infoRows.map((row) => (
            <div key={row.label} className="settings-info-row">
              <span className="settings-info-label">{row.label}</span>
              <div className="settings-info-value-wrap">
                <span className="settings-info-value">{row.value}</span>
                {row.verified && (
                  <span className="settings-verified-tag">
                    <FiCheckCircle size={10} /> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
          {/* Document Upload Row */}
          <div className="settings-doc-row">
            <div className="settings-doc-item">
              <span className="settings-doc-label">PAN Card Image</span>
              <div className="settings-doc-box" onClick={() => fileInputRef.current?.click()}>
                <FiCamera size={20} color="#cbd5e1" />
              </div>
              <span className="settings-doc-view">View Full Size</span>
            </div>
            <div className="settings-doc-item">
              <span className="settings-doc-label">Passport Size Photo</span>
              <div className="settings-doc-box" onClick={() => fileInputRef.current?.click()}>
                <FiCamera size={20} color="#cbd5e1" />
              </div>
              <span className="settings-doc-view">View Full Size</span>
            </div>
            <div className="settings-doc-item">
              <span className="settings-doc-label">Selfie With Pan Card</span>
              <div className="settings-doc-box" onClick={() => fileInputRef.current?.click()}>
                <FiCamera size={20} color="#cbd5e1" />
              </div>
              <span className="settings-doc-view">View Full Size</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) console.log("Upload:", file.name);
            }}
          />
        </div>

        {/* Bank Information */}
        <h2 className="settings-section-title">Bank Information</h2>
        <div className="settings-info-card">
          {bankRows.map((row) => (
            <div key={row.label} className="settings-info-row">
              <span className="settings-info-label">{row.label}</span>
              <span className="settings-info-value">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Edit Button */}
        <button className="settings-edit-btn">
          <FiEdit3 size={14} /> Edit
        </button>
      </div>
    </>
  );
}