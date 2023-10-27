/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        '480': '480px',
        '560': '560px',
        '960': '960px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        '33%': '33%',
        '49%': '49%',
        '66%': '66%',
      },
      maxWidth: {
        '960': '960px',
      },
    },
  },
  plugins: [],
};
