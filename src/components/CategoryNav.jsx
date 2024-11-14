import React from "react";
import PropTypes from "prop-types";

const CategoryNav = ({ categories, activeCategory, onCategorySelect }) => {
  return (
    <nav className="w-full lg:w-48 xl:w-60 lg:flex-shrink-0">
      <div className="sticky top-4 bg-white shadow-sm border border-gray-100 z-40 rounded-lg">
        <div className="p-1 border-b">
          <h3 className="font-semibold text-gray-800">Categories</h3>
        </div>
        <div className="lg:block max-h-[calc(100vh-160px)] overflow-y-auto p-1">
          <button
            onClick={() => onCategorySelect("All Categories")}
            className={`w-full text-left p-1 rounded-md transition-all mb-1
              ${
                activeCategory === "All Categories"
                  ? "text-blue-600 font-medium bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
              }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`w-full text-left p-1 rounded-md transition-all
                ${
                  activeCategory.toLowerCase() === category.toLowerCase()
                    ? "text-blue-600 font-medium bg-blue-50 border-l-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

CategoryNav.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
};

export default CategoryNav;
