import { defineNuxtPlugin } from '#app'
import { useRuntimeConfig } from '#imports'
import Vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.vueApp.use(Vue3GoogleLogin, {
    clientId: config.public.googleClientId as string,
  })
})
