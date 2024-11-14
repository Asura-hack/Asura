import React, { useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import { logo } from "../data/images";

const Header = ({ onSearch }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { isSignedIn, user } = useUser();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput, selectedCategory);
    }
  };

  const SearchInput = ({ isMobile = false }) => (
    <form
      onSubmit={handleSearchSubmit}
      className={`w-full flex shadow-sm rounded-lg overflow-hidden border border-gray-200 ${
        isMobile ? "flex-col" : ""
      }`}
    >
      <select
        className={`${
          isMobile ? "w-full border-b" : "border-r"
        } px-4 py-2.5 bg-gray-50 text-sm text-gray-600 focus:outline-none`}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option>All Categories</option>
        <option>Fashion</option>
        <option>Furniture/Home</option>
        <option>Beauty</option>
        <option>Electronics</option>
        <option>Sports</option>
        <option>Auto</option>
      </select>
      <div className={`flex flex-1 ${isMobile ? "border-t" : ""}`}>
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-8 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="bg-gray-800 py-1.5 text-xs hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-end gap-8 px-6">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Customer Service
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Track Order
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Store Locator
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-4 px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="w-28 sm:w-36 lg:w-44 flex-shrink-0">
            <a href="/">
              <img src={logo} alt="Logo" className="h-auto w-full" />
            </a>
          </div>

          <div className="hidden lg:flex flex-1 max-w-3xl">
            <SearchInput />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-6">
            {isSignedIn ? (
              <div className="hidden lg:flex items-center gap-2 group">
                <UserButton afterSignOutUrl="/" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Welcome</span>
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName || "User"}
                  </span>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="hidden lg:flex items-center gap-2 group">
                  <div className="text-gray-600 group-hover:text-blue-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Sign in</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      Account
                    </span>
                  </div>
                </button>
              </SignInButton>
            )}
            <a
              href="#"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <span className="text-xl">🛒</span>
              <span className="text-sm">Cart</span>
            </a>
          </div>
        </div>

        {showSearch && (
          <div className="mt-4 lg:hidden">
            <SearchInput isMobile={true} />
          </div>
        )}

        {showMenu && (
          <div className="mt-4 lg:hidden">
            {/* Add your mobile menu components here */}
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  isMobile: PropTypes.bool,
  onSearch: PropTypes.func.isRequired,
};

export default Header;
