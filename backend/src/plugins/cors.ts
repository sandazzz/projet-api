import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function registerCors(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });
}