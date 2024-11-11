// src/components/ProductCard.js
import React, { useState } from "react";
import PropTypes from "prop-types";

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 lg:h-56 xl:h-64 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 right-2">
          <button
            onClick={toggleLike}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 ${
              liked ? "text-red-500" : "text-gray-500"
            }`}
          >
            {liked ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
      <div className="p-4 lg:p-5">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.title}
        </h2>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg sm:text-xl font-semibold text-blue-600">
            ${product.price}
          </p>
          <div className="text-sm text-yellow-400 flex items-center">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index}>
                {index < Math.floor(product.rating) ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>
        <button className="mt-3 w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
