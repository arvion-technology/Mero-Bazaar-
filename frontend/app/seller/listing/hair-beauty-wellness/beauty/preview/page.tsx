"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiTag,
  FiAward,
  FiDollarSign,
  FiCalendar,
  FiEdit2,
  FiSend,
  FiStar,
  FiShield,
  FiClock,
  FiZap,
  FiNavigation,
  FiTool,
} from "react-icons/fi";
const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const SUCCESS = "#10b981";
const DANGER = "#dc2626";
const ACCENT_LIGHT = "#eff6ff";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";
const SITE_PRIMARY = "#C0392B";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

export default function PreviewBeautyPage() {
  const router = useRouter();

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Listing published successfully!");
    setIsPublishing(false);
    localStorage.removeItem("beautyBasic");
    localStorage.removeItem("beautyDetail");
    router.push("/seller/products");
  };


  const handleEdit = (step: string) => {
    if (step === "basic") router.push("/seller/listing/hair-beauty-wellness/beauty");
    if (step === "details") router.push("/seller/listing/hair-beauty-wellness/beauty/details");
    if (step === "photos") router.push("/seller/listing/hair-beauty-wellness/beauty/photos");

  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .preview-page {
          min-height: 100vh;
          background: ${BG};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .preview-container {
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 24px 32px 40px;
        }

        /* ── Header ── */
        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1.5px solid ${BORDER};
          background: ${CARD_BG};
          color: ${TEXT_SECONDARY};
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .back-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .draft-saved {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
        }
 * { box-sizing: border-box; margin: 0; padding: 0; }

        .listing-page {
          min-height: 100vh;
          background: ${BG};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .listing-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        /* ── Header ── */
        .listing-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1.5px solid ${BORDER};
          background: ${CARD_BG};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${TEXT_PRIMARY};
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          flex-shrink: 0;
        }

        .back-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
          transform: translateX(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .back-btn:active { transform: translateX(0) scale(0.96); }

        .listing-header-text { flex: 1; min-width: 0; }

        .listing-title {
          font-size: 26px;
          font-weight: 800;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .listing-subtitle {
          font-size: 13.5px;
          color: ${TEXT_SECONDARY};
          margin-top: 3px;
        }

        /* ── Draft Saved ── */
        .draft-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
          flex-shrink: 0;
        }
   
          
        /* ── Submit Button ── */
        .submit-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 36px;
          padding-top: 8px;
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
          background: ${ACCENT_LIGHT};
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

        .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(37, 99, 235, 0.2);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .listing-container { padding: 16px; }
          .form-card { 
            padding: 20px; 
            border-radius: 16px; 
          }
          .two-col-layout { 
            grid-template-columns: 1fr; 
            gap: 24px; 
          }
          .listing-title { font-size: 20px; }
          .listing-subtitle { font-size: 12px; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
          .submit-wrap { 
            flex-direction: column-reverse; 
            gap: 12px;
            margin-top: 24px;
          }
          .back-link, .submit-btn { 
            width: 100%; 
            justify-content: center; 
            padding: 14px 28px;
          }
          .section-header { margin-bottom: 16px; }
          .form-group.full-width { margin-bottom: 16px; }
          .divider { margin: 20px 0; }
          .category-wrap { margin-bottom: 16px; }
          .custom-select-dropdown {
            max-height: 200px;
          }
        }

        @media (max-width: 480px) {
          .listing-container { padding: 12px; }
          .form-card { padding: 16px; border-radius: 14px; }
          .listing-header { gap: 12px; margin-bottom: 16px; }
          .back-btn { width: 36px; height: 36px; }
          .listing-title { font-size: 18px; }
        }
        /* ── Page Title ── */
        .page-header {
          margin-bottom: 20px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.3px;
          margin-bottom: 4px;
        }

        .page-subtitle {
          font-size: 14px;
          color: ${TEXT_SECONDARY};
        }

/* ================= Main Card ================= */

.listing-card{
    background:#fff;
    border:1px solid #e5e7eb;
    border-radius:20px;
    padding:20px;
}

.card-layout{
    display:grid;
    grid-template-columns:400px 1fr;
    gap:20px;
    align-items:flex-start;
}

/* ================= Gallery ================= */

.gallery-section{
    display:flex;
    gap:10px;
        flex-direction:column;

}

.main-image{
    width:400px;
    height:420px;
    border-radius:16px;
    overflow:hidden;
}


.main-image img{
    width:100%;
    height:100%;
    object-fit:cover;
}

.side-images{
    width:400px;

    display:flex;
    gap:12px;
}

.thumb{
    flex:1;
    height:110px;
    border-radius:12px;
    overflow:hidden;
}

.thumb img{
    width:100%;
    height:100%;
    object-fit:cover;
}

/* ================= Right ================= */

.service-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
}

.service-title{
    font-size:35px;
    font-weight:700;
}

.verified-badge{
    background:#dff7d9;
    color:#1f8b3a;
    padding:6px 14px;
    border-radius:10px;
    font-size:18px;
    font-weight:600;
}

/* ================= Top Cards ================= */

.top-cards{
    display:flex;
    gap:18px;
    margin-bottom:24px;
}

.info-card{
    width:170px;
    border:1px solid #e5e7eb;
    border-radius:12px;
    padding:16px;
    text-align:center;
}

.info-card h3{
    color:#3b4fe4;
    font-size:px;
    font-weight:700;
    margin-bottom:6px;
}

.info-card span{
    color:#666;
    font-size:16px;
}

/* ================= Details ================= */

.details-list{
    display:flex;
    flex-direction:column;
    gap:18px;
}

.detail-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
}

.detail-row span{
    color:#444;
    font-size:20px;
}

.detail-row strong{
    font-size:20px;
    font-weight:600;
}

/* ================= Bottom ================= */

.service-left{
    margin-top:28px;
    width:62%;
}

.about-section h2,
.tags-section h2{
    font-size:34px;
    margin-bottom:12px;
    color:#3b4fe4;
}

.about-section p{
    color:#555;
    line-height:1.6;
    font-size:18px;
}

.tags-section{
    margin-top:24px;
}

.tags{
    display:flex;
    flex-wrap:wrap;
    gap:12px;
}

.tags span{
    background:#e9e4ff;
    color:#5146e5;
    padding:10px 16px;
    border-radius:10px;
    font-size:17px;
}

/* ================= Availability ================= */

.service-extra{
    display:flex;
    justify-content:flex-end;
    margin-top:-120px;
}

.availability-card{
    width:340px;
    border:1px solid #e5e7eb;
    border-radius:18px;
    padding:22px;
}

.availability-info{
    display:flex;
    gap:14px;
}

.icon-box{
    color:#3554e8;
}

.availability-text h3{
    color:#3554e8;
    font-size:28px;
    margin-bottom:6px;
}

.availability-text p{
    margin-bottom:4px;
    font-size:18px;
}

.availability-text span{
    color:#666;
    font-size:18px;
}

/* ================= Tablet ================= */

@media(max-width:992px){

.card-layout{
    grid-template-columns:1fr;
}

.gallery-section{
    flex-direction:column;
}
    .main-image{
    width:600px;
    height:420px;
    border-radius:16px;
    overflow:hidden;
}
.side-images{
    width:600px;
    flex-direction:row;
}

.thumb{
    flex:1;
    height:100px;
}

.service-left{
    width:100%;
}

.service-extra{
    margin-top:30px;
    justify-content:flex-start;
}

.availability-card{
    width:100%;
}

}

/* ================= Mobile ================= */

@media(max-width:768px){

.listing-card{
    padding:18px;
}
  .main-image{
    width:500px;
    height:420px;
    border-radius:16px;
    overflow:hidden;
}
.side-images{
    width:500px;
    flex-direction:row;
}


.service-header{
    flex-direction:column;
    align-items:flex-start;
    gap:12px;
}

.service-title{
    font-size:32px;
}

.top-cards{
    flex-direction:row;
width:px:
}

// .info-card{
//     width:100px;
//     border:1px solid #e5e7eb;
//     border-radius:12px;
//     padding:16px;
//     text-align:center;
// }
   

.info-card{
    width:200px;
}

.detail-row{
    flex-direction:column;
    align-items:flex-start;
    gap:4px;
}

.main-image{
    height:260px;
}

.side-images{
    flex-wrap:wrap;
}

.thumb{
    min-width:90px;
}

.about-section h2,
.tags-section h2{
    font-size:26px;
}

.availability-text h3{
    font-size:22px;
}
}

        

//         /* ── Listing Card ── */
//         .listing-card {
//           background: ${CARD_BG};
//           border: 1.5px solid ${BORDER};
//           border-radius: 16px;
//           padding: 24px;
//           margin-bottom: 24px;
//         }

//         /* ── Card Layout ── */
//         .card-layout {
//           display: flex;
//           gap: 28px;
//         }

//         /* ── Left: Image ── */
//         .card-left {
//           flex: 0 0 280px;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .card-image-wrap {
//           position: relative;
//           border-radius: 12px;
//           overflow: hidden;
//           border: 1.5px solid ${BORDER};
//           aspect-ratio: 1 / 1;
//         }

//         .card-image-wrap img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           display: block;
//         }
//   .map-small {
//           width: 100%;
//           height: 120px;
//           border-radius: 12px;
//           overflow: hidden;
//           border: 1.5px solid ${BORDER};
//         }
//           .service-details{
//     flex:1;
//     display:flex;
//     flex-direction:column;
//     gap:28px;
// }

// .service-header{
//     display:flex;
//     justify-content:space-between;
//     align-items:center;
// }

// .service-title{
//     font-size:44px;
//     font-weight:700;
//     color:#111827;
//     margin:0;
//     line-height:1.2;
// }

// .verified-badge{
//     background:#DFF7DD;
//     color:#18A31A;
//     font-size:24px;
//     font-weight:600;
//     padding:8px 20px;
//     border-radius:14px;
// }

// .top-cards{
//     display:flex;
//     gap:24px;
// }

// .info-card{
//     width:220px;
//     height:120px;
//     border:1px solid #DADADA;
//     border-radius:14px;
//     display:flex;
//     flex-direction:column;
//     justify-content:center;
//     align-items:center;
//     background:#fff;
// }

// .info-card h3{
//     margin:0;
//     font-size:34px;
//     color:#4F46E5;
//     font-weight:700;
// }

// .info-card span{
//     margin-top:10px;
//     font-size:22px;
//     color:#666;
// }

// .details-list{
//     display:flex;
//     flex-direction:column;
//     gap:20px;
// }

// .detail-row{
//     display:flex;
//     justify-content:space-between;
//     align-items:center;
//     font-size:30px;
//     color:#333;
// }

// .detail-row span{
//     font-weight:500;
// }

// .detail-row strong{
//     font-weight:600;
//     color:#222;
// }
//     .gallery-section {
//   display: flex;
//   gap: 16px;
//   width: 100%;
// }

// .main-image {
//   flex: 1;
//   height: 420px;
//   border-radius: 16px;
//   overflow: hidden;
// }

// .main-image img {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   display: block;
// }

// .side-images {
//   width: 180px;
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// }

// .thumb {
//   flex: 1;
//   border-radius: 14px;
//   overflow: hidden;
// }

// .thumb img {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   display: block;
// }

// .thumb:hover img,
// .main-image:hover img {
//   transform: scale(1.04);
//   transition: .3s ease;
// }
  


//         /* ── Right: Info ── */
//         .card-right {
//           flex: 1;
//           min-width: 0;
//           padding-top: 4px;
//         }

//         .service-title {
//           font-size: 20px;
//           font-weight: 700;
//           color: ${TEXT_PRIMARY};
//           letter-spacing: -0.2px;
//           margin-bottom: 6px;
//         }

//         .rating-row {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           margin-bottom: 6px;
//         }

//         .rating-stars {
//           display: flex;
//           align-items: center;
//           gap: 2px;
//           color: #f59e0b;
//         }

//         .rating-text {
//           font-size: 13px;
//           color: ${TEXT_SECONDARY};
//         }

//         .location-row {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 13.5px;
//           color: ${TEXT_SECONDARY};
//           margin-bottom: 20px;
//         }

//         .location-row svg {
//           color: ${TEXT_MUTED};
//         }

//         /* ── Info Grid ── */
//         .info-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 0;
//           border-top: 1px solid ${BORDER};
//         }

//         .info-cell {
//           padding: 14px 16px;
//           border-bottom: 1px solid ${BORDER};
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }

