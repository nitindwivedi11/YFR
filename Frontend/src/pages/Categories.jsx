import React from "react";
import CategoryCard from "../components/CategoryCard";

const categories = [
  { title: "Technology", description: "Innovation, AI & more.", image: "/images/categories/tech.png", audio: "/song/tech_ai.mp3" },
  { title: "Health & Wellness", description: "Mindfulness, fitness.", image: "/images/categories/health.png", audio: "/song/health_mind.mp3" },
  { title: "Education", description: "Learning & teaching.", image: "/images/categories/education.png", audio: "/song/education_covid.mp3" },
  { title: "Business", description: "Startups, marketing.", image: "/images/categories/business.png", audio: "/song/business_kidnapping.mp3" },
  { title: "Travel", description: "Stories & guide.", image: "/images/categories/travel.png", audio: "/song/travel_tech.mp3" },
  { title: "Motivation", description: "Inspiration & drive.", image: "/images/categories/motivation.png", audio: "/song/motivation_latent.mp3" }
];

export default function Categories() {
  return (
    <section className="pt-24 pb-16 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-10">Podcast Categories</h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => <CategoryCard key={i} {...cat} />)}
        </div>
      </div>
    </section>
  );
}
