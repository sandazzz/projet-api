<script setup lang="ts">
import LoginModal from '~/components/LoginModal.vue' // Assure-toi que le chemin est bon
import SignUpModal from '~/components/SignUpModal.vue'

const showLoginModal = ref<boolean>(false)
const showSignUpModal = ref<boolean>(false)
</script>

<template>
  <header
    class="sticky top-0 z-10 w-full bg-gray-900 px-4 py-2 flex flex-wrap items-center justify-between border-b border-gray-700">
    <!-- Logo -->
    <h1 class="text-xl font-semibold text-green-400">
      <nuxt-link to="/" class="hover:text-green-300 transition-colors duration-200">
        BoiteAnnonces
      </nuxt-link>
    </h1>

    <!-- Navigation -->
    <nav class="flex flex-wrap items-center gap-3 sm:gap-5">
      <!-- Bouton pour ouvrir la modale -->
      <button @click="showLoginModal = true"
        class="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white border border-gray-600 rounded-md hover:bg-gray-800 transition-all duration-200">
        Connexion
      </button>

      <!-- Lien vers inscription -->
      <button @click="showSignUpModal = true"
        class="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 bg-green-500 border border-green-500 rounded-md hover:bg-green-600 transition-all duration-200">
        Créer un compte
      </button>
    </nav>
  </header>

  <!-- Composant modale -->
  <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
  <SignUpModal :show="showSignUpModal" @close="showSignUpModal = false" />

</template>
