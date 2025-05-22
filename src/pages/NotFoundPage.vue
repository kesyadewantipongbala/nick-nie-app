<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
    <h1 class="text-6xl font-bold text-red-600">404</h1>
    <p class="text-xl text-gray-700 mt-4">Oops! The page you're looking for doesn't exist.</p>
    <p class="text-lg text-gray-500 mt-2">
      It seems like the page might have been moved or deleted.
    </p>
    <router-link to="/dashboard" class="mt-6 text-blue-500 hover:text-blue-700 text-lg">
      Back to Home
    </router-link>
  </div>
</template>

<script setup>
  // No special script needed for a basic 404 page
</script>

<style scoped>
  h1 {
    font-size: 6rem;
    font-weight: 700;
  }

  p {
    font-size: 1.25rem;
  }

  .router-link {
    font-size: 1.125rem;
    font-weight: 600;
    text-decoration: underline;
  }
</style>
