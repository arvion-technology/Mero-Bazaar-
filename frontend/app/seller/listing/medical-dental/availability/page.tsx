"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiFileText,
  FiBriefcase,
  FiInfo,
  FiTrash2,
  FiPlus,
  FiClock,
  FiChevronDown,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ACCENT = "#2563eb";
const DANGER = "#dc2626";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Details", icon: FiBriefcase, status: "done" as const },
  { label: "Availability", icon: FiClock, status: "active" as const },
  { label: "Preview", icon: FiInfo, status: "upcoming" as const },
];

const weekDays = [
  { key: "MON", label: "Monday" },
  { key: "TUE", label: "Tuesday" },
  { key: "WED", label: "Wednesday" },
  { key: "THU", label: "Thursday" },
  { key: "FRI", label: "Friday" },
  { key: "SAT", label: "Saturday" },
  { key: "SUN", label: "Sunday" },
];

const bufferTimes = ["No buffer","5 minutes","10 minutes","15 minutes","30 minutes"];

type TimeSlot = { id: string; start: string; end: string };

/* ─── Custom Dropdown ─── */
function Dropdown({
  value,
  options,
  onChange,
  placeholder = "Select...",
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "12px 40px 12px 16px",
          border: `1.5px solid ${open ? ACCENT : BORDER}`,
          borderRadius: 12,
          fontSize: 14,
          color: TEXT_PRIMARY,
          background: CARD_BG,
          fontFamily: "inherit",
          outline: "none",
          cursor: "pointer",
          transition: "all 0.25s ease",
          boxShadow: open ? `0 0 0 4px rgba(37, 99, 235, 0.08)` : "none",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{value || placeholder}</span>
        <FiChevronDown
          size={16}
          color={TEXT_MUTED}
          style={{
            position: "absolute",
            right: 14,
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: CARD_BG,
            border: `1.5px solid ${BORDER}`,
            borderRadius: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            maxHeight: 240,
            overflowY: "auto",
            padding: "6px 0",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={{
                padding: "10px 16px",
                fontSize: 14,
                color: TEXT_PRIMARY,
                cursor: "pointer",
                transition: "background 0.15s ease",
                background: opt === value ? "#eff6ff" : "transparent",
                fontWeight: opt === value ? 600 : 400,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  opt === value ? "#eff6ff" : "#f8fafc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  opt === value ? "#eff6ff" : "transparent")
              }
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MedicalAvailabilityPage() {
  const router = useRouter();

  const [selectedDays, setSelectedDays] = useState<string[]>(["MON","TUE","WED","THU","FRI"]);
  const [slots, setSlots] = useState<Record<string, TimeSlot[]>>({
    MON: [
      { id: "1", start: "", end: "" },
      { id: "2", start: "", end: "" },
    ],
    TUE: [{ id: "3", start: "", end: "" }],
    WED: [{ id: "4", start: "", end: "" }],
    THU: [{ id: "5", start: "", end: "" }],
    FRI: [{ id: "6", start: "", end: "" }],
  });

  const [activeDay, setActiveDay] = useState("MON");
  const [slotDuration, setSlotDuration] = useState("");
  const [bufferTime, setBufferTime] = useState("10 minutes");
  const [sameDayBooking, setSameDayBooking] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      const exists = prev.includes(day);
      if (exists) {
        const next = prev.filter((d) => d !== day);
        if (activeDay === day && next.length > 0) setActiveDay(next[0]);
        return next;
      } else {
        if (!slots[day]) {
          setSlots((s) => ({ ...s, [day]: [{ id: Date.now().toString(), start: "", end: "" }] }));
        }
        setActiveDay(day);
        return [...prev, day];
      }
    });
  };

  const addSlot = (day: string) => {
    setSlots((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { id: Date.now().toString() + Math.random().toString(36).slice(2), start: "", end: "" }],
    }));
  };

  const removeSlot = (day: string, id: string) => {
    setSlots((prev) => ({ ...prev, [day]: (prev[day] || []).filter((s) => s.id !== id) }));
  };

  const updateSlot = (day: string, id: string, field: "start" | "end", value: string) => {
    setSlots((prev) => ({
      ...prev,
      [day]: (prev[day] || []).map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }
    for (const day of selectedDays) {
      const daySlots = slots[day] || [];
      if (daySlots.length === 0) {
        toast.error(`Please add at least one time slot for ${weekDays.find((d) => d.key === day)?.label}`);
        return;
      }
      for (const slot of daySlots) {
        if (!slot.start.trim() || !slot.end.trim()) {
          toast.error(`Please fill in all time fields for ${weekDays.find((d) => d.key === day)?.label}`);
          return;
        }
      }
    }

    localStorage.setItem("medicalListingAvailability", JSON.stringify({ selectedDays, slots, slotDuration, bufferTime, sameDayBooking }));
    toast.success("Availability saved! Proceeding to preview...");
    router.push("/seller/listing/medical-dental/photos");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          min-height: 100vh;
          background: ${BG};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 0;
          font-family: inherit;
        }

        .draft-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
        }

        .stepper {
          display: flex;
          align-items: center;
          background: ${CARD_BG};
          border: 1px solid ${BORDER};
          border-radius: 16px;
          padding: 18px 22px;
          margin-bottom: 28px;
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

        .step.done .step-icon-wrap { background: ${SUCCESS}; color: #fff; }
        .step.active .step-icon-wrap {
          background: linear-gradient(135deg, ${ACCENT}, #1d4ed8);
          color: #fff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
        }
        .step.upcoming .step-icon-wrap { background: #f1f5f9; color: ${TEXT_MUTED}; }

        .step-label {
          font-size: 13.5px;
          font-weight: 600;
          white-space: nowrap;
        }
        .step.done .step-label { color: ${SUCCESS}; }
        .step.active .step-label { color: ${ACCENT}; }
        .step.upcoming .step-label { color: ${TEXT_MUTED}; }

        .step-connector {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          margin: 0 14px;
          min-width: 24px;
        }
        .step-connector.filled { background: ${SUCCESS}; }

        .title-section { margin-bottom: 28px; }
        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }
        .page-subtitle { font-size: 15px; color: ${TEXT_SECONDARY}; }

        .content-card {
          background: ${CARD_BG};
          border-radius: 20px;
          border: 1px solid ${BORDER};
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03);
          padding: 32px;
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 32px;
        }

        .days-sidebar {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .day-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1.5px solid transparent;
          font-size: 14px;
          font-weight: 500;
          color: ${TEXT_SECONDARY};
          user-select: none;
        }
        .day-item:hover { background: #f8fafc; border-color: #e2e8f0; }
        .day-item.active {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border-color: #bfdbfe;
          color: ${ACCENT};
          font-weight: 600;
        }

        .day-checkbox {
          width: 18px;
          height: 18px;
          accent-color: ${ACCENT};
          cursor: pointer;
          flex-shrink: 0;
        }

        .slots-panel { min-width: 0; }

        .panel-title {
          font-size: 16px;
          font-weight: 700;
          color: ${ACCENT};
          margin-bottom: 20px;
        }

        .slot-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 16px;
          align-items: end;
          margin-bottom: 16px;
        }

        .slot-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slot-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }
        .slot-label .required { color: ${DANGER}; }

        .time-input {
          padding: 12px 16px;
          border: 1.5px solid ${BORDER};
          border-radius: 12px;
          font-size: 14px;
          color: ${TEXT_PRIMARY};
          background: ${CARD_BG};
          font-family: inherit;
          transition: all 0.25s ease;
          width: 100%;
          outline: none;
        }
        .time-input:hover { border-color: #cbd5e1; background: #fafafa; }
        .time-input:focus { border-color: ${ACCENT}; background: ${CARD_BG}; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08); }
        .time-input::placeholder { color: #9ca3af; font-weight: 400; }

        .delete-btn {
          width: 36px;
          height: 44px;
          border-radius: 10px;
          border: 1.5px solid ${BORDER};
          background: ${CARD_BG};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${TEXT_MUTED};
          transition: all 0.2s ease;
        }
        .delete-btn:hover {
          border-color: #fca5a5;
          background: #fef2f2;
          color: ${DANGER};
        }

        .add-slot-btn {
          width: 100%;
          padding: 12px;
          border: 1.5px dashed #c4b5fd;
          border-radius: 12px;
          background: transparent;
          color: ${ACCENT};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
          margin-top: 8px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .add-slot-btn:hover { border-color: ${ACCENT}; background: #f8fbff; }

        .settings-section {
          border-top: 1px solid ${BORDER};
          padding-top: 24px;
        }

        .settings-title {
          font-size: 16px;
          font-weight: 700;
          color: ${ACCENT};
          margin-bottom: 20px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .setting-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .same-day-box {
          border: 1.5px solid ${BORDER};
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .same-day-box:hover { border-color: #cbd5e1; background: #fafafa; }

        .same-day-left { display: flex; flex-direction: column; gap: 2px; }
        .same-day-title { font-size: 14px; font-weight: 600; color: ${TEXT_PRIMARY}; }
        .same-day-desc { font-size: 13px; color: ${TEXT_SECONDARY}; }

        .toggle-switch {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: #cbd5e1;
          position: relative;
          cursor: pointer;
          transition: background 0.25s ease;
          flex-shrink: 0;
        }
        .toggle-switch.on { background: ${ACCENT}; }
        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          top: 2px;
          left: 2px;
          transition: left 0.25s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .toggle-switch.on::after { left: 22px; }

        .submit-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 36px;
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
          background: #eff6ff;
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

        @media (max-width: 768px) {
          .container { padding: 20px 20px 48px; }
          .content-card { grid-template-columns: 1fr; padding: 24px; }
          .days-sidebar { flex-direction: row; flex-wrap: wrap; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
          .settings-grid { grid-template-columns: 1fr; }
          .submit-wrap { flex-direction: column-reverse; }
          .back-link, .submit-btn { width: 100%; justify-content: center; }
        }

        @media (max-width: 480px) {
          .slot-row { grid-template-columns: 1fr; }
          .delete-btn { width: 100%; height: 40px; }
        }
      `}</style>

      <div className="page">
        <div className="container">
          <div className="header">
            <button type="button" className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={18} />
              Back
            </button>
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

          <div className="title-section">
            <h1 className="page-title">Set Your Availability (Appointment Slots)</h1>
            <p className="page-subtitle">Add your weekly schedule so patients can book appointments with you.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="content-card">
              <div className="days-sidebar">
                {weekDays.map((day) => (
                  <div
                    key={day.key}
                    className={`day-item ${activeDay === day.key ? "active" : ""}`}
                    onClick={() => { if (selectedDays.includes(day.key)) setActiveDay(day.key); else toggleDay(day.key); }}
                  >
                    <input
                      type="checkbox"
                      className="day-checkbox"
                      checked={selectedDays.includes(day.key)}
                      onChange={() => toggleDay(day.key)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{day.label}</span>
                  </div>
                ))}
              </div>

              <div className="slots-panel">
                {selectedDays.includes(activeDay) ? (
                  <>
                    <h3 className="panel-title">{weekDays.find((d) => d.key === activeDay)?.label}</h3>
                    {(slots[activeDay] || []).map((slot) => (
                      <div key={slot.id} className="slot-row">
                        <div className="slot-group">
                          <label className="slot-label">Start Time <span className="required">*</span></label>
                          <input
                            type="text"
                            className="time-input"
                            placeholder="09:00 AM"
                            value={slot.start}
                            onChange={(e) => updateSlot(activeDay, slot.id, "start", e.target.value)}
                            required
                          />
                        </div>
                        <div className="slot-group">
                          <label className="slot-label">End Time <span className="required">*</span></label>
                          <input
                            type="text"
                            className="time-input"
                            placeholder="05:00 PM"
                            value={slot.end}
                            onChange={(e) => updateSlot(activeDay, slot.id, "end", e.target.value)}
                            required
                          />
                        </div>
                        <button type="button" className="delete-btn" onClick={() => removeSlot(activeDay, slot.id)}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="add-slot-btn" onClick={() => addSlot(activeDay)}>
                      <FiPlus size={16} />
                      Add Another Time Slot
                    </button>

                    <div className="settings-section">
                      <h3 className="settings-title">Appointment Setting</h3>
                      <div className="settings-grid">
                        <div className="setting-group">
                          <label className="setting-label">Slot Duration</label>
                          <input
                            type="text"
                            className="time-input"
                            placeholder="e.g. 30 minutes"
                            value={slotDuration}
                            onChange={(e) => setSlotDuration(e.target.value)}
                          />
                        </div>
                        <div className="setting-group">
                          <label className="setting-label">Buffer Time</label>
                          <Dropdown
                            value={bufferTime}
                            options={bufferTimes}
                            onChange={setBufferTime}
                          />
                        </div>
                      </div>

                      <div className="same-day-box" onClick={() => setSameDayBooking(!sameDayBooking)}>
                        <div className="same-day-left">
                          <span className="same-day-title">Allow same day booking</span>
                          <span className="same-day-desc">Patients can book on the same day</span>
                        </div>
                        <div className={`toggle-switch ${sameDayBooking ? "on" : ""}`} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: TEXT_MUTED }}>
                    <FiClock size={40} style={{ marginBottom: 16, opacity: 0.4 }} />
                    <p style={{ fontSize: 15, fontWeight: 500 }}>Select {weekDays.find((d) => d.key === activeDay)?.label} to add time slots</p>
                  </div>
                )}
              </div>
            </div>

            <div className="submit-wrap">
              <button type="button" className="back-link" onClick={() => router.back()}>
                <FiArrowLeft size={16} />
                Back
              </button>
              <button type="submit" className="submit-btn">
                Save & Continue
                <FiArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}