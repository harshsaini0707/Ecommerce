import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#f4f7ff',
          100: '#e5ecff',
          200: '#cad9ff',
          300: '#9fbaff',
          400: '#6f93ff',
          500: '#4a6bff',
          600: '#3347f0',
          700: '#1f2ec5',
          800: '#1d299d',
          900: '#1d287c',
        },
        midnight: '#0f172a',
        porcelain: '#f8fbff',
      },
      boxShadow: {
        glass: '0 20px 45px rgba(15, 23, 42, 0.18)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.25rem',
      },
      backgroundImage: {
        'glow-radial': 'radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.18) 0%, rgba(15, 23, 42, 0) 55%)',
        'glow-spot': 'radial-gradient(circle at 80% 30%, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0) 45%)',
      },
    },
  },
  plugins: [],
};

export default config;