//         .info-cell:nth-child(odd) {
//           border-right: 1px solid ${BORDER};
//         }

//         .info-cell-label {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 12.5px;
//           color: ${TEXT_SECONDARY};
//           font-weight: 500;
//         }

//         .info-cell-label svg {
//           color: ${TEXT_MUTED};
//           width: 14px;
//           height: 14px;
//         }

//         .info-cell-value {
//           font-size: 14px;
//           font-weight: 600;
//           color: ${TEXT_PRIMARY};
//           padding-left: 20px;
//         }

//    .service-extra{
//     display:flex;
//     gap:40px;
//     margin-top:50px;
//     align-items:flex-start;
// }

// /* Left */

// .service-left{
//     flex:2;
// }

// .about-section{
//     margin-bottom:40px;
// }

// .about-section h2,
// .tags-section h2,
// .availability-section h2{
//     font-size:26px;
//     font-weight:700;
//     margin-bottom:18px;
//     color:#111827;
// }

// .about-section p{
//     color:#4B5563;
//     line-height:1.8;
//     font-size:16px;
// }

// /* Tags */

// .tags{
//     display:flex;
//     flex-wrap:wrap;
//     gap:12px;
// }

// .tags span{
//     padding:10px 18px;
//     border-radius:999px;
//     background:#EEF2FF;
//     color:#4F46E5;
//     border:1px solid #C7D2FE;
//     font-size:14px;
//     font-weight:500;
// }

