/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sumi: '#181A1B',
        washi: '#F8F7F4',
        card: '#FFFFFF',
        matcha: {
          light: '#EBF1EB',
          DEFAULT: '#34523F',
          dark: '#23382B'
        },
        hanko: '#C0392B',
        kakeibo: {
          needs: '#2E5B88',
          wants: '#B37D2E',
          culture: '#4A6F56',
          extra: '#935372'
        }
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
