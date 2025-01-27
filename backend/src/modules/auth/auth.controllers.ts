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

    // Appel à la fonction pour créer l'utilisateur
    const user = await authenticateUser(email, password);

    if (!user) {
      reply.status(401).send({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET || "default_secret", // Clé secrète
      { algorithm: "HS256", allowInsecureKeySizes: true, expiresIn: "1h" } // Durée d'expiration
    );

    // Réponse avec succès
    reply.status(201).send({ token });
  } catch (error) {
    console.error("Error in authRoutes:", error);
    reply.status(500).send({ error: "Something went wrong" });
  }
}
