<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { login } = useAuth(); // Utilise le composable d'authentification

const form = reactive({
  email: "",
  password: "",
});

const messages = reactive({
  error: "",
  success: "",
});

const showSuccessMessage = ref(false);

const loginUser = async () => {
  messages.error = "";
  messages.success = "";
  showSuccessMessage.value = false;

  if (!form.email || !form.password) {
    messages.error = "Tous les champs sont obligatoires.";
    return;
  }

  const result = await login(form.email, form.password);

  if (result.success) {
    messages.success = result.message;
    showSuccessMessage.value = true;
    setTimeout(() => {
      router.push("/");
    }, 2000);
  } else {
    messages.error = result.message;
  }
};

// OAuth Login (Redirection vers Fastify)
const loginWithGoogle = () => {
  window.location.href = "http://localhost:3000/api/auth/google";
};

const loginWithGitHub = () => {
  window.location.href = "http://localhost:3000/api/auth/github";
};
</script>

<template>
  <div
    class="absolute inset-0 min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-black to-gray-900 px-4"
  >
    <form
      @submit.prevent="loginUser"
      class="w-full max-w-md bg-gray-800/90 backdrop-blur-lg p-6 rounded-lg border border-gray-700 shadow-xl"
    >
      <h2 class="text-xl font-semibold text-white mb-4 text-center">
        Connexion
      </h2>

      <div v-if="messages.error" class="mb-4 text-red-400 text-sm text-center">
        {{ messages.error }}
      </div>

      <div class="mb-4">
        <label for="email" class="block text-gray-300 text-sm font-medium mb-1"
          >Email</label
        >
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none"
        />
      </div>

      <div class="mb-5">
        <label
          for="password"
          class="block text-gray-300 text-sm font-medium mb-1"
          >Mot de passe</label
        >
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-green-500 text-white font-medium py-2 rounded-md hover:bg-green-600 transition-all duration-200 cursor-pointer"
      >
        Se connecter
      </button>

      <!-- Message de succès sous le bouton -->
      <div
        v-if="showSuccessMessage"
        class="mt-3 text-center text-green-400 font-medium"
      >
        Connexion réussie !
      </div>

      <div class="mt-5">
        <p class="text-center text-gray-400 text-sm mb-3">
          Ou connectez-vous avec :
        </p>

        <button
          @click="loginWithGoogle"
          class="w-full bg-red-500 text-white font-medium py-2 rounded-md hover:bg-red-600 transition-all duration-200 cursor-pointer mb-3"
        >
          Continuer avec Google
        </button>

        <button
          @click="loginWithGitHub"
          class="w-full bg-gray-700 text-white font-medium py-2 rounded-md hover:bg-gray-600 transition-all duration-200 cursor-pointer"
        >
          Continuer avec GitHub
        </button>
      </div>
    </form>
  </div>
</template>
