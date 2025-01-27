<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <form class="w-full max-w-md bg-white p-8 rounded-md shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Connexion</h2>
      <div class="mb-4">
        <label for="email" class="block text-gray-600 mb-2">Email</label>
        <input
          type="email"
          id="email"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-green-300"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-600 mb-2"
          >Mot de passe</label
        >
        <input
          type="password"
          id="password"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-green-300"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
      >
        Se connecter
      </button>
      <div class="mt-4">
        <p class="text-center text-gray-600">Ou connectez-vous avec :</p>
        <div class="flex justify-center mt-2 space-x-4">
          <button
            class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Google
          </button>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Twitter
          </button>
          <button
            class="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
          >
            GitHub
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts"></script>
