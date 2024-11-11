import React from "react";
import PropTypes from "prop-types";
import Header from "./components/Header";
import Slider from "./components/Slider";
import MainBody from "./components/MainBody";
import Footer from "./components/Footer";
import { SearchProvider } from "./context/SearchContext";
import { ClerkProvider, SignIn } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Add new Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Configuration Error
            </h1>
            <p className="text-gray-600">
              Missing or invalid Clerk Publishable Key. Please check your
              environment configuration.
            </p>
            {import.meta.env.MODE === "development" && (
              <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm">
                <p className="font-mono">
                  1. Create a .env file in your project root
                </p>
                <p className="font-mono">
                  2. Add: VITE_CLERK_PUBLISHABLE_KEY=your_key_here
                </p>
                <p className="font-mono">3. Restart your development server</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPubKey}>
        <BrowserRouter>
          <SearchProvider>
            <div className="min-h-screen flex flex-col w-full">
              <Header />
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
                          <MainBody />
                        </div>
                      </main>
                    </>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </div>
          </SearchProvider>
        </BrowserRouter>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
