import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SaleField from "./SaleField";
import ProductList from "./ProductList";
import CategoryNav from "./CategoryNav";

const MainBody = ({ searchQuery, searchCategory }) => {
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const handleScroll = () => {
      let foundCategory = "";
      for (const category of categories) {
        const element = document.getElementById(
          `category-${category.toLowerCase()}`
        );
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            foundCategory = category;
            break;
          }
        }
      }
      if (foundCategory && foundCategory !== activeCategory) {
        setActiveCategory(foundCategory);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeCategory, categories]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    if (category === "All Categories") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(
        `category-${category.toLowerCase()}`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    if (searchCategory !== "All Categories") {
      setActiveCategory(searchCategory);
    }
  }, [searchCategory]);

  return (
    <div className="bg-gray-50 min-h-screen py-3 sm:py-6">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-6">
        <SaleField />
        <div className="flex flex-col lg:flex-row xl:gap-8">
          <div className="hidden lg:sticky lg:top-4 lg:h-screen lg:w-64">
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 border rounded bg-white"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rating</option>
                <option value="rating-asc">Lowest Rating</option>
                <option value="discount-desc">Highest Discount</option>
                <option value="discount-asc">Lowest Discount</option>
              </select>
            </div>
            <ProductList
              setCategories={setCategories}
              searchQuery={searchQuery}
              searchCategory={searchCategory}
              sortOption={sortOption}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

MainBody.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  searchCategory: PropTypes.string.isRequired,
};

export default MainBody;
