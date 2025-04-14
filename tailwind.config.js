/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include all files in the `src` directory
    "./pages/**/*.{js,ts,jsx,tsx}", // Include all files in the `pages` directory
    "./components/**/*.{js,ts,jsx,tsx}", // Include all files in the `components` directory
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': '#0A0F1C',
        'midnight-gray': '#1A1F2E',
        'cool-white': '#F5F7FA',
        'nova-purple': '#7C3AED',
        'ai-blue': '#3B82F6',
        'starburst-orange': '#F97316',
        'holographic-silver': '#94A3B8',
        'quantum-teal': '#10B981',
      },
    },
  },
  plugins: [],
};