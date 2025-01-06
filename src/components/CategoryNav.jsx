import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const CategoryNav = ({ categories, activeCategory, onCategorySelect }) => {
  const activeButtonRef = useRef(null);

  // Scroll active category into view when it changes
  useEffect(() => {
    if (activeButtonRef.current) {
      activeButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeCategory]);

  return (
    <nav className="w-full lg:w-48 xl:w-60 flex-none">
      <div className="sticky top-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800 text-lg">Categories</h2>
        </div>

        {/* Category List */}
        <div className="max-h-[calc(100vh-120px)] p-2 no-scrollbar overflow-y-auto">
          <div className="space-y-1">
            {/* Individual Category Buttons */}
            {categories.map((category) => (
              <button
                key={category}
                ref={
                  activeCategory.toLowerCase() === category.toLowerCase()
                    ? activeButtonRef
                    : null
                }
                onClick={() => onCategorySelect(category)}
                className={`
                  w-full text-left px-3 py-2 rounded-md transition-colors
                  ${
                    activeCategory.toLowerCase() === category.toLowerCase()
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
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
