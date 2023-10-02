/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./popup.html", "node_modules/preline/dist/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("preline/plugin")],
};
