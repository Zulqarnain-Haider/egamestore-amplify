<template>
  <section
    class="relative min-h-screen flex flex-col md:flex-row md:-mt-[2.3rem] items-center justify-center text-white px-4 md:px-10 overflow-hidden"
  >
    <!--Left Image -->
    <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 z-10">
      <NuxtImg
        densities="x1" quality="80" format="webp" loading="lazy"
        src="/games/ForgotPasswordLeft.png"
        alt="Password Changed Left"
        class="max-w-md w-full object-contain rounded-3xl"
      />
    </div>

    <!--Right Content -->
    <div
      class="w-full md:w-1/2 flex flex-col justify-center font-poppins max-w-md mx-auto rounded-3xl p-9 md:p-14 animate-fadeInRight"
    >
      <!-- Icon -->
      <div class="flex mb-5">
        <NuxtImg
         densities="x1" quality="80" loading="lazy"
          src="/games/ResetPasswordSuccess.svg"
          alt="Success Icon"
          />
      </div>

      <!-- Heading -->
      <h2 class="text-2xl md:text-3xl font-semibold mb-3">
        {{ t('passwordChangedTitle') }}
      </h2>

      <p class="text-inputsIn text-md mb-8 md:mb-10">
        {{ t('passwordChangedSubtitle') }}
      </p>

      <!--Sign In Button -->
        <AppButton to="/auth/login" full class="h-9 text-lg font-poppins">
          {{ t('passwordChangedSignIn') }}
        </AppButton>
    </div>
  </section>
</template>
<script setup>
const { t } = useI18n()

definePageMeta({
  layout: 'auth'
})
</script>