import { FastifyInstance } from "fastify";
import authMiddleware from "src/middleware/auth.middleware";
import { deleteAdHandler, editAdsHandler, publishAdsHandler, getAdsHandler, getAdDetailsHandler } from "./ads.controllers";
import fastifyRateLimit from "@fastify/rate-limit";

export default async function adsRoutes(fastify: FastifyInstance) {

  fastify.register(fastifyRateLimit, {
    global: false
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
      ]
    },
    publishAdsHandler
  );

  fastify.put("/ads/edit/:id",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    editAdsHandler
  );

  fastify.delete("/ads/delete/:id",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    deleteAdHandler
  );

  fastify.get("/ads/list",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    getAdsHandler(fastify));

  fastify.get("/ads/details/:id",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    getAdDetailsHandler
  )
}
