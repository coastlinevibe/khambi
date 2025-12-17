/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        khambi: {
          primary: '#000000',     // Pure Black
          secondary: '#FFFFFF',   // Pure White
          accent: '#C9A961',      // Gold/Bronze
          gold: '#B8935E',        // Darker Gold
          lightgold: '#D4AF77',   // Light Gold
          gray: '#A0A0A0',        // Light Gray for subtitles
          darkgray: '#1a1a1a'     // Near Black
        },
        // Additional elegant colors
        elegant: {
          charcoal: '#2b2b2b',
          ivory: '#f8f8f8',
          silver: '#c0c0c0',
          bronze: '#cd7f32',
        }
      },
      backgroundImage: {
        'hero-funeral': "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        'peaceful': "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)",
        'elegant-gold': "linear-gradient(135deg, #000000 0%, #C9A961 50%, #ffffff 100%)",
      }
    },
  },
  plugins: [],
};
