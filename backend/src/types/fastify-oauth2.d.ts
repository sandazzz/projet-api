import { FastifyInstance } from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import { OAuth2Token } from "@fastify/oauth2";

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
    githubOAuth2: OAuth2Namespace;
  }
}

declare module "@fastify/oauth2" {
  interface OAuth2Token {
    access_token: string;
  }
}
