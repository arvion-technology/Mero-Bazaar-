"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiGrid,
  FiShoppingBag,
  FiHeart,
  FiBell,
  FiHelpCircle,
  FiSettings,
  FiTrash2,
  FiAlertTriangle,
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiMoreHorizontal,
  FiEdit2,
  FiCheck,
  FiCamera,
  FiLogOut,
  FiChevronDown,
  FiMapPin,
  FiEye,
  FiEyeOff,
  FiMenu,
  FiX,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";

import { deleteAccountWithReauth, reauthFetch } from "@/lib/accountActions";

const PRIMARY = "#C0392B";

/* ── Shared Tailwind class strings ── */
const iconBtn =
  "w-10 h-10 rounded-[10px] border border-[#e2e8f0] bg-white flex items-center justify-center cursor-pointer text-[#64748b] transition-all duration-200 relative shrink-0 hover:bg-[#f8fafc] hover:text-[#334155] hover:border-[#cbd5e1]";
const squareBtn =
  "rounded-lg border border-[#e2e8f0] bg-white items-center justify-center cursor-pointer text-[#64748b] transition-all duration-200 shrink-0 hover:bg-[#f8fafc] hover:text-[#334155] hover:border-[#cbd5e1]";
const navItemBase =
  "relative mb-0.5 flex w-full cursor-pointer items-center gap-3 whitespace-nowrap rounded-[10px] border-0 px-3.5 py-2.5 text-left font-[inherit] text-[14px] leading-normal no-underline transition-all duration-200";
const navItemIdle = "font-medium text-[#5a6478]! hover:bg-[#f4f6fb] hover:text-slate-800!";
const navItemActive =
  "bg-[#fff5f5] font-semibold text-[#C0392B]! before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-[3px] before:bg-[#C0392B] before:content-['']";
const navItemDanger = "font-medium text-red-500/70! hover:bg-red-500/5 hover:text-red-500!";
const dropdownItemBase =
  "flex items-center gap-2.5 px-4 py-[11px] text-sm font-medium cursor-pointer transition-all duration-150 border-0 bg-transparent w-full text-left";
const navLabel = "text-[10px] font-bold text-[#b0b8c4] uppercase tracking-[1.2px] px-3 mb-2 whitespace-nowrap";
const navIcon = "text-lg w-[22px] flex justify-center shrink-0";

const btnBase =
  "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold cursor-pointer transition-all duration-200 max-[480px]:px-4 max-[480px]:py-2 max-[480px]:text-xs";
const btnPrimary = `${btnBase} border-0 bg-[#4f46e5] text-white hover:bg-[#4338ca] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(79,70,229,0.25)]`;
const btnGhost = `${btnBase} bg-[#f1f5f9] border border-[#e2e8f0] hover:bg-[#e2e8f0]`;

const sectionHeader = "flex items-center justify-between mb-4 gap-3 flex-wrap";
const sectionTitle = "text-base font-bold text-[#1e293b] tracking-[-0.2px] max-[480px]:text-sm";

const formInputBase =
  "px-3.5 py-2.5 border border-[#e2e8f0] rounded-lg font-[inherit] text-[#1e293b] outline-none transition-all duration-200 min-w-0 focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]";
const otpInput = `${formInputBase} text-center text-xl tracking-[6px] mb-5`;

const pwSubmitBtn =
  "inline-flex items-center gap-2 px-6 py-[11px] bg-[#C0392B] text-white border-0 rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-200 enabled:hover:bg-[#a93226] enabled:hover:-translate-y-px enabled:hover:shadow-[0_4px_12px_rgba(192,57,43,0.25)] disabled:opacity-70 disabled:cursor-not-allowed";
const pwInput =
  "w-full py-[11px] pr-11 pl-3.5 border border-[#e2e8f0] rounded-lg text-sm text-[#1e293b] outline-none transition-all duration-200 bg-[#fafbfc] focus:border-[#6366f1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] max-md:py-2.5 max-md:pr-10 max-md:pl-3 max-md:text-[13px]";
const pwEyeBtn =
  "absolute right-3 bg-transparent border-0 cursor-pointer text-[#94a3b8] p-1 flex items-center rounded-sm transition-colors duration-200 text-[15px] hover:text-[#6366f1]";
const pwLabel = "text-[13px] font-semibold text-[#475569] flex items-center gap-1.5";

const modalOverlay =
  "fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 animate-[fadeIn_0.2s_ease]";
