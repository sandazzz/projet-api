<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <form class="w-full max-w-md bg-white p-8 rounded-md shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Créer un compte</h2>
      <div class="mb-4">
        <label for="name" class="block text-gray-600 mb-2">Nom complet</label>
        <input
          type="text"
          id="name"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-600 mb-2">Email</label>
        <input
          type="email"
          id="email"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-600 mb-2"
          >Mot de passe</label
        >
        <input
          type="password"
          id="password"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        S'inscrire
      </button>
    </form>
  </div>
</template>

<script setup lang="ts"></script>
