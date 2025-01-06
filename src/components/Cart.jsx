import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

import {
  useUser,
  SignInButton,
  SignUpButton,
  useClerk,
} from "@clerk/clerk-react";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const { isSignedIn, user } = useUser();
  const { clerk } = useClerk();

  // Function to update cart data in Clerk's database
  const saveCartDataToClerk = async () => {
    if (isSignedIn && user) {
      try {
        // Update the custom cart data field
        await clerk.users.updateUserMetadata(user.id, {
          cartData: JSON.stringify(cart), // Store cart data as a JSON string
        });
        console.log("Cart data saved to Clerk's database!");
      } catch (error) {
        console.error("Error saving cart data:", error);
      }
    }
  };

  // Save cart data when the cart changes
  useEffect(() => {
    saveCartDataToClerk();
  }, [cart]);

  if (!isSignedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sign in to view your cart
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Please sign in or create an account to start shopping and manage
            your cart
          </p>
          <div className="flex justify-center gap-4">
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8">
            Add some items to your cart to get started
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-sm">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 border-b last:border-b-0"
              >
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="flex-grow min-w-0">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-blue-600 truncate block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-500 capitalize">
                    {item.category}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-medium text-blue-600">
                      $
                      {(
                        (item.price -
                          (item.price * item.discountPercentage) / 100) *
                        item.quantity
                      ).toFixed(2)}
                    </span>
                    {item.discountPercentage > 0 && (
                      <span className="text-sm line-through text-gray-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => {
                        const newQuantity = Math.max(0, item.quantity - 1);
                        if (newQuantity === 0) {
                          removeFromCart(item.id);
                        } else {
                          updateQuantity(item.id, newQuantity);
                        }
                      }}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
        <div className="lg:w-80 bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
