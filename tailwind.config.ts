import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        main: ["Open Sans", "sans-serif"],
        title: ["Rouge Script", "serif"] //title: ["Pacifico", "serif"]
      },
      colors: {
        light: {
          main: "#e6d57f",
          text1: "#000000",
          text2: "#333333",
          bg1: "#ffffff",
          bg2: "#e6e6e6",
          bg3: "#cccccc"
        },
        dark: {
          main: "#e6d57f",
          text1: "#ffffff",
          bg1: "#000000"
        },
      }
    },
  },
}

export default config;