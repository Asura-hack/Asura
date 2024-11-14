// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white p-4 mt-auto">
      <div className="max-w-screen-lg mx-auto text-center">
        <p>&copy; 2024 Coupang Clone. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
