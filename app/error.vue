<template>
    <div class="relative w-full min-h-screen overflow-hidden justify-center items-center flex  px-4">
        <!-- Background -->
        <NuxtImg src="/games/error.jpeg" alt="Background"
         quality="80" format="webp" densities="x1" preload
         fetchpriority="high" class="absolute inset-0 w-full h-full object-cover bg-center opacity-15" />

        <!-- Foreground content -->
        <div class="relative z-10 flex flex-col items-center justify-center text-center max-w-xl pb-10">
            <!-- Robot image -->
            <NuxtImg src="/games/Gemini.Robot.png" alt="Robot" 
            quality="80" format="webp" densities="x1" loading="lazy"
            placeholder="blur" class="max-w-xs md:max-w-xl mb-6 object-contain" />

            <!-- Text + Button container -->
            <div class="absolute flex flex-col items-center gap-4 bottom-16">
                <h1 class="text-onPrimary font-semibold text-5xl md:text-6xl font-poppins mb-4">
                    Page Not Found
                </h1>

                <p class="text-onPrimary font-normal font-poppins text-base">
                    The page you're looking for doesn't exist. It might have been moved or deleted.
                    Let's redeploy you to a safe zone.
                </p>

                <AppButton to="/" variant="primary" :width="227" :height="51"
                    extraClass="rounded-full font-poppins font-normal text-base text-onPrimary">
                    Go to Home
                </AppButton>
            </div>
        </div>
    </div>
</template>
