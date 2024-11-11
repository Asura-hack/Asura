// src/components/ProductList.js
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useSearch } from "../context/SearchContext";
import PropTypes from "prop-types";

const ProductList = ({ categories, products }) => {
  const { searchQuery, searchCategory } = useSearch();

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      searchCategory === "All Categories" ||
      product.category === searchCategory;
    return matchesSearch && matchesCategory;
  });

  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    const categoryProducts = filteredProducts.filter(
      (product) => product.category === category
    );
    if (categoryProducts.length > 0) {
      acc[category] = categoryProducts;
    }
    return acc;
  }, {});

  return (
    <div className="mt-4 bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
      {Object.entries(productsByCategory).map(
        ([category, categoryProducts]) => {
          const [showAll, setShowAll] = useState(false);
          const productsToShow = showAll
            ? categoryProducts
            : categoryProducts.slice(0, 5);

          return (
            <div
              key={category}
              id={`category-${category}`}
              className="mb-8 sm:mb-12 last:mb-0"
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {category}
                </h2>
                {categoryProducts.length > 4 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {showAll ? "Show Less" : "Show All"}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
                {productsToShow.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        }
      )}
      {Object.keys(productsByCategory).length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No products found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

ProductList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProductList;
