import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amh: {
          cream: '#f6ede4',
          red: '#ed1b28',
          'red-dark': '#d5211c',
          'red-deep': '#b01020',
          navy: '#0c1118',
          ink: '#131a26',
          slate: '#303c50',
          purple: '#622b7b',
          blue: '#003764',
        },
      },
      fontFamily: {
        sans: ['Branding', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

