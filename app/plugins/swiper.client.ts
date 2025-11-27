import { Swiper, SwiperSlide} from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('Swiper', Swiper)
  nuxtApp.vueApp.component('SwiperSlide', SwiperSlide)

})
