// composables/useLangHeader.ts
export const useLangHeader = () => {
  const lang = useLang()
  return { lang: lang.value }
}
