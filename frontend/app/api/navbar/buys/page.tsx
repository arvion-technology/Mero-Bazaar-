"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Heart, MoreVertical, X } from "lucide-react";

export default function BuyPage() {
  const [price, setPrice] = useState(50000);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const categories = [
    "Mobiles & Tablets",
    "Electronics",
    "Vehicles",
    "Fashion",
    "Home & Living",
  ];

  const products = [
    {
      id: 1,
      title: "iPhone 14 Pro 128GB",
      category: "Mobiles & Tablets",
      price: "NPR 8,500",
      image: "/iphone.png",
      location: "Koteshwor",
      time: "2 hours ago",
      badge: "New",
    },
    {
      id: 2,
      title: "MacBook Air M1 256GB",
      category: "Electronics",
      price: "NPR 89,500",
      image: "/macbook.png",
      location: "Lalitpur",
      time: "5 hours ago",
      badge: "Used",
    },
    {
      id: 3,
      title: "Badminton",
      category: "Sports",
      price: "NPR 500",
      image: "/badminton.png",
      location: "Ratnapark",
      time: "1 day ago",
    },
    {
      id: 4,
      title: "Wooden Dining Table",
      category: "Home & Living",
      price: "NPR 18,500",
      image: "/table.png",
      location: "Lalitpur",
      time: "1 day ago",
      badge: "Used",
    },
    {
      id: 5,
      title: "Jersey Cow",
      category: "Agriculture",
      price: "NPR 1,58,500",
      image: "/cow.png",
      location: "Rupandehi",
      time: "2 hours ago",
    },
    {
      id: 6,
      title: "Bajaj",
      category: "Vehicles",
      price: "NPR 8,50,500",
      image: "/bike.png",
      location: "Lalitpur",
      time: "5 hours ago",
      badge: "New",
    },
    {
      id: 7,
      title: "4th Floor House",
      category: "Property",
      price: "NPR 1,50,00,000",
      image: "/house.png",
      location: "Ratnapark",
      time: "1 day ago",
    },
    {
      id: 8,
      title: "Baby Cloth",
      category: "Fashion",
      price: "NPR 1,500",
      image: "/baby.png",
      location: "Lalitpur",
      time: "1 day ago",
      badge: "New",
    },
  ];

  const conditions = ["New", "Used"];

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      localStorage.setItem("wishlist", JSON.stringify(updated));

      return updated;
    });
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "" ||
      product.category === selectedCategory;

    const conditionMatch =
      selectedCondition === "" ||
      product.badge === selectedCondition;
    const searchMatch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && conditionMatch && searchMatch;
  });

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    setWishlist(saved);
  }, []);

  return (
    <>
      <style>{`
    .hero {
  width: 100%;
  padding: 25px;
}

.content {
  background: linear-gradient(90deg, #efd4c0, #f6c89f);
  border-radius: 18px;
  padding: 45px 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
  overflow: hidden;
}

.left {
  flex: 1;
}


.left{
  flex:0 0 55%;
}


.left h1 {
  font-size: 56px;
  font-weight: 700;
  color: #111;
  line-height: 1.2;
}

.left p {
  margin-top: 12px;
  font-size: 18px;
  color: #444;
}

.searchBox {
  margin-top: 35px;
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  max-width: 700px;
  box-shadow: 0 5px 20px rgba(0,0,0,.08);
}

.inputWrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
}

.inputWrapper input {
  width: 100%;
  height: 60px;
  border: none;
  outline: none;
  font-size: 16px;
}

.searchBox button {
  width: 150px;
  width: 90px;
  border: none;
  background: #ff1e1e;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}

.searchBox button:hover {
  background: #e11111;
}

.right {
  display: flex;
  align-items: flex-end;
  gap: 18px;
  flex:0 0 45%;
  display:flex;
  justify-content:center;
  align-items:flex-end;
  gap:15px;
  flex-wrap:nowrap;
}

.smallImage,
.mobileImage,
.bigImage {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: rgba(255,255,255,.3);
}

.smallImage {
  width: 120px;
  height: 170px;
}

.mobileImage {
  width: 170px;
  height: 250px;
}

.bigImage {
  width: 210px;
  height: 250px;
}

.image {
  object-fit: cover;
}
  .wishlist-btn{
  position:absolute;
  top:10px;
  left:10px;
  width:38px;
  height:38px;
  border:none;
  border-radius:50%;
  background:rgba(0,0,0,.35);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  z-index:5;
  transition:.3s;
}

.wishlist-btn:hover{
  background:white;
}

.wishlist-btn:hover svg{
  color:red;
}

/* Tablet */

@media (max-width: 992px) {
  .content {
    flex-direction: column;
    text-align: center;
    padding: 35px 25px;
  }
 

  .left h1 {
    font-size: 42px;
  }

  .searchBox {
    flex-direction: column;
  }

  .searchBox button {
    width: 100%;
    height: 55px;
  }

  .right {
    justify-content: center;
    flex-wrap: wrap;
  }
  }

  .searchBox button{
  width:110px;
  flex-shrink:0;
}

.right{
  flex-wrap:nowrap;
}
}

/* Mobile */

@media (max-width: 576px) {

  .left h1 {
    font-size: 32px;
  }

  .left p {
    font-size: 15px;
  }

  .smallImage {
    width: 80px;
    height: 110px;
  }

  .mobileImage {
    width: 110px;
    width: 100px;
    height: 170px;
  }

  .bigImage {
    width: 130px;
    height: 170px;
  }

  .inputWrapper input {
    height: 55px;
  }
}

.buy-container{
  display:flex;
  gap:25px;
  padding:25px;
  align-items:flex-start;
}

.mobile-filter-bar{
    display:none;
}

.filter-actions{
    display:flex;
    gap:10px;
    align-items:center;
}

.close-filter{
    display:none;
}
    .filter-sidebar {
  width: 280px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 20px;
    min-width:280px;
  flex-shrink:0;
  box-shadow: 0 3px 10px rgba(0,0,0,.05);
}

.filter-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
}

.filter-header h3{
  margin:0;
  font-size:22px;
}

.filter-header button{
  border:none;
  background:none;
  color:#e53935;
  cursor:pointer;
  font-weight:600;
}

.filter-section{
  border-top:1px solid #eee;
  padding:18px 0;
}

.filter-section:first-of-type{
  border:none;
}

.filter-section h4{
  margin-bottom:15px;
  font-size:17px;
}

.checkbox{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:10px;
  cursor:pointer;
}

.checkbox input{
  width:18px;
  height:18px;
}

.show-more{
  color:#e53935;
  cursor:pointer;
  font-size:14px;
  margin-top:8px;
}

input[type="range"]{
  width:100%;
  accent-color:#e53935;
}

.price-row{
  display:flex;
  justify-content:space-between;
  margin-top:10px;
  font-size:14px;
}

select{
  width:100%;
  padding:10px;
  border:1px solid #ddd;
  border-radius:8px;
  outline:none;
}
  .products-section{
  flex:1;
}
  .page{
  display:flex;
  gap:25px;
  padding:25px;
}

.products-section{
  flex:1;
}

.products-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
}

.products-header h2{
  font-size:34px;
  margin:0;
}

.sort{
  gap:80px;
}

.products-header h2{
   flex:1;
  font-size:24px;
  margin:0;
  white-space:nowrap;

}

.sort{
width:280px;
  flex-shrink:0;
  padding:10px 16px;
  border:1px solid #ddd;
  border-radius:10px;
  font-size:15px;
}

.product-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:22px;
}

.product-card{
  background:#fff;
  border:1px solid #eee;
  border-radius:14px;
  overflow:hidden;
  transition:.25s;
  cursor:pointer;
}

.product-card:hover{
  transform:translateY(-4px);
  box-shadow:0 8px 25px rgba(0,0,0,.12);
}

.product-image{
  position:relative;
  width:100%;
  height:190px;
}

.product-image img{
  object-fit:cover;
}

.badge{
  position:absolute;
  top:10px;
  right:10px;
  padding:4px 10px;
  border-radius:20px;
  color:#fff;
  font-size:12px;
  font-weight:600;
}

.badge.New{
  background:#28a745;
}

.badge.Used{
  background:#ff4d4f;
}

.product-body{
  padding:14px;
}

.product-title{
  font-size:22px;
  font-weight:600;
  margin-bottom:6px;
}

.product-price{
  color:#ff1e1e;
  font-weight:700;
  margin-bottom:10px;
}

.product-footer{
  display:flex;
  justify-content:space-between;
  color:#777;
  font-size:14px;
}

@media(max-width:900px){

.page{
  flex-direction:column;
}
.filter-sidebar{
    width:100%;
  }

.product-grid{
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
}

}

.product-actions{
  display:flex;
  gap:1px;
  margin-top:15px;
}

.cart-btn,
.buy-btn{
  flex:1;
  padding:10px 0;
  border:none;
  border-radius:8px;
  font-size:14px;
  font-weight:600;
  cursor:pointer;
  transition:.25s;
}

.cart-btn{
  background:#fff;
  color:#2563eb;
  border:1px solid #2563eb;
}

.cart-btn:hover{
  background:#2563eb;
  color:#fff;
}

.buy-btn{
  background:#ef4444;
  color:#fff;
}

.buy-btn:hover{
  background:#dc2626;
}

@media(max-width:1024px){

.mobile-filter-bar{
    display:block;
    margin-bottom:15px;
}

.mobile-filter-btn{
    width:100%;
    padding:12px;
    border:none;
    border-radius:10px;
    background:#fff;
    border:1px solid #ddd;
    font-weight:600;
    cursor:pointer;
}

.filter-sidebar{
    position:fixed;
    top:0;
    left:-320px;
    width:300px;
    height:100vh;
    background:#fff;
    z-index:9999;
    transition:.3s;
    overflow:auto;
}

.filter-sidebar.show-sidebar{
    left:0;
}

.close-filter{
    display:block;
}
}

/*   TABLET (768px - 991px */

@media (max-width:991px){

.hero{
  padding:20px;
}

.content{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
  padding:30px;
}

.left{
  flex:0 0 58%;
}

.right{
  flex:0 0 42%;
  display:flex;
  justify-content:center;
  align-items:flex-end;
  gap:10px;
}

.left h1{
  font-size:42px;
}

.left p{
  font-size:16px;
}

.searchBox{
  width:100%;
}

.inputWrapper{
  flex:1;
}

.searchBox button{
  width:110px;
  flex-shrink:0;
}

.smallImage{
  width:70px;
  height:100px;
}

.mobileImage{
  width:110px;
  height:170px;
}

.bigImage{
  width:130px;
  height:170px;
}

}
  
@media (max-width: 768px) {

.left h1{
    font-size:58px;
    line-height:1.1;
}

.left p{
    font-size:18px;
}

.searchBox{
    width:100%;
    max-width:500px;
}

.inputWrapper{
    flex:4;
}

  .buy-container{
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  
  .filter-sidebar{
    width: 100%;
    min-width: 100%;
  }

  .products-header{
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .products-header h2{
    font-size: 24px;
    white-space: normal;
  }

  .sort{
    width: 100%;
  }

  .product-grid{
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}


      @media (max-width: 480px) {
   
      .hero{
  padding:12px;
}

.content{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding:18px;
}

.left{
  flex:0 0 60%;
}

.right{
  flex:0 0 40%;
  display:flex;
  justify-content:center;
  align-items:flex-end;
  gap:5px;
}

.left h1{
  font-size:28px;
  line-height:1.2;
}

.left p{
  font-size:13px;
}

.searchBox{
  width:100%;
}

.inputWrapper{
  flex:1;
  padding:0 10px;
}

.inputWrapper input{
  height:48px;
  font-size:14px;
}

.searchBox button{
  width:80px;
  flex-shrink:0;
  font-size:14px;
}

.smallImage{
  width:40px;
  height:60px;
}

.mobileImage{
  width:65px;
  height:100px;
}

.bigImage{
  width:75px;
  height:100px;
}



  .buy-container{
    flex-direction: column;
    padding: 12px;
    gap: 16px;
  }

  .filter-sidebar{
    width: 100%;
    min-width: 100%;
    padding: 16px;
  }

  .products-header{
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .products-header h2{
    font-size: 22px;
    white-space: normal;
    text-align: left;
  }

  .sort{
    width: 100%;
    font-size: 14px;
  }

  .product-grid{
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .product-card{
    width: 100%;
  }

  .product-image{
    height: 220px;
  }

  .product-title{
    font-size: 18px;
  }

  .product-price{
    font-size: 18px;
  }

  .product-footer{
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    font-size: 13px;
  }

  .product-actions{
    flex-direction: column;
    gap: 10px;
  }

  .cart-btn,
  .buy-btn{
    width: 100%;
    padding: 12px;
    font-size: 15px;
  }

  .wishlist-btn{
    width: 36px;
    height: 36px;
  }
}

    `}</style>

      <section className="hero">
        <div className="content">
          <div className="left">
            <h1>Find Everything You Need</h1>
            <p>Shop from thousands of new and secondhand items near you</p>

            <div className="searchBox">
              <div className="inputWrapper">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search for product, brand and more"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button>Search</button>
            </div>
          </div>

          <div className="right">
            <div className="smallImage">
              <Image
                src="/shopping-bag.png"
                alt="Shopping Bag"
                fill
                className="image"
              />
            </div>

            <div className="mobileImage">
              <Image
                src="/mobile.png"
                alt="Mobile"
                fill
                className="image"
              />
            </div>

            <div className="bigImage">
              <Image
                src="/clothes.png"
                alt="Clothes"
                fill
                className="image"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="buy-container">
        <div className="left-side">
          <div className="mobile-filter-bar">
            <button
              className="mobile-filter-btn"
              onClick={() => setShowFilters(true)}
            >
              ☰ Filters
            </button>
          </div>
          <aside
            className={`filter-sidebar ${showFilters ? "show-sidebar" : ""}`}
          >
            <div className="filter-header">
              <h3>Filters</h3>

              <div className="filter-actions">
                <button>Clear All</button>

                <button
                  className="close-filter"
                  onClick={() => setShowFilters(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="filter-section">
              <h4>Category</h4>

              {categories.map((item) => (
                <label key={item} className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategory === item}
                    onChange={() =>
                      setSelectedCategory(
                        selectedCategory === item ? "" : item
                      )
                    }
                  />
                  <span>{item}</span>
                </label>
              ))}

              <p className="show-more">Show More</p>
            </div>

            {/* Price */}
            <div className="filter-section">
              <h4>Price Range</h4>

              <input
                type="range"
                min="0"
                max="100000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />

              <div className="price-row">
                <span>Rs.0</span>
                <span>Rs.{price.toLocaleString()}</span>
              </div>
            </div>

            {/* Condition */}
            <div className="filter-section">
              <h4>Condition</h4>

              {conditions.map((item) => (
                <label key={item} className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCondition === item}
                    onChange={() =>
                      setSelectedCondition(
                        selectedCondition === item ? "" : item
                      )
                    }
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* Location */}
            <div className="filter-section">
              <h4>Location</h4>

              <select>
                <option>Kathmandu</option>
                <option>Lalitpur</option>
                <option>Bhaktapur</option>
                <option>Pokhara</option>
              </select>
            </div>
          </aside>
        </div>
        <section className="products-section">

          <div className="products-header">
            <h2>{filteredProducts.length} Service Found</h2>
            <select className="sort">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="product-grid">

            {filteredProducts.map((item) => (
              <div className="product-card" key={item.id}>

                <div className="product-image">

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                  />
                  <button
                    className="wishlist-btn"
                    onClick={() => toggleWishlist(item.id)}
                  >
                    <Heart
                      size={22}
                      color={wishlist.includes(item.id) ? "red" : "white"}
                      fill={wishlist.includes(item.id) ? "red" : "transparent"}
                    />
                  </button>

                  {item.badge && (
                    <span className={`badge ${item.badge}`}>
                      {item.badge}
                    </span>
                  )}

                </div>

                <div className="product-body">

                  <div className="product-title">
                    {item.title}
                  </div>

                  <div className="product-price">
                    {item.price}
                  </div>

                  <div className="product-footer">
                    <span>📍 {item.location}</span>
                    <span>{item.time}</span>
                  </div>
                  <div className="product-actions">

                    <button
                      className="cart-btn"
                      onClick={() => console.log("Add to Cart:", item.id)}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="buy-btn"
                      onClick={() => console.log("Buy Now:", item.id)}
                    >
                      Buy Now
                    </button>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>
      </div>

    </>
  );
}