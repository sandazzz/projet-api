<!-- components/LoginModal.vue -->
<script setup lang="ts">
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{
    (event: 'close'): void
}>()


const router = useRouter()
const { login } = useAuth()

const form = reactive({
    email: '',
    password: '',
})

const messages = reactive({
    error: '',
    success: '',
})

const showSuccessMessage = ref(false)

const loginUser = async () => {
    messages.error = ''
    messages.success = ''
    showSuccessMessage.value = false

    if (!form.email || !form.password) {
        messages.error = 'Tous les champs sont obligatoires.'
        return
    }

    const result = await login(form.email, form.password)

    if (result.success) {
        messages.success = result.message
        showSuccessMessage.value = true
        setTimeout(() => {
            emit('close')  // Ferme la modale
            router.push('/')  // Redirige vers l'accueil
        }, 2000)
    } else {
        messages.error = result.message
    }
}

// OAuth Login (Fastify)
const loginWithGoogle = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'
}

const loginWithGitHub = () => {
    window.location.href = 'http://localhost:3000/api/auth/github'
}

// Gérer Escape
const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        emit('close')
    }
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onUnmounted(() => window.removeEventListener('keydown', handleEscape))

watch(() => props.show, (val) => {
    if (!val) {
        // Reset formulaire et messages à la fermeture
        form.email = ''
        form.password = ''
        messages.error = ''
        messages.success = ''
        showSuccessMessage.value = false
    }
})
</script>

<template>
    <div v-if="show"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
        <form @submit.prevent="loginUser"
            class="w-full max-w-md bg-gray-800/90 backdrop-blur-lg p-6 rounded-lg border border-gray-700 shadow-xl relative animate-fade-in">

            <!-- Bouton fermeture -->
            <button @click="emit('close')"
                class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">&times;</button>

            <h2 class="text-xl font-semibold text-white mb-4 text-center">Connexion</h2>

            <div v-if="messages.error" class="mb-4 text-red-400 text-sm text-center">
                {{ messages.error }}
            </div>

            <div class="mb-4">
                <label for="email" class="block text-gray-300 text-sm font-medium mb-1">Email</label>
                <input v-model="form.email" type="email" id="email"
                    class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none" />
            </div>

            <div class="mb-5">
                <label for="password" class="block text-gray-300 text-sm font-medium mb-1">Mot de passe</label>
                <input v-model="form.password" type="password" id="password"
                    class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none" />
            </div>

            <button type="submit"
                class="w-full bg-green-500 text-white font-medium py-2 rounded-md hover:bg-green-600 transition-all duration-200 cursor-pointer">
                Se connecter
            </button>

            <div v-if="showSuccessMessage" class="mt-3 text-center text-green-400 font-medium">
                Connexion réussie !
            </div>

            <div class="mt-5">
                <p class="text-center text-gray-400 text-sm mb-3">Ou connectez-vous avec :</p>

                <button @click="loginWithGoogle"
                    class="w-full bg-red-500 text-white font-medium py-2 rounded-md hover:bg-red-600 transition-all duration-200 cursor-pointer mb-3">
                    Continuer avec Google
                </button>

                <button @click="loginWithGitHub"
                    class="w-full bg-gray-700 text-white font-medium py-2 rounded-md hover:bg-gray-600 transition-all duration-200 cursor-pointer">
                    Continuer avec GitHub
                </button>
            </div>
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
