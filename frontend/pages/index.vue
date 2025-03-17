<script setup lang="ts"></script>

<template>
  <div
    class="absolute inset-0 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
    <h1 class="text-5xl font-extrabold text-green-500 mb-8 text-center drop-shadow-lg">
      Bienvenue sur <span class="text-white">BoiteAnnonces</span>
    </h1>

    <p class="text-gray-300 text-lg mb-6 text-center max-w-md">
      Publiez vos annonces ou découvrez celles des autres en quelques clics,
      avec une plateforme fluide et moderne propulsée par Nuxt.
    </p>

    <div class="flex flex-wrap justify-center gap-4">
      <nuxt-link to="/ads"
        class="px-8 py-3 text-white font-semibold rounded-md shadow-md backdrop-blur-lg bg-gradient-to-r from-green-500 via-green-600 to-green-700 animate-gradient-x hover:shadow-green-500/50 transition-all duration-500 cursor-pointer">
        Voir les annonces
      </nuxt-link>
    </div>
  </div>
</template>

<style>
@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}
</style>
