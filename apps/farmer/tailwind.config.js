/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../packages/config/tailwind.preset.js')],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};
