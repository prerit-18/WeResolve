/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f1ff',
          100: '#e6e4ff',
          200: '#cdc9ff',
          300: '#aca4ff',
          400: '#8b7ffb',
          500: '#6f5ef2', // primary purple
          600: '#5c46e0',
          700: '#4c37bd',
          800: '#3e2f96',
          900: '#332a78',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 24, 40, 0.04), 0 1px 3px 0 rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
}
