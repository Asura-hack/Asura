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
    <Link to={`/product/${sale.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
        <div className="relative">
          <img
            src={imageError ? "/placeholder-image.jpg" : sale.thumbnail}
            alt={sale.title}
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {sale.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="bg-red-500 text-white  px-4 py-1.5 rounded-full font-bold">
                {sale.discountPercentage}% OFF
              </span>
            </div>
          </div>
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
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-4xl font-bold text-gray-900 bg-yellow-300 p-2 rounded-lg shadow-lg">
          Top Sales
        </h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full shadow-md" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {topSales.map((sale) => (
          <SaleItem key={sale.id} sale={sale} />
        ))}
      </div>
    </div>
  );
};

export default SaleField;
