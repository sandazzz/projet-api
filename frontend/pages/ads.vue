<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const ads = reactive<{ title: string; description: string; image: string }[]>(
  []
);
const messages = reactive({
  error: "",
});

// État pour suivre quelles annonces sont étendues
const expandedAds = reactive<{ [key: string]: boolean }>({});

const toggleExpand = (title: string) => {
  expandedAds[title] = !expandedAds[title];
};

const fetchAds = async () => {
  messages.error = "";
  try {
    const response = await $fetch<
      { title: string; description: string; image: string }[]
    >("http://localhost:3000/api/ads/list", {
      method: "GET",
      credentials: "include",
    });
    ads.splice(0, ads.length, ...response);
  } catch (error) {
    messages.error = "Erreur lors de la récupération des annonces.";
  }
};

onMounted(fetchAds);
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-black to-gray-900 px-6 py-10"
  >
    <div
      class="w-full max-w-3xl bg-gray-800/90 backdrop-blur-lg p-8 rounded-lg border border-gray-700 shadow-xl mt-20"
    >
      <h2 class="text-3xl font-semibold text-white mb-6 text-center">
        Annonces Disponibles
      </h2>

      <div v-if="messages.error" class="mb-4 text-red-400 text-sm text-center">
        {{ messages.error }}
      </div>

      <div
        v-if="ads.length === 0 && !messages.error"
        class="text-gray-400 text-center"
      >
        Aucune annonce disponible pour le moment.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="ad in ads"
          :key="ad.title"
          class="p-5 bg-gray-900 rounded-lg shadow-lg border border-gray-700 hover:shadow-green-500/50 transition-all hover:scale-105 flex flex-col h-full"
        >
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white">{{ ad.title }}</h3>
            <p
              class="text-gray-400 mt-2 overflow-hidden"
              :class="{ truncate: !expandedAds[ad.title] }"
            >
              {{ ad.description }}
            </p>
          </div>

          <div class="mt-3">
            <img
              v-if="ad.image"
              :src="ad.image"
              alt="Annonce"
              class="rounded-lg shadow-md max-w-full object-cover"
            />

            <!-- Bouton "Voir plus" uniquement si la description est longue -->
            <button
              v-if="ad.description.length > 150"
              @click="toggleExpand(ad.title)"
              class="text-green-400 text-sm mt-2 hover:underline cursor-pointer"
            >
              {{ expandedAds[ad.title] ? "Voir moins" : "Voir plus" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
