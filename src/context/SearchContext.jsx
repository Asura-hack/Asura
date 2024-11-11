import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All Categories");

  const handleSearch = (query, category) => {
    setSearchQuery(query);
    setSearchCategory(category);
  };

  return (
    <SearchContext.Provider
      value={{ searchQuery, searchCategory, handleSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
