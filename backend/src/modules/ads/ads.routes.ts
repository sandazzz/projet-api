import { FastifyInstance } from "fastify";
import authMiddleware from "src/middleware/auth.middleware";
import { publishAdsHandler } from "./ads.controllers";

export default async function adsRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/ads/publish",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    publishAdsHandler
  );

  fastify.put("/ads/edit/{id}", () => {
    return;
  });

  fastify.delete("/ads/delete/{id}", () => {
    return;
  });

  fastify.get("/ads/list", () => {
    return;
  });

  fastify.get("/ads/details/{id}", () => {
    return;
  });
}
