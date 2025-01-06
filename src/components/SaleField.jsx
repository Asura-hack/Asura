import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader } from "./shared/Loader";

const SaleItem = ({ sale }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/product/${sale.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group">
        <div className="relative">
          <div className="absolute top-2 left-2">
            <span className="bg-gradient-to-r from-red-500 to-yellow-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
              {sale.discountPercentage}% OFF
            </span>
          </div>
          <img
            src={imageError ? "/placeholder-image.jpg" : sale.thumbnail}
            alt={sale.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {sale.title}
          </h3>
          <p className="text-lg font-bold text-red-500 mt-3 hidden lg:block">
            {sale.validUntil
              ? `Valid until: ${sale.validUntil}`
              : "Limited Time Only!"}
          </p>
        </div>
      </div>
    </Link>
  );
};

SaleItem.propTypes = {
  sale: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    discountPercentage: PropTypes.number.isRequired,
    description: PropTypes.string,
    validUntil: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
  }).isRequired,
};

const SaleField = () => {
  const [topSales, setTopSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSales = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dummyjson.com/products?limit=194"
        );
        const sortedSales = response.data.products
          .sort((a, b) => b.discountPercentage - a.discountPercentage)
          .slice(0, 8);
        setTopSales(sortedSales);
      } catch (error) {
        console.error("Error fetching top sales:", error);
        setTopSales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSales();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text p-2 rounded-lg">
          Top Sales
        </h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full shadow-md" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topSales.map((sale) => (
          <SaleItem key={sale.id} sale={sale} />
        ))}
      </div>
    </div>
  );
};

export default SaleField;
