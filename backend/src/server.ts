// src/server.ts
import Fastify from "fastify";

import { registerCors } from "./plugins/cors";
import { registerCookies } from "./plugins/cookie";
import { registerOAuth } from "./config/oauth";
import userRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";
import adsRoutes from "./modules/ads/ads.routes";
import oauthRoute from "./modules/oauth/oauth.routes";

export function buildServer() {
  const fastify = Fastify({ logger: true });

  // Plugins & middlewares
  registerCors(fastify);
  registerCookies(fastify);
  registerOAuth(fastify);

  // Routes
  fastify.register(userRoutes, { prefix: "/api" });
  fastify.register(authRoutes, { prefix: "/api" });
  fastify.register(adsRoutes, { prefix: "/api" });
  fastify.register(oauthRoute);

  fastify.get("/", async (_, reply) => {
    reply.redirect("http://localhost:3001/");
  });

  return fastify;
}
