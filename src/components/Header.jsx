import React, { useState } from "react";
import { useSearch } from "../context/SearchContext";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { handleSearch } = useSearch();
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { isSignedIn, user } = useUser();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchInput, selectedCategory);
  };

  // Common search input component
  const SearchInput = ({ isMobile = false }) => (
    <div
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
        <option>Electronics</option>
        <option>Accessories</option>
        <option>Home Appliances</option>
        <option>Fitness</option>
      </select>
      <div className={`flex flex-1 ${isMobile ? "border-t" : ""}`}>
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit(e)}
        />
        <button
          onClick={handleSearchSubmit}
          className="px-8 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
    </div>
  );

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top utility bar */}
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

      {/* Main header */}
      <div className="max-w-7xl mx-auto py-4 px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="w-28 sm:w-36 lg:w-44 flex-shrink-0">
            <a href="/">
              <img
                src="./src/data/ecoMallLogo.png"
                alt="Logo"
                className="h-auto w-full"
              />
            </a>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-3xl">
            <SearchInput />
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Search Icon */}
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

            {/* Menu Icon */}
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

          {/* Right menu */}
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

        {/* Mobile Search */}
        {showSearch && (
          <div className="mt-4 lg:hidden">
            <SearchInput isMobile={true} />
          </div>
        )}

        {/* Mobile Menu */}
        {showMenu && (
          <div className="mt-4 lg:hidden">
            {/* Add your mobile menu components here */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
