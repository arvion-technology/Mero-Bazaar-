"use client";

import Link from "next/link";

const listings = [
{
    id: "bajaj-pulsar",
    title: "Bajaj Pulsar N160 Dual Channel",
    location: "Kathmandu, Bagmati",
    price: "Rs. 3,25,000",
    meta: ["2023", "12K km"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    href: "/category/vehicles",
    image: "/bajaj.avif",
    category: "vehicles",
  },
  {
    id: "2bhk-apartment",
    title: "2BHK Apartment for Rent",
    location: "Lalitpur, Bagmati",
    price: "Rs. 22,000 / month",
    meta: ["2 Beds", "2 Baths"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    href: "/category/rent-and-real-estate",
    image: "/apartment.avif",
    category: "property",
  },
  {
    id: "senior-frontend",
    title: "Senior Frontend Developer",
    location: "Kathmandu, Bagmati",
    price: "Rs. 80,000 – 1,20,000",
    meta: ["Full Time"],
    badge: "FEATURED",
    badgeColor: "#F39C12",
    href: "/category/job",
    image: "/Senior Frontend Developer.webp",
    category: "jobs",
  },
  {
    id: "dental-checkup",
    title: "Dental Checkup & Cleaning",
    location: "Kathmandu, Bagmati",
    price: "Rs. 1,500",
    meta: ["Clinic"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    href: "/category/medical",
    image: "/Dental Checkup & Cleaning.avif",
    category: "medical",
  },
  {
    id: "swift-ac-repair-ktm",
    title: "Swift AC & Appliance Repair",
    location: "Chabahil, Kathmandu, Nepal",
    price: "Rs. 600",
    meta: ["Like New"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    href: "/category/trade-and-homerepair",
    image: "/ac.webp",
    category: "trade-and-homerepair",
  },

 {
  id: "nail-extension",
  title: "Nail Extension",
  location: "Kathmandu",
  price: "NPR 2,000",
  href: "/category/beauty",
  image: "/beauty-nails.jpg",
  category: "beauty",
  badge: "FEATURED",
  badgeColor: "#F39C12",
  meta: ["Nails"],
},
{
  id: "hair-highlights",
  title: "Hair Highlights",
  location: "Kathmandu",
  price: "NPR 3,500",
  href: "/category/beauty",
  image: "/beauty-hair.jpg",

  category: "Hair",
  subServices: ["Global Highlights", "Hair Cut", "Styling"],
  rating: 4.9,
  reviewCount: 198,
  tags: ["Hair", "Coloring"],
  isHomeVisit: false,
  postedDaysAgo: 2,
  gender: "Any",
},


];

export default function ListingsPage() {
  return (
    <>
    <style>
        {`
        .page{
  padding:40px 0;
  background:#f8f8f8;
  min-height:100vh;
}

.container{
  max-width:1280px;
  margin:auto;
  padding:0 24px;
}

.header{
  margin-bottom:30px;
}

.grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:20px;
}

.card{
  background:#fff;
  border-radius:12px;
  overflow:hidden;
  text-decoration:none;
  color:#111;
  border:1px solid #eee;
  transition:.3s;
}

.card:hover{
  transform:translateY(-4px);
  box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.card img{
  width:100%;
  height:220px;
  object-fit:cover;
}

.card h3{
  padding:12px 14px 6px;
  font-size:16px;
}

.card p{
  padding:0 14px;
  color:#666;
}

.card strong{
  display:block;
  padding:12px 14px 18px;
  color:#C0392B;
}

@media(max-width:1024px){
  .grid{
    grid-template-columns:repeat(3,1fr);
  }
}

@media(max-width:768px){
  .grid{
    grid-template-columns:repeat(2,1fr);
  }
}

@media(max-width:480px){
  .grid{
    grid-template-columns:1fr;
  }
}
        `}
    </style>
    <main className="page">
      <div className="container">
        <div className="header">
          <h1>Featured Listings</h1>
          <p>Browse all featured listings</p>
        </div>

        <div className="grid">
          {listings.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="card"
            >
              <img src={item.image} alt={item.title} />

              <h3>{item.title}</h3>

              <p>{item.location}</p>

              <strong>{item.price}</strong>
            </Link>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}