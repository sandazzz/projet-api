// src/index.ts
import { buildServer } from "./server";

const fastify = buildServer();

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
