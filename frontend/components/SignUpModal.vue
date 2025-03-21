<script setup lang="ts">
import { reactive } from "vue";

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{
    (event: 'close'): void
}>()

const form = reactive({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
});

const messages = reactive({
    error: "",
    success: "",
});

const registerUser = async () => {
    messages.error = "";
    messages.success = "";

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
        messages.error = "Tous les champs sont obligatoires.";
        return;
    }

    try {
        await $fetch("http://localhost:3000/api/register", {
            method: "POST",
            body: form,
        });

        messages.success = "Inscription réussie !";
    } catch (error) {
        messages.error = "Erreur lors de l'inscription.";
    }
};

// Gérer Escape
const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        emit('close')
    }
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onUnmounted(() => window.removeEventListener('keydown', handleEscape))
</script>

<template>
    <div v-if="show"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
        <form @submit.prevent="registerUser"
            class="w-full max-w-md bg-gray-800/90 backdrop-blur-lg p-6 rounded-lg border border-gray-700 shadow-xl animate-fade-in">
            <!-- Bouton fermeture -->
            <button @click="emit('close')"
                class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">&times;</button>
            <h2 class="text-xl font-semibold text-white mb-4 text-center">
                Créer un compte
            </h2>

            <div v-if="messages.error" class="mb-4 text-red-400 text-sm text-center">
                {{ messages.error }}
            </div>
            <div v-if="messages.success" class="mb-4 text-green-400 text-sm text-center">
                {{ messages.success }}
            </div>

            <div class="mb-4">
                <label for="firstName" class="block text-gray-300 text-sm font-medium mb-1">Prénom</label>
                <input v-model="form.firstName" type="text" id="firstName"
                    class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none" />
            </div>

            <div class="mb-4">
                <label for="lastName" class="block text-gray-300 text-sm font-medium mb-1">Nom</label>
                <input v-model="form.lastName" type="text" id="lastName"
                    class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none" />
            </div>

            <div class="mb-4">
                <label for="email" class="block text-gray-300 text-sm font-medium mb-1">Email</label>
                <input v-model="form.email" type="email" id="email"
                    class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none" />
            </div>

            <div class="mb-4">
                <label for="password" class="block text-gray-300 text-sm font-medium mb-1">Mot de passe</label>
                <input v-model="form.password" type="password" id="password"
                    class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none" />
            </div>

            <button type="submit"
                class="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition-all duration-200 cursor-pointer">
                S'inscrire
            </button>
        </form>
    </div>
</template>



<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
</style>
