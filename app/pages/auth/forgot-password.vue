<template>
  <section
    class="min-h-screen flex flex-col md:flex-row -mt-[2.3rem] md:-mt-[2.3rem] items-center justify-center text-white px-4 md:px-10"
  >
    <!-- Left Image -->
    <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
      <NuxtImg
        src="/games/ForgotPasswordLeft.png"
        alt=""
        quality="80"
        format="webp"
        densities="x1"
        loading="lazy"
        class="max-w-md w-full object-contain"
      />
    </div>

    <!-- Right Content -->
    <div
      class="w-full md:w-1/2 flex flex-col justify-center font-inter max-w-md mx-auto rounded-3xl p-9 md:p-14"
    >
      <!-- Icon -->
      <div class="flex mb-4">
        <NuxtImg
          src="/games/ForgotPasswordLock.svg"
          alt=""
          quality="80"
          densities="x1"
          loading="lazy"
          format="webp"
       class="w-16 h-16" />
      </div>

      <!-- Heading -->
      <h2 class="text-2xl md:text-3xl font-semibold text-left mb-2">
        Forgot Password?
      </h2>
      <p class="text-inputsIn text-xs text-left mb-6 md:mb-12">
        Enter your email to reset your password
      </p>

      <!-- Email Input -->
      <div class="relative mb-4">
        <Icon name="mdi-email"
          class="absolute left-3 top-5 -translate-y-1/2 w-5 h-5 text-primary"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="w-full bg-bgDark rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      </div>

      <!-- Submit Button -->
      <AppLink full class="h-9 font-semibold font-poppins mt-3" @click="handleSubmit">
        Submit
      </AppLink>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from 'axios'


const email = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  error.value = "";

  if (!email.value.trim()) {
    error.value = "Please enter your email.";
    return;
  }

  loading.value = true;

  try {
    const formData = new FormData();
    formData.append("email", email.value);

    const res = await $fetch("https://api.egamestore.com/api/users/requestPasswordReset", {
      method: "POST",
      body: formData,
    });

    console.log("Forgot Password Response:", res);

    if (res?.status === true) {
      // ✔ Email send successful
      localStorage.setItem("otpType", "reset");
      localStorage.setItem("resetIdentifier", email.value);
      router.push("/auth/otp-verification?type=reset");
    } else {
      // ❌ API ne false return kiya
      error.value = res?.errors?.[0] || res?.message || "Something went wrong.";
    }
  } catch (err) {
    console.log("Forgot Error:", err);

    // Network/API validation error
    if (err?.data?.errors) {
      error.value = Object.values(err.data.errors)[0][0];
    } else {
      error.value = "Unable to process request.";
    }
  }

  loading.value = false;
};
</script>

