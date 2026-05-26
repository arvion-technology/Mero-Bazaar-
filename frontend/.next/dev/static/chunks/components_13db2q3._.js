(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/HeroSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// popular searches to show below the search bar
const popularSearches = [
    "Bajaj N160",
    "2BHK Rent Kathmandu",
    "Plumber",
    "Australia Study",
    "Driver Job"
];
// all the locations for the dropdown
const locations = [
    "All Nepal",
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Pokhara",
    "Chitwan",
    "Butwal",
    "Biratnagar",
    "Birgunj",
    "Dharan"
];
// trust badges that show at the bottom - each has an icon, title and subtitle
const trustBadges = [
    {
        id: "verified",
        icon: // verified sellers icon
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "28",
            height: "28",
            viewBox: "0 0 28 28",
            fill: "none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "14",
                    cy: "14",
                    r: "13",
                    stroke: "#C0392B",
                    strokeWidth: "1.5",
                    fill: "#fff5f5"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M14 4l2.2 6.5H23l-5.5 4 2.1 6.5L14 17l-5.6 4 2.1-6.5L5 10.5h6.8L14 4z",
                    fill: "none",
                    stroke: "#C0392B",
                    strokeWidth: "1.5",
                    strokeLinejoin: "round"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M10 14l2.5 2.5L18 11",
                    stroke: "#C0392B",
                    strokeWidth: "1.8",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/HeroSection.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        title: "Verified Sellers",
        sub: "10,000+ Trusted"
    },
    {
        id: "blockchain",
        icon: // blockchain icon - not sure if we actually need this one
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "28",
            height: "28",
            viewBox: "0 0 28 28",
            fill: "none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "1.5",
                    y: "1.5",
                    width: "25",
                    height: "25",
                    rx: "5",
                    stroke: "#4B6BFB",
                    strokeWidth: "1.5",
                    fill: "#f0f3ff"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "9",
                    y: "9",
                    width: "10",
                    height: "10",
                    rx: "2",
                    stroke: "#4B6BFB",
                    strokeWidth: "1.5",
                    fill: "none"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M14 9V6M14 22v-3M9 14H6M22 14h-3",
                    stroke: "#4B6BFB",
                    strokeWidth: "1.5",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "14",
                    cy: "14",
                    r: "2",
                    fill: "#4B6BFB"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/HeroSection.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        title: "Blockchain Verified",
        sub: "Tamper-proof records"
    },
    {
        id: "payments",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "28",
            height: "28",
            viewBox: "0 0 28 28",
            fill: "none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "1.5",
                    y: "5.5",
                    width: "25",
                    height: "17",
                    rx: "3",
                    stroke: "#27AE60",
                    strokeWidth: "1.5",
                    fill: "#f0fff5"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M1.5 10.5h25",
                    stroke: "#27AE60",
                    strokeWidth: "1.5"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "5",
                    y: "15",
                    width: "6",
                    height: "3",
                    rx: "1",
                    fill: "#27AE60",
                    opacity: "0.7"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "13",
                    y: "15",
                    width: "4",
                    height: "3",
                    rx: "1",
                    fill: "#27AE60",
                    opacity: "0.4"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/HeroSection.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        title: "Safe Payments",
        sub: "eSewa, Khalti, ConnectIPS"
    },
    {
        id: "protection",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "28",
            height: "28",
            viewBox: "0 0 28 28",
            fill: "none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M14 2.5L4 7v7c0 6 4.5 10.5 10 11.5C19.5 24.5 24 20 24 14V7L14 2.5z",
                    stroke: "#F39C12",
                    strokeWidth: "1.5",
                    fill: "#fff9f0"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M10 14l2.5 2.5L18 11",
                    stroke: "#F39C12",
                    strokeWidth: "1.8",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/HeroSection.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        title: "Buyer Protection",
        sub: "Escrow & Dispute Support"
    },
    {
        id: "support",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "28",
            height: "28",
            viewBox: "0 0 28 28",
            fill: "none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "14",
                    cy: "14",
                    r: "12.5",
                    stroke: "#8E44AD",
                    strokeWidth: "1.5",
                    fill: "#faf0ff"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M9 12a5 5 0 0110 0v3a2 2 0 01-2 2h-1a1 1 0 01-1-1v-2a1 1 0 011-1h1",
                    stroke: "#8E44AD",
                    strokeWidth: "1.5",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M9 12v3a2 2 0 002 2h1a1 1 0 001-1v-2a1 1 0 00-1-1H11",
                    stroke: "#8E44AD",
                    strokeWidth: "1.5",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/HeroSection.tsx",
            lineNumber: 87,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        title: "24/7 Support",
        sub: "We are here for you"
    }
];
function HeroSection() {
    _s();
    // state for the search input and location dropdown
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All Nepal");
    const [locOpen, setLocOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const locRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // close location dropdown when clicking outside - same pattern as navbar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroSection.useEffect": ()=>{
            function handleOutside(e) {
                if (locRef.current && !locRef.current.contains(e.target)) {
                    setLocOpen(false);
                }
            }
            document.addEventListener("mousedown", handleOutside);
            return ({
                "HeroSection.useEffect": ()=>document.removeEventListener("mousedown", handleOutside)
            })["HeroSection.useEffect"];
        }
    }["HeroSection.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .hero-wrap {
          width: 100%;
          position: relative;
          overflow: hidden;
          min-height: 340px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('/hero-bg.jpg');
          background-size: cover;
          background-position: center 40%;
          z-index: 0;
        }
        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.38) 0%,
            rgba(0,0,0,0.18) 55%,
            rgba(255,255,255,0.85) 100%
          );
        }
        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 36px 24px 0;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(39,174,96,0.4);
          border-radius: 20px;
          padding: 4px 14px 4px 8px;
          font-size: 12px;
          font-weight: 500;
          color: #222;
          margin-bottom: 16px;
          backdrop-filter: blur(6px);
        }
        .hero-badge-dot {
          width: 8px; height: 8px;
          background: #27AE60;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-dot {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.35); opacity: 0.7; }
        }
        .hero-h1 {
          font-size: clamp(30px, 5vw, 48px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 4px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.35);
          letter-spacing: -0.5px;
        }
        .hero-h1-red {
          color: #E74C3C;
          display: block;
          font-size: clamp(34px, 5.5vw, 54px);
          font-weight: 900;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
        }
        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.92);
          margin: 8px 0 22px;
          font-weight: 400;
          text-shadow: 0 1px 6px rgba(0,0,0,0.3);
        }
        .hero-search-box {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.14);
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 700px;
          overflow: visible;
          position: relative;
          z-index: 10;
        }
        .hero-search-icon {
          padding: 0 12px 0 16px;
          color: #999;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .hero-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #333;
          background: transparent;
          padding: 13px 8px 13px 0;
          font-family: inherit;
        }
        .hero-search-input::placeholder { color: #aaa; }
        .hero-divider {
          width: 1px;
          height: 28px;
          background: #e0e0e0;
          flex-shrink: 0;
        }
        .hero-loc-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .hero-loc-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 13px 14px;
          font-size: 13.5px;
          font-weight: 500;
          color: #444;
          background: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
        }
        .hero-loc-chevron { transition: transform 0.2s; }
        .hero-loc-chevron.open { transform: rotate(180deg); }
        .hero-loc-dropdown {
          position: absolute;
          bottom: calc(100% + 4px);
          right: 0;
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 10px;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.13);
          z-index: 9999;
          min-width: 160px;
          max-height: 220px;
          overflow-y: auto;
          overflow-x: hidden;
          animation: fadeUp 0.15s ease;
          scrollbar-width: thin;
          scrollbar-color: #ddd transparent;
        }
        .hero-loc-dropdown::-webkit-scrollbar { width: 4px; }
        .hero-loc-dropdown::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-loc-opt {
          display: block;
          padding: 9px 16px;
          font-size: 13px;
          color: #444;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        .hero-loc-opt:hover { background: #fff5f5; color: #C0392B; }
        .hero-loc-opt.selected { color: #C0392B; font-weight: 600; }
        .hero-search-btn {
          background: #C0392B;
          color: #fff;
          border: none;
          border-radius: 0 9px 9px 0;
          padding: 13px 22px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
          font-family: inherit;
          flex-shrink: 0;
          letter-spacing: 0.2px;
        }
        .hero-search-btn:hover { background: #a93226; }
        .hero-popular {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
          justify-content: center;
          padding-bottom: 28px;
        }
        .hero-popular-label {
          font-size: 12.5px;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .hero-chip {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.45);
          border-radius: 20px;
          font-size: 12px;
          color: #fff;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          font-weight: 500;
          white-space: nowrap;
        }
        .hero-chip:hover {
          background: rgba(255,255,255,0.35);
          color: #fff;
        }

        /* trust badges section at the bottom */
        .trust-bar {
          background: #fff;
          border-top: 1px solid #f0f0f0;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
          position: relative;
          z-index: 2;
        }
        .trust-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 16px 18px;
          flex: 1;
          border-right: 1px solid #f0f0f0;
        }
        .trust-item:last-child { border-right: none; }
        .trust-icon { flex-shrink: 0; }
        .trust-title {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
        }
        .trust-sub {
          font-size: 11.5px;
          color: #888;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
        }

        /* mobile styles */
        @media (max-width: 768px) {
          .trust-inner {
            flex-wrap: wrap;
            padding: 0 12px;
          }
          .trust-item {
            flex: 1 1 45%;
            border-right: none;
            border-bottom: 1px solid #f0f0f0;
            padding: 12px 10px;
          }
          .hero-search-box { max-width: 95%; }
        }
        @media (max-width: 480px) {
          .trust-item { flex: 1 1 100%; }
          .hero-popular { display: none; }
        }
      `
            }, void 0, false, {
                fileName: "[project]/components/HeroSection.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "hero-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hero-bg"
                    }, void 0, false, {
                        fileName: "[project]/components/HeroSection.tsx",
                        lineNumber: 416,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hero-content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-badge",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hero-badge-dot"
                                    }, void 0, false, {
                                        fileName: "[project]/components/HeroSection.tsx",
                                        lineNumber: 421,
                                        columnNumber: 13
                                    }, this),
                                    "नेपालको सबैभन्दा भरोसायो डिजिटल मार्केटप्लेस"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/HeroSection.tsx",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "hero-h1",
                                children: [
                                    "किन्ने, बेच्ने, बुक गर्ने",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hero-h1-red",
                                        children: "सबै एकै ठाउमा"
                                    }, void 0, false, {
                                        fileName: "[project]/components/HeroSection.tsx",
                                        lineNumber: 428,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/HeroSection.tsx",
                                lineNumber: 426,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "hero-sub",
                                children: "Buy, Sell, Book and Find Trusted Services Across Nepal"
                            }, void 0, false, {
                                fileName: "[project]/components/HeroSection.tsx",
                                lineNumber: 432,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-search-box",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-search-icon",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "18",
                                            height: "18",
                                            fill: "none",
                                            stroke: "#aaa",
                                            viewBox: "0 0 24 24",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "11",
                                                    cy: "11",
                                                    r: "7",
                                                    strokeWidth: "2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/HeroSection.tsx",
                                                    lineNumber: 439,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M21 21l-4.35-4.35",
                                                    strokeWidth: "2",
                                                    strokeLinecap: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/HeroSection.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/HeroSection.tsx",
                                            lineNumber: 438,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/HeroSection.tsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        className: "hero-search-input",
                                        placeholder: "Search vehicles, jobs, plumbers, clinics, and more...",
                                        value: query,
                                        onChange: (e)=>setQuery(e.target.value),
                                        onKeyDown: (e)=>e.key === "Enter" && console.log("search:", query)
                                    }, void 0, false, {
                                        fileName: "[project]/components/HeroSection.tsx",
                                        lineNumber: 444,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-divider"
                                    }, void 0, false, {
                                        fileName: "[project]/components/HeroSection.tsx",
                                        lineNumber: 453,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-loc-wrap",
                                        ref: locRef,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "hero-loc-btn",
                                                onClick: ()=>setLocOpen(!locOpen),
                                                children: [
                                                    location,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: `hero-loc-chevron${locOpen ? " open" : ""}`,
                                                        width: "12",
                                                        height: "12",
                                                        fill: "none",
                                                        stroke: "#999",
                                                        viewBox: "0 0 24 24",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2.5,
                                                            d: "M19 9l-7 7-7-7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/HeroSection.tsx",
                                                            lineNumber: 466,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/HeroSection.tsx",
                                                        lineNumber: 462,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/HeroSection.tsx",
                                                lineNumber: 457,
                                                columnNumber: 15
                                            }, this),
                                            locOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hero-loc-dropdown",
                                                children: locations.map((loc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `hero-loc-opt${location === loc ? " selected" : ""}`,
                                                        onClick: ()=>{
                                                            setLocation(loc);
                                                            setLocOpen(false);
                                                        },
                                                        children: loc
                                                    }, loc, false, {
                                                        fileName: "[project]/components/HeroSection.tsx",
                                                        lineNumber: 474,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/HeroSection.tsx",
                                                lineNumber: 472,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/HeroSection.tsx",
                                        lineNumber: 456,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "hero-search-btn",
                                        children: "Search"
                                    }, void 0, false, {
                                        fileName: "[project]/components/HeroSection.tsx",
                                        lineNumber: 486,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/HeroSection.tsx",
                                lineNumber: 435,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-popular",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hero-popular-label",
                                        children: "Popular Searches:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/HeroSection.tsx",
                                        lineNumber: 491,
                                        columnNumber: 13
                                    }, this),
                                    popularSearches.map((term)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/search?q=${encodeURIComponent(term)}`,
                                            className: "hero-chip",
                                            children: term
                                        }, term, false, {
                                            fileName: "[project]/components/HeroSection.tsx",
                                            lineNumber: 493,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/HeroSection.tsx",
                                lineNumber: 490,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/HeroSection.tsx",
                        lineNumber: 418,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/HeroSection.tsx",
                lineNumber: 415,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "trust-bar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "trust-inner",
                    children: trustBadges.map((badge)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "trust-item",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "trust-icon",
                                    children: badge.icon
                                }, void 0, false, {
                                    fileName: "[project]/components/HeroSection.tsx",
                                    lineNumber: 507,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "trust-title",
                                            children: badge.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/HeroSection.tsx",
                                            lineNumber: 509,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "trust-sub",
                                            children: badge.sub
                                        }, void 0, false, {
                                            fileName: "[project]/components/HeroSection.tsx",
                                            lineNumber: 510,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/HeroSection.tsx",
                                    lineNumber: 508,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, badge.id, true, {
                            fileName: "[project]/components/HeroSection.tsx",
                            lineNumber: 506,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/HeroSection.tsx",
                    lineNumber: 503,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/HeroSection.tsx",
                lineNumber: 502,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(HeroSection, "fxOujfKOaZH2cJXqzLiBpA14Jwg=");
_c = HeroSection;
var _c;
__turbopack_context__.k.register(_c, "HeroSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/BrowseCategories.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrowseCategories
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
"use client";
;
;
;
const categories = [
    {
        id: "vehicles",
        label: "Vehicles",
        count: "12,540 Listings",
        href: "/category/vehicles",
        bg: "#fff0f0",
        img: "/vehicle.png"
    },
    {
        id: "property",
        label: "Property",
        count: "8,732 Listings",
        href: "/category/property",
        bg: "#f0f4ff",
        img: "/property.png"
    },
    {
        id: "jobs",
        label: "Jobs",
        count: "6,245 Listings",
        href: "/category/jobs",
        bg: "#f0fff5",
        img: "/jobs.png"
    },
    {
        id: "medical",
        label: "Medical",
        count: "3,421 Listings",
        href: "/category/medical",
        bg: "#f0f8ff",
        img: "/medical.png"
    },
    {
        id: "education",
        label: "Education",
        count: "2,184 Listings",
        href: "/category/education",
        bg: "#f5f0ff",
        img: "/education.png"
    },
    {
        id: "construction",
        label: "Construction",
        count: "4,567 Listings",
        href: "/category/construction",
        bg: "#fff9f0",
        img: "/construction.png"
    },
    {
        id: "electronics",
        label: "Electronics",
        count: "5,231 Listings",
        href: "/category/electronics",
        bg: "#f0f4ff",
        img: "/electronics.png"
    },
    {
        id: "beauty",
        label: "Beauty & Wellness",
        count: "3,987 Listings",
        href: "/category/beauty",
        bg: "#fff0f8",
        img: "/beauty and wellness.png"
    },
    {
        id: "home-services",
        label: "Home Services",
        count: "4,321 Listings",
        href: "/category/home-services",
        bg: "#fff9f0",
        img: "/home services.png"
    },
    {
        id: "food",
        label: "Food & Restaurants",
        count: "2,876 Listings",
        href: "/category/food",
        bg: "#f0fff5",
        img: "/food and restaurants.png"
    },
    {
        id: "travel",
        label: "Travel & Tourism",
        count: "1,982 Listings",
        href: "/category/travel",
        bg: "#f0f8ff",
        img: "/travel and tourism.png"
    },
    {
        id: "more",
        label: "More Categories",
        count: "Explore all",
        href: "/categories",
        bg: "#f5f5f5",
        img: null
    }
];
function BrowseCategories() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .bc-section {
          background: #fff;
          padding: 36px 0 40px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .bc-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .bc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .bc-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          margin: 0;
        }
        .bc-view-all {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13.5px;
          font-weight: 600;
          color: #C0392B;
          text-decoration: none;
          transition: gap 0.2s, opacity 0.2s;
        }
        .bc-view-all:hover {
          opacity: 0.8;
          gap: 8px;
        }
        .bc-view-all-arrow {
          font-size: 15px;
          transition: transform 0.2s;
        }
        .bc-view-all:hover .bc-view-all-arrow {
          transform: translateX(2px);
        }

        /* Grid */
        .bc-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
        }

        /* Card */
        .bc-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 20px 10px 16px;
          background: #fff;
          border: 1.5px solid #f0f0f0;
          border-radius: 12px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          text-align: center;
          min-height: 110px;
        }
        .bc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.1);
          border-color: #e0e0e0;
        }

        .bc-icon-wrap {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          transition: transform 0.2s ease;
        }
        .bc-card:hover .bc-icon-wrap {
          transform: scale(1.07);
        }

        .bc-label {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          margin: 0;
        }
        .bc-count {
          font-size: 11.5px;
          color: #888;
          font-weight: 400;
          margin: 0;
          line-height: 1;
        }

        /* More categories dots */
        .bc-more-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 100%;
          height: 100%;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .bc-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 640px) {
          .bc-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .bc-card { padding: 14px 8px 12px; min-height: 90px; }
          .bc-icon-wrap { width: 48px; height: 48px; }
          .bc-title { font-size: 17px; }
        }
        @media (max-width: 400px) {
          .bc-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `
            }, void 0, false, {
                fileName: "[project]/components/BrowseCategories.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bc-section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bc-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bc-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "bc-title",
                                    children: "Browse Categories"
                                }, void 0, false, {
                                    fileName: "[project]/components/BrowseCategories.tsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/categories",
                                    className: "bc-view-all",
                                    children: [
                                        "View All Categories",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "bc-view-all-arrow",
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/components/BrowseCategories.tsx",
                                            lineNumber: 250,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/BrowseCategories.tsx",
                                    lineNumber: 248,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/BrowseCategories.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bc-grid",
                            children: categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: cat.href,
                                    className: "bc-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bc-icon-wrap",
                                            style: {
                                                background: cat.bg
                                            },
                                            children: cat.img ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: cat.img,
                                                alt: cat.label,
                                                width: 58,
                                                height: 58,
                                                style: {
                                                    objectFit: "cover",
                                                    width: "100%",
                                                    height: "100%",
                                                    borderRadius: "50%"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/BrowseCategories.tsx",
                                                lineNumber: 263,
                                                columnNumber: 21
                                            }, this) : /* More Categories — dots fallback */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bc-more-dots",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "36",
                                                    height: "36",
                                                    viewBox: "0 0 36 36",
                                                    fill: "none",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: "10",
                                                            cy: "18",
                                                            r: "3",
                                                            fill: "#aaa"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/BrowseCategories.tsx",
                                                            lineNumber: 274,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: "18",
                                                            cy: "18",
                                                            r: "3",
                                                            fill: "#aaa"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/BrowseCategories.tsx",
                                                            lineNumber: 275,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: "26",
                                                            cy: "18",
                                                            r: "3",
                                                            fill: "#aaa"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/BrowseCategories.tsx",
                                                            lineNumber: 276,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/BrowseCategories.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/BrowseCategories.tsx",
                                                lineNumber: 272,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/BrowseCategories.tsx",
                                            lineNumber: 258,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "bc-label",
                                                    children: cat.label
                                                }, void 0, false, {
                                                    fileName: "[project]/components/BrowseCategories.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "bc-count",
                                                    children: cat.count
                                                }, void 0, false, {
                                                    fileName: "[project]/components/BrowseCategories.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/BrowseCategories.tsx",
                                            lineNumber: 281,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, cat.id, true, {
                                    fileName: "[project]/components/BrowseCategories.tsx",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/BrowseCategories.tsx",
                            lineNumber: 255,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/BrowseCategories.tsx",
                    lineNumber: 244,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/BrowseCategories.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = BrowseCategories;
var _c;
__turbopack_context__.k.register(_c, "BrowseCategories");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/FeaturedListings.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FeaturedListings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const listings = [
    {
        id: "bajaj-pulsar",
        title: "Bajaj Pulsar N160 Dual Channel",
        location: "Kathmandu, Bagmati",
        price: "Rs. 3,25,000",
        meta: [
            "2023",
            "12K km"
        ],
        badge: "VERIFIED",
        badgeColor: "#27AE60",
        href: "/listing/bajaj-pulsar",
        image: "/bajaj.avif",
        category: "vehicles"
    },
    {
        id: "2bhk-apartment",
        title: "2BHK Apartment for Rent",
        location: "Lalitpur, Bagmati",
        price: "Rs. 22,000 / month",
        meta: [
            "2 Beds",
            "2 Baths"
        ],
        badge: "VERIFIED",
        badgeColor: "#27AE60",
        href: "/listing/2bhk-apartment",
        image: "/apartment.avif",
        category: "property"
    },
    {
        id: "senior-frontend",
        title: "Senior Frontend Developer",
        location: "Kathmandu, Bagmati",
        price: "Rs. 80,000 – 1,20,000",
        meta: [
            "Full Time"
        ],
        badge: "FEATURED",
        badgeColor: "#F39C12",
        href: "/listing/senior-frontend",
        image: "/Senior Frontend Developer.webp",
        category: "jobs"
    },
    {
        id: "dental-checkup",
        title: "Dental Checkup & Cleaning",
        location: "Kathmandu, Bagmati",
        price: "Rs. 1,500",
        meta: [
            "Clinic"
        ],
        badge: "VERIFIED",
        badgeColor: "#27AE60",
        href: "/listing/dental-checkup",
        image: "/Dental Checkup & Cleaning.avif",
        category: "medical"
    },
    {
        id: "iphone-13",
        title: "iPhone 13 128GB (Used)",
        location: "Bhaktapur, Bagmati",
        price: "Rs. 65,000",
        meta: [
            "Like New"
        ],
        badge: "VERIFIED",
        badgeColor: "#27AE60",
        href: "/listing/iphone-13",
        image: "/iphone-13.avif",
        category: "electronics"
    }
];
const categoryGradients = {
    vehicles: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
    property: "linear-gradient(135deg,#2d4a7a 0%,#1a2f5a 100%)",
    jobs: "linear-gradient(135deg,#0f3460 0%,#1a4a6e 100%)",
    medical: "linear-gradient(135deg,#1e3a5f 0%,#2d5986 100%)",
    electronics: "linear-gradient(135deg,#2c3e50 0%,#34495e 100%)"
};
const CategoryIcon = ({ category })=>{
    switch(category){
        case "vehicles":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "52",
                height: "52",
                viewBox: "0 0 52 52",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "20",
                        width: "44",
                        height: "20",
                        rx: "6",
                        fill: "#E74C3C",
                        opacity: "0.2"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "20",
                        width: "44",
                        height: "20",
                        rx: "6",
                        stroke: "#E74C3C",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M8 20l6-10h24l6 10",
                        stroke: "#E74C3C",
                        strokeWidth: "2",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "14",
                        cy: "40",
                        r: "5",
                        fill: "#fff",
                        stroke: "#E74C3C",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "38",
                        cy: "40",
                        r: "5",
                        fill: "#fff",
                        stroke: "#E74C3C",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/FeaturedListings.tsx",
                lineNumber: 81,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        case "property":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "52",
                height: "52",
                viewBox: "0 0 52 52",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M6 26L26 8l20 18",
                        stroke: "#4B6BFB",
                        strokeWidth: "2.2",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "12",
                        y: "26",
                        width: "28",
                        height: "20",
                        rx: "2",
                        stroke: "#4B6BFB",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "20",
                        y: "34",
                        width: "12",
                        height: "12",
                        rx: "1.5",
                        stroke: "#4B6BFB",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/FeaturedListings.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        case "jobs":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "52",
                height: "52",
                viewBox: "0 0 52 52",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "8",
                        y: "20",
                        width: "36",
                        height: "26",
                        rx: "4",
                        stroke: "#27AE60",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M20 20v-5a2 2 0 012-2h8a2 2 0 012 2v5",
                        stroke: "#27AE60",
                        strokeWidth: "2",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M8 32h36",
                        stroke: "#27AE60",
                        strokeWidth: "1.6",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "20",
                        y: "28",
                        width: "12",
                        height: "8",
                        rx: "2",
                        stroke: "#27AE60",
                        strokeWidth: "1.8"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/FeaturedListings.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        case "medical":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "52",
                height: "52",
                viewBox: "0 0 52 52",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "26",
                        cy: "26",
                        r: "20",
                        stroke: "#2980B9",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M26 16v20M16 26h20",
                        stroke: "#2980B9",
                        strokeWidth: "3",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/FeaturedListings.tsx",
                lineNumber: 108,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        case "electronics":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "52",
                height: "52",
                viewBox: "0 0 52 52",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "6",
                        y: "10",
                        width: "34",
                        height: "24",
                        rx: "3.5",
                        stroke: "#2471A3",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M14 44h24M26 34v10",
                        stroke: "#2471A3",
                        strokeWidth: "2",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "40",
                        y: "16",
                        width: "6",
                        height: "14",
                        rx: "2",
                        stroke: "#2471A3",
                        strokeWidth: "1.8"
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedListings.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/FeaturedListings.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        default:
            return null;
    }
};
_c = CategoryIcon;
function FeaturedListings() {
    _s();
    const [favorites, setFavorites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [imgErrors, setImgErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const toggleFavorite = (id, e)=>{
        e.preventDefault();
        setFavorites((prev)=>({
                ...prev,
                [id]: !prev[id]
            }));
    };
    const handleImgError = (id)=>{
        setImgErrors((prev)=>({
                ...prev,
                [id]: true
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .fl-section {
          background: #f8f8f8;
          padding: 36px 0 48px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .fl-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .fl-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .fl-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          margin: 0;
        }
        .fl-view-all {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13.5px;
          font-weight: 600;
          color: #C0392B;
          text-decoration: none;
          transition: gap 0.2s, opacity 0.2s;
        }
        .fl-view-all:hover { opacity: 0.8; gap: 8px; }
        .fl-view-all-arrow {
          font-size: 15px;
          transition: transform 0.2s;
        }
        .fl-view-all:hover .fl-view-all-arrow { transform: translateX(2px); }

        /* Cards grid */
        .fl-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }

        /* Card */
        .fl-card {
          background: #fff;
          border-radius: 12px;
          border: 1.5px solid #ebebeb;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          position: relative;
        }
        .fl-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.11);
          border-color: #ddd;
        }

        /* Image area */
        .fl-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fl-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .fl-card:hover .fl-img { transform: scale(1.05); }
        .fl-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Badge */
        .fl-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.6px;
          color: #fff;
          text-transform: uppercase;
          z-index: 2;
        }
        .fl-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          flex-shrink: 0;
        }

        /* Wishlist heart */
        .fl-heart {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
          transition: background 0.2s, transform 0.2s;
          border: none;
          padding: 0;
        }
        .fl-heart:hover { background: #fff; transform: scale(1.12); }

        /* Card body */
        .fl-body {
          padding: 12px 13px 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
        }
        .fl-listing-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.35;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fl-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #888;
          font-weight: 400;
          margin: 0;
        }
        .fl-location svg { flex-shrink: 0; }
        .fl-price {
          font-size: 14px;
          font-weight: 800;
          color: #C0392B;
          margin: 2px 0 0;
        }
        .fl-divider {
          border: none;
          border-top: 1px solid #f2f2f2;
          margin: 4px 0 2px;
        }
        .fl-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
          flex-wrap: wrap;
        }
        .fl-meta-item {
          font-size: 11.5px;
          color: #666;
          font-weight: 500;
        }
        .fl-meta-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #ccc;
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .fl-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 820px) {
          .fl-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 580px) {
          .fl-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .fl-title { font-size: 17px; }
        }
        @media (max-width: 360px) {
          .fl-grid { grid-template-columns: 1fr; }
        }
      `
            }, void 0, false, {
                fileName: "[project]/components/FeaturedListings.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "fl-section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fl-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fl-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "fl-title",
                                    children: "Featured Listings"
                                }, void 0, false, {
                                    fileName: "[project]/components/FeaturedListings.tsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/listings",
                                    className: "fl-view-all",
                                    children: [
                                        "View All ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "fl-view-all-arrow",
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/components/FeaturedListings.tsx",
                                            lineNumber: 364,
                                            columnNumber: 24
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/FeaturedListings.tsx",
                                    lineNumber: 363,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/FeaturedListings.tsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fl-grid",
                            children: listings.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    className: "fl-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "fl-img-wrap",
                                            children: [
                                                imgErrors[item.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "fl-img-placeholder",
                                                    style: {
                                                        background: categoryGradients[item.category] || "#eee"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryIcon, {
                                                        category: item.category
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FeaturedListings.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                    lineNumber: 375,
                                                    columnNumber: 21
                                                }, this) : // eslint-disable-next-line @next/next/no-img-element
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: item.image,
                                                    alt: item.title,
                                                    className: "fl-img",
                                                    onError: ()=>handleImgError(item.id)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "fl-badge",
                                                    style: {
                                                        background: item.badgeColor
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "fl-badge-dot"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FeaturedListings.tsx",
                                                            lineNumber: 393,
                                                            columnNumber: 21
                                                        }, this),
                                                        item.badge
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "fl-heart",
                                                    "aria-label": "Save to wishlist",
                                                    onClick: (e)=>toggleFavorite(item.id, e),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "15",
                                                        height: "15",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z",
                                                            stroke: favorites[item.id] ? "#E74C3C" : "#999",
                                                            strokeWidth: "1.8",
                                                            fill: favorites[item.id] ? "#E74C3C" : "none"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FeaturedListings.tsx",
                                                            lineNumber: 404,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/FeaturedListings.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/FeaturedListings.tsx",
                                            lineNumber: 373,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "fl-body",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "fl-listing-title",
                                                    children: item.title
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "fl-location",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "11",
                                                            height: "13",
                                                            viewBox: "0 0 11 13",
                                                            fill: "none",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M5.5 0C3.015 0 1 2.015 1 4.5C1 7.875 5.5 13 5.5 13C5.5 13 10 7.875 10 4.5C10 2.015 7.985 0 5.5 0ZM5.5 6C4.672 6 4 5.328 4 4.5C4 3.672 4.672 3 5.5 3C6.328 3 7 3.672 7 4.5C7 5.328 6.328 6 5.5 6Z",
                                                                fill: "#aaa"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/FeaturedListings.tsx",
                                                                lineNumber: 419,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/FeaturedListings.tsx",
                                                            lineNumber: 418,
                                                            columnNumber: 21
                                                        }, this),
                                                        item.location
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "fl-price",
                                                    children: item.price
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                    lineNumber: 426,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                                    className: "fl-divider"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                    lineNumber: 427,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "fl-meta",
                                                    children: item.meta.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 6
                                                            },
                                                            children: [
                                                                i > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "fl-meta-dot"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                                    lineNumber: 431,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "fl-meta-item",
                                                                    children: m
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                                    lineNumber: 432,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/components/FeaturedListings.tsx",
                                                            lineNumber: 430,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/FeaturedListings.tsx",
                                                    lineNumber: 428,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/FeaturedListings.tsx",
                                            lineNumber: 415,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/components/FeaturedListings.tsx",
                                    lineNumber: 371,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/FeaturedListings.tsx",
                            lineNumber: 369,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/FeaturedListings.tsx",
                    lineNumber: 359,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/FeaturedListings.tsx",
                lineNumber: 358,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(FeaturedListings, "20O/ehd/q1Qh+jMxxYth/Scy5EI=");
_c1 = FeaturedListings;
var _c, _c1;
__turbopack_context__.k.register(_c, "CategoryIcon");
__turbopack_context__.k.register(_c1, "FeaturedListings");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/StatsAndAppBanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatsAndAppBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function StatsAndAppBanner() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Stats Bar ── */
        .sab-stats {
          margin-left:30px;
          margin-right: 30px;
          border-radius: 20px;
          background: #1a1f2e;
          padding: 22px 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .sab-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .sab-stats-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .sab-stat-item {
          display: flex;
          align-items: center;
          gap: 13px;
          flex: 1;
          min-width: 140px;
        }
        .sab-stat-icon {
          flex-shrink: 0;
          opacity: 0.85;
        }
        .sab-stat-number {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.4px;
        }
        .sab-stat-label {
          font-size: 12.5px;
          font-weight: 400;
          color: #9aa3b8;
          margin-top: 2px;
        }
        .sab-stat-divider {
          width: 1px;
          height: 38px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        /* ── App Banner ── */
        .sab-app-banner {
          background: #f8f8f8;
          border-top: 1px solid #ececec;
          padding: 36px 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .sab-app-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }
        .sab-phone-wrap {
          flex-shrink: 0;
          width: 110px;
          position: relative;
          margin-bottom: -36px;
        }
        .sab-phone-img {
          width: 110px;
          object-fit: contain;
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.15));
        }
        .sab-app-text h3 {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 4px;
          line-height: 1.25;
        }
        .sab-app-text p {
          font-size: 13.5px;
          color: #666;
          margin: 0;
          font-weight: 400;
        }
        .sab-store-btns {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .sab-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #111;
          color: #fff;
          border-radius: 10px;
          padding: 9px 18px;
          text-decoration: none;
          transition: background 0.2s, transform 0.18s;
          border: 1.5px solid #333;
        }
        .sab-store-btn:hover {
          background: #222;
          transform: translateY(-2px);
        }
        .sab-store-btn-label {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .sab-store-btn-sub {
          font-size: 10px;
          font-weight: 400;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sab-store-btn-name {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .sab-stats-grid { justify-content: center; gap: 12px; }
          .sab-stat-divider { display: none; }
          .sab-stat-item { min-width: 120px; }
        }
        @media (max-width: 680px) {
          .sab-app-inner { flex-direction: column; text-align: center; gap: 24px; }
          .sab-phone-wrap { margin-bottom: 0; }
          .sab-store-btns { justify-content: center; }
          .sab-app-text h3 { font-size: 17px; }
        }
        @media (max-width: 480px) {
          .sab-stats-grid { gap: 8px; }
          .sab-stat-number { font-size: 18px; }
          .sab-stat-item { min-width: 100px; }
        }
      `
            }, void 0, false, {
                fileName: "[project]/components/StatsAndAppBanner.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "sab-stats",
                "aria-label": "Platform statistics",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sab-inner",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sab-stats-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sab-stat-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "sab-stat-icon",
                                        width: "34",
                                        height: "34",
                                        viewBox: "0 0 34 34",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "12",
                                                cy: "12",
                                                r: "5.5",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3 27c0-4.97 4.03-9 9-9s9 4.03 9 9",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 169,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "24",
                                                cy: "11",
                                                r: "4",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "1.8"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 170,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M28 24c0-3.87-1.79-7-4-8.5",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "1.8",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-number",
                                                children: "1M+"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 174,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-label",
                                                children: "Happy Users"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 175,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sab-stat-divider"
                            }, void 0, false, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sab-stat-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "sab-stat-icon",
                                        width: "34",
                                        height: "34",
                                        viewBox: "0 0 34 34",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "4",
                                                y: "7",
                                                width: "20",
                                                height: "22",
                                                rx: "3",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 184,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 14h10M9 18h10M9 22h6",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "1.8",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "26",
                                                cy: "26",
                                                r: "5",
                                                fill: "#27AE60",
                                                stroke: "#1a1f2e",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 186,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M23.5 26l1.5 1.5 3-3",
                                                stroke: "#fff",
                                                strokeWidth: "1.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 187,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 183,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-number",
                                                children: "50K+"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-label",
                                                children: "Active Listings"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sab-stat-divider"
                            }, void 0, false, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sab-stat-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "sab-stat-icon",
                                        width: "34",
                                        height: "34",
                                        viewBox: "0 0 34 34",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "3",
                                                y: "3",
                                                width: "12",
                                                height: "12",
                                                rx: "2.5",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "19",
                                                y: "3",
                                                width: "12",
                                                height: "12",
                                                rx: "2.5",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 201,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "3",
                                                y: "19",
                                                width: "12",
                                                height: "12",
                                                rx: "2.5",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 202,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "19",
                                                y: "19",
                                                width: "12",
                                                height: "12",
                                                rx: "2.5",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 203,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-number",
                                                children: "18"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 206,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-label",
                                                children: "Categories"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 198,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sab-stat-divider"
                            }, void 0, false, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sab-stat-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "sab-stat-icon",
                                        width: "34",
                                        height: "34",
                                        viewBox: "0 0 34 34",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "17",
                                                cy: "15",
                                                r: "10",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 216,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M17 5C17 5 12 11 12 15a5 5 0 0010 0c0-4-5-10-5-10z",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "1.8"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 217,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "17",
                                                cy: "15",
                                                r: "2.5",
                                                fill: "#9aa3b8"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 218,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M4 28c3-3 13-3 13-3s10 0 13 3",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "1.8",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 219,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 215,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-number",
                                                children: "200+"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 222,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-label",
                                                children: "Cities & Towns"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 223,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sab-stat-divider"
                            }, void 0, false, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 227,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sab-stat-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "sab-stat-icon",
                                        width: "34",
                                        height: "34",
                                        viewBox: "0 0 34 34",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "17",
                                                cy: "17",
                                                r: "13",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 232,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 17c0-4.42 3.58-8 8-8",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 233,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M25 17c0 4.42-3.58 8-8 8",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "2",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 234,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "6",
                                                y: "14",
                                                width: "5",
                                                height: "8",
                                                rx: "2.5",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "1.8"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 235,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "23",
                                                y: "14",
                                                width: "5",
                                                height: "8",
                                                rx: "2.5",
                                                stroke: "#9aa3b8",
                                                strokeWidth: "1.8"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 236,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-number",
                                                children: "24/7"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 239,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sab-stat-label",
                                                children: "Customer Support"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 240,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                                        lineNumber: 238,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/StatsAndAppBanner.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/StatsAndAppBanner.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "sab-app-banner",
                "aria-label": "Download app",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sab-app-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sab-phone-wrap",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/download.png",
                                alt: "HamroNepal Bazaar App on phone",
                                className: "sab-phone-img"
                            }, void 0, false, {
                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                lineNumber: 254,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/StatsAndAppBanner.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sab-app-text",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Download HamroNepal Bazaar App"
                                }, void 0, false, {
                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Buy, sell, book and connect — anywhere, anytime."
                                }, void 0, false, {
                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StatsAndAppBanner.tsx",
                            lineNumber: 262,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sab-store-btns",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "sab-store-btn",
                                    id: "google-play-btn",
                                    "aria-label": "Get it on Google Play",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "24",
                                            height: "24",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M3.18 1.35L13.9 12 3.18 22.65A2 2 0 012 21V3a2 2 0 011.18-1.65z",
                                                    fill: "#EA4335"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M20.5 10.27L17.5 8.6l-3.6 3.4 3.6 3.4 3.04-1.68A2 2 0 0020.5 10.27z",
                                                    fill: "#FBBC04"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M3.18 1.35L13.9 12 17.5 8.6 6.38.64A2 2 0 003.18 1.35z",
                                                    fill: "#4285F4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M3.18 22.65A2 2 0 006.38 23.36l11.12-7.96L13.9 12 3.18 22.65z",
                                                    fill: "#34A853"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StatsAndAppBanner.tsx",
                                            lineNumber: 276,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sab-store-btn-label",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sab-store-btn-sub",
                                                    children: "GET IT ON"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sab-store-btn-name",
                                                    children: "Google Play"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StatsAndAppBanner.tsx",
                                            lineNumber: 282,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                    lineNumber: 270,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "sab-store-btn",
                                    id: "app-store-btn",
                                    "aria-label": "Download on the App Store",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "22",
                                            height: "22",
                                            viewBox: "0 0 24 24",
                                            fill: "white",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                lineNumber: 296,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StatsAndAppBanner.tsx",
                                            lineNumber: 295,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sab-store-btn-label",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sab-store-btn-sub",
                                                    children: "Download on the"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sab-store-btn-name",
                                                    children: "App Store"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                                    lineNumber: 300,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StatsAndAppBanner.tsx",
                                            lineNumber: 298,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                                    lineNumber: 289,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StatsAndAppBanner.tsx",
                            lineNumber: 268,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/StatsAndAppBanner.tsx",
                    lineNumber: 250,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/StatsAndAppBanner.tsx",
                lineNumber: 249,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = StatsAndAppBanner;
var _c;
__turbopack_context__.k.register(_c, "StatsAndAppBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_13db2q3._.js.map