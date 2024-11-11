/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // Adjust the paths according to your project structure
  ],
  theme: {
    extend: {},
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: [],
};
