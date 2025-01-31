import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyOauth2 from "@fastify/oauth2";

import { loginHandler } from "./auth.controllers";
import {
  fetchGoogleUserInfo,
  fetchGitHubUserInfo,
  findOrCreateUser,
  generateJWT,
} from "./auth.utils";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.register(fastifyOauth2, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID!,
        secret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/auth/google",
    callbackUri: `${process.env.BASE_URL}/auth/google/callback`,
  });

  fastify.register(fastifyOauth2, {
    name: "githubOAuth2",
    scope: ["user:email"],
    credentials: {
      client: {
        id: process.env.GITHUB_CLIENT_ID!,
        secret: process.env.GITHUB_CLIENT_SECRET!,
      },
      auth: {
        authorizeHost: "https://github.com",
        authorizePath: "/login/oauth/authorize",
        tokenHost: "https://github.com",
        tokenPath: "/login/oauth/access_token",
      },
    },
    startRedirectPath: "/auth/github",
    callbackUri: `${process.env.BASE_URL}/auth/github/callback`,
  });

  fastify.post("/auth/login", loginHandler);
  // 🔹 Callback Google
  fastify.get(
    "/auth/google/callback",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tokenResponse =
          await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
            request
          );
        const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);

        const user = await findOrCreateUser(userInfo);

        const jwtToken = generateJWT(user.id, user.email);
        return reply
          .status(200)
          .send({ message: "Login successful", token: jwtToken });
      } catch (error) {
        console.error("Google OAuth error:", error);
        return reply.status(500).send({ error: "Authentication failed" });
      }
    }
  );
  // 🔹 Callback GitHub
  fastify.get(
    "/auth/github/callback",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tokenResponse =
          await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(
            request
          );
        const userInfo = await fetchGitHubUserInfo(tokenResponse.access_token);

        const user = await findOrCreateUser(userInfo);

        const jwtToken = generateJWT(user.id, user.email);
        return reply
          .status(200)
          .send({ message: "Login successful", token: jwtToken });
      } catch (error) {
        console.error("GitHub OAuth error:", error);
        return reply.status(500).send({ error: "Authentication failed" });
      }
    }
  );
}