const modalBox =
  "bg-white rounded-2xl p-8 w-full shadow-[0_25px_50px_rgba(0,0,0,0.25)] animate-[slideUp_0.25s_ease]";
const modalIconBase = "w-14 h-14 rounded-[14px] flex items-center justify-center mx-auto mb-5";
const modalTitle = "text-lg font-bold text-[#1e293b] text-center";
const modalBody = "text-sm text-[#64748b] text-center leading-[1.6] mb-6 [&_strong]:text-[#ef4444]";
const modalError = "text-[13px] text-[#ef4444] bg-[#fef2f2] rounded-lg px-3.5 py-2.5 mb-4 text-center";
const modalCancel =
  "flex-1 py-[11px] rounded-[10px] border-[1.5px] border-[#e2e8f0] bg-white text-[#475569] text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[#f8fafc] hover:border-[#cbd5e1]";
const modalDelete =
  "flex-1 py-[11px] rounded-[10px] border-0 bg-[#ef4444] text-white text-sm font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 enabled:hover:bg-[#dc2626] disabled:opacity-70 disabled:cursor-not-allowed";

export default function UserSettings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [securityNotifs, setSecurityNotifs] = useState<{ id: string; type: string; createdAt: string; read: boolean }[]>([]);
  const [notifSeen, setNotifSeen] = useState(false);

  //active session state
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [sessions, setSessions] = useState<
    {
      id: string;
      deviceLabel: string | null;
      ipAddress: string | null;
      lastActiveAt: string;
      isCurrent: boolean;
    }[]
  >([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isSubmittingPw, setIsSubmittingPw] = useState(false);

  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

    // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(session?.user?.twoFactorEnabled ?? false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [tfaOtp, setTfaOtp] = useState("");
  const [tfaRequesting, setTfaRequesting] = useState(false);
  const [tfaConfirming, setTfaConfirming] = useState(false);
  const [tfaError, setTfaError] = useState("");
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [tfaDisabling, setTfaDisabling] = useState(false);

  //phone otp state for save changes
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [confirmingPhone, setConfirmingPhone] = useState(false);

 //avatar change
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
 
  const token = session?.accessToken;
  const isOAuthUser = session?.user?.provider !==  undefined && session.user.provider !== "credentials";

  function activityLabel(type: string) {
    switch (type) {
      case "PASSWORD_CHANGED": return "Password changed";
      case "TWO_FA_ENABLED": return "Two-factor authentication enabled";
      case "TWO_FA_DISABLED": return "Two-factor authentication disabled";
      case "PHONE_CHANGED": return "Phone number changed";
      default: return type;
    }
  }

  // Compute profile-completeness notifications (reused from Navbar logic)
  const notifications: string[] = session
    ? ([
        !session.user?.phone && "Add your phone number",
        !session.user?.address && "Add your address",
        ...securityNotifs.filter((n) => !n.read).map((n) => activityLabel(n.type)),
      ].filter(Boolean) as string[])
    : [];
  const notificationCount = notifications.length;

  const sidebarItems = [
    { id: "dashboard", icon: FiGrid, label: "Dashboard", href: "/user/dashboard" },
    { id: "contacts", icon: FiUser, label: "Contacts", href: "/user/contacts" },
    { id: "orders", icon: FiShoppingBag, label: "My Orders", href: "/user/orders" },
    { id: "wishlist", icon: FiHeart, label: "Wishlist", href: "/user/wishlist" },
    { id: "notification", icon: FiBell, label: "Notifications", href: "/user/notifications" },
    { id: "help", icon: FiHelpCircle, label: "Help & Support", href: "/user/help" },
    { id: "settings", icon: FiSettings, label: "Settings", href: "/user/settings" },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  // Reconcile 2FA state with DB truth on mount (session JWT can go stale)
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch("/api/user/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (typeof data.twoFactorEnabled === "boolean" && data.twoFactorEnabled !== session?.user?.twoFactorEnabled) {
          setTwoFactorEnabled(data.twoFactorEnabled);
          await updateSession({ user: { ...session?.user, twoFactorEnabled: data.twoFactorEnabled } });
        }
      } catch {
        // silent — non-critical background sync
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Backend token exp:", new Date(payload.exp * 1000), "| now:", new Date());
    } catch (e) {
      console.log("Couldn't decode token", e);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/user/notifications/security", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setSecurityNotifs)
      .catch(() => {});
  }, [token]);

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await deleteAccountWithReauth(token);
      if (res.status === 499) return; // user cancelled the confirmation
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to delete account");
      }
      toast.success("Account deleted successfully.");
      await signOut({ redirect: false });
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setDeleteError(msg);
      setDeleting(false);
    }
  }

  async function handlePasswordUpdate() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setIsSubmittingPw(true);
    try {
      const res = await fetch("/api/user/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to update password.");
      }
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setIsSubmittingPw(false);
    }
  }

  //image in avatar helper
  function getImageUrl(image?: string | null) {
  if (!image) return "";
  return image.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
  }

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const [profileForm, setProfileForm] = useState({
      name: session?.user?.name || "",
      phone: session?.user?.phone || "",
      address: session?.user?.address || "",
    });
    const [savingProfile, setSavingProfile] = useState(false);

  const sessionSnapshot = `${session?.user?.name || ""}|${session?.user?.phone || ""}|${session?.user?.address || ""}|${session?.user?.twoFactorEnabled ?? ""}`;
      const [lastSessionSnapshot, setLastSessionSnapshot] = useState(sessionSnapshot);

      if (!isEditing && sessionSnapshot !== lastSessionSnapshot) {
        setLastSessionSnapshot(sessionSnapshot);
        setProfileForm({
          name: session?.user?.name || "",
          phone: session?.user?.phone || "",
          address: session?.user?.address || "",
        });
        setTwoFactorEnabled(session?.user?.twoFactorEnabled ?? false);
      }

  const profileFields = [
    { key: "name", icon: FiUser, label: "Full Name", value: profileForm.name, type: "text", editable: true },
    { key: "phone", icon: FiPhone, label: "Phone Number", value: profileForm.phone, type: "tel", editable: true },
    { key: "email", icon: FiMail, label: "Email Address", value: session?.user?.email || "—", type: "email", editable: false },
    { key: "address", icon: FiMapPin, label: "Address", value: profileForm.address, type: "text", editable: true },
  ];


  //avatar change
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/user/profile/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to upload photo.");
      }
      const data = await res.json();
      await updateSession({ user: { ...session?.user, image: data.image } });
      toast.success("Profile photo updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setUploadingAvatar(false);
    }
  }
  
