/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "galactic-blue": "#007BFF",
        "stellar-gold": "#FFD700",
        "deep-space": "#000000",
        "lunar-white": "#F5F5F5",
      },
      textColor: {
        "galactic-blue": "#007BFF",
        "stellar-gold": "#FFD700",
        "deep-space": "#000000",
        "lunar-white": "#F5F5F5",
      },
    },
  },
  plugins: [],
};
