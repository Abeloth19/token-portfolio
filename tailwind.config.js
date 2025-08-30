/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#18181B',
          secondary: '#27272A',
          card: '#2D2D2D',
        },
        accent: {
          green: '#A9E851',
          'green-hover': '#98D93F',
        },
      },
    },
  },
  plugins: [],
}

