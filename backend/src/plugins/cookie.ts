import fastifyCookie from "@fastify/cookie";
import { FastifyInstance } from "fastify";
import { env } from "../config/env";

export async function registerCookies(fastify: FastifyInstance) {
  await fastify.register(fastifyCookie, {
    secret: env.cookieSecret,
    parseOptions: {
      httpOnly: true,
      secure: env.isProd,
      sameSite: "strict",
      path: "/",
    },
  });
}
