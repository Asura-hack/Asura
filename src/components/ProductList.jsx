import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader } from "./shared/Loader";

const ProductList = ({
  searchQuery,
  searchCategory,
  setCategories,
  sortOption,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dummyjson.com/products?limit=194"
        );
        setProducts(response.data.products);

        const uniqueCategories = [
          ...new Set(response.data.products.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setCategories]);

  if (loading) {
    return (
      <div className="mt-4 bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
        <Loader />
      </div>
    );
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      searchCategory === "All Categories" ||
      product.category.toLowerCase() === searchCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const discountedPriceA = a.price - a.price * (a.discountPercentage / 100);
    const discountedPriceB = b.price - b.price * (b.discountPercentage / 100);

    switch (sortOption) {
      case "price-asc":
        return discountedPriceA - discountedPriceB;
      case "price-desc":
        return discountedPriceB - discountedPriceA;
      case "rating-desc":
        return b.rating - a.rating;
      case "rating-asc":
        return a.rating - b.rating;
      case "discount-desc":
        return b.discountPercentage - a.discountPercentage;
      case "discount-asc":
        return a.discountPercentage - b.discountPercentage;
      default:
        return 0;
    }
  });

  const groupedProducts = sortedProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="mt-4 bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 product-list-container">
      {Object.entries(groupedProducts).map(([category, products]) => {
        const displayProducts = products.slice(0, 5);
        const hasMore = products.length > 5;

        return (
          <div
            key={category}
            id={`category-${category.toLowerCase()}`}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {category}{" "}
                <span className="text-sm text-gray-500">
                  ({products.length})
                </span>
              </h2>
              <div className="flex items-center gap-4">
                {hasMore && (
                  <Link
                    to={`/category/${category.toLowerCase()}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    View All
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}
      {sortedProducts.length === 0 && (
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
  searchQuery: PropTypes.string.isRequired,
  searchCategory: PropTypes.string.isRequired,
  setCategories: PropTypes.func.isRequired,
  sortOption: PropTypes.string.isRequired,
};

export default ProductList;
