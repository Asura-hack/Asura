import React, { useState } from "react";

const CategoryNav = ({ categories, activeCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToCategory = (category) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="w-full lg:w-72 xl:w-80 lg:flex-shrink-0">
      <div className="sticky top-[60px] lg:top-20 bg-white rounded-xl shadow-sm border border-gray-100 z-40">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="text-base lg:text-lg font-medium text-gray-900">
            Categories
          </h3>
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "−" : "+"}
          </button>
        </div>
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:block max-h-[70vh] overflow-y-auto`}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => scrollToCategory(category)}
              className={`w-full text-left px-4 py-3 text-sm transition-all
                ${
                  activeCategory === category
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

export default CategoryNav;
