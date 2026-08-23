"use client";

import Link from "next/link";
import Image from "next/image";
import { categories } from "@/app/categories/data/categories";

import Footer from "@/components/Footer";

export default function CategoriesPage() {
    return (
        <>
        <style>{`
        .categories-page{
    padding:40px 0 70px;
    background:#fafafa;
}

.container{
    max-width:1280px;
    margin:auto;
    padding:0 24px;
}

.page-header{
    margin-bottom:30px;
}

.page-header h1{
    font-size:32px;
    font-weight:700;
    margin-bottom:8px;
}

.page-header p{
    color:#666;
}

.categories-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
}

.category-card{
    display:flex;
    gap:16px;
    align-items:center;
    background:#fff;
    padding:18px;
    border-radius:14px;
    border:1px solid #eee;
    text-decoration:none;
    transition:.25s;
}

.category-card:hover{
    transform:translateY(-4px);
    box-shadow:0 8px 24px rgba(0,0,0,.08);
}

.icon{
    width:60px;
    height:60px;
    border-radius:14px;
    display:flex;
    justify-content:center;
    align-items:center;
}

.category-card h3{
    color:#111;
    margin:4px 0;
}

.category-card span{
    color:#C0392B;
    font-weight:600;
}

@media(max-width:900px){
    .categories-grid{
        grid-template-columns:repeat(2,1fr);
    }
}

@media(max-width:600px){
    .categories-grid{
        grid-template-columns:1fr;
    }
}`}</style>
        <main className="categories-page">
            <div className="container">
                <div className="page-header">
                    <h1>Browse All Categories</h1>

                    <p>
                        Discover products and services across Nepal
                    </p>
                </div>

                <div className="categories-grid">
                    {categories.map((cat) => (
                        <Link
                            href={cat.href}
                            key={cat.id}
                            className="category-card"
                        >
                            <div
                                className="icon"
                                style={{ background: cat.bg }}
                            >
                                <Image
                                    src={cat.img}
                                    alt={cat.label}
                                    width={60}
                                    height={60}
                                />
                            </div>

                            <div>
                                <small>{cat.labelNp}</small>

                                <h3>{cat.label}</h3>

                                <span>{cat.count}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
        </main>
        <Footer />                

        </>
    );
}