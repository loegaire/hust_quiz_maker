/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        body: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