// /* Right */

// .availability-section{
//     flex:1;
// }

// .availability-card{
//     border:1px solid #E5E7EB;
//     border-radius:16px;
//     padding:20px;
//     background:#fff;
// }

// .row{
//     display:flex;
//     justify-content:space-between;
//     padding:14px 0;
//     border-bottom:1px solid #F1F5F9;
// }

// .row:last-child{
//     border-bottom:none;
// }

// .row span{
//     color:#6B7280;
// }

// .row strong{
//     color:#111827;
// }

// .available{
//     color:#16A34A;
// }

// /* Responsive */

// @media (max-width:992px){

// .service-extra{
//     flex-direction:column;
// }

// .service-left,
// .availability-section{
//     width:100%;
// }

}      
        /* ── Actions ── */
        .actions {
          display: flex;
          gap: 50px;
          justify-content: center;
        }

        .btn {
          padding: 10px 28px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-edit {
          background: ${CARD_BG};
          color: ${ACCENT};
          border: 1.5px solid ${ACCENT};
          min-width: 140px;
          justify-content: center;
        }

        .btn-edit:hover {
          background: #eff6ff;
        }

        .btn-publish {
          background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER});
          color: #fff;
          border: none;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
          min-width: 160px;
          justify-content: center;
        }

        .btn-publish:hover {
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }

        .btn-publish:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
          @media (max-width: 768px) {
  .about-section {
    margin-top: 30px;
    padding-top: 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .about-text {
    font-size: 16px;
    line-height: 1.7;
  }
}

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .preview-container { padding: 16px 16px 32px; }
          .listing-card { padding: 16px; }
          .card-layout { flex-direction: column; }
          .card-left { flex: 0 0 auto; width: 100%; }
          .card-image-wrap { aspect-ratio: 16 / 10; }
          .info-grid { grid-template-columns: 1fr; }
          .info-cell:nth-child(odd) { border-right: none; }
          .actions { flex-direction: column; gap: 12px; }
          .btn { width: 100%; justify-content: center; }
          .draft-saved { display: none; }
          .map-small { height: 140px; }
        }

          `}</style>
      <div className="preview-page">
        <div className="preview-container">
          {/* Header */}
          <div className="preview-header">
            <button className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={16} />
              Back
            </button>
            <div className="draft-saved">
              Draft Saved <FiCheck size={16} />
            </div>
          </div>

          {/* Title */}
          <div className="page-header">
            <h1 className="page-title">Preview your listing</h1>
            <p className="page-subtitle">Review your listing details before publishing.</p>
          </div>
          <div className="listing-card">
            <div className="card-layout">
              {/* Left: Image + Map */}
              <div className="card-left">
                <div className="gallery-section">
                  <div className="main-image">
                    <img src="/bridal-main.png" alt="Bridal Makeup" />
                  </div>

                  <div className="side-images">
                    <div className="thumb">
                      <img src="/bridal-1.png" alt="" />
                    </div>

                    <div className="thumb">
                      <img src="/bridal-2.png" alt="" />
                    </div>

                    <div className="thumb">
                      <img src="/bridal-3.png" alt="" />
                    </div>
                  </div>
                </div>

              </div>
              <div className="card-right">
                {/* ================= Service Details ================= */}

                <div className="service-details">
                  <div className="service-header">
                    <div>
                      <h2 className="service-title">Bridal Makeup</h2>
                    </div>

                    <span className="verified-badge">Verified</span>
                  </div>

                  <div className="top-cards">
                    <div className="info-card">
                      <h3>NPR 3500</h3>
                      <span>Starting price</span>
                    </div>

                    <div className="info-card">
                      <h3>At Studio</h3>
                      <span>Service Type</span>
                    </div>
                  </div>

                  <div className="details-list">
                    <div className="detail-row">
                      <span>Duration</span>
                      <strong>120 minutes</strong>
                    </div>

                    <div className="detail-row">
                      <span>Professional Gender</span>
                      <strong>Female</strong>
                    </div>

                    <div className="detail-row">
                      <span>Experience</span>
                      <strong>5+ Years</strong>
                    </div>

                    <div className="detail-row">
                      <span>Service Location</span>
                      <strong>At Studio</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="service-left">
              <div className="about-section">
                <h2>About</h2>

                <p>
                  Professional bridal makeup service using premium cosmetic brands to
                  create a flawless and long-lasting look for your special day.
                  Includes skin preparation, bridal makeup and finishing touch.
                </p>
              </div>

              <div className="tags-section">
                <h2>Tags</h2>

                <div className="tags">
                  <span>Bridal Makeup</span>
                  <span>Wedding</span>
                  <span>Professional</span>
                  <span>Premium</span>
                  <span>Beauty</span>
                  <span>Salon</span>
                </div>
              </div>

            </div>
            <div className="service-extra">

              <div className="availability-section">

                <div className="availability-right">
                  <div className="availability-card">

                    < div className="availability-info">

                      <div className="icon-box">
                        <FiCalendar size={22} />
                      </div>

                      <div className="availability-text">

                        <h3>Availability</h3>
                        <p>Mon – Sun</p>
                        <span>10:00 AM - 8:00 PM</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>
            <div className="divider" />


            <div className="actions">
              <button className="btn btn-edit" onClick={() => handleEdit("detail")}>
                <FiEdit2 size={15} />
                Edit Listing
              </button>
              <button
                className="btn btn-publish"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <span className="spinner" />
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish Listing
                    <FiSend size={15} />
                  </>
                )}
              </button>
            </div>
          </div>




          <div className="divider" />




        </div>
      </div>




    </>
  );
}