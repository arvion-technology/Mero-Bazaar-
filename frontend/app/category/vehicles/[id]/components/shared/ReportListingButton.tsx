"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

const REPORT_REASONS = [
  { value: "SPAM", label: "Spam" },
  { value: "SCAM_FRAUD", label: "Scam or fraud" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate content" },
  { value: "FAKE_LISTING", label: "Fake listing" },
  { value: "HARASSMENT", label: "Harassment" },
  { value: "PRICE_MANIPULATION", label: "Price manipulation" },
  { value: "COUNTERFEIT", label: "Counterfeit item" },
  { value: "DUPLICATE", label: "Duplicate listing" },
  { value: "OTHER", label: "Other" },
] as const;

type Props = {
  listingId: string;
};

export default function ReportListingButton({ listingId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetAndClose = () => {
    setOpen(false);
    setReason("");
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason.");
      return;
    }

    setSubmitting(true);
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;

      if (!token) {
        toast.error("Please log in to report a listing.");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/content-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetType: "LISTING",
          listingId,
          reason,
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to submit report");
      }

      toast.success("Report submitted. Our team will review it.");
      resetAndClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <a
        href="#report"
        className="ld-report"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Report this listing
      </a>

      {open &&
        createPortal(
          <div className="rl-modal-overlay" onClick={resetAndClose}>
            <div className="rl-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="rl-modal-title">Report this listing</h3>

              <label className="rl-label" htmlFor="rl-reason">
                Reason
              </label>
              <select
                id="rl-reason"
                className="rl-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="" disabled>
                  Select a reason
                </option>
                {REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <label className="rl-label" htmlFor="rl-description">
                Additional details (optional)
              </label>
              <textarea
                id="rl-description"
                className="rl-textarea"
                rows={4}
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us more about the issue..."
              />

              <div className="rl-modal-actions">
                <button
                  type="button"
                  className="rl-btn-secondary"
                  onClick={resetAndClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rl-btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit report"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}