/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c',
        panel: '#121217',
        accent: {
          primary: '#3b82f6', // blue
          secondary: '#10b981', // green
          danger: '#ef4444', // red
          warning: '#f59e0b', // amber
        },
        border: '#1e1e26',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
