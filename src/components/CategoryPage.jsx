import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import { Loader } from "./shared/Loader";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dummyjson.com/products?limit=194"
        );
        const categoryProducts = response.data.products.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
        setProducts(categoryProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const sortedProducts = useMemo(() => {
    const productsToSort = [...products];

    switch (sortOption) {
      case "price-asc":
        return productsToSort.sort((a, b) => a.price - b.price);

      case "price-desc":
        return productsToSort.sort((a, b) => b.price - a.price);

      case "rating-desc":
        return productsToSort.sort((a, b) => b.rating - a.rating);

      case "rating-asc":
        return productsToSort.sort((a, b) => a.rating - b.rating);

      case "discount-desc":
        return productsToSort.sort(
          (a, b) => b.discountPercentage - a.discountPercentage
        );

      case "discount-asc":
        return productsToSort.sort(
          (a, b) => a.discountPercentage - b.discountPercentage
        );

      default:
        return productsToSort;
    }
  }, [products, sortOption]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {category}
        </h1>
        <p className="mt-2 text-gray-600">{products.length} Products</p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <label htmlFor="sort" className="text-gray-700">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
