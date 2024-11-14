import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "./shared/Loader";
import { useCart } from "../context/CartContext";
import PropTypes from "prop-types";

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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        // Fetch product details
        const productResponse = await axios.get(
          `https://dummyjson.com/products/${productId}`
        );
        setProduct(productResponse.data);

        // Fetch reviews for the product
        const reviewsResponse = await axios.get(
          `https://dummyjson.com/comments?limit=8`
        );

        // Transform comments into reviews format
        const transformedReviews = reviewsResponse.data.comments.map(
          (comment) => ({
            id: comment.id,
            user: comment.user.username,
            userImage: `https://robohash.org/${comment.user.username}`,
            rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
            date: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(), // Random date within last 30 days
            comment: comment.body,
            helpful: Math.floor(Math.random() * 50), // Random helpful count
          })
        );

        setReviews(transformedReviews);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
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
  if (!product) return null;

  const averageRating =
    reviews.reduce((acc, review) => acc + parseFloat(review.rating), 0) /
    reviews.length;

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
                >
                  ←
                </button>
                <button
                  onClick={handleNextImage}
                  className="bg-white/80 rounded-full p-2 hover:bg-white"
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
                className={`aspect-square rounded-lg overflow-hidden border-2 
                  ${
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
            <div className="flex items-center text-yellow-400">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-gray-600">({product.rating} rating)</span>
          </div>
          <div className="mb-6">
            <p className="text-3xl font-bold text-blue-600">
              ${discountedPrice.toFixed(2)}
              {product.discountPercentage > 0 && (
                <span className="ml-2 text-lg line-through text-gray-400">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </p>
            {product.discountPercentage > 0 && (
              <span className="inline-block mt-1 text-green-600 font-medium">
                Save {product.discountPercentage}%
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
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
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-2">Product Details</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-gray-600">Category</dt>
              <dd className="text-gray-900">{product.category}</dd>
              <dt className="text-gray-600">Brand</dt>
              <dd className="text-gray-900">{product.brand}</dd>
              <dt className="text-gray-600">Stock</dt>
              <dd className="text-gray-900">{product.stock} units</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="border-t pt-8">
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
            <ReviewStars rating={averageRating} />
            <span className="text-gray-600">
              Based on {reviews.length} reviews
            </span>
          </div>

          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-8 last:border-b-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={review.userImage}
                      alt={review.user}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {review.user}
                      </h3>
                      <div className="flex items-center gap-2">
                        <ReviewStars rating={parseFloat(review.rating)} />
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Verified Purchase
                    </span>
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
                <div className="flex items-center gap-4 mt-4">
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    Helpful ({review.helpful})
                  </button>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
