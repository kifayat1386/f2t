/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../config/tailwind.preset.js')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
};
