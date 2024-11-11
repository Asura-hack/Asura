import React from "react";
import PropTypes from "prop-types";

const SaleItem = ({ sale }) => (
  <div
    key={sale.id}
    className={`${sale.bgColor} rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
    aria-labelledby={`sale-title-${sale.id}`}
  >
    <div className="flex justify-between items-start mb-4">
      <h3
        id={`sale-title-${sale.id}`}
        className="text-2xl font-bold text-gray-800 leading-tight"
      >
        {sale.name}
      </h3>
      <span
        className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md flex items-center justify-center"
        aria-label={`Discount: ${sale.discount}`}
      >
        {sale.discount}
      </span>
    </div>
    <p className="text-gray-600 text-lg mb-6">{sale.description}</p>
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className={`${sale.accentColor} font-semibold`}>
          Valid until: {sale.validUntil}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <span
          className={`${sale.accentColor} font-semibold px-3 py-1 rounded-full border-2 border-current`}
        >
          {sale.category}
        </span>
      </div>
    </div>
  </div>
);

SaleItem.propTypes = {
  sale: PropTypes.shape({
    id: PropTypes.number.isRequired,
    bgColor: PropTypes.string,
    name: PropTypes.string,
    discount: PropTypes.string,
    description: PropTypes.string,
    accentColor: PropTypes.string,
    validUntil: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
};

const SaleField = () => {
  const saleItems = [
    {
      id: 1,
      name: "Summer Collection",
      discount: "50% OFF",
      description: "Get ready for summer with our latest collection",
      validUntil: "2024-06-30",
      category: "Fashion",
      bgColor: "bg-orange-50",
      accentColor: "text-orange-600",
    },
    {
      id: 2,
      name: "Electronics Sale",
      discount: "30% OFF",
      description: "Amazing deals on latest gadgets",
      validUntil: "2024-05-15",
      category: "Electronics",
      bgColor: "bg-blue-50",
      accentColor: "text-blue-600",
    },
    {
      id: 3,
      name: "Home Essentials",
      discount: "25% OFF",
      description: "Transform your living space",
      validUntil: "2024-05-31",
      category: "Home & Living",
      bgColor: "bg-purple-50",
      accentColor: "text-purple-600",
    },
  ];

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Current Sales</h2>
        <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-green-500 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {saleItems.map((sale) => (
          <SaleItem key={sale.id} sale={sale} />
        ))}
      </div>
    </div>
  );
};

export default SaleField;
