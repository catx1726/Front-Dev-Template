module.exports = {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      gray: {
        light: 'var(--base-gray)',
        DEFAULT: 'var(--base-gray)',
        dark: 'var(--base-dark)'
      },
      black: {
        light: 'var(--base-black)',
        DEFAULT: 'var(--base-black)',
        dark: 'var(--base-gray)'
      }
    }
  },
  plugins: [],
  darkMode: 'media'
}
