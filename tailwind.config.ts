import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#050608',
        'primary-charcoal': '#111111',
        'primary-white': '#F5F2EB',
        'secondary-text': '#B1ABA0',
        'accent-gold': '#C19A5B',
        'accent-gold-light': '#D0A15A',
      },
      fontFamily: {
        // Single typeface site-wide (see app/layout.tsx); the three names stay
        // so existing classes keep working.
        serif: ['var(--font-site)', 'Georgia', 'serif'],
        sans: ['var(--font-site)', 'Georgia', 'serif'],
        display: ['var(--font-site)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'wide': '0.05em',
        'wider': '0.1em',
      },
    },
  },
  plugins: [],
};
export default config;

