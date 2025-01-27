import { FastifyReply } from "fastify";
import { CustomFastifyRequest } from "src/types/request.type";
import { createNewAd } from "./ads.services";

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
