import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        main: ["Source Sans 3", "sans-serif"],
        logo: ["Rouge Script", "serif"],
        title: ["Tinos", "serif"]
      },
      colors: {
        light: {
          main: "#F891A5", //e6d57f: beige
          text1: "#000000",
          text2: "#4d4d4d",
          bg1: "#ffffff",
          bg2: "#e6e6e6",
          bg3: "#cccccc"
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