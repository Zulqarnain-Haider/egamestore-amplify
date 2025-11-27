<template>
  <section
    class="relative min-h-screen flex flex-col md:flex-row md:-mt-[2.3rem] items-center justify-center text-white px-4 md:px-10 overflow-hidden"
  >
    <!--Left Image -->
    <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 z-10">
      <img
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
        <img
          src="/games/ResetPasswordSuccess.svg"
          alt="Success Icon"
                  />
      </div>

      <!-- Heading -->
      <h2 class="text-2xl md:text-3xl font-semibold mb-3">
        Your Password Successfully Changed!
      </h2>

      <p class="text-inputsIn text-md mb-8 md:mb-10">
        Sign in to your account with your new password
      </p>

      <!--Sign In Button -->
        <AppButton to="/auth/login" full class="h-9 text-lg font-poppins">
          Sign In
        </AppButton>
    </div>
  </section>
</template>
<script setup>
definePageMeta({
  layout: 'auth'
})
</script>