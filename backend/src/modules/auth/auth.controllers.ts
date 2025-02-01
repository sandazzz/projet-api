import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { authenticateUser } from "./auth.services";

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    // Vérification des champs requis
    if (!email || !password) {
      reply.status(400).send({
        error: "Missing required fields: email, password",
      });
      return;
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      reply.status(401).send({ error: "Invalid email or password" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("Missing JWT_SECRET in environment variables.");
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Clé secrète
      { algorithm: "HS256", allowInsecureKeySizes: true, expiresIn: "1h" } // Durée d'expiration
    );

    reply.setCookie("token", token, {
      httpOnly: true, // Empêche l'accès au cookie via JavaScript (protection XSS)
      secure: process.env.NODE_ENV === "production", // Utiliser uniquement HTTPS en production
      sameSite: "strict", // Protection CSRF
      path: "/", // Accessible sur tout le site
      maxAge: 3600, // 1 heure en secondes
    });

    // Réponse avec succès
    reply.status(201).send({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in authRoutes:", error);
    reply.status(500).send({ error: "Something went wrong" });
  }
}
