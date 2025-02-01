import { FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@lib/prisma";
import { CustomFastifyRequest } from "src/types/custom-fastify-request";

export function isAuthenticated(
  request: CustomFastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    // Récupérer le token depuis les cookies
    const token = request.cookies.token;

    if (!token) {
      return reply.status(403).send({ message: "No token provided!" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log("Decoded token:", decoded);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    request.userId = decoded.id;
    done();
  } catch (error) {
    reply.status(401).send({ error: "Unauthorized" });
  }
}

export async function isExist(
  request: CustomFastifyRequest,
  reply: FastifyReply
) {
  const id = Number(request.userId);
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  console.log("User found:", user);

  if (!user) {
    reply.status(403).send({ message: "User not found" });
    return;
  }
}

const authMiddleware = {
  isAuthenticated,
  isExist,
};

export default authMiddleware;
