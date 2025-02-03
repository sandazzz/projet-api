// Import the framework and instantiate it
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyOauth2 from "@fastify/oauth2";

import userRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";
import adsRoutes from "./modules/ads/ads.routes";
import {
  getGoogleUserInfo,
  findOrCreateUser,
  generateJWT,
  getGitHubUserInfo,
} from "./modules/auth/auth.services";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials in environment variables.");
}
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GitHub OAuth credentials in environment variables.");
}
if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || "default_cookie_secret", // Sécurisation des cookies (facultatif)
  parseOptions: {
    httpOnly: true, // Empêche l'accès via JavaScript
    secure: process.env.NODE_ENV === "production", // Utiliser uniquement HTTPS en production
    sameSite: "strict", // Protection CSRF
    path: "/", // Accessible partout sur le site
  },
});

// 🔹 Enregistrement OAuth2 Google
fastify.register(fastifyOauth2, {
  name: "googleOAuth2",
  scope: ["profile", "email"],
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
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
      id: process.env.GITHUB_CLIENT_ID,
      secret: process.env.GITHUB_CLIENT_SECRET,
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

fastify.register(userRoutes, { prefix: "/api" });
fastify.register(authRoutes, { prefix: "/api" });
fastify.register(adsRoutes, { prefix: "/api" });

fastify.get("/", (request: FastifyRequest, reply: FastifyReply) => {
  reply.redirect("http://localhost:3001/");
});

// 🔹 Callback Google OAuth
fastify.get(
  "/api/auth/google/callback",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tokenResponse =
        await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      console.log("🔍 Google Token Response:", tokenResponse);

      const accessToken = tokenResponse.token?.access_token;
      if (!accessToken) {
        throw new Error("Google OAuth token retrieval failed.");
      }

      const userInfo = await getGoogleUserInfo(accessToken);
      console.log("🔍 Google User Info:", userInfo);

      if (!userInfo || !userInfo.email) {
        throw new Error(
          "Google OAuth did not return valid user info (missing email)."
        );
      }

      const user = await findOrCreateUser(userInfo);
      const jwtToken = generateJWT(user.id, user.email);

      return reply
        .setCookie("token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 3600,
        })
        .redirect("http://localhost:3001/");
    } catch (error) {
      console.error("🚨 Google OAuth error:", error);
      return reply
        .status(500)
        .send({ error: "Authentication failed. Please try again later." });
    }
  }
);

// 🔹 Callback GitHub OAuth
fastify.get(
  "/api/auth/github/callback",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 🔍 Étape 1 : Récupérer le token d'accès depuis GitHub
      const tokenResponse =
        await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      console.log("🔍 GitHub Token Response:", tokenResponse);

      // 🔧 Vérification corrigée pour le token d'accès
      const accessToken = tokenResponse.token?.access_token;

      if (!accessToken) {
        throw new Error(
          "GitHub OAuth token retrieval failed. No access token received."
        );
      }

      // 🔍 Étape 2 : Récupérer les informations utilisateur depuis GitHub
      const userInfo = await getGitHubUserInfo(accessToken);
      console.log("🔍 GitHub User Info:", userInfo);

      if (!userInfo || !userInfo.email) {
        throw new Error(
          "GitHub OAuth did not return valid user info (missing email)."
        );
      }

      // 🔍 Étape 3 : Trouver ou créer l'utilisateur en base de données
      const user = await findOrCreateUser(userInfo);

      // 🔍 Étape 4 : Générer un token JWT pour l'utilisateur
      const jwtToken = generateJWT(user.id, user.email);

      // 🔍 Étape 5 : Retourner une réponse avec un cookie contenant le JWT
      return reply
        .setCookie("token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Utiliser HTTPS en production
          sameSite: "strict", // Protection CSRF
          path: "/",
          maxAge: 3600, // Durée de validité : 1 heure
        })
        .redirect("http://localhost:3001/"); // Redirection vers le frontend
    } catch (error) {
      // Gestion des erreurs et affichage des logs
      console.error("🚨 GitHub OAuth error:", error);
      return reply
        .status(500)
        .send({ error: "Authentication failed. Please try again later." });
    }
  }
);

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
