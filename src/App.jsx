import React, { useState, useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header";
import Slider from "./components/Slider";
import MainBody from "./components/MainBody";
import Footer from "./components/Footer";
import { ClerkProvider, SignIn } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ProductDetails from "./components/ProductDetails";
import CategoryPage from "./components/CategoryPage";
import { Loader } from "./components/shared/Loader";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { CartProvider } from "./context/CartContext";
import Cart from "./components/Cart";
import { Toaster } from "react-hot-toast";

const App = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          // Custom options
          success: {
            duration: 3000,
            style: {
              background: "#4CAF50",
              color: "white",
            },
          },
          error: {
            duration: 3000,
            style: {
              background: "#F44336",
              color: "white",
            },
          },
        }}
      />
      <ClerkProvider publishableKey={clerkPubKey}>
        <SpeedInsights />
        <Analytics />
        <CartProvider>
          <BrowserRouter>
            <MainApp
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchCategory={searchCategory}
              setSearchCategory={setSearchCategory}
              loading={loading}
              setLoading={setLoading}
            />
          </BrowserRouter>
        </CartProvider>
      </ClerkProvider>
    </>
  );
};

const MainApp = ({
  searchQuery,
  setSearchQuery,
  searchCategory,
  setSearchCategory,
  loading,
  setLoading,
}) => {
  const location = useLocation();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  const handleSearch = (query, category) => {
    setSearchQuery(query);
    setSearchCategory(category);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      <div className="flex-grow">
        <Routes>
          <Route
            path="/sign-in/*"
            element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
            path="/"
            element={
              <>
                <div className="w-full px-4 lg:container lg:mx-auto">
                  <Slider />
                </div>
                <main className="flex-1 px-4 py-4 lg:container lg:mx-auto">
                  <div className="w-full">
                    <MainBody
                      searchQuery={searchQuery}
                      searchCategory={searchCategory}
                    />
                  </div>
                </main>
              </>
            }
          />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

MainApp.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  searchCategory: PropTypes.string.isRequired,
  setSearchCategory: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default App;
