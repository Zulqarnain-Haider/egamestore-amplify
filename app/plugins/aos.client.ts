// @ts-ignore
import AOS from 'aos'
import 'aos/dist/aos.css'

export default defineNuxtPlugin(() => {
// @ts-ignore
  if (process.client) {
    AOS.init({
      duration: 800, // animation speed
      once: true,    // only animate once
      easing: 'ease-in-out',
      offset: 100,   // start animation 100px before section visible
    })
  }
})
