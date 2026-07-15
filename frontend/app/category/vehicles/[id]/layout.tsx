import type { ReactNode } from "react";
import Footer from "@/components/Footer";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .ld-page {
    background: #f5f6f8;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding-bottom: 64px;
  }

  /* ── Top bar ── */
  .ld-topbar { background: #fff; border-bottom: 1px solid #ececec; padding: 11px 0; }
  .ld-topbar-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
  }
  .ld-breadcrumb { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; font-size: 12.5px; color: #888; }
  .ld-bc-link { color: #C0392B; text-decoration: none; font-weight: 500; transition: opacity .18s; }
  .ld-bc-link:hover { opacity: .75; text-decoration: underline; }
  .ld-bc-sep { color: #ccc; font-size: 11px; }
  .ld-bc-current { color: #555; font-weight: 500; }
  .ld-listing-id { font-size: 12px; color: #999; font-weight: 500; white-space: nowrap; }
  .ld-report { font-size: 12px; color: #C0392B; font-weight: 600; text-decoration: none; transition: opacity .18s; white-space: nowrap; }
  .ld-report:hover { opacity: .75; text-decoration: underline; }

  /* ── Layout grid ── */
  .ld-container {
    max-width: 1200px; margin: 22px auto 0; padding: 0 24px;
    display: grid; grid-template-columns: 1fr 330px; gap: 22px; align-items: start;
  }
  .ld-left  { display: flex; flex-direction: column; gap: 16px; }
  .ld-right { display: flex; flex-direction: column; gap: 16px; justify-content: flex-end;}

  /* ── Image gallery ── */
  .ld-img-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,.07); }
  .ld-main-img-wrap { position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; background: #1a1a2e; cursor: zoom-in; }
  .ld-main-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; display: block; }
  .ld-main-img-wrap:hover .ld-main-img { transform: scale(1.04); }
  .ld-thumbs { display: flex; gap: 8px; padding: 10px 12px; overflow-x: auto; background: #fff; scrollbar-width: none; }
  .ld-thumbs::-webkit-scrollbar { display: none; }
  .ld-thumb-wrap { flex-shrink: 0; position: relative; width: 80px; height: 56px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2.5px solid transparent; transition: border-color .2s, transform .18s; }
  .ld-thumb-wrap:hover { transform: translateY(-2px); }
  .ld-thumb-wrap.active { border-color: #C0392B; }
  .ld-thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ld-thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.54); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 800; }

  /* ── Info card ── */
  .ld-info-card { background: #fff; border-radius: 16px; padding: 20px 22px 22px; box-shadow: 0 2px 14px rgba(0,0,0,.07); }
  .ld-verified-badge { display: inline-flex; align-items: center; gap: 5px; background: #eafaf1; color: #1e8449; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 5px; margin-bottom: 10px; letter-spacing: .3px; text-transform: uppercase; }
  .ld-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
  .ld-title { font-size: 20px; font-weight: 800; color: #1a1a1a; line-height: 1.3; margin: 0; flex: 1; }
  .ld-action-btns { display: flex; gap: 8px; flex-shrink: 0; margin-top: 2px; }
  .ld-action-btn { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid #e0e0e0; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s, border-color .2s, transform .15s; position: relative; }
  .ld-action-btn:hover { background: #f5f5f5; border-color: #ccc; transform: scale(1.1); }
  .ld-action-btn.fav-active { border-color: #e74c3c; background: #fff5f5; }
  .ld-price { font-size: 24px; font-weight: 900; color: #1a1a1a; margin: 6px 0 2px; }
  .ld-negotiable { display: inline-block; font-size: 12px; font-weight: 600; color: #888; background: #f5f5f5; border-radius: 5px; padding: 2px 8px; margin-bottom: 10px; }
  .ld-meta-row { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; padding-bottom: 14px; border-bottom: 1px solid #f0f0f0; margin-bottom: 16px; font-size: 13px; }
  .ld-loc { display: flex; align-items: center; gap: 4px; color: #555; font-weight: 500; }
  .ld-driven-meta { display: flex; align-items: center; gap: 4px; color: #888; font-weight: 400; }
  .ld-posted { color: #aaa; font-size: 12px; }
  .ld-map-link { color: #C0392B; font-size: 12.5px; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 3px; margin-left: auto; transition: opacity .18s; }
  .ld-map-link:hover { opacity: .75; }

  /* ── Spec chips ── */
  .ld-specs-bar { display: grid; grid-template-columns: repeat(6,1fr); gap: 8px; }
  .ld-spec-chip { display: flex; flex-direction: column; align-items: center; gap: 5px; background: #f8f9fb; border-radius: 10px; padding: 10px 6px 9px; border: 1px solid #eef0f3; text-align: center; transition: background .2s, border-color .2s; }
  .ld-spec-chip:hover { background: #f0f2f8; border-color: #d9dde8; }
  .ld-spec-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.07); }
  .ld-spec-val { font-size: 12px; font-weight: 800; color: #1a1a1a; line-height: 1.2; }
  .ld-spec-label { font-size: 10px; color: #999; font-weight: 500; }

  /* ── Description ── */
  .ld-desc-card { background: #fff; border-radius: 16px; padding: 20px 22px; box-shadow: 0 2px 14px rgba(0,0,0,.07); }
  .ld-section-title { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0 0 11px; }
  .ld-desc-text { font-size: 13.5px; color: #444; line-height: 1.8; margin: 0; }
  .ld-desc-text.clamped { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .ld-see-more { display: inline-block; margin-top: 8px; font-size: 13px; font-weight: 600; color: #2980b9; background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; transition: opacity .18s; }
  .ld-see-more:hover { opacity: .72; }

  /* ── Vehicle details table ── */
  .ld-details-card { background: #fff; border-radius: 16px; padding: 20px 22px; box-shadow: 0 2px 14px rgba(0,0,0,.07); border-top: 3px solid #C0392B; }
  .ld-details-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
  .ld-details-col { display: flex; flex-direction: column; }
  .ld-details-divider { background: #f0f0f0; margin: 0 22px; }
  .ld-detail-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; gap: 10px; }
  .ld-detail-row:last-child { border-bottom: none; }
  .ld-detail-label { color: #777; font-weight: 400; }
  .ld-detail-val { color: #1a1a1a; font-weight: 700; text-align: right; }

  /* ── Seller card ── */
  .ld-seller-card { background: #fff; border-radius: 16px; padding: 20px 18px; box-shadow: 0 2px 14px rgba(0,0,0,.08); }
  .ld-seller-card-title { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0 0 14px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; }
  .ld-seller-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .ld-seller-avatar-wrap { position: relative; flex-shrink: 0; }
  .ld-seller-avatar { width: 58px; height: 58px; border-radius: 50%; object-fit: cover; border: 2.5px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,.14); display: block; }
  .ld-avatar-placeholder { width: 58px; height: 58px; border-radius: 50%; background: linear-gradient(135deg,#C0392B 0%,#8e1c10 100%); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; color: #fff; flex-shrink: 0; box-shadow: 0 2px 10px rgba(0,0,0,.14); }
  .ld-seller-online { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; border-radius: 50%; background: #27ae60; border: 2px solid #fff; }
  .ld-seller-name { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0 0 4px; }
  .ld-rating-row { display: flex; align-items: center; gap: 5px; }
  .ld-rating-num { font-size: 13.5px; font-weight: 700; color: #1a1a1a; }
  .ld-reviews { font-size: 11.5px; color: #888; }
  .ld-seller-badges { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
  .ld-sbadge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .ld-sbadge-verified { background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf; }
  .ld-sbadge-pro      { background: #fef9e7; color: #b7950b; border: 1px solid #f9e79f; }
  .ld-sbadge-trusted  { background: #f4ecf7; color: #7d3c98; border: 1px solid #d7bde2; }
  .ld-seller-stats { border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; margin-bottom: 14px; }
  .ld-stat-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f8f8; font-size: 12.5px; }
  .ld-stat-row:last-child { border-bottom: none; }
  .ld-stat-label { color: #777; }
  .ld-stat-val   { color: #1a1a1a; font-weight: 700; }
  .ld-cta-btns { display: flex; flex-direction: column; gap: 8px; }
  .ld-btn-call { width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg,#27ae60 0%,#1e8449 100%); color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; font-family: inherit; box-shadow: 0 4px 14px rgba(39,174,96,.32); transition: opacity .2s, transform .15s; }
  .ld-btn-call:hover { opacity: .9; transform: translateY(-1px); }
  .ld-btn-chat { width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg,#8e44ad 0%,#6c3483 100%); color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; font-family: inherit; box-shadow: 0 4px 14px rgba(142,68,173,.28); transition: opacity .2s, transform .15s; }
  .ld-btn-chat:hover { opacity: .9; transform: translateY(-1px); }
  .ld-btn-msg { width: 100%; padding: 11px; border-radius: 10px; border: 1.5px solid #e0e0e0; background: #fff; color: #333; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; font-family: inherit; transition: background .18s, border-color .18s; }
  .ld-btn-msg:hover { background: #f5f5f5; border-color: #ccc; }

  /* ── Location card ── */
  .ld-location-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,.08); }
  .ld-location-card-title { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0; padding: 16px 18px 12px; border-bottom: 1px solid #f0f0f0; }
  .ld-map-area { width: 100%; height: 185px; position: relative; overflow: hidden; background: #e8efe8; }
  .ld-map-pin { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-100%) translateY(4px); display: flex; flex-direction: column; align-items: center; animation: mapPinBounce 2s ease-in-out infinite; z-index: 5; }
  @keyframes mapPinBounce {
    0%,100% { transform: translate(-50%,-100%) translateY(4px); }
    50%      { transform: translate(-50%,-100%) translateY(-2px); }
  }
  .ld-map-label { background: #1a1a1a; color: #fff; font-size: 10.5px; font-weight: 700; padding: 3px 8px; border-radius: 5px; white-space: nowrap; box-shadow: 0 3px 10px rgba(0,0,0,.35); margin-top: 3px; }
  .ld-location-info { padding: 12px 18px; }
  .ld-location-name { font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin: 0 0 3px; }
  .ld-location-dist { font-size: 12px; color: #888; margin: 0 0 6px; }
  .ld-location-extra { font-size: 12.5px; color: #555; margin: 0 0 8px; }
  .ld-map-view-link { display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 13px; font-weight: 600; color: #C0392B; text-decoration: none; border-top: 1px solid #f0f0f0; padding: 10px 18px; transition: background .18s; }
  .ld-map-view-link:hover { background: #fff5f5; }

  /* ── Related listings ── */
  .ld-related-section { max-width: 1200px; margin: 0 auto; padding: 24px 24px 0; }
  .ld-related-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .ld-related-title { font-size: 18px; font-weight: 800; color: #1a1a1a; margin: 0; }
  .ld-related-viewall { font-size: 13px; font-weight: 600; color: #C0392B; text-decoration: none; display: flex; align-items: center; gap: 3px; transition: opacity .18s; }
  .ld-related-viewall:hover { opacity: .75; }
  .ld-related-scroll { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: thin; scrollbar-color: #ddd transparent; }
  .ld-related-scroll::-webkit-scrollbar       { height: 4px; }
  .ld-related-scroll::-webkit-scrollbar-track { background: transparent; }
  .ld-related-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
  .ld-rel-card { flex-shrink: 0; width: 168px; background: #fff; border-radius: 12px; overflow: hidden; border: 1.5px solid #ebebeb; text-decoration: none; display: flex; flex-direction: column; cursor: pointer; transition: transform .22s, box-shadow .22s, border-color .22s; position: relative; }
  .ld-rel-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(0,0,0,.1); border-color: #ddd; }
  .ld-rel-img-wrap { width: 100%; height: 112px; overflow: hidden; position: relative; }
  .ld-rel-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s; }
  .ld-rel-card:hover .ld-rel-img { transform: scale(1.07); }
  .ld-rel-heart { position: absolute; top: 7px; right: 7px; width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,.9); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; z-index: 3; padding: 0; box-shadow: 0 2px 6px rgba(0,0,0,.14); transition: transform .18s; }
  .ld-rel-heart:hover { transform: scale(1.18); }
  .ld-rel-badge { position: absolute; bottom: 7px; left: 7px; background: #27ae60; color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; letter-spacing: .4px; display: flex; align-items: center; gap: 3px; }
  .ld-rel-body { padding: 9px 10px 11px; display: flex; flex-direction: column; gap: 3px; }
  .ld-rel-name { font-size: 12px; font-weight: 700; color: #1a1a1a; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; }
  .ld-rel-price { font-size: 12.5px; font-weight: 800; color: #C0392B; margin: 2px 0 0; }
  .ld-rel-loc { font-size: 10.5px; color: #aaa; margin: 0; display: flex; align-items: center; gap: 3px; }

  /* ── Tooltip ── */
  .ld-tooltip { position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 6px; white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity .15s; z-index: 10; }
  .ld-action-btn:hover .ld-tooltip { opacity: 1; }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .ld-container { grid-template-columns: 1fr; }
    .ld-seller-card { position: static; }
    .ld-right { order: 1; }
    .ld-specs-bar { grid-template-columns: repeat(3,1fr); }
    .ld-details-grid { grid-template-columns: 1fr; }
    .ld-details-divider { display: none; }
  }
  @media (max-width: 720px) {
    .ld-topbar-inner { flex-direction: column; align-items: flex-start; gap: 4px; padding: 8px 16px; }
    .ld-breadcrumb { font-size: 11px; }
    .ld-listing-id, .ld-report { font-size: 11px; }
  }
  @media (max-width: 600px) {
    .ld-container { padding: 0 12px; margin-top: 12px; gap: 12px; }
    .ld-related-section { padding: 16px 12px 0; }
    .ld-info-card, .ld-desc-card, .ld-details-card { padding: 14px; }
    .ld-title { font-size: 16px; }
    .ld-price { font-size: 20px; }
    .ld-specs-bar { grid-template-columns: repeat(3,1fr); gap: 6px; }
    .ld-spec-chip { padding: 8px 4px 7px; }
    .ld-spec-icon { width: 26px; height: 26px; }
    .ld-meta-row { gap: 10px; font-size: 12px; }
    .ld-map-link { margin-left: 0; }
    .ld-seller-card { padding: 16px 14px; }
    .ld-thumb-wrap { width: 64px; height: 46px; }
    .ld-related-title { font-size: 16px; }
    .ld-rel-card { width: 148px; }
    .ld-rel-img-wrap { height: 98px; }
    .ld-section-title { font-size: 15px; }
    .ld-details-grid { grid-template-columns: 1fr; }
    .ld-details-divider { display: none; }
  }
  @media (max-width: 420px) {
    .ld-specs-bar { grid-template-columns: repeat(2,1fr); }
    .ld-container { padding: 0 10px; }
    .ld-title  { font-size: 15px; }
    .ld-price  { font-size: 18px; }
    .ld-rel-card { width: 136px; }
  }
`;

export default function ListingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ld-page">
        {children}
        <Footer />
      </div>
    </>
  );
}
