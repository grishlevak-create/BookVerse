/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          elevated: 'hsl(var(--surface-elevated) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          muted: 'hsl(var(--accent-muted) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, hsl(var(--surface) / 0) 0%, hsl(var(--surface)) 100%), radial-gradient(circle at 50% 0%, hsl(var(--accent) / 0.12) 0%, transparent 55%)',
        glass:
          'linear-gradient(135deg, hsl(0 0% 100% / 0.06) 0%, hsl(0 0% 100% / 0.02) 50%, hsl(0 0% 100% / 0.04) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px hsl(0 0% 0% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.06)',
        glow: '0 0 40px hsl(var(--accent) / 0.25)',
      },
      animation: {
        shimmer: 'shimmer 1.4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
