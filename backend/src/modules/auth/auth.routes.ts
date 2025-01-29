import { FastifyInstance } from "fastify";
import { loginHandler } from "./auth.controllers";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/login", loginHandler);

  fastify.post("/auth/github", () => {
    return;
  });

  fastify.post("/auth/google", () => {
    return;
  });
}
