/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  corePlugins: {
    preflight: false
  },
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'dark',
    prefix: 'du-'
  }
};
