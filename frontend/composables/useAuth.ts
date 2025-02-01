export const useAuth = () => {
  const config = useRuntimeConfig();
  const token = useCookie("token"); 

  const login = async (email: string, password: string) => {
    try {
      await $fetch(`${config.public.apiBase}/auth/login`, {
        method: "POST",
        body: { email, password },
        credentials: "include", 
      });

      token.value = "true"; 
      return { success: true, message: "Connexion réussie !" };
    } catch (error) {
      return { success: false, message: "Échec de la connexion." };
    }
  };

  const logout = async () => {
    token.value = null; // Supprime le cookie côté client
  };



  return { token, login, logout };
};
