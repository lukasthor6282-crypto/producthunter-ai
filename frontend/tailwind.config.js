/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05070a',
        panel: 'rgba(11, 18, 27, 0.72)',
        line: 'rgba(221, 255, 244, 0.14)',
        mist: '#9fb5c8',
        mint: '#81f3c8',
        cyan: '#60d8ff',
        amber: '#ffd166',
        danger: '#ff7a90',
      },
      boxShadow: {
        glass: '0 18px 65px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        glow: '0 0 32px rgba(129, 243, 200, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

