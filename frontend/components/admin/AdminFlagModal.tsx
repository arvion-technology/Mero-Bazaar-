"use client";
import { useState } from "react";
import { FiX, FiFlag, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";

type TargetType = "LISTING" | "USER" | "REVIEW";

const REASONS: { value: string; label: string }[] = [
  { value: "SPAM", label: "Spam" },
  { value: "SCAM_FRAUD", label: "Scam / Fraud" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate content" },
  { value: "FAKE_LISTING", label: "Fake listing" },
  { value: "HARASSMENT", label: "Harassment" },
  { value: "PRICE_MANIPULATION", label: "Price manipulation" },
  { value: "COUNTERFEIT", label: "Counterfeit" },
  { value: "DUPLICATE", label: "Duplicate" },
  { value: "OTHER", label: "Other" },
];

export default function AdminFlagModal({
  isOpen,
  onClose,
  targetType = "LISTING",
  targetId,
  targetLabel,
  onFlagged,
}: {
  isOpen: boolean;
  onClose: () => void;
  targetType?: TargetType;
  targetId: string;
  targetLabel?: string;
  onFlagged?: () => void;
}) {
  const { data: session } = useSession();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const targetIdField =
    targetType === "LISTING" ? "listingId" : targetType === "USER" ? "targetUserId" : "reviewId";

  const handleClose = () => {
    setReason("");
    setDescription("");
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Select a reason");
      return;
    }
    const token = session?.accessToken;
    if (!token) {
      toast.error("Your session expired — please log in again");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/admin/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          [targetIdField]: targetId,
          reason,
          description: description.trim() || undefined,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Failed to submit flag");
      setSubmitted(true);
      toast.success("Flag submitted");
      onFlagged?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .flag-modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 16px;
        }
        .flag-modal {
          background: #fff; border-radius: 14px; width: 100%; max-width: 440px;
          padding: 24px; box-shadow: 0 12px 40px rgba(0,0,0,0.2);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .flag-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 4px;
        }
        .flag-modal-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 16px; font-weight: 700; color: #1a1a1a;
        }
        .flag-modal-target {
          font-size: 12.5px; color: #888; margin-bottom: 16px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .flag-modal-close {
          background: none; border: none; cursor: pointer; color: #888;
          width: 30px; height: 30px; border-radius: 50%; display: flex;
          align-items: center; justify-content: center; transition: background 0.15s;
        }
        .flag-modal-close:hover { background: #f2f2f2; }
        .flag-modal-label {
          font-size: 13px; font-weight: 600; color: #444; margin-bottom: 6px; display: block;
        }
        .flag-reason-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;
        }
        .flag-reason-chip {
          padding: 8px 10px; border: 1.5px solid #e0e0e0; border-radius: 8px;
          font-size: 12.5px; color: #444; cursor: pointer; text-align: left;
          background: #fff; transition: all 0.15s;
        }
        .flag-reason-chip:hover { border-color: ${PRIMARY}; }
        .flag-reason-chip.selected {
          border-color: ${PRIMARY}; background: #FAECE7; color: ${PRIMARY}; font-weight: 600;
        }
        .flag-textarea {
          width: 100%; min-height: 80px; padding: 10px; border: 1px solid #e0e0e0;
          border-radius: 8px; font-size: 13px; font-family: inherit; resize: vertical;
          outline: none; color: #333;
        }
        .flag-textarea:focus { border-color: ${PRIMARY}; }
        .flag-modal-actions {
          display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px;
        }
        .flag-btn-cancel {
          padding: 10px 16px; background: transparent; border: 1px solid #e0e0e0;
          border-radius: 8px; font-size: 13px; color: #666; cursor: pointer;
        }
        .flag-btn-submit {
          padding: 10px 18px; background: ${PRIMARY}; color: #fff; border: none;
          border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 6px; transition: background 0.15s;
        }
        .flag-btn-submit:hover:not(:disabled) { background: ${PRIMARY_DARK}; }
        .flag-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .flag-success {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 20px 8px; gap: 10px;
        }
        .flag-success-icon {
          width: 56px; height: 56px; border-radius: 50%; background: #e6f7ee;
          display: flex; align-items: center; justify-content: center; color: #1a7a4a; font-size: 26px;
        }
      `}</style>

      <div className="flag-modal-backdrop" onClick={handleClose}>
        <div className="flag-modal" onClick={(e) => e.stopPropagation()}>
          {submitted ? (
            <div className="flag-success">
              <div className="flag-success-icon"><FiCheckCircle /></div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Flag submitted</div>
              <div style={{ fontSize: 13, color: "#777" }}>
                This has been added to the Flags queue for review.
              </div>
              <button className="flag-btn-cancel" style={{ marginTop: 8 }} onClick={handleClose}>
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flag-modal-header">
                <div className="flag-modal-title"><FiFlag size={16} color={PRIMARY} /> Flag this {targetType.toLowerCase()}</div>
                <button className="flag-modal-close" onClick={handleClose} aria-label="Close"><FiX size={16} /></button>
              </div>
              {targetLabel && <div className="flag-modal-target">{targetLabel}</div>}

              <label className="flag-modal-label">Reason</label>
              <div className="flag-reason-grid">
                {REASONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`flag-reason-chip${reason === r.value ? " selected" : ""}`}
                    onClick={() => setReason(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <label className="flag-modal-label">Internal note (optional)</label>
              <textarea
                className="flag-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Context for whoever reviews this flag"
                maxLength={1000}
              />

              <div className="flag-modal-actions">
                <button className="flag-btn-cancel" onClick={handleClose}>Cancel</button>
                <button className="flag-btn-submit" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting…" : (<><FiFlag size={13} /> Submit flag</>)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}