import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import {
  getGoogleUserInfo,
  findOrCreateUser,
  getGitHubUserInfo,
} from "./oauth.service";

import { generateJWT } from "../auth/auth.services";

export default async function oauthRoute(fastify: FastifyInstance) {
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
}
