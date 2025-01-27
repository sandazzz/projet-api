<script setup lang="ts"></script>

<template>
  <header
    class="w-full bg-gray-800 px-6 py-4 flex items-center justify-between shadow-md"
  >
    <!-- Logo -->
    <h1 class="text-2xl font-bold text-green-500">
      <nuxt-link to="/" class="hover:text-green-400">BoiteAnnonces</nuxt-link>
    </h1>

    <!-- Navigation -->
    <nav class="flex items-center gap-4">
      <nuxt-link
        to="/login"
        class="px-8 py-3 bg-gray-800 text-white font-semibold rounded-md shadow-lg hover:bg-gray-700 hover:shadow-xl transition-transform transform hover:scale-105"
      >
        Connexion
      </nuxt-link>
      <nuxt-link
        to="/signup"
        class="px-8 py-3 bg-green-500 text-gray-900 font-semibold rounded-md shadow-lg hover:bg-green-600 hover:shadow-xl transition-transform transform hover:scale-105"
      >
        Créer un compte
      </nuxt-link>
    </nav>
  </header>
</template>
