/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  // Purge unused CSS more aggressively
  purge: {
    enabled: true,
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: ['dark', 'light'],
    }
  },
  theme: {
    extend: {
      colors: {
        ubuntugift: {
          primary: '#D97706',     // Warm Orange
          secondary: '#475569',   // Slate Gray
          accent: '#F59E0B',      // Gold
          earth: '#92400E',       // Deep Brown
          light: '#FEF3C7',       // Soft Cream
          dark: '#1F2937'         // Charcoal
        },
        // Additional compassionate colors
        compassion: {
          sage: '#84a98c', // Soft green for hope
          lavender: '#b8a3ba', // Gentle purple for comfort
          cream: '#f4f1de', // Warm cream for peace
          stone: '#5f6c7b', // Cool stone gray
        }
      },
      backgroundImage: {
        'hero-funeral': "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
        'peaceful': "linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%)",
        'sunrise-hills': "linear-gradient(135deg, #744210 0%, #f4f1de 50%, #84a98c 100%)",
      }
    },
  },
  plugins: [],
};
