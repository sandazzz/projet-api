import fastifyOauth2 from "@fastify/oauth2";
import { FastifyInstance } from "fastify";
import { env } from "./env";

export function registerOAuth(fastify: FastifyInstance) {
  
  // 🔹 Enregistrement OAuth2 Google
  fastify.register(fastifyOauth2, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: env.googleClientId,
        secret: env.googleClientSecret,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/api/auth/google",
    callbackUri: "http://localhost:3000/api/auth/google/callback",
  });

  // 🔹 Enregistrement OAuth2 GitHub
  fastify.register(fastifyOauth2, {
    name: "githubOAuth2",
    scope: ["user:email"],
    credentials: {
      client: {
        id: env.githubClientId,
        secret: env.githubClientSecret,
      },
      auth: {
        authorizeHost: "https://github.com",
        authorizePath: "/login/oauth/authorize",
        tokenHost: "https://github.com",
        tokenPath: "/login/oauth/access_token",
      },
    },
    startRedirectPath: "/api/auth/github", // Route de démarrage OAuth2 GitHub
    callbackUri: "http://localhost:3000/api/auth/github/callback", // Callback après autorisation
  });
}
