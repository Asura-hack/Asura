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
  const [quantity, setQuantity] = useState(1);
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

  const calculateTotal = () => {
    if (!product) return 0;
    const discountedPrice =
      product.price * (1 - product.discountPercentage / 100);
    return discountedPrice * quantity;
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage,
      thumbnail: product.thumbnail,
      quantity: quantity,
      category: product.category,
    });
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : 0;

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

        {/* Product Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Title and Price */}
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold mb-2">{product?.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-medium text-blue-600">
                $
                {(
                  product.price *
                  (1 - product.discountPercentage / 100)
                ).toFixed(2)}
              </span>
              {product?.discountPercentage > 0 && (
                <span className="text-sm line-through text-gray-500">
                  ${product?.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 pb-4 border-b">
            <div className="font-medium">Rating:</div>
            <ReviewStars rating={averageRating} />
            <span className="text-sm text-gray-600 ml-1">
              ({averageRating.toFixed(1)})
            </span>
          </div>

          {/* Description */}
          <div className="border-b pb-4">
            <p className="text-gray-600 leading-relaxed">
              {product?.description}
            </p>
          </div>

          {/* Stock and Brand */}
          <div className="flex justify-between border-b pb-4">
            <div>
              <span className="font-medium">Brand: </span>
              <span className="text-gray-600">{product?.brand}</span>
            </div>
            <div>
              <span className="font-medium">Stock: </span>
              <span
                className={`${
                  product?.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product?.stock > 0 ? `${product.stock} units` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-lg font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <div className="w-16 text-center py-2 font-medium">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity((prev) => Math.min(prev + 1, 99))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Total and Add to Cart */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-gray-800">
              Total: ${calculateTotal().toFixed(2)}
            </div>
            {isSignedIn ? (
              <button
                onClick={handleAddToCart}
                disabled={product?.stock === 0}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  product?.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {product?.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            ) : (
              <div className="text-center text-gray-600">
                Please sign in to add items to cart
              </div>
            )}
          </div>
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
