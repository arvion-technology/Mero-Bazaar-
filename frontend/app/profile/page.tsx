"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiSettings, FiShield, FiLogOut, FiArrowLeft, FiCamera } from "react-icons/fi";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role:"",
    isActive: true,
    isVerified: false,
  });

  const [saving, setSaving] = useState(false);

  const userId = session?.user?.id;
  const token = session?.accessToken;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register");
      return;
    }

    if (session?.user?.role === "VENDOR") {
      router.push("/kyc");
      return;
    }

      if (!userId || !token) return;

      fetch(`/api/user/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load profile (${r.status})`);
        return r.json();
      })
      .then((data) => {
        const user = data?.user ?? data ?? {};

        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          role: user.role || "",
          isActive: user.isActive ?? true,
          isVerified: user.isVerified ?? false,
        });
      })
      .catch(console.error);
    }, [userId, token, status, router, session?.user?.role]);

  const handleSave = async () => {
    if(!userId) {
      toast.error("You're not signed in.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("http://localhost:3001/api/user/profile/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update profile");
      }
      toast.success("Profile updated successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong while saving.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="loader-container">
        <style>{`
          .loader-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            font-family: 'Inter', sans-serif;
          }
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid ${PRIMARY};
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="loader" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <div>Redirecting...</div>;
  }
  
  const initials = formData.name ? formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <>
      <style>{`
        .profile-container {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 40px 24px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #333;
        }
        .profile-wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          margin-bottom: 24px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          transition: color 0.2s;
        }
        .back-btn:hover {
          color: ${PRIMARY};
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
        }
        /* Left Card - Summary */
        .profile-sidebar {
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 32px 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          height: fit-content;
        }
        .avatar-container {
          position: relative;
          margin-bottom: 20px;
        }
        .avatar-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${PRIMARY}, #e74c3c);
          color: #fff;
          font-size: 36px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(192,57,43,0.2);
        }
        .avatar-upload-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #555;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          transition: all 0.2s;
        }
        .avatar-upload-btn:hover {
          background: ${PRIMARY};
          color: #fff;
          border-color: ${PRIMARY};
        }
        .profile-name {
          font-size: 20px;
          font-weight: 700;
          color: #111;
          margin-bottom: 6px;
        }
        .profile-role {
          font-size: 12px;
          font-weight: 600;
          color: ${PRIMARY};
          background: #fff5f5;
          padding: 4px 12px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 28px;
        }
        .sidebar-menu {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }
        .sidebar-item:hover {
          background: #f5f5f5;
          color: #111;
        }
        .sidebar-item.active {
          background: #fff5f5;
          color: ${PRIMARY};
          font-weight: 600;
        }
        .sidebar-divider {
          height: 1px;
          background: #eee;
          margin: 16px 0;
          width: 100%;
        }
        .sidebar-item.logout-btn {
          color: #d9534f;
        }
        .sidebar-item.logout-btn:hover {
          background: #fdf2f2;
        }

        /* Right Content Card */
        .profile-main {
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .section-header {
          margin-bottom: 32px;
        }
        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: #111;
          margin-bottom: 8px;
        }
        .section-subtitle {
          font-size: 14px;
          color: #666;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group.full-width {
          grid-column: span 2;
        }
        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #444;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .form-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .form-input-icon {
          position: absolute;
          left: 14px;
          color: #888;
          font-size: 16px;
        }
        .form-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          outline: none;
          background: #fcfcfc;
          transition: all 0.2s;
          font-family: inherit;
        }
        .form-input:focus {
          border-color: ${PRIMARY};
          background: #fff;
          box-shadow: 0 0 0 3px rgba(192,57,43,0.08);
        }
        .save-btn {
          background: ${PRIMARY};
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .save-btn:hover {
          background: ${PRIMARY_DARK};
          transform: translateY(-1px);
        }
        .save-btn:active {
          transform: translateY(0);
        }

        /* Responsive Design */
        @media (max-width: 850px) {
          .profile-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .profile-sidebar {
            flex-direction: row;
            align-items: center;
            text-align: left;
            padding: 24px;
          }
          .avatar-container {
            margin-bottom: 0;
            margin-right: 20px;
          }
          .profile-info {
            flex: 1;
          }
          .profile-role {
            display: inline-block;
            margin-bottom: 0;
          }
          .sidebar-menu {
            display: none; /* Hide sidebar items, menu shown in dropdown or tabs */
          }
          .sidebar-divider {
            display: none;
          }
          .profile-main {
            padding: 24px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group.full-width {
            grid-column: span 1;
          }
        }
      `}</style>

      <div className="profile-container">
        <div className="profile-wrapper">
          <button className="back-btn" onClick={() => router.push("/")}>
            <FiArrowLeft size={16} />
            Back to Home
          </button>

          <div className="profile-grid">
            {/* Sidebar Details */}
            <div className="profile-sidebar">
              <div className="avatar-container">
                <div className="avatar-circle">{initials}</div>
                <label className="avatar-upload-btn" title="Upload avatar">
                  <FiCamera size={14} />
                </label>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{formData.name}</h2>
                <span className="profile-role">Registered User</span>
              </div>

              <div className="sidebar-divider" />

              <div className="sidebar-menu">
                <button
                  className={`sidebar-item ${activeTab === "details" ? "active" : ""}`}
                  onClick={() => setActiveTab("details")}
                >
                  <FiUser size={16} />
                  Profile Details
                </button>
                <button
                  className={`sidebar-item ${activeTab === "settings" ? "active" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <FiSettings size={16} />
                  Account Settings
                </button>
                <button
                  className={`sidebar-item ${activeTab === "security" ? "active" : ""}`}
                  onClick={() => setActiveTab("security")}
                >
                  <FiShield size={16} />
                  Security
                </button>
                <div className="sidebar-divider" />
                <button className="sidebar-item logout-btn" onClick={() => signOut({ callbackUrl: "/" })}>
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <main className="profile-main">
              {activeTab === "details" && (
                <div>
                  <div className="section-header">
                    <h1 className="section-title">Profile Details</h1>
                    <p className="section-subtitle">Manage your personal profile information.</p>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        <FiUser size={14} />
                        Full Name
                      </label>
                      <div className="form-input-wrapper">
                        <FiUser className="form-input-icon" />
                        <input
                          type="text"
                          className="form-input"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FiMail size={14} />
                        Email Address
                      </label>
                      <div className="form-input-wrapper">
                        <FiMail className="form-input-icon" />
                        <input
                          type="email"
                          className="form-input"
                          value={formData.email}
                          disabled
                          title="Email cannot be changed"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FiPhone size={14} />
                        Contact Number
                      </label>
                      <div className="form-input-wrapper">
                        <FiPhone className="form-input-icon" />
                        <input
                          type="text"
                          className="form-input"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FiMapPin size={14} />
                        Address
                      </label>
                      <div className="form-input-wrapper">
                        <FiMapPin className="form-input-icon" />
                        <input
                          type="text"
                          className="form-input"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <button className="save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <div className="section-header">
                    <h1 className="section-title">Account Settings</h1>
                    <p className="section-subtitle">Manage preferences and system options.</p>
                  </div>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    Configure notification settings, email preferences, and display settings. Features coming soon.
                  </p>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <div className="section-header">
                    <h1 className="section-title">Security Settings</h1>
                    <p className="section-subtitle">Maintain account safety and update passwords.</p>
                  </div>
                  <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-input" style={{ paddingLeft: "16px" }} placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-input" style={{ paddingLeft: "16px" }} placeholder="••••••••" />
                    </div>
                  </div>
                  <button className="save-btn" onClick={() => alert("Password updated successfully!")}>
                    Update Password
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
