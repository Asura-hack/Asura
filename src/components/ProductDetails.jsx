import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "./shared/Loader";
import { useCart } from "../context/CartContext";
import PropTypes from "prop-types";
import { useUser } from "@clerk/clerk-react";

const ReviewStars = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
    </div>
  );
};

ReviewStars.propTypes = {
  rating: PropTypes.number.isRequired,
};

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://dummyjson.com/products/${productId}`
        );
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleNextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : 0;

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="md:w-1/2">
          <div className="relative aspect-square">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg"
            />
            {product.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                  onClick={handlePrevImage}
                  className="bg-white/80 rounded-full p-2 hover:bg-white"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  onClick={handleNextImage}
                  className="bg-white/80 rounded-full p-2 hover:bg-white"
                  aria-label="Next image"
                >
                  →
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  currentImageIndex === index
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>
          <div className="flex items-center gap-4 mb-4">
            <ReviewStars rating={Math.round(averageRating)} />
            <span className="text-gray-600">
              ({averageRating.toFixed(1)} / 5 rating)
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            ${discountedPrice.toFixed(2)}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          {isSignedIn ? (
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
              <button className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                Add to Wishlist
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Sign in to add items to your cart.
            </p>
          )}
        </div>
      </div>
      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Customer Reviews
        </h2>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600 ml-1">/ 5</span>
          </div>
          <ReviewStars rating={Math.round(averageRating)} />
          <span className="text-gray-600">
            Based on {product.reviews.length} reviews
          </span>
        </div>

        <div className="space-y-8">
          {product.reviews.map((review, index) => (
            <div key={index} className="border-b pb-8 last:border-b-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {review.reviewerName}
                  </h3>
                  <ReviewStars rating={review.rating} />
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
