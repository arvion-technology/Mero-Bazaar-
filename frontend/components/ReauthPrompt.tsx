"use client";

import { createRoot, Root } from "react-dom/client";
import { useState } from "react";

export type ReauthInput = { currentPassword?: string; otp?: string };

let activeResolver: ((value: ReauthInput | null) => void) | null = null;
let activeRoot: Root | null = null;
let activeHost: HTMLDivElement | null = null;

function close(value: ReauthInput | null) {
  activeRoot?.unmount();
  activeHost?.remove();
  activeRoot = null;
  activeHost = null;
  const resolve = activeResolver;
  activeResolver = null;
  resolve?.(value);
}

/**
 * Promise-based modal that asks the user for a current password (or an OTP for
 * passwordless/OAuth accounts). Rendered imperatively so any page can use it.
 */
export function promptForReauth(mode: "password" | "otp"): Promise<ReauthInput | null> {
  if (activeResolver) close(null);

  return new Promise((resolve) => {
    activeResolver = resolve;
    activeHost = document.createElement("div");
    document.body.appendChild(activeHost);
    activeRoot = createRoot(activeHost);
    activeRoot.render(<ReauthModal mode={mode} onDone={close} />);
  });
}

function ReauthModal({
  mode,
  onDone,
}: {
  mode: "password" | "otp";
  onDone: (value: ReauthInput | null) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const confirm = () => {
    if (!value.trim()) {
      setError(mode === "password" ? "Please enter your current password." : "Please enter the code.");
      return;
    }
    onDone(mode === "password" ? { currentPassword: value } : { otp: value });
  };

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    fontFamily: "system-ui, sans-serif",
  };
  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 14,
    padding: 24,
    width: 360,
    maxWidth: "90vw",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  };
  const input: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    borderRadius: 8,
    border: "1.5px solid #e2e2e2",
    fontSize: 14,
    marginTop: 10,
    outline: "none",
  };
  const button: React.CSSProperties = {
    width: "100%",
    padding: 11,
    borderRadius: 8,
    border: "none",
    background: "#C0392B",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 12,
  };

  return (
    <div style={overlay} onClick={() => onDone(null)}>
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
          {mode === "password" ? "Confirm your current password" : "Enter the verification code"}
        </h3>
        <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0", lineHeight: 1.5 }}>
          {mode === "password"
            ? "For your security, please re-enter your current password to continue."
            : "We sent a code to your verified phone number. Enter it below."}
        </p>
        <input
          type={mode === "password" ? "password" : "text"}
          inputMode={mode === "otp" ? "numeric" : undefined}
          autoFocus
          style={input}
          placeholder={mode === "password" ? "Current password" : "6-digit code"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && confirm()}
        />
        {error && <p style={{ color: "#c0392b", fontSize: 12.5, margin: "6px 0 0" }}>{error}</p>}
        <button style={button} onClick={confirm}>
          {mode === "password" ? "Confirm" : "Verify"}
        </button>
        <button
          style={{ ...button, background: "#f1f1f1", color: "#444", marginTop: 8 }}
          onClick={() => onDone(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
