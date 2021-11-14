module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "bottom-left": "#eaede8",
        "bottom-center": "#dd97e8",
        "bottom-right": "#c811e8",
        "center-left": "#b1ede8",
        "center-center": "#b197e9",
        "center-right": "#b111e9",
        "top-left": "#07ede8",
        "top-center": "#0797ea",
        "top-right": "#0711ea",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
