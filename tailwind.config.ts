import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        main: ["Montserrat", "sans-serif"],
        fancy: ["MonteCarlo", "serif"],
        // title: ["Tinos", "serif"]
      },
      colors: {
        light: {
          main: "#f37299", //f58a9f ff80b0 f58aaf f37299
          main2: "#f7a1bf", //f7a1b2 ff99c0 f7a1bf f58aaa
          main3: "#FFDCDC",
          main4: "#FFF2EB",
          secondary: "#f37299", //09aa89 09aa97 f10e5d f2267f
          text1: "#000000",
          text2: "#333333",
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