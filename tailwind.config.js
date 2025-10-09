/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {}
  },
  safelist: [
    { pattern: /bg-(yellow|orange|purple|indigo|blue|green|red)-(50|100|200|500)/ },
    { pattern: /text-(yellow|orange|purple|indigo|blue|green|red)-(400|500|600)/ }
  ],
  plugins: []
};
