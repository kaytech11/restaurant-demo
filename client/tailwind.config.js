/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { 50: '#eef6f1', 100: '#d6e9de', 500: '#2a7a54', 600: '#1d5c3f', 700: '#174a33', 900: '#0d2b1e' },
        accent: { 400: '#f2b84b', 500: '#e8a317' },
      },
    },
  },
  plugins: [],
};
