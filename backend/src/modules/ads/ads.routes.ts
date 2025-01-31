import { FastifyInstance } from "fastify";
import { CustomFastifyRequest } from "src/types/request.type";

import rateLimit, { FastifyRateLimitOptions } from "@fastify/rate-limit";
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
  
  await fastify.register(rateLimit, {
    global: false,
  });

  const rateLimitOptions: FastifyRateLimitOptions = {
    max: 10,
    timeWindow: "1 second",
    errorResponseBuilder: (
      req: CustomFastifyRequest,
      context: {
        max: number;
        timeWindow: string;
      }
    ) => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: `You have exceeded the limit of ${context.max} requests per second.`,
    }),
  };

  fastify.register(fastifyCaching, {
    privacy: "public",
    expiresIn: 60 * 1000,
  });

  fastify.post(
    "/ads/publish",
    {
      preHandler: [
        authMiddleware.isAuthenticated,
        authMiddleware.isExist,
        fastify.rateLimit(rateLimitOptions),
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
