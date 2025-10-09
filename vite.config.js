import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from "@sentry/vite-plugin"

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG || "casequest",
      project: "casequest",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: "./dist/assets"
      },
      disable: !process.env.SENTRY_AUTH_TOKEN
    })
  ],
  build: {
    sourcemap: true
  }
})
