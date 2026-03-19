/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4f1',
          100: '#d9e4dc',
          200: '#b3c9ba',
          300: '#8aae97',
          400: '#5f9174',
          500: '#2d4a3e',
          600: '#1f3530',
          700: '#17262a',
          800: '#111d21',
          900: '#0a1318',
        },
        accent: {
          50:  '#f9f6f1',
          100: '#f0e8d6',
          200: '#e0d0ad',
          300: '#cfb884',
          400: '#bda05b',
          500: '#8b6914',
          600: '#6b5410',
          700: '#4d3d0c',
          800: '#302608',
          900: '#181304',
        },
        cream: '#f5f0eb',
        neutral: {
          50:  '#f8f7f5',
          100: '#eeebe7',
          200: '#ddd9d4',
          300: '#c5c0b9',
          400: '#a09990',
          500: '#807870',
          600: '#666',
          700: '#524d46',
          800: '#2d2d2d',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans:  ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
