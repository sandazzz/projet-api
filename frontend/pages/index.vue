<script setup lang="ts"></script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white"
  >
    <h1 class="text-5xl font-extrabold text-green-500 mb-8">
      Bienvenue sur <span class="text-white">BoiteAnnonces</span>
    </h1>
    <p class="text-gray-300 text-lg mb-6 text-center max-w-md">
      Publiez vos annonces ou découvrez celles des autres en quelques clics,
      avec une plateforme fluide et moderne propulsée par Nuxt.
    </p>

    <div class="flex flex-wrap justify-center gap-4">
      <nuxt-link
        to="/ads"
        class="px-8 py-3 bg-green-700 text-white font-semibold rounded-md shadow-lg hover:bg-green-800 hover:shadow-xl transition-transform transform hover:scale-105"
      >
        Voir les annonces
      </nuxt-link>
    </div>
  </div>
</template>
