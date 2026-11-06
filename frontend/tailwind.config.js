/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#09090b',
          900: '#111116',
          850: '#16161d',
          800: '#1e1e26',
          750: '#252530',
          700: '#2d2d3a',
          600: '#434354',
          500: '#64647a',
          400: '#9595a8',
          300: '#c4c4d4',
          200: '#e4e4ed',
          100: '#f4f4f8',
        },
        brand: {
          purple: '#8b5cf6',
          violet: '#7c3aed',
          indigo: '#6366f1',
          fuchsia: '#d946ef',
          neon: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
