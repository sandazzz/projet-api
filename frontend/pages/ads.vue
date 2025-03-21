<script setup lang="ts">

const ads = ref<{ title: string; description: string; image: string }[]>([]);

const fetchAds = async () => {
  try {
    const response = await $fetch<
      { title: string; description: string; image: string }[]
    >("http://localhost:3000/api/ads/list", {
      method: "GET",
      credentials: "include",
    });
    ads.value = response;
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces.");
  }
};

onMounted(fetchAds);
</script>

<template>
  <div class=" absolute inset-0 min-h-screen flex items-center justify-center bg-gray-900 px-6 py-10">
    <div class="w-full max-w-3xl bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-xl">
      <h2 class="text-3xl font-semibold text-white mb-6 text-center">
        Annonces Disponibles
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(ad, index) in ads" :key="index"
          class="p-5 bg-gray-900 rounded-lg shadow-lg border border-gray-700 hover:shadow-green-500/50 transition-all hover:scale-105 w-80 h-32 flex flex-col">
          <h3 class="text-lg font-semibold text-white">{{ ad.title }}</h3>
          <p class="text-gray-400 mt-2 flex-grow overflow-hidden">
            {{ ad.description }}
          </p>
          <img v-if="ad.image" :src="ad.image" alt="Annonce"
            class="rounded-lg shadow-md w-full h-48 object-cover mt-3" />
        </div>
      </div>
    </div>
  </div>
</template>
