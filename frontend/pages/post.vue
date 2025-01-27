<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <form class="w-full max-w-lg bg-white p-8 rounded-md shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Publier une annonce</h2>
      <div class="mb-4">
        <label for="title" class="block text-gray-600 mb-2">Titre</label>
        <input
          type="text"
          id="title"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <div class="mb-4">
        <label for="description" class="block text-gray-600 mb-2"
          >Description</label
        >
        <textarea
          id="description"
          rows="4"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        ></textarea>
      </div>
      <div class="mb-6">
        <label for="image" class="block text-gray-600 mb-2">Image</label>
        <input
          type="file"
          id="image"
          class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Publier
      </button>
    </form>
  </div>
</template>
