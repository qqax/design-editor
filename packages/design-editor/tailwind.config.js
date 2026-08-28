/** @type {import('tailwindcss').Config} */
module.exports = {
  important: '[data-de-root]',
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  }
}
