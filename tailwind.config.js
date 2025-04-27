/** @type {import('tailwindcss').Config} */
export default {
  content:  ["./src/**/*.{html,js,jsx,tsx,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(107.44deg, #E2E0FF 1.96%, #EBEAFA 16.15%, #F4F4F5 30.33%, #F5F5F5 71.54%, #E4E2FE 100%)',
      },
      textStroke: {
        1: '1px',
        2: '2px',
        3: '3px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-stroke': {
          '-webkit-text-stroke': '1px #C9C6ED',  // Sử dụng stroke cho chữ
          'textStroke': '1px #C9C6ED',
        }
      })},
  ],
}

