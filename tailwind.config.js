// eslint-disable-next-line @typescript-eslint/no-var-requires
const {nextui} = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  plugins: [
    nextui({
      themes: {
        'cookies-pack-light': {
          extend: 'light',
          colors: {
            primary: {
              50: '#fefce8',
              100: '#fdedd3',
              200: '#fbdba7',
              300: '#f9c97c',
              400: '#f7b750',
              500: '#f5a524',
              600: '#c4841d',
              700: '#936316',
              800: '#62420e',
              900: '#312107',
              DEFAULT: '#f5a524',
            },
            focus: '#f7b750',
          },
        },
        'cookies-pack-dark': {
          extend: 'dark',
          colors: {
            primary: {
              50: '#312107',
              100: '#62420e',
              200: '#936316',
              300: '#c4841d',
              400: '#f5a524',
              500: '#f7b750',
              600: '#f9c97c',
              700: '#fbdba7',
              800: '#fdedd3',
              900: '#fefce8',
              DEFAULT: '#c4841d',
            },
            focus: '#f5a524',
          },
        },
      },
    }),
  ],
};
