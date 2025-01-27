import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { createNewUsers } from "./users.services";

export async function registerUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { firstName, lastName, email, password } = request.body as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };

    // Vérification des champs requis
    if (!firstName || !lastName || !email || !password) {
      reply.status(400).send({
        error: "Missing required fields: firstName, lastName, email, password",
      });
      return;
    }

    // Hachage du mot de passe
    const hashedPassword = bcrypt.hashSync(password);

    const userData: Prisma.UserCreateInput = {
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
    };

    // Appel à la fonction pour créer l'utilisateur
    const newUser = await createNewUsers(userData);

    // Réponse avec succès
    reply.status(201).send(newUser);
  } catch (error) {
    console.error("Error in registerUsersHandler:", error);
    reply.status(500).send({ error: "Something went wrong" });
  }
}
