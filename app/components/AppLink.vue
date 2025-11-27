<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'flex items-center justify-center transition-all duration-300 shadow-md rounded-md font-poppins',
      variant === 'primary'
        ? 'bg-primary text-onPrimary hover:opacity-90'
        : 'bg-surface border-2 border-outline text-mainText hover:bg-outline hover:text-white',
      disabled ? 'bg-gray-400 cursor-not-allowed opacity-70 border-none text-white' : '',
      full ? 'w-full block' : '',
      extraClass
    ]"
    :style="{
      width: full ? '100%' : (width ? width + 'px' : 'auto'),
      height: height ? height + 'px' : undefined
    }"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' }, // can be "submit", "button", or "reset"
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
  variant: { type: String, default: 'primary' },
  extraClass: { type: String, default: '' },
  full: { type: Boolean, default: false }
})
</script>
