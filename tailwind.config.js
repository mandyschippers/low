/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#f5e6c8',
        'deep-purple': '#1a0a2e',
        'mid-purple': '#2d1b4e',
        'light-purple': '#4a2c7a',
        gold: '#c9a227',
        'gold-light': '#f0c040',
        fighters: '#e07020',
        rogues: '#555555',
        clerics: '#d4d4d4',
        wizards: '#7b3fc4',
      },
    },
  },
  plugins: [],
}

