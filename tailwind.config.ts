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
        normal: 'var(--color-normal)',
        explosive: 'var(--color-explosive)',
        piercing: 'var(--color-piercing)',
        mystic: 'var(--color-mystic)',
        sonic: 'var(--color-sonic)',
      },
    },
  },
  plugins: [],
}
export default config
