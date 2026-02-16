import { ref } from 'vue'

export const useTurnstile = () => {

  const config = useRuntimeConfig()

  const verified = ref(false)
  const token = ref(null)

  const execute = () => {

    if (!process.client) return

    if (!window.turnstile) {
      console.warn('Turnstile not loaded yet')
      return
    }

    verified.value = false
    token.value = null

    // create invisible container
    const el = document.createElement('div')
    document.body.appendChild(el)

    const widgetId = window.turnstile.render(el, {
      sitekey: config.public.turnstileSiteKey,
      size: 'invisible',

      callback: (t) => {
        token.value = t
        verified.value = true

        window.turnstile.remove(widgetId)
        el.remove()
      },

      'error-callback': () => {
        verified.value = false
        console.warn('Turnstile verification failed')
      }
    })

    window.turnstile.execute(widgetId)
  }

  return {
    verified,
    token,
    execute
  }
}
