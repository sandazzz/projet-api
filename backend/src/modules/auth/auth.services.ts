import prisma from "@lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  // Recherche de l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Si l'utilisateur n'existe pas ou que le mot de passe est incorrect
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return null; // Authentification échouée
  }

  return user; // Authentification réussie
}

// 🔹 Fonction pour générer un JWT
export function generateJWT(userId: number, email: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables.");
  }
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
}

