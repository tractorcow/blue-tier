import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Blue archive attack / defense colours
        normal: {
          dark: 'var(--color-normal)',
          light: 'var(--color-normal-light)',
        },
        explosive: {
          DEFAULT: 'var(--color-explosive)',
          dark: 'var(--color-explosive)',
          light: 'var(--color-explosive-light)',
        },
        piercing: {
          DEFAULT: 'var(--color-piercing)',
          dark: 'var(--color-piercing)',
          light: 'var(--color-piercing-light)',
        },
        mystic: {
          DEFAULT: 'var(--color-mystic)',
          dark: 'var(--color-mystic)',
          light: 'var(--color-mystic-light)',
        },
        sonic: {
          DEFAULT: 'var(--color-sonic)',
          dark: 'var(--color-sonic)',
          light: 'var(--color-sonic-light)',
        },
      },
    },
  },
  plugins: [],
}
export default config
