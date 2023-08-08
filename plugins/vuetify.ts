import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: false,
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            primary: '#B71C1C',
            secondary: '#03DAC6',
            accent: '',
            background: '#000000',
          }
        }
      }
    }
  })
  

  nuxtApp.vueApp.use(vuetify)
})
