import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['./index.html', './src/**/*.{jsx,tsx,ts,js}'],
  },
  shortcuts: {
  },
})
