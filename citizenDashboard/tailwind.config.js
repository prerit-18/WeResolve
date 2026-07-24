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
          50: '#F0FDFD', // light teal tint
          100: '#E6F4F4', // teal border/tint
          200: '#CCFBF1',
          300: '#99F6E4',
          400: '#2DD4BF',
          500: '#0F9D9A', // Primary brand (Deep Teal)
          600: '#0C7C79', // Primary hover (Dark Teal)
          700: '#0A6664',
          800: '#085351',
          900: '#0F172A', // Heading
        },
        primary: "#0F9D9A", // Deep Teal
        primaryDark: "#0C7C79", // Dark Teal
        secondary: "#0D8B88", // Medium Teal
        secondaryDark: "#0A6E6B", // Darker Teal
        background: "#F8FAFC",
        section: "#F0FDFD", // Soft light teal section background
        card: "#FFFFFF",
        heading: "#0F172A",
        text: "#475569",
        muted: "#64748B",
        border: "#E2E8F0",
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
