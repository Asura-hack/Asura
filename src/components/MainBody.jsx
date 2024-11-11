import React, { useState, useEffect } from "react";
import SaleField from "./SaleField";
import ProductList from "./ProductList";
import { products } from "../data/products";
import CategoryNav from "./CategoryNav";

const MainBody = () => {
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const categories = [
        ...new Set(products.map((product) => product.category)),
      ];

      // Find which category is currently in view
      for (const category of categories) {
        const element = document.getElementById(`category-${category}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveCategory(category);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="bg-gray-50 min-h-screen py-3 sm:py-6">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-6">
        <SaleField />
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
          />
          <div className="flex-1">
            <ProductList categories={categories} products={products} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBody;
