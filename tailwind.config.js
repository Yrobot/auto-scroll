/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./website/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
