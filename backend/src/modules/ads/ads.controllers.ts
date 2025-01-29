import { FastifyInstance, FastifyReply } from "fastify";
import { CustomFastifyRequest } from "src/types/request.type";
import { createNewAd, deleteAd, isAdExist, updateAd } from "./ads.services";
import prisma from "@lib/prisma";

export async function publishAdsHandler(
  request: CustomFastifyRequest,
  reply: FastifyReply
) {
  try {
    const { title, description, image } = request.body as {
      title: string;
      description: string;
      image: string;
    };

    if (!title || !description || !image) {
      reply.status(400).send({
        error: "Missing required fields: title, description, image",
      });
      return;
    }

    const id = Number(request.userId);

    const newAd = await createNewAd(id, title, description, image);

    reply.status(201).send(newAd);
  } catch (error) {
    reply.status(500).send({ error: "Something went wrong" });
  }
}

export async function editAdsHandler(
  request: CustomFastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = Number(request.userId);

    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized user" });
    }

    const { adId, title, description, imageUrl } = request.body as {
      adId: number;
      title: string;
      description: string;
      imageUrl: string;
    };

    if (!adId || !title || !description) {
      return reply.status(400).send({
        error:
          "Missing required fields: adId, title, and description are required",
      });
    }

    const ad = await isAdExist(adId);

    if (!ad) {
      return reply.status(404).send({ error: "Ad not found" });
    }

    if (ad.userId !== userId) {
      return reply.status(403).send({
        error: "You are not authorized to edit this ad",
      });
    }

    const updatedAd = await updateAd({
      id: adId,
      title,
      description,
      imageUrl,
    });

    return reply.status(200).send({
      message: "Ad updated successfully",
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error updating ad:", error);
    return reply.status(500).send({
      error: "An error occurred while updating the ad",
    });
  }
}

export async function deleteAdHandler(
  request: CustomFastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = Number(request.userId);
    const adId = Number((request.params as { id: string }).id);

    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized user" });
    }

    // Vérifier si l'annonce existe et appartient à l'utilisateur
    const ad = await isAdExist(adId);

    if (!ad) {
      return reply.status(404).send({ error: "Ad not found" });
    }

    if (ad.userId !== userId) {
      return reply.status(403).send({
        error: "You are not authorized to delete this ad",
      });
    }

    // Supprimer l'annonce
    await deleteAd(adId);

    return reply.status(200).send({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return reply.status(500).send({
      error: "An error occurred while deleting the ad",
    });
  }
}

export async function getAdsHandler(
  request: CustomFastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const ads = await prisma.ad.findMany({
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    await fastify.cache.set("ads-list", ads, 60 * 1000); // 60 secondes

    return reply.status(200).send(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    return reply
      .status(500)
      .send({ error: "An error occurred while fetching ads" });
  }
}

export async function getAdDetailsHandler(
  request: CustomFastifyRequest,
  reply: FastifyReply
) {
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
    return reply
      .status(500)
      .send({ error: "An error occurred while fetching ad details" });
  }
}
