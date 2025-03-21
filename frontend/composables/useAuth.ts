export const useAuth = () => {
  const config = useRuntimeConfig();

  const login = async (email: string, password: string) => {
    try {
      await $fetch(`${config.public.apiBase}/auth/login`, {
        method: "POST",
        body: { email, password },
        credentials: "include",
      });

      return { success: true, message: "Connexion réussie !" };
    } catch (error) {
      return { success: false, message: "Échec de la connexion." };
    }
  };

  return { login };
};
