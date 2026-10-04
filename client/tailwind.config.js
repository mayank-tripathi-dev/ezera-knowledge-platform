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
        ezera: {
          teal: '#5ABDB2',
          'teal-light': '#8FE3DA',
          'teal-dark': '#2B8C82',
          bright: '#2DD4BF',
          cyan: '#38BDF8',
          gold: '#F59E0B',
          onyx: '#0B0F17',
          slate: '#0F172A',
          card: '#1E293B',
          border: '#334155'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'ezera-glow': '0 0 25px -5px rgba(90, 189, 178, 0.35)',
        'ezera-card': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'ezera-card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(90, 189, 178, 0.15)',
      }
    },
  },
  plugins: [],
}
