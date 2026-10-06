import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pom-pink':     '#FF3D8B',
        'pom-yellow':   '#FFD60A',
        'pom-blue':     '#2B4BFF',
        'pom-paper':    '#F7F4ED',
        'pom-cream':    '#FBF8F1',
        'pom-ink':      '#0E0E10',
        'pom-ink-soft': '#3A3A3F',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
