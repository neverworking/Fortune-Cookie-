/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        tint: '#38b6ff'
      },
      boxShadow: {
        'glow': '0 10px 30px rgba(56,182,255,0.35)',
      },
      backgroundImage: {
        'soft': 'radial-gradient(1000px 600px at 10% 10%, rgba(56,182,255,0.35), transparent), radial-gradient(1200px 800px at 90% 40%, rgba(255,182,193,0.25), transparent), linear-gradient(180deg, #0e0f28 0%, #16192e 100%)'
      }
    },
  },
  plugins: [],
}
