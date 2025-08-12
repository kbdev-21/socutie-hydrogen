import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        main: ["Source Sans", "sans-serif"],
        logo: ["Rouge Script", "serif"],
        title: ["Tinos", "serif"]
      },
      colors: {
        light: {
          main: "#f58a9f", //e6d57f: beige
          main2: "#f7a1b2",
          text1: "#000000",
          text2: "#666666",
          bg1: "#ffffff",
          bg3: "#f7f7f7",
          bg2: "#e6e6e6",
        },
        dark: {
          main: "#F891A5",
          text1: "#ffffff",
          bg1: "#000000"
        },
      }
    },
  },
}

export default config;