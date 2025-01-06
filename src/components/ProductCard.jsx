import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isSignedIn } = useUser();
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage,
      thumbnail: product.thumbnail,
      quantity: 1,
      category: product.category,
    });
  };

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  const effectiveDiscountPercentage =
    product.discountPercentage >= 10 ? product.discountPercentage : 0;

  const discountedPrice =
    effectiveDiscountPercentage > 0
      ? product.price - (product.price * effectiveDiscountPercentage) / 100
      : product.price;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative">
      <div className="relative aspect-square">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={imageError ? "/placeholder-image.jpg" : product.thumbnail}
          alt={product.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        {effectiveDiscountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            -{Math.round(effectiveDiscountPercentage)}% OFF
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Link>
          {isSignedIn && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleLike();
              }}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <svg
                className={`w-5 h-5 ${
                  liked ? "text-red-500 fill-current" : "text-gray-800"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
          {isSignedIn && (
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <svg
                className="w-5 h-5 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Rest of the card content */}
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-900 line-clamp-2 min-h-[3rem] mb-2">
          {product.title}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-primary">
              ${discountedPrice.toFixed(2)}
              {effectiveDiscountPercentage > 0 && (
                <span className="text-sm line-through text-gray-400 ml-2">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <div className="text-yellow-400 flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index}>
                    {index < Math.floor(product.rating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.rating})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    discountPercentage: PropTypes.number,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