//profile save
  async function handleProfileSave() {
    const phoneChanged = profileForm.phone !== (session?.user?.phone || "");

    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileForm.name,
          address: profileForm.address,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to update profile.");
      }

      if (phoneChanged && profileForm.phone) {
        const phoneRes = await reauthFetch(
          "/api/user/profile/phone/request",
          token,
          { phone: profileForm.phone },
        );
        if (phoneRes.status === 499) return; // user cancelled the confirmation
        if (!phoneRes.ok) {
          const data = await phoneRes.json().catch(() => null);
          setProfileForm((prev) => ({ ...prev, phone: session?.user?.phone || "" }));
          throw new Error(data?.message || "Failed to update phone number.");
        }
        setPendingPhone(profileForm.phone);
        setPhoneOtp("");
        setPhoneOtpError("");
        setShowPhoneOtpModal(true);
        toast.success("Profile updated. Enter the code sent to your new number to confirm it.");
        setIsEditing(false);
        return;
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleConfirmPhoneOtp() {
    if (!phoneOtp || phoneOtp.length < 6) {
      setPhoneOtpError("Enter the 6-digit code we sent you.");
      return;
    }
    setConfirmingPhone(true);
    setPhoneOtpError("");
    try {
      const res = await fetch("/api/user/profile/phone/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: phoneOtp }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Invalid or expired code.");
      }
      toast.success("Phone number verified.");
      setShowPhoneOtpModal(false);
      await updateSession({ user: { ...session?.user, phone: pendingPhone } });
    } catch (err) {
      setPhoneOtpError(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setConfirmingPhone(false);
    }
  }

//revoke function for active session
  async function loadSessions() {
    setLoadingSessions(true);
    try {
      const res = await fetch("/api/sessions/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load sessions.");
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setLoadingSessions(false);
    }
  }

  async function handleRevokeSession(id: string) {
    setRevokingId(id);
    try {
      const res = await fetch(`/api/sessions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to revoke session.");
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Session revoked.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setRevokingId(null);
    }
  }

  // request an OTP to enable 2FA
async function handleRequestEnable2FA() {
  setTfaRequesting(true);
  setTfaError("");
  try {
    const res = await fetch("/api/user/2fa/enable", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.message === "Two-factor is already enabled.") {
        setTwoFactorEnabled(true);
        await updateSession({ user: { ...session?.user, twoFactorEnabled: true } });
        return;
      }
      throw new Error(data?.message || "Failed to start 2FA setup.");
    }
    setTfaOtp("");
    setShow2FAModal(true);
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Something went wrong!");
  } finally {
    setTfaRequesting(false);
  }
}

// confirm the OTP to actually turn 2FA on
async function handleConfirmEnable2FA() {
  if (!tfaOtp || tfaOtp.length < 6) {
    setTfaError("Enter the 6-digit code we sent you.");
    return;
  }
  setTfaConfirming(true);
  setTfaError("");
  try {
    const res = await fetch("/api/user/2fa/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ otp: tfaOtp }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Invalid or expired code.");
    }
    setTwoFactorEnabled(true);
    setShow2FAModal(false);
    toast.success("Two-factor authentication enabled.");
    await updateSession({ user: { ...session?.user, twoFactorEnabled: true } });
  } catch (err) {
    setTfaError(err instanceof Error ? err.message : "Something went wrong!");
  } finally {
    setTfaConfirming(false);
  }
}

// Disable — requires step-up reauthentication (current password or OTP) per policy
async function handleDisable2FA() {
  setTfaDisabling(true);
  try {
    const res = await reauthFetch("/api/user/2fa/disable", token);
    if (res.status === 499) return; // user cancelled the confirmation
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Failed to disable 2FA.");
    }
    setTwoFactorEnabled(false);
    setShowDisable2FAModal(false);
    toast.success("Two-factor authentication disabled.");
    await updateSession({ user: { ...session?.user, twoFactorEnabled: false } });
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Something went wrong!");
  } finally {
    setTfaDisabling(false);
  }
}

  const collapsedHide = sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "";

  return (
    <>
      {/* ── Mobile Backdrop ── */}
      <div
        className={`hidden fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-[2px] z-[99] animate-[backdropIn_0.2s_ease] ${
          sidebarOpen ? "max-lg:block" : ""
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="min-h-dvh bg-[#f1f5f9] flex font-[Inter,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif]">
        {/* ── Sidebar ── */}
        <aside
          className={`fixed left-0 top-0 h-dvh z-[100] flex flex-col shrink-0 bg-white border-r border-[#e8ecf0] shadow-[2px_0_8px_rgba(0,0,0,0.04)] transition-[width,transform] duration-300 ease-in-out ${
            sidebarCollapsed ? "w-[72px]" : "w-[260px]"
          } max-lg:w-[280px] max-lg:z-[200] ${
            sidebarOpen
              ? "max-lg:translate-x-0 max-lg:shadow-[4px_0_32px_rgba(0,0,0,0.15)]"
              : "max-lg:-translate-x-full"
          }`}
        >
          {/* Mobile close button */}
          <button
            type="button"
            className={`hidden absolute top-[18px] right-4 w-8 h-8 border-0 bg-[#f1f5f9] rounded-lg cursor-pointer items-center justify-center text-[#64748b] transition-all duration-200 z-[1] hover:bg-[#e2e8f0] hover:text-[#1e293b] ${
              sidebarOpen ? "max-lg:flex" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>

          {/* Logo */}
          <div className="p-5 flex items-center gap-2.5 border-b border-[#f0f2f5] min-h-[72px] overflow-hidden">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <svg className="w-9 h-9 shrink-0" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="8" fill={PRIMARY} />
                <path
                  d="M10 10 C10 10, 14 8, 19 13 C24 18, 28 10, 28 10
                     M10 28 C10 28, 14 30, 19 25 C24 20, 28 28, 28 28
                     M10 10 Q10 19 10 28
                     M28 10 Q28 19 28 28
                     M14 19 C14 19 16 22 19 22 C22 22 24 19 24 19"
                  stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
                />
                <circle cx="19" cy="19" r="3" fill="#fff" opacity="0.9" />
              </svg>
              <div
                className={`flex flex-col leading-[1.1] transition-[opacity,width] duration-200 whitespace-nowrap overflow-hidden ${
                  sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
                <span className="text-sm font-extrabold text-[#C0392B] tracking-[-0.3px]">HamroNepal</span>
                <span className="text-[11px] font-semibold text-[#888] tracking-[0.5px] uppercase">Bazaar</span>
              </div>
            </Link>
          </div>

          <div className="px-3 py-4 flex-1 overflow-y-auto">
            <div className={`${navLabel} ${sidebarCollapsed ? "hidden" : ""}`}>Menu</div>
            {sidebarItems.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${navItemBase} ${activeTab === item.id ? navItemActive : navItemIdle}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                <span className={navIcon}>
                  <item.icon size={18} />
                </span>
                <span className={`transition-opacity duration-200 ${collapsedHide}`}>{item.label}</span>
              </Link>
            ))}

            <div className={`${navLabel} mt-4 ${sidebarCollapsed ? "hidden" : ""}`}>Account</div>
            {sidebarItems.slice(4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${navItemBase} ${activeTab === item.id ? navItemActive : navItemIdle}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                <span className={navIcon}>
                  <item.icon size={18} />
                </span>
                <span className={`transition-opacity duration-200 ${collapsedHide}`}>{item.label}</span>
              </Link>
            ))}

            {/* Delete Account */}
            <button
              type="button"
              className={`${navItemBase} ${navItemDanger}`}
              onClick={() => { setShowDeleteModal(true); setSidebarOpen(false); }}
              title="Delete Account"
            >
              <span className={navIcon}>
                <FiTrash2 size={18} />
              </span>
              <span className={`transition-opacity duration-200 ${collapsedHide}`}>Delete Account</span>
            </button>
          </div>

          {/* Sidebar footer intentionally left empty */}
        </aside>

        {/* ── Main Area ── */}
        <div
          className={`flex-1 flex flex-col min-h-dvh min-w-0 transition-[margin-left] duration-300 ease-in-out ml-0 w-full ${
            sidebarCollapsed ? "lg:ml-[72px] lg:w-[calc(100%-72px)]" : "lg:ml-[260px] lg:w-[calc(100%-260px)]"
          }`}
        >
          {/* Top Header */}
          <header className="bg-white border-b border-[#e2e8f0] px-8 h-16 flex items-center justify-between sticky top-0 z-50 gap-4 max-lg:px-5 max-md:px-4 max-md:h-14 max-[480px]:px-3">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Hamburger - mobile only */}
              <button
                type="button"
                className={`hidden max-lg:flex w-[38px] h-[38px] ${squareBtn}`}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FiMenu size={20} />
              </button>
              {/* Desktop toggle - desktop only */}
              <button
                type="button"
                className={`flex max-lg:hidden w-9 h-9 ${squareBtn}`}
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <FiMoreHorizontal size={18} />
              </button>
              <h1 className="text-xl font-bold text-[#1e293b] tracking-[-0.3px] whitespace-nowrap overflow-hidden text-ellipsis max-md:text-lg">Settings</h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {/* Notifications Bell */}
              <div className="relative" ref={notifDropdownRef}>
                <button
                  type="button"
                  className={iconBtn}
                  title="Notifications"
                  onClick={() => {
                    setShowNotifDropdown((v) => !v);
                    setNotifSeen(true);
                    if (securityNotifs.some((n) => !n.read)) {
                      fetch("/api/user/notifications/security/mark-read", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                      }).then(() => {
                       setSecurityNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
                      });
                    }

                  }}
                >
                  <FiBell size={18} />
                  {notificationCount > 0 && !notifSeen && (
                    <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute top-[calc(100%+10px)] right-0 bg-white border border-[#e2e8f0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] min-w-[280px] z-[999] overflow-hidden animate-[dropdownIn_0.15s_ease]">
                    <div className="px-4 py-3 border-b border-[#f1f5f9] font-bold text-[13px] text-[#1e293b]">
                      Notifications
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#475569] ${
                            i < notifications.length - 1 ? "border-b border-[#f8fafc]" : ""
                          }`}
                        >
                          <FiAlertCircle size={15} color="#f59e0b" className="shrink-0" />
                          {msg}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-[13px] text-[#94a3b8] text-center">
                        You&apos;re all caught up ✓
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Avatar Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 py-[5px] pr-2.5 pl-[5px] rounded-[40px] border-[1.5px] border-[#e2e8f0] bg-white cursor-pointer transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C0392B] to-[#e74c3c] flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                    {session?.user?.image
                      ? <img src={getImageUrl(session.user.image)} alt="avatar" className="w-full h-full object-cover" />
                      : userInitials
                    }
                  </div>
                  <FiChevronDown size={14} className={`text-[#94a3b8] transition-transform duration-200 shrink-0 ${showProfileDropdown ? "rotate-180" : ""}`} />
                </button>

                {showProfileDropdown && (
                  <div className="absolute top-[calc(100%+8px)] right-0 bg-white border border-[#e2e8f0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] min-w-[200px] z-[999] overflow-hidden animate-[dropdownIn_0.15s_ease]">
                    <div className="pt-3.5 pb-3 px-4 border-b border-[#f1f5f9]">
                      <div className="text-sm font-bold text-[#1e293b]">{session?.user?.name || "User"}</div>
                      <div className="text-xs text-[#94a3b8] mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{session?.user?.email || ""}</div>
                    </div>
                    <Link
                      href="/user/dashboard"
                      className={`${dropdownItemBase} text-[#475569] hover:bg-[#f8fafc] hover:text-[#1e293b]`}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FiUser size={15} />
                      Dashboard
                    </Link>
                    <div className="h-px bg-[#f1f5f9]" />
                    <button
                      type="button"
                      className={`${dropdownItemBase} text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626]`}
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-8 py-7 overflow-y-auto min-w-0 max-lg:px-5 max-lg:pt-5 max-lg:pb-8 max-md:p-4 max-[480px]:p-3">
            {/* Profile Header */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 mb-6 flex items-center gap-6 relative flex-wrap max-md:flex-col max-md:text-center max-md:p-6 max-md:gap-4 max-[480px]:p-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C0392B] to-[#e74c3c] flex items-center justify-center text-white text-[28px] font-bold overflow-hidden max-md:w-16 max-md:h-16 max-md:text-[22px] max-[480px]:w-14 max-[480px]:h-14 max-[480px]:text-xl">
                  {session?.user?.image
                    ? <img src={getImageUrl(session.user.image)} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    : userInitials}
                </div>
                <button
                  type="button"
                  className={`absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-[#e2e8f0] rounded-full flex items-center justify-center text-[#64748b] transition-all duration-200 hover:border-[#C0392B] hover:text-[#C0392B] max-[480px]:w-6 max-[480px]:h-6 ${
                    uploadingAvatar ? "cursor-wait" : "cursor-pointer"
                  }`}
                  title="Change photo"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  <FiCamera size={12} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[22px] font-bold text-[#1e293b] tracking-[-0.3px] mb-1 max-md:text-lg">{session?.user?.name || "User"}</div>
                <div className="text-sm text-[#64748b] font-medium">Member · Kathmandu, Nepal</div>
              </div>
              
              <div className="flex gap-2.5 shrink-0 max-md:w-full max-md:justify-center">
                <button
                  type="button"
                  className={isEditing ? btnPrimary : `${btnGhost} text-[#475569]`}
                  onClick={() => (isEditing ? handleProfileSave() : setIsEditing(true))}
                  disabled={savingProfile}
                >
                  {isEditing ? (
                    <>
                      <FiCheck size={14} /> {savingProfile ? "Saving..." : "Save Changes"}
                    </>
                  ) : (
                    <>
                      <FiEdit2 size={14} /> Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Account Details — Password field removed */}
            <div className={sectionHeader}>
              <h3 className={sectionTitle}>Account Information</h3>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden mb-6 w-full">
              {profileFields.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center gap-0 px-6 border-b border-[#f8fafc] transition-colors duration-200 hover:bg-[#fafbfc] last:border-b-0 max-md:flex-col max-md:items-start max-md:px-4 max-md:py-3.5 max-md:gap-1.5"
                >
                  <div className="basis-[180px] grow-0 shrink-0 flex items-center gap-2.5 text-[13px] text-[#475569] font-semibold py-[18px] [&_svg]:text-[#94a3b8] max-md:basis-auto max-md:p-0 max-md:text-xs">
                    <field.icon size={16} />
                    {field.label}
                  </div>
                  {isEditing && field.editable ? (
                    <input
                      type={field.type}
                      className={`${formInputBase} flex-1 text-sm max-md:w-full`}
                      value={field.value}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  ) : (
                    <div className="flex-1 text-sm text-[#1e293b] font-medium py-[18px] min-w-0 max-md:p-0 max-md:text-[13px]">{field.value || "-"}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Security Section */}
            <div className={sectionHeader}>
              <h3 className={sectionTitle}>Security</h3>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 mb-6 w-full">
              <div className="flex items-center justify-between py-3.5 border-b border-[#f8fafc] gap-3 flex-wrap last:border-b-0 last:pb-0 max-md:flex-col max-md:items-start max-md:gap-2.5">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#1e293b] mb-[3px] max-md:text-[13px]">Two-Factor Authentication</h4>
                  <p className="text-xs text-[#64748b] max-md:text-[11px]">
                    {twoFactorEnabled
                      ? "Your account is protected with an extra verification step."
                      : "Add an extra layer of security to your account"}
                  </p>
                </div>
                {twoFactorEnabled ? (
                  <button type="button" className={`${btnGhost} text-[#ef4444]`} onClick={() => setShowDisable2FAModal(true)}>
                    Disable
                  </button>
                ) : (
                  <button type="button" className={`${btnGhost} text-[#475569]`} onClick={handleRequestEnable2FA} disabled={tfaRequesting}>
                    {tfaRequesting ? "Sending code..." : "Enable"}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between py-3.5 border-b border-[#f8fafc] gap-3 flex-wrap last:border-b-0 last:pb-0 max-md:flex-col max-md:items-start max-md:gap-2.5">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#1e293b] mb-[3px] max-md:text-[13px]">Active Sessions</h4>
                  <p className="text-xs text-[#64748b] max-md:text-[11px]">Manage devices where you&apos;re currently logged in</p>
                </div>
                <button type="button" className={`${btnGhost} text-[#475569]`} onClick={() => { setShowSessionsModal(true); loadSessions(); }}>
                  Manage
                </button>
              </div>
              </div>

            {/* Change Password Section */}
            <div className={sectionHeader}>
              <h3 className={sectionTitle}>Change Password</h3>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-7 mb-6 w-full max-md:p-5 max-[480px]:p-4">
              {isOAuthUser ? (
                <p className="text-sm text-[#64748b] py-4 leading-[1.6]">
                  You signed in with {session?.user?.provider || "a social account"}. Password management
                  is handled by your {session?.user?.provider || "social"} account and cannot be changed here.
                </p>
              ) : (
                <>
                  <div className="flex flex-col gap-4 mb-5">
                    <div className="flex flex-col gap-1.5">
                      <label className={pwLabel}>
                        <FiLock size={14} />
                        Current Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showCurrentPw ? "text" : "password"}
                          className={pwInput}
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className={pwEyeBtn}
                          onClick={() => setShowCurrentPw((p) => !p)}
                          title={showCurrentPw ? "Hide" : "Show"}
                        >
                          {showCurrentPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={pwLabel}>
                        <FiLock size={14} />
                        New Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showNewPw ? "text" : "password"}
                          className={pwInput}
                          placeholder="At least 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className={pwEyeBtn}
                          onClick={() => setShowNewPw((p) => !p)}
                          title={showNewPw ? "Hide" : "Show"}
                        >
                          {showNewPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={pwLabel}>
                        <FiLock size={14} />
                        Confirm New Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showConfirmPw ? "text" : "password"}
                          className={pwInput}
                          placeholder="Repeat new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className={pwEyeBtn}
                          onClick={() => setShowConfirmPw((p) => !p)}
                          title={showConfirmPw ? "Hide" : "Show"}
                        >
                          {showConfirmPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={pwSubmitBtn}
                    onClick={handlePasswordUpdate}
                    disabled={isSubmittingPw}
                  >
                    <FiLock size={14} />
                    {isSubmittingPw ? "Updating..." : "Update Password"}
                  </button>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

    {/* ── Delete Account Confirmation Modal ── */}
    {showDeleteModal && (
      <div className={modalOverlay} onClick={() => !deleting && setShowDeleteModal(false)}>
        <div className={`${modalBox} max-w-[420px]`} onClick={(e) => e.stopPropagation()}>
          <div className={`${modalIconBase} bg-[#fef2f2] text-[#ef4444]`}>
            <FiAlertTriangle size={26} />
          </div>
          <div className={`${modalTitle} mb-2`}>Delete Your Account?</div>
          <div className={modalBody}>
            This action is <strong>permanent and irreversible</strong>. All your orders,
            wishlist, and personal data will be permanently deleted.
          </div>
          {deleteError && (
            <div className={modalError}>{deleteError}</div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              className={modalCancel}
              onClick={() => { setShowDeleteModal(false); setDeleteError(""); }}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className={modalDelete}
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 size={15} />
                  Yes, Delete Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── Active Sessions Modal ── */}
    {showSessionsModal && (
      <div className={modalOverlay} onClick={() => setShowSessionsModal(false)}>
        <div className={`${modalBox} max-w-[480px]`} onClick={(e) => e.stopPropagation()}>
          <div className={`${modalTitle} mb-4`}>Active Sessions</div>

          {loadingSessions ? (
            <div className="text-center py-5 text-[#94a3b8] text-[13px]">
              Loading...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-5 text-[#94a3b8] text-[13px]">
              No active sessions found.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 mb-5 max-h-[50vh] overflow-y-auto pr-1">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-3.5 py-3 border border-[#e2e8f0] rounded-[10px] gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#1e293b] flex items-center gap-1.5">
                      {s.deviceLabel || "Unknown device"}
                      {s.isCurrent && (
                        <span className="text-[10px] font-bold text-[#16a34a] bg-[#f0fdf4] px-1.5 py-0.5 rounded-md">
                          This device
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5">
                      {s.ipAddress || "Unknown IP"} · Last active {new Date(s.lastActiveAt).toLocaleString()}
                    </div>
                  </div>
                  {!s.isCurrent && (
                    <button
                      type="button"
                      className={`${btnGhost} shrink-0 text-[#ef4444]`}
                      onClick={() => handleRevokeSession(s.id)}
                      disabled={revokingId === s.id}
                    >
                      {revokingId === s.id ? "Revoking..." : "Revoke"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className={`${modalCancel} w-full`}
            onClick={() => setShowSessionsModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    )}

    
        {/* ── Enable 2FA — Verify OTP Modal ── */}
        {show2FAModal && (
          <div className={modalOverlay} onClick={() => !tfaConfirming && setShow2FAModal(false)}>
            <div className={`${modalBox} max-w-[420px]`} onClick={(e) => e.stopPropagation()}>
              <div className={`${modalIconBase} bg-[#eef2ff] text-[#4f46e5]`}>
                <FiShield size={26} />
              </div>
              <div className={`${modalTitle} mb-2`}>Verify Your Identity</div>
              <div className={modalBody}>
                Enter the 6-digit code we sent you to finish enabling two-factor authentication.
              </div>

              {tfaError && <div className={modalError}>{tfaError}</div>}

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className={otpInput}
                placeholder="000000"
                value={tfaOtp}
                onChange={(e) => setTfaOtp(e.target.value.replace(/\D/g, ""))}
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  className={modalCancel}
                  onClick={() => { setShow2FAModal(false); setTfaError(""); }}
                  disabled={tfaConfirming}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`${pwSubmitBtn} flex-1 justify-center`}
                  onClick={handleConfirmEnable2FA}
                  disabled={tfaConfirming}
                >
                  {tfaConfirming ? "Verifying..." : "Verify & Enable"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Disable 2FA Confirmation Modal ── */}
        {showDisable2FAModal && (
          <div className={modalOverlay} onClick={() => !tfaDisabling && setShowDisable2FAModal(false)}>
            <div className={`${modalBox} max-w-[420px]`} onClick={(e) => e.stopPropagation()}>
              <div className={`${modalIconBase} bg-[#fef2f2] text-[#ef4444]`}>
                <FiAlertTriangle size={26} />
              </div>
              <div className={`${modalTitle} mb-2`}>Disable Two-Factor Authentication?</div>
              <div className={modalBody}>
                This will <strong>remove the extra verification step</strong> when you log in.
                Your account will rely on your password alone.
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={modalCancel}
                  onClick={() => setShowDisable2FAModal(false)}
                  disabled={tfaDisabling}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={modalDelete}
                  onClick={handleDisable2FA}
                  disabled={tfaDisabling}
                >
                  {tfaDisabling ? "Disabling..." : "Yes, Disable"}
                </button>
              </div>
            </div>
          </div>
        )}
 
 {/* ── Phone OTP Verification Modal ── */}
        {showPhoneOtpModal && (
          <div className={modalOverlay} onClick={() => !confirmingPhone && setShowPhoneOtpModal(false)}>
            <div className={`${modalBox} max-w-[420px]`} onClick={(e) => e.stopPropagation()}>
              <div className={`${modalIconBase} bg-[#eef2ff] text-[#4f46e5]`}>
                <FiPhone size={26} />
              </div>
              <div className={`${modalTitle} mb-2`}>Verify New Phone Number</div>
              <div className={modalBody}>
                Enter the 6-digit code sent to {pendingPhone} to confirm this number.
              </div>

              {phoneOtpError && <div className={modalError}>{phoneOtpError}</div>}

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className={otpInput}
                placeholder="000000"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                autoFocus
              />

              <div className="flex gap-3">
              <button
                  type="button"
                  className={modalCancel}
                  onClick={() => {
                    setShowPhoneOtpModal(false);
                    setPhoneOtpError("");
                    setProfileForm((prev) => ({ ...prev, phone: session?.user?.phone || "" }));
                  }}
                  disabled={confirmingPhone}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`${pwSubmitBtn} flex-1 justify-center`}
                  onClick={handleConfirmPhoneOtp}
                  disabled={confirmingPhone}
                >
                  {confirmingPhone ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          </div>
        )}
  </>
);
}