// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  build: {
    transpile: ['vuetify'],
  },
  pages: true,
  vite: {
    plugins: [nodePolyfills({
      exclude: [
        'assert',
        'buffer',
        'child_process',
        'cluster',
        'dgram',
        'dns',
        'domain',
        'events',
        'fs',
        'http',
        'https',
        'net',
        'os',
        'path',
        'punycode',
        'querystring',
        'readline',
        //'stream',
        'string_decoder',
        'timers',
        'tls',
        'tty',
        'url',
        'util',
        //'v8',
        'vm',
        'zlib',
      ],
      globals: {
        Buffer: false,
        global: false,
        process: false,
      },
      protocolImports: true,
    })]
  }
})
