import type { ReactNode } from "react";
import Footer from "@/components/Footer";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .sp-page { background: #f5f6f8; min-height: 100vh; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding-bottom: 64px; }

  .sp-container { max-width: 1000px; margin: 24px auto 0; padding: 0 24px; display: flex; flex-direction: column; gap: 18px; }

  .sp-header-card { background: #fff; border-radius: 16px; padding: 26px 28px; box-shadow: 0 2px 14px rgba(0,0,0,.07); display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap; }
  .sp-avatar { width: 84px; height: 84px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,.14); flex-shrink: 0; }
  .sp-avatar-placeholder { width: 84px; height: 84px; border-radius: 50%; background: linear-gradient(135deg,#C0392B 0%,#8e1c10 100%); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: #fff; flex-shrink: 0; box-shadow: 0 2px 10px rgba(0,0,0,.14); }
  .sp-header-info { flex: 1; min-width: 220px; }
  .sp-name { font-size: 24px; font-weight: 800; color: #1a1a1a; margin: 0 0 6px; }
  .sp-rating-row { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
  .sp-rating-num { font-size: 14px; font-weight: 700; color: #1a1a1a; }
  .sp-reviews { font-size: 12.5px; color: #888; }
  .sp-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
  .sp-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .sp-badge-verified { background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf; }
  .sp-member-since { font-size: 12.5px; color: #999; }

  .sp-business-card { background: #fff; border-radius: 16px; padding: 20px 22px; box-shadow: 0 2px 14px rgba(0,0,0,.07); }
  .sp-section-title { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0 0 12px; }
  .sp-business-name { font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 0 0 4px; }
  .sp-business-type { display: inline-block; font-size: 11px; font-weight: 600; color: #888; background: #f5f5f5; border-radius: 5px; padding: 2px 8px; margin-bottom: 10px; text-transform: capitalize; }
  .sp-business-desc { font-size: 13.5px; color: #444; line-height: 1.7; margin: 0 0 8px; }
  .sp-business-addr { font-size: 12.5px; color: #888; display: flex; align-items: center; gap: 5px; }

  .sp-stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .sp-stat-chip { background: #fff; border-radius: 14px; padding: 16px; text-align: center; box-shadow: 0 2px 14px rgba(0,0,0,.07); }
  .sp-stat-val { font-size: 20px; font-weight: 800; color: #C0392B; }
  .sp-stat-label { font-size: 11.5px; color: #888; margin-top: 3px; }

  .sp-section-card { background: #fff; border-radius: 16px; padding: 20px 22px; box-shadow: 0 2px 14px rgba(0,0,0,.07); }

  .sp-review-row { padding: 14px 0; border-bottom: 1px solid #f5f5f5; }
  .sp-review-row:last-child { border-bottom: none; }
  .sp-review-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; }
  .sp-review-name { font-size: 13.5px; font-weight: 700; color: #1a1a1a; }
  .sp-review-date { font-size: 11.5px; color: #aaa; margin-left: auto; }
  .sp-review-listing { font-size: 11.5px; color: #2980b9; margin-bottom: 4px; }
  .sp-review-comment { font-size: 13px; color: #555; line-height: 1.6; margin: 4px 0 0; }
  .sp-empty { font-size: 13px; color: #999; text-align: center; padding: 20px 0; }

  .sp-listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
  .sp-listing-card { border: 1.5px solid #ebebeb; border-radius: 12px; overflow: hidden; text-decoration: none; display: flex; flex-direction: column; transition: transform .2s, box-shadow .2s; }
  .sp-listing-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,.09); }
  .sp-listing-img-wrap { width: 100%; height: 100px; overflow: hidden; background: #eee; }
  .sp-listing-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .sp-listing-body { padding: 8px 10px 10px; }
  .sp-listing-title { font-size: 12px; font-weight: 700; color: #1a1a1a; margin: 0 0 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .sp-listing-price { font-size: 12.5px; font-weight: 800; color: #C0392B; margin: 0; }

  .sp-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 14px; }
  .sp-page-link { padding: 6px 12px; border-radius: 8px; border: 1px solid #e0e0e0; font-size: 12.5px; font-weight: 600; color: #555; text-decoration: none; }
  .sp-page-link.active { background: #C0392B; color: #fff; border-color: #C0392B; }

  @media (max-width: 600px) {
    .sp-container { padding: 0 12px; }
    .sp-header-card { padding: 18px 16px; }
    .sp-stats-row { grid-template-columns: repeat(3,1fr); gap: 8px; }
    .sp-listings-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
  }
`;

export default function SellerProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="sp-page">
        {children}
        <Footer />
      </div>
    </>
  );
}