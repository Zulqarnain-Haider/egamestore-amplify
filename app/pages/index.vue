<template>
  <main class="min-h-screen text-white">
    <!-- Hero Section - Load immediately (above fold) -->
    <HeroSection />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 mt-6">
      <!-- Categories - Load immediately (still visible) -->
      <CategoriesSection class="mt-24" />
      <!-- Lazy load - Below the fold -->
      <LazyTrendingGames class="mt-16 pr-2 sm:pr-3 lg:pr-9" />
    </div>

    <div class="mt-12">
      <LazyTournamentsGame />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 mt-6">
      <!--Lazy load - Best Sellers -->
      <LazyBestsellersSection class="mt-16 pr-2 sm:pr-3 lg:pr-9" />

      <!--Lazy load - Upcoming Games -->
      <LazyUpComingGames class="mt-16 pr-2 sm:pr-3 lg:pr-9" />
    </div>

    <!--Lazy load - Hero Section 2 -->
    <LazyHeroSection2 class="mt-14" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 mt-0">
      <!--Lazy load - Customer Reviews -->
      <LazyCustomerReviews class="mt-10" />

      <!--Lazy load - Blog Section -->
      <LazyBlogSection class="mt-16 mb-16" />
    </div>
  </main>
</template>

<script setup>
// SEO Meta
useSeoMeta({
  title: 'E-GAMESTORE - Your Ultimate Gaming Destination',
  description: 'Discover the latest and greatest in gaming at E-GAMESTORE. From trending titles to upcoming releases, we have it all. Join tournaments, read reviews, and stay updated with our blog. Your next adventure awaits!',
  ogTitle: 'E-GAMESTORE - Your Ultimate Gaming Destination',
  ogDescription: 'Discover the latest and greatest in gaming at E-GAMESTORE. From trending titles to upcoming releases, we have it all. Join tournaments, read reviews, and stay updated with our blog. Your next adventure awaits!',
  ogType: 'website',
  ogImage: '/favicon.png',
  ogUrl: 'https://egamestore.com/',
  twitterCard: 'summary_large_image',
});

</script>