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
          100: '#E2E8F0', // border (light gray/teal shade)
          200: '#CBD5E1', // hover border
          300: '#64748B', // muted
          400: '#475569', // text
          500: '#0F9D9A', // Primary brand (Deep Teal)
          600: '#0C7C79', // Primary hover (Dark Teal)
          700: '#2563EB', // Secondary brand (Royal Blue)
          800: '#1D4ED8', // Secondary hover (Blue)
          900: '#0F172A', // Heading
        },
        primary: "#0F9D9A",
        primaryDark: "#0C7C79",
        secondary: "#2563EB",
        secondaryDark: "#1D4ED8",
        background: "#F8FAFC",
        section: "#EFF6FF",
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
