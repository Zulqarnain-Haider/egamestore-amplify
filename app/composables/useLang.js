// composables/useLang.js (or .ts)
export const useLang = () => {
  return useCookie('lang', {
    default: () => 'en',
    sameSite: 'lax',
    path: '/'
  })
}