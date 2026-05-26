(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
;
;
const PRIMARY = "#C0392B";
const BG = "#0f1523"; // dark background color
// footer links organized by section
const footerLinks = {
    Company: [
        {
            label: "About Us",
            href: "/about"
        },
        {
            label: "Careers",
            href: "/careers"
        },
        {
            label: "Press",
            href: "/press"
        }
    ],
    Support: [
        {
            label: "Help Center",
            href: "/help"
        },
        {
            label: "Safety Center",
            href: "/safety"
        },
        {
            label: "Contact Us",
            href: "/contact"
        }
    ],
    Legal: [
        {
            label: "Terms of Use",
            href: "/terms"
        },
        {
            label: "Privacy Policy",
            href: "/privacy"
        },
        {
            label: "Refund Policy",
            href: "/refund"
        }
    ]
};
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .hnb-footer {
          background: ${BG};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .hnb-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 24px 28px;
          display: flex;
          align-items: flex-start;
          gap: 48px;
          flex-wrap: wrap;
        }

        /* brand / logo section on the left */
        .hnb-footer-brand {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 180px;
          flex: 1.2;
        }
        .hnb-footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .hnb-footer-logo-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
        }
        .hnb-footer-logo-text { line-height: 1.15; }
        .hnb-footer-logo-line1 {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: ${PRIMARY};
          letter-spacing: -0.2px;
        }
        .hnb-footer-logo-line2 {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.2px;
        }
        .hnb-footer-copy {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          margin-top: 4px;
          line-height: 1.5;
        }

        /* the 3 link columns - company, support, legal */
        .hnb-footer-cols {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
          flex: 2;
        }
        .hnb-footer-col { min-width: 110px; }
        .hnb-footer-col-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 14px;
          letter-spacing: 0.1px;
        }
        .hnb-footer-link {
          display: block;
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          margin-bottom: 9px;
          transition: color 0.15s;
          line-height: 1.4;
        }
        .hnb-footer-link:hover { color: #ffffff; }

        /* payment methods section */
        .hnb-footer-payments {
          min-width: 180px;
          flex: 1;
        }
        .hnb-footer-payments-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 14px;
          letter-spacing: 0.1px;
        }
        .hnb-footer-payment-badges {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: nowrap;
        }

        /* esewa and other payment logos */
        .hnb-pay-img {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          transition: opacity 0.15s, transform 0.15s;
          cursor: default;
        }
        .hnb-pay-img:hover {
          opacity: 0.8;
          transform: translateY(-2px);
        }

        /* khalti needs a white background pill */
        .hnb-khalti-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          background: #ffffff;
          border-radius: 7px;
          padding: 0 10px;
          transition: opacity 0.15s, transform 0.15s;
          cursor: default;
        }
        .hnb-khalti-pill:hover { opacity: 0.85; transform: translateY(-2px); }

        /* connectIPS is just styled text - no image available */
        .hnb-cips {
          display: inline-flex;
          align-items: center;
          height: 36px;
          font-style: italic;
          font-size: 17px;
          letter-spacing: -0.3px;
          transition: opacity 0.15s, transform 0.15s;
          cursor: default;
        }
        .hnb-cips:hover { opacity: 0.8; transform: translateY(-2px); }
        .hnb-cips-connect {
          font-weight: 400;
          color: #ffffff;
        }
        .hnb-cips-ips {
          font-weight: 800;
          color: #e8392a;
        }

        /* copyright bar at the very bottom */
        .hnb-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 14px 24px;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hnb-footer-bottom-text {
          font-size: 11.5px;
          color: rgba(255,255,255,0.3);
          text-align: center;
        }

        /* responsive - tablet */
        @media (max-width: 900px) {
          .hnb-footer-inner {
            gap: 32px;
            padding: 32px 20px 24px;
          }
          .hnb-footer-cols { gap: 28px; }
        }

        /* responsive - mobile */
        @media (max-width: 600px) {
          .hnb-footer-inner {
            flex-direction: column;
            gap: 28px;
          }
          .hnb-footer-brand { flex: unset; }
          .hnb-footer-payments { flex: unset; }
        }
      `
            }, void 0, false, {
                fileName: "[project]/components/Footer.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "hnb-footer",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hnb-footer-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hnb-footer-brand",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: "hnb-footer-logo",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "hnb-footer-logo-icon",
                                            viewBox: "0 0 38 38",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    width: "38",
                                                    height: "38",
                                                    rx: "8",
                                                    fill: PRIMARY
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Footer.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M10 10 C10 10, 14 8, 19 13 C24 18, 28 10, 28 10   M10 28 C10 28, 14 30, 19 25 C24 20, 28 28, 28 28   M10 10 Q10 19 10 28   M28 10 Q28 19 28 28   M14 19 C14 19 16 22 19 22 C22 22 24 19 24 19",
                                                    stroke: "#fff",
                                                    strokeWidth: "2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    fill: "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Footer.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "19",
                                                    cy: "19",
                                                    r: "3",
                                                    fill: "#fff",
                                                    opacity: "0.9"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Footer.tsx",
                                                    lineNumber: 238,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Footer.tsx",
                                            lineNumber: 228,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hnb-footer-logo-text",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hnb-footer-logo-line1",
                                                    children: "HamroNepal"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Footer.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hnb-footer-logo-line2",
                                                    children: "Bazaar"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Footer.tsx",
                                                    lineNumber: 242,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Footer.tsx",
                                            lineNumber: 240,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Footer.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "hnb-footer-copy",
                                    children: "© 2026 HamroNepal Bazaar. All rights reserved."
                                }, void 0, false, {
                                    fileName: "[project]/components/Footer.tsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Footer.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hnb-footer-cols",
                            children: Object.entries(footerLinks).map(([section, links])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hnb-footer-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "hnb-footer-col-title",
                                            children: section
                                        }, void 0, false, {
                                            fileName: "[project]/components/Footer.tsx",
                                            lineNumber: 254,
                                            columnNumber: 17
                                        }, this),
                                        links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: link.href,
                                                className: "hnb-footer-link",
                                                children: link.label
                                            }, link.href, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 256,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, section, true, {
                                    fileName: "[project]/components/Footer.tsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/Footer.tsx",
                            lineNumber: 251,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hnb-footer-payments",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "hnb-footer-payments-title",
                                    children: "We Accept"
                                }, void 0, false, {
                                    fileName: "[project]/components/Footer.tsx",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hnb-footer-payment-badges",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hnb-pay-img",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/esewa_logo.png",
                                                alt: "eSewa",
                                                width: 90,
                                                height: 36,
                                                style: {
                                                    objectFit: "contain",
                                                    height: 36,
                                                    width: "auto"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 271,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Footer.tsx",
                                            lineNumber: 270,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hnb-khalti-pill",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/Khalti.png",
                                                alt: "Khalti",
                                                width: 80,
                                                height: 28,
                                                style: {
                                                    objectFit: "contain",
                                                    height: 28,
                                                    width: "auto"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/Footer.tsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Footer.tsx",
                                            lineNumber: 281,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hnb-cips",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hnb-cips-connect",
                                                    children: "connect"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Footer.tsx",
                                                    lineNumber: 293,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hnb-cips-ips",
                                                    children: "IPS"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Footer.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Footer.tsx",
                                            lineNumber: 292,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Footer.tsx",
                                    lineNumber: 267,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Footer.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Footer.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Footer.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/category/vehicles/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VehiclesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Footer.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const VEHICLES = [
    {
        id: "hundai-creta-2022",
        title: "Hundai Creta 2022",
        price: "Rs. 32,50,000",
        location: "Kathmandu",
        image: "/Hundai Creta 2022.jpg",
        isVerified: true,
        category: "Car"
    },
    {
        id: "harley-davidson",
        title: "Harley-Davidson",
        price: "Rs. 2,00,000",
        location: "Kathmandu",
        image: "/Harley-Davidson.jpg",
        isVerified: true,
        category: "Bike"
    },
    {
        id: "getty-bus",
        title: "Getty Bus",
        price: "Rs. 3,20,000",
        location: "Kathmandu",
        image: "/Getty Bus.jpg",
        isVerified: true,
        category: "Buses"
    },
    {
        id: "scooter",
        title: "Scooter",
        price: "Rs. 32,000",
        location: "Kathmandu",
        image: "/Scooter.jpg",
        isVerified: true,
        category: "Scooter"
    },
    {
        id: "bajaj-pulsar",
        title: "Bajaj Pulsar N160",
        price: "Rs. 3,25,000",
        location: "Pokhara",
        image: "/bajaj.avif",
        isVerified: true,
        category: "Bike"
    },
    {
        id: "toyota-hiace",
        title: "Toyota HiAce Van",
        price: "Rs. 45,00,000",
        location: "Lalitpur",
        image: "/Hundai Creta 2022.jpg",
        isVerified: false,
        category: "Car"
    },
    {
        id: "honda-activa",
        title: "Honda Activa 6G",
        price: "Rs. 1,85,000",
        location: "Bhaktapur",
        image: "/Scooter.jpg",
        isVerified: true,
        category: "Scooter"
    },
    {
        id: "tata-truck",
        title: "Tata 407 Truck",
        price: "Rs. 28,00,000",
        location: "Chitwan",
        image: "/Getty Bus.jpg",
        isVerified: false,
        category: "Trucks"
    }
];
const SUB_CATS = [
    "All vehicles",
    "Car",
    "Trucks",
    "Bike",
    "Scooter",
    "Buses",
    "Others"
];
const CITIES = [
    "Kathmandu",
    "Pokhara",
    "Lalitpur",
    "Bhaktapur",
    "Chitwan",
    "Biratnagar",
    "Butwal"
];
function VehiclesPage() {
    _s();
    const [favorites, setFavorites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("newest");
    const [activeCat, setActiveCat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All vehicles");
    const [priceRange, setPriceRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1000000);
    const [city, setCity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [verifiedOnly, setVerifiedOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toggleFav = (id, e)=>{
        e.preventDefault();
        e.stopPropagation();
        setFavorites((p)=>({
                ...p,
                [id]: !p[id]
            }));
    };
    const displayed = VEHICLES.filter((v)=>{
        const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCat === "All vehicles" || v.category === activeCat;
        const matchCity = !city || v.location === city;
        const matchVerified = !verifiedOnly || v.isVerified;
        const priceNum = parseInt(v.price.replace(/[^\d]/g, ""));
        const matchPrice = priceNum <= priceRange;
        return matchSearch && matchCat && matchCity && matchVerified && matchPrice;
    }).sort((a, b)=>{
        if (sort === "price_asc") return parseInt(a.price.replace(/[^\d]/g, "")) - parseInt(b.price.replace(/[^\d]/g, ""));
        if (sort === "price_desc") return parseInt(b.price.replace(/[^\d]/g, "")) - parseInt(a.price.replace(/[^\d]/g, ""));
        return 0;
    });
    const formatPrice = (val)=>{
        if (val >= 100000) return `Rs ${(val / 100000).toFixed(0)} Lakh`;
        return `Rs ${val.toLocaleString()}`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .vp { background: #f0f0f8; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .vp-hero {
          position: relative;
          height: 230px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .vp-hero-bg {
          position: absolute; inset: 0;
          background: url('/car of hero section.jpg') center center / cover no-repeat;
          filter: brightness(0.72);
        }
        .vp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(180,40,40,0.55) 0%, rgba(100,20,20,0.35) 100%);
        }
        .vp-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .vp-hero-title {
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 900; color: #fff;
          margin: 0 0 4px; line-height: 1.15;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        .vp-hero-sub {
          color: rgba(255,255,255,0.82);
          font-size: 13.5px; margin: 0 0 18px; font-weight: 400;
        }
        .vp-search-wrap {
          position: relative; max-width: 480px;
        }
        .vp-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: #aaa;
        }
        .vp-search {
          width: 100%; padding: 13px 14px 13px 42px;
          background: rgba(255,255,255,0.93);
          border: none; border-radius: 10px;
          font-size: 14px; color: #333;
          font-family: inherit; outline: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          transition: box-shadow 0.2s;
        }
        .vp-search::placeholder { color: #bbb; }
        .vp-search:focus { box-shadow: 0 4px 24px rgba(0,0,0,0.28); }
        .vp-hero-watermark {
          position: absolute; bottom: -18px; left: 28px;
          font-size: clamp(50px, 10vw, 90px);
          font-weight: 900; color: rgba(255,255,255,0.08);
          letter-spacing: -2px; pointer-events: none;
          user-select: none; line-height: 1;
          z-index: 1;
        }

        /* ── BODY ── */
        .vp-body {
          max-width: 1200px; margin: 0 auto;
          padding: 28px 24px 60px;
        }
        .vp-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 22px;
          align-items: start;
        }

        /* ── SIDEBAR ── */
        .vp-sidebar {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #e8e8f0;
          overflow: hidden;
          position: sticky;
          top: 82px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }
        .vsf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px;
          border-bottom: 1.5px solid #f2f2f5;
        }
        .vsf-head-title {
          font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0;
        }
        .vsf-reset {
          font-size: 13px; font-weight: 700;
          color: #e05c3a; background: none; border: none;
          cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .vsf-reset:hover { opacity: 0.7; }

        /* price range section */
        .vsf-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f2f5; }
        .vsf-section:last-of-type { border-bottom: none; }
        .vsf-label {
          font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 6px;
        }
        .vsf-price-range-val {
          font-size: 12.5px; color: #888; margin: 0 0 12px; font-weight: 500;
        }
        .vsf-slider {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px;
          background: linear-gradient(to right, #e05c3a 0%, #e05c3a var(--pct, 50%), #e0e0e8 var(--pct, 50%), #e0e0e8 100%);
          border-radius: 4px; outline: none; cursor: pointer;
        }
        .vsf-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%; background: #e05c3a;
          cursor: pointer; border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(224,92,58,0.45);
        }
        .vsf-slider::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%; background: #e05c3a;
          cursor: pointer; border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(224,92,58,0.45);
        }

        /* city dropdown */
        .vsf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e8e8f0; border-radius: 10px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fafafa url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          transition: border-color 0.2s;
          margin-bottom: 12px;
        }
        .vsf-select:focus { border-color: #e05c3a; }

        /* verified city toggle */
        .vsf-toggle-row {
          display: flex; align-items: center; justify-content: space-between;
        }
        .vsf-toggle-label {
          font-size: 13.5px; font-weight: 600; color: #333;
        }
        .vsf-toggle {
          position: relative; width: 42px; height: 24px;
          cursor: pointer; display: inline-block;
        }
        .vsf-toggle input { opacity: 0; width: 0; height: 0; }
        .vsf-toggle-track {
          position: absolute; inset: 0;
          background: #ddd; border-radius: 24px;
          transition: background 0.25s;
        }
        .vsf-toggle input:checked + .vsf-toggle-track { background: #e05c3a; }
        .vsf-toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          transition: transform 0.25s;
        }
        .vsf-toggle input:checked ~ .vsf-toggle-thumb { transform: translateX(18px); }

        /* sub categories chips */
        .vsf-chips {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px;
        }
        .vsf-chip {
          padding: 6px 14px; border-radius: 100px;
          font-size: 12.5px; font-weight: 600;
          border: 1.5px solid #e0e0e8;
          background: #fff; color: #555;
          cursor: pointer;
          transition: all 0.18s;
        }
        .vsf-chip:hover { border-color: #e05c3a; color: #e05c3a; }
        .vsf-chip.active {
          background: #e05c3a; color: #fff;
          border-color: #e05c3a;
          box-shadow: 0 2px 8px rgba(224,92,58,0.3);
        }

        /* apply button */
        .vsf-apply {
          display: block; width: calc(100% - 36px);
          margin: 4px 18px 18px;
          padding: 12px; text-align: center;
          background: linear-gradient(90deg, #e05c3a, #c0392b);
          color: #fff; font-size: 14px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 16px rgba(192,57,43,0.32);
          transition: opacity 0.18s, transform 0.18s;
          letter-spacing: 0.2px;
        }
        .vsf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── RESULTS BAR ── */
        .vp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .vp-results-count {
          font-size: 14px; color: #666; font-weight: 500;
        }
        .vp-sort-select {
          padding: 9px 36px 9px 14px;
          border: 1.5px solid #e0e0e8; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          transition: border-color 0.2s;
        }
        .vp-sort-select:focus { border-color: #e05c3a; }

        /* ── GRID ── */
        .vp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 18px;
        }

        /* ── CARD ── */
        .vp-card {
          background: #fff;
          border-radius: 14px;
          border: 1.5px solid #ececec;
          overflow: hidden;
          text-decoration: none;
          display: flex; flex-direction: column;
          position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          cursor: pointer;
        }
        .vp-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
        }
        .vp-img-wrap {
          position: relative; width: 100%;
          aspect-ratio: 16/11; overflow: hidden;
          background: #f0f0f5;
        }
        .vp-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.32s ease;
        }
        .vp-card:hover .vp-img { transform: scale(1.06); }

        /* heart button */
        .vp-heart {
          position: absolute; top: 9px; right: 9px;
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(255,255,255,0.93);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.14);
          transition: transform 0.18s, background 0.18s;
        }
        .vp-heart:hover { transform: scale(1.18); background: #fff; }

        /* card body */
        .vp-card-body {
          padding: 12px 14px 14px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .vp-card-title {
          font-size: 14px; font-weight: 700; color: #1a1a1a;
          line-height: 1.35; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .vp-card-price {
          font-size: 15px; font-weight: 900; color: #c0392b; margin: 0;
        }
        .vp-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 2px;
        }
        .vp-card-location {
          font-size: 12px; color: #888; font-weight: 500;
        }
        .vp-verified {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 600; color: #27ae60;
        }
        .vp-verified-icon {
          width: 15px; height: 15px; border-radius: 50%;
          background: rgba(39,174,96,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* empty state */
        .vp-empty {
          grid-column: 1/-1; padding: 64px 24px; text-align: center; color: #888;
        }
        .vp-empty-icon { font-size: 48px; margin-bottom: 12px; }
        .vp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .vp-empty span { font-size: 13px; color: #aaa; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .vp-layout { grid-template-columns: 1fr; }
          .vp-sidebar { display: none; }
        }
        @media (max-width: 640px) {
          .vp-hero { height: 200px; }
          .vp-body { padding: 20px 16px 40px; }
          .vp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 380px) {
          .vp-grid { grid-template-columns: 1fr; }
        }
      `
            }, void 0, false, {
                fileName: "[project]/app/category/vehicles/page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "vp",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "vp-hero",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "vp-hero-bg"
                            }, void 0, false, {
                                fileName: "[project]/app/category/vehicles/page.tsx",
                                lineNumber: 397,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "vp-hero-overlay"
                            }, void 0, false, {
                                fileName: "[project]/app/category/vehicles/page.tsx",
                                lineNumber: 398,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "vp-hero-watermark",
                                children: "Vehicles"
                            }, void 0, false, {
                                fileName: "[project]/app/category/vehicles/page.tsx",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "vp-hero-inner",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "vp-hero-title",
                                        children: "Vehicles in Nepal"
                                    }, void 0, false, {
                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "vp-hero-sub",
                                        children: "Find the best cars, bikes and more"
                                    }, void 0, false, {
                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                        lineNumber: 402,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "vp-search-wrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "vp-search-icon",
                                                width: "16",
                                                height: "16",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "11",
                                                        cy: "11",
                                                        r: "7",
                                                        stroke: "#aaa",
                                                        strokeWidth: "2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M16.5 16.5L21 21",
                                                        stroke: "#aaa",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                                        lineNumber: 406,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/category/vehicles/page.tsx",
                                                lineNumber: 404,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "vp-search",
                                                placeholder: "Search",
                                                value: search,
                                                onChange: (e)=>setSearch(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/category/vehicles/page.tsx",
                                                lineNumber: 408,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                        lineNumber: 403,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/category/vehicles/page.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/category/vehicles/page.tsx",
                        lineNumber: 396,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "vp-body",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "vp-layout",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                    className: "vp-sidebar",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "vsf-head",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "vsf-head-title",
                                                    children: "Filters"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "vsf-reset",
                                                    onClick: ()=>{
                                                        setPriceRange(1000000);
                                                        setCity("");
                                                        setVerifiedOnly(false);
                                                        setActiveCat("All vehicles");
                                                    },
                                                    children: "Reset"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 426,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                            lineNumber: 424,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "vsf-section",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "vsf-label",
                                                    children: "Price Range"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 441,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "vsf-price-range-val",
                                                    children: [
                                                        "Rs. 0-",
                                                        formatPrice(priceRange)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    className: "vsf-slider",
                                                    min: 0,
                                                    max: 10000000,
                                                    step: 50000,
                                                    value: priceRange,
                                                    style: {
                                                        "--pct": `${priceRange / 10000000 * 100}%`
                                                    },
                                                    onChange: (e)=>setPriceRange(Number(e.target.value))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 443,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                            lineNumber: 440,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "vsf-section",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "vsf-label",
                                                    children: "Location/City"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 457,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: "vsf-select",
                                                    value: city,
                                                    onChange: (e)=>setCity(e.target.value),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select City"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 19
                                                        }, this),
                                                        CITIES.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: c,
                                                                children: c
                                                            }, c, false, {
                                                                fileName: "[project]/app/category/vehicles/page.tsx",
                                                                lineNumber: 465,
                                                                columnNumber: 21
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "vsf-toggle-row",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "vsf-toggle-label",
                                                            children: "Verified City"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                            lineNumber: 469,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "vsf-toggle",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    checked: verifiedOnly,
                                                                    onChange: (e)=>setVerifiedOnly(e.target.checked)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                                    lineNumber: 471,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "vsf-toggle-track"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                                    lineNumber: 476,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "vsf-toggle-thumb"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                                    lineNumber: 477,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                            lineNumber: 470,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 468,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                            lineNumber: 456,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "vsf-section",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "vsf-label",
                                                    children: "Sub Categories"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 484,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "vsf-chips",
                                                    children: SUB_CATS.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: `vsf-chip${activeCat === cat ? " active" : ""}`,
                                                            onClick: ()=>setActiveCat(cat),
                                                            children: cat
                                                        }, cat, false, {
                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 485,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                            lineNumber: 483,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "vsf-apply",
                                            children: "Apply Filters"
                                        }, void 0, false, {
                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                            lineNumber: 498,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                    lineNumber: 423,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "vp-results-bar",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "vp-results-count",
                                                    children: [
                                                        displayed.length * 154,
                                                        " results found"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 505,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: "vp-sort-select",
                                                    value: sort,
                                                    onChange: (e)=>setSort(e.target.value),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "newest",
                                                            children: "Newest"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                            lineNumber: 513,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "price_asc",
                                                            children: "Price: Low → High"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                            lineNumber: 514,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "price_desc",
                                                            children: "Price: High → Low"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                            lineNumber: 515,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 508,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                            lineNumber: 504,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "vp-grid",
                                            children: displayed.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "vp-empty",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "vp-empty-icon",
                                                        children: "🔍"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                                        lineNumber: 523,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "No vehicles found"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                                        lineNumber: 524,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Try a different search or filter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                                        lineNumber: 525,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/category/vehicles/page.tsx",
                                                lineNumber: 522,
                                                columnNumber: 19
                                            }, this) : displayed.map((v)=>{
                                                const isFav = !!favorites[v.id];
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/listing/${v.id}`,
                                                    className: "vp-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "vp-img-wrap",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: v.image,
                                                                    alt: v.title,
                                                                    className: "vp-img"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                                    lineNumber: 535,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "vp-heart",
                                                                    "aria-label": "Save",
                                                                    onClick: (e)=>toggleFav(v.id, e),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        width: "14",
                                                                        height: "14",
                                                                        viewBox: "0 0 24 24",
                                                                        fill: isFav ? "#E74C3C" : "none",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z",
                                                                            stroke: isFav ? "#E74C3C" : "#999",
                                                                            strokeWidth: "1.8"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                                            lineNumber: 542,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                                                        lineNumber: 541,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                                    lineNumber: 536,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                            lineNumber: 533,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "vp-card-body",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "vp-card-title",
                                                                    children: v.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                                    lineNumber: 553,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "vp-card-price",
                                                                    children: v.price
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                                    lineNumber: 554,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "vp-card-footer",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "vp-card-location",
                                                                            children: v.location
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                                            lineNumber: 556,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        v.isVerified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "vp-verified",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "vp-verified-icon",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                        width: "9",
                                                                                        height: "9",
                                                                                        viewBox: "0 0 12 12",
                                                                                        fill: "none",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                            d: "M2 6L5 9L10 3",
                                                                                            stroke: "#27ae60",
                                                                                            strokeWidth: "1.8",
                                                                                            strokeLinecap: "round",
                                                                                            strokeLinejoin: "round"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                                                            lineNumber: 561,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/category/vehicles/page.tsx",
                                                                                        lineNumber: 560,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                                                    lineNumber: 559,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                "Verified"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                                            lineNumber: 558,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                                    lineNumber: 555,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                                            lineNumber: 552,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, v.id, true, {
                                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                                    lineNumber: 531,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/app/category/vehicles/page.tsx",
                                            lineNumber: 520,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/category/vehicles/page.tsx",
                                    lineNumber: 502,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/category/vehicles/page.tsx",
                            lineNumber: 420,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/category/vehicles/page.tsx",
                        lineNumber: 419,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/category/vehicles/page.tsx",
                        lineNumber: 578,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/category/vehicles/page.tsx",
                lineNumber: 394,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(VehiclesPage, "4SN5OG6BSj+n1X/GsnSSieeaeGQ=");
_c = VehiclesPage;
var _c;
__turbopack_context__.k.register(_c, "VehiclesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_02~ej7-._.js.map