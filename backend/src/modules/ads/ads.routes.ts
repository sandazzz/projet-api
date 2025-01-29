import { FastifyInstance } from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCaching from "@fastify/caching";
import authMiddleware from "src/middleware/auth.middleware";
import {
  deleteAdHandler,
  editAdsHandler,
  publishAdsHandler,
  getAdsHandler,
  getAdDetailsHandler,
} from "./ads.controllers";

export default async function adsRoutes(fastify: FastifyInstance) {
  fastify.register(fastifyRateLimit, {
    global: false,
  });

  fastify.register(fastifyCaching, {
    privacy: "public", // ou 'private'
    expiresIn: 60 * 1000, // Cache 60 secondes
  });

  fastify.post(
    "/ads/publish",
    {
      preHandler: [
        authMiddleware.isAuthenticated,
        authMiddleware.isExist,
        fastify.rateLimit({
          max: 10,
          timeWindow: "1 second",
          errorResponseBuilder: (req, context) => ({
            statusCode: 429,
            error: "Too Many Requests",
            message: `You have exceeded the limit of ${context.max} requests per minute.`,
          }),
        }),
      ],
    },
    publishAdsHandler
  );

  fastify.put(
    "/ads/edit/:id",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    editAdsHandler
  );

  fastify.delete(
    "/ads/delete/:id",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    deleteAdHandler
  );

  fastify.get(
    "/ads/list",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    (request, reply) => getAdsHandler(request, reply, fastify)
  );

  fastify.get(
    "/ads/details/:id",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    getAdDetailsHandler
  );
}
