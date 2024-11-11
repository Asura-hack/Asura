// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white p-4">
      <div className="max-w-screen-lg mx-auto text-center">
        <p>&copy; 2024 Coupang Clone. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
