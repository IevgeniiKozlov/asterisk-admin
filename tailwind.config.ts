import { nextui } from '@nextui-org/react'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      padding: '1rem',
    },
    screens: {
      xs: '390px',
      // => @media (min-width: 390px) { ... }

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1100px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      backgroundImage: {
        signin: "url('../public/background-signin.png')",
        signin2: "url('../public/bgsignin.png')",
        'main-gradient':
          'linear-gradient(to bottom, #ffef5e, #ffd65b, #ffbd5f, #ffa767, #f7936f);',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
}
export default config
