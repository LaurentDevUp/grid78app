import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Thème GRID78 - Couleurs du logo officiel
        grid: {
          cyan: {
            50: '#e6f7fc',
            100: '#cceff9',
            200: '#99dff3',
            300: '#66cfed',
            400: '#33bfe7',
            500: '#00A7E1', // Bleu cyan principal
            600: '#0086b4',
            700: '#006587',
            800: '#00445a',
            900: '#00232d',
          },
          orange: {
            50: '#fef3ec',
            100: '#fde7d9',
            200: '#fbcfb3',
            300: '#f9b78d',
            400: '#f79f67',
            500: '#F47920', // Orange principal
            600: '#c3611a',
            700: '#924913',
            800: '#62300d',
            900: '#311806',
          },
          red: {
            50: '#fce9ea',
            100: '#f9d3d5',
            200: '#f3a7ab',
            300: '#ed7b81',
            400: '#e74f57',
            500: '#E31E24', // Rouge principal
            600: '#b6181d',
            700: '#881216',
            800: '#5a0c0e',
            900: '#2d0607',
          },
          navy: {
            50: '#e6eaf2',
            100: '#ccd5e5',
            200: '#99abcb',
            300: '#6681b1',
            400: '#335797',
            500: '#002D72', // Bleu marine principal
            600: '#00245b',
            700: '#001b44',
            800: '#00122e',
            900: '#000917',
          },
          purple: {
            50: '#f3edf6',
            100: '#e7dbed',
            200: '#cfb7db',
            300: '#b793c9',
            400: '#9f6fb7',
            500: '#7B3F94', // Violet principal
            600: '#623276',
            700: '#4a2659',
            800: '#31193b',
            900: '#190d1e',
          },
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
