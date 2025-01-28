import { FastifyInstance } from "fastify";
import authMiddleware from "src/middleware/auth.middleware";
import { deleteAdHandler, editAdsHandler, publishAdsHandler } from "./ads.controllers";
import prisma from "@lib/prisma";

export default async function adsRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/ads/publish",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
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
    async (request, reply) => {
      try {
        const ads = await prisma.ad.findMany({
          select: {
            id: true,
            title: true,
            description: true,
          },
        });
        return reply.status(200).send(ads);
      } catch (error) {
        console.error("Error fetching ads:", error);
        return reply.status(500).send({ error: "An error occurred while fetching ads" });
      }
    });

  fastify.get("/ads/details/:id",
    { preHandler: [authMiddleware.isAuthenticated, authMiddleware.isExist] },
    async (request, reply) => {
      try {
        const adId = Number((request.params as { id: string }).id);

        const ad = await prisma.ad.findUnique({
          where: { id: adId },
        });

        if (!ad) {
          return reply.status(404).send({ error: "Ad not found" });
        }

        return reply.status(200).send(ad);
      } catch (error) {
        console.error("Error fetching ad details:", error);
        return reply.status(500).send({ error: "An error occurred while fetching ad details" });
      }
    });
}
