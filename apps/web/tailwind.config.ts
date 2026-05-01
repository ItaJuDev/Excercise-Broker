import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05091a',
          900: '#070d22',
          850: '#0a1230',
          800: '#0e1838',
          700: '#142046',
          600: '#1c2a5a',
          500: '#27376e',
        },
        accent: {
          DEFAULT: '#3b6cff',
          hover: '#4f7cff',
          soft: '#1b2a5e',
        },
        muted: '#8a98c2',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(59,108,255,0.25), 0 20px 60px -20px rgba(59,108,255,0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
