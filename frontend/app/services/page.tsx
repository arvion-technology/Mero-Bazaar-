import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiScissors,
  FiHome,
  FiHeart,
  FiDroplet,
  FiTruck,
  FiCoffee,
  FiKey,
  FiTool,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";

export default function ServicesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .sv-wrap { min-height: 100vh; background: #f9fafb; font-family: 'Inter', -apple-system, sans-serif; }

        .sv-hero { position: relative; height: 260px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .sv-hero-bg { position: absolute; inset: 0; display: flex; }
        .sv-hero-bg-left, .sv-hero-bg-right { flex: 1; background-size: cover; background-position: center; }
        .sv-hero-bg-left { background-image: url('/hero-left.jpg'); }
        .sv-hero-bg-right { background-image: url('/hero-right.jpg'); }
        .sv-hero-bg-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.55); z-index: 1; }
        .sv-hero-inner { position: relative; z-index: 2; text-align: center; max-width: 680px; padding: 0 24px; width: 100%; }
        .sv-hero-inner h1 { font-size: 30px; font-weight: 800; color: #fff; margin: 0 0 8px; letter-spacing: -0.3px; }
        .sv-hero-inner p { color: rgba(255,255,255,0.8); font-size: 14px; margin: 0 0 24px; }

        .sv-search-box { display: flex; align-items: center; background: #fff; border-radius: 10px; padding: 4px; gap: 4px; max-width: 640px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; }
        .sv-search-input-wrap { flex: 1; display: flex; align-items: center; padding: 0 16px; gap: 10px; height: 44px; }
        .sv-search-input { flex: 1; border: none; outline: none; font-size: 14px; color: #374151; font-family: inherit; background: transparent; width: 100%; }
        .sv-search-input::placeholder { color: #9ca3af; }
        .sv-search-btn { padding: 0 22px; height: 44px; background: #e11d48; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; white-space: nowrap; flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px; }
        .sv-search-btn:hover { background: #be123c; }

        .sv-section { max-width: 1280px; margin: 0 auto; padding: 48px 20px; }
        .sv-section-header { text-align: center; margin-bottom: 32px; }
        .sv-section-header h2 { font-size: 24px; font-weight: 800; color: #111827; margin: 0 0 6px; }
        .sv-section-header p { font-size: 14px; color: #6b7280; margin: 0; }

        .sv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .sv-card { text-align: center; padding: 28px 24px; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; }
        .sv-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); border-color: #e11d48; }
        .sv-icon { width: 52px; height: 52px; border-radius: 12px; background: #fef2f2; color: #e11d48; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .sv-card h3 { font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 6px; }
        .sv-card p { font-size: 13px; color: #6b7280; line-height: 1.6; margin: 0 0 12px; }
        .sv-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; margin-bottom: 14px; }
        .sv-tag { font-size: 11px; font-weight: 500; color: #374151; background: #f3f4f6; padding: 3px 10px; border-radius: 20px; border: 1px solid #e5e7eb; }
        .sv-link { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 700; color: #e11d48; transition: gap 0.15s; text-decoration: none; }
        .sv-card:hover .sv-link { gap: 8px; }

        .sv-why-inner { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 36px 32px; }
        .sv-why-title { text-align: center; font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 4px; }
        .sv-why-sub { text-align: center; font-size: 13.5px; color: #6b7280; margin: 0 0 28px; }
        .sv-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; }
        .sv-why-card { text-align: center; padding: 24px 20px; border-radius: 10px; border: 1px solid #f3f4f6; background: #fff; transition: all 0.2s; }
        .sv-why-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-2px); border-color: #e5e7eb; }
        .sv-why-icon { width: 44px; height: 44px; border-radius: 10px; background: #fef2f2; color: #e11d48; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .sv-why-card h3 { font-size: 14px; font-weight: 700; color: #111827; margin: 0 0 4px; }
        .sv-why-card p { font-size: 12.5px; color: #6b7280; line-height: 1.5; margin: 0; }

        @media (max-width: 1024px) {
          .sv-grid { grid-template-columns: repeat(2, 1fr); }
          .sv-why-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .sv-grid { grid-template-columns: 1fr; }
          .sv-why-grid { grid-template-columns: 1fr; }
          .sv-section { padding: 32px 16px; }
          .sv-hero { height: auto; min-height: 220px; padding: 40px 16px; }
          .sv-hero-inner h1 { font-size: 22px; }
          .sv-hero-inner p { font-size: 12.5px; margin-bottom: 18px; }
          .sv-search-box { max-width: 100%; }
          .sv-search-input { font-size: 16px; }
          .sv-search-btn { padding: 0 18px; height: 42px; font-size: 14px; }
          .sv-why-inner { padding: 24px 20px; }
        }
      `}</style>

      <div className="sv-wrap">
        <section className="sv-section">
          <div className="sv-section-header">
            <h2>What We Offer</h2>
            <p>Browse our categories and find the right service for your needs</p>
          </div>

          <div className="sv-grid">
            {/* Hair & Beauty */}
            <div className="sv-card">
              <div className="sv-icon"><FiScissors size={24} /></div>
              <h3>Hair & Beauty</h3>
              <p>Bridal makeup, facials, hair styling, spa treatments, and personal grooming services by verified professionals.</p>
              <div className="sv-tags">
                <span className="sv-tag">Bridal Makeup</span>
                <span className="sv-tag">Facial</span>
                <span className="sv-tag">Spa</span>
              </div>
              <Link href="/category/beauty" className="sv-link">
                Explore <FiArrowRight size={14} />
              </Link>
            </div>

            {/* Home Repair */}
            <div className="sv-card">
              <div className="sv-icon"><FiHome size={24} /></div>
              <h3>Home Repair</h3>
              <p>AC installation, plumbing, electrical work, carpentry, and general home maintenance by skilled technicians.</p>
              <div className="sv-tags">
                <span className="sv-tag">AC Repair</span>
                <span className="sv-tag">Plumbing</span>
                <span className="sv-tag">Electrical</span>
              </div>
              <Link href="/category/trade-and-homerepair" className="sv-link">
                Explore <FiArrowRight size={14} />
              </Link>
            </div>

            {/* Medical & Dental */}
            <div className="sv-card">
              <div className="sv-icon"><FiHeart size={24} /></div>
              <h3>Medical & Dental</h3>
              <p>General physician visits, dental care, health checkups, and clinic appointments at your convenience.</p>
              <div className="sv-tags">
                <span className="sv-tag">Physician</span>
                <span className="sv-tag">Dental</span>
                <span className="sv-tag">Checkup</span>
              </div>
              <Link href="/category/medical" className="sv-link">
                Explore <FiArrowRight size={14} />
              </Link>
            </div>

            {/* Cleaning Services */}
            <div className="sv-card">
              <div className="sv-icon"><FiDroplet size={24} /></div>
              <h3>Cleaning Services</h3>
              <p>Deep home cleaning, office cleaning, sofa and carpet cleaning by trained professionals using safe products.</p>
              <div className="sv-tags">
                <span className="sv-tag">Deep Clean</span>
                <span className="sv-tag">Office</span>
                <span className="sv-tag">Sofa</span>
              </div>
              <Link href="/category/trade-and-homerepair" className="sv-link">
                Explore <FiArrowRight size={14} />
              </Link>
            </div>

            {/* Agriculture */}
            <div className="sv-card">
              <div className="sv-icon"><FiTruck size={24} /></div>
              <h3>Agriculture</h3>
              <p>Farm services, livestock care, organic produce delivery, and equipment support from local experts.</p>
              <div className="sv-tags">
                <span className="sv-tag">Organic</span>
                <span className="sv-tag">Livestock</span>
                <span className="sv-tag">Equipment</span>
              </div>
              <Link href="/category/agriculture-and-livestock" className="sv-link">
                Explore <FiArrowRight size={14} />
              </Link>
            </div>

            {/* Food & Catering */}
            <div className="sv-card">
              <div className="sv-icon"><FiCoffee size={24} /></div>
              <h3>Food & Catering</h3>
              <p>Home kitchen meals, tiffin services, event catering, and healthy meal subscriptions delivered fresh.</p>
              <div className="sv-tags">
                <span className="sv-tag">Tiffin</span>
                <span className="sv-tag">Catering</span>
                <span className="sv-tag">Healthy Meals</span>
              </div>
              <Link href="/category/food" className="sv-link">
                Explore <FiArrowRight size={14} />
              </Link>
            </div>

            {/* Rent & Real Estate */}
            <div className="sv-card">
              <div className="sv-icon"><FiKey size={24} /></div>
              <h3>Rent & Real Estate</h3>
              <p>Property rentals, real estate consulting, property management, and tenant services you can trust.</p>
              <div className="sv-tags">
                <span className="sv-tag">House Rent</span>
                <span className="sv-tag">Office Space</span>
                <span className="sv-tag">Consulting</span>
              </div>
              <Link href="/category/rent-and-real-estate" className="sv-link">
                Explore <FiArrowRight size={14} />
              </Link>
            </div>

            {/* Vehicle Services */}
            <div className="sv-card">
              <div className="sv-icon"><FiTool size={24} /></div>
              <h3>Vehicle Services</h3>
              <p>Buy and sell vehicles, maintenance, rental services, and emergency roadside assistance near you.</p>
              <div className="sv-tags">
                <span className="sv-tag">Buy/Sell</span>
                <span className="sv-tag">Rental</span>
                <span className="sv-tag">Towing</span>
              </div>
              <Link href="/category/vehicles" className="sv-link">
                Explore <FiArrowRight size={14} />
              </Link>
            </div>

            {/* Jobs & Labor */}
            <div className="sv-card">
              <div className="sv-icon"><FiBriefcase size={24} /></div>
              <h3>Jobs & Labor</h3>
              <p>Find skilled labor, part-time jobs, professional services, and recruitment solutions quickly.</p>
              <div className="sv-tags">
                <span className="sv-tag">Skilled Labor</span>
                <span className="sv-tag">Part-time</span>
                <span className="sv-tag">Hire</span>
              </div>
              <Link href="/category/job" className="sv-link">
                Explore <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="sv-section">
          <div className="sv-why-inner">
            <h2 className="sv-why-title">Why Book With Us?</h2>
            <p className="sv-why-sub">We make finding and booking services simple, safe, and reliable.</p>
            <div className="sv-why-grid">
              <div className="sv-why-card">
                <div className="sv-why-icon"><FiCheckCircle size={22} /></div>
                <h3>Verified Professionals</h3>
                <p>Every service provider is background-checked and verified for your safety.</p>
              </div>
              <div className="sv-why-card">
                <div className="sv-why-icon"><FiStar size={22} /></div>
                <h3>Rated & Reviewed</h3>
                <p>Browse genuine reviews and ratings from real customers before you book.</p>
              </div>
              <div className="sv-why-card">
                <div className="sv-why-icon"><FiShield size={22} /></div>
                <h3>Secure Booking</h3>
                <p>Book with confidence. Your payments and personal data are fully protected.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}